var fabric = fabric || {
    version: "2.0.0-rc.4"
};

if (typeof exports !== "undefined") {
    exports.fabric = fabric;
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
    fabric.document = document;
    fabric.window = window;
} else {
    fabric.document = require("jsdom").jsdom(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"), {
        features: {
            FetchExternalResources: [ "img" ]
        }
    });
    fabric.jsdomImplForWrapper = require("jsdom/lib/jsdom/living/generated/utils").implForWrapper;
    fabric.nodeCanvas = require("jsdom/lib/jsdom/utils").Canvas;
    fabric.window = fabric.document.defaultView;
    DOMParser = require("xmldom").DOMParser;
}

fabric.isTouchSupported = "ontouchstart" in fabric.window;

fabric.isLikelyNode = typeof Buffer !== "undefined" && typeof window === "undefined";

fabric.DPI = 96;

fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)";

fabric.fontPaths = {};

fabric.iMatrix = [ 1, 0, 0, 1, 0, 0 ];

fabric.canvasModule = "canvas";

fabric.perfLimitSizeTotal = 2097152;

fabric.maxCacheSideLimit = 4096;

fabric.minCacheSideLimit = 256;

fabric.charWidthsCache = {};

fabric.textureSize = 2048;

fabric.enableGLFiltering = true;

fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1;

fabric.browserShadowBlurConstant = 1;

fabric.initFilterBackend = function() {
    if (fabric.enableGLFiltering && fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize)) {
        console.log("max texture size: " + fabric.maxTextureSize);
        return new fabric.WebglFilterBackend({
            tileSize: fabric.textureSize
        });
    } else if (fabric.Canvas2dFilterBackend) {
        return new fabric.Canvas2dFilterBackend();
    }
};

(function() {
    function _removeEventListener(eventName, handler) {
        if (!this.__eventListeners[eventName]) {
            return;
        }
        var eventListener = this.__eventListeners[eventName];
        if (handler) {
            eventListener[eventListener.indexOf(handler)] = false;
        } else {
            fabric.util.array.fill(eventListener, false);
        }
    }
    function observe(eventName, handler) {
        if (!this.__eventListeners) {
            this.__eventListeners = {};
        }
        if (arguments.length === 1) {
            for (var prop in eventName) {
                this.on(prop, eventName[prop]);
            }
        } else {
            if (!this.__eventListeners[eventName]) {
                this.__eventListeners[eventName] = [];
            }
            this.__eventListeners[eventName].push(handler);
        }
        return this;
    }
    function stopObserving(eventName, handler) {
        if (!this.__eventListeners) {
            return;
        }
        if (arguments.length === 0) {
            for (eventName in this.__eventListeners) {
                _removeEventListener.call(this, eventName);
            }
        } else if (arguments.length === 1 && typeof arguments[0] === "object") {
            for (var prop in eventName) {
                _removeEventListener.call(this, prop, eventName[prop]);
            }
        } else {
            _removeEventListener.call(this, eventName, handler);
        }
        return this;
    }
    function fire(eventName, options) {
        if (!this.__eventListeners) {
            return;
        }
        var listenersForEvent = this.__eventListeners[eventName];
        if (!listenersForEvent) {
            return;
        }
        for (var i = 0, len = listenersForEvent.length; i < len; i++) {
            listenersForEvent[i] && listenersForEvent[i].call(this, options || {});
        }
        this.__eventListeners[eventName] = listenersForEvent.filter(function(value) {
            return value !== false;
        });
        return this;
    }
    fabric.Observable = {
        observe: observe,
        stopObserving: stopObserving,
        fire: fire,
        on: observe,
        off: stopObserving,
        trigger: fire
    };
})();

fabric.Collection = {
    _objects: [],
    add: function() {
        this._objects.push.apply(this._objects, arguments);
        if (this._onObjectAdded) {
            for (var i = 0, length = arguments.length; i < length; i++) {
                this._onObjectAdded(arguments[i]);
            }
        }
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
    },
    insertAt: function(object, index, nonSplicing) {
        var objects = this.getObjects();
        if (nonSplicing) {
            objects[index] = object;
        } else {
            objects.splice(index, 0, object);
        }
        this._onObjectAdded && this._onObjectAdded(object);
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
    },
    remove: function() {
        var objects = this.getObjects(), index, somethingRemoved = false;
        for (var i = 0, length = arguments.length; i < length; i++) {
            index = objects.indexOf(arguments[i]);
            if (index !== -1) {
                somethingRemoved = true;
                objects.splice(index, 1);
                this._onObjectRemoved && this._onObjectRemoved(arguments[i]);
            }
        }
        this.renderOnAddRemove && somethingRemoved && this.requestRenderAll();
        return this;
    },
    forEachObject: function(callback, context) {
        var objects = this.getObjects();
        for (var i = 0, len = objects.length; i < len; i++) {
            callback.call(context, objects[i], i, objects);
        }
        return this;
    },
    getObjects: function(type) {
        if (typeof type === "undefined") {
            return this._objects;
        }
        return this._objects.filter(function(o) {
            return o.type === type;
        });
    },
    item: function(index) {
        return this.getObjects()[index];
    },
    isEmpty: function() {
        return this.getObjects().length === 0;
    },
    size: function() {
        return this.getObjects().length;
    },
    contains: function(object) {
        return this.getObjects().indexOf(object) > -1;
    },
    complexity: function() {
        return this.getObjects().reduce(function(memo, current) {
            memo += current.complexity ? current.complexity() : 0;
            return memo;
        }, 0);
    }
};

fabric.CommonMethods = {
    _setOptions: function(options) {
        for (var prop in options) {
            this.set(prop, options[prop]);
        }
    },
    _initGradient: function(filler, property) {
        if (filler && filler.colorStops && !(filler instanceof fabric.Gradient)) {
            this.set(property, new fabric.Gradient(filler));
        }
    },
    _initPattern: function(filler, property, callback) {
        if (filler && filler.source && !(filler instanceof fabric.Pattern)) {
            this.set(property, new fabric.Pattern(filler, callback));
        } else {
            callback && callback();
        }
    },
    _initClipping: function(options) {
        if (!options.clipTo || typeof options.clipTo !== "string") {
            return;
        }
        var functionBody = fabric.util.getFunctionBody(options.clipTo);
        if (typeof functionBody !== "undefined") {
            this.clipTo = new Function("ctx", functionBody);
        }
    },
    _setObject: function(obj) {
        for (var prop in obj) {
            this._set(prop, obj[prop]);
        }
    },
    set: function(key, value) {
        if (typeof key === "object") {
            this._setObject(key);
        } else {
            if (typeof value === "function" && key !== "clipTo") {
                this._set(key, value(this.get(key)));
            } else {
                this._set(key, value);
            }
        }
        return this;
    },
    _set: function(key, value) {
        this[key] = value;
    },
    toggle: function(property) {
        var value = this.get(property);
        if (typeof value === "boolean") {
            this.set(property, !value);
        }
        return this;
    },
    get: function(property) {
        return this[property];
    }
};

(function(global) {
    var sqrt = Math.sqrt, atan2 = Math.atan2, pow = Math.pow, abs = Math.abs, PiBy180 = Math.PI / 180;
    fabric.util = {
        removeFromArray: function(array, value) {
            var idx = array.indexOf(value);
            if (idx !== -1) {
                array.splice(idx, 1);
            }
            return array;
        },
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        degreesToRadians: function(degrees) {
            return degrees * PiBy180;
        },
        radiansToDegrees: function(radians) {
            return radians / PiBy180;
        },
        rotatePoint: function(point, origin, radians) {
            point.subtractEquals(origin);
            var v = fabric.util.rotateVector(point, radians);
            return new fabric.Point(v.x, v.y).addEquals(origin);
        },
        rotateVector: function(vector, radians) {
            var sin = Math.sin(radians), cos = Math.cos(radians), rx = vector.x * cos - vector.y * sin, ry = vector.x * sin + vector.y * cos;
            return {
                x: rx,
                y: ry
            };
        },
        transformPoint: function(p, t, ignoreOffset) {
            if (ignoreOffset) {
                return new fabric.Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
            }
            return new fabric.Point(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5]);
        },
        makeBoundingBoxFromPoints: function(points) {
            var xPoints = [ points[0].x, points[1].x, points[2].x, points[3].x ], minX = fabric.util.array.min(xPoints), maxX = fabric.util.array.max(xPoints), width = maxX - minX, yPoints = [ points[0].y, points[1].y, points[2].y, points[3].y ], minY = fabric.util.array.min(yPoints), maxY = fabric.util.array.max(yPoints), height = maxY - minY;
            return {
                left: minX,
                top: minY,
                width: width,
                height: height
            };
        },
        invertTransform: function(t) {
            var a = 1 / (t[0] * t[3] - t[1] * t[2]), r = [ a * t[3], -a * t[1], -a * t[2], a * t[0] ], o = fabric.util.transformPoint({
                x: t[4],
                y: t[5]
            }, r, true);
            r[4] = -o.x;
            r[5] = -o.y;
            return r;
        },
        toFixed: function(number, fractionDigits) {
            return parseFloat(Number(number).toFixed(fractionDigits));
        },
        parseUnit: function(value, fontSize) {
            var unit = /\D{0,2}$/.exec(value), number = parseFloat(value);
            if (!fontSize) {
                fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
            }
            switch (unit[0]) {
              case "mm":
                return number * fabric.DPI / 25.4;

              case "cm":
                return number * fabric.DPI / 2.54;

              case "in":
                return number * fabric.DPI;

              case "pt":
                return number * fabric.DPI / 72;

              case "pc":
                return number * fabric.DPI / 72 * 12;

              case "em":
                return number * fontSize;

              default:
                return number;
            }
        },
        falseFunction: function() {
            return false;
        },
        getKlass: function(type, namespace) {
            type = fabric.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1));
            return fabric.util.resolveNamespace(namespace)[type];
        },
        getSvgAttributes: function(type) {
            var attributes = [ "instantiated_by_use", "style", "id", "class" ];
            switch (type) {
              case "linearGradient":
                attributes = attributes.concat([ "x1", "y1", "x2", "y2", "gradientUnits", "gradientTransform" ]);
                break;

              case "radialGradient":
                attributes = attributes.concat([ "gradientUnits", "gradientTransform", "cx", "cy", "r", "fx", "fy", "fr" ]);
                break;

              case "stop":
                attributes = attributes.concat([ "offset", "stop-color", "stop-opacity" ]);
                break;
            }
            return attributes;
        },
        resolveNamespace: function(namespace) {
            if (!namespace) {
                return fabric;
            }
            var parts = namespace.split("."), len = parts.length, i, obj = global || fabric.window;
            for (i = 0; i < len; ++i) {
                obj = obj[parts[i]];
            }
            return obj;
        },
        loadImage: function(url, callback, context, crossOrigin) {
            if (!url) {
                callback && callback.call(context, url);
                return;
            }
            var img = fabric.util.createImage();
            var onLoadCallback = function() {
                callback && callback.call(context, img);
                img = img.onload = img.onerror = null;
            };
            img.onload = onLoadCallback;
            img.onerror = function() {
                fabric.log("Error loading " + img.src);
                callback && callback.call(context, null, true);
                img = img.onload = img.onerror = null;
            };
            if (url.indexOf("data") !== 0 && crossOrigin) {
                img.crossOrigin = crossOrigin;
            }
            if (url.substring(0, 14) === "data:image/svg") {
                img.onload = null;
                fabric.util.loadImageInDom(img, onLoadCallback);
            }
            img.src = url;
        },
        loadImageInDom: function(img, onLoadCallback) {
            var div = fabric.document.createElement("div");
            div.style.width = div.style.height = "1px";
            div.style.left = div.style.top = "-100%";
            div.style.position = "absolute";
            div.appendChild(img);
            fabric.document.querySelector("body").appendChild(div);
            img.onload = function() {
                onLoadCallback();
                div.parentNode.removeChild(div);
                div = null;
            };
        },
        enlivenObjects: function(objects, callback, namespace, reviver) {
            objects = objects || [];
            function onLoaded() {
                if (++numLoadedObjects === numTotalObjects) {
                    callback && callback(enlivenedObjects);
                }
            }
            var enlivenedObjects = [], numLoadedObjects = 0, numTotalObjects = objects.length;
            if (!numTotalObjects) {
                callback && callback(enlivenedObjects);
                return;
            }
            objects.forEach(function(o, index) {
                if (!o || !o.type) {
                    onLoaded();
                    return;
                }
                var klass = fabric.util.getKlass(o.type, namespace);
                klass.fromObject(o, function(obj, error) {
                    error || (enlivenedObjects[index] = obj);
                    reviver && reviver(o, obj, error);
                    onLoaded();
                });
            });
        },
        enlivenPatterns: function(patterns, callback) {
            patterns = patterns || [];
            function onLoaded() {
                if (++numLoadedPatterns === numPatterns) {
                    callback && callback(enlivenedPatterns);
                }
            }
            var enlivenedPatterns = [], numLoadedPatterns = 0, numPatterns = patterns.length;
            if (!numPatterns) {
                callback && callback(enlivenedPatterns);
                return;
            }
            patterns.forEach(function(p, index) {
                if (p && p.source) {
                    new fabric.Pattern(p, function(pattern) {
                        enlivenedPatterns[index] = pattern;
                        onLoaded();
                    });
                } else {
                    enlivenedPatterns[index] = p;
                    onLoaded();
                }
            });
        },
        groupSVGElements: function(elements, options, path) {
            var object;
            if (elements.length === 1) {
                return elements[0];
            }
            if (options) {
                if (options.width && options.height) {
                    options.centerPoint = {
                        x: options.width / 2,
                        y: options.height / 2
                    };
                } else {
                    delete options.width;
                    delete options.height;
                }
            }
            object = new fabric.Group(elements, options);
            if (typeof path !== "undefined") {
                object.sourcePath = path;
            }
            return object;
        },
        populateWithProperties: function(source, destination, properties) {
            if (properties && Object.prototype.toString.call(properties) === "[object Array]") {
                for (var i = 0, len = properties.length; i < len; i++) {
                    if (properties[i] in source) {
                        destination[properties[i]] = source[properties[i]];
                    }
                }
            }
        },
        drawDashedLine: function(ctx, x, y, x2, y2, da) {
            var dx = x2 - x, dy = y2 - y, len = sqrt(dx * dx + dy * dy), rot = atan2(dy, dx), dc = da.length, di = 0, draw = true;
            ctx.save();
            ctx.translate(x, y);
            ctx.moveTo(0, 0);
            ctx.rotate(rot);
            x = 0;
            while (len > x) {
                x += da[di++ % dc];
                if (x > len) {
                    x = len;
                }
                ctx[draw ? "lineTo" : "moveTo"](x, 0);
                draw = !draw;
            }
            ctx.restore();
        },
        createCanvasElement: function() {
            return fabric.document.createElement("canvas");
        },
        createImage: function() {
            return fabric.document.createElement("img");
        },
        clipContext: function(receiver, ctx) {
            ctx.save();
            ctx.beginPath();
            receiver.clipTo(ctx);
            ctx.clip();
        },
        multiplyTransformMatrices: function(a, b, is2x2) {
            return [ a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4], is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5] ];
        },
        qrDecompose: function(a) {
            var angle = atan2(a[1], a[0]), denom = pow(a[0], 2) + pow(a[1], 2), scaleX = sqrt(denom), scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX, skewX = atan2(a[0] * a[2] + a[1] * a[3], denom);
            return {
                angle: angle / PiBy180,
                scaleX: scaleX,
                scaleY: scaleY,
                skewX: skewX / PiBy180,
                skewY: 0,
                translateX: a[4],
                translateY: a[5]
            };
        },
        customTransformMatrix: function(scaleX, scaleY, skewX) {
            var skewMatrixX = [ 1, 0, abs(Math.tan(skewX * PiBy180)), 1 ], scaleMatrix = [ abs(scaleX), 0, 0, abs(scaleY) ];
            return fabric.util.multiplyTransformMatrices(scaleMatrix, skewMatrixX, true);
        },
        resetObjectTransform: function(target) {
            target.scaleX = 1;
            target.scaleY = 1;
            target.skewX = 0;
            target.skewY = 0;
            target.flipX = false;
            target.flipY = false;
            target.rotate(0);
        },
        getFunctionBody: function(fn) {
            return (String(fn).match(/function[^{]*\{([\s\S]*)\}/) || {})[1];
        },
        isTransparent: function(ctx, x, y, tolerance) {
            if (tolerance > 0) {
                if (x > tolerance) {
                    x -= tolerance;
                } else {
                    x = 0;
                }
                if (y > tolerance) {
                    y -= tolerance;
                } else {
                    y = 0;
                }
            }
            var _isTransparent = true, i, temp, imageData = ctx.getImageData(x, y, tolerance * 2 || 1, tolerance * 2 || 1), l = imageData.data.length;
            for (i = 3; i < l; i += 4) {
                temp = imageData.data[i];
                _isTransparent = temp <= 0;
                if (_isTransparent === false) {
                    break;
                }
            }
            imageData = null;
            return _isTransparent;
        },
        parsePreserveAspectRatioAttribute: function(attribute) {
            var meetOrSlice = "meet", alignX = "Mid", alignY = "Mid", aspectRatioAttrs = attribute.split(" "), align;
            if (aspectRatioAttrs && aspectRatioAttrs.length) {
                meetOrSlice = aspectRatioAttrs.pop();
                if (meetOrSlice !== "meet" && meetOrSlice !== "slice") {
                    align = meetOrSlice;
                    meetOrSlice = "meet";
                } else if (aspectRatioAttrs.length) {
                    align = aspectRatioAttrs.pop();
                }
            }
            alignX = align !== "none" ? align.slice(1, 4) : "none";
            alignY = align !== "none" ? align.slice(5, 8) : "none";
            return {
                meetOrSlice: meetOrSlice,
                alignX: alignX,
                alignY: alignY
            };
        },
        clearFabricFontCache: function(fontFamily) {
            if (!fontFamily) {
                fabric.charWidthsCache = {};
            } else if (fabric.charWidthsCache[fontFamily]) {
                delete fabric.charWidthsCache[fontFamily];
            }
        },
        limitDimsByArea: function(ar, maximumArea) {
            var roughWidth = Math.sqrt(maximumArea * ar), perfLimitSizeY = Math.floor(maximumArea / roughWidth);
            return {
                x: Math.floor(roughWidth),
                y: perfLimitSizeY
            };
        },
        capValue: function(min, value, max) {
            return Math.max(min, Math.min(value, max));
        },
        findScaleToFit: function(source, destination) {
            return Math.min(destination.width / source.width, destination.height / source.height);
        },
        findScaleToCover: function(source, destination) {
            return Math.max(destination.width / source.width, destination.height / source.height);
        }
    };
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var arcToSegmentsCache = {}, segmentToBezierCache = {}, boundsOfCurveCache = {}, _join = Array.prototype.join;
    function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
        var argsString = _join.call(arguments);
        if (arcToSegmentsCache[argsString]) {
            return arcToSegmentsCache[argsString];
        }
        var PI = Math.PI, th = rotateX * PI / 180, sinTh = Math.sin(th), cosTh = Math.cos(th), fromX = 0, fromY = 0;
        rx = Math.abs(rx);
        ry = Math.abs(ry);
        var px = -cosTh * toX * .5 - sinTh * toY * .5, py = -cosTh * toY * .5 + sinTh * toX * .5, rx2 = rx * rx, ry2 = ry * ry, py2 = py * py, px2 = px * px, pl = rx2 * ry2 - rx2 * py2 - ry2 * px2, root = 0;
        if (pl < 0) {
            var s = Math.sqrt(1 - pl / (rx2 * ry2));
            rx *= s;
            ry *= s;
        } else {
            root = (large === sweep ? -1 : 1) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
        }
        var cx = root * rx * py / ry, cy = -root * ry * px / rx, cx1 = cosTh * cx - sinTh * cy + toX * .5, cy1 = sinTh * cx + cosTh * cy + toY * .5, mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry), dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);
        if (sweep === 0 && dtheta > 0) {
            dtheta -= 2 * PI;
        } else if (sweep === 1 && dtheta < 0) {
            dtheta += 2 * PI;
        }
        var segments = Math.ceil(Math.abs(dtheta / PI * 2)), result = [], mDelta = dtheta / segments, mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2), th3 = mTheta + mDelta;
        for (var i = 0; i < segments; i++) {
            result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
            fromX = result[i][4];
            fromY = result[i][5];
            mTheta = th3;
            th3 += mDelta;
        }
        arcToSegmentsCache[argsString] = result;
        return result;
    }
    function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
        var argsString2 = _join.call(arguments);
        if (segmentToBezierCache[argsString2]) {
            return segmentToBezierCache[argsString2];
        }
        var costh2 = Math.cos(th2), sinth2 = Math.sin(th2), costh3 = Math.cos(th3), sinth3 = Math.sin(th3), toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1, toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1, cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2), cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2), cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3), cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);
        segmentToBezierCache[argsString2] = [ cp1X, cp1Y, cp2X, cp2Y, toX, toY ];
        return segmentToBezierCache[argsString2];
    }
    function calcVectorAngle(ux, uy, vx, vy) {
        var ta = Math.atan2(uy, ux), tb = Math.atan2(vy, vx);
        if (tb >= ta) {
            return tb - ta;
        } else {
            return 2 * Math.PI - (ta - tb);
        }
    }
    fabric.util.drawArc = function(ctx, fx, fy, coords) {
        var rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], tx = coords[5], ty = coords[6], segs = [ [], [], [], [] ], segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);
        for (var i = 0, len = segsNorm.length; i < len; i++) {
            segs[i][0] = segsNorm[i][0] + fx;
            segs[i][1] = segsNorm[i][1] + fy;
            segs[i][2] = segsNorm[i][2] + fx;
            segs[i][3] = segsNorm[i][3] + fy;
            segs[i][4] = segsNorm[i][4] + fx;
            segs[i][5] = segsNorm[i][5] + fy;
            ctx.bezierCurveTo.apply(ctx, segs[i]);
        }
    };
    fabric.util.getBoundsOfArc = function(fx, fy, rx, ry, rot, large, sweep, tx, ty) {
        var fromX = 0, fromY = 0, bound, bounds = [], segs = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);
        for (var i = 0, len = segs.length; i < len; i++) {
            bound = getBoundsOfCurve(fromX, fromY, segs[i][0], segs[i][1], segs[i][2], segs[i][3], segs[i][4], segs[i][5]);
            bounds.push({
                x: bound[0].x + fx,
                y: bound[0].y + fy
            });
            bounds.push({
                x: bound[1].x + fx,
                y: bound[1].y + fy
            });
            fromX = segs[i][4];
            fromY = segs[i][5];
        }
        return bounds;
    };
    function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
        var argsString = _join.call(arguments);
        if (boundsOfCurveCache[argsString]) {
            return boundsOfCurveCache[argsString];
        }
        var sqrt = Math.sqrt, min = Math.min, max = Math.max, abs = Math.abs, tvalues = [], bounds = [ [], [] ], a, b, c, t, t1, t2, b2ac, sqrtb2ac;
        b = 6 * x0 - 12 * x1 + 6 * x2;
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
        c = 3 * x1 - 3 * x0;
        for (var i = 0; i < 2; ++i) {
            if (i > 0) {
                b = 6 * y0 - 12 * y1 + 6 * y2;
                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                c = 3 * y1 - 3 * y0;
            }
            if (abs(a) < 1e-12) {
                if (abs(b) < 1e-12) {
                    continue;
                }
                t = -c / b;
                if (0 < t && t < 1) {
                    tvalues.push(t);
                }
                continue;
            }
            b2ac = b * b - 4 * c * a;
            if (b2ac < 0) {
                continue;
            }
            sqrtb2ac = sqrt(b2ac);
            t1 = (-b + sqrtb2ac) / (2 * a);
            if (0 < t1 && t1 < 1) {
                tvalues.push(t1);
            }
            t2 = (-b - sqrtb2ac) / (2 * a);
            if (0 < t2 && t2 < 1) {
                tvalues.push(t2);
            }
        }
        var x, y, j = tvalues.length, jlen = j, mt;
        while (j--) {
            t = tvalues[j];
            mt = 1 - t;
            x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
            bounds[0][j] = x;
            y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
            bounds[1][j] = y;
        }
        bounds[0][jlen] = x0;
        bounds[1][jlen] = y0;
        bounds[0][jlen + 1] = x3;
        bounds[1][jlen + 1] = y3;
        var result = [ {
            x: min.apply(null, bounds[0]),
            y: min.apply(null, bounds[1])
        }, {
            x: max.apply(null, bounds[0]),
            y: max.apply(null, bounds[1])
        } ];
        boundsOfCurveCache[argsString] = result;
        return result;
    }
    fabric.util.getBoundsOfCurve = getBoundsOfCurve;
})();

(function() {
    var slice = Array.prototype.slice;
    function invoke(array, method) {
        var args = slice.call(arguments, 2), result = [];
        for (var i = 0, len = array.length; i < len; i++) {
            result[i] = args.length ? array[i][method].apply(array[i], args) : array[i][method].call(array[i]);
        }
        return result;
    }
    function max(array, byProperty) {
        return find(array, byProperty, function(value1, value2) {
            return value1 >= value2;
        });
    }
    function min(array, byProperty) {
        return find(array, byProperty, function(value1, value2) {
            return value1 < value2;
        });
    }
    function fill(array, value) {
        var k = array.length;
        while (k--) {
            array[k] = value;
        }
        return array;
    }
    function find(array, byProperty, condition) {
        if (!array || array.length === 0) {
            return;
        }
        var i = array.length - 1, result = byProperty ? array[i][byProperty] : array[i];
        if (byProperty) {
            while (i--) {
                if (condition(array[i][byProperty], result)) {
                    result = array[i][byProperty];
                }
            }
        } else {
            while (i--) {
                if (condition(array[i], result)) {
                    result = array[i];
                }
            }
        }
        return result;
    }
    fabric.util.array = {
        fill: fill,
        invoke: invoke,
        min: min,
        max: max
    };
})();

(function() {
    function extend(destination, source, deep) {
        if (deep) {
            if (!fabric.isLikelyNode && source instanceof Element) {
                destination = source;
            } else if (source instanceof Array) {
                destination = [];
                for (var i = 0, len = source.length; i < len; i++) {
                    destination[i] = extend({}, source[i], deep);
                }
            } else if (source && typeof source === "object") {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = extend({}, source[property], deep);
                    }
                }
            } else {
                destination = source;
            }
        } else {
            for (var property in source) {
                destination[property] = source[property];
            }
        }
        return destination;
    }
    function clone(object, deep) {
        return extend({}, object, deep);
    }
    fabric.util.object = {
        extend: extend,
        clone: clone
    };
    fabric.util.object.extend(fabric.util, fabric.Observable);
})();

(function() {
    function camelize(string) {
        return string.replace(/-+(.)?/g, function(match, character) {
            return character ? character.toUpperCase() : "";
        });
    }
    function capitalize(string, firstLetterOnly) {
        return string.charAt(0).toUpperCase() + (firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
    }
    function escapeXml(string) {
        return string.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function graphemeSplit(textstring) {
        var i = 0, chr, graphemes = [];
        for (i = 0, chr; i < textstring.length; i++) {
            if ((chr = getWholeChar(textstring, i)) === false) {
                continue;
            }
            graphemes.push(chr);
        }
        return graphemes;
    }
    function getWholeChar(str, i) {
        var code = str.charCodeAt(i);
        if (isNaN(code)) {
            return "";
        }
        if (code < 55296 || code > 57343) {
            return str.charAt(i);
        }
        if (55296 <= code && code <= 56319) {
            if (str.length <= i + 1) {
                throw "High surrogate without following low surrogate";
            }
            var next = str.charCodeAt(i + 1);
            if (56320 > next || next > 57343) {
                throw "High surrogate without following low surrogate";
            }
            return str.charAt(i) + str.charAt(i + 1);
        }
        if (i === 0) {
            throw "Low surrogate without preceding high surrogate";
        }
        var prev = str.charCodeAt(i - 1);
        if (55296 > prev || prev > 56319) {
            throw "Low surrogate without preceding high surrogate";
        }
        return false;
    }
    fabric.util.string = {
        camelize: camelize,
        capitalize: capitalize,
        escapeXml: escapeXml,
        graphemeSplit: graphemeSplit
    };
})();

(function() {
    var slice = Array.prototype.slice, emptyFunction = function() {}, IS_DONTENUM_BUGGY = function() {
        for (var p in {
            toString: 1
        }) {
            if (p === "toString") {
                return false;
            }
        }
        return true;
    }(), addMethods = function(klass, source, parent) {
        for (var property in source) {
            if (property in klass.prototype && typeof klass.prototype[property] === "function" && (source[property] + "").indexOf("callSuper") > -1) {
                klass.prototype[property] = function(property) {
                    return function() {
                        var superclass = this.constructor.superclass;
                        this.constructor.superclass = parent;
                        var returnValue = source[property].apply(this, arguments);
                        this.constructor.superclass = superclass;
                        if (property !== "initialize") {
                            return returnValue;
                        }
                    };
                }(property);
            } else {
                klass.prototype[property] = source[property];
            }
            if (IS_DONTENUM_BUGGY) {
                if (source.toString !== Object.prototype.toString) {
                    klass.prototype.toString = source.toString;
                }
                if (source.valueOf !== Object.prototype.valueOf) {
                    klass.prototype.valueOf = source.valueOf;
                }
            }
        }
    };
    function Subclass() {}
    function callSuper(methodName) {
        var parentMethod = null, _this = this;
        while (_this.constructor.superclass) {
            var superClassMethod = _this.constructor.superclass.prototype[methodName];
            if (_this[methodName] !== superClassMethod) {
                parentMethod = superClassMethod;
                break;
            }
            _this = _this.constructor.superclass.prototype;
        }
        if (!parentMethod) {
            return console.log("tried to callSuper " + methodName + ", method not found in prototype chain", this);
        }
        return arguments.length > 1 ? parentMethod.apply(this, slice.call(arguments, 1)) : parentMethod.call(this);
    }
    function createClass() {
        var parent = null, properties = slice.call(arguments, 0);
        if (typeof properties[0] === "function") {
            parent = properties.shift();
        }
        function klass() {
            this.initialize.apply(this, arguments);
        }
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            Subclass.prototype = parent.prototype;
            klass.prototype = new Subclass();
            parent.subclasses.push(klass);
        }
        for (var i = 0, length = properties.length; i < length; i++) {
            addMethods(klass, properties[i], parent);
        }
        if (!klass.prototype.initialize) {
            klass.prototype.initialize = emptyFunction;
        }
        klass.prototype.constructor = klass;
        klass.prototype.callSuper = callSuper;
        return klass;
    }
    fabric.util.createClass = createClass;
})();

(function() {
    function setStyle(element, styles) {
        var elementStyle = element.style;
        if (!elementStyle) {
            return element;
        }
        if (typeof styles === "string") {
            element.style.cssText += ";" + styles;
            return styles.indexOf("opacity") > -1 ? setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
        }
        for (var property in styles) {
            if (property === "opacity") {
                setOpacity(element, styles[property]);
            } else {
                var normalizedProperty = property === "float" || property === "cssFloat" ? typeof elementStyle.styleFloat === "undefined" ? "cssFloat" : "styleFloat" : property;
                elementStyle[normalizedProperty] = styles[property];
            }
        }
        return element;
    }
    var parseEl = fabric.document.createElement("div"), supportsOpacity = typeof parseEl.style.opacity === "string", supportsFilters = typeof parseEl.style.filter === "string", reOpacity = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/, setOpacity = function(element) {
        return element;
    };
    if (supportsOpacity) {
        setOpacity = function(element, value) {
            element.style.opacity = value;
            return element;
        };
    } else if (supportsFilters) {
        setOpacity = function(element, value) {
            var es = element.style;
            if (element.currentStyle && !element.currentStyle.hasLayout) {
                es.zoom = 1;
            }
            if (reOpacity.test(es.filter)) {
                value = value >= .9999 ? "" : "alpha(opacity=" + value * 100 + ")";
                es.filter = es.filter.replace(reOpacity, value);
            } else {
                es.filter += " alpha(opacity=" + value * 100 + ")";
            }
            return element;
        };
    }
    fabric.util.setStyle = setStyle;
})();

(function() {
    var _slice = Array.prototype.slice;
    function getById(id) {
        return typeof id === "string" ? fabric.document.getElementById(id) : id;
    }
    var sliceCanConvertNodelists, toArray = function(arrayLike) {
        return _slice.call(arrayLike, 0);
    };
    try {
        sliceCanConvertNodelists = toArray(fabric.document.childNodes) instanceof Array;
    } catch (err) {}
    if (!sliceCanConvertNodelists) {
        toArray = function(arrayLike) {
            var arr = new Array(arrayLike.length), i = arrayLike.length;
            while (i--) {
                arr[i] = arrayLike[i];
            }
            return arr;
        };
    }
    function makeElement(tagName, attributes) {
        var el = fabric.document.createElement(tagName);
        for (var prop in attributes) {
            if (prop === "class") {
                el.className = attributes[prop];
            } else if (prop === "for") {
                el.htmlFor = attributes[prop];
            } else {
                el.setAttribute(prop, attributes[prop]);
            }
        }
        return el;
    }
    function addClass(element, className) {
        if (element && (" " + element.className + " ").indexOf(" " + className + " ") === -1) {
            element.className += (element.className ? " " : "") + className;
        }
    }
    function wrapElement(element, wrapper, attributes) {
        if (typeof wrapper === "string") {
            wrapper = makeElement(wrapper, attributes);
        }
        if (element.parentNode) {
            element.parentNode.replaceChild(wrapper, element);
        }
        wrapper.appendChild(element);
        return wrapper;
    }
    function getScrollLeftTop(element) {
        var left = 0, top = 0, docElement = fabric.document.documentElement, body = fabric.document.body || {
            scrollLeft: 0,
            scrollTop: 0
        };
        while (element && (element.parentNode || element.host)) {
            element = element.parentNode || element.host;
            if (element === fabric.document) {
                left = body.scrollLeft || docElement.scrollLeft || 0;
                top = body.scrollTop || docElement.scrollTop || 0;
            } else {
                left += element.scrollLeft || 0;
                top += element.scrollTop || 0;
            }
            if (element.nodeType === 1 && element.style.position === "fixed") {
                break;
            }
        }
        return {
            left: left,
            top: top
        };
    }
    function getElementOffset(element) {
        var docElem, doc = element && element.ownerDocument, box = {
            left: 0,
            top: 0
        }, offset = {
            left: 0,
            top: 0
        }, scrollLeftTop, offsetAttributes = {
            borderLeftWidth: "left",
            borderTopWidth: "top",
            paddingLeft: "left",
            paddingTop: "top"
        };
        if (!doc) {
            return offset;
        }
        for (var attr in offsetAttributes) {
            offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
        }
        docElem = doc.documentElement;
        if (typeof element.getBoundingClientRect !== "undefined") {
            box = element.getBoundingClientRect();
        }
        scrollLeftTop = getScrollLeftTop(element);
        return {
            left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
            top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top
        };
    }
    var getElementStyle;
    if (fabric.document.defaultView && fabric.document.defaultView.getComputedStyle) {
        getElementStyle = function(element, attr) {
            var style = fabric.document.defaultView.getComputedStyle(element, null);
            return style ? style[attr] : undefined;
        };
    } else {
        getElementStyle = function(element, attr) {
            var value = element.style[attr];
            if (!value && element.currentStyle) {
                value = element.currentStyle[attr];
            }
            return value;
        };
    }
    (function() {
        var style = fabric.document.documentElement.style, selectProp = "userSelect" in style ? "userSelect" : "MozUserSelect" in style ? "MozUserSelect" : "WebkitUserSelect" in style ? "WebkitUserSelect" : "KhtmlUserSelect" in style ? "KhtmlUserSelect" : "";
        function makeElementUnselectable(element) {
            if (typeof element.onselectstart !== "undefined") {
                element.onselectstart = fabric.util.falseFunction;
            }
            if (selectProp) {
                element.style[selectProp] = "none";
            } else if (typeof element.unselectable === "string") {
                element.unselectable = "on";
            }
            return element;
        }
        function makeElementSelectable(element) {
            if (typeof element.onselectstart !== "undefined") {
                element.onselectstart = null;
            }
            if (selectProp) {
                element.style[selectProp] = "";
            } else if (typeof element.unselectable === "string") {
                element.unselectable = "";
            }
            return element;
        }
        fabric.util.makeElementUnselectable = makeElementUnselectable;
        fabric.util.makeElementSelectable = makeElementSelectable;
    })();
    (function() {
        function getScript(url, callback) {
            var headEl = fabric.document.getElementsByTagName("head")[0], scriptEl = fabric.document.createElement("script"), loading = true;
            scriptEl.onload = scriptEl.onreadystatechange = function(e) {
                if (loading) {
                    if (typeof this.readyState === "string" && this.readyState !== "loaded" && this.readyState !== "complete") {
                        return;
                    }
                    loading = false;
                    callback(e || fabric.window.event);
                    scriptEl = scriptEl.onload = scriptEl.onreadystatechange = null;
                }
            };
            scriptEl.src = url;
            headEl.appendChild(scriptEl);
        }
        fabric.util.getScript = getScript;
    })();
    function getNodeCanvas(element) {
        var impl = fabric.jsdomImplForWrapper(element);
        return impl._canvas || impl._image;
    }
    fabric.util.getById = getById;
    fabric.util.toArray = toArray;
    fabric.util.makeElement = makeElement;
    fabric.util.addClass = addClass;
    fabric.util.wrapElement = wrapElement;
    fabric.util.getScrollLeftTop = getScrollLeftTop;
    fabric.util.getElementOffset = getElementOffset;
    fabric.util.getElementStyle = getElementStyle;
    fabric.util.getNodeCanvas = getNodeCanvas;
})();

(function() {
    function addParamToUrl(url, param) {
        return url + (/\?/.test(url) ? "&" : "?") + param;
    }
    var makeXHR = function() {
        var factories = [ function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }, function() {
            return new XMLHttpRequest();
        } ];
        for (var i = factories.length; i--; ) {
            try {
                var req = factories[i]();
                if (req) {
                    return factories[i];
                }
            } catch (err) {}
        }
    }();
    function emptyFn() {}
    function request(url, options) {
        options || (options = {});
        var method = options.method ? options.method.toUpperCase() : "GET", onComplete = options.onComplete || function() {}, xhr = makeXHR(), body = options.body || options.parameters;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                onComplete(xhr);
                xhr.onreadystatechange = emptyFn;
            }
        };
        if (method === "GET") {
            body = null;
            if (typeof options.parameters === "string") {
                url = addParamToUrl(url, options.parameters);
            }
        }
        xhr.open(method, url, true);
        if (method === "POST" || method === "PUT") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(body);
        return xhr;
    }
    fabric.util.request = request;
})();

fabric.log = function() {};

fabric.warn = function() {};

if (typeof console !== "undefined") {
    [ "log", "warn" ].forEach(function(methodName) {
        if (typeof console[methodName] !== "undefined" && typeof console[methodName].apply === "function") {
            fabric[methodName] = function() {
                return console[methodName].apply(console, arguments);
            };
        }
    });
}

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Point) {
        fabric.warn("fabric.Point is already defined");
        return;
    }
    fabric.Point = Point;
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype = {
        type: "point",
        constructor: Point,
        add: function(that) {
            return new Point(this.x + that.x, this.y + that.y);
        },
        addEquals: function(that) {
            this.x += that.x;
            this.y += that.y;
            return this;
        },
        scalarAdd: function(scalar) {
            return new Point(this.x + scalar, this.y + scalar);
        },
        scalarAddEquals: function(scalar) {
            this.x += scalar;
            this.y += scalar;
            return this;
        },
        subtract: function(that) {
            return new Point(this.x - that.x, this.y - that.y);
        },
        subtractEquals: function(that) {
            this.x -= that.x;
            this.y -= that.y;
            return this;
        },
        scalarSubtract: function(scalar) {
            return new Point(this.x - scalar, this.y - scalar);
        },
        scalarSubtractEquals: function(scalar) {
            this.x -= scalar;
            this.y -= scalar;
            return this;
        },
        multiply: function(scalar) {
            return new Point(this.x * scalar, this.y * scalar);
        },
        multiplyEquals: function(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        },
        divide: function(scalar) {
            return new Point(this.x / scalar, this.y / scalar);
        },
        divideEquals: function(scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        },
        eq: function(that) {
            return this.x === that.x && this.y === that.y;
        },
        lt: function(that) {
            return this.x < that.x && this.y < that.y;
        },
        lte: function(that) {
            return this.x <= that.x && this.y <= that.y;
        },
        gt: function(that) {
            return this.x > that.x && this.y > that.y;
        },
        gte: function(that) {
            return this.x >= that.x && this.y >= that.y;
        },
        lerp: function(that, t) {
            if (typeof t === "undefined") {
                t = .5;
            }
            t = Math.max(Math.min(1, t), 0);
            return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
        },
        distanceFrom: function(that) {
            var dx = this.x - that.x, dy = this.y - that.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        midPointFrom: function(that) {
            return this.lerp(that);
        },
        min: function(that) {
            return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
        },
        max: function(that) {
            return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
        },
        toString: function() {
            return this.x + "," + this.y;
        },
        setXY: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        setX: function(x) {
            this.x = x;
            return this;
        },
        setY: function(y) {
            this.y = y;
            return this;
        },
        setFromPoint: function(that) {
            this.x = that.x;
            this.y = that.y;
            return this;
        },
        swap: function(that) {
            var x = this.x, y = this.y;
            this.x = that.x;
            this.y = that.y;
            that.x = x;
            that.y = y;
        },
        clone: function() {
            return new Point(this.x, this.y);
        }
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Intersection) {
        fabric.warn("fabric.Intersection is already defined");
        return;
    }
    function Intersection(status) {
        this.status = status;
        this.points = [];
    }
    fabric.Intersection = Intersection;
    fabric.Intersection.prototype = {
        constructor: Intersection,
        appendPoint: function(point) {
            this.points.push(point);
            return this;
        },
        appendPoints: function(points) {
            this.points = this.points.concat(points);
            return this;
        }
    };
    fabric.Intersection.intersectLineLine = function(a1, a2, b1, b2) {
        var result, uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x), ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x), uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (uB !== 0) {
            var ua = uaT / uB, ub = ubT / uB;
            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                result = new Intersection("Intersection");
                result.appendPoint(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
            } else {
                result = new Intersection();
            }
        } else {
            if (uaT === 0 || ubT === 0) {
                result = new Intersection("Coincident");
            } else {
                result = new Intersection("Parallel");
            }
        }
        return result;
    };
    fabric.Intersection.intersectLinePolygon = function(a1, a2, points) {
        var result = new Intersection(), length = points.length, b1, b2, inter, i;
        for (i = 0; i < length; i++) {
            b1 = points[i];
            b2 = points[(i + 1) % length];
            inter = Intersection.intersectLineLine(a1, a2, b1, b2);
            result.appendPoints(inter.points);
        }
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
    fabric.Intersection.intersectPolygonPolygon = function(points1, points2) {
        var result = new Intersection(), length = points1.length, i;
        for (i = 0; i < length; i++) {
            var a1 = points1[i], a2 = points1[(i + 1) % length], inter = Intersection.intersectLinePolygon(a1, a2, points2);
            result.appendPoints(inter.points);
        }
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
    fabric.Intersection.intersectPolygonRectangle = function(points, r1, r2) {
        var min = r1.min(r2), max = r1.max(r2), topRight = new fabric.Point(max.x, min.y), bottomLeft = new fabric.Point(min.x, max.y), inter1 = Intersection.intersectLinePolygon(min, topRight, points), inter2 = Intersection.intersectLinePolygon(topRight, max, points), inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points), inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points), result = new Intersection();
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Color) {
        fabric.warn("fabric.Color is already defined.");
        return;
    }
    function Color(color) {
        if (!color) {
            this.setSource([ 0, 0, 0, 1 ]);
        } else {
            this._tryParsingColor(color);
        }
    }
    fabric.Color = Color;
    fabric.Color.prototype = {
        _tryParsingColor: function(color) {
            var source;
            if (color in Color.colorNameMap) {
                color = Color.colorNameMap[color];
            }
            if (color === "transparent") {
                source = [ 255, 255, 255, 0 ];
            }
            if (!source) {
                source = Color.sourceFromHex(color);
            }
            if (!source) {
                source = Color.sourceFromRgb(color);
            }
            if (!source) {
                source = Color.sourceFromHsl(color);
            }
            if (!source) {
                source = [ 0, 0, 0, 1 ];
            }
            if (source) {
                this.setSource(source);
            }
        },
        _rgbToHsl: function(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            var h, s, l, max = fabric.util.array.max([ r, g, b ]), min = fabric.util.array.min([ r, g, b ]);
            l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > .5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                  case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;

                  case g:
                    h = (b - r) / d + 2;
                    break;

                  case b:
                    h = (r - g) / d + 4;
                    break;
                }
                h /= 6;
            }
            return [ Math.round(h * 360), Math.round(s * 100), Math.round(l * 100) ];
        },
        getSource: function() {
            return this._source;
        },
        setSource: function(source) {
            this._source = source;
        },
        toRgb: function() {
            var source = this.getSource();
            return "rgb(" + source[0] + "," + source[1] + "," + source[2] + ")";
        },
        toRgba: function() {
            var source = this.getSource();
            return "rgba(" + source[0] + "," + source[1] + "," + source[2] + "," + source[3] + ")";
        },
        toHsl: function() {
            var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
            return "hsl(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%)";
        },
        toHsla: function() {
            var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
            return "hsla(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%," + source[3] + ")";
        },
        toHex: function() {
            var source = this.getSource(), r, g, b;
            r = source[0].toString(16);
            r = r.length === 1 ? "0" + r : r;
            g = source[1].toString(16);
            g = g.length === 1 ? "0" + g : g;
            b = source[2].toString(16);
            b = b.length === 1 ? "0" + b : b;
            return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
        },
        toHexa: function() {
            var source = this.getSource(), a;
            a = Math.round(source[3] * 255);
            a = a.toString(16);
            a = a.length === 1 ? "0" + a : a;
            return this.toHex() + a.toUpperCase();
        },
        getAlpha: function() {
            return this.getSource()[3];
        },
        setAlpha: function(alpha) {
            var source = this.getSource();
            source[3] = alpha;
            this.setSource(source);
            return this;
        },
        toGrayscale: function() {
            var source = this.getSource(), average = parseInt((source[0] * .3 + source[1] * .59 + source[2] * .11).toFixed(0), 10), currentAlpha = source[3];
            this.setSource([ average, average, average, currentAlpha ]);
            return this;
        },
        toBlackWhite: function(threshold) {
            var source = this.getSource(), average = (source[0] * .3 + source[1] * .59 + source[2] * .11).toFixed(0), currentAlpha = source[3];
            threshold = threshold || 127;
            average = Number(average) < Number(threshold) ? 0 : 255;
            this.setSource([ average, average, average, currentAlpha ]);
            return this;
        },
        overlayWith: function(otherColor) {
            if (!(otherColor instanceof Color)) {
                otherColor = new Color(otherColor);
            }
            var result = [], alpha = this.getAlpha(), otherAlpha = .5, source = this.getSource(), otherSource = otherColor.getSource(), i;
            for (i = 0; i < 3; i++) {
                result.push(Math.round(source[i] * (1 - otherAlpha) + otherSource[i] * otherAlpha));
            }
            result[3] = alpha;
            this.setSource(result);
            return this;
        }
    };
    fabric.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/;
    fabric.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    fabric.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
    fabric.Color.colorNameMap = {
        aliceblue: "#F0F8FF",
        antiquewhite: "#FAEBD7",
        aqua: "#00FFFF",
        aquamarine: "#7FFFD4",
        azure: "#F0FFFF",
        beige: "#F5F5DC",
        bisque: "#FFE4C4",
        black: "#000000",
        blanchedalmond: "#FFEBCD",
        blue: "#0000FF",
        blueviolet: "#8A2BE2",
        brown: "#A52A2A",
        burlywood: "#DEB887",
        cadetblue: "#5F9EA0",
        chartreuse: "#7FFF00",
        chocolate: "#D2691E",
        coral: "#FF7F50",
        cornflowerblue: "#6495ED",
        cornsilk: "#FFF8DC",
        crimson: "#DC143C",
        cyan: "#00FFFF",
        darkblue: "#00008B",
        darkcyan: "#008B8B",
        darkgoldenrod: "#B8860B",
        darkgray: "#A9A9A9",
        darkgrey: "#A9A9A9",
        darkgreen: "#006400",
        darkkhaki: "#BDB76B",
        darkmagenta: "#8B008B",
        darkolivegreen: "#556B2F",
        darkorange: "#FF8C00",
        darkorchid: "#9932CC",
        darkred: "#8B0000",
        darksalmon: "#E9967A",
        darkseagreen: "#8FBC8F",
        darkslateblue: "#483D8B",
        darkslategray: "#2F4F4F",
        darkslategrey: "#2F4F4F",
        darkturquoise: "#00CED1",
        darkviolet: "#9400D3",
        deeppink: "#FF1493",
        deepskyblue: "#00BFFF",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1E90FF",
        firebrick: "#B22222",
        floralwhite: "#FFFAF0",
        forestgreen: "#228B22",
        fuchsia: "#FF00FF",
        gainsboro: "#DCDCDC",
        ghostwhite: "#F8F8FF",
        gold: "#FFD700",
        goldenrod: "#DAA520",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        greenyellow: "#ADFF2F",
        honeydew: "#F0FFF0",
        hotpink: "#FF69B4",
        indianred: "#CD5C5C",
        indigo: "#4B0082",
        ivory: "#FFFFF0",
        khaki: "#F0E68C",
        lavender: "#E6E6FA",
        lavenderblush: "#FFF0F5",
        lawngreen: "#7CFC00",
        lemonchiffon: "#FFFACD",
        lightblue: "#ADD8E6",
        lightcoral: "#F08080",
        lightcyan: "#E0FFFF",
        lightgoldenrodyellow: "#FAFAD2",
        lightgray: "#D3D3D3",
        lightgrey: "#D3D3D3",
        lightgreen: "#90EE90",
        lightpink: "#FFB6C1",
        lightsalmon: "#FFA07A",
        lightseagreen: "#20B2AA",
        lightskyblue: "#87CEFA",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#B0C4DE",
        lightyellow: "#FFFFE0",
        lime: "#00FF00",
        limegreen: "#32CD32",
        linen: "#FAF0E6",
        magenta: "#FF00FF",
        maroon: "#800000",
        mediumaquamarine: "#66CDAA",
        mediumblue: "#0000CD",
        mediumorchid: "#BA55D3",
        mediumpurple: "#9370DB",
        mediumseagreen: "#3CB371",
        mediumslateblue: "#7B68EE",
        mediumspringgreen: "#00FA9A",
        mediumturquoise: "#48D1CC",
        mediumvioletred: "#C71585",
        midnightblue: "#191970",
        mintcream: "#F5FFFA",
        mistyrose: "#FFE4E1",
        moccasin: "#FFE4B5",
        navajowhite: "#FFDEAD",
        navy: "#000080",
        oldlace: "#FDF5E6",
        olive: "#808000",
        olivedrab: "#6B8E23",
        orange: "#FFA500",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        palegoldenrod: "#EEE8AA",
        palegreen: "#98FB98",
        paleturquoise: "#AFEEEE",
        palevioletred: "#DB7093",
        papayawhip: "#FFEFD5",
        peachpuff: "#FFDAB9",
        peru: "#CD853F",
        pink: "#FFC0CB",
        plum: "#DDA0DD",
        powderblue: "#B0E0E6",
        purple: "#800080",
        rebeccapurple: "#663399",
        red: "#FF0000",
        rosybrown: "#BC8F8F",
        royalblue: "#4169E1",
        saddlebrown: "#8B4513",
        salmon: "#FA8072",
        sandybrown: "#F4A460",
        seagreen: "#2E8B57",
        seashell: "#FFF5EE",
        sienna: "#A0522D",
        silver: "#C0C0C0",
        skyblue: "#87CEEB",
        slateblue: "#6A5ACD",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#FFFAFA",
        springgreen: "#00FF7F",
        steelblue: "#4682B4",
        tan: "#D2B48C",
        teal: "#008080",
        thistle: "#D8BFD8",
        tomato: "#FF6347",
        turquoise: "#40E0D0",
        violet: "#EE82EE",
        wheat: "#F5DEB3",
        white: "#FFFFFF",
        whitesmoke: "#F5F5F5",
        yellow: "#FFFF00",
        yellowgreen: "#9ACD32"
    };
    function hue2rgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }
    fabric.Color.fromRgb = function(color) {
        return Color.fromSource(Color.sourceFromRgb(color));
    };
    fabric.Color.sourceFromRgb = function(color) {
        var match = color.match(Color.reRGBa);
        if (match) {
            var r = parseInt(match[1], 10) / (/%$/.test(match[1]) ? 100 : 1) * (/%$/.test(match[1]) ? 255 : 1), g = parseInt(match[2], 10) / (/%$/.test(match[2]) ? 100 : 1) * (/%$/.test(match[2]) ? 255 : 1), b = parseInt(match[3], 10) / (/%$/.test(match[3]) ? 100 : 1) * (/%$/.test(match[3]) ? 255 : 1);
            return [ parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), match[4] ? parseFloat(match[4]) : 1 ];
        }
    };
    fabric.Color.fromRgba = Color.fromRgb;
    fabric.Color.fromHsl = function(color) {
        return Color.fromSource(Color.sourceFromHsl(color));
    };
    fabric.Color.sourceFromHsl = function(color) {
        var match = color.match(Color.reHSLa);
        if (!match) {
            return;
        }
        var h = (parseFloat(match[1]) % 360 + 360) % 360 / 360, s = parseFloat(match[2]) / (/%$/.test(match[2]) ? 100 : 1), l = parseFloat(match[3]) / (/%$/.test(match[3]) ? 100 : 1), r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            var q = l <= .5 ? l * (s + 1) : l + s - l * s, p = l * 2 - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), match[4] ? parseFloat(match[4]) : 1 ];
    };
    fabric.Color.fromHsla = Color.fromHsl;
    fabric.Color.fromHex = function(color) {
        return Color.fromSource(Color.sourceFromHex(color));
    };
    fabric.Color.sourceFromHex = function(color) {
        if (color.match(Color.reHex)) {
            var value = color.slice(color.indexOf("#") + 1), isShortNotation = value.length === 3 || value.length === 4, isRGBa = value.length === 8 || value.length === 4, r = isShortNotation ? value.charAt(0) + value.charAt(0) : value.substring(0, 2), g = isShortNotation ? value.charAt(1) + value.charAt(1) : value.substring(2, 4), b = isShortNotation ? value.charAt(2) + value.charAt(2) : value.substring(4, 6), a = isRGBa ? isShortNotation ? value.charAt(3) + value.charAt(3) : value.substring(6, 8) : "FF";
            return [ parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseFloat((parseInt(a, 16) / 255).toFixed(2)) ];
        }
    };
    fabric.Color.fromSource = function(source) {
        var oColor = new Color();
        oColor.setSource(source);
        return oColor;
    };
})(typeof exports !== "undefined" ? exports : this);

(function() {
    "use strict";
    if (fabric.StaticCanvas) {
        fabric.warn("fabric.StaticCanvas is already defined.");
        return;
    }
    var extend = fabric.util.object.extend, getElementOffset = fabric.util.getElementOffset, removeFromArray = fabric.util.removeFromArray, toFixed = fabric.util.toFixed, transformPoint = fabric.util.transformPoint, invertTransform = fabric.util.invertTransform, CANVAS_INIT_ERROR = new Error("Could not initialize `canvas` element");
    fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
        initialize: function(el, options) {
            options || (options = {});
            this.renderAndResetBound = this.renderAndReset.bind(this);
            this.requestRenderAllBound = this.requestRenderAll.bind(this);
            this._initStatic(el, options);
        },
        backgroundColor: "",
        backgroundImage: null,
        overlayColor: "",
        overlayImage: null,
        includeDefaultValues: true,
        stateful: false,
        renderOnAddRemove: true,
        clipTo: null,
        controlsAboveOverlay: false,
        allowTouchScrolling: false,
        imageSmoothingEnabled: true,
        viewportTransform: fabric.iMatrix.concat(),
        backgroundVpt: true,
        overlayVpt: true,
        onBeforeScaleRotate: function() {},
        enableRetinaScaling: true,
        vptCoords: {},
        skipOffscreen: true,
        _initStatic: function(el, options) {
            var cb = this.requestRenderAllBound;
            this._objects = [];
            this._createLowerCanvas(el);
            this._initOptions(options);
            this._setImageSmoothing();
            if (!this.interactive) {
                this._initRetinaScaling();
            }
            if (options.overlayImage) {
                this.setOverlayImage(options.overlayImage, cb);
            }
            if (options.backgroundImage) {
                this.setBackgroundImage(options.backgroundImage, cb);
            }
            if (options.backgroundColor) {
                this.setBackgroundColor(options.backgroundColor, cb);
            }
            if (options.overlayColor) {
                this.setOverlayColor(options.overlayColor, cb);
            }
            this.calcOffset();
        },
        _isRetinaScaling: function() {
            return fabric.devicePixelRatio !== 1 && this.enableRetinaScaling;
        },
        getRetinaScaling: function() {
            return this._isRetinaScaling() ? fabric.devicePixelRatio : 1;
        },
        _initRetinaScaling: function() {
            if (!this._isRetinaScaling()) {
                return;
            }
            this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio);
            this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio);
            this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio);
        },
        calcOffset: function() {
            this._offset = getElementOffset(this.lowerCanvasEl);
            return this;
        },
        setOverlayImage: function(image, callback, options) {
            return this.__setBgOverlayImage("overlayImage", image, callback, options);
        },
        setBackgroundImage: function(image, callback, options) {
            return this.__setBgOverlayImage("backgroundImage", image, callback, options);
        },
        setOverlayColor: function(overlayColor, callback) {
            return this.__setBgOverlayColor("overlayColor", overlayColor, callback);
        },
        setBackgroundColor: function(backgroundColor, callback) {
            return this.__setBgOverlayColor("backgroundColor", backgroundColor, callback);
        },
        _setImageSmoothing: function() {
            var ctx = this.getContext();
            ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled || ctx.webkitImageSmoothingEnabled || ctx.mozImageSmoothingEnabled || ctx.msImageSmoothingEnabled || ctx.oImageSmoothingEnabled;
            ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
        },
        __setBgOverlayImage: function(property, image, callback, options) {
            if (typeof image === "string") {
                fabric.util.loadImage(image, function(img) {
                    img && (this[property] = new fabric.Image(img, options));
                    callback && callback(img);
                }, this, options && options.crossOrigin);
            } else {
                options && image.setOptions(options);
                this[property] = image;
                callback && callback(image);
            }
            return this;
        },
        __setBgOverlayColor: function(property, color, callback) {
            this[property] = color;
            this._initGradient(color, property);
            this._initPattern(color, property, callback);
            return this;
        },
        _createCanvasElement: function() {
            var element = fabric.util.createCanvasElement();
            if (!element) {
                throw CANVAS_INIT_ERROR;
            }
            if (!element.style) {
                element.style = {};
            }
            if (typeof element.getContext === "undefined") {
                throw CANVAS_INIT_ERROR;
            }
            return element;
        },
        _initOptions: function(options) {
            this._setOptions(options);
            this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0;
            this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;
            if (!this.lowerCanvasEl.style) {
                return;
            }
            this.lowerCanvasEl.width = this.width;
            this.lowerCanvasEl.height = this.height;
            this.lowerCanvasEl.style.width = this.width + "px";
            this.lowerCanvasEl.style.height = this.height + "px";
            this.viewportTransform = this.viewportTransform.slice();
        },
        _createLowerCanvas: function(canvasEl) {
            if (canvasEl && canvasEl.getContext) {
                this.lowerCanvasEl = canvasEl;
            } else {
                this.lowerCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement();
            }
            fabric.util.addClass(this.lowerCanvasEl, "lower-canvas");
            if (this.interactive) {
                this._applyCanvasStyle(this.lowerCanvasEl);
            }
            this.contextContainer = this.lowerCanvasEl.getContext("2d");
        },
        getWidth: function() {
            return this.width;
        },
        getHeight: function() {
            return this.height;
        },
        setWidth: function(value, options) {
            return this.setDimensions({
                width: value
            }, options);
        },
        setHeight: function(value, options) {
            return this.setDimensions({
                height: value
            }, options);
        },
        setDimensions: function(dimensions, options) {
            var cssValue;
            options = options || {};
            for (var prop in dimensions) {
                cssValue = dimensions[prop];
                if (!options.cssOnly) {
                    this._setBackstoreDimension(prop, dimensions[prop]);
                    cssValue += "px";
                }
                if (!options.backstoreOnly) {
                    this._setCssDimension(prop, cssValue);
                }
            }
            if (this._isCurrentlyDrawing) {
                this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles();
            }
            this._initRetinaScaling();
            this._setImageSmoothing();
            this.calcOffset();
            if (!options.cssOnly) {
                this.requestRenderAll();
            }
            return this;
        },
        _setBackstoreDimension: function(prop, value) {
            this.lowerCanvasEl[prop] = value;
            if (this.upperCanvasEl) {
                this.upperCanvasEl[prop] = value;
            }
            if (this.cacheCanvasEl) {
                this.cacheCanvasEl[prop] = value;
            }
            this[prop] = value;
            return this;
        },
        _setCssDimension: function(prop, value) {
            this.lowerCanvasEl.style[prop] = value;
            if (this.upperCanvasEl) {
                this.upperCanvasEl.style[prop] = value;
            }
            if (this.wrapperEl) {
                this.wrapperEl.style[prop] = value;
            }
            return this;
        },
        getZoom: function() {
            return this.viewportTransform[0];
        },
        setViewportTransform: function(vpt) {
            var activeObject = this._activeObject, object, ignoreVpt = false, skipAbsolute = true, i, len;
            this.viewportTransform = vpt;
            for (i = 0, len = this._objects.length; i < len; i++) {
                object = this._objects[i];
                object.group || object.setCoords(ignoreVpt, skipAbsolute);
            }
            if (activeObject && activeObject.type === "activeSelection") {
                activeObject.setCoords(ignoreVpt, skipAbsolute);
            }
            this.calcViewportBoundaries();
            this.renderOnAddRemove && this.requestRenderAll();
            return this;
        },
        zoomToPoint: function(point, value) {
            var before = point, vpt = this.viewportTransform.slice(0);
            point = transformPoint(point, invertTransform(this.viewportTransform));
            vpt[0] = value;
            vpt[3] = value;
            var after = transformPoint(point, vpt);
            vpt[4] += before.x - after.x;
            vpt[5] += before.y - after.y;
            return this.setViewportTransform(vpt);
        },
        setZoom: function(value) {
            this.zoomToPoint(new fabric.Point(0, 0), value);
            return this;
        },
        absolutePan: function(point) {
            var vpt = this.viewportTransform.slice(0);
            vpt[4] = -point.x;
            vpt[5] = -point.y;
            return this.setViewportTransform(vpt);
        },
        relativePan: function(point) {
            return this.absolutePan(new fabric.Point(-point.x - this.viewportTransform[4], -point.y - this.viewportTransform[5]));
        },
        getElement: function() {
            return this.lowerCanvasEl;
        },
        _onObjectAdded: function(obj) {
            this.stateful && obj.setupState();
            obj._set("canvas", this);
            obj.setCoords();
            this.fire("object:added", {
                target: obj
            });
            obj.fire("added");
        },
        _onObjectRemoved: function(obj) {
            this.fire("object:removed", {
                target: obj
            });
            obj.fire("removed");
            delete obj.canvas;
        },
        clearContext: function(ctx) {
            ctx.clearRect(0, 0, this.width, this.height);
            return this;
        },
        getContext: function() {
            return this.contextContainer;
        },
        clear: function() {
            this._objects.length = 0;
            this.backgroundImage = null;
            this.overlayImage = null;
            this.backgroundColor = "";
            this.overlayColor = "";
            if (this._hasITextHandlers) {
                this.off("mouse:up", this._mouseUpITextHandler);
                this._iTextInstances = null;
                this._hasITextHandlers = false;
            }
            this.clearContext(this.contextContainer);
            this.fire("canvas:cleared");
            this.renderOnAddRemove && this.requestRenderAll();
            return this;
        },
        renderAll: function() {
            var canvasToDrawOn = this.contextContainer;
            this.renderCanvas(canvasToDrawOn, this._objects);
            return this;
        },
        renderAndReset: function() {
            this.isRendering = 0;
            this.renderAll();
        },
        requestRenderAll: function() {
            if (!this.isRendering) {
                this.isRendering = fabric.util.requestAnimFrame(this.renderAndResetBound);
            }
            return this;
        },
        calcViewportBoundaries: function() {
            var points = {}, width = this.width, height = this.height, iVpt = invertTransform(this.viewportTransform);
            points.tl = transformPoint({
                x: 0,
                y: 0
            }, iVpt);
            points.br = transformPoint({
                x: width,
                y: height
            }, iVpt);
            points.tr = new fabric.Point(points.br.x, points.tl.y);
            points.bl = new fabric.Point(points.tl.x, points.br.y);
            this.vptCoords = points;
            return points;
        },
        renderCanvas: function(ctx, objects) {
            var v = this.viewportTransform;
            if (this.isRendering) {
                fabric.util.cancelAnimFrame(this.isRendering);
                this.isRendering = 0;
            }
            this.calcViewportBoundaries();
            this.clearContext(ctx);
            this.fire("before:render");
            if (this.clipTo) {
                fabric.util.clipContext(this, ctx);
            }
            this._renderBackground(ctx);
            ctx.save();
            ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
            this._renderObjects(ctx, objects);
            ctx.restore();
            if (!this.controlsAboveOverlay && this.interactive) {
                this.drawControls(ctx);
            }
            if (this.clipTo) {
                ctx.restore();
            }
            this._renderOverlay(ctx);
            if (this.controlsAboveOverlay && this.interactive) {
                this.drawControls(ctx);
            }
            this.fire("after:render");
        },
        _renderObjects: function(ctx, objects) {
            var i, len;
            for (i = 0, len = objects.length; i < len; ++i) {
                objects[i] && objects[i].render(ctx);
            }
        },
        _renderBackgroundOrOverlay: function(ctx, property) {
            var object = this[property + "Color"], v;
            if (object) {
                ctx.fillStyle = object.toLive ? object.toLive(ctx, this) : object;
                ctx.fillRect(object.offsetX || 0, object.offsetY || 0, this.width, this.height);
            }
            object = this[property + "Image"];
            if (object) {
                if (this[property + "Vpt"]) {
                    v = this.viewportTransform;
                    ctx.save();
                    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
                }
                object.render(ctx);
                this[property + "Vpt"] && ctx.restore();
            }
        },
        _renderBackground: function(ctx) {
            this._renderBackgroundOrOverlay(ctx, "background");
        },
        _renderOverlay: function(ctx) {
            this._renderBackgroundOrOverlay(ctx, "overlay");
        },
        getCenter: function() {
            return {
                top: this.height / 2,
                left: this.width / 2
            };
        },
        centerObjectH: function(object) {
            return this._centerObject(object, new fabric.Point(this.getCenter().left, object.getCenterPoint().y));
        },
        centerObjectV: function(object) {
            return this._centerObject(object, new fabric.Point(object.getCenterPoint().x, this.getCenter().top));
        },
        centerObject: function(object) {
            var center = this.getCenter();
            return this._centerObject(object, new fabric.Point(center.left, center.top));
        },
        viewportCenterObject: function(object) {
            var vpCenter = this.getVpCenter();
            return this._centerObject(object, vpCenter);
        },
        viewportCenterObjectH: function(object) {
            var vpCenter = this.getVpCenter();
            this._centerObject(object, new fabric.Point(vpCenter.x, object.getCenterPoint().y));
            return this;
        },
        viewportCenterObjectV: function(object) {
            var vpCenter = this.getVpCenter();
            return this._centerObject(object, new fabric.Point(object.getCenterPoint().x, vpCenter.y));
        },
        getVpCenter: function() {
            var center = this.getCenter(), iVpt = invertTransform(this.viewportTransform);
            return transformPoint({
                x: center.left,
                y: center.top
            }, iVpt);
        },
        _centerObject: function(object, center) {
            object.setPositionByOrigin(center, "center", "center");
            object.setCoords();
            this.renderOnAddRemove && this.requestRenderAll();
            return this;
        },
        toDatalessJSON: function(propertiesToInclude) {
            return this.toDatalessObject(propertiesToInclude);
        },
        toObject: function(propertiesToInclude) {
            return this._toObjectMethod("toObject", propertiesToInclude);
        },
        toDatalessObject: function(propertiesToInclude) {
            return this._toObjectMethod("toDatalessObject", propertiesToInclude);
        },
        _toObjectMethod: function(methodName, propertiesToInclude) {
            var data = {
                version: fabric.version,
                objects: this._toObjects(methodName, propertiesToInclude)
            };
            extend(data, this.__serializeBgOverlay(methodName, propertiesToInclude));
            fabric.util.populateWithProperties(this, data, propertiesToInclude);
            return data;
        },
        _toObjects: function(methodName, propertiesToInclude) {
            return this.getObjects().filter(function(object) {
                return !object.excludeFromExport;
            }).map(function(instance) {
                return this._toObject(instance, methodName, propertiesToInclude);
            }, this);
        },
        _toObject: function(instance, methodName, propertiesToInclude) {
            var originalValue;
            if (!this.includeDefaultValues) {
                originalValue = instance.includeDefaultValues;
                instance.includeDefaultValues = false;
            }
            var object = instance[methodName](propertiesToInclude);
            if (!this.includeDefaultValues) {
                instance.includeDefaultValues = originalValue;
            }
            return object;
        },
        __serializeBgOverlay: function(methodName, propertiesToInclude) {
            var data = {}, bgImage = this.backgroundImage, overlay = this.overlayImage;
            if (this.backgroundColor) {
                data.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(propertiesToInclude) : this.backgroundColor;
            }
            if (this.overlayColor) {
                data.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(propertiesToInclude) : this.overlayColor;
            }
            if (bgImage && !bgImage.excludeFromExport) {
                data.backgroundImage = this._toObject(bgImage, methodName, propertiesToInclude);
            }
            if (overlay && !overlay.excludeFromExport) {
                data.overlayImage = this._toObject(overlay, methodName, propertiesToInclude);
            }
            return data;
        },
        svgViewportTransformation: true,
        toSVG: function(options, reviver) {
            options || (options = {});
            var markup = [];
            this._setSVGPreamble(markup, options);
            this._setSVGHeader(markup, options);
            this._setSVGBgOverlayColor(markup, "backgroundColor");
            this._setSVGBgOverlayImage(markup, "backgroundImage", reviver);
            this._setSVGObjects(markup, reviver);
            this._setSVGBgOverlayColor(markup, "overlayColor");
            this._setSVGBgOverlayImage(markup, "overlayImage", reviver);
            markup.push("</svg>");
            return markup.join("");
        },
        _setSVGPreamble: function(markup, options) {
            if (options.suppressPreamble) {
                return;
            }
            markup.push('<?xml version="1.0" encoding="', options.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n');
        },
        _setSVGHeader: function(markup, options) {
            var width = options.width || this.width, height = options.height || this.height, vpt, viewBox = 'viewBox="0 0 ' + this.width + " " + this.height + '" ', NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
            if (options.viewBox) {
                viewBox = 'viewBox="' + options.viewBox.x + " " + options.viewBox.y + " " + options.viewBox.width + " " + options.viewBox.height + '" ';
            } else {
                if (this.svgViewportTransformation) {
                    vpt = this.viewportTransform;
                    viewBox = 'viewBox="' + toFixed(-vpt[4] / vpt[0], NUM_FRACTION_DIGITS) + " " + toFixed(-vpt[5] / vpt[3], NUM_FRACTION_DIGITS) + " " + toFixed(this.width / vpt[0], NUM_FRACTION_DIGITS) + " " + toFixed(this.height / vpt[3], NUM_FRACTION_DIGITS) + '" ';
                }
            }
            markup.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', width, '" ', 'height="', height, '" ', viewBox, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>\n", this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), "</defs>\n");
        },
        createSVGRefElementsMarkup: function() {
            var _this = this, markup = [ "backgroundColor", "overlayColor" ].map(function(prop) {
                var fill = _this[prop];
                if (fill && fill.toLive) {
                    return fill.toSVG(_this, false);
                }
            });
            return markup.join("");
        },
        createSVGFontFacesMarkup: function() {
            var markup = "", fontList = {}, obj, fontFamily, style, row, rowIndex, _char, charIndex, i, len, fontPaths = fabric.fontPaths, objects = this.getObjects();
            for (i = 0, len = objects.length; i < len; i++) {
                obj = objects[i];
                fontFamily = obj.fontFamily;
                if (obj.type.indexOf("text") === -1 || fontList[fontFamily] || !fontPaths[fontFamily]) {
                    continue;
                }
                fontList[fontFamily] = true;
                if (!obj.styles) {
                    continue;
                }
                style = obj.styles;
                for (rowIndex in style) {
                    row = style[rowIndex];
                    for (charIndex in row) {
                        _char = row[charIndex];
                        fontFamily = _char.fontFamily;
                        if (!fontList[fontFamily] && fontPaths[fontFamily]) {
                            fontList[fontFamily] = true;
                        }
                    }
                }
            }
            for (var j in fontList) {
                markup += [ "\t\t@font-face {\n", "\t\t\tfont-family: '", j, "';\n", "\t\t\tsrc: url('", fontPaths[j], "');\n", "\t\t}\n" ].join("");
            }
            if (markup) {
                markup = [ '\t<style type="text/css">', "<![CDATA[\n", markup, "]]>", "</style>\n" ].join("");
            }
            return markup;
        },
        _setSVGObjects: function(markup, reviver) {
            var instance, i, len, objects = this.getObjects();
            for (i = 0, len = objects.length; i < len; i++) {
                instance = objects[i];
                if (instance.excludeFromExport) {
                    continue;
                }
                this._setSVGObject(markup, instance, reviver);
            }
        },
        _setSVGObject: function(markup, instance, reviver) {
            markup.push(instance.toSVG(reviver));
        },
        _setSVGBgOverlayImage: function(markup, property, reviver) {
            if (this[property] && this[property].toSVG) {
                markup.push(this[property].toSVG(reviver));
            }
        },
        _setSVGBgOverlayColor: function(markup, property) {
            var filler = this[property];
            if (!filler) {
                return;
            }
            if (filler.toLive) {
                var repeat = filler.repeat;
                markup.push('<rect transform="translate(', this.width / 2, ",", this.height / 2, ')"', ' x="', filler.offsetX - this.width / 2, '" y="', filler.offsetY - this.height / 2, '" ', 'width="', repeat === "repeat-y" || repeat === "no-repeat" ? filler.source.width : this.width, '" height="', repeat === "repeat-x" || repeat === "no-repeat" ? filler.source.height : this.height, '" fill="url(#SVGID_' + filler.id + ')"', "></rect>\n");
            } else {
                markup.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[property], '"', "></rect>\n");
            }
        },
        sendToBack: function(object) {
            if (!object) {
                return this;
            }
            var activeSelection = this._activeObject, i, obj, objs;
            if (object === activeSelection && object.type === "activeSelection") {
                objs = activeSelection._objects;
                for (i = objs.length; i--; ) {
                    obj = objs[i];
                    removeFromArray(this._objects, obj);
                    this._objects.unshift(obj);
                }
            } else {
                removeFromArray(this._objects, object);
                this._objects.unshift(object);
            }
            this.renderOnAddRemove && this.requestRenderAll();
            return this;
        },
        bringToFront: function(object) {
            if (!object) {
                return this;
            }
            var activeSelection = this._activeObject, i, obj, objs;
            if (object === activeSelection && object.type === "activeSelection") {
                objs = activeSelection._objects;
                for (i = 0; i < objs.length; i++) {
                    obj = objs[i];
                    removeFromArray(this._objects, obj);
                    this._objects.push(obj);
                }
            } else {
                removeFromArray(this._objects, object);
                this._objects.push(object);
            }
            this.renderOnAddRemove && this.requestRenderAll();
            return this;
        },
        sendBackwards: function(object, intersecting) {
            if (!object) {
                return this;
            }
            var activeSelection = this._activeObject, i, obj, idx, newIdx, objs, objsMoved = 0;
            if (object === activeSelection && object.type === "activeSelection") {
                objs = activeSelection._objects;
                for (i = 0; i < objs.length; i++) {
                    obj = objs[i];
                    idx = this._objects.indexOf(obj);
                    if (idx > 0 + objsMoved) {
                        newIdx = idx - 1;
                        removeFromArray(this._objects, obj);
                        this._objects.splice(newIdx, 0, obj);
                    }
                    objsMoved++;
                }
            } else {
                idx = this._objects.indexOf(object);
                if (idx !== 0) {
                    newIdx = this._findNewLowerIndex(object, idx, intersecting);
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                }
            }
            this.renderOnAddRemove && this.requestRenderAll();
            return this;
        },
        _findNewLowerIndex: function(object, idx, intersecting) {
            var newIdx, i;
            if (intersecting) {
                newIdx = idx;
                for (i = idx - 1; i >= 0; --i) {
                    var isIntersecting = object.intersectsWithObject(this._objects[i]) || object.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(object);
                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx - 1;
            }
            return newIdx;
        },
        bringForward: function(object, intersecting) {
            if (!object) {
                return this;
            }
            var activeSelection = this._activeObject, i, obj, idx, newIdx, objs, objsMoved = 0;
            if (object === activeSelection && object.type === "activeSelection") {
                objs = activeSelection._objects;
                for (i = objs.length; i--; ) {
                    obj = objs[i];
                    idx = this._objects.indexOf(obj);
                    if (idx < this._objects.length - 1 - objsMoved) {
                        newIdx = idx + 1;
                        removeFromArray(this._objects, obj);
                        this._objects.splice(newIdx, 0, obj);
                    }
                    objsMoved++;
                }
            } else {
                idx = this._objects.indexOf(object);
                if (idx !== this._objects.length - 1) {
                    newIdx = this._findNewUpperIndex(object, idx, intersecting);
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                }
            }
            this.renderOnAddRemove && this.requestRenderAll();
            return this;
        },
        _findNewUpperIndex: function(object, idx, intersecting) {
            var newIdx, i, len;
            if (intersecting) {
                newIdx = idx;
                for (i = idx + 1, len = this._objects.length; i < len; ++i) {
                    var isIntersecting = object.intersectsWithObject(this._objects[i]) || object.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(object);
                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx + 1;
            }
            return newIdx;
        },
        moveTo: function(object, index) {
            removeFromArray(this._objects, object);
            this._objects.splice(index, 0, object);
            return this.renderOnAddRemove && this.requestRenderAll();
        },
        dispose: function() {
            this.forEachObject(function(object) {
                object.dispose && object.dispose();
            });
            this._objects = [];
            this.backgroundImage = null;
            this.overlayImage = null;
            this._iTextInstances = null;
            this.lowerCanvasEl = null;
            this.cacheCanvasEl = null;
            return this;
        },
        toString: function() {
            return "#<fabric.Canvas (" + this.complexity() + "): " + "{ objects: " + this.getObjects().length + " }>";
        }
    });
    extend(fabric.StaticCanvas.prototype, fabric.Observable);
    extend(fabric.StaticCanvas.prototype, fabric.Collection);
    extend(fabric.StaticCanvas.prototype, fabric.DataURLExporter);
    extend(fabric.StaticCanvas, {
        EMPTY_JSON: '{"objects": [], "background": "white"}',
        supports: function(methodName) {
            var el = fabric.util.createCanvasElement();
            if (!el || !el.getContext) {
                return null;
            }
            var ctx = el.getContext("2d");
            if (!ctx) {
                return null;
            }
            switch (methodName) {
              case "getImageData":
                return typeof ctx.getImageData !== "undefined";

              case "setLineDash":
                return typeof ctx.setLineDash !== "undefined";

              case "toDataURL":
                return typeof el.toDataURL !== "undefined";

              case "toDataURLWithQuality":
                try {
                    el.toDataURL("image/jpeg", 0);
                    return true;
                } catch (e) {}
                return false;

              default:
                return null;
            }
        }
    });
    fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject;
    if (fabric.isLikelyNode) {
        fabric.StaticCanvas.prototype.createPNGStream = function() {
            var impl = fabric.util.getNodeCanvas(this.lowerCanvasEl);
            return impl && impl.createPNGStream();
        };
        fabric.StaticCanvas.prototype.createJPEGStream = function(opts) {
            var impl = fabric.util.getNodeCanvas(this.lowerCanvasEl);
            return impl && impl.createJPEGStream(opts);
        };
    }
})();

(function() {
    var supportQuality = fabric.StaticCanvas.supports("toDataURLWithQuality");
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(options, callback) {
            options || (options = {});
            var format = options.format || "png", quality = options.quality || 1, multiplier = options.multiplier || 1, cropping = {
                left: options.left || 0,
                top: options.top || 0,
                width: options.width || 0,
                height: options.height || 0
            };
            return this.__toDataURLWithMultiplier(format, quality, cropping, multiplier, callback);
        },
        __toDataURLWithMultiplier: function(format, quality, cropping, multiplier, callback) {
            var origWidth = this.width, origHeight = this.height, scaledWidth = (cropping.width || this.width) * multiplier, scaledHeight = (cropping.height || this.height) * multiplier, zoom = this.getZoom(), newZoom = zoom * multiplier, vp = this.viewportTransform, translateX = (vp[4] - cropping.left) * multiplier, translateY = (vp[5] - cropping.top) * multiplier, newVp = [ newZoom, 0, 0, newZoom, translateX, translateY ], originalInteractive = this.interactive, originalSkipOffScreen = this.skipOffscreen, needsResize = origWidth !== scaledWidth || origHeight !== scaledHeight;
            this.viewportTransform = newVp;
            this.skipOffscreen = false;
            this.interactive = false;
            if (needsResize) {
                this.setDimensions({
                    width: scaledWidth,
                    height: scaledHeight
                }, {
                    backstoreOnly: true
                });
            }
            this.renderAll();
            var data = this.__toDataURL(format, quality, callback);
            this.interactive = originalInteractive;
            this.skipOffscreen = originalSkipOffScreen;
            this.viewportTransform = vp;
            if (needsResize) {
                this.setDimensions({
                    width: origWidth,
                    height: origHeight
                }, {
                    backstoreOnly: true
                });
            }
            this.renderAll();
            return data;
        },
        __toDataURL: function(format, quality, callback) {
            var canvasEl = this.contextContainer.canvas;
            if (format === "jpg") {
                format = "jpeg";
            }
            var data = supportQuality ? canvasEl.toDataURL("image/" + format, quality, callback) : canvasEl.toDataURL("image/" + format, callback);
            return data;
        }
    });
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, capitalize = fabric.util.string.capitalize, degreesToRadians = fabric.util.degreesToRadians, supportsLineDash = fabric.StaticCanvas.supports("setLineDash"), objectCaching = !fabric.isLikelyNode, ALIASING_LIMIT = 2;
    if (fabric.Object) {
        return;
    }
    fabric.Object = fabric.util.createClass(fabric.CommonMethods, {
        type: "object",
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        opacity: 1,
        angle: 0,
        skewX: 0,
        skewY: 0,
        cornerSize: 13,
        transparentCorners: true,
        hoverCursor: null,
        moveCursor: null,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        borderDashArray: null,
        cornerColor: "rgba(102,153,255,0.5)",
        cornerStrokeColor: null,
        cornerStyle: "rect",
        cornerDashArray: null,
        centeredScaling: false,
        centeredRotation: true,
        fill: "rgb(0,0,0)",
        fillRule: "nonzero",
        globalCompositeOperation: "source-over",
        backgroundColor: "",
        selectionBackgroundColor: "",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 10,
        shadow: null,
        borderOpacityWhenMoving: .4,
        borderScaleFactor: 1,
        transformMatrix: null,
        minScaleLimit: 0,
        selectable: true,
        evented: true,
        visible: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true,
        rotatingPointOffset: 40,
        perPixelTargetFind: false,
        includeDefaultValues: true,
        clipTo: null,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        lockUniScaling: false,
        lockSkewingX: false,
        lockSkewingY: false,
        lockScalingFlip: false,
        excludeFromExport: false,
        objectCaching: objectCaching,
        statefullCache: false,
        noScaleCache: true,
        dirty: true,
        __corner: 0,
        paintFirst: "fill",
        stateProperties: ("top left width height scaleX scaleY flipX flipY originX originY transformMatrix " + "stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit " + "angle opacity fill globalCompositeOperation shadow clipTo visible backgroundColor " + "skewX skewY fillRule paintFirst").split(" "),
        cacheProperties: ("fill stroke strokeWidth strokeDashArray width height paintFirst" + " strokeLineCap strokeLineJoin strokeMiterLimit backgroundColor").split(" "),
        initialize: function(options) {
            if (options) {
                this.setOptions(options);
            }
        },
        _createCacheCanvas: function() {
            this._cacheProperties = {};
            this._cacheCanvas = fabric.document.createElement("canvas");
            this._cacheContext = this._cacheCanvas.getContext("2d");
            this._updateCacheCanvas();
        },
        _limitCacheSize: function(dims) {
            var perfLimitSizeTotal = fabric.perfLimitSizeTotal, width = dims.width, height = dims.height, max = fabric.maxCacheSideLimit, min = fabric.minCacheSideLimit;
            if (width <= max && height <= max && width * height <= perfLimitSizeTotal) {
                if (width < min) {
                    dims.width = min;
                }
                if (height < min) {
                    dims.height = min;
                }
                return dims;
            }
            var ar = width / height, limitedDims = fabric.util.limitDimsByArea(ar, perfLimitSizeTotal), capValue = fabric.util.capValue, x = capValue(min, limitedDims.x, max), y = capValue(min, limitedDims.y, max);
            if (width > x) {
                dims.zoomX /= width / x;
                dims.width = x;
                dims.capped = true;
            }
            if (height > y) {
                dims.zoomY /= height / y;
                dims.height = y;
                dims.capped = true;
            }
            return dims;
        },
        _getCacheCanvasDimensions: function() {
            var zoom = this.canvas && this.canvas.getZoom() || 1, objectScale = this.getObjectScaling(), retina = this.canvas && this.canvas._isRetinaScaling() ? fabric.devicePixelRatio : 1, dim = this._getNonTransformedDimensions(), zoomX = objectScale.scaleX * zoom * retina, zoomY = objectScale.scaleY * zoom * retina, width = dim.x * zoomX, height = dim.y * zoomY;
            return {
                width: width + ALIASING_LIMIT,
                height: height + ALIASING_LIMIT,
                zoomX: zoomX,
                zoomY: zoomY,
                x: dim.x,
                y: dim.y
            };
        },
        _updateCacheCanvas: function() {
            if (this.noScaleCache && this.canvas && this.canvas._currentTransform) {
                var target = this.canvas._currentTransform.target, action = this.canvas._currentTransform.action;
                if (this === target && action.slice && action.slice(0, 5) === "scale") {
                    return false;
                }
            }
            var canvas = this._cacheCanvas, dims = this._limitCacheSize(this._getCacheCanvasDimensions()), minCacheSize = fabric.minCacheSideLimit, width = dims.width, height = dims.height, drawingWidth, drawingHeight, zoomX = dims.zoomX, zoomY = dims.zoomY, dimensionsChanged = width !== this.cacheWidth || height !== this.cacheHeight, zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY, shouldRedraw = dimensionsChanged || zoomChanged, additionalWidth = 0, additionalHeight = 0, shouldResizeCanvas = false;
            if (dimensionsChanged) {
                var canvasWidth = this._cacheCanvas.width, canvasHeight = this._cacheCanvas.height, sizeGrowing = width > canvasWidth || height > canvasHeight, sizeShrinking = (width < canvasWidth * .9 || height < canvasHeight * .9) && canvasWidth > minCacheSize && canvasHeight > minCacheSize;
                shouldResizeCanvas = sizeGrowing || sizeShrinking;
                if (sizeGrowing && !dims.capped && (width > minCacheSize || height > minCacheSize)) {
                    additionalWidth = width * .1;
                    additionalHeight = height * .1;
                }
            }
            if (shouldRedraw) {
                if (shouldResizeCanvas) {
                    canvas.width = Math.ceil(width + additionalWidth);
                    canvas.height = Math.ceil(height + additionalHeight);
                } else {
                    this._cacheContext.setTransform(1, 0, 0, 1, 0, 0);
                    this._cacheContext.clearRect(0, 0, canvas.width, canvas.height);
                }
                drawingWidth = dims.x * zoomX / 2;
                drawingHeight = dims.y * zoomY / 2;
                this.cacheTranslationX = Math.round(canvas.width / 2 - drawingWidth) + drawingWidth;
                this.cacheTranslationY = Math.round(canvas.height / 2 - drawingHeight) + drawingHeight;
                this.cacheWidth = width;
                this.cacheHeight = height;
                this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY);
                this._cacheContext.scale(zoomX, zoomY);
                this.zoomX = zoomX;
                this.zoomY = zoomY;
                return true;
            }
            return false;
        },
        setOptions: function(options) {
            this._setOptions(options);
            this._initGradient(options.fill, "fill");
            this._initGradient(options.stroke, "stroke");
            this._initClipping(options);
            this._initPattern(options.fill, "fill");
            this._initPattern(options.stroke, "stroke");
        },
        transform: function(ctx) {
            var m;
            if (this.group && !this.group._transformDone) {
                m = this.calcTransformMatrix();
            } else {
                m = this.calcOwnMatrix();
            }
            ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        },
        toObject: function(propertiesToInclude) {
            var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, object = {
                type: this.type,
                version: fabric.version,
                originX: this.originX,
                originY: this.originY,
                left: toFixed(this.left, NUM_FRACTION_DIGITS),
                top: toFixed(this.top, NUM_FRACTION_DIGITS),
                width: toFixed(this.width, NUM_FRACTION_DIGITS),
                height: toFixed(this.height, NUM_FRACTION_DIGITS),
                fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                strokeWidth: toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
                strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeMiterLimit: toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
                scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
                scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
                angle: toFixed(this.angle, NUM_FRACTION_DIGITS),
                flipX: this.flipX,
                flipY: this.flipY,
                opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
                shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                visible: this.visible,
                clipTo: this.clipTo && String(this.clipTo),
                backgroundColor: this.backgroundColor,
                fillRule: this.fillRule,
                paintFirst: this.paintFirst,
                globalCompositeOperation: this.globalCompositeOperation,
                transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null,
                skewX: toFixed(this.skewX, NUM_FRACTION_DIGITS),
                skewY: toFixed(this.skewY, NUM_FRACTION_DIGITS)
            };
            fabric.util.populateWithProperties(this, object, propertiesToInclude);
            if (!this.includeDefaultValues) {
                object = this._removeDefaultValues(object);
            }
            return object;
        },
        toDatalessObject: function(propertiesToInclude) {
            return this.toObject(propertiesToInclude);
        },
        _removeDefaultValues: function(object) {
            var prototype = fabric.util.getKlass(object.type).prototype, stateProperties = prototype.stateProperties;
            stateProperties.forEach(function(prop) {
                if (object[prop] === prototype[prop]) {
                    delete object[prop];
                }
                var isArray = Object.prototype.toString.call(object[prop]) === "[object Array]" && Object.prototype.toString.call(prototype[prop]) === "[object Array]";
                if (isArray && object[prop].length === 0 && prototype[prop].length === 0) {
                    delete object[prop];
                }
            });
            return object;
        },
        toString: function() {
            return "#<fabric." + capitalize(this.type) + ">";
        },
        getObjectScaling: function() {
            var scaleX = this.scaleX, scaleY = this.scaleY;
            if (this.group) {
                var scaling = this.group.getObjectScaling();
                scaleX *= scaling.scaleX;
                scaleY *= scaling.scaleY;
            }
            return {
                scaleX: scaleX,
                scaleY: scaleY
            };
        },
        getObjectOpacity: function() {
            var opacity = this.opacity;
            if (this.group) {
                opacity *= this.group.getObjectOpacity();
            }
            return opacity;
        },
        _set: function(key, value) {
            var shouldConstrainValue = key === "scaleX" || key === "scaleY", isChanged = this[key] !== value, groupNeedsUpdate = false;
            if (shouldConstrainValue) {
                value = this._constrainScale(value);
            }
            if (key === "scaleX" && value < 0) {
                this.flipX = !this.flipX;
                value *= -1;
            } else if (key === "scaleY" && value < 0) {
                this.flipY = !this.flipY;
                value *= -1;
            } else if (key === "shadow" && value && !(value instanceof fabric.Shadow)) {
                value = new fabric.Shadow(value);
            } else if (key === "dirty" && this.group) {
                this.group.set("dirty", value);
            }
            this[key] = value;
            if (isChanged) {
                groupNeedsUpdate = this.group && this.group.isOnACache();
                if (this.cacheProperties.indexOf(key) > -1) {
                    this.dirty = true;
                    groupNeedsUpdate && this.group.set("dirty", true);
                } else if (groupNeedsUpdate && this.stateProperties.indexOf(key) > -1) {
                    this.group.set("dirty", true);
                }
            }
            return this;
        },
        setOnGroup: function() {},
        getViewportTransform: function() {
            if (this.canvas && this.canvas.viewportTransform) {
                return this.canvas.viewportTransform;
            }
            return fabric.iMatrix.concat();
        },
        isNotVisible: function() {
            return this.opacity === 0 || this.width === 0 && this.height === 0 || !this.visible;
        },
        render: function(ctx) {
            if (this.isNotVisible()) {
                return;
            }
            if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
                return;
            }
            ctx.save();
            this._setupCompositeOperation(ctx);
            this.drawSelectionBackground(ctx);
            this.transform(ctx);
            this._setOpacity(ctx);
            this._setShadow(ctx, this);
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this.clipTo && fabric.util.clipContext(this, ctx);
            if (this.shouldCache()) {
                if (!this._cacheCanvas) {
                    this._createCacheCanvas();
                }
                if (this.isCacheDirty()) {
                    this.statefullCache && this.saveState({
                        propertySet: "cacheProperties"
                    });
                    this.drawObject(this._cacheContext);
                    this.dirty = false;
                }
                this.drawCacheOnCanvas(ctx);
            } else {
                this._removeCacheCanvas();
                this.dirty = false;
                this.drawObject(ctx);
                if (this.objectCaching && this.statefullCache) {
                    this.saveState({
                        propertySet: "cacheProperties"
                    });
                }
            }
            this.clipTo && ctx.restore();
            ctx.restore();
        },
        _removeCacheCanvas: function() {
            this._cacheCanvas = null;
            this.cacheWidth = 0;
            this.cacheHeight = 0;
        },
        needsItsOwnCache: function() {
            if (this.paintFirst === "stroke" && typeof this.shadow === "object") {
                return true;
            }
            return false;
        },
        shouldCache: function() {
            this.ownCaching = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isOnACache());
            return this.ownCaching;
        },
        willDrawShadow: function() {
            return !!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0);
        },
        drawObject: function(ctx) {
            this._renderBackground(ctx);
            this._setStrokeStyles(ctx, this);
            this._setFillStyles(ctx, this);
            this._render(ctx);
        },
        drawCacheOnCanvas: function(ctx) {
            ctx.scale(1 / this.zoomX, 1 / this.zoomY);
            ctx.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY);
        },
        isCacheDirty: function(skipCanvas) {
            if (this.isNotVisible()) {
                return false;
            }
            if (this._cacheCanvas && !skipCanvas && this._updateCacheCanvas()) {
                return true;
            } else {
                if (this.dirty || this.statefullCache && this.hasStateChanged("cacheProperties")) {
                    if (this._cacheCanvas && !skipCanvas) {
                        var width = this.cacheWidth / this.zoomX;
                        var height = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-width / 2, -height / 2, width, height);
                    }
                    return true;
                }
            }
            return false;
        },
        _renderBackground: function(ctx) {
            if (!this.backgroundColor) {
                return;
            }
            var dim = this._getNonTransformedDimensions();
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
            this._removeShadow(ctx);
        },
        _setOpacity: function(ctx) {
            if (this.group && !this.group._transformDone) {
                ctx.globalAlpha = this.getObjectOpacity();
            } else {
                ctx.globalAlpha *= this.opacity;
            }
        },
        _setStrokeStyles: function(ctx, decl) {
            if (decl.stroke) {
                ctx.lineWidth = decl.strokeWidth;
                ctx.lineCap = decl.strokeLineCap;
                ctx.lineJoin = decl.strokeLineJoin;
                ctx.miterLimit = decl.strokeMiterLimit;
                ctx.strokeStyle = decl.stroke.toLive ? decl.stroke.toLive(ctx, this) : decl.stroke;
            }
        },
        _setFillStyles: function(ctx, decl) {
            if (decl.fill) {
                ctx.fillStyle = decl.fill.toLive ? decl.fill.toLive(ctx, this) : decl.fill;
            }
        },
        _setLineDash: function(ctx, dashArray, alternative) {
            if (!dashArray) {
                return;
            }
            if (1 & dashArray.length) {
                dashArray.push.apply(dashArray, dashArray);
            }
            if (supportsLineDash) {
                ctx.setLineDash(dashArray);
            } else {
                alternative && alternative(ctx);
            }
        },
        _renderControls: function(ctx, styleOverride) {
            var vpt = this.getViewportTransform(), matrix = this.calcTransformMatrix(), options, drawBorders, drawControls;
            styleOverride = styleOverride || {};
            drawBorders = typeof styleOverride.hasBorders !== "undefined" ? styleOverride.hasBorders : this.hasBorders;
            drawControls = typeof styleOverride.hasControls !== "undefined" ? styleOverride.hasControls : this.hasControls;
            matrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
            options = fabric.util.qrDecompose(matrix);
            ctx.save();
            ctx.translate(options.translateX, options.translateY);
            ctx.lineWidth = 1 * this.borderScaleFactor;
            if (!this.group) {
                ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            }
            if (styleOverride.forActiveSelection) {
                ctx.rotate(degreesToRadians(options.angle));
                drawBorders && this.drawBordersInGroup(ctx, options, styleOverride);
            } else {
                ctx.rotate(degreesToRadians(this.angle));
                drawBorders && this.drawBorders(ctx, styleOverride);
            }
            drawControls && this.drawControls(ctx, styleOverride);
            ctx.restore();
        },
        _setShadow: function(ctx) {
            if (!this.shadow) {
                return;
            }
            var multX = this.canvas && this.canvas.viewportTransform[0] || 1, multY = this.canvas && this.canvas.viewportTransform[3] || 1, scaling = this.getObjectScaling();
            if (this.canvas && this.canvas._isRetinaScaling()) {
                multX *= fabric.devicePixelRatio;
                multY *= fabric.devicePixelRatio;
            }
            ctx.shadowColor = this.shadow.color;
            ctx.shadowBlur = this.shadow.blur * fabric.browserShadowBlurConstant * (multX + multY) * (scaling.scaleX + scaling.scaleY) / 4;
            ctx.shadowOffsetX = this.shadow.offsetX * multX * scaling.scaleX;
            ctx.shadowOffsetY = this.shadow.offsetY * multY * scaling.scaleY;
        },
        _removeShadow: function(ctx) {
            if (!this.shadow) {
                return;
            }
            ctx.shadowColor = "";
            ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
        },
        _applyPatternGradientTransform: function(ctx, filler) {
            if (!filler || !filler.toLive) {
                return {
                    offsetX: 0,
                    offsetY: 0
                };
            }
            var t = filler.gradientTransform || filler.patternTransform;
            var offsetX = -this.width / 2 + filler.offsetX || 0, offsetY = -this.height / 2 + filler.offsetY || 0;
            ctx.translate(offsetX, offsetY);
            if (t) {
                ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
            }
            return {
                offsetX: offsetX,
                offsetY: offsetY
            };
        },
        _renderPaintInOrder: function(ctx) {
            if (this.paintFirst === "stroke") {
                this._renderStroke(ctx);
                this._renderFill(ctx);
            } else {
                this._renderFill(ctx);
                this._renderStroke(ctx);
            }
        },
        _renderFill: function(ctx) {
            if (!this.fill) {
                return;
            }
            ctx.save();
            this._applyPatternGradientTransform(ctx, this.fill);
            if (this.fillRule === "evenodd") {
                ctx.fill("evenodd");
            } else {
                ctx.fill();
            }
            ctx.restore();
        },
        _renderStroke: function(ctx) {
            if (!this.stroke || this.strokeWidth === 0) {
                return;
            }
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(ctx);
            }
            ctx.save();
            this._setLineDash(ctx, this.strokeDashArray, this._renderDashedStroke);
            this._applyPatternGradientTransform(ctx, this.stroke);
            ctx.stroke();
            ctx.restore();
        },
        _findCenterFromElement: function() {
            return {
                x: this.left + this.width / 2,
                y: this.top + this.height / 2
            };
        },
        _assignTransformMatrixProps: function() {
            if (this.transformMatrix) {
                var options = fabric.util.qrDecompose(this.transformMatrix);
                this.flipX = false;
                this.flipY = false;
                this.set("scaleX", options.scaleX);
                this.set("scaleY", options.scaleY);
                this.angle = options.angle;
                this.skewX = options.skewX;
                this.skewY = 0;
            }
        },
        _removeTransformMatrix: function(preserveAspectRatioOptions) {
            var center = this._findCenterFromElement();
            if (this.transformMatrix) {
                this._assignTransformMatrixProps();
                center = fabric.util.transformPoint(center, this.transformMatrix);
            }
            this.transformMatrix = null;
            if (preserveAspectRatioOptions) {
                this.scaleX *= preserveAspectRatioOptions.scaleX;
                this.scaleY *= preserveAspectRatioOptions.scaleY;
                this.cropX = preserveAspectRatioOptions.cropX;
                this.cropY = preserveAspectRatioOptions.cropY;
                center.x += preserveAspectRatioOptions.offsetLeft;
                center.y += preserveAspectRatioOptions.offsetTop;
                this.width = preserveAspectRatioOptions.width;
                this.height = preserveAspectRatioOptions.height;
            }
            this.setPositionByOrigin(center, "center", "center");
        },
        clone: function(callback, propertiesToInclude) {
            var objectForm = this.toObject(propertiesToInclude);
            if (this.constructor.fromObject) {
                this.constructor.fromObject(objectForm, callback);
            } else {
                fabric.Object._fromObject("Object", objectForm, callback);
            }
        },
        cloneAsImage: function(callback, options) {
            var dataUrl = this.toDataURL(options);
            fabric.util.loadImage(dataUrl, function(img) {
                if (callback) {
                    callback(new fabric.Image(img));
                }
            });
            return this;
        },
        toDataURL: function(options) {
            options || (options = {});
            var el = fabric.util.createCanvasElement(), boundingRect = this.getBoundingRect();
            el.width = boundingRect.width;
            el.height = boundingRect.height;
            fabric.util.wrapElement(el, "div");
            var canvas = new fabric.StaticCanvas(el, {
                enableRetinaScaling: options.enableRetinaScaling,
                renderOnAddRemove: false,
                skipOffscreen: false
            });
            if (options.format === "jpg") {
                options.format = "jpeg";
            }
            if (options.format === "jpeg") {
                canvas.backgroundColor = "#fff";
            }
            var origParams = {
                left: this.left,
                top: this.top
            };
            this.setPositionByOrigin(new fabric.Point(canvas.width / 2, canvas.height / 2), "center", "center");
            var originalCanvas = this.canvas;
            canvas.add(this);
            var data = canvas.toDataURL(options);
            this.set(origParams).setCoords();
            this.canvas = originalCanvas;
            canvas._objects = [];
            canvas.dispose();
            canvas = null;
            return data;
        },
        isType: function(type) {
            return this.type === type;
        },
        complexity: function() {
            return 1;
        },
        toJSON: function(propertiesToInclude) {
            return this.toObject(propertiesToInclude);
        },
        setGradient: function(property, options) {
            options || (options = {});
            var gradient = {
                colorStops: []
            };
            gradient.type = options.type || (options.r1 || options.r2 ? "radial" : "linear");
            gradient.coords = {
                x1: options.x1,
                y1: options.y1,
                x2: options.x2,
                y2: options.y2
            };
            if (options.r1 || options.r2) {
                gradient.coords.r1 = options.r1;
                gradient.coords.r2 = options.r2;
            }
            gradient.gradientTransform = options.gradientTransform;
            fabric.Gradient.prototype.addColorStop.call(gradient, options.colorStops);
            return this.set(property, fabric.Gradient.forObject(this, gradient));
        },
        setPatternFill: function(options) {
            return this.set("fill", new fabric.Pattern(options));
        },
        setShadow: function(options) {
            return this.set("shadow", options ? new fabric.Shadow(options) : null);
        },
        setColor: function(color) {
            this.set("fill", color);
            return this;
        },
        rotate: function(angle) {
            var shouldCenterOrigin = (this.originX !== "center" || this.originY !== "center") && this.centeredRotation;
            if (shouldCenterOrigin) {
                this._setOriginToCenter();
            }
            this.set("angle", angle);
            if (shouldCenterOrigin) {
                this._resetOrigin();
            }
            return this;
        },
        centerH: function() {
            this.canvas && this.canvas.centerObjectH(this);
            return this;
        },
        viewportCenterH: function() {
            this.canvas && this.canvas.viewportCenterObjectH(this);
            return this;
        },
        centerV: function() {
            this.canvas && this.canvas.centerObjectV(this);
            return this;
        },
        viewportCenterV: function() {
            this.canvas && this.canvas.viewportCenterObjectV(this);
            return this;
        },
        center: function() {
            this.canvas && this.canvas.centerObject(this);
            return this;
        },
        viewportCenter: function() {
            this.canvas && this.canvas.viewportCenterObject(this);
            return this;
        },
        getLocalPointer: function(e, pointer) {
            pointer = pointer || this.canvas.getPointer(e);
            var pClicked = new fabric.Point(pointer.x, pointer.y), objectLeftTop = this._getLeftTopCoords();
            if (this.angle) {
                pClicked = fabric.util.rotatePoint(pClicked, objectLeftTop, degreesToRadians(-this.angle));
            }
            return {
                x: pClicked.x - objectLeftTop.x,
                y: pClicked.y - objectLeftTop.y
            };
        },
        _setupCompositeOperation: function(ctx) {
            if (this.globalCompositeOperation) {
                ctx.globalCompositeOperation = this.globalCompositeOperation;
            }
        }
    });
    fabric.util.createAccessors && fabric.util.createAccessors(fabric.Object);
    extend(fabric.Object.prototype, fabric.Observable);
    fabric.Object.NUM_FRACTION_DIGITS = 2;
    fabric.Object._fromObject = function(className, object, callback, extraParam) {
        var klass = fabric[className];
        object = clone(object, true);
        fabric.util.enlivenPatterns([ object.fill, object.stroke ], function(patterns) {
            if (typeof patterns[0] !== "undefined") {
                object.fill = patterns[0];
            }
            if (typeof patterns[1] !== "undefined") {
                object.stroke = patterns[1];
            }
            var instance = extraParam ? new klass(object[extraParam], object) : new klass(object);
            callback && callback(instance);
        });
    };
    fabric.Object.__uid = 0;
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, originXOffset = {
        left: -.5,
        center: 0,
        right: .5
    }, originYOffset = {
        top: -.5,
        center: 0,
        bottom: .5
    };
    fabric.util.object.extend(fabric.Object.prototype, {
        translateToGivenOrigin: function(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
            var x = point.x, y = point.y, offsetX, offsetY, dim;
            if (typeof fromOriginX === "string") {
                fromOriginX = originXOffset[fromOriginX];
            } else {
                fromOriginX -= .5;
            }
            if (typeof toOriginX === "string") {
                toOriginX = originXOffset[toOriginX];
            } else {
                toOriginX -= .5;
            }
            offsetX = toOriginX - fromOriginX;
            if (typeof fromOriginY === "string") {
                fromOriginY = originYOffset[fromOriginY];
            } else {
                fromOriginY -= .5;
            }
            if (typeof toOriginY === "string") {
                toOriginY = originYOffset[toOriginY];
            } else {
                toOriginY -= .5;
            }
            offsetY = toOriginY - fromOriginY;
            if (offsetX || offsetY) {
                dim = this._getTransformedDimensions();
                x = point.x + offsetX * dim.x;
                y = point.y + offsetY * dim.y;
            }
            return new fabric.Point(x, y);
        },
        translateToCenterPoint: function(point, originX, originY) {
            var p = this.translateToGivenOrigin(point, originX, originY, "center", "center");
            if (this.angle) {
                return fabric.util.rotatePoint(p, point, degreesToRadians(this.angle));
            }
            return p;
        },
        translateToOriginPoint: function(center, originX, originY) {
            var p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
            if (this.angle) {
                return fabric.util.rotatePoint(p, center, degreesToRadians(this.angle));
            }
            return p;
        },
        getCenterPoint: function() {
            var leftTop = new fabric.Point(this.left, this.top);
            return this.translateToCenterPoint(leftTop, this.originX, this.originY);
        },
        getPointByOrigin: function(originX, originY) {
            var center = this.getCenterPoint();
            return this.translateToOriginPoint(center, originX, originY);
        },
        toLocalPoint: function(point, originX, originY) {
            var center = this.getCenterPoint(), p, p2;
            if (typeof originX !== "undefined" && typeof originY !== "undefined") {
                p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
            } else {
                p = new fabric.Point(this.left, this.top);
            }
            p2 = new fabric.Point(point.x, point.y);
            if (this.angle) {
                p2 = fabric.util.rotatePoint(p2, center, -degreesToRadians(this.angle));
            }
            return p2.subtractEquals(p);
        },
        setPositionByOrigin: function(pos, originX, originY) {
            var center = this.translateToCenterPoint(pos, originX, originY), position = this.translateToOriginPoint(center, this.originX, this.originY);
            this.set("left", position.x);
            this.set("top", position.y);
        },
        adjustPosition: function(to) {
            var angle = degreesToRadians(this.angle), hypotFull = this.getScaledWidth(), xFull = Math.cos(angle) * hypotFull, yFull = Math.sin(angle) * hypotFull, offsetFrom, offsetTo;
            if (typeof this.originX === "string") {
                offsetFrom = originXOffset[this.originX];
            } else {
                offsetFrom = this.originX - .5;
            }
            if (typeof to === "string") {
                offsetTo = originXOffset[to];
            } else {
                offsetTo = to - .5;
            }
            this.left += xFull * (offsetTo - offsetFrom);
            this.top += yFull * (offsetTo - offsetFrom);
            this.setCoords();
            this.originX = to;
        },
        _setOriginToCenter: function() {
            this._originalOriginX = this.originX;
            this._originalOriginY = this.originY;
            var center = this.getCenterPoint();
            this.originX = "center";
            this.originY = "center";
            this.left = center.x;
            this.top = center.y;
        },
        _resetOrigin: function() {
            var originPoint = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.originX = this._originalOriginX;
            this.originY = this._originalOriginY;
            this.left = originPoint.x;
            this.top = originPoint.y;
            this._originalOriginX = null;
            this._originalOriginY = null;
        },
        _getLeftTopCoords: function() {
            return this.translateToOriginPoint(this.getCenterPoint(), "left", "top");
        },
        onDeselect: function() {}
    });
})();

(function() {
    function getCoords(coords) {
        return [ new fabric.Point(coords.tl.x, coords.tl.y), new fabric.Point(coords.tr.x, coords.tr.y), new fabric.Point(coords.br.x, coords.br.y), new fabric.Point(coords.bl.x, coords.bl.y) ];
    }
    var degreesToRadians = fabric.util.degreesToRadians, multiplyMatrices = fabric.util.multiplyTransformMatrices;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null,
        aCoords: null,
        ownMatrixCache: null,
        matrixCache: null,
        getCoords: function(absolute, calculate) {
            if (!this.oCoords) {
                this.setCoords();
            }
            var coords = absolute ? this.aCoords : this.oCoords;
            return getCoords(calculate ? this.calcCoords(absolute) : coords);
        },
        intersectsWithRect: function(pointTL, pointBR, absolute, calculate) {
            var coords = this.getCoords(absolute, calculate), intersection = fabric.Intersection.intersectPolygonRectangle(coords, pointTL, pointBR);
            return intersection.status === "Intersection";
        },
        intersectsWithObject: function(other, absolute, calculate) {
            var intersection = fabric.Intersection.intersectPolygonPolygon(this.getCoords(absolute, calculate), other.getCoords(absolute, calculate));
            return intersection.status === "Intersection" || other.isContainedWithinObject(this, absolute, calculate) || this.isContainedWithinObject(other, absolute, calculate);
        },
        isContainedWithinObject: function(other, absolute, calculate) {
            var points = this.getCoords(absolute, calculate), i = 0, lines = other._getImageLines(calculate ? other.calcCoords(absolute) : absolute ? other.aCoords : other.oCoords);
            for (;i < 4; i++) {
                if (!other.containsPoint(points[i], lines)) {
                    return false;
                }
            }
            return true;
        },
        isContainedWithinRect: function(pointTL, pointBR, absolute, calculate) {
            var boundingRect = this.getBoundingRect(absolute, calculate);
            return boundingRect.left >= pointTL.x && boundingRect.left + boundingRect.width <= pointBR.x && boundingRect.top >= pointTL.y && boundingRect.top + boundingRect.height <= pointBR.y;
        },
        containsPoint: function(point, lines, absolute, calculate) {
            var lines = lines || this._getImageLines(calculate ? this.calcCoords(absolute) : absolute ? this.aCoords : this.oCoords), xPoints = this._findCrossPoints(point, lines);
            return xPoints !== 0 && xPoints % 2 === 1;
        },
        isOnScreen: function(calculate) {
            if (!this.canvas) {
                return false;
            }
            var pointTL = this.canvas.vptCoords.tl, pointBR = this.canvas.vptCoords.br;
            var points = this.getCoords(true, calculate), point;
            for (var i = 0; i < 4; i++) {
                point = points[i];
                if (point.x <= pointBR.x && point.x >= pointTL.x && point.y <= pointBR.y && point.y >= pointTL.y) {
                    return true;
                }
            }
            if (this.intersectsWithRect(pointTL, pointBR, true)) {
                return true;
            }
            var centerPoint = {
                x: (pointTL.x + pointBR.x) / 2,
                y: (pointTL.y + pointBR.y) / 2
            };
            if (this.containsPoint(centerPoint, null, true)) {
                return true;
            }
            return false;
        },
        _getImageLines: function(oCoords) {
            return {
                topline: {
                    o: oCoords.tl,
                    d: oCoords.tr
                },
                rightline: {
                    o: oCoords.tr,
                    d: oCoords.br
                },
                bottomline: {
                    o: oCoords.br,
                    d: oCoords.bl
                },
                leftline: {
                    o: oCoords.bl,
                    d: oCoords.tl
                }
            };
        },
        _findCrossPoints: function(point, lines) {
            var b1, b2, a1, a2, xi, xcount = 0, iLine;
            for (var lineKey in lines) {
                iLine = lines[lineKey];
                if (iLine.o.y < point.y && iLine.d.y < point.y) {
                    continue;
                }
                if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
                    continue;
                }
                if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
                    xi = iLine.o.x;
                } else {
                    b1 = 0;
                    b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
                    a1 = point.y - b1 * point.x;
                    a2 = iLine.o.y - b2 * iLine.o.x;
                    xi = -(a1 - a2) / (b1 - b2);
                }
                if (xi >= point.x) {
                    xcount += 1;
                }
                if (xcount === 2) {
                    break;
                }
            }
            return xcount;
        },
        getBoundingRect: function(absolute, calculate) {
            var coords = this.getCoords(absolute, calculate);
            return fabric.util.makeBoundingBoxFromPoints(coords);
        },
        getScaledWidth: function() {
            return this._getTransformedDimensions().x;
        },
        getScaledHeight: function() {
            return this._getTransformedDimensions().y;
        },
        _constrainScale: function(value) {
            if (Math.abs(value) < this.minScaleLimit) {
                if (value < 0) {
                    return -this.minScaleLimit;
                } else {
                    return this.minScaleLimit;
                }
            } else if (value === 0) {
                return 1e-4;
            }
            return value;
        },
        scale: function(value) {
            this._set("scaleX", value);
            this._set("scaleY", value);
            return this.setCoords();
        },
        scaleToWidth: function(value, absolute) {
            var boundingRectFactor = this.getBoundingRect(absolute).width / this.getScaledWidth();
            return this.scale(value / this.width / boundingRectFactor);
        },
        scaleToHeight: function(value, absolute) {
            var boundingRectFactor = this.getBoundingRect(absolute).height / this.getScaledHeight();
            return this.scale(value / this.height / boundingRectFactor);
        },
        calcCoords: function(absolute) {
            var theta = degreesToRadians(this.angle), vpt = this.getViewportTransform(), dim = absolute ? this._getTransformedDimensions() : this._calculateCurrentDimensions(), currentWidth = dim.x, currentHeight = dim.y, sinTh = theta ? Math.sin(theta) : 0, cosTh = theta ? Math.cos(theta) : 1, _angle = currentWidth > 0 ? Math.atan(currentHeight / currentWidth) : 0, _hypotenuse = currentWidth / Math.cos(_angle) / 2, offsetX = Math.cos(_angle + theta) * _hypotenuse, offsetY = Math.sin(_angle + theta) * _hypotenuse, center = this.getCenterPoint(), coords = absolute ? center : fabric.util.transformPoint(center, vpt), tl = new fabric.Point(coords.x - offsetX, coords.y - offsetY), tr = new fabric.Point(tl.x + currentWidth * cosTh, tl.y + currentWidth * sinTh), bl = new fabric.Point(tl.x - currentHeight * sinTh, tl.y + currentHeight * cosTh), br = new fabric.Point(coords.x + offsetX, coords.y + offsetY);
            if (!absolute) {
                var ml = new fabric.Point((tl.x + bl.x) / 2, (tl.y + bl.y) / 2), mt = new fabric.Point((tr.x + tl.x) / 2, (tr.y + tl.y) / 2), mr = new fabric.Point((br.x + tr.x) / 2, (br.y + tr.y) / 2), mb = new fabric.Point((br.x + bl.x) / 2, (br.y + bl.y) / 2), mtr = new fabric.Point(mt.x + sinTh * this.rotatingPointOffset, mt.y - cosTh * this.rotatingPointOffset);
            }
            var coords = {
                tl: tl,
                tr: tr,
                br: br,
                bl: bl
            };
            if (!absolute) {
                coords.ml = ml;
                coords.mt = mt;
                coords.mr = mr;
                coords.mb = mb;
                coords.mtr = mtr;
            }
            return coords;
        },
        setCoords: function(ignoreZoom, skipAbsolute) {
            this.oCoords = this.calcCoords(ignoreZoom);
            if (!skipAbsolute) {
                this.aCoords = this.calcCoords(true);
            }
            ignoreZoom || this._setCornerCoords && this._setCornerCoords();
            return this;
        },
        _calcRotateMatrix: function() {
            if (this.angle) {
                var theta = degreesToRadians(this.angle), cos = Math.cos(theta), sin = Math.sin(theta);
                if (cos === 6.123233995736766e-17 || cos === -1.8369701987210297e-16) {
                    cos = 0;
                }
                return [ cos, sin, -sin, cos, 0, 0 ];
            }
            return fabric.iMatrix.concat();
        },
        transformMatrixKey: function(skipGroup) {
            var sep = "_", prefix = "";
            if (!skipGroup && this.group) {
                prefix = this.group.transformMatrixKey(skipGroup) + sep;
            }
            return prefix + this.top + sep + this.left + sep + this.scaleX + sep + this.scaleY + sep + this.skewX + sep + this.skewY + sep + this.angle + sep + this.width + sep + this.height + sep + this.strokeWidth + this.flipX + this.flipY;
        },
        calcTransformMatrix: function(skipGroup) {
            if (skipGroup) {
                return this.calcOwnMatrix();
            }
            var key = this.transformMatrixKey(), cache = this.matrixCache || (this.matrixCache = {});
            if (cache.key === key) {
                return cache.value;
            }
            var matrix = this.calcOwnMatrix();
            if (this.group) {
                matrix = multiplyMatrices(this.group.calcTransformMatrix(), matrix);
            }
            cache.key = key;
            cache.value = matrix;
            return matrix;
        },
        calcOwnMatrix: function() {
            var key = this.transformMatrixKey(true), cache = this.ownMatrixCache || (this.ownMatrixCache = {});
            if (cache.key === key) {
                return cache.value;
            }
            var center = this.getCenterPoint(), matrix = [ 1, 0, 0, 1, center.x, center.y ], rotateMatrix, dimensionMatrix = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, true);
            if (this.angle) {
                rotateMatrix = this._calcRotateMatrix();
                matrix = multiplyMatrices(matrix, rotateMatrix);
            }
            matrix = multiplyMatrices(matrix, dimensionMatrix);
            cache.key = key;
            cache.value = matrix;
            return matrix;
        },
        _calcDimensionsTransformMatrix: function(skewX, skewY, flipping) {
            var skewMatrix, scaleX = this.scaleX * (flipping && this.flipX ? -1 : 1), scaleY = this.scaleY * (flipping && this.flipY ? -1 : 1), scaleMatrix = [ scaleX, 0, 0, scaleY, 0, 0 ];
            if (skewX) {
                skewMatrix = [ 1, 0, Math.tan(degreesToRadians(skewX)), 1 ];
                scaleMatrix = multiplyMatrices(scaleMatrix, skewMatrix, true);
            }
            if (skewY) {
                skewMatrix = [ 1, Math.tan(degreesToRadians(skewY)), 0, 1 ];
                scaleMatrix = multiplyMatrices(scaleMatrix, skewMatrix, true);
            }
            return scaleMatrix;
        },
        _getNonTransformedDimensions: function() {
            var strokeWidth = this.strokeWidth, w = this.width + strokeWidth, h = this.height + strokeWidth;
            return {
                x: w,
                y: h
            };
        },
        _getTransformedDimensions: function(skewX, skewY) {
            if (typeof skewX === "undefined") {
                skewX = this.skewX;
            }
            if (typeof skewY === "undefined") {
                skewY = this.skewY;
            }
            var dimensions = this._getNonTransformedDimensions(), dimX = dimensions.x / 2, dimY = dimensions.y / 2, points = [ {
                x: -dimX,
                y: -dimY
            }, {
                x: dimX,
                y: -dimY
            }, {
                x: -dimX,
                y: dimY
            }, {
                x: dimX,
                y: dimY
            } ], i, transformMatrix = this._calcDimensionsTransformMatrix(skewX, skewY, false), bbox;
            for (i = 0; i < points.length; i++) {
                points[i] = fabric.util.transformPoint(points[i], transformMatrix);
            }
            bbox = fabric.util.makeBoundingBoxFromPoints(points);
            return {
                x: bbox.width,
                y: bbox.height
            };
        },
        _calculateCurrentDimensions: function() {
            var vpt = this.getViewportTransform(), dim = this._getTransformedDimensions(), p = fabric.util.transformPoint(dim, vpt, true);
            return p.scalarAdd(2 * this.padding);
        }
    });
})();

fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendToBack.call(this.group, this);
        } else {
            this.canvas.sendToBack(this);
        }
        return this;
    },
    bringToFront: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringToFront.call(this.group, this);
        } else {
            this.canvas.bringToFront(this);
        }
        return this;
    },
    sendBackwards: function(intersecting) {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, intersecting);
        } else {
            this.canvas.sendBackwards(this, intersecting);
        }
        return this;
    },
    bringForward: function(intersecting) {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringForward.call(this.group, this, intersecting);
        } else {
            this.canvas.bringForward(this, intersecting);
        }
        return this;
    },
    moveTo: function(index) {
        if (this.group && this.group.type !== "activeSelection") {
            fabric.StaticCanvas.prototype.moveTo.call(this.group, this, index);
        } else {
            this.canvas.moveTo(this, index);
        }
        return this;
    }
});

(function() {
    var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
    function getSvgColorString(prop, value) {
        if (!value) {
            return prop + ": none; ";
        } else if (value.toLive) {
            return prop + ": url(#SVGID_" + value.id + "); ";
        } else {
            var color = new fabric.Color(value), str = prop + ": " + color.toRgb() + "; ", opacity = color.getAlpha();
            if (opacity !== 1) {
                str += prop + "-opacity: " + opacity.toString() + "; ";
            }
            return str;
        }
    }
    var toFixed = fabric.util.toFixed;
    fabric.util.object.extend(fabric.Object.prototype, {
        getSvgStyles: function(skipShadow) {
            var fillRule = this.fillRule, strokeWidth = this.strokeWidth ? this.strokeWidth : "0", strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none", strokeLineCap = this.strokeLineCap ? this.strokeLineCap : "butt", strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : "miter", strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : "4", opacity = typeof this.opacity !== "undefined" ? this.opacity : "1", visibility = this.visible ? "" : " visibility: hidden;", filter = skipShadow ? "" : this.getSvgFilter(), fill = getSvgColorString("fill", this.fill), stroke = getSvgColorString("stroke", this.stroke);
            return [ stroke, "stroke-width: ", strokeWidth, "; ", "stroke-dasharray: ", strokeDashArray, "; ", "stroke-linecap: ", strokeLineCap, "; ", "stroke-linejoin: ", strokeLineJoin, "; ", "stroke-miterlimit: ", strokeMiterLimit, "; ", fill, "fill-rule: ", fillRule, "; ", "opacity: ", opacity, ";", filter, visibility ].join("");
        },
        getSvgSpanStyles: function(style, useWhiteSpace) {
            var term = "; ", strokeWidth = style.strokeWidth ? "stroke-width: " + style.strokeWidth + term : "", fontFamily = style.fontFamily ? "font-family: " + style.fontFamily.replace(/"/g, "'") + term : "", fontSize = style.fontSize ? "font-size: " + style.fontSize + term : "", fontStyle = style.fontStyle ? "font-style: " + style.fontStyle + term : "", fontWeight = style.fontWeight ? "font-weight: " + style.fontWeight + term : "", fill = style.fill ? getSvgColorString("fill", style.fill) : "", stroke = style.stroke ? getSvgColorString("stroke", style.stroke) : "", textDecoration = this.getSvgTextDecoration(style);
            if (textDecoration) {
                textDecoration = "text-decoration: " + textDecoration + term;
            }
            return [ stroke, strokeWidth, fontFamily, fontSize, fontStyle, fontWeight, textDecoration, fill, useWhiteSpace ? "white-space: pre; " : "" ].join("");
        },
        getSvgTextDecoration: function(style) {
            if ("overline" in style || "underline" in style || "linethrough" in style) {
                return (style.overline ? "overline " : "") + (style.underline ? "underline " : "") + (style.linethrough ? "line-through " : "");
            }
            return "";
        },
        getSvgFilter: function() {
            return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : "";
        },
        getSvgId: function() {
            return this.id ? 'id="' + this.id + '" ' : "";
        },
        getSvgTransform: function() {
            var angle = this.angle, skewX = this.skewX % 360, skewY = this.skewY % 360, center = this.getCenterPoint(), NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, translatePart = "translate(" + toFixed(center.x, NUM_FRACTION_DIGITS) + " " + toFixed(center.y, NUM_FRACTION_DIGITS) + ")", anglePart = angle !== 0 ? " rotate(" + toFixed(angle, NUM_FRACTION_DIGITS) + ")" : "", scalePart = this.scaleX === 1 && this.scaleY === 1 ? "" : " scale(" + toFixed(this.scaleX, NUM_FRACTION_DIGITS) + " " + toFixed(this.scaleY, NUM_FRACTION_DIGITS) + ")", skewXPart = skewX !== 0 ? " skewX(" + toFixed(skewX, NUM_FRACTION_DIGITS) + ")" : "", skewYPart = skewY !== 0 ? " skewY(" + toFixed(skewY, NUM_FRACTION_DIGITS) + ")" : "", flipXPart = this.flipX ? " matrix(-1 0 0 1 0 0) " : "", flipYPart = this.flipY ? " matrix(1 0 0 -1 0 0)" : "";
            return [ translatePart, anglePart, scalePart, flipXPart, flipYPart, skewXPart, skewYPart ].join("");
        },
        getSvgTransformMatrix: function() {
            return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : "";
        },
        _setSVGBg: function(textBgRects) {
            if (this.backgroundColor) {
                textBgRects.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', toFixed(-this.width / 2, NUM_FRACTION_DIGITS), '" y="', toFixed(-this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(this.width, NUM_FRACTION_DIGITS), '" height="', toFixed(this.height, NUM_FRACTION_DIGITS), '"></rect>\n');
            }
        },
        _createBaseSVGMarkup: function() {
            var markup = [];
            if (this.fill && this.fill.toLive) {
                markup.push(this.fill.toSVG(this, false));
            }
            if (this.stroke && this.stroke.toLive) {
                markup.push(this.stroke.toSVG(this, false));
            }
            if (this.shadow) {
                markup.push(this.shadow.toSVG(this));
            }
            return markup;
        },
        addPaintOrder: function() {
            return this.paintFirst !== "fill" ? ' paint-order="' + this.paintFirst + '" ' : "";
        }
    });
})();

(function() {
    var extend = fabric.util.object.extend, originalSet = "stateProperties";
    function saveProps(origin, destination, props) {
        var tmpObj = {}, deep = true;
        props.forEach(function(prop) {
            tmpObj[prop] = origin[prop];
        });
        extend(origin[destination], tmpObj, deep);
    }
    function _isEqual(origValue, currentValue, firstPass) {
        if (origValue === currentValue) {
            return true;
        } else if (Array.isArray(origValue)) {
            if (origValue.length !== currentValue.length) {
                return false;
            }
            for (var i = 0, len = origValue.length; i < len; i++) {
                if (!_isEqual(origValue[i], currentValue[i])) {
                    return false;
                }
            }
            return true;
        } else if (origValue && typeof origValue === "object") {
            var keys = Object.keys(origValue), key;
            if (!firstPass && keys.length !== Object.keys(currentValue).length) {
                return false;
            }
            for (var i = 0, len = keys.length; i < len; i++) {
                key = keys[i];
                if (!_isEqual(origValue[key], currentValue[key])) {
                    return false;
                }
            }
            return true;
        }
    }
    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function(propertySet) {
            propertySet = propertySet || originalSet;
            var dashedPropertySet = "_" + propertySet;
            if (Object.keys(this[dashedPropertySet]).length < this[propertySet].length) {
                return true;
            }
            return !_isEqual(this[dashedPropertySet], this, true);
        },
        saveState: function(options) {
            var propertySet = options && options.propertySet || originalSet, destination = "_" + propertySet;
            if (!this[destination]) {
                return this.setupState(options);
            }
            saveProps(this, destination, this[propertySet]);
            if (options && options.stateProperties) {
                saveProps(this, destination, options.stateProperties);
            }
            return this;
        },
        setupState: function(options) {
            options = options || {};
            var propertySet = options.propertySet || originalSet;
            options.propertySet = propertySet;
            this["_" + propertySet] = {};
            this.saveState(options);
            return this;
        }
    });
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, clone = fabric.util.object.clone, coordProps = {
        x1: 1,
        x2: 1,
        y1: 1,
        y2: 1
    }, supportsLineDash = fabric.StaticCanvas.supports("setLineDash");
    if (fabric.Line) {
        fabric.warn("fabric.Line is already defined");
        return;
    }
    fabric.Line = fabric.util.createClass(fabric.Object, {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cacheProperties: fabric.Object.prototype.cacheProperties.concat("x1", "x2", "y1", "y2"),
        initialize: function(points, options) {
            if (!points) {
                points = [ 0, 0, 0, 0 ];
            }
            this.callSuper("initialize", options);
            this.set("x1", points[0]);
            this.set("y1", points[1]);
            this.set("x2", points[2]);
            this.set("y2", points[3]);
            this._setWidthHeight(options);
        },
        _setWidthHeight: function(options) {
            options || (options = {});
            this.width = Math.abs(this.x2 - this.x1);
            this.height = Math.abs(this.y2 - this.y1);
            this.left = "left" in options ? options.left : this._getLeftToOriginX();
            this.top = "top" in options ? options.top : this._getTopToOriginY();
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (typeof coordProps[key] !== "undefined") {
                this._setWidthHeight();
            }
            return this;
        },
        _getLeftToOriginX: makeEdgeToOriginGetter({
            origin: "originX",
            axis1: "x1",
            axis2: "x2",
            dimension: "width"
        }, {
            nearest: "left",
            center: "center",
            farthest: "right"
        }),
        _getTopToOriginY: makeEdgeToOriginGetter({
            origin: "originY",
            axis1: "y1",
            axis2: "y2",
            dimension: "height"
        }, {
            nearest: "top",
            center: "center",
            farthest: "bottom"
        }),
        _render: function(ctx) {
            ctx.beginPath();
            if (!this.strokeDashArray || this.strokeDashArray && supportsLineDash) {
                var p = this.calcLinePoints();
                ctx.moveTo(p.x1, p.y1);
                ctx.lineTo(p.x2, p.y2);
            }
            ctx.lineWidth = this.strokeWidth;
            var origStrokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = this.stroke || ctx.fillStyle;
            this.stroke && this._renderStroke(ctx);
            ctx.strokeStyle = origStrokeStyle;
        },
        _renderDashedStroke: function(ctx) {
            var p = this.calcLinePoints();
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, p.x1, p.y1, p.x2, p.y2, this.strokeDashArray);
            ctx.closePath();
        },
        _findCenterFromElement: function() {
            return {
                x: (this.x1 + this.x2) / 2,
                y: (this.y1 + this.y2) / 2
            };
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), this.calcLinePoints());
        },
        _getNonTransformedDimensions: function() {
            var dim = this.callSuper("_getNonTransformedDimensions");
            if (this.strokeLineCap === "butt") {
                if (this.width === 0) {
                    dim.y -= this.strokeWidth;
                }
                if (this.height === 0) {
                    dim.x -= this.strokeWidth;
                }
            }
            return dim;
        },
        calcLinePoints: function() {
            var xMult = this.x1 <= this.x2 ? -1 : 1, yMult = this.y1 <= this.y2 ? -1 : 1, x1 = xMult * this.width * .5, y1 = yMult * this.height * .5, x2 = xMult * this.width * -.5, y2 = yMult * this.height * -.5;
            return {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), p = this.calcLinePoints();
            markup.push("<line ", this.getSvgId(), 'x1="', p.x1, '" y1="', p.y1, '" x2="', p.x2, '" y2="', p.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        }
    });
    fabric.Line.fromObject = function(object, callback) {
        function _callback(instance) {
            delete instance.points;
            callback && callback(instance);
        }
        var options = clone(object, true);
        options.points = [ object.x1, object.y1, object.x2, object.y2 ];
        fabric.Object._fromObject("Line", options, _callback, "points");
    };
    function makeEdgeToOriginGetter(propertyNames, originValues) {
        var origin = propertyNames.origin, axis1 = propertyNames.axis1, axis2 = propertyNames.axis2, dimension = propertyNames.dimension, nearest = originValues.nearest, center = originValues.center, farthest = originValues.farthest;
        return function() {
            switch (this.get(origin)) {
              case nearest:
                return Math.min(this.get(axis1), this.get(axis2));

              case center:
                return Math.min(this.get(axis1), this.get(axis2)) + .5 * this.get(dimension);

              case farthest:
                return Math.max(this.get(axis1), this.get(axis2));
            }
        };
    }
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), pi = Math.PI;
    if (fabric.Circle) {
        fabric.warn("fabric.Circle is already defined.");
        return;
    }
    fabric.Circle = fabric.util.createClass(fabric.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: pi * 2,
        cacheProperties: fabric.Object.prototype.cacheProperties.concat("radius"),
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (key === "radius") {
                this.setRadius(value);
            }
            return this;
        },
        toObject: function(propertiesToInclude) {
            return this.callSuper("toObject", [ "radius", "startAngle", "endAngle" ].concat(propertiesToInclude));
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), x = 0, y = 0, angle = (this.endAngle - this.startAngle) % (2 * pi);
            if (angle === 0) {
                markup.push("<circle ", this.getSvgId(), 'cx="' + x + '" cy="' + y + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"', this.addPaintOrder(), "/>\n");
            } else {
                var startX = Math.cos(this.startAngle) * this.radius, startY = Math.sin(this.startAngle) * this.radius, endX = Math.cos(this.endAngle) * this.radius, endY = Math.sin(this.endAngle) * this.radius, largeFlag = angle > pi ? "1" : "0";
                markup.push('<path d="M ' + startX + " " + startY, " A " + this.radius + " " + this.radius, " 0 ", +largeFlag + " 1", " " + endX + " " + endY, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"', this.addPaintOrder(), '"/>\n');
            }
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, this.startAngle, this.endAngle, false);
            this._renderPaintInOrder(ctx);
        },
        getRadiusX: function() {
            return this.get("radius") * this.get("scaleX");
        },
        getRadiusY: function() {
            return this.get("radius") * this.get("scaleY");
        },
        setRadius: function(value) {
            this.radius = value;
            return this.set("width", value * 2).set("height", value * 2);
        }
    });
    fabric.Circle.fromObject = function(object, callback) {
        return fabric.Object._fromObject("Circle", object, callback);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Triangle) {
        fabric.warn("fabric.Triangle is already defined");
        return;
    }
    fabric.Triangle = fabric.util.createClass(fabric.Object, {
        type: "triangle",
        width: 100,
        height: 100,
        _render: function(ctx) {
            var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
            ctx.beginPath();
            ctx.moveTo(-widthBy2, heightBy2);
            ctx.lineTo(0, -heightBy2);
            ctx.lineTo(widthBy2, heightBy2);
            ctx.closePath();
            this._renderPaintInOrder(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, -widthBy2, heightBy2, 0, -heightBy2, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, 0, -heightBy2, widthBy2, heightBy2, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, widthBy2, heightBy2, -widthBy2, heightBy2, this.strokeDashArray);
            ctx.closePath();
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), widthBy2 = this.width / 2, heightBy2 = this.height / 2, points = [ -widthBy2 + " " + heightBy2, "0 " + -heightBy2, widthBy2 + " " + heightBy2 ].join(",");
            markup.push("<polygon ", this.getSvgId(), 'points="', points, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"', this.addPaintOrder(), "/>");
            return reviver ? reviver(markup.join("")) : markup.join("");
        }
    });
    fabric.Triangle.fromObject = function(object, callback) {
        return fabric.Object._fromObject("Triangle", object, callback);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), piBy2 = Math.PI * 2;
    if (fabric.Ellipse) {
        fabric.warn("fabric.Ellipse is already defined.");
        return;
    }
    fabric.Ellipse = fabric.util.createClass(fabric.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        cacheProperties: fabric.Object.prototype.cacheProperties.concat("rx", "ry"),
        initialize: function(options) {
            this.callSuper("initialize", options);
            this.set("rx", options && options.rx || 0);
            this.set("ry", options && options.ry || 0);
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            switch (key) {
              case "rx":
                this.rx = value;
                this.set("width", value * 2);
                break;

              case "ry":
                this.ry = value;
                this.set("height", value * 2);
                break;
            }
            return this;
        },
        getRx: function() {
            return this.get("rx") * this.get("scaleX");
        },
        getRy: function() {
            return this.get("ry") * this.get("scaleY");
        },
        toObject: function(propertiesToInclude) {
            return this.callSuper("toObject", [ "rx", "ry" ].concat(propertiesToInclude));
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup();
            markup.push("<ellipse ", this.getSvgId(), 'cx="0" cy="0" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"', this.addPaintOrder(), "/>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx) {
            ctx.beginPath();
            ctx.save();
            ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
            ctx.arc(0, 0, this.rx, 0, piBy2, false);
            ctx.restore();
            this._renderPaintInOrder(ctx);
        }
    });
    fabric.Ellipse.fromObject = function(object, callback) {
        return fabric.Object._fromObject("Ellipse", object, callback);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    if (fabric.Rect) {
        fabric.warn("fabric.Rect is already defined");
        return;
    }
    fabric.Rect = fabric.util.createClass(fabric.Object, {
        stateProperties: fabric.Object.prototype.stateProperties.concat("rx", "ry"),
        type: "rect",
        rx: 0,
        ry: 0,
        cacheProperties: fabric.Object.prototype.cacheProperties.concat("rx", "ry"),
        initialize: function(options) {
            this.callSuper("initialize", options);
            this._initRxRy();
        },
        _initRxRy: function() {
            if (this.rx && !this.ry) {
                this.ry = this.rx;
            } else if (this.ry && !this.rx) {
                this.rx = this.ry;
            }
        },
        _render: function(ctx) {
            if (this.width === 1 && this.height === 1) {
                ctx.fillRect(-.5, -.5, 1, 1);
                return;
            }
            var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0, ry = this.ry ? Math.min(this.ry, this.height / 2) : 0, w = this.width, h = this.height, x = -this.width / 2, y = -this.height / 2, isRounded = rx !== 0 || ry !== 0, k = 1 - .5522847498;
            ctx.beginPath();
            ctx.moveTo(x + rx, y);
            ctx.lineTo(x + w - rx, y);
            isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);
            ctx.lineTo(x + w, y + h - ry);
            isRounded && ctx.bezierCurveTo(x + w, y + h - k * ry, x + w - k * rx, y + h, x + w - rx, y + h);
            ctx.lineTo(x + rx, y + h);
            isRounded && ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);
            ctx.lineTo(x, y + ry);
            isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);
            ctx.closePath();
            this._renderPaintInOrder(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height;
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
            ctx.closePath();
        },
        toObject: function(propertiesToInclude) {
            return this.callSuper("toObject", [ "rx", "ry" ].concat(propertiesToInclude));
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), x = -this.width / 2, y = -this.height / 2;
            markup.push("<rect ", this.getSvgId(), 'x="', x, '" y="', y, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"', this.addPaintOrder(), "/>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        }
    });
    fabric.Rect.fromObject = function(object, callback) {
        return fabric.Object._fromObject("Rect", object, callback);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max, toFixed = fabric.util.toFixed, NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
    if (fabric.Polyline) {
        fabric.warn("fabric.Polyline is already defined");
        return;
    }
    fabric.Polyline = fabric.util.createClass(fabric.Object, {
        type: "polyline",
        points: null,
        cacheProperties: fabric.Object.prototype.cacheProperties.concat("points"),
        initialize: function(points, options) {
            options = options || {};
            this.points = points || [];
            this.callSuper("initialize", options);
            var calcDim = this._calcDimensions();
            if (typeof options.left === "undefined") {
                this.left = calcDim.left;
            }
            if (typeof options.top === "undefined") {
                this.top = calcDim.top;
            }
            this.width = calcDim.width;
            this.height = calcDim.height;
            this.pathOffset = {
                x: calcDim.left + this.width / 2,
                y: calcDim.top + this.height / 2
            };
        },
        _calcDimensions: function() {
            var points = this.points, minX = min(points, "x") || 0, minY = min(points, "y") || 0, maxX = max(points, "x") || 0, maxY = max(points, "y") || 0, width = maxX - minX, height = maxY - minY;
            return {
                left: minX,
                top: minY,
                width: width,
                height: height
            };
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                points: this.points.concat()
            });
        },
        toSVG: function(reviver) {
            var points = [], diffX = this.pathOffset.x, diffY = this.pathOffset.y, markup = this._createBaseSVGMarkup();
            for (var i = 0, len = this.points.length; i < len; i++) {
                points.push(toFixed(this.points[i].x - diffX, NUM_FRACTION_DIGITS), ",", toFixed(this.points[i].y - diffY, NUM_FRACTION_DIGITS), " ");
            }
            markup.push("<", this.type, " ", this.getSvgId(), 'points="', points.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"', this.addPaintOrder(), "/>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        commonRender: function(ctx) {
            var point, len = this.points.length, x = this.pathOffset.x, y = this.pathOffset.y;
            if (!len || isNaN(this.points[len - 1].y)) {
                return false;
            }
            ctx.beginPath();
            ctx.moveTo(this.points[0].x - x, this.points[0].y - y);
            for (var i = 0; i < len; i++) {
                point = this.points[i];
                ctx.lineTo(point.x - x, point.y - y);
            }
            return true;
        },
        _render: function(ctx) {
            if (!this.commonRender(ctx)) {
                return;
            }
            this._renderPaintInOrder(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var p1, p2;
            ctx.beginPath();
            for (var i = 0, len = this.points.length; i < len; i++) {
                p1 = this.points[i];
                p2 = this.points[i + 1] || p1;
                fabric.util.drawDashedLine(ctx, p1.x, p1.y, p2.x, p2.y, this.strokeDashArray);
            }
        },
        complexity: function() {
            return this.get("points").length;
        }
    });
    fabric.Polyline.fromObject = function(object, callback) {
        return fabric.Object._fromObject("Polyline", object, callback, "points");
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    if (fabric.Polygon) {
        fabric.warn("fabric.Polygon is already defined");
        return;
    }
    fabric.Polygon = fabric.util.createClass(fabric.Polyline, {
        type: "polygon",
        _render: function(ctx) {
            if (!this.commonRender(ctx)) {
                return;
            }
            ctx.closePath();
            this._renderPaintInOrder(ctx);
        },
        _renderDashedStroke: function(ctx) {
            this.callSuper("_renderDashedStroke", ctx);
            ctx.closePath();
        }
    });
    fabric.Polygon.fromObject = function(object, callback) {
        return fabric.Object._fromObject("Polygon", object, callback, "points");
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), min = fabric.util.array.min, max = fabric.util.array.max, extend = fabric.util.object.extend, _toString = Object.prototype.toString, drawArc = fabric.util.drawArc, commandLengths = {
        m: 2,
        l: 2,
        h: 1,
        v: 1,
        c: 6,
        s: 4,
        q: 4,
        t: 2,
        a: 7
    }, repeatedCommands = {
        m: "l",
        M: "L"
    };
    if (fabric.Path) {
        fabric.warn("fabric.Path is already defined");
        return;
    }
    fabric.Path = fabric.util.createClass(fabric.Object, {
        type: "path",
        path: null,
        cacheProperties: fabric.Object.prototype.cacheProperties.concat("path", "fillRule"),
        stateProperties: fabric.Object.prototype.stateProperties.concat("path"),
        initialize: function(path, options) {
            options = options || {};
            this.callSuper("initialize", options);
            if (!path) {
                path = [];
            }
            var fromArray = _toString.call(path) === "[object Array]";
            this.path = fromArray ? path : path.match && path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
            if (!this.path) {
                return;
            }
            if (!fromArray) {
                this.path = this._parsePath();
            }
            this._setPositionDimensions(options);
        },
        _setPositionDimensions: function(options) {
            var calcDim = this._parseDimensions();
            this.width = calcDim.width;
            this.height = calcDim.height;
            if (typeof options.left === "undefined") {
                this.left = calcDim.left;
            }
            if (typeof options.top === "undefined") {
                this.top = calcDim.top;
            }
            this.pathOffset = this.pathOffset || {
                x: calcDim.left + this.width / 2,
                y: calcDim.top + this.height / 2
            };
        },
        _renderPathCommands: function(ctx) {
            var current, previous = null, subpathStartX = 0, subpathStartY = 0, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, l = -this.pathOffset.x, t = -this.pathOffset.y;
            ctx.beginPath();
            for (var i = 0, len = this.path.length; i < len; ++i) {
                current = this.path[i];
                switch (current[0]) {
                  case "l":
                    x += current[1];
                    y += current[2];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "L":
                    x = current[1];
                    y = current[2];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "h":
                    x += current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "H":
                    x = current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "v":
                    y += current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "V":
                    y = current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "m":
                    x += current[1];
                    y += current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    ctx.moveTo(x + l, y + t);
                    break;

                  case "M":
                    x = current[1];
                    y = current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    ctx.moveTo(x + l, y + t);
                    break;

                  case "c":
                    tempX = x + current[5];
                    tempY = y + current[6];
                    controlX = x + current[3];
                    controlY = y + current[4];
                    ctx.bezierCurveTo(x + current[1] + l, y + current[2] + t, controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "C":
                    x = current[5];
                    y = current[6];
                    controlX = current[3];
                    controlY = current[4];
                    ctx.bezierCurveTo(current[1] + l, current[2] + t, controlX + l, controlY + t, x + l, y + t);
                    break;

                  case "s":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.bezierCurveTo(controlX + l, controlY + t, x + current[1] + l, y + current[2] + t, tempX + l, tempY + t);
                    controlX = x + current[1];
                    controlY = y + current[2];
                    x = tempX;
                    y = tempY;
                    break;

                  case "S":
                    tempX = current[3];
                    tempY = current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.bezierCurveTo(controlX + l, controlY + t, current[1] + l, current[2] + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "q":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    controlX = x + current[1];
                    controlY = y + current[2];
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "Q":
                    tempX = current[3];
                    tempY = current[4];
                    ctx.quadraticCurveTo(current[1] + l, current[2] + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "t":
                    tempX = x + current[1];
                    tempY = y + current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "T":
                    tempX = current[1];
                    tempY = current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "a":
                    drawArc(ctx, x + l, y + t, [ current[1], current[2], current[3], current[4], current[5], current[6] + x + l, current[7] + y + t ]);
                    x += current[6];
                    y += current[7];
                    break;

                  case "A":
                    drawArc(ctx, x + l, y + t, [ current[1], current[2], current[3], current[4], current[5], current[6] + l, current[7] + t ]);
                    x = current[6];
                    y = current[7];
                    break;

                  case "z":
                  case "Z":
                    x = subpathStartX;
                    y = subpathStartY;
                    ctx.closePath();
                    break;
                }
                previous = current;
            }
        },
        _render: function(ctx) {
            this._renderPathCommands(ctx);
            this._renderPaintInOrder(ctx);
        },
        toString: function() {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>";
        },
        toObject: function(propertiesToInclude) {
            var o = extend(this.callSuper("toObject", propertiesToInclude), {
                path: this.path.map(function(item) {
                    return item.slice();
                }),
                top: this.top,
                left: this.left
            });
            return o;
        },
        toDatalessObject: function(propertiesToInclude) {
            var o = this.toObject([ "sourcePath" ].concat(propertiesToInclude));
            if (o.sourcePath) {
                delete o.path;
            }
            return o;
        },
        toSVG: function(reviver) {
            var chunks = [], markup = this._createBaseSVGMarkup(), addTransform = "";
            for (var i = 0, len = this.path.length; i < len; i++) {
                chunks.push(this.path[i].join(" "));
            }
            var path = chunks.join(" ");
            addTransform = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") ";
            markup.push("<path ", this.getSvgId(), 'd="', path, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), addTransform, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', this.addPaintOrder(), "/>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return this.path.length;
        },
        _parsePath: function() {
            var result = [], coords = [], currentPath, parsed, re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, match, coordsStr;
            for (var i = 0, coordsParsed, len = this.path.length; i < len; i++) {
                currentPath = this.path[i];
                coordsStr = currentPath.slice(1).trim();
                coords.length = 0;
                while (match = re.exec(coordsStr)) {
                    coords.push(match[0]);
                }
                coordsParsed = [ currentPath.charAt(0) ];
                for (var j = 0, jlen = coords.length; j < jlen; j++) {
                    parsed = parseFloat(coords[j]);
                    if (!isNaN(parsed)) {
                        coordsParsed.push(parsed);
                    }
                }
                var command = coordsParsed[0], commandLength = commandLengths[command.toLowerCase()], repeatedCommand = repeatedCommands[command] || command;
                if (coordsParsed.length - 1 > commandLength) {
                    for (var k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
                        result.push([ command ].concat(coordsParsed.slice(k, k + commandLength)));
                        command = repeatedCommand;
                    }
                } else {
                    result.push(coordsParsed);
                }
            }
            return result;
        },
        _parseDimensions: function() {
            var aX = [], aY = [], current, previous = null, subpathStartX = 0, subpathStartY = 0, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, bounds;
            for (var i = 0, len = this.path.length; i < len; ++i) {
                current = this.path[i];
                switch (current[0]) {
                  case "l":
                    x += current[1];
                    y += current[2];
                    bounds = [];
                    break;

                  case "L":
                    x = current[1];
                    y = current[2];
                    bounds = [];
                    break;

                  case "h":
                    x += current[1];
                    bounds = [];
                    break;

                  case "H":
                    x = current[1];
                    bounds = [];
                    break;

                  case "v":
                    y += current[1];
                    bounds = [];
                    break;

                  case "V":
                    y = current[1];
                    bounds = [];
                    break;

                  case "m":
                    x += current[1];
                    y += current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    bounds = [];
                    break;

                  case "M":
                    x = current[1];
                    y = current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    bounds = [];
                    break;

                  case "c":
                    tempX = x + current[5];
                    tempY = y + current[6];
                    controlX = x + current[3];
                    controlY = y + current[4];
                    bounds = fabric.util.getBoundsOfCurve(x, y, x + current[1], y + current[2], controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "C":
                    controlX = current[3];
                    controlY = current[4];
                    bounds = fabric.util.getBoundsOfCurve(x, y, current[1], current[2], controlX, controlY, current[5], current[6]);
                    x = current[5];
                    y = current[6];
                    break;

                  case "s":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, x + current[1], y + current[2], tempX, tempY);
                    controlX = x + current[1];
                    controlY = y + current[2];
                    x = tempX;
                    y = tempY;
                    break;

                  case "S":
                    tempX = current[3];
                    tempY = current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, current[1], current[2], tempX, tempY);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "q":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    controlX = x + current[1];
                    controlY = y + current[2];
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "Q":
                    controlX = current[1];
                    controlY = current[2];
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, current[3], current[4]);
                    x = current[3];
                    y = current[4];
                    break;

                  case "t":
                    tempX = x + current[1];
                    tempY = y + current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "T":
                    tempX = current[1];
                    tempY = current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "a":
                    bounds = fabric.util.getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6] + x, current[7] + y);
                    x += current[6];
                    y += current[7];
                    break;

                  case "A":
                    bounds = fabric.util.getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6], current[7]);
                    x = current[6];
                    y = current[7];
                    break;

                  case "z":
                  case "Z":
                    x = subpathStartX;
                    y = subpathStartY;
                    break;
                }
                previous = current;
                bounds.forEach(function(point) {
                    aX.push(point.x);
                    aY.push(point.y);
                });
                aX.push(x);
                aY.push(y);
            }
            var minX = min(aX) || 0, minY = min(aY) || 0, maxX = max(aX) || 0, maxY = max(aY) || 0, deltaX = maxX - minX, deltaY = maxY - minY, o = {
                left: minX,
                top: minY,
                width: deltaX,
                height: deltaY
            };
            return o;
        }
    });
    fabric.Path.fromObject = function(object, callback) {
        if (typeof object.sourcePath === "string") {
            var pathUrl = object.sourcePath;
            fabric.loadSVGFromURL(pathUrl, function(elements) {
                var path = elements[0];
                path.setOptions(object);
                callback && callback(path);
            });
        } else {
            fabric.Object._fromObject("Path", object, callback, "path");
        }
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max;
    if (fabric.Group) {
        return;
    }
    fabric.Group = fabric.util.createClass(fabric.Object, fabric.Collection, {
        type: "group",
        strokeWidth: 0,
        subTargetCheck: false,
        cacheProperties: [],
        useSetOnGroup: false,
        initialize: function(objects, options, isAlreadyGrouped) {
            options = options || {};
            this._objects = [];
            isAlreadyGrouped && this.callSuper("initialize", options);
            this._objects = objects || [];
            for (var i = this._objects.length; i--; ) {
                this._objects[i].group = this;
            }
            if (options.originX) {
                this.originX = options.originX;
            }
            if (options.originY) {
                this.originY = options.originY;
            }
            if (!isAlreadyGrouped) {
                var center = options && options.centerPoint;
                center || this._calcBounds();
                this._updateObjectsCoords(center);
                delete options.centerPoint;
                this.callSuper("initialize", options);
            } else {
                this._updateObjectsACoords();
            }
            this.setCoords();
        },
        _updateObjectsACoords: function() {
            var ignoreZoom = true, skipAbsolute = true;
            for (var i = this._objects.length; i--; ) {
                this._objects[i].setCoords(ignoreZoom, skipAbsolute);
            }
        },
        _updateObjectsCoords: function(center) {
            var center = center || this.getCenterPoint();
            for (var i = this._objects.length; i--; ) {
                this._updateObjectCoords(this._objects[i], center);
            }
        },
        _updateObjectCoords: function(object, center) {
            var objectLeft = object.left, objectTop = object.top, ignoreZoom = true, skipAbsolute = true;
            object.set({
                left: objectLeft - center.x,
                top: objectTop - center.y
            });
            object.group = this;
            object.setCoords(ignoreZoom, skipAbsolute);
        },
        toString: function() {
            return "#<fabric.Group: (" + this.complexity() + ")>";
        },
        addWithUpdate: function(object) {
            this._restoreObjectsState();
            fabric.util.resetObjectTransform(this);
            if (object) {
                this._objects.push(object);
                object.group = this;
                object._set("canvas", this.canvas);
            }
            this._calcBounds();
            this._updateObjectsCoords();
            this.setCoords();
            this.dirty = true;
            return this;
        },
        removeWithUpdate: function(object) {
            this._restoreObjectsState();
            fabric.util.resetObjectTransform(this);
            this.remove(object);
            this._calcBounds();
            this._updateObjectsCoords();
            this.setCoords();
            this.dirty = true;
            return this;
        },
        _onObjectAdded: function(object) {
            this.dirty = true;
            object.group = this;
            object._set("canvas", this.canvas);
        },
        _onObjectRemoved: function(object) {
            this.dirty = true;
            delete object.group;
        },
        _set: function(key, value) {
            var i = this._objects.length;
            if (this.useSetOnGroup) {
                while (i--) {
                    this._objects[i].setOnGroup(key, value);
                }
            }
            if (key === "canvas") {
                i = this._objects.length;
                while (i--) {
                    this._objects[i]._set(key, value);
                }
            }
            this.callSuper("_set", key, value);
        },
        toObject: function(propertiesToInclude) {
            var objsToObject = this.getObjects().map(function(obj) {
                var originalDefaults = obj.includeDefaultValues;
                obj.includeDefaultValues = obj.group.includeDefaultValues;
                var _obj = obj.toObject(propertiesToInclude);
                obj.includeDefaultValues = originalDefaults;
                return _obj;
            });
            return extend(this.callSuper("toObject", propertiesToInclude), {
                objects: objsToObject
            });
        },
        toDatalessObject: function(propertiesToInclude) {
            var objsToObject, sourcePath = this.sourcePath;
            if (sourcePath) {
                objsToObject = sourcePath;
            } else {
                objsToObject = this.getObjects().map(function(obj) {
                    var originalDefaults = obj.includeDefaultValues;
                    obj.includeDefaultValues = obj.group.includeDefaultValues;
                    var _obj = obj.toDatalessObject(propertiesToInclude);
                    obj.includeDefaultValues = originalDefaults;
                    return _obj;
                });
            }
            return extend(this.callSuper("toDatalessObject", propertiesToInclude), {
                objects: objsToObject
            });
        },
        render: function(ctx) {
            this._transformDone = true;
            this.callSuper("render", ctx);
            this._transformDone = false;
        },
        shouldCache: function() {
            var ownCache = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isOnACache());
            this.ownCaching = ownCache;
            if (ownCache) {
                for (var i = 0, len = this._objects.length; i < len; i++) {
                    if (this._objects[i].willDrawShadow()) {
                        this.ownCaching = false;
                        return false;
                    }
                }
            }
            return ownCache;
        },
        willDrawShadow: function() {
            if (this.shadow) {
                return this.callSuper("willDrawShadow");
            }
            for (var i = 0, len = this._objects.length; i < len; i++) {
                if (this._objects[i].willDrawShadow()) {
                    return true;
                }
            }
            return false;
        },
        isOnACache: function() {
            return this.ownCaching || this.group && this.group.isOnACache();
        },
        drawObject: function(ctx) {
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i].render(ctx);
            }
        },
        isCacheDirty: function() {
            if (this.callSuper("isCacheDirty")) {
                return true;
            }
            if (!this.statefullCache) {
                return false;
            }
            for (var i = 0, len = this._objects.length; i < len; i++) {
                if (this._objects[i].isCacheDirty(true)) {
                    if (this._cacheCanvas) {
                        var x = this.cacheWidth / this.zoomX, y = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-x / 2, -y / 2, x, y);
                    }
                    return true;
                }
            }
            return false;
        },
        _restoreObjectsState: function() {
            this._objects.forEach(this._restoreObjectState, this);
            return this;
        },
        realizeTransform: function(object) {
            var matrix = object.calcTransformMatrix(), options = fabric.util.qrDecompose(matrix), center = new fabric.Point(options.translateX, options.translateY);
            object.flipX = false;
            object.flipY = false;
            object.set("scaleX", options.scaleX);
            object.set("scaleY", options.scaleY);
            object.skewX = options.skewX;
            object.skewY = options.skewY;
            object.angle = options.angle;
            object.setPositionByOrigin(center, "center", "center");
            return object;
        },
        _restoreObjectState: function(object) {
            this.realizeTransform(object);
            object.setCoords();
            delete object.group;
            return this;
        },
        destroy: function() {
            this._objects.forEach(function(object) {
                object.set("dirty", true);
            });
            return this._restoreObjectsState();
        },
        toActiveSelection: function() {
            if (!this.canvas) {
                return;
            }
            var objects = this._objects, canvas = this.canvas;
            this._objects = [];
            var options = this.toObject();
            delete options.objects;
            var activeSelection = new fabric.ActiveSelection([]);
            activeSelection.set(options);
            activeSelection.type = "activeSelection";
            canvas.remove(this);
            objects.forEach(function(object) {
                object.group = activeSelection;
                object.dirty = true;
                canvas.add(object);
            });
            activeSelection.canvas = canvas;
            activeSelection._objects = objects;
            canvas._activeObject = activeSelection;
            activeSelection.setCoords();
            return activeSelection;
        },
        ungroupOnCanvas: function() {
            return this._restoreObjectsState();
        },
        setObjectsCoords: function() {
            var ignoreZoom = true, skipAbsolute = true;
            this.forEachObject(function(object) {
                object.setCoords(ignoreZoom, skipAbsolute);
            });
            return this;
        },
        _calcBounds: function(onlyWidthHeight) {
            var aX = [], aY = [], o, prop, props = [ "tr", "br", "bl", "tl" ], i = 0, iLen = this._objects.length, j, jLen = props.length, ignoreZoom = true;
            for (;i < iLen; ++i) {
                o = this._objects[i];
                o.setCoords(ignoreZoom);
                for (j = 0; j < jLen; j++) {
                    prop = props[j];
                    aX.push(o.oCoords[prop].x);
                    aY.push(o.oCoords[prop].y);
                }
            }
            this.set(this._getBounds(aX, aY, onlyWidthHeight));
        },
        _getBounds: function(aX, aY, onlyWidthHeight) {
            var minXY = new fabric.Point(min(aX), min(aY)), maxXY = new fabric.Point(max(aX), max(aY)), obj = {
                width: maxXY.x - minXY.x || 0,
                height: maxXY.y - minXY.y || 0
            };
            if (!onlyWidthHeight) {
                obj.left = minXY.x || 0;
                obj.top = minXY.y || 0;
                if (this.originX === "center") {
                    obj.left += obj.width / 2;
                }
                if (this.originX === "right") {
                    obj.left += obj.width;
                }
                if (this.originY === "center") {
                    obj.top += obj.height / 2;
                }
                if (this.originY === "bottom") {
                    obj.top += obj.height;
                }
            }
            return obj;
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup();
            markup.push("<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '" style="', this.getSvgFilter(), '">\n');
            for (var i = 0, len = this._objects.length; i < len; i++) {
                markup.push("\t", this._objects[i].toSVG(reviver));
            }
            markup.push("</g>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        }
    });
    fabric.Group.fromObject = function(object, callback) {
        fabric.util.enlivenObjects(object.objects, function(enlivenedObjects) {
            var options = fabric.util.object.clone(object, true);
            delete options.objects;
            callback && callback(new fabric.Group(enlivenedObjects, options, true));
        });
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var extend = fabric.util.object.extend;
    if (!global.fabric) {
        global.fabric = {};
    }
    if (global.fabric.Image) {
        fabric.warn("fabric.Image is already defined.");
        return;
    }
    fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        strokeWidth: 0,
        _lastScaleX: 1,
        _lastScaleY: 1,
        _filterScalingX: 1,
        _filterScalingY: 1,
        minimumScaleTrigger: .5,
        stateProperties: fabric.Object.prototype.stateProperties.concat("cropX", "cropY"),
        objectCaching: false,
        cacheKey: "",
        cropX: 0,
        cropY: 0,
        initialize: function(element, options) {
            options || (options = {});
            this.filters = [];
            this.cacheKey = "texture" + fabric.Object.__uid++;
            this.callSuper("initialize", options);
            this._initElement(element, options);
        },
        getElement: function() {
            return this._element;
        },
        setElement: function(element, options) {
            var backend = fabric.filterBackend;
            if (backend && backend.evictCachesForKey) {
                backend.evictCachesForKey(this.cacheKey);
                backend.evictCachesForKey(this.cacheKey + "_filtered");
            }
            this._element = element;
            this._originalElement = element;
            this._initConfig(options);
            if (this.resizeFilter) {
                this.applyResizeFilters();
            }
            if (this.filters.length !== 0) {
                this.applyFilters();
            }
            return this;
        },
        dispose: function() {
            var backend = fabric.filterBackend;
            if (backend && backend.evictCachesForKey) {
                backend.evictCachesForKey(this.cacheKey);
                backend.evictCachesForKey(this.cacheKey + "_filtered");
            }
            this._originalElement = undefined;
            this._element = undefined;
            this._filteredEl = undefined;
        },
        setCrossOrigin: function(value) {
            this.crossOrigin = value;
            this._element.crossOrigin = value;
            return this;
        },
        getOriginalSize: function() {
            var element = this.getElement();
            return {
                width: element.width,
                height: element.height
            };
        },
        _stroke: function(ctx) {
            if (!this.stroke || this.strokeWidth === 0) {
                return;
            }
            var w = this.width / 2, h = this.height / 2;
            ctx.beginPath();
            ctx.moveTo(-w, -h);
            ctx.lineTo(w, -h);
            ctx.lineTo(w, h);
            ctx.lineTo(-w, h);
            ctx.lineTo(-w, -h);
            ctx.closePath();
        },
        _renderDashedStroke: function(ctx) {
            var x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height;
            ctx.save();
            this._setStrokeStyles(ctx, this);
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
            ctx.closePath();
            ctx.restore();
        },
        toObject: function(propertiesToInclude) {
            var filters = [];
            this.filters.forEach(function(filterObj) {
                if (filterObj) {
                    filters.push(filterObj.toObject());
                }
            });
            var object = extend(this.callSuper("toObject", [ "crossOrigin", "cropX", "cropY" ].concat(propertiesToInclude)), {
                src: this.getSrc(),
                filters: filters
            });
            if (this.resizeFilter) {
                object.resizeFilter = this.resizeFilter.toObject();
            }
            return object;
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), x = -this.width / 2, y = -this.height / 2;
            markup.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n');
            var imageMarkup = [ "\t<image ", this.getSvgId(), 'xlink:href="', this.getSvgSrc(true), '" x="', x, '" y="', y, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '"></image>\n' ];
            if (this.paintFirst === "fill") {
                Array.prototype.push.apply(markup, imageMarkup);
            }
            if (this.stroke || this.strokeDashArray) {
                var origFill = this.fill;
                this.fill = null;
                markup.push("\t<rect ", 'x="', x, '" y="', y, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n');
                this.fill = origFill;
            }
            if (this.paintFirst !== "fill") {
                Array.prototype.push.apply(markup, imageMarkup);
            }
            markup.push("</g>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        getSrc: function(filtered) {
            var element = filtered ? this._element : this._originalElement;
            if (element) {
                if (element.toDataURL) {
                    return element.toDataURL();
                }
                return element.src;
            } else {
                return this.src || "";
            }
        },
        setSrc: function(src, callback, options) {
            fabric.util.loadImage(src, function(img) {
                this.setElement(img, options);
                callback(this);
            }, this, options && options.crossOrigin);
            return this;
        },
        toString: function() {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
        },
        applyResizeFilters: function() {
            var filter = this.resizeFilter, retinaScaling = this.canvas ? this.canvas.getRetinaScaling() : 1, minimumScale = this.minimumScaleTrigger, scaleX = this.scaleX * retinaScaling, scaleY = this.scaleY * retinaScaling, elementToFilter = this._filteredEl || this._originalElement;
            if (!filter || scaleX > minimumScale && scaleY > minimumScale) {
                this._element = elementToFilter;
                this._filterScalingX = 1;
                this._filterScalingY = 1;
                return;
            }
            if (!fabric.filterBackend) {
                fabric.filterBackend = fabric.initFilterBackend();
            }
            var canvasEl = fabric.util.createCanvasElement(), cacheKey = this._filteredEl ? this.cacheKey : this.cacheKey + "_filtered", sourceWidth = elementToFilter.width, sourceHeight = elementToFilter.height;
            canvasEl.width = sourceWidth;
            canvasEl.height = sourceHeight;
            this._element = canvasEl;
            filter.scaleX = scaleX;
            filter.scaleY = scaleY;
            fabric.filterBackend.applyFilters([ filter ], elementToFilter, sourceWidth, sourceHeight, this._element, cacheKey);
            this._filterScalingX = canvasEl.width / this._originalElement.width;
            this._filterScalingY = canvasEl.height / this._originalElement.height;
        },
        applyFilters: function(filters) {
            filters = filters || this.filters || [];
            filters = filters.filter(function(filter) {
                return filter;
            });
            if (filters.length === 0) {
                this._element = this._originalElement;
                this._filteredEl = null;
                this._filterScalingX = 1;
                this._filterScalingY = 1;
                return this;
            }
            var imgElement = this._originalElement, sourceWidth = imgElement.naturalWidth || imgElement.width, sourceHeight = imgElement.naturalHeight || imgElement.height;
            if (this._element === this._originalElement) {
                var canvasEl = fabric.util.createCanvasElement();
                canvasEl.width = sourceWidth;
                canvasEl.height = sourceHeight;
                this._element = canvasEl;
                this._filteredEl = canvasEl;
            } else {
                this._element.getContext("2d").clearRect(0, 0, sourceWidth, sourceHeight);
            }
            if (!fabric.filterBackend) {
                fabric.filterBackend = fabric.initFilterBackend();
            }
            fabric.filterBackend.applyFilters(filters, this._originalElement, sourceWidth, sourceHeight, this._element, this.cacheKey);
            if (this._originalElement.width !== this._element.width || this._originalElement.height !== this._element.height) {
                this._filterScalingX = this._element.width / this._originalElement.width;
                this._filterScalingY = this._element.height / this._originalElement.height;
            }
            return this;
        },
        _render: function(ctx) {
            if (this.isMoving === false && this.resizeFilter && this._needsResize()) {
                this._lastScaleX = this.scaleX;
                this._lastScaleY = this.scaleY;
                this.applyResizeFilters();
            }
            this._stroke(ctx);
            this._renderPaintInOrder(ctx);
        },
        _renderFill: function(ctx) {
            var w = this.width, h = this.height, sW = w * this._filterScalingX, sH = h * this._filterScalingY, x = -w / 2, y = -h / 2, elementToDraw = this._element;
            elementToDraw && ctx.drawImage(elementToDraw, this.cropX * this._filterScalingX, this.cropY * this._filterScalingY, sW, sH, x, y, w, h);
        },
        _needsResize: function() {
            return this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY;
        },
        _resetWidthHeight: function() {
            var element = this.getElement();
            this.set("width", element.width);
            this.set("height", element.height);
        },
        _initElement: function(element, options) {
            this.setElement(fabric.util.getById(element), options);
            fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
        },
        _initConfig: function(options) {
            options || (options = {});
            this.setOptions(options);
            this._setWidthHeight(options);
            if (this._element && this.crossOrigin) {
                this._element.crossOrigin = this.crossOrigin;
            }
        },
        _initFilters: function(filters, callback) {
            if (filters && filters.length) {
                fabric.util.enlivenObjects(filters, function(enlivenedObjects) {
                    callback && callback(enlivenedObjects);
                }, "fabric.Image.filters");
            } else {
                callback && callback();
            }
        },
        _setWidthHeight: function(options) {
            this.width = "width" in options ? options.width : this.getElement() ? this.getElement().width || 0 : 0;
            this.height = "height" in options ? options.height : this.getElement() ? this.getElement().height || 0 : 0;
        },
        parsePreserveAspectRatioAttribute: function() {
            var pAR = fabric.util.parsePreserveAspectRatioAttribute(this.preserveAspectRatio || ""), rWidth = this._element.width, rHeight = this._element.height, scaleX = 1, scaleY = 1, offsetLeft = 0, offsetTop = 0, cropX = 0, cropY = 0, offset, pWidth = this.width, pHeight = this.height, parsedAttributes = {
                width: pWidth,
                height: pHeight
            };
            if (pAR && (pAR.alignX !== "none" || pAR.alignY !== "none")) {
                if (pAR.meetOrSlice === "meet") {
                    scaleX = scaleY = fabric.util.findScaleToFit(this._element, parsedAttributes);
                    offset = (pWidth - rWidth * scaleX) / 2;
                    if (pAR.alignX === "Min") {
                        offsetLeft = -offset;
                    }
                    if (pAR.alignX === "Max") {
                        offsetLeft = offset;
                    }
                    offset = (pHeight - rHeight * scaleY) / 2;
                    if (pAR.alignY === "Min") {
                        offsetTop = -offset;
                    }
                    if (pAR.alignY === "Max") {
                        offsetTop = offset;
                    }
                }
                if (pAR.meetOrSlice === "slice") {
                    scaleX = scaleY = fabric.util.findScaleToCover(this._element, parsedAttributes);
                    offset = rWidth - pWidth / scaleX;
                    if (pAR.alignX === "Mid") {
                        cropX = offset / 2;
                    }
                    if (pAR.alignX === "Max") {
                        cropX = offset;
                    }
                    offset = rHeight - pHeight / scaleY;
                    if (pAR.alignY === "Mid") {
                        cropY = offset / 2;
                    }
                    if (pAR.alignY === "Max") {
                        cropY = offset;
                    }
                    rWidth = pWidth / scaleX;
                    rHeight = pHeight / scaleY;
                }
            } else {
                scaleX = pWidth / rWidth;
                scaleY = pHeight / rHeight;
            }
            return {
                width: rWidth,
                height: rHeight,
                scaleX: scaleX,
                scaleY: scaleY,
                offsetLeft: offsetLeft,
                offsetTop: offsetTop,
                cropX: cropX,
                cropY: cropY
            };
        }
    });
    fabric.Image.CSS_CANVAS = "canvas-img";
    fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;
    fabric.Image.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img, error) {
            if (error) {
                callback && callback(null, error);
                return;
            }
            fabric.Image.prototype._initFilters.call(object, object.filters, function(filters) {
                object.filters = filters || [];
                fabric.Image.prototype._initFilters.call(object, [ object.resizeFilter ], function(resizeFilters) {
                    object.resizeFilter = resizeFilters[0];
                    var image = new fabric.Image(img, object);
                    callback(image);
                });
            });
        }, null, object.crossOrigin);
    };
    fabric.Image.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
            callback && callback(new fabric.Image(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
    };
})(typeof exports !== "undefined" ? exports : this);

window.fabric = fabric;

if (typeof define === "function" && define.amd) {
    define([], function() {
        return fabric;
    });
}