var XML = require('o3-xml'),
    URL = require('url'),
    HTTP = require('http'),
    
    fabric = require('./fabric.js').fabric,
    Image = require('./lib/canvas').Image;

function request(url, encoding, callback) {
  var oURL = URL.parse(url),
      client = HTTP.createClient(80, oURL.hostname),
      request = client.request('GET', oURL.pathname, { 'host': oURL.hostname });

  request.end();
  request.on('response', function (response) {
    var body = "";
    if (encoding) {
      response.setEncoding(encoding);
    }
    response.on('end', function () {
      callback(body);
    });
    response.on('data', function (chunk) {
      if (response.statusCode == 200) {
        body += chunk;
      }
    });
  });
}

fabric.Canvas.prototype.loadImageFromURL = function(url, callback) {
  request(url, 'binary', function(body) {
    var img = new Image();
    img.src = new Buffer(body, 'binary');
    callback(new fabric.Image(img));
  });
};

fabric.loadSVGFromURL = function(url, callback) {
  url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').trim();
  request(url, '', function(body) {
    var doc = XML.parseFromString(body);
    fabric.parseSVGDocument(doc.documentElement, function(results, options) {
      callback(results, options);
    });
  });
};

fabric.Image.fromObject = function(object, callback) {
  fabric.Canvas.prototype.loadImageFromURL(object.src, function(oImg) {
    oImg._initConfig(object);
    callback(oImg);
  });
};

fabric.createCanvasForNode = function(nodeCanvas) {
  var canvasEl = fabric.document.createElement('canvas');

  // jsdom doesn't create style on canvas element, so here be temp. workaround 
  canvasEl.style = { };
  
  canvasEl.width = nodeCanvas.width;
  canvasEl.height = nodeCanvas.height;

  var fabricCanvas = new fabric.Canvas(canvasEl);
  fabricCanvas.contextContainer = nodeCanvas.getContext('2d');
  
  return fabricCanvas;
};