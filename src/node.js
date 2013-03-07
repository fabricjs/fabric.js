(function() {

  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    return;
  }

  var DOMParser = new require('xmldom').DOMParser,
      URL = require('url'),
      HTTP = require('http'),

      Canvas = require('canvas'),
      Image = require('canvas').Image;

  /** @private */
  function request(url, encoding, callback) {
    var oURL = URL.parse(url),
    req = HTTP.request({
      hostname: oURL.hostname,
      port: oURL.port,
      path: oURL.pathname,
      method: 'GET'
    }, function(response){
      var body = "";
      if (encoding) {
        response.setEncoding(encoding);
      }
      response.on('end', function () {
        callback(body);
      });
      response.on('data', function (chunk) {
        if (response.statusCode === 200) {
          body += chunk;
        }
      });
    });

    req.on('error', function(err) {
      if (err.errno === process.ECONNREFUSED) {
        fabric.log('ECONNREFUSED: connection refused to ' + oURL.hostname + ':' + oURL.port);
      }
      else {
        fabric.log(err.message);
      }
    });
  }

  /** @private */
  function request_fs(url, callback){
    var fs = require('fs'),
    stream = fs.createReadStream(url),
    body = '';
    stream.on('data', function(chunk){
        body += chunk;
    });
    stream.on('end', function(){
      callback(body);
    });
  }

  fabric.util.loadImage = function(url, callback, context) {
    var createImageAndCallBack = function(data){
      img.src = new Buffer(data, 'binary');
      // preserving original url, which seems to be lost in node-canvas
      img._src = url;
      callback && callback.call(context, img);
    };
    var img = new Image();
    if (url && url.indexOf('data') === 0) {
      img.src = img._src = url;
      callback && callback.call(context, img);
    }
    else if (url && url.indexOf('http') !== 0) {
      request_fs(url, createImageAndCallBack);
    }
    else if (url) {
      request(url, 'binary', createImageAndCallBack);
    }
  };

  fabric.loadSVGFromURL = function(url, callback) {
    url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').trim();
    request(url, '', function(body) {
      fabric.loadSVGFromString(body, callback);
    });
  };

  fabric.loadSVGFromString = function(string, callback) {
    var doc = new DOMParser().parseFromString(string);
    fabric.parseSVGDocument(doc.documentElement, function(results, options) {
      callback(results, options);
    });
  };

  fabric.util.getScript = function(url, callback) {
    request(url, '', function(body) {
      eval(body);
      callback && callback();
    });
  };

  fabric.Image.fromObject = function(object, callback) {
    fabric.util.loadImage(object.src, function(img) {
      var oImg = new fabric.Image(img);

      oImg._initConfig(object);
      oImg._initFilters(object);
      callback(oImg);
    });
  };

  /**
   * Only available when running fabric on node.js
   * @method createCanvasForNode
   * @param width Canvas width
   * @param height Canvas height
   * @return {Object} wrapped canvas instance
   */
  fabric.createCanvasForNode = function(width, height) {

    var canvasEl = fabric.document.createElement('canvas'),
        nodeCanvas = new Canvas(width || 600, height || 600);

    // jsdom doesn't create style on canvas element, so here be temp. workaround
    canvasEl.style = { };

    canvasEl.width = nodeCanvas.width;
    canvasEl.height = nodeCanvas.height;

    var FabricCanvas = fabric.Canvas || fabric.StaticCanvas;
    var fabricCanvas = new FabricCanvas(canvasEl);
    fabricCanvas.contextContainer = nodeCanvas.getContext('2d');
    fabricCanvas.nodeCanvas = nodeCanvas;
    fabricCanvas.Font = Canvas.Font;

    return fabricCanvas;
  };

  /** @ignore */
  fabric.StaticCanvas.prototype.createPNGStream = function() {
    return this.nodeCanvas.createPNGStream();
  };

  fabric.StaticCanvas.prototype.createJPEGStream = function(opts) {
    return this.nodeCanvas.createJPEGStream(opts);
  };

  var origSetWidth = fabric.StaticCanvas.prototype.setWidth;
  fabric.StaticCanvas.prototype.setWidth = function(width) {
    origSetWidth.call(this, width);
    this.nodeCanvas.width = width;
    return this;
  };
  if (fabric.Canvas) {
    fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth;
  }

  var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
  fabric.StaticCanvas.prototype.setHeight = function(height) {
    origSetHeight.call(this, height);
    this.nodeCanvas.height = height;
    return this;
  };
  if (fabric.Canvas) {
    fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight;
  }

})();
