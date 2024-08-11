import { Control } from './Control';
import type { Path } from '../shapes/Path';
export type PathPointControlStyle = {
    controlFill?: string;
    controlStroke?: string;
    connectionDashArray?: number[];
};
export declare function createPathControls(path: Path, options?: Partial<Control> & {
    controlPointStyle?: PathPointControlStyle;
    pointStyle?: PathPointControlStyle;
}): Record<string, Control>;
//# sourceMappingURL=pathControl.d.ts.map