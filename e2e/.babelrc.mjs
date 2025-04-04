// https://github.com/viruscamp/babel-plugin-transform-imports#using-a-function-as-the-transformer

import path from 'path';
import { createRequire } from 'module';

const testsDir = path.resolve('./e2e/tests');
const testsBuiltDir = path.resolve('./e2e/dist');
const require = createRequire(process.cwd());

function resolve(file) {
  const found = ['', '.ts', '/index.ts']
    .map((resolution) => `${file}${resolution}`)
    .find((file) => {
      try {
        return require.resolve(file);
      } catch (error) {
        return false;
      }
    });
  if (!found) {
    console.error(`Failed to resolve ${file}`);
    process.exit(1);
  }
  return require.resolve(found).replace(/\.ts$/, '.js');
}

export default {
  extends: '../.babelrcAlt',
  plugins: [
    [
      'transform-imports',
      {
        '\\..*': {
          skipDefaultConversion: true,
          transform: function (importName, matches, filename) {
            const file = resolve(
              path.resolve(path.dirname(filename), `${matches[0]}`),
            );
            return `/${path
              .relative(
                process.cwd(),
                file.startsWith(testsDir)
                  ? path.resolve(testsBuiltDir, path.relative(testsDir, file))
                  : file,
              )
              .replaceAll('\\', '/')}`;
          },
        },
      },
    ],
  ],
};
