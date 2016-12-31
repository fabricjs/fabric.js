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
    var reqHandler = (oURL.protocol.indexOf('https:') === 0 ) ? HTTPS : HTTP,
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
      callback(null);
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
      if (data) {
        img.src = new Buffer(data, 'binary');
        // preserving original url, which seems to be lost in node-canvas
        img._src = url;
        callback && callback.call(context, img);
      }
      else {
        img = null;
        callback && callback.call(context, null, true);
      }
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
      // eslint-disable-next-line no-eval
      eval(body);
      callback && callback();
    });
  };

  // fabric.util.createCanvasElement = function(_, width, height) {
  //   return new Canvas(width, height);
  // }

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
        nodeCanvas = new Canvas(width || 600, height || 600, nodeCanvasOptions),
        nodeCacheCanvas = new Canvas(width || 600, height || 600, nodeCanvasOptions);

    // jsdom doesn't create style on canvas element, so here be temp. workaround
    canvasEl.style = { };

    canvasEl.width = nodeCanvas.width;
    canvasEl.height = nodeCanvas.height;
    options = options || { };
    options.nodeCanvas = nodeCanvas;
    options.nodeCacheCanvas = nodeCacheCanvas;
    var FabricCanvas = fabric.Canvas || fabric.StaticCanvas,
        fabricCanvas = new FabricCanvas(canvasEl, options);
    fabricCanvas.nodeCanvas = nodeCanvas;
    fabricCanvas.nodeCacheCanvas = nodeCacheCanvas;
    fabricCanvas.contextContainer = nodeCanvas.getContext('2d');
    fabricCanvas.contextCache = nodeCacheCanvas.getContext('2d');
    fabricCanvas.Font = Canvas.Font;
    return fabricCanvas;
  };

  var originaInitStatic = fabric.StaticCanvas.prototype._initStatic;
  fabric.StaticCanvas.prototype._initStatic = function(el, options) {
    el = el || fabric.document.createElement('canvas');
    this.nodeCanvas = new Canvas(el.width, el.height);
    this.nodeCacheCanvas = new Canvas(el.width, el.height);
    originaInitStatic.call(this, el, options);
    this.contextContainer = this.nodeCanvas.getContext('2d');
    this.contextCache = this.nodeCacheCanvas.getContext('2d');
    this.Font = Canvas.Font;
  };

  /** @ignore */
  fabric.StaticCanvas.prototype.createPNGStream = function() {
    return this.nodeCanvas.createPNGStream();
  };

  fabric.StaticCanvas.prototype.createJPEGStream = function(opts) {
    return this.nodeCanvas.createJPEGStream(opts);
  };

  fabric.StaticCanvas.prototype._initRetinaScaling = function() {
    if (!this._isRetinaScaling()) {
      return;
    }

    this.lowerCanvasEl.setAttribute('width', this.width * fabric.devicePixelRatio);
    this.lowerCanvasEl.setAttribute('height', this.height * fabric.devicePixelRatio);
    this.nodeCanvas.width = this.width * fabric.devicePixelRatio;
    this.nodeCanvas.height = this.height * fabric.devicePixelRatio;
    this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio);
    return this;
  };
  if (fabric.Canvas) {
    fabric.Canvas.prototype._initRetinaScaling = fabric.StaticCanvas.prototype._initRetinaScaling;
  }

  var origSetBackstoreDimension = fabric.StaticCanvas.prototype._setBackstoreDimension;
  fabric.StaticCanvas.prototype._setBackstoreDimension = function(prop, value) {
    origSetBackstoreDimension.call(this, prop, value);
    this.nodeCanvas[prop] = value;
    return this;
  };
  if (fabric.Canvas) {
    fabric.Canvas.prototype._setBackstoreDimension = fabric.StaticCanvas.prototype._setBackstoreDimension;
  }

})();
