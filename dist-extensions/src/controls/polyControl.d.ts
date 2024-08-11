import { Point } from '../Point';
import { Control } from './Control';
import type { TMat2D } from '../typedefs';
import type { Polyline } from '../shapes/Polyline';
import type { TPointerEvent, Transform, TransformActionHandler } from '../EventTypeDefs';
type TTransformAnchor = Transform & {
    pointIndex: number;
};
/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
export declare const createPolyPositionHandler: (pointIndex: number) => (dim: Point, finalMatrix: TMat2D, polyObject: Polyline) => Point;
/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
export declare const polyActionHandler: (eventData: TPointerEvent, transform: TTransformAnchor, x: number, y: number) => boolean;
/**
 * Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.
 */
export declare const factoryPolyActionHandler: (pointIndex: number, fn: TransformActionHandler<TTransformAnchor>) => (eventData: TPointerEvent, transform: Transform, x: number, y: number) => boolean;
export declare const createPolyActionHandler: (pointIndex: number) => TransformActionHandler<Transform>;
export declare function createPolyControls(poly: Polyline, options?: Partial<Control>): Record<string, Control>;
export declare function createPolyControls(numOfControls: number, options?: Partial<Control>): Record<string, Control>;
export {};
//# sourceMappingURL=polyControl.d.ts.map