const config = require('../testem');
const path = require('path');
const { readFileSync } = require('fs');

const entry = path.relative(process.cwd(), __dirname);

module.exports = {
  ...config,
  name: 'Simple Shape',
  serve_files: [
    ...config.serve_files,
    `${entry}/common.js`,
    `${entry}/raphael.js`,
    `${entry}/fabric.js`,
  ],
  routes: {
    ...config.routes,
    '/asset': `${entry}/pug.jpg`
  },
  pre: readFileSync(path.resolve(__dirname, './header.html')).toString()
}