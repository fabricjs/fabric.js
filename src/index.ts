/**
 *
 * ['document', 'window', 'isTouchSupported', 'isLikelyNode', 'util', 'controlsUtils','Pattern', 'Shadow', 'StaticCanvas', 'BaseBrush', 'PencilBrush', 'CircleBrush', 'SprayBrush', 'PatternBrush', 'Canvas', 'Object', 'Line', 'Circle', 'Triangle', 'Ellipse', 'Rect', 'Polyline', 'Polygon', 'Path', 'Group', 'ActiveSelection', 'Image', 'isWebglSupported', 'WebglFilterBackend', 'Canvas2dFilterBackend', 'Text', 'IText', 'Textbox', '_measuringContext', 'maxTextureSize', 'webGlPrecision', 'isSupported', 'filterBackend']
 *
 *  */

export { cache } from './cache';
export { VERSION as version, iMatrix } from './constants';
export { StaticCanvas } from './canvas/static_canvas.class';
export { Canvas } from './canvas/canvas_events';
export { config } from './config';
export { loadSVGFromURL } from './parser/loadSVGFromURL';
export { loadSVGFromString } from './parser/loadSVGFromString';
export { initFilterBackend } from './filters/FilterBackend';
export { Canvas2dFilterBackend } from './filters/2d_backend.class';
export { WebGLFilterBackend } from './filters/webgl_backend.class';
export { runningAnimations } from './util/animation/AnimationRegistry';
export { Point } from './point.class';
export { Intersection } from './intersection.class';
export { Color } from './color/color.class';
export { Control } from './controls/control.class'
export { Gradient } from './gradient/gradient.class';
export { Pattern } from './pattern.class';
