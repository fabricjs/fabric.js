var f = require('fabric'),
    __fabric = global.fabric = f.fabric,
    // Cufon = global.Cufon = modFabric.Cufon,
    http = require('http'),
    url = require('url'),
    PORT = 8124;

// Fetch font definitions
// var fileNames = fs.readdirSync(RAILS_ROOT + '/public/javascripts/fonts');
// fileNames.forEach(function(fileName) {
//   if (fileName.charAt(0) === '.') return;
//   require(RAILS_ROOT + '/public/javascripts/fonts/' + fileName);
// });
// require('font_definitions.js');
// if (typeof __fontDefinitions !== 'undefined') {
//   for (var fontName in __fontDefinitions) {
//     if (Cufon.fonts[fontName.toLowerCase()]) {
//       Cufon.fonts[fontName.toLowerCase()].offsetLeft = __fontDefinitions[fontName];
//     }
//   }
// }
// else {
//   console.log('Failed to include font definitions file');
// }

var server = http.createServer(function (request, response) {
  var params = url.parse(request.url, true);
  serveImage(response, params.query.code, params.query.async);
});

server.listen(PORT);

console.log('Server listening on http://localhost:' + PORT);

function serveImage(__response, __code, __async) {
  var canvas = __fabric.createCanvasForNode(200, 200);

  eval(__code);

  __response.writeHead(200, { 'Content-Type': 'image/png' });

  if (__async !== 'true') {
    proceed();
  }

  function proceed() {
    canvas.renderAll();
    var __stream = canvas.createPNGStream();
    __stream.on('data', function(chunk) {
      __response.write(chunk);
    });
    __stream.on('end', function() {
      __response.end();
    });
  }
}