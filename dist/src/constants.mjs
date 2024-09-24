import { version } from '../package.json.mjs';

// use this syntax so babel plugin see this import here
const VERSION = version;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
const halfPI = Math.PI / 2;
const twoMathPi = Math.PI * 2;
const PiBy180 = Math.PI / 180;
const iMatrix = Object.freeze([1, 0, 0, 1, 0, 0]);
const DEFAULT_SVG_FONT_SIZE = 16;
const ALIASING_LIMIT = 2;

/* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
const kRect = 1 - 0.5522847498;
const CENTER = 'center';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';
const RIGHT = 'right';
const NONE = 'none';
const reNewline = /\r?\n/;
const MOVING = 'moving';
const SCALING = 'scaling';
const ROTATING = 'rotating';
const ROTATE = 'rotate';
const SKEWING = 'skewing';
const RESIZING = 'resizing';
const MODIFY_POLY = 'modifyPoly';
const MODIFY_PATH = 'modifyPath';
const CHANGED = 'changed';
const SCALE = 'scale';
const SCALE_X = 'scaleX';
const SCALE_Y = 'scaleY';
const SKEW_X = 'skewX';
const SKEW_Y = 'skewY';
const FILL = 'fill';
const STROKE = 'stroke';
const MODIFIED = 'modified';

export { ALIASING_LIMIT, BOTTOM, CENTER, CHANGED, DEFAULT_SVG_FONT_SIZE, FILL, LEFT, MODIFIED, MODIFY_PATH, MODIFY_POLY, MOVING, NONE, PiBy180, RESIZING, RIGHT, ROTATE, ROTATING, SCALE, SCALE_X, SCALE_Y, SCALING, SKEWING, SKEW_X, SKEW_Y, STROKE, TOP, VERSION, halfPI, iMatrix, kRect, noop, reNewline, twoMathPi };
//# sourceMappingURL=constants.mjs.map
