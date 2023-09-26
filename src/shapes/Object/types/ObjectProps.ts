import type { Shadow } from '../../../Shadow';
import type { Canvas } from '../../../canvas/Canvas';
import type { StaticCanvas } from '../../../canvas/StaticCanvas';
import type { BaseProps } from './BaseProps';
import type { FillStrokeProps } from './FillStrokeProps';

export interface ClipPathProps {
  /**
   * Meaningful ONLY when the object is used as clipPath.
   * if true, the clipPath will make the object clip to the outside of the clipPath
   * since 2.4.0
   * @type boolean
   * @default false
   */
  inverted: boolean;

  /**
   * Meaningful ONLY when the object is used as clipPath.
   * if true, the clipPath will have its top and left relative to canvas, and will
   * not be influenced by the object transform. This will make the clipPath relative
   * to the canvas, but clipping just a particular object.
   * WARNING this is beta, this feature may change or be renamed.
   * since 2.4.0
   * @type boolean
   * @default false
   */
  absolutePositioned: boolean;
}

export interface TObjectProps<Serialized extends boolean = false>
  extends BaseProps,
    FillStrokeProps<Serialized>,
    ClipPathProps {
  /**
   * Opacity of an object
   * @type Number
   * @default 1
   */
  opacity: number;

  /**
   * Composite rule used for canvas globalCompositeOperation
   * @type String
   * @default
   */
  globalCompositeOperation: GlobalCompositeOperation;

  /**
   * Background color of an object.
   * takes css colors https://www.w3.org/TR/css-color-3/
   * @type String
   * @default
   */
  backgroundColor: string;

  /**
   * Shadow object representing shadow of this shape
   * @type Shadow
   * @default null
   */
  shadow: Serialized extends true
    ? ReturnType<Shadow['toObject']> | null
    : Shadow | null;

  /**
   * When set to `false`, an object is not rendered on canvas
   * @type Boolean
   * @default
   */
  visible: boolean;

  /**
   * a fabricObject that, without stroke define a clipping area with their shape. filled in black
   * the clipPath object gets used when the object has rendered, and the context is placed in the center
   * of the object cacheCanvas.
   * If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'
   * @type FabricObject
   */
  clipPath?: Partial<TObjectProps<Serialized>>;
}

export interface SerializedObjectProps extends TObjectProps<true> {
  type: string;
}

export interface ObjectProps extends TObjectProps, ClipPathProps {
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
   * The object method `rotate` will always consider this property and never the canvas one.
   * @default true
   */
  centeredRotation: boolean;
}
