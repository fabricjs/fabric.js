import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';
/**
 * Layout will adjust the bounding box to match the clip path bounding box.
 */
export declare class ClipPathLayout extends LayoutStrategy {
    static readonly type = "clip-path";
    shouldPerformLayout(context: StrictLayoutContext): boolean;
    shouldLayoutClipPath(): boolean;
    calcLayoutResult(context: StrictLayoutContext, objects: FabricObject[]): LayoutStrategyResult | undefined;
}
//# sourceMappingURL=ClipPathLayout.d.ts.map