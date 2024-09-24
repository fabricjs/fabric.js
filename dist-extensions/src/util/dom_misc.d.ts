/**
 * Returns element scroll offsets
 * @param {HTMLElement} element Element to operate on
 * @return {Object} Object with left/top values
 */
export declare function getScrollLeftTop(element: HTMLElement | null): {
    left: number;
    top: number;
};
export declare const getDocumentFromElement: (el: HTMLElement) => Document;
export declare const getWindowFromElement: (el: HTMLElement) => (Window & typeof globalThis) | null;
//# sourceMappingURL=dom_misc.d.ts.map