// https://github.com/viruscamp/babel-plugin-transform-imports#using-a-function-as-the-transformer

const path = require('path');
const testsDir = path.resolve('./e2e/tests');
const testsBuiltDir = path.resolve('./e2e/dist');

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
            return `/${path
              .relative(
                process.cwd(),
                resolve(
                  file.startsWith(testsDir)
                    ? path.resolve(testsBuiltDir, path.relative(testsDir, file))
                    : file
                )
              )
              .replaceAll('\\', '/')}`;
          },
        },
      },
    ],
  ],
};
