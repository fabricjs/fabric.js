import type { TSize } from '../../typedefs';
export declare function parseLinearCoords(el: SVGGradientElement): {
    x1: string | number;
    y1: string | number;
    x2: string;
    y2: string | number;
};
export declare function parseRadialCoords(el: SVGGradientElement): {
    x1: string;
    y1: string;
    r1: number;
    x2: string;
    y2: string;
    r2: string;
};
export declare function parseCoords(el: SVGGradientElement, size: TSize): Record<"x1" | "y1" | "x2" | "y2", number>;
//# sourceMappingURL=parseCoords.d.ts.map