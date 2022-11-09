import { IPoint, Point } from '../point.class';
import type { TCornerPoint, TDegree, TMat2D } from '../typedefs';
import { FabricObject } from '../shapes/object.class';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import {
  calcRotateMatrix,
  multiplyTransformMatrices,
  qrDecompose,
  TQrDecomposeOut,
} from '../util/misc/matrix';
import { ObjectGeometry } from './object_geometry.mixin';
import type { Control } from '../controls/control.class';
import { sizeAfterTransform } from '../util/misc/objectTransforms';

type TOCoord = IPoint & {
  corner: TCornerPoint;
  touchCorner: TCornerPoint;
};

type TControlSet = Record<string, Control>;

export class InteractiveFabricObject extends FabricObject {
  /**
   * Describe object's corner position in canvas element coordinates.
   * properties are depending on control keys and padding the main controls.
   * each property is an object with x, y and corner.
   * The `corner` property contains in a similar manner the 4 points of the
   * interactive area of the corner.
   * The coordinates depends from the controls positionHandler and are used
   * to draw and locate controls
   * @memberOf fabric.Object.prototype
   */
  oCoords: Record<string, TOCoord> = {};

  /**
   * keeps the value of the last hovered corner during mouse move.
   * 0 is no corner, or 'mt', 'ml', 'mtr' etc..
   * It should be private, but there is no harm in using it as
   * a read-only property.
   * this isn't cleaned automatically. Non selected objects may have wrong values
   * @type number|string|any
   * @default 0
   */
  __corner: number | string;

  /**
   * a map of control visibility for this object.
   * this was left when controls were introduced to do not brea the api too much
   * this takes priority over the generic control visibility
   */
  _controlsVisibility: Record<string, boolean>;

  /**
   * The angle that an object will lock to while rotating.
   * @type [TDegree]
   */
  snapAngle?: TDegree;

  /**
   * The angle difference from the current snapped angle in which snapping should occur.
   * When undefined, the snapThreshold will default to the snapAngle.
   * @type [TDegree]
   */
  snapThreshold?: TDegree;

  /**
   * holds the controls for the object.
   * controls are added by default_controls.js
   */
  controls: TControlSet;

  /**
   * internal boolean to signal the code that the object is
   * part of the drag action.
   */
  isMoving?: boolean;

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options: Record<string, unknown>) {
    super(options);
  }

  /**
   * Temporary compatibility issue with old classes
   * @param {Object} [options] Options object
   */
  initialize(options: Record<string, unknown>) {
    if (options) {
      this.setOptions(options);
    }
  }

  /**
   * Determines which corner has been clicked
   * @private
   * @param {Object} pointer The pointer indicating the mouse position
   * @param {boolean} forTouch indicates if we are looking for interactin area with a touch action
   * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
   */
  _findTargetCorner(pointer: Point, forTouch: boolean): false | string {
    if (
      !this.hasControls ||
      !this.canvas ||
      this.canvas._activeObject !== this
    ) {
      return false;
    }

    this.__corner = 0;
    // had to keep the reverse loop because was breaking tests
    const cornerEntries = Object.entries(this.oCoords);
    for (let i = cornerEntries.length - 1; i >= 0; i--) {
      const [cornerKey, corner] = cornerEntries[i];
      if (!this.isControlVisible(cornerKey)) {
        continue;
      }
      const lines = this._getImageLines(
        forTouch ? corner.touchCorner : corner.corner
      );
      const xPoints = this._findCrossPoints(pointer, lines);
      if (xPoints !== 0 && xPoints % 2 === 1) {
        this.__corner = cornerKey;
        return cornerKey;
      }
      // // debugging
      //
      // this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
      // this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
      //
      // this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
      // this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
      //
      // this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
      // this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
      //
      // this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
      // this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);
    }
    return false;
  }

  /**
   * Calculates the coordinates of the center of each control plus the corners of the control itself
   * This basically just delegates to each control positionHandler
   * WARNING: changing what is passed to positionHandler is a breaking change, since position handler
   * is a public api and should be done just if extremely necessary
   * @return {Record<string, TOCoord>}
   */
  calcOCoords(): Record<string, TOCoord> {
    const vpt = this.getViewportTransform(),
      center = this.getCenterPoint(),
      tMatrix = [1, 0, 0, 1, center.x, center.y] as TMat2D,
      rMatrix = calcRotateMatrix({
        angle: this.getTotalAngle() - (!!this.group && this.flipX ? 180 : 0),
      }),
      positionMatrix = multiplyTransformMatrices(tMatrix, rMatrix),
      startMatrix = multiplyTransformMatrices(vpt, positionMatrix),
      finalMatrix = multiplyTransformMatrices(startMatrix, [
        1 / vpt[0],
        0,
        0,
        1 / vpt[3],
        0,
        0,
      ]),
      transformOptions = this.group
        ? qrDecompose(this.calcTransformMatrix())
        : undefined,
      dim = this._calculateCurrentDimensions(transformOptions),
      coords: Record<string, TOCoord> = {};

    this.forEachControl(
      (control: any, key: string, fabricObject: InteractiveFabricObject) => {
        coords[key] = control.positionHandler(dim, finalMatrix, fabricObject);
      }
    );

    // debug code
    /*
      const canvas = this.canvas;
      setTimeout(function () {
      if (!canvas) return;
        canvas.contextTop.clearRect(0, 0, 700, 700);
        canvas.contextTop.fillStyle = 'green';
        Object.keys(coords).forEach(function(key) {
          const control = coords[key];
          canvas.contextTop.fillRect(control.x, control.y, 3, 3);
        });
      } 50);
    */
    return coords;
  }

  /**
   * Sets corner and controls position coordinates based on current angle, width and height, left and top.
   * oCoords are used to find the corners
   * aCoords are used to quickly find an object on the canvas
   * lineCoords are used to quickly find object during pointer events.
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
   * @return {void}
   */
  setCoords(): void {
    if (this.callSuper) {
      ObjectGeometry.prototype.setCoords.call(this);
    } else {
      super.setCoords();
    }
    // set coordinates of the draggable boxes in the corners used to scale/rotate the image
    this.oCoords = this.calcOCoords();
    this._setCornerCoords();
  }

  /**
   * Calls a function for each control. The function gets called,
   * with the control, the control's key and the object that is calling the iterator
   * @param {Function} fn function to iterate over the controls over
   */
  forEachControl(
    fn: (
      control: any,
      key: string,
      fabricObject: InteractiveFabricObject
    ) => any
  ) {
    for (const i in this.controls) {
      fn(this.controls[i], i, this);
    }
  }

  /**
   * Sets the coordinates that determine the interaction area of each control
   * note: if we would switch to ROUND corner area, all of this would disappear.
   * everything would resolve to a single point and a pythagorean theorem for the distance
   * @todo evaluate simplification of code switching to circle interaction area at runtime
   * @private
   */
  _setCornerCoords(): void {
    Object.entries(this.oCoords).forEach(([controlKey, control]) => {
      const controlObject = this.controls[controlKey];
      control.corner = controlObject.calcCornerCoords(
        this.angle,
        this.cornerSize,
        control.x,
        control.y,
        false
      );
      control.touchCorner = controlObject.calcCornerCoords(
        this.angle,
        this.touchCornerSize,
        control.x,
        control.y,
        true
      );
    });
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
      (this.canvas && this.canvas._activeObject !== this)
    ) {
      return;
    }
    ctx.save();
    const center = this.getRelativeCenterPoint(),
      wh = this._calculateCurrentDimensions(),
      vpt = this.getViewportTransform();
    ctx.translate(center.x, center.y);
    ctx.scale(1 / vpt[0], 1 / vpt[3]);
    ctx.rotate(degreesToRadians(this.angle));
    ctx.fillStyle = this.selectionBackgroundColor;
    ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
    ctx.restore();
  }

  /**
   * @public override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.
   * @param {CanvasRenderingContext2D} ctx ctx is rotated and translated so that (0,0) is at object's center
   * @param {Point} size the control box size used
   */
  strokeBorders(ctx: CanvasRenderingContext2D, size: Point): void {
    ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {Point} size
   * @param {Object} styleOverride object to override the object style
   */
  _drawBorders(
    ctx: CanvasRenderingContext2D,
    size: Point,
    styleOverride: Record<string, any> = {}
  ): void {
    const options = {
      hasControls: this.hasControls,
      borderColor: this.borderColor,
      borderDashArray: this.borderDashArray,
      ...styleOverride,
    };
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    this._setLineDash(ctx, options.borderDashArray);
    this.strokeBorders(ctx, size);
    options.hasControls && this.drawControlsConnectingLines(ctx, size);
    ctx.restore();
  }

  /**
   * Renders controls and borders for the object
   * the context here is not transformed
   * @todo move to interactivity
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Object} [styleOverride] properties to override the object style
   */
  _renderControls(ctx: CanvasRenderingContext2D, styleOverride: any = {}) {
    const { hasBorders, hasControls } = this;
    const styleOptions = {
      hasBorders,
      hasControls,
      ...styleOverride,
    };
    const vpt = this.getViewportTransform(),
      shouldDrawBorders = styleOptions.hasBorders,
      shouldDrawControls = styleOptions.hasControls;
    const matrix = multiplyTransformMatrices(vpt, this.calcTransformMatrix());
    const options = qrDecompose(matrix);
    ctx.save();
    ctx.translate(options.translateX, options.translateY);
    ctx.lineWidth = 1 * this.borderScaleFactor;
    if (!this.group) {
      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    }
    if (this.flipX) {
      options.angle -= 180;
    }
    ctx.rotate(degreesToRadians(this.group ? options.angle : this.angle));
    shouldDrawBorders && this.drawBorders(ctx, options, styleOverride);
    shouldDrawControls && this.drawControls(ctx, styleOverride);
    ctx.restore();
  }

  /**
   * Draws borders of an object's bounding box.
   * Requires public properties: width, height
   * Requires public options: padding, borderColor
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {object} options object representing current object parameters
   * @param {Object} [styleOverride] object to override the object style
   */
  drawBorders(
    ctx: CanvasRenderingContext2D,
    options: TQrDecomposeOut,
    styleOverride: any
  ): void {
    let size;
    if ((styleOverride && styleOverride.forActiveSelection) || this.group) {
      const bbox = sizeAfterTransform(this.width, this.height, options),
        stroke = (
          this.strokeUniform
            ? new Point().scalarAdd(this.canvas ? this.canvas.getZoom() : 1)
            : // this is extremely confusing. options comes from the upper function
              // and is the qrDecompose of a matrix that takes in account zoom too
              new Point(options.scaleX, options.scaleY)
        ).scalarMultiply(this.strokeWidth);
      size = bbox.add(stroke).scalarAdd(this.borderScaleFactor);
    } else {
      size = this._calculateCurrentDimensions().scalarAdd(
        this.borderScaleFactor
      );
    }
    this._drawBorders(ctx, size, styleOverride);
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
    this.forEachControl(function (control, key, fabricObject) {
      // in this moment, the ctx is centered on the object.
      // width and height of the above function are the size of the bbox.
      if (control.withConnection && control.getVisibility(fabricObject, key)) {
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
   * @param {Object} styleOverride object to override the object style
   */
  drawControls(ctx: CanvasRenderingContext2D, styleOverride = {}) {
    ctx.save();
    const retinaScaling = this.canvas ? this.canvas.getRetinaScaling() : 1;
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
    this.forEachControl(function (control, key, fabricObject) {
      if (control.getVisibility(fabricObject, key)) {
        const p = fabricObject.oCoords[key];
        control.render(ctx, p.x, p.y, options, fabricObject);
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
   * Sets the visibility state of object controls, this is hust a bulk option for setControlVisible;
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
   * Example: blinking cursror text selection, drag effects.
   * @todo discuss swapping restoreManually with a renderCallback, but think of async issues
   * @param {Boolean} [restoreManually] When true won't restore the context after clear, in order to draw something else.
   * @return {CanvasRenderingContext2D|undefined} canvas.contextTop that is either still transformed
   * with the object transformMatrix, or restored to neutral transform
   */
  clearContextTop(
    restoreManually: boolean
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
   * @param {Event} [options.e] event if the process is generated by an event
   */
  onDeselect(options: any) {
    // implemented by sub-classes, as needed.
  }

  /**
   * This callback function is called every time _discardActiveObject or _setActiveObject
   * try to to select this object. If the function returns true, the process is cancelled
   * @param {Object} [options] options sent from the upper functions
   * @param {Event} [options.e] event if the process is generated by an event
   */
  onSelect(options: any) {
    // implemented by sub-classes, as needed.
  }

  /**
   * Override to customize drag and drop behavior
   * return true if the object currently dragged can be dropped on the target
   * @public
   * @param {DragEvent} e
   * @returns {boolean}
   */
  canDrop(e?: DragEvent): boolean {
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
  renderDragSourceEffect() {
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
  renderDropTargetEffect(e: DragEvent) {
    // for subclasses
  }
}
