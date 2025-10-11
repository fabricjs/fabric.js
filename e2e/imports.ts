import { readFileSync } from 'node:fs';

/**
 * The import map used by `./utils/setupApp` to inject into the page so test scripts can use modules.
 *
 * Relative imports are supported thanks to babel, see `./.babelrc.js`.
 *
 * **IMPORTANT**: be sure to update the paths field in `./tsconfig.json` to reflect imports correctly
 */
const packageJSON = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  fabric: packageJSON.module.slice(1),
  ['fabric/extensions']: packageJSON.exports['./extensions'].import.slice(1),
};
