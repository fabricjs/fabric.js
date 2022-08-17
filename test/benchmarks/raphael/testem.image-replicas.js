const config = require('./testem.raphael');

module.exports = {
  ...config,
  name: 'Image Replicas',
  serve_files: [
    ...config.serve_files,
    'test/benchmarks/raphael/image-replicas.js',
  ],
  routes: {
    ...config.routes,
    '/main': 'test/benchmarks/raphael/index.mustache',
    '/asset': 'test/benchmarks/raphael/assets/pug.jpg'
  },
  assets: [
    {
      tag: 'img',
      src: '/asset'
    }
  ]
}