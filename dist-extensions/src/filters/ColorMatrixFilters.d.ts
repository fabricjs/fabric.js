import { ColorMatrix } from './ColorMatrix';
import type { TMatColorMatrix } from './typedefs';
type FixedFiltersOwnProps = {
    colorsOnly: boolean;
};
export declare function createColorMatrixFilter(key: string, matrix: TMatColorMatrix): typeof ColorMatrix<typeof key, FixedFiltersOwnProps>;
export declare const Brownie: typeof ColorMatrix<string, FixedFiltersOwnProps>;
export declare const Vintage: typeof ColorMatrix<string, FixedFiltersOwnProps>;
export declare const Kodachrome: typeof ColorMatrix<string, FixedFiltersOwnProps>;
export declare const Technicolor: typeof ColorMatrix<string, FixedFiltersOwnProps>;
export declare const Polaroid: typeof ColorMatrix<string, FixedFiltersOwnProps>;
export declare const Sepia: typeof ColorMatrix<string, FixedFiltersOwnProps>;
export declare const BlackWhite: typeof ColorMatrix<string, FixedFiltersOwnProps>;
export {};
//# sourceMappingURL=ColorMatrixFilters.d.ts.map