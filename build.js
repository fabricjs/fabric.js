var fs = require('fs'),
    exec = require('child_process').exec;

var buildArgs = process.argv.slice(2),
    buildArgsAsObject = { };

buildArgs.forEach(function(arg) {
  var key = arg.split('=')[0],
      value = arg.split('=')[1];

  buildArgsAsObject[key] = value;
});

var modulesToInclude = buildArgsAsObject.modules ? buildArgsAsObject.modules.split(',') : [ ];
var modulesToExclude = buildArgsAsObject.exclude ? buildArgsAsObject.exclude.split(',') : [ ];

var minifier = buildArgsAsObject.minifier || 'uglifyjs';
var mininfierCmd;

if (minifier === 'yui') {
  mininfierCmd = 'java -jar lib/yuicompressor-2.4.6.jar dist/all.js -o dist/all.min.js';
}
else if (minifier === 'closure') {
  mininfierCmd = 'java -jar lib/google_closure_compiler.jar --js dist/all.js --js_output_file dist/all.min.js';
}
else if (minifier === 'uglifyjs') {
  mininfierCmd = 'uglifyjs --output dist/all.min.js dist/all.js';
}

var includeAllModules = modulesToInclude.length === 1 && modulesToInclude[0] === 'ALL';
var noStrict = 'no-strict' in buildArgsAsObject;

var distFileContents =
  '/* build: `node build.js modules=' +
    modulesToInclude.join(',') +
    (modulesToExclude.length ? (' exclude=' + modulesToExclude.join(',')) : '') +
    (noStrict ? ' no-strict' : '') +
  '` */\n';

function appendFileContents(fileNames, callback) {

  (function readNextFile() {

    if (fileNames.length <= 0) {
      return callback();
    }

    var fileName = fileNames.shift();

    if (!fileName) {
      return readNextFile();
    }

    fs.readFile(__dirname + '/' + fileName, function (err, data) {
      if (err) throw err;
      if (noStrict) {
        data = String(data).replace(/"use strict";?\n?/, '');
      }
      distFileContents += (data + '\n');
      readNextFile();
    });

  })();
}

function ifSpecifiedInclude(moduleName, fileName) {
  var isInIncludedList = modulesToInclude.indexOf(moduleName) > -1;
  var isInExcludedList = modulesToExclude.indexOf(moduleName) > -1;

  // excluded list takes precedence over modules=ALL
  return ((isInIncludedList || includeAllModules) && !isInExcludedList) ? fileName : '';
}

function ifSpecifiedDependencyInclude(included, excluded, fileName) {
  return (
    (
      (modulesToInclude.indexOf(included) > -1 || includeAllModules) &&
      (modulesToExclude.indexOf(excluded) == -1))
    ? fileName
    : ''
  );
}

var filesToInclude = [

  'HEADER.js',

  ifSpecifiedDependencyInclude('text', 'cufon', 'lib/cufon.js'),
  ifSpecifiedDependencyInclude('serialization', 'json', 'lib/json2.js'),

  ifSpecifiedInclude('gestures', 'lib/event.js'),

  'src/log.js',
  'src/observable.mixin.js',

  'src/util/misc.js',
  'src/util/lang_array.js',
  'src/util/lang_object.js',
  'src/util/lang_string.js',
  'src/util/lang_function.js',
  'src/util/lang_class.js',
  'src/util/dom_event.js',
  'src/util/dom_style.js',
  'src/util/dom_misc.js',
  'src/util/dom_request.js',

  ifSpecifiedInclude('easing', 'src/util/anim_ease.js'),

  ifSpecifiedInclude('parser', 'src/parser.js'),

  'src/gradient.class.js',
  'src/pattern.class.js',
  'src/shadow.class.js',
  'src/point.class.js',
  'src/intersection.class.js',
  'src/color.class.js',

  'src/static_canvas.class.js',

  ifSpecifiedInclude('freedrawing', 'src/freedrawing.class.js'),

  ifSpecifiedInclude('interaction', 'src/canvas.class.js'),
  ifSpecifiedInclude('interaction', 'src/canvas_events.mixin.js'),

  'src/canvas_animation.mixin.js',

  ifSpecifiedInclude('serialization', 'src/canvas_serialization.mixin.js'),
  ifSpecifiedInclude('gestures', 'src/canvas_gestures.mixin.js'),

  'src/object.class.js',
  'src/object_origin.mixin.js',
  'src/object_geometry.mixin.js',

  ifSpecifiedInclude('interaction', 'src/object_interactivity.mixin.js'),

  'src/line.class.js',
  'src/circle.class.js',
  'src/triangle.class.js',
  'src/ellipse.class.js',
  'src/rect.class.js',
  'src/polyline.class.js',
  'src/polygon.class.js',
  'src/path.class.js',
  'src/path_group.class.js',
  'src/group.class.js',
  'src/image.class.js',

  ifSpecifiedInclude('object_straightening', 'src/object_straightening.mixin.js'),

  ifSpecifiedInclude('image_filters', 'src/image_filters.js'),

  ifSpecifiedInclude('text', 'src/text.class.js'),

  ifSpecifiedInclude('node', 'src/node.js')
];

appendFileContents(filesToInclude, function() {
  fs.writeFile('dist/all.js', distFileContents, function (err) {
    if (err) {
      console.log(err);
      throw err;
    }

    console.log('Built distribution to dist/all.js');

    exec(mininfierCmd, function (error, output) {
      if (!error) {
        console.log('Minified using', minifier, 'to dist/all.min.js');
      }
      exec('gzip -c dist/all.min.js > dist/all.min.js.gz', function (error, output) {
        console.log('Gzipped to dist/all.min.js.gz');

        exec('ls -l dist', function (error, output) {
          console.log(output.replace(/^.*/, ''));
        });
      });
    });
  });
});
