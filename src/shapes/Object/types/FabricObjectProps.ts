import type { BorderProps } from './BorderProps';
import type { ControlProps } from './ControlProps';
import type { LockInteractionProps } from './LockInteractionProps';
import type { ObjectProps } from './ObjectProps';

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
   */
  selectionBackgroundColor: string;

  /**
   * When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box
   * @type Boolean
   */
  perPixelTargetFind: boolean;

  /**
   * When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
   * But events still fire on it.
   * @type Boolean
   */
  selectable: boolean;

  /**
   * When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4
   * @type Boolean
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
