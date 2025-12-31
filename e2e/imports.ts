import { readFileSync } from 'node:fs';

/**
 * The import map used by `./utils/setupApp` to inject into the page so test scripts can use modules.
 *
 * Relative imports are supported thanks to babel, see `./.babelrc.js`.
 *
 * **IMPORTANT**: be sure to update the paths field in `./tsconfig.json` to reflect imports correctly
 */
const packageJSON = JSON.parse(readFileSync('./package.json', 'utf8'));

// Create a data URL that exports the global westures object as an ES module
const westuresWrapper = `data:text/javascript,${encodeURIComponent(`
  const westures = window.westures || globalThis.westures;
  export default westures;
  export const { Pan, Pinch, Press, Pull, Rotate, Swipe, Swivel, Tap, Track, Region, Gesture, PointerData, State, Input, Point2D, CANCEL, END, MOVE, START } = westures;
`)}`;

export default {
  fabric: packageJSON.module.slice(1),
  ['fabric/extensions']: packageJSON.exports['./extensions'].import.slice(1),
  westures: westuresWrapper,
};
