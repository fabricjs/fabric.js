import { TClassProperties } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
export declare class Triangle extends FabricObject {
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG(): string[];
}
export declare const triangleDefaultValues: Partial<TClassProperties<Triangle>>;
//# sourceMappingURL=triangle.class.d.ts.map