import { TDegree } from '../../../typedefs';
import { BorderProps } from './BorderProps';
import { ControlProps } from './ControlProps';
import { LockInteractionProps } from './LockInteractionProps';
import { ObjectProps } from './ObjectProps';

export interface FabricObjectProps
  extends ObjectProps,
    ControlProps,
    BorderProps,
    LockInteractionProps {
  /**
   * When `true`, cache does not get updated during scaling. The picture will get blocky if scaled
   * too much and will be redrawn with correct details at the end of scaling.
   * this setting is performance and application dependant.
   * default to true
   * since 1.7.0
   * @type Boolean
   * @default true
   */
  noScaleCache?: boolean;

  /**
   * When true, this object will use center point as the origin of transformation
   * when being scaled via the controls.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  centeredScaling: false;

  /**
   * When true, this object will use center point as the origin of transformation
   * when being rotated via the controls.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  centeredRotation: boolean;

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
   * Default cursor value used when hovering over this object on canvas
   * @type CSSStyleDeclaration['cursor'] | null
   * @default null
   */
  hoverCursor: CSSStyleDeclaration['cursor'] | null;

  /**
   * Default cursor value used when moving this object on canvas
   * @type CSSStyleDeclaration['cursor'] | null
   * @default null
   */
  moveCursor: CSSStyleDeclaration['cursor'] | null;

  /**
   * Selection Background color of an object. colored layer behind the object when it is active.
   * does not mix good with globalCompositeOperation methods.
   * @type String
   * @deprecated
   * @default
   */
  selectionBackgroundColor: string;

  /**
   * When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box
   * @type Boolean
   * @default
   */
  perPixelTargetFind: boolean;

  /**
   * When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
   * But events still fire on it.
   * @type Boolean
   * @default
   */
  selectable: boolean;

  /**
   * When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4
   * @type Boolean
   * @default
   */
  evented: boolean;

  /**
   * When 'down', object is set to active on mousedown/touchstart
   * When 'up', object is set to active on mouseup/touchend
   * Experimental. Let's see if this breaks anything before supporting officially
   * @private
   * since 4.4.0
   * @type String
   * @default 'down'
   */
  activeOn: 'down' | 'up';
}
