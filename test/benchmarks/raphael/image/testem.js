const config = require('../testem');
const path = require('path');

const entry = path.relative(process.cwd(), __dirname);

module.exports = {
  ...config,
  name: 'Image Replicas',
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
  assets: [
    {
      tag: 'img',
      src: '/asset'
    }
  ]
}