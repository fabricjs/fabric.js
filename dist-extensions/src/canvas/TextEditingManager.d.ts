import type { TPointerEvent } from '../EventTypeDefs';
import type { ITextBehavior } from '../shapes/IText/ITextBehavior';
import type { Canvas } from './Canvas';
/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
export declare class TextEditingManager {
    private targets;
    private target?;
    private __disposer;
    constructor(canvas: Canvas);
    exitTextEditing(): void;
    add(target: ITextBehavior): void;
    remove(target: ITextBehavior): void;
    register(target: ITextBehavior): void;
    unregister(target: ITextBehavior): void;
    onMouseMove(e: TPointerEvent): void;
    clear(): void;
    dispose(): void;
}
//# sourceMappingURL=TextEditingManager.d.ts.map