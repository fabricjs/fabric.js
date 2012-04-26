var fs = require('fs'),
    exec = require('child_process').exec;

var modules = process.argv.slice(2)[0];
modules = modules ? modules.split('=')[1].split(',') : [ ];

var minifier = process.argv.slice(3)[0];
var mininfierCmd;

minifier = minifier ? minifier.split('=')[1] : 'yui';
if (minifier === 'yui') {
  mininfierCmd = 'java -jar lib/yuicompressor-2.4.2.jar dist/all.js -o dist/all.min.js';
}
else if (minifier === 'closure') {
  mininfierCmd = 'java -jar lib/google_closure_compiler.jar --js dist/all.js --js_output_file dist/all.min.js';
}

var includeAllModules = modules.length === 1 && modules[0] === 'ALL';

var distFileContents = '';

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
      distFileContents += (data + '\n');
      readNextFile();
    });
    
  })();
}

function ifSpecifiedInclude(moduleName, fileName) {
  return (modules.indexOf(moduleName) > -1 || includeAllModules) ? fileName : '';
}

var filesToInclude = [

  'HEADER.js',
  
  ifSpecifiedInclude('serialization', 'lib/json2.js'),
  ifSpecifiedInclude('text', 'lib/cufon.js'),
  
  'src/log.js',
  'src/observable.js',
  
  'src/util/misc.js',
  'src/util/anim_ease.js',
  'src/util/lang_array.js',
  'src/util/lang_object.js',
  'src/util/lang_string.js',
  'src/util/lang_function.js',
  'src/util/lang_class.js',
  'src/util/dom_event.js',
  'src/util/dom_style.js',
  'src/util/dom_misc.js',
  'src/util/dom_request.js',
<<<<<<< HEAD
=======
  
>>>>>>> 383665d2363f00dd1a577207837b7dc326e04ed8
  
  ifSpecifiedInclude('easing', 'src/util/anim_ease.js'),

  ifSpecifiedInclude('parser', 'src/parser.js'),
  
  'src/gradient.js',
  'src/point.class.js',
  'src/intersection.class.js',
  'src/color.class.js',
  
  'src/static_canvas.class.js',
  ifSpecifiedInclude('interaction', 'src/canvas.class.js'),
  
  'src/canvas.animation.js',
  
  ifSpecifiedInclude('serialization', 'src/canvas.serialization.js'),
  
  'src/object.class.js',
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
  
  ifSpecifiedInclude('image_filters', 'src/image_filters.js'),
  
  ifSpecifiedInclude('text', 'src/text.class.js'),
  
  ifSpecifiedInclude('node', 'src/fabric_node.js')
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