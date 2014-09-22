(function() {

  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    return;
  }

  var DOMParser = require('xmldom').DOMParser,
      URL = require('url'),
      HTTP = require('http'),
      HTTPS = require('https'),

      Canvas = require('canvas'),
      Image = require('canvas').Image;

  /** @private */
  function request(url, encoding, callback) {
    var oURL = URL.parse(url);

    // detect if http or https is used
    if ( !oURL.port ) {
      oURL.port = ( oURL.protocol.indexOf('https:') === 0 ) ? 443 : 80;
    }

    // assign request handler based on protocol
    var reqHandler = ( oURL.port === 443 ) ? HTTPS : HTTP,
        req = reqHandler.request({
          hostname: oURL.hostname,
          port: oURL.port,
          path: oURL.path,
          method: 'GET'
        }, function(response) {
          var body = '';
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

    req.end();
  }

  /** @private */
  function requestFs(path, callback) {
    var fs = require('fs');
    fs.readFile(path, function (err, data) {
      if (err) {
        fabric.log(err);
        throw err;
      }
      else {
        callback(data);
      }
    });
  }

  fabric.util.loadImage = function(url, callback, context) {
    function createImageAndCallBack(data) {
      img.src = new Buffer(data, 'binary');
      // preserving original url, which seems to be lost in node-canvas
      img._src = url;
      callback && callback.call(context, img);
    }
    var img = new Image();
    if (url && (url instanceof Buffer || url.indexOf('data') === 0)) {
      img.src = img._src = url;
      callback && callback.call(context, img);
    }
    else if (url && url.indexOf('http') !== 0) {
      requestFs(url, createImageAndCallBack);
    }
    else if (url) {
      request(url, 'binary', createImageAndCallBack);
    }
    else {
      callback && callback.call(context, url);
    }
  };

  fabric.loadSVGFromURL = function(url, callback, reviver) {
    url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').trim();
    if (url.indexOf('http') !== 0) {
      requestFs(url, function(body) {
        fabric.loadSVGFromString(body.toString(), callback, reviver);
      });
    }
    else {
      request(url, '', function(body) {
        fabric.loadSVGFromString(body, callback, reviver);
      });
    }
  };

  fabric.loadSVGFromString = function(string, callback, reviver) {
    var doc = new DOMParser().parseFromString(string);
    fabric.parseSVGDocument(doc.documentElement, function(results, options) {
      callback && callback(results, options);
    }, reviver);
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
      oImg._initFilters(object, function(filters) {
        oImg.filters = filters || [ ];
        callback && callback(oImg);
      });
    });
  };

  /**
   * Only available when running fabric on node.js
   * @param {Number} width Canvas width
   * @param {Number} height Canvas height
   * @param {Object} [options] Options to pass to FabricCanvas.
   * @param {Object} [nodeCanvasOptions] Options to pass to NodeCanvas.
   * @return {Object} wrapped canvas instance
   */
  fabric.createCanvasForNode = function(width, height, options, nodeCanvasOptions) {
    nodeCanvasOptions = nodeCanvasOptions || options;

    var canvasEl = fabric.document.createElement('canvas'),
        nodeCanvas = new Canvas(width || 600, height || 600, nodeCanvasOptions);

    // jsdom doesn't create style on canvas element, so here be temp. workaround
    canvasEl.style = { };

    canvasEl.width = nodeCanvas.width;
    canvasEl.height = nodeCanvas.height;

    var FabricCanvas = fabric.Canvas || fabric.StaticCanvas,
        fabricCanvas = new FabricCanvas(canvasEl, options);

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
  fabric.StaticCanvas.prototype.setWidth = function(width, options) {
    origSetWidth.call(this, width, options);
    this.nodeCanvas.width = width;
    return this;
  };
  if (fabric.Canvas) {
    fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth;
  }

  var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
  fabric.StaticCanvas.prototype.setHeight = function(height, options) {
    origSetHeight.call(this, height, options);
    this.nodeCanvas.height = height;
    return this;
  };
  if (fabric.Canvas) {
    fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight;
  }

})();
