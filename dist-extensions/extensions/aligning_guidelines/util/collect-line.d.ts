import type { FabricObject, TBBox } from 'fabric';
import type { HorizontalLine, VerticalLine } from '../typedefs';
type CollectLineProps = {
    activeObject: FabricObject;
    activeObjectRect: TBBox;
    objectRect: TBBox;
};
export declare function collectLine(props: CollectLineProps): {
    vLines: VerticalLine[];
    hLines: HorizontalLine[];
};
export {};
//# sourceMappingURL=collect-line.d.ts.map