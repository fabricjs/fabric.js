import { readJSONSync } from 'fs-extra';
import path from 'path';

function resolvePath(pathToFile: string) {
  return `/${path
    .relative(
      process.cwd(),
      path.isAbsolute(pathToFile)
        ? pathToFile
        : path.resolve(process.cwd(), pathToFile)
    )
    .replaceAll(/\\/g, '/')}`;
}

function resolveModule(name: string) {
  return resolvePath(require.resolve(name));
}

/**
 * The import map used by `./utils/setupApp` to inject into the page so test scripts can use modules.
 *
 * Relative imports are supported thanks to babel, see `./.babelrc.js`.
 *
 * **IMPORTANT**: be sure to update the paths field in `./tsconfig.json` to reflect imports correctly
 */
export default {
  fabric: resolvePath(readJSONSync('./package.json').module),
  webfontloader: resolveModule('webfontloader'),
  fontfaceobserver: resolveModule('fontfaceobserver'),
};
