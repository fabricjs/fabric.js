import { readJSONSync } from 'fs-extra';

/**
 * The import map used by `./utils/setupApp` to inject into the page so test scripts can use modules.
 *
 * Relative imports are supported thanks to babel, see `./.babelrc.js`.
 *
 * **IMPORTANT**: be sure to update the paths field in `./tsconfig.json` to reflect imports correctly
 */
export default {
  fabric: readJSONSync('./package.json').module.slice(1),
  ['fabric/extensions']:
    readJSONSync('./package.json').exports['./extensions'].import.slice(1),
};
