var fs = require('fs'),
    execSync = require('execSync').exec;

var modules = [
  'text',
  'gestures',
  'easing',
  'parser',
  'freedrawing',
  'interaction',
  'serialization',
  'image_filters',
  'gradient',
  'pattern',
  'shadow',
  'node'
];

// http://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array
var combine = function(a, min) {
  var fn = function(n, src, got, all) {
    if (n === 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }
    for (var j = 0, len = src.length; j < len; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
    return;
  };
  var all = [];
  for (var i = min, _len = a.length; i < _len; i++) {
    fn(i, a, [], all);
  }
  all.push(a);
  return all;
};

var combinations = combine(modules, 1);
var startTime = new Date;

fs.writeFile('build.sh', '#!/usr/bin/env sh\n\n', function() {

  for (var i = 0, len = combinations.length; i < len; i++) {

    var modulesStr = combinations[i].join(',');
    var command = 'node build.js build-sh modules=' + modulesStr;

    execSync(command);

    if (i % 100 === 0) {
      console.log(i + '/' + len);
    }
  }

  // create basic (minimal) build
  execSync('node build.js build-sh modules=');
});
