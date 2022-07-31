//@ts-nocheck
/*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */
import cache from './cache';
import config from './config';
import constants from './constants';
import { context } from './context';
import { fabric } from './main';

if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
}
/* _AMD_START_ */
else if (typeof define === 'function' && define.amd) {
  define([], function () { return fabric; });
}
/* _AMD_END_ */
Object.assign(fabric, context, constants, config, cache);
if (context.DOMParser) {
  global.DOMParser = context.DOMParser;
}
export { fabric };

