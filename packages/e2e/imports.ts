/**
 * The import map used by `./utils/setupApp` to inject into the page so test scripts can use modules.
 *
 * Relative imports between test files resolve naturally since scripts are loaded via URL.
 *
 * **IMPORTANT**: be sure to update the paths field in `./tsconfig.json` to reflect imports correctly
 */
// Create a data URL that exports the global westures object as an ES module
const westuresWrapper = `data:text/javascript,${encodeURIComponent(`
  const westures = window.westures || globalThis.westures;
  export default westures;
  export const { Pan, Pinch, Press, Pull, Rotate, Swipe, Swivel, Tap, Track, Region, Gesture, PointerData, State, Input, Point2D, CANCEL, END, MOVE, START } = westures;
`)}`;

export default {
  '@fabricjs/aligning-guidelines':
    '/packages/aligning-guidelines/dist/index.mjs',
  '@fabricjs/browser': '/packages/browser/dist/index.mjs',
  '@fabricjs/core': '/packages/core/dist/index.mjs',
  '@fabricjs/cropping-controls': '/packages/cropping-controls/dist/index.mjs',
  '@fabricjs/data-updaters': '/packages/data-updaters/dist/index.mjs',
  '@fabricjs/gradient-controls': '/packages/gradient-controls/dist/index.mjs',
  fabric: '/packages/browser/dist/index.mjs',
  '@fabricjs/westures-integration':
    '/packages/westures-integration/dist/index.mjs',
  ['fabric/extensions']: '/dist-extensions/index.mjs',
  westures: westuresWrapper,
};
