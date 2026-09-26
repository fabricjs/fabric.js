/**
 * The import map used by `./utils/setupApp` to inject into the page so test scripts can use modules.
 *
 * Relative imports between test files resolve naturally since scripts are loaded via URL.
 *
 * **IMPORTANT**: be sure to update the paths field in `./tsconfig.json` to reflect imports correctly
 */
export default {
  '@fabricjs/aligning-guidelines':
    '/packages/aligning-guidelines/dist/index.mjs',
  '@fabricjs/browser': '/packages/browser/dist/index.mjs',
  '@fabricjs/core': '/packages/core/dist/index.mjs',
  '@fabricjs/cropping-controls': '/packages/cropping-controls/dist/index.mjs',
  '@fabricjs/data-updaters': '/packages/data-updaters/dist/index.mjs',
  '@fabricjs/gradient-controls': '/packages/gradient-controls/dist/index.mjs',
  fabric: '/packages/browser/dist/index.mjs',
};
