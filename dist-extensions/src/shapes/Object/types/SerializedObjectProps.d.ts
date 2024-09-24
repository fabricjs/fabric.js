import type { Shadow } from '../../../Shadow';
import type { BaseProps } from './BaseProps';
import type { FillStrokeProps } from './FillStrokeProps';
export interface SerializedObjectProps extends BaseProps, FillStrokeProps {
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
    shadow: ReturnType<Shadow['toObject']> | null;
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
    clipPath?: Partial<SerializedObjectProps & ClipPathProps>;
}
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
//# sourceMappingURL=SerializedObjectProps.d.ts.map