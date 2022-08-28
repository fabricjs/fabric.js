import { TMat2D } from "./typedefs";

export { version as VERSION } from '../package.json';
export const noop = () => {};
export const halfPI = Math.PI / 2;
export const PiBy180 = Math.PI / 180;
export const iMatrix = Object.freeze([1, 0, 0, 1, 0, 0]) as TMat2D;
export const DEFAULT_SVG_FONT_SIZE = 16;

/* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
export const kRect = 1 - 0.5522847498;
