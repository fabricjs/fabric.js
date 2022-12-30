import { Point } from '../point.class';
/**
 * Adds an event listener to an element
 * @deprecated
 * @param {HTMLElement} element
 * @param {String} eventName
 * @param {Function} handler
 */
export declare const addListener: (element: any, eventName: any, handler: any, options: any) => any;
/**
 * Removes an event listener from an element
 * @deprecated
 * @param {HTMLElement} element
 * @param {String} eventName
 * @param {Function} handler
 */
export declare const removeListener: (element: any, eventName: any, handler: any, options: any) => any;
export declare const getPointer: (event: any) => Point;
export declare const isTouchEvent: (event: any) => boolean;
export declare const stopEvent: (e: Event) => void;
//# sourceMappingURL=dom_event.d.ts.map