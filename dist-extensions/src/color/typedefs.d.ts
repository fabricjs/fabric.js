import type { Color } from './Color';
/**
 * RGB format
 */
export type TRGBColorSource = [red: number, green: number, blue: number];
/**
 * RGBA format
 */
export type TRGBAColorSource = [
    red: number,
    green: number,
    blue: number,
    alpha: number
];
export type TColorArg = string | TRGBColorSource | TRGBAColorSource | Color;
//# sourceMappingURL=typedefs.d.ts.map