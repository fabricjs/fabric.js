const config = require('./testem.raphael');

module.exports = {
  ...config,
  name: 'Image Replicas',
  serve_files: [
    ...config.serve_files,
    'test/benchmarks/raphael-images/init.js',
    'test/benchmarks/raphael-images/qunit.js'
  ],
  routes: {
    ...config.routes,
    '/main': 'test/benchmarks/raphael-images/index.mustache',
    '/asset': 'test/benchmarks/raphael-images/pug.jpg'
  },
  assets: [
    {
      tag: 'img',
      src: '/asset'
    }
  ]
}