//@ts-nocheck
const fabric = { util: {} };
export * from './cos';
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
    findScaleToCover
} = fabric.util;
export {
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
    findScaleToCover
};