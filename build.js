var fs = require('fs'),
    childProcess = require('child_process');

var modules = process.argv.slice(2)[0];
modules = modules ? modules.split('=')[1].split(',') : [ ];

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
  'src/util/lang_array.js',
  'src/util/lang_object.js',
  'src/util/lang_string.js',
  'src/util/lang_function.js',
  'src/util/lang_class.js',
  'src/util/dom_event.js',
  'src/util/dom_style.js',
  'src/util/dom_misc.js',
  'src/util/dom_request.js',
  
  ifSpecifiedInclude('parser', 'src/parser.js'),
  
  'src/gradient.js',
  'src/point.class.js',
  'src/intersection.class.js',
  'src/color.class.js',
  
  'src/canvas.class.js',
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
  
  ifSpecifiedInclude('node', 'lib/fabric_node.js')
];

appendFileContents(filesToInclude, function() {
  fs.writeFile('dist/all.js', distFileContents, function (err) {
    if (err) {
      console.log(err);
      throw err;
    };
    console.log('All done');
  });
});