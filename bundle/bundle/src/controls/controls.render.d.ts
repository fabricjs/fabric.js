import type { FabricObject } from '../shapes/Object/Object';
import type { Control } from './control.class';
export type ControlRenderingStyleOverride = Partial<Pick<FabricObject, 'cornerStyle' | 'cornerSize' | 'cornerColor' | 'cornerStrokeColor' | 'cornerDashArray' | 'transparentCorners'>>;
export type ControlRenderer = (ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: ControlRenderingStyleOverride, fabricObject: FabricObject) => void;
/**
 * Render a round control, as per fabric features.
 * This function is written to respect object properties like transparentCorners, cornerSize
 * cornerColor, cornerStrokeColor
 * plus the addition of offsetY and offsetX.
 * @param {CanvasRenderingContext2D} ctx context to render on
 * @param {Number} left x coordinate where the control center should be
 * @param {Number} top y coordinate where the control center should be
 * @param {Object} styleOverride override for FabricObject controls style
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 */
export declare function renderCircleControl(this: Control, ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: ControlRenderingStyleOverride, fabricObject: FabricObject): void;
/**
 * Render a square control, as per fabric features.
 * This function is written to respect object properties like transparentCorners, cornerSize
 * cornerColor, cornerStrokeColor
 * plus the addition of offsetY and offsetX.
 * @param {CanvasRenderingContext2D} ctx context to render on
 * @param {Number} left x coordinate where the control center should be
 * @param {Number} top y coordinate where the control center should be
 * @param {Object} styleOverride override for FabricObject controls style
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 */
export declare function renderSquareControl(this: Control, ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: ControlRenderingStyleOverride, fabricObject: FabricObject): void;
//# sourceMappingURL=controls.render.d.ts.map