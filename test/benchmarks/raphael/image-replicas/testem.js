const config = require('../testem.raphael');

const entry = 'test/benchmarks/raphael/image-replicas';

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