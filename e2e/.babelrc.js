// https://github.com/viruscamp/babel-plugin-transform-imports#using-a-function-as-the-transformer

const path = require('path');
const siteDir = path.resolve('./e2e/site');
const testsDir = path.resolve('./e2e/tests');
const testsBuiltDir = path.resolve('./e2e/dist');

function resolve(file) {
  const found = ['', '.js', '/index.js']
    .map((resolution) => `${file}${resolution}`)
    .find((file) => {
      try {
        return require.resolve(file);
      } catch (error) {
        return false;
      }
    });
  if (!found) {
    throw new Error(`Failed to resolve ${file}`);
  }
  return require.resolve(file);
}

module.exports = {
  extends: '../.babelrcAlt',
  plugins: [
    [
      'transform-imports',
      {
        '\\..*': {
          skipDefaultConversion: true,
          transform: function (importName, matches, filename) {
            const file = path.resolve(path.dirname(filename), `${matches[0]}`);
            return path
              .relative(
                siteDir,
                resolve(
                  file.startsWith(testsDir)
                    ? path.resolve(testsBuiltDir, path.relative(testsDir, file))
                    : file
                )
              )
              .replaceAll('\\', '/');
          },
        },
      },
    ],
  ],
};
