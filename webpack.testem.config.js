const path = require("path");

module.exports = {
  entry: './test/visual',
  output: {
    path: path.resolve('./dist'),
    filename: 'test-bundle.js'
    },
//   https://webpack.js.org/configuration/resolve/
    resolve: {
      extensions: ['.ts', '.mjs', '...'],
    },
     optimization: {
    minimize: false,
  },
//   node: {
//     fs: 'empty'
//   }
};