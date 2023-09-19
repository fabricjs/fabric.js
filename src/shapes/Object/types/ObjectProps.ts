import type { Shadow } from '../../../Shadow';
import type { Canvas } from '../../../canvas/Canvas';
import type { StaticCanvas } from '../../../canvas/StaticCanvas';
import type { TFiller } from '../../../typedefs';
import type { FabricObject } from '../Object';
import type {
  ClipPathProps,
  SerializedObjectProps,
} from './SerializedObjectProps';

export interface ObjectProps extends SerializedObjectProps, ClipPathProps {
  clipPath?: FabricObject;
  fill: TFiller | string | null;
  stroke: TFiller | string | null;
  shadow: Shadow | null;
  canvas?: StaticCanvas | Canvas;

  /**
   * Minimum allowed scale value of an object
   * @type Number
   * @default 0
   */
  minScaleLimit: number;

  /**
   * When `true`, object is cached on an additional canvas.
   * When `false`, object is not cached unless necessary ( clipPath )
   * default to true
   * @since 1.7.0
   * @type Boolean
   * @default true
   */
  objectCaching: boolean;

  /**
   * When `false`, default object's values are not included in its serialization
   * @type Boolean
   * @default
   */
  includeDefaultValues: boolean;

  /**
   * When `true`, object is not exported in OBJECT/JSON
   * @since 1.6.3
   * @type Boolean
   * @default
   */
  excludeFromExport: boolean;

  /**
   * When `true` the object will rotate on its center.
   * When `false` will rotate around the origin point defined by originX and originY.
   * The value of this property is IGNORED during a transform if the canvas has already
   * centeredRotation set to `true`
   * The object method `rotate` will always consider this property and never the canva's one.
   * @default true
   */
  centeredRotation: boolean;
}
