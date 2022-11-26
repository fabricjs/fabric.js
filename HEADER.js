import { cache } from './src/cache';
import { config } from './src/config';
import { iMatrix, VERSION } from './src/constants';

var fabric = fabric || {
  version: VERSION,
  config,
  cache,
  iMatrix,
};

if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
} else if (typeof define === 'function' && define.amd) {
  /* _AMD_START_ */
  define([], function () {
    return fabric;
  });
}
/* _AMD_END_ */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (
    document instanceof
    (typeof HTMLDocument !== 'undefined' ? HTMLDocument : Document)
  ) {
    fabric.document = document;
  } else {
    fabric.document = document.implementation.createHTMLDocument('');
  }
  fabric.window = window;
  window.fabric = fabric;
} else {
  // assume we're running under node.js when document/window are not present
  var jsdom = require('jsdom');
  var virtualWindow = new jsdom.JSDOM(
    decodeURIComponent(
      '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'
    ),
    {
      features: {
        FetchExternalResources: ['img'],
      },
      resources: 'usable',
    }
  ).window;
  fabric.document = virtualWindow.document;
  fabric.jsdomImplForWrapper =
    require('jsdom/lib/jsdom/living/generated/utils').implForWrapper;
  fabric.nodeCanvas = require('jsdom/lib/jsdom/utils').Canvas;
  fabric.window = virtualWindow;
  global.DOMParser = fabric.window.DOMParser;
}

/**
 * True when in environment that supports touch events
 * @type boolean
 */
fabric.isTouchSupported =
  'ontouchstart' in fabric.window ||
  'ontouchstart' in fabric.document ||
  (fabric.window &&
    fabric.window.navigator &&
    fabric.window.navigator.maxTouchPoints > 0);

/**
 * True when in environment that's probably Node.js
 * @type boolean
 */
fabric.isLikelyNode =
  typeof Buffer !== 'undefined' && typeof window === 'undefined';

/**
 * @todo move to config when window is exported
 */
config.configure({
  devicePixelRatio:
    fabric.window.devicePixelRatio ||
    fabric.window.webkitDevicePixelRatio ||
    fabric.window.mozDevicePixelRatio ||
    1,
});

export { fabric };
