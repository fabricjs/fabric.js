import type { StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';
/**
 * Layout will adjust the bounding box to fit target's objects.
 */
export declare class FitContentLayout extends LayoutStrategy {
    static readonly type = "fit-content";
    /**
     * @override layout on all triggers
     * Override at will
     */
    shouldPerformLayout(context: StrictLayoutContext): boolean;
}
//# sourceMappingURL=FitContentLayout.d.ts.map