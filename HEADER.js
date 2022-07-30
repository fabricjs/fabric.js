/*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */
import { context } from './src/context';
import cache from './src/cache';
import config from './src/config';
var fabric = fabric || { version: '5.1.0' };
global.fabric = fabric;
if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
}
/* _AMD_START_ */
else if (typeof define === 'function' && define.amd) {
  define([], function () { return fabric; });
}
/* _AMD_END_ */
Object.assign(fabric, context, config, cache);
if (context.DOMParser) {
  global.DOMParser = context.DOMParser;
}
export { fabric };
