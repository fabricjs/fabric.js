const config = require('../testem');
const path = require('path');

const entry = path.relative(process.cwd(), __dirname);

module.exports = {
  ...config,
  name: 'Tiger - Complex SVG',
  serve_files: [
    ...config.serve_files,
    `${entry}/data.js`,
    `${entry}/raphael.js`,
    `${entry}/fabric.js`,
  ],
  routes: {
    ...config.routes,
    '/asset': `${entry}/tiger.svg`
  },
  assets: [
    {
      tag: 'iframe',
      src: '/asset'
    }
  ]
}