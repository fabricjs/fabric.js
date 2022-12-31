/**
 *
 * ['document', 'window', 'isTouchSupported', 'isLikelyNode', 'util', 'controlsUtils', 'Circle', 'Triangle', 'Ellipse', 'Rect', 'Polyline', 'Polygon', 'Path', 'Group', 'ActiveSelection', 'Image', 'isWebglSupported', 'WebglFilterBackend', 'Canvas2dFilterBackend', 'Text', 'IText', 'Textbox', '_measuringContext', 'maxTextureSize', 'webGlPrecision', 'isSupported', 'filterBackend']
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
export { Shadow } from './shadow.class';
export { BaseBrush } from './brushes/base_brush.class';
export { PencilBrush } from './brushes/pencil_brush.class';
export { CircleBrush } from './brushes/circle_brush.class';
export { SprayBrush } from './brushes/spray_brush.class';
export { PatternBrush } from './brushes/pattern_brush.class';
export { FabricObject } from './shapes/Object/FabricObject';
export { Line } from './shapes/line.class';
