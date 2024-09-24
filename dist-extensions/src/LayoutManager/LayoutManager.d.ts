import type { FabricObject } from '../shapes/Object/FabricObject';
import type { LayoutStrategy } from './LayoutStrategies/LayoutStrategy';
import type { LayoutContext, LayoutResult, RegistrationContext, StrictLayoutContext } from './types';
export type SerializedLayoutManager = {
    type: string;
    strategy: string;
};
export declare class LayoutManager {
    private _prevLayoutStrategy?;
    protected _subscriptions: Map<FabricObject, VoidFunction[]>;
    strategy: LayoutStrategy;
    constructor(strategy?: LayoutStrategy);
    performLayout(context: LayoutContext): void;
    /**
     * Attach handlers for events that we know will invalidate the layout when
     * performed on child objects ( general transforms ).
     * Returns the disposers for later unsubscribing and cleanup
     * @param {FabricObject} object
     * @param {RegistrationContext & Partial<StrictLayoutContext>} context
     * @returns {VoidFunction[]} disposers remove the handlers
     */
    protected attachHandlers(object: FabricObject, context: RegistrationContext & Partial<StrictLayoutContext>): VoidFunction[];
    /**
     * Subscribe an object to transform events that will trigger a layout change on the parent
     * This is important only for interactive groups.
     * @param object
     * @param context
     */
    protected subscribe(object: FabricObject, context: RegistrationContext & Partial<StrictLayoutContext>): void;
    /**
     * unsubscribe object layout triggers
     */
    protected unsubscribe(object: FabricObject, _context?: RegistrationContext & Partial<StrictLayoutContext>): void;
    unsubscribeTargets(context: RegistrationContext & Partial<StrictLayoutContext>): void;
    subscribeTargets(context: RegistrationContext & Partial<StrictLayoutContext>): void;
    protected onBeforeLayout(context: StrictLayoutContext): void;
    protected getLayoutResult(context: StrictLayoutContext): Required<LayoutResult> | undefined;
    protected commitLayout(context: StrictLayoutContext, layoutResult: Required<LayoutResult>): void;
    protected layoutObjects(context: StrictLayoutContext, layoutResult: Required<LayoutResult>): void;
    /**
     * @param {FabricObject} object
     * @param {Point} offset
     */
    protected layoutObject(context: StrictLayoutContext, { offset }: Required<LayoutResult>, object: FabricObject): void;
    protected onAfterLayout(context: StrictLayoutContext, layoutResult?: LayoutResult): void;
    dispose(): void;
    toObject(): {
        type: string;
        strategy: string;
    };
    toJSON(): {
        type: string;
        strategy: string;
    };
}
//# sourceMappingURL=LayoutManager.d.ts.map