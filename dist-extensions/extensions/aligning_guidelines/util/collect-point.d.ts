import type { FabricObject, Point } from 'fabric';
type CollectPointProps = {
    activeObject: FabricObject;
    point: Point;
    list: Point[];
    isScale: boolean;
    index: number;
};
export declare function collectVerticalPoint(props: CollectPointProps): {
    x: number;
    y1: number;
    y2: number;
}[];
export declare function collectHorizontalPoint(props: CollectPointProps): {
    y: number;
    x1: number;
    x2: number;
}[];
export {};
//# sourceMappingURL=collect-point.d.ts.map