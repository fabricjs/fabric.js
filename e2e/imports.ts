import { readJSONSync } from 'fs-extra';

/**
 * The import map used by `./utils/setupApp` to inject into the page
 * so test scripts can use modules (relative imports don't seem to work out of the box)
 *
 * **IMPORTANT**: be sure to update the paths field in `./tsconfig.json` to reflect imports correctly
 */
export default {
  fabric: readJSONSync('./package.json').module.slice(1),
  test: '/e2e/dist/test.js',
};
