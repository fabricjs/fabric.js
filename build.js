var fs = require('fs'),
    exec = require('child_process').exec;

var buildArgs = process.argv.slice(2),
    buildArgsAsObject = { },
    rootPath = process.cwd(),
    distributionPath = 'dist/';

buildArgs.forEach(function(arg) {
  var key = arg.split('=')[0],
      value = arg.split('=')[1];

  buildArgsAsObject[key] = value;
});

var modulesToInclude = buildArgsAsObject.modules ? buildArgsAsObject.modules.split(',') : [ ];
var modulesToExclude = buildArgsAsObject.exclude ? buildArgsAsObject.exclude.split(',') : [ ];

var minifier = buildArgsAsObject.minifier || 'uglifyjs';
var mininfierCmd;

var noStrict = 'no-strict' in buildArgsAsObject;
var noSVGExport = 'no-svg-export' in buildArgsAsObject;
var noES5Compat = 'no-es5-compat' in buildArgsAsObject;
var requirejs = 'requirejs' in buildArgsAsObject ? 'requirejs' : false;
var sourceMap = 'sourcemap' in buildArgsAsObject;

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
  sourceMapFlags = minifier === 'uglifyjs' ? ' --source-map all.min.js.map' : ' --create_source_map all.min.js.map --source_map_format=V3';
}

if (minifier === 'yui') {
  mininfierCmd = 'java -jar ' + rootPath + '/lib/yuicompressor-2.4.6.jar all.js -o all.min.js';
}
else if (minifier === 'closure') {
  mininfierCmd = 'java -jar ' + rootPath + '/lib/google_closure_compiler.jar --js all.js --js_output_file all.min.js' + sourceMapFlags;
}
else if (minifier === 'uglifyjs') {
  mininfierCmd = 'uglifyjs ' + amdUglifyFlags  + ' --output all.min.js all.js' + sourceMapFlags;
}

var buildSh = 'build-sh' in buildArgsAsObject;
var buildMinified = 'build-minified' in buildArgsAsObject;

var includeAllModules = (modulesToInclude.length === 1 && modulesToInclude[0] === 'ALL') || buildMinified;

var noSVGImport = (modulesToInclude.indexOf('parser') === -1 && !includeAllModules) || modulesToExclude.indexOf('parser') > -1;

var distFileContents =
  '/* build: `node build.js modules=' +
    modulesToInclude.join(',') +
    (modulesToExclude.length ? (' exclude=' + modulesToExclude.join(',')) : '') +
    (noStrict ? ' no-strict' : '') +
    (noSVGExport ? ' no-svg-export' : '') +
    (noES5Compat ? ' no-es5-compat' : '') +
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
      if (noStrict) {
        strData = strData.replace(/"use strict";?\n?/, '');
      }
      if (noSVGExport) {
        strData = strData.replace(/\/\* _TO_SVG_START_ \*\/[\s\S]*?\/\* _TO_SVG_END_ \*\//g, '');
      }
      if (noES5Compat) {
        strData = strData.replace(/\/\* _ES5_COMPAT_START_ \*\/[\s\S]*?\/\* _ES5_COMPAT_END_ \*\//g, '');
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

function ifSpecifiedDependencyInclude(included, excluded, fileName) {
  return (
    (
      (modulesToInclude.indexOf(included) > -1 || includeAllModules) &&
      (modulesToExclude.indexOf(excluded) == -1))
    ? fileName
    : ''
  );
}

function ifSpecifiedAMDInclude(amdLib) {
  var supportedLibraries = ['requirejs'];
  if (supportedLibraries.indexOf(amdLib) > -1) {
    return 'src/amd/' + amdLib + '.js';
  }
  return '';
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

  ifSpecifiedInclude('animation', 'src/util/animate.js'),
  //'src/util/animate.js',
  ifSpecifiedInclude('easing', 'src/util/anim_ease.js'),

  ifSpecifiedInclude('parser', 'src/parser.js'),

  'src/point.class.js',
  'src/intersection.class.js',
  'src/color.class.js',

  ifSpecifiedInclude('gradient', 'src/gradient.class.js'),
  ifSpecifiedInclude('pattern', 'src/pattern.class.js'),
  ifSpecifiedInclude('shadow', 'src/shadow.class.js'),

  'src/static_canvas.class.js',

  ifSpecifiedInclude('freedrawing', 'src/brushes/base_brush.class.js'),

  ifSpecifiedInclude('freedrawing', 'src/brushes/pencil_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'src/brushes/circle_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'src/brushes/spray_brush.class.js'),
  ifSpecifiedInclude('freedrawing', 'src/brushes/pattern_brush.class.js'),

  ifSpecifiedInclude('interaction', 'src/canvas.class.js'),
  ifSpecifiedInclude('interaction', 'src/mixins/canvas_events.mixin.js'),

  'src/mixins/canvas_dataurl_exporter.mixin.js',

  ifSpecifiedInclude('serialization', 'src/mixins/canvas_serialization.mixin.js'),
  ifSpecifiedInclude('gestures', 'src/mixins/canvas_gestures.mixin.js'),

  'src/shapes/object.class.js',
  'src/mixins/object_origin.mixin.js',
  'src/mixins/object_geometry.mixin.js',
  'src/mixins/stateful.mixin.js',

  ifSpecifiedInclude('interaction', 'src/mixins/object_interactivity.mixin.js'),

  ifSpecifiedInclude('animation', 'src/mixins/animation.mixin.js'),
  //'src/mixins/animation.mixin.js',

  'src/shapes/line.class.js',
  'src/shapes/circle.class.js',
  'src/shapes/triangle.class.js',
  'src/shapes/ellipse.class.js',
  'src/shapes/rect.class.js',
  'src/shapes/polyline.class.js',
  'src/shapes/polygon.class.js',
  'src/shapes/path.class.js',
  'src/shapes/path_group.class.js',
  'src/shapes/group.class.js',
  'src/shapes/image.class.js',

  ifSpecifiedInclude('object_straightening', 'src/mixins/object_straightening.mixin.js'),

  ifSpecifiedInclude('image_filters', 'src/filters/base_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/brightness_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/convolute_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/gradienttransparency_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/grayscale_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/invert_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/mask_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/noise_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/pixelate_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/removewhite_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/sepia_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/sepia2_filter.class.js'),
  ifSpecifiedInclude('image_filters', 'src/filters/tint_filter.class.js'),

  ifSpecifiedInclude('text', 'src/shapes/text.class.js'),
  ifSpecifiedInclude('cufon', 'src/shapes/text.cufon.js'),

  ifSpecifiedInclude('node', 'src/node.js'),

  ifSpecifiedAMDInclude(amdLib)
];

if (buildMinified) {
  for (var i = 0; i < filesToInclude.length; i++) {
    if (!filesToInclude[i]) continue;
    var fileNameWithoutSlashes = filesToInclude[i].replace(/\//g, '^');
    exec('uglifyjs -nc ' + amdUglifyFlags + filesToInclude[i] + ' > tmp/' + fileNameWithoutSlashes);
  }
}
else if (buildSh) {

  var filesStr = filesToInclude.join(' ');
  var isBasicBuild = modulesToInclude.length === 0;

  var minFilesStr = filesToInclude
    .filter(function(f) { return f !== '' })
    .map(function(fileName) {
      return 'tmp/' + fileName.replace(/\//g, '^');
    })
    .join(' ');

  var fileName = isBasicBuild ? 'fabric' : modulesToInclude.join(',');

  var escapedHeader = distFileContents.replace(/`/g, '\\`');
  var path = '../fabricjs.com/build/files/' + fileName + '.js';
  fs.appendFile('build.sh',
    'echo "' + escapedHeader + '" > ' + path + ' && cat ' +
    filesStr + ' >> ' + path + '\n');

  path = '../fabricjs.com/build/files/' + fileName + '.min.js';
  fs.appendFile('build.sh',
    'echo "' + escapedHeader + '" > ' + path + ' && cat ' +
    minFilesStr + ' >> ' + path + '\n')
}
else {
  // Change the current working directory
  process.chdir(distributionPath);

  appendFileContents(filesToInclude, function() {
    fs.writeFile('all.js', distFileContents, function (err) {
      if (err) {
        console.log(err);
        throw err;
      }

      // add js wrapping in AMD closure for requirejs if necessary
      if (amdLib !== false) {
        exec('uglifyjs all.js ' + amdUglifyFlags + ' -b --output all.js');
      }

      if (amdLib !== false) {
        console.log('Built distribution to ' + distributionPath + 'all.js (' + amdLib + '-compatible)');
      } else {
        console.log('Built distribution to ' + distributionPath + 'all.js');
      }

      exec(mininfierCmd, function (error, output) {
        if (error) {
          console.error('Minification failed using', minifier, 'with', mininfierCmd);
          process.exit(1);
        }
        console.log('Minified using', minifier, 'to ' + distributionPath + 'all.min.js');

        if (sourceMapFlags) {
          console.log('Built sourceMap to ' + distributionPath + 'all.min.js.map');
        }

        exec('gzip -c all.min.js > all.min.js.gz', function (error, output) {
          console.log('Gzipped to ' + distributionPath + 'all.min.js.gz');
        });
      });

      // Always build requirejs AMD module in all.require.js
      // add necessary requirejs footer code to filesToInclude if we haven't before
      if (amdLib === false) {
        amdLib = "requirejs";
        filesToInclude[filesToInclude.length] = ifSpecifiedAMDInclude(amdLib);
      }

      appendFileContents(filesToInclude, function() {
        fs.writeFile('all.require.js', distFileContents, function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
          exec('uglifyjs all.require.js ' + amdUglifyFlags + ' -b --output all.require.js');
          console.log('Built distribution to ' + distributionPath + 'all.require.js (requirejs-compatible)');
        });
      });

    });
  });
}
