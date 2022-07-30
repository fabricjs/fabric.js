/**
 * Cache Object for widths of chars in text rendering.
 */
export const charWidthsCache = {};


/**
 * This object contains the result of arc to bezier conversion for faster retrieving if the same arc needs to be converted again.
 * It was an internal variable, is accessible since version 2.3.4
 */
export const arcToSegmentsCache = {};

/**
 * This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
 * It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
 * you do not get any speed benefit and you get a big object in memory.
 * The object was a private variable before, while now is appended to the lib so that you have access to it and you
 * can eventually clear it.
 * It was an internal variable, is accessible since version 2.3.4
 */
export const boundsOfCurveCache = {};

export default {
    charWidthsCache,
    arcToSegmentsCache,
    boundsOfCurveCache
}