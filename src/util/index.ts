//@ts-nocheck
export * from './cos';
export * from './removeDefaultValues';
import { fabric } from '../../main'
import './animate'; // optional animation
import './animate_color'; // optional animation
import './anim_ease'; // optional easing
import './dom_event'; // optional interaction
import './dom_misc';
import './dom_request';
import './dom_style';
import './lang_array';
import './lang_class';
import './lang_object';
import './lang_string';
import './misc';
import './path';

console.log(fabric)
const {
    sin,
    getElementOffset,
    removeFromArray,
    toFixed,
    transformPoint,
    invertTransform,
    getNodeCanvas,
    createCanvasElement,
    toDataURL,
    multiplyTransformMatrices,
    applyTransformToObject,
    degreesToRadians,
    enlivenObjects,
    enlivenObjectEnlivables,
    cleanUpJsdomNode,
    loadImage,
    setImageSmoothing,
    getById,
    addClass,
    parsePreserveAspectRatioAttribute,
    findScaleToFit,
    findScaleToCover,
    stylesFromArray,
    stylesToArray,
    hasStyleChanged,
    getPathSegmentsInfo,
    getPointOnPath,
    string: {
        graphemeSplit,
        capitalize
    },
    projectStrokeOnPoints,
    array: {
        min,
        max
    },
    makePathSimpler,
    parsePath,
    joinPath,
    getBoundsOfCurve,
    limitDimsByArea,
    capValue: clamp,
    populateWithProperties,
    qrDecompose,
    saveObjectTransform,
    resetObjectTransform,
    object: {
        clone,
        extend
    },
    matrixToSVG,
    sizeAfterTransform,
    animate,
    animateColor,
    requestAnimFrame,
    cancelAnimFrame,
    rotateVector,
    getRandomInt,
    getSmoothPathFromPoints,
    parseUnit,
    toArray,
    request,
    addListener,
    removeListener,
    isTouchEvent,
    sendPointToPlane,
    radiansToDegrees
} = fabric.util;
export {
    sin,
    getElementOffset,
    removeFromArray,
    toFixed,
    transformPoint,
    invertTransform,
    getNodeCanvas,
    createCanvasElement,
    toDataURL,
    multiplyTransformMatrices,
    applyTransformToObject,
    degreesToRadians,
    enlivenObjects,
    enlivenObjectEnlivables,
    cleanUpJsdomNode,
    loadImage,
    setImageSmoothing,
    getById,
    addClass,
    parsePreserveAspectRatioAttribute,
    findScaleToFit,
    findScaleToCover,
    stylesFromArray,
    stylesToArray,
    hasStyleChanged,
    getPathSegmentsInfo,
    getPointOnPath,
    graphemeSplit,
    capitalize,
    projectStrokeOnPoints,
    min,
    max,
    makePathSimpler,
    parsePath,
    joinPath,
    getBoundsOfCurve,
    limitDimsByArea,
    clamp,
    populateWithProperties,
    qrDecompose,
    saveObjectTransform,
    resetObjectTransform,
    clone,
    extend,
    matrixToSVG,
    sizeAfterTransform,
    animate,
    animateColor,
    requestAnimFrame,
    cancelAnimFrame,
    rotateVector,
    getRandomInt,
    getSmoothPathFromPoints,
    parseUnit,
    toArray,
    request,
    addListener,
    removeListener,
    isTouchEvent,
    sendPointToPlane,
    radiansToDegrees
};
export default fabric.util;