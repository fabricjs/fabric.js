import { Point } from '../../Point';
import type { AssertKeys, TCornerPoint, TDegree } from '../../typedefs';
import { FabricObject } from './Object';
import type { Control } from '../../controls/Control';
import { ObjectEvents, TPointerEvent } from '../../EventTypeDefs';
import type { Canvas } from '../../canvas/Canvas';
import type { ControlRenderingStyleOverride } from '../../controls/controlRendering';
import { mapValues } from '../../util/internals';
import {
  TFabricObjectProps,
  SerializedObjectProps,
  FabricObjectProps,
} from './types';
import { createObjectDefaultControls } from '../../controls/commonControls';
import { BBox } from '../../BBox/BBox';
import { PlaneBBox } from '../../BBox/PlaneBBox';

type TControlCoord = {
  position: Point;
  corner: TCornerPoint;
  touchCorner: TCornerPoint;
};

type TControlSet = Record<string, Control>;

type TBorderRenderingStyleOverride = Partial<
  Pick<InteractiveFabricObject, 'borderColor' | 'borderDashArray'>
>;

type TStyleOverride = ControlRenderingStyleOverride &
  TBorderRenderingStyleOverride &
  Partial<
    Pick<InteractiveFabricObject, 'hasBorders' | 'hasControls'> & {
      forActiveSelection: boolean;
    }
  >;

export interface DragMethods {
  shouldStartDragging(): boolean;
  onDragStart(e: DragEvent): boolean;
}

export type FabricObjectWithDragSupport = InteractiveFabricObject & DragMethods;

const interactiveDefaults = {};

export class InteractiveFabricObject<
    Props extends TFabricObjectProps = Partial<FabricObjectProps>,
    SProps extends SerializedObjectProps = SerializedObjectProps,
    EventSpec extends ObjectEvents = ObjectEvents
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements FabricObjectProps
{
  declare noScaleCache: boolean;
  declare centeredScaling: boolean;

  declare snapAngle?: TDegree;
  declare snapThreshold?: TDegree;
  declare centeredRotation: boolean;

  declare lockMovementX: boolean;
  declare lockMovementY: boolean;
  declare lockRotation: boolean;
  declare lockScalingX: boolean;
  declare lockScalingY: boolean;
  declare lockSkewingX: boolean;
  declare lockSkewingY: boolean;
  declare lockScalingFlip: boolean;

  declare cornerSize: number;
  declare touchCornerSize: number;
  declare transparentCorners: boolean;
  declare cornerColor: string;
  declare cornerStrokeColor: string;
  declare cornerStyle: 'rect' | 'circle';
  declare cornerDashArray: number[] | null;
  declare hasControls: boolean;

  declare borderColor: string;
  declare borderDashArray: number[] | null;
  declare borderOpacityWhenMoving: number;
  declare borderScaleFactor: number;
  declare hasBorders: boolean;
  declare selectionBackgroundColor: string;

  declare selectable: boolean;
  declare evented: boolean;
  declare perPixelTargetFind: boolean;
  declare activeOn: 'down' | 'up';

  declare hoverCursor: CSSStyleDeclaration['cursor'] | null;
  declare moveCursor: CSSStyleDeclaration['cursor'] | null;

  /**
   * Describe object's corner position in canvas element coordinates.
   * properties are depending on control keys and padding the main controls.
   * each property is an object with x, y and corner.
   * The `corner` property contains in a similar manner the 4 points of the
   * interactive area of the corner.
   * The coordinates depends from the controls positionHandler and are used
   * to draw and locate controls
   */
  declare controlCoords: Record<string, TControlCoord>;

  /**
   * keeps the value of the last hovered corner during mouse move.
   * 0 is no corner, or 'mt', 'ml', 'mtr' etc..
   * It should be private, but there is no harm in using it as
   * a read-only property.
   * this isn't cleaned automatically. Non selected objects may have wrong values
   * @type [string]
   */
  declare __corner?: string;

  /**
   * a map of control visibility for this object.
   * this was left when controls were introduced to not break the api too much
   * this takes priority over the generic control visibility
   */
  declare _controlsVisibility: Record<string, boolean>;

  /**
   * holds the controls for the object.
   * controls are added by default_controls.js
   */
  declare controls: TControlSet;

  /**
   * internal boolean to signal the code that the object is
   * part of the move action.
   */
  declare isMoving?: boolean;

  /**
   * A boolean used from the gesture module to keep tracking of a scaling
   * action when there is no scaling transform in place.
   * This is an edge case and is used twice in all codebase.
   * Probably added to keep track of some performance issues
   * @TODO use git blame to investigate why it was added
   * DON'T USE IT. WE WILL TRY TO REMOVE IT
   */
  declare _scaling?: boolean;

  declare canvas?: Canvas;

  static ownDefaults: Record<string, any> = interactiveDefaults;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      controls: createObjectDefaultControls(),
      ...InteractiveFabricObject.ownDefaults,
    };
  }

  /**
   * Update width and height of the canvas for cache
   * returns true or false if canvas needed resize.
   * @private
   * @return {Boolean} true if the canvas has been resized
   */
  _updateCacheCanvas() {
    const targetCanvas = this.canvas;
    if (this.noScaleCache && targetCanvas && targetCanvas._currentTransform) {
      const target = targetCanvas._currentTransform.target,
        action = targetCanvas._currentTransform.action;
      if (this === (target as unknown as this) && action.startsWith('scale')) {
        return false;
      }
    }
    return super._updateCacheCanvas();
  }

  /**
   * Determines which corner is under the mouse cursor, represented by `pointer`.
   * This function is return a corner only if the object is the active one.
   * This is done to avoid selecting corner of non active object and activating transformations
   * rather than drag action. The default behavior of fabricJS is that if you want to transform
   * an object, first you select it to show the control set
   * @private
   * @param {Object} pointer The pointer indicating the mouse position
   * @param {boolean} forTouch indicates if we are looking for interaction area with a touch action
   * @return {String} corner code (tl, tr, bl, br, etc.), or an empty string if nothing is found.
   */
  _findTargetCorner(pointer: Point, forTouch = false): string {
    if (
      !this.hasControls ||
      !this.canvas ||
      (this.canvas._activeObject as unknown as this) !== this
    ) {
      return '';
    }

    this.__corner = undefined;
    // had to keep the reverse loop because was breaking tests
    const cornerEntries = Object.entries(this.controlCoords);
    for (let i = cornerEntries.length - 1; i >= 0; i--) {
      const [key, coord] = cornerEntries[i];
      if (!this.isControlVisible(key)) {
        continue;
      }
      if (
        PlaneBBox.build(
          forTouch ? coord.touchCorner : coord.corner
        ).containsPoint(pointer)
      ) {
        this.__corner = key;
        return key;
      }
    }
    return '';
  }

  /**
   * Calculates the coordinates of the center of each control plus the corners of the control itself
   * This basically just delegates to each control positionHandler
   * WARNING: changing what is passed to positionHandler is a breaking change, since position handler
   * is a public api and should be done just if extremely necessary
   * @return {Record<string, TControlCoord>}
   */
  protected calcControlCoords(): Record<string, TControlCoord> {
    const legacyBBox = BBox.legacy(this);
    const coords = mapValues(this.controls, (control, key) => {
      const position = control.positionHandler(
        legacyBBox.getDimensionsVector(),
        legacyBBox.getTransformation(),
        this,
        control[key]
      );
      return {
        position,
        // Sets the coordinates that determine the interaction area of each control
        // note: if we would switch to ROUND corner area, all of this would disappear.
        // everything would resolve to a single point and a pythagorean theorem for the distance
        // @todo evaluate simplification of code switching to circle interaction area at runtime
        corner: control.calcCornerCoords(
          legacyBBox.angle,
          this.cornerSize,
          position.x,
          position.y,
          false
        ),
        touchCorner: control.calcCornerCoords(
          legacyBBox.angle,
          this.touchCornerSize,
          position.x,
          position.y,
          true
        ),
      };
    });

    // // debug code
    // setTimeout(() => {
    //   const canvas = this.canvas;
    //   if (!canvas) return;
    //   const ctx = canvas.contextTop;
    //   // canvas.clearContext(ctx);
    //   ctx.fillStyle = 'cyan';
    //   Object.keys(coords).forEach((key) => {
    //     Object.keys(coords[key].corner).forEach((k) => {
    //       const control = coords[key].corner[k];
    //       ctx.beginPath();
    //       ctx.ellipse(control.x, control.y, 3, 3, 0, 0, 360);
    //       ctx.closePath();
    //       ctx.fill();
    //     });
    //   });
    // }, 50);

    return coords;
  }

  /**
   * Sets corner and controls position coordinates based on current angle, dimensions and position.
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
   * @return {void}
   */
  setCoords(): void {
    super.setCoords();
    this.controlCoords = this.calcControlCoords();
  }

  /**
   * Calls a function for each control. The function gets called,
   * with the control, the control's key and the object that is calling the iterator
   * @param {Function} fn function to iterate over the controls over
   */
  forEachControl<R>(
    fn: (
      control: Control,
      key: string,
      fabricObject: InteractiveFabricObject
    ) => R
  ) {
    return mapValues(this.controls, (value, key) => fn(value, key, this));
  }

  /**
   * Draws a colored layer behind the object, inside its selection borders.
   * Requires public options: padding, selectionBackgroundColor
   * this function is called when the context is transformed
   * has checks to be skipped when the object is on a staticCanvas
   * @todo evaluate if make this disappear in favor of a pre-render hook for objects
   * this was added by Andrea Bogazzi to make possible some feature for work reasons
   * it seemed a good option, now is an edge case
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   */
  drawSelectionBackground(ctx: CanvasRenderingContext2D): void {
    if (
      !this.selectionBackgroundColor ||
      (this.canvas && !this.canvas.interactive) ||
      (this.canvas && (this.canvas._activeObject as unknown as this) !== this)
    ) {
      return;
    }
    ctx.save();
    this.bbox.sendToCanvas().transform(ctx);
    ctx.fillStyle = this.selectionBackgroundColor;
    ctx.fillRect(-0.5, -0.5, 1, 1);
    ctx.restore();
  }

  /**
   * @public override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.
   * @param {CanvasRenderingContext2D} ctx ctx is not transformed, only retina scaled
   * @param {Point} size the control box size used
   */
  strokeBorders(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    this.bbox.transform(ctx);
    ctx.beginPath();
    ctx.moveTo(-0.5, -0.5);
    ctx.lineTo(0.5, -0.5);
    ctx.lineTo(0.5, 0.5);
    ctx.lineTo(-0.5, 0.5);
    ctx.closePath();
    ctx.restore();
    ctx.stroke();
  }

  /**
   * @public override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.
   * @param {CanvasRenderingContext2D} ctx ctx is rotated and translated so that (0,0) is at object's center
   * @param {Point} size the control box size used
   */
  strokeBordersLegacy(ctx: CanvasRenderingContext2D, size: Point) {
    // ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y);
  }

  /**
   * Draws borders of an object's bounding box.
   * Requires public properties: width, height
   * Requires public options: padding, borderColor
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {object} options object representing current object parameters
   * @param {TStyleOverride} [styleOverride] object to override the object style
   */
  drawBorders(
    ctx: CanvasRenderingContext2D,
    styleOverride: TStyleOverride
  ): void {
    const { borderColor, borderDashArray } = {
      borderColor: this.borderColor,
      borderDashArray: this.borderDashArray,
      ...styleOverride,
    };
    ctx.save();
    ctx.strokeStyle = borderColor;
    this._setLineDash(ctx, borderDashArray);
    ctx.lineWidth = this.borderScaleFactor;
    // TODO: remove legacy?
    ctx.save();
    const legacy = BBox.legacy(this);
    legacy.transform(ctx);
    this.strokeBordersLegacy(ctx, legacy.getDimensionsVector());
    ctx.restore();
    this.strokeBorders(ctx);
    ctx.restore();
  }

  /**
   * Renders controls and borders for the object
   * the context here is not transformed
   * @todo move to interactivity
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {TStyleOverride} [styleOverride] properties to override the object style
   */
  _renderControls(
    ctx: CanvasRenderingContext2D,
    styleOverride: TStyleOverride = {}
  ) {
    const { hasBorders, hasControls } = this;
    const { hasBorders: shouldDrawBorders, hasControls: shouldDrawControls } = {
      hasBorders,
      hasControls,
      ...styleOverride,
    };
    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    shouldDrawBorders && this.drawBorders(ctx, styleOverride);
    shouldDrawControls && this.drawControls(ctx, styleOverride);
    ctx.restore();
  }

  /**
   * Draws lines from a borders of an object's bounding box to controls that have `withConnection` property set.
   * Requires public properties: width, height
   * Requires public options: padding, borderColor
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {Point} size object size x = width, y = height
   */
  drawControlsConnectingLines(
    ctx: CanvasRenderingContext2D,
    size: Point
  ): void {
    let shouldStroke = false;

    ctx.beginPath();
    this.forEachControl((control, key) => {
      // in this moment, the ctx is centered on the object.
      // width and height of the above function are the size of the bbox.
      if (control.withConnection && control.getVisibility(this, key)) {
        // reset movement for each control
        shouldStroke = true;
        ctx.moveTo(control.x * size.x, control.y * size.y);
        ctx.lineTo(
          control.x * size.x + control.offsetX,
          control.y * size.y + control.offsetY
        );
      }
    });
    shouldStroke && ctx.stroke();
  }

  /**
   * Draws corners of an object's bounding box.
   * Requires public properties: width, height
   * Requires public options: cornerSize, padding
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {ControlRenderingStyleOverride} styleOverride object to override the object style
   */
  drawControls(
    ctx: CanvasRenderingContext2D,
    styleOverride: ControlRenderingStyleOverride = {}
  ) {
    ctx.save();
    const retinaScaling = this.getCanvasRetinaScaling();
    const { cornerStrokeColor, cornerDashArray, cornerColor } = this;
    const options = {
      cornerStrokeColor,
      cornerDashArray,
      cornerColor,
      ...styleOverride,
    };
    ctx.setTransform(retinaScaling, 0, 0, retinaScaling, 0, 0);
    ctx.strokeStyle = ctx.fillStyle = options.cornerColor;
    if (!this.transparentCorners) {
      ctx.strokeStyle = options.cornerStrokeColor;
    }
    this._setLineDash(ctx, options.cornerDashArray);
    this.setCoords();
    this.forEachControl((control, key) => {
      if (control.getVisibility(this, key)) {
        const { position } = this.controlCoords[key];
        control.render(ctx, position.x, position.y, options, this);
      }
    });
    ctx.restore();
  }

  /**
   * Returns true if the specified control is visible, false otherwise.
   * @param {string} controlKey The key of the control. Possible values are usually 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr',
   * but since the control api allow for any control name, can be any string.
   * @returns {boolean} true if the specified control is visible, false otherwise
   */
  isControlVisible(controlKey: string): boolean {
    return (
      this.controls[controlKey] &&
      this.controls[controlKey].getVisibility(this, controlKey)
    );
  }

  /**
   * Sets the visibility of the specified control.
   * please do not use.
   * @param {String} controlKey The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
   * but since the control api allow for any control name, can be any string.
   * @param {Boolean} visible true to set the specified control visible, false otherwise
   * @todo discuss this overlap of priority here with the team. Andrea Bogazzi for details
   */
  setControlVisible(controlKey: string, visible: boolean) {
    if (!this._controlsVisibility) {
      this._controlsVisibility = {};
    }
    this._controlsVisibility[controlKey] = visible;
  }

  /**
   * Sets the visibility state of object controls, this is just a bulk option for setControlVisible;
   * @param {Record<string, boolean>} [options] with an optional key per control
   * example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
   */
  setControlsVisibility(options: Record<string, boolean> = {}) {
    Object.entries(options).forEach(([controlKey, visibility]) =>
      this.setControlVisible(controlKey, visibility)
    );
  }

  /**
   * Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
   * that is in the canvas.contextContainer.
   * This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
   * Example: blinking cursor text selection, drag effects.
   * @todo discuss swapping restoreManually with a renderCallback, but think of async issues
   * @param {Boolean} [restoreManually] When true won't restore the context after clear, in order to draw something else.
   * @return {CanvasRenderingContext2D|undefined} canvas.contextTop that is either still transformed
   * with the object transformMatrix, or restored to neutral transform
   */
  clearContextTop(
    restoreManually?: boolean
  ): CanvasRenderingContext2D | undefined {
    if (!this.canvas) {
      return;
    }
    const ctx = this.canvas.contextTop;
    if (!ctx) {
      return;
    }
    const v = this.canvas.viewportTransform;
    ctx.save();
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    this.transform(ctx);
    // we add 4 pixel, to be sure to do not leave any pixel out
    const width = this.width + 4,
      height = this.height + 4;
    ctx.clearRect(-width / 2, -height / 2, width, height);

    restoreManually || ctx.restore();
    return ctx;
  }

  /**
   * This callback function is called every time _discardActiveObject or _setActiveObject
   * try to to deselect this object. If the function returns true, the process is cancelled
   * @param {Object} [options] options sent from the upper functions
   * @param {TPointerEvent} [options.e] event if the process is generated by an event
   * @param {FabricObject} [options.object] next object we are setting as active, and reason why
   * this is being deselected

   */
  onDeselect(options?: { e?: TPointerEvent; object?: FabricObject }): boolean {
    // implemented by sub-classes, as needed.
    return false;
  }

  /**
   * This callback function is called every time _discardActiveObject or _setActiveObject
   * try to to select this object. If the function returns true, the process is cancelled
   * @param {Object} [options] options sent from the upper functions
   * @param {Event} [options.e] event if the process is generated by an event
   */
  onSelect(options?: { e?: TPointerEvent }): boolean {
    // implemented by sub-classes, as needed.
    return false;
  }

  /**
   * Override to customize drag and drop behavior
   * return true if the object currently dragged can be dropped on the target
   * @public
   * @param {DragEvent} e
   * @returns {boolean}
   */
  canDrop(e: DragEvent): boolean {
    return false;
  }

  /**
   * Override to customize drag and drop behavior
   * render a specific effect when an object is the source of a drag event
   * example: render the selection status for the part of text that is being dragged from a text object
   * @public
   * @param {DragEvent} e
   * @returns {boolean}
   */
  renderDragSourceEffect(this: AssertKeys<this, 'canvas'>, e: DragEvent) {
    // for subclasses
  }

  /**
   * Override to customize drag and drop behavior
   * render a specific effect when an object is the target of a drag event
   * used to show that the underly object can receive a drop, or to show how the
   * object will change when dropping. example: show the cursor where the text is about to be dropped
   * @public
   * @param {DragEvent} e
   * @returns {boolean}
   */
  renderDropTargetEffect(this: AssertKeys<this, 'canvas'>, e: DragEvent) {
    // for subclasses
  }
}
