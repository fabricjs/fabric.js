/**
 * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
 * @param {Function} callback Callback to invoke
 */
export declare function requestAnimFrame(callback: FrameRequestCallback): number;
export declare function cancelAnimFrame(handle: number): void;
//# sourceMappingURL=AnimationFrameProvider.d.ts.map