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
var noSVGExport = 'no-svg-export' in buildArgsAsObject;
var noES5Compat = 'no-es5-compat' in buildArgsAsObject;

var distFileContents =
  '/* build: `node build.js modules=' +
    modulesToInclude.join(',') +
    (modulesToExclude.length ? (' exclude=' + modulesToExclude.join(',')) : '') +
    (noStrict ? ' no-strict' : '') +
    (noSVGExport ? ' no-svg-export' : '') +
    (noES5Compat ? ' no-es5-compat' : '') +
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
      var strData = String(data);
      if (noStrict) {
        strData = strData.replace(/"use strict";?\n?/, '');
      }
      if (noSVGExport) {
        strData = strData.replace(/\/\* _TO_SVG_START_ \*\/[\s\S]*\/\* _TO_SVG_END_ \*\//, '');
      }
      if (noES5Compat) {
        strData = strData.replace(/\/\* _ES5_COMPAT_START_ \*\/[\s\S]*\/\* _ES5_COMPAT_END_ \*\//, '');
      }
      distFileContents += (strData + '\n');
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
  'src/mixins/observable.mixin.js',
  'src/mixins/collection.mixin.js',

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

  ifSpecifiedInclude('freedrawing', 'src/brushes/base_brush.class.js'),

  ifSpecifiedInclude('freedrawing', 'src/brushes/pencil_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'src/brushes/circle_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'src/brushes/spray_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'src/brushes/pattern_brush.class.js'),

  ifSpecifiedInclude('interaction', 'src/canvas.class.js'),
  ifSpecifiedInclude('interaction', 'src/mixins/canvas_events.mixin.js'),

  'src/mixins/canvas_animation.mixin.js',

  ifSpecifiedInclude('serialization', 'src/mixins/canvas_serialization.mixin.js'),
  ifSpecifiedInclude('gestures', 'src/mixins/canvas_gestures.mixin.js'),

  'src/object.class.js',
  'src/mixins/object_origin.mixin.js',
  'src/mixins/object_geometry.mixin.js',

  ifSpecifiedInclude('stateful', 'src/mixins/stateful.mixin.js'),

  ifSpecifiedInclude('interaction', 'src/mixins/object_interactivity.mixin.js'),

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

  ifSpecifiedInclude('object_straightening', 'src/mixins/object_straightening.mixin.js'),

  ifSpecifiedInclude('image_filters', 'src/filters/brightness_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/convolute_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/gradienttransparency_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/grayscale_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/invert_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/noise_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/pixelate_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/removewhite_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/sepia_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/sepia2_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/tint_filter.class.js'),

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
