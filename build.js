var fs = require('fs'),
    exec = require('child_process').exec,
    execSync = require('child_process').execSync;

var buildArgs = process.argv.slice(2),
    buildArgsAsObject = { },
    rootPath = process.cwd();

buildArgs.forEach(function(arg) {
  var key = arg.split('=')[0],
      value = arg.split('=')[1];

  buildArgsAsObject[key] = value;
});

try {
  execSync('npm run tsc', { stdio: 'inherit' });
} catch (error) {
  
}

var modulesToInclude = buildArgsAsObject.modules ? buildArgsAsObject.modules.split(',') : [];
var modulesToExclude = buildArgsAsObject.exclude ? buildArgsAsObject.exclude.split(',') : [];

var distributionPath = buildArgsAsObject.dest || 'dist/';
var minifier = buildArgsAsObject.minifier || 'uglifyjs';
var mininfierCmd;

var noStrict = 'no-strict' in buildArgsAsObject;
var noSVGExport = 'no-svg-export' in buildArgsAsObject;
var requirejs = 'requirejs' in buildArgsAsObject ? 'requirejs' : false;
var sourceMap = 'sourcemap' in buildArgsAsObject;
var buildFast = 'fast' in buildArgsAsObject;
// set amdLib var to encourage later support of other AMD systems
var amdLib = requirejs;

// if we want requirejs AMD support, use uglify
var amdUglifyFlags = '';
if (amdLib === 'requirejs' && minifier !== 'uglifyjs') {
  console.log('[notice]: require.js support requires uglifyjs as minifier; changed minifier to uglifyjs.');
  minifier = 'uglifyjs';
  amdUglifyFlags = " -r 'require,exports,window,fabric' -e window:window,undefined ";
}

// if we want sourceMap support, uglify or google closure compiler are supported
var sourceMapFlags = '';
if (sourceMap) {
  if (minifier !== 'uglifyjs' && minifier !== 'closure') {
    console.log('[notice]: sourceMap support requires uglifyjs or google closure compiler as minifier; changed minifier to uglifyjs.');
    minifier = 'uglifyjs';
  }
  sourceMapFlags = minifier === 'uglifyjs' ? ' --source-map fabric.min.js.map' : ' --create_source_map fabric.min.js.map --source_map_format=V3';
}

if (minifier === 'yui') {
  mininfierCmd = 'java -jar ' + rootPath + '/lib/yuicompressor-2.4.6.jar fabric.js -o fabric.min.js';
}
else if (minifier === 'closure') {
  mininfierCmd = 'java -jar ' + rootPath + '/lib/google_closure_compiler.jar --js fabric.js --js_output_file fabric.min.js' + sourceMapFlags;
}
else if (minifier === 'uglifyjs') {
  mininfierCmd = 'uglifyjs ' + amdUglifyFlags + ' --compress --mangle --output fabric.min.js fabric.js' + sourceMapFlags;
}

var buildMinified = 'build-minified' in buildArgsAsObject;

var includeAllModules = (modulesToInclude.length === 1 && modulesToInclude[0] === 'ALL') || buildMinified;

var noSVGImport = (modulesToInclude.indexOf('parser') === -1 && !includeAllModules) || modulesToExclude.indexOf('parser') > -1;

var distFileContents =
  '/* build: `node build.js modules=' +
    modulesToInclude.join(',') +
    (modulesToExclude.length ? (' exclude=' + modulesToExclude.join(',')) : '') +
    (noStrict ? ' no-strict' : '') +
    (noSVGExport ? ' no-svg-export' : '') +
    (requirejs ? ' requirejs' : '') +
    (sourceMap ? ' sourcemap' : '') +
    ' minifier=' + minifier +
  '` */';

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
      if (fileName === 'dist/HEADER.js' && amdLib === false) {
        strData = strData.replace(/\/\* _AMD_START_ \*\/[\s\S]*?\/\* _AMD_END_ \*\//g, '');
      }
      if (noStrict) {
        strData = strData.replace(/"use strict";?\n?/, '');
      }
      if (noSVGExport) {
        strData = strData.replace(/\/\* _TO_SVG_START_ \*\/[\s\S]*?\/\* _TO_SVG_END_ \*\//g, '');
      }
      if (noSVGImport) {
        strData = strData.replace(/\/\* _FROM_SVG_START_ \*\/[\s\S]*?\/\* _FROM_SVG_END_ \*\//g, '');
      }
      distFileContents += ('\n' + strData + '\n');
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

var filesToInclude = [
  'HEADER.js',
  ifSpecifiedInclude('global', 'dist/globalFabric.js'),
  ifSpecifiedInclude('gestures', 'lib/event.js'),

  'dist/mixins/observable.mixin.js',
  'dist/mixins/collection.mixin.js',
  'dist/mixins/shared_methods.mixin.js',
  'dist/util/misc.js',
  ifSpecifiedInclude('accessors', 'dist/util/named_accessors.mixin.js'),
  'dist/util/path.js',
  'dist/util/lang_array.js',
  'dist/util/lang_object.js',
  'dist/util/lang_string.js',
  'dist/util/lang_class.js',
  ifSpecifiedInclude('interaction', 'dist/util/dom_event.js'),
  'dist/util/dom_style.js',
  'dist/util/dom_misc.js',
  'dist/util/dom_request.js',

  'dist/log.js',

  ifSpecifiedInclude('animation', 'dist/util/animate.js'),
  ifSpecifiedInclude('animation', 'dist/util/animate_color.js'),
  //'dist/util/animate.js',
  ifSpecifiedInclude('easing', 'dist/util/anim_ease.js'),

  ifSpecifiedInclude('parser', 'dist/parser.js'),
  ifSpecifiedInclude('parser', 'dist/elements_parser.js'),

  'dist/point.class.js',
  'dist/intersection.class.js',
  'dist/color.class.js',
  ifSpecifiedInclude('interaction', 'dist/controls.actions.js'),
  ifSpecifiedInclude('interaction', 'dist/controls.render.js'),
  ifSpecifiedInclude('interaction', 'dist/control.class.js'),

  ifSpecifiedInclude('gradient', 'dist/gradient.class.js'),
  ifSpecifiedInclude('pattern', 'dist/pattern.class.js'),
  ifSpecifiedInclude('shadow', 'dist/shadow.class.js'),

  'dist/static_canvas.class.js',

  ifSpecifiedInclude('freedrawing', 'dist/brushes/base_brush.class.js'),

  ifSpecifiedInclude('freedrawing', 'dist/brushes/pencil_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'dist/brushes/circle_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'dist/brushes/spray_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'dist/brushes/pattern_brush.class.js'),

  ifSpecifiedInclude('interaction', 'dist/canvas.class.js'),
  ifSpecifiedInclude('interaction', 'dist/mixins/canvas_events.mixin.js'),
  ifSpecifiedInclude('interaction', 'dist/mixins/canvas_grouping.mixin.js'),

  'dist/mixins/canvas_dataurl_exporter.mixin.js',

  ifSpecifiedInclude('serialization', 'dist/mixins/canvas_serialization.mixin.js'),
  ifSpecifiedInclude('gestures', 'dist/mixins/canvas_gestures.mixin.js'),

  'dist/shapes/object.class.js',
  'dist/mixins/object_origin.mixin.js',
  'dist/mixins/object_geometry.mixin.js',
  'dist/mixins/object_ancestry.mixin.js',
  'dist/mixins/object_stacking.mixin.js',
  'dist/mixins/object.svg_export.js',
  'dist/mixins/stateful.mixin.js',

  ifSpecifiedInclude('interaction', 'dist/mixins/object_interactivity.mixin.js'),

  ifSpecifiedInclude('animation', 'dist/mixins/animation.mixin.js'),

  'dist/shapes/line.class.js',
  'dist/shapes/circle.class.js',
  'dist/shapes/triangle.class.js',
  'dist/shapes/ellipse.class.js',
  'dist/shapes/rect.class.js',
  'dist/shapes/polyline.class.js',
  'dist/shapes/polygon.class.js',
  'dist/shapes/path.class.js',
  'dist/shapes/group.class.js',
  ifSpecifiedInclude('interaction', 'dist/shapes/active_selection.class.js'),
  'dist/shapes/image.class.js',

  ifSpecifiedInclude('object_straightening', 'dist/mixins/object_straightening.mixin.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/webgl_backend.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/2d_backend.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/base_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/colormatrix_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/brightness_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/convolute_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/grayscale_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/invert_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/noise_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/pixelate_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/removecolor_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/filter_generator.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/blendcolor_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/blendimage_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/resize_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/contrast_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/saturate_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/vibrance_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/blur_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/gamma_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/composed_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'dist/filters/hue_rotation.class.js'),

  ifSpecifiedInclude('text', 'dist/shapes/text.class.js'),
  ifSpecifiedInclude('text', 'dist/mixins/text_style.mixin.js'),

  ifSpecifiedInclude('itext', 'dist/shapes/itext.class.js'),
  ifSpecifiedInclude('itext', 'dist/mixins/itext_behavior.mixin.js'),
  ifSpecifiedInclude('itext', 'dist/mixins/itext_click_behavior.mixin.js'),
  ifSpecifiedInclude('itext', 'dist/mixins/itext_key_behavior.mixin.js'),
  ifSpecifiedInclude('itext', 'dist/mixins/itext.svg_export.js'),

  ifSpecifiedInclude('textbox', 'dist/shapes/textbox.class.js'),
  ifSpecifiedInclude('interaction', 'dist/mixins/default_controls.js'),

  //  extends fabric.StaticCanvas, fabric.Canvas, fabric.Object, depends on fabric.PencilBrush and fabric.Rect
  ifSpecifiedInclude('erasing', 'dist/mixins/eraser_brush.mixin.js'),
];

if (buildMinified) {
  for (var i = 0; i < filesToInclude.length; i++) {
    if (!filesToInclude[i]) continue;
    var fileNameWithoutSlashes = filesToInclude[i].replace(/\//g, '^');
    exec('uglifyjs -nc ' + amdUglifyFlags + filesToInclude[i] + ' > tmp/' + fileNameWithoutSlashes);
  }
}
else {
  // change the current working directory
  process.chdir(distributionPath);

  appendFileContents(filesToInclude, function() {
    fs.writeFile('fabric.js', distFileContents, function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (buildFast) {
        process.exit(0);
      }

      if (amdLib !== false) {
        console.log('Built distribution to ' + distributionPath + 'fabric.js (' + amdLib + '-compatible)');
      } else {
        console.log('Built distribution to ' + distributionPath + 'fabric.js');
      }

      exec(mininfierCmd, function (error, output) {
        if (error) {
          console.error('Minification failed using', minifier, 'with', mininfierCmd);
          console.error('Minifier error output:\n' + error);
          process.exit(1);
        }
        console.log('Minified using', minifier, 'to ' + distributionPath + 'fabric.min.js');

        if (sourceMapFlags) {
          console.log('Built sourceMap to ' + distributionPath + 'fabric.min.js.map');
        }

        exec('gzip -c fabric.min.js > fabric.min.js.gz', function (error, output) {
          console.log('Gzipped to ' + distributionPath + 'fabric.min.js.gz');
        });
      });

    });
  });
}
