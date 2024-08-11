import { FabricObject } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { TClassProperties, TOptions } from '../typedefs';
import type { ObjectEvents } from '../EventTypeDefs';
export declare const triangleDefaultValues: Partial<TClassProperties<Triangle>>;
export declare class Triangle<Props extends TOptions<FabricObjectProps> = Partial<FabricObjectProps>, SProps extends SerializedObjectProps = SerializedObjectProps, EventSpec extends ObjectEvents = ObjectEvents> extends FabricObject<Props, SProps, EventSpec> implements FabricObjectProps {
    static type: string;
    static ownDefaults: Partial<TClassProperties<Triangle<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>>>;
    static getDefaults(): Record<string, any>;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options?: Props);
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
//# sourceMappingURL=Triangle.d.ts.map