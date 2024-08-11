import { Point } from '../../Point';
import type { InitializationLayoutContext, LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';
/**
 * Layout will keep target's initial size.
 */
export declare class FixedLayout extends LayoutStrategy {
    static readonly type = "fixed";
    /**
     * @override respect target's initial size
     */
    getInitialSize({ target }: StrictLayoutContext & InitializationLayoutContext, { size }: Pick<LayoutStrategyResult, 'center' | 'size'>): Point;
}
//# sourceMappingURL=FixedLayout.d.ts.map