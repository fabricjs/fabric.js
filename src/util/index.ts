//@ts-nocheck
const fabric = { util: {} };
export * from './cos';
export * from './removeDefaultValues';
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
        clone
    },
    matrixToSVG,
    sizeAfterTransform,
    animate,
    animateColor,
    requestAnimFrame,
    cancelAnimFrame,
    rotateVector
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
    matrixToSVG,
    sizeAfterTransform,
    animate,
    animateColor,
    requestAnimFrame,
    cancelAnimFrame,
    rotateVector
};