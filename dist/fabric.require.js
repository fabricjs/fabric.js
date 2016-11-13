var fabric = fabric || {
    version: "1.6.7"
};

if (typeof exports !== "undefined") {
    exports.fabric = fabric;
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
    fabric.document = document;
    fabric.window = window;
    window.fabric = fabric;
} else {
    fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>");
    if (fabric.document.createWindow) {
        fabric.window = fabric.document.createWindow();
    } else {
        fabric.window = fabric.document.parentWindow;
    }
}

fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;

fabric.isLikelyNode = typeof Buffer !== "undefined" && typeof window === "undefined";

fabric.SHARED_ATTRIBUTES = [ "display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id" ];

fabric.DPI = 96;

fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)";

fabric.fontPaths = {};

fabric.charWidthsCache = {};

fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1;

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
        this.renderOnAddRemove && this.renderAll();
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
        this.renderOnAddRemove && this.renderAll();
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
        this.renderOnAddRemove && somethingRemoved && this.renderAll();
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
            var xPoints = [ points[0].x, points[1].x, points[2].x, points[3].x ], minX = fabric.util.array.min(xPoints), maxX = fabric.util.array.max(xPoints), width = Math.abs(minX - maxX), yPoints = [ points[0].y, points[1].y, points[2].y, points[3].y ], minY = fabric.util.array.min(yPoints), maxY = fabric.util.array.max(yPoints), height = Math.abs(minY - maxY);
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
            img.onload = function() {
                callback && callback.call(context, img);
                img = img.onload = img.onerror = null;
            };
            img.onerror = function() {
                fabric.log("Error loading " + img.src);
                callback && callback.call(context, null, true);
                img = img.onload = img.onerror = null;
            };
            if (url.indexOf("data") !== 0 && crossOrigin) {
                img.crossOrigin = crossOrigin;
            }
            img.src = url;
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
                if (klass.async) {
                    klass.fromObject(o, function(obj, error) {
                        if (!error) {
                            enlivenedObjects[index] = obj;
                            reviver && reviver(o, enlivenedObjects[index]);
                        }
                        onLoaded();
                    });
                } else {
                    enlivenedObjects[index] = klass.fromObject(o);
                    reviver && reviver(o, enlivenedObjects[index]);
                    onLoaded();
                }
            });
        },
        groupSVGElements: function(elements, options, path) {
            var object;
            object = new fabric.PathGroup(elements, options);
            if (typeof path !== "undefined") {
                object.setSourcePath(path);
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
        createCanvasElement: function(canvasEl) {
            canvasEl || (canvasEl = fabric.document.createElement("canvas"));
            if (!canvasEl.getContext && typeof G_vmlCanvasManager !== "undefined") {
                G_vmlCanvasManager.initElement(canvasEl);
            }
            return canvasEl;
        },
        createImage: function() {
            return fabric.isLikelyNode ? new (require("canvas").Image)() : fabric.document.createElement("img");
        },
        createAccessors: function(klass) {
            var proto = klass.prototype, i, propName, capitalizedPropName, setterName, getterName;
            for (i = proto.stateProperties.length; i--; ) {
                propName = proto.stateProperties[i];
                capitalizedPropName = propName.charAt(0).toUpperCase() + propName.slice(1);
                setterName = "set" + capitalizedPropName;
                getterName = "get" + capitalizedPropName;
                if (!proto[getterName]) {
                    proto[getterName] = function(property) {
                        return new Function('return this.get("' + property + '")');
                    }(propName);
                }
                if (!proto[setterName]) {
                    proto[setterName] = function(property) {
                        return new Function("value", 'return this.set("' + property + '", value)');
                    }(propName);
                }
            }
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
            target.setAngle(0);
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
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement) {
            if (this === void 0 || this === null) {
                throw new TypeError();
            }
            var t = Object(this), len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n !== n) {
                    n = 0;
                } else if (n !== 0 && n !== Number.POSITIVE_INFINITY && n !== Number.NEGATIVE_INFINITY) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (;k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fn, context) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this) {
                    fn.call(context, this[i], i, this);
                }
            }
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function(fn, context) {
            var result = [];
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this) {
                    result[i] = fn.call(context, this[i], i, this);
                }
            }
            return result;
        };
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function(fn, context) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this && !fn.call(context, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        };
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function(fn, context) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this && fn.call(context, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(fn, context) {
            var result = [], val;
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this) {
                    val = this[i];
                    if (fn.call(context, val, i, this)) {
                        result.push(val);
                    }
                }
            }
            return result;
        };
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(fn) {
            var len = this.length >>> 0, i = 0, rv;
            if (arguments.length > 1) {
                rv = arguments[1];
            } else {
                do {
                    if (i in this) {
                        rv = this[i++];
                        break;
                    }
                    if (++i >= len) {
                        throw new TypeError();
                    }
                } while (true);
            }
            for (;i < len; i++) {
                if (i in this) {
                    rv = fn.call(null, rv, this[i], i, this);
                }
            }
            return rv;
        };
    }
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
                destination = source.map(function(v) {
                    return clone(v, deep);
                });
            } else if (source instanceof Object) {
                for (var property in source) {
                    destination[property] = clone(source[property], deep);
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
})();

(function() {
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
        };
    }
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
    fabric.util.string = {
        camelize: camelize,
        capitalize: capitalize,
        escapeXml: escapeXml
    };
})();

(function() {
    var slice = Array.prototype.slice, apply = Function.prototype.apply, Dummy = function() {};
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(thisArg) {
            var _this = this, args = slice.call(arguments, 1), bound;
            if (args.length) {
                bound = function() {
                    return apply.call(_this, this instanceof Dummy ? this : thisArg, args.concat(slice.call(arguments)));
                };
            } else {
                bound = function() {
                    return apply.call(_this, this instanceof Dummy ? this : thisArg, arguments);
                };
            }
            Dummy.prototype = this.prototype;
            bound.prototype = new Dummy();
            return bound;
        };
    }
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
        var fn = this.constructor.superclass.prototype[methodName];
        return arguments.length > 1 ? fn.apply(this, slice.call(arguments, 1)) : fn.call(this);
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
    var unknown = "unknown";
    function areHostMethods(object) {
        var methodNames = Array.prototype.slice.call(arguments, 1), t, i, len = methodNames.length;
        for (i = 0; i < len; i++) {
            t = typeof object[methodNames[i]];
            if (!/^(?:function|object|unknown)$/.test(t)) {
                return false;
            }
        }
        return true;
    }
    var getElement, setElement, getUniqueId = function() {
        var uid = 0;
        return function(element) {
            return element.__uniqueID || (element.__uniqueID = "uniqueID__" + uid++);
        };
    }();
    (function() {
        var elements = {};
        getElement = function(uid) {
            return elements[uid];
        };
        setElement = function(uid, element) {
            elements[uid] = element;
        };
    })();
    function createListener(uid, handler) {
        return {
            handler: handler,
            wrappedHandler: createWrappedHandler(uid, handler)
        };
    }
    function createWrappedHandler(uid, handler) {
        return function(e) {
            handler.call(getElement(uid), e || fabric.window.event);
        };
    }
    function createDispatcher(uid, eventName) {
        return function(e) {
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    handlersForEvent[i].call(this, e || fabric.window.event);
                }
            }
        };
    }
    var shouldUseAddListenerRemoveListener = areHostMethods(fabric.document.documentElement, "addEventListener", "removeEventListener") && areHostMethods(fabric.window, "addEventListener", "removeEventListener"), shouldUseAttachEventDetachEvent = areHostMethods(fabric.document.documentElement, "attachEvent", "detachEvent") && areHostMethods(fabric.window, "attachEvent", "detachEvent"), listeners = {}, handlers = {}, addListener, removeListener;
    if (shouldUseAddListenerRemoveListener) {
        addListener = function(element, eventName, handler) {
            element.addEventListener(eventName, handler, false);
        };
        removeListener = function(element, eventName, handler) {
            element.removeEventListener(eventName, handler, false);
        };
    } else if (shouldUseAttachEventDetachEvent) {
        addListener = function(element, eventName, handler) {
            var uid = getUniqueId(element);
            setElement(uid, element);
            if (!listeners[uid]) {
                listeners[uid] = {};
            }
            if (!listeners[uid][eventName]) {
                listeners[uid][eventName] = [];
            }
            var listener = createListener(uid, handler);
            listeners[uid][eventName].push(listener);
            element.attachEvent("on" + eventName, listener.wrappedHandler);
        };
        removeListener = function(element, eventName, handler) {
            var uid = getUniqueId(element), listener;
            if (listeners[uid] && listeners[uid][eventName]) {
                for (var i = 0, len = listeners[uid][eventName].length; i < len; i++) {
                    listener = listeners[uid][eventName][i];
                    if (listener && listener.handler === handler) {
                        element.detachEvent("on" + eventName, listener.wrappedHandler);
                        listeners[uid][eventName][i] = null;
                    }
                }
            }
        };
    } else {
        addListener = function(element, eventName, handler) {
            var uid = getUniqueId(element);
            if (!handlers[uid]) {
                handlers[uid] = {};
            }
            if (!handlers[uid][eventName]) {
                handlers[uid][eventName] = [];
                var existingHandler = element["on" + eventName];
                if (existingHandler) {
                    handlers[uid][eventName].push(existingHandler);
                }
                element["on" + eventName] = createDispatcher(uid, eventName);
            }
            handlers[uid][eventName].push(handler);
        };
        removeListener = function(element, eventName, handler) {
            var uid = getUniqueId(element);
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    if (handlersForEvent[i] === handler) {
                        handlersForEvent.splice(i, 1);
                    }
                }
            }
        };
    }
    fabric.util.addListener = addListener;
    fabric.util.removeListener = removeListener;
    function getPointer(event) {
        event || (event = fabric.window.event);
        var element = event.target || (typeof event.srcElement !== unknown ? event.srcElement : null), scroll = fabric.util.getScrollLeftTop(element);
        return {
            x: pointerX(event) + scroll.left,
            y: pointerY(event) + scroll.top
        };
    }
    var pointerX = function(event) {
        return typeof event.clientX !== unknown ? event.clientX : 0;
    }, pointerY = function(event) {
        return typeof event.clientY !== unknown ? event.clientY : 0;
    };
    function _getPointer(event, pageProp, clientProp) {
        var touchProp = event.type === "touchend" ? "changedTouches" : "touches";
        return event[touchProp] && event[touchProp][0] ? event[touchProp][0][pageProp] - (event[touchProp][0][pageProp] - event[touchProp][0][clientProp]) || event[clientProp] : event[clientProp];
    }
    if (fabric.isTouchSupported) {
        pointerX = function(event) {
            return _getPointer(event, "pageX", "clientX");
        };
        pointerY = function(event) {
            return _getPointer(event, "pageY", "clientY");
        };
    }
    fabric.util.getPointer = getPointer;
    fabric.util.object.extend(fabric.util, fabric.Observable);
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
            if (element.nodeType === 1 && fabric.util.getElementStyle(element, "position") === "fixed") {
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
    fabric.util.getById = getById;
    fabric.util.toArray = toArray;
    fabric.util.makeElement = makeElement;
    fabric.util.addClass = addClass;
    fabric.util.wrapElement = wrapElement;
    fabric.util.getScrollLeftTop = getScrollLeftTop;
    fabric.util.getElementOffset = getElementOffset;
    fabric.util.getElementStyle = getElementStyle;
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

(function() {
    function animate(options) {
        requestAnimFrame(function(timestamp) {
            options || (options = {});
            var start = timestamp || +new Date(), duration = options.duration || 500, finish = start + duration, time, onChange = options.onChange || function() {}, abort = options.abort || function() {
                return false;
            }, easing = options.easing || function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            }, startValue = "startValue" in options ? options.startValue : 0, endValue = "endValue" in options ? options.endValue : 100, byValue = options.byValue || endValue - startValue;
            options.onStart && options.onStart();
            (function tick(ticktime) {
                time = ticktime || +new Date();
                var currentTime = time > finish ? duration : time - start;
                if (abort()) {
                    options.onComplete && options.onComplete();
                    return;
                }
                onChange(easing(currentTime, startValue, byValue, duration));
                if (time > finish) {
                    options.onComplete && options.onComplete();
                    return;
                }
                requestAnimFrame(tick);
            })(start);
        });
    }
    var _requestAnimFrame = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(callback) {
        fabric.window.setTimeout(callback, 1e3 / 60);
    };
    function requestAnimFrame() {
        return _requestAnimFrame.apply(fabric.window, arguments);
    }
    fabric.util.animate = animate;
    fabric.util.requestAnimFrame = requestAnimFrame;
})();

(function() {
    function normalize(a, c, p, s) {
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            if (c === 0 && a === 0) {
                s = p / (2 * Math.PI) * Math.asin(1);
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
        }
        return {
            a: a,
            c: c,
            p: p,
            s: s
        };
    }
    function elastic(opts, t, d) {
        return opts.a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p);
    }
    function easeOutCubic(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
    function easeInQuart(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    }
    function easeOutQuart(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }
    function easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
    function easeInQuint(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    }
    function easeOutQuint(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    }
    function easeInOutQuint(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
    function easeInSine(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    }
    function easeOutSine(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }
    function easeInOutSine(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
    function easeInExpo(t, b, c, d) {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    }
    function easeOutExpo(t, b, c, d) {
        return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }
    function easeInOutExpo(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        t /= d / 2;
        if (t < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
    function easeInCirc(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    }
    function easeOutCirc(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    }
    function easeInOutCirc(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
    function easeInElastic(t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0) {
            return b;
        }
        t /= d;
        if (t === 1) {
            return b + c;
        }
        if (!p) {
            p = d * .3;
        }
        var opts = normalize(a, c, p, s);
        return -elastic(opts, t, d) + b;
    }
    function easeOutElastic(t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0) {
            return b;
        }
        t /= d;
        if (t === 1) {
            return b + c;
        }
        if (!p) {
            p = d * .3;
        }
        var opts = normalize(a, c, p, s);
        return opts.a * Math.pow(2, -10 * t) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p) + opts.c + b;
    }
    function easeInOutElastic(t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0) {
            return b;
        }
        t /= d / 2;
        if (t === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (.3 * 1.5);
        }
        var opts = normalize(a, c, p, s);
        if (t < 1) {
            return -.5 * elastic(opts, t, d) + b;
        }
        return opts.a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p) * .5 + opts.c + b;
    }
    function easeInBack(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    }
    function easeOutBack(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
    function easeInOutBack(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        t /= d / 2;
        if (t < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    }
    function easeInBounce(t, b, c, d) {
        return c - easeOutBounce(d - t, 0, c, d) + b;
    }
    function easeOutBounce(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
    }
    function easeInOutBounce(t, b, c, d) {
        if (t < d / 2) {
            return easeInBounce(t * 2, 0, c, d) * .5 + b;
        }
        return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
    fabric.util.ease = {
        easeInQuad: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * (--t * (t - 2) - 1) + b;
        },
        easeInCubic: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: easeOutCubic,
        easeInOutCubic: easeInOutCubic,
        easeInQuart: easeInQuart,
        easeOutQuart: easeOutQuart,
        easeInOutQuart: easeInOutQuart,
        easeInQuint: easeInQuint,
        easeOutQuint: easeOutQuint,
        easeInOutQuint: easeInOutQuint,
        easeInSine: easeInSine,
        easeOutSine: easeOutSine,
        easeInOutSine: easeInOutSine,
        easeInExpo: easeInExpo,
        easeOutExpo: easeOutExpo,
        easeInOutExpo: easeInOutExpo,
        easeInCirc: easeInCirc,
        easeOutCirc: easeOutCirc,
        easeInOutCirc: easeInOutCirc,
        easeInElastic: easeInElastic,
        easeOutElastic: easeOutElastic,
        easeInOutElastic: easeInOutElastic,
        easeInBack: easeInBack,
        easeOutBack: easeOutBack,
        easeInOutBack: easeInOutBack,
        easeInBounce: easeInBounce,
        easeOutBounce: easeOutBounce,
        easeInOutBounce: easeInOutBounce
    };
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, capitalize = fabric.util.string.capitalize, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, parseUnit = fabric.util.parseUnit, multiplyTransformMatrices = fabric.util.multiplyTransformMatrices, reAllowedSVGTagNames = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/i, reViewBoxTagNames = /^(symbol|image|marker|pattern|view|svg)$/i, reNotAllowedAncestors = /^(?:pattern|defs|symbol|metadata)$/i, reAllowedParents = /^(symbol|g|a|svg)$/i, attributesMap = {
        cx: "left",
        x: "left",
        r: "radius",
        cy: "top",
        y: "top",
        display: "visible",
        visibility: "visible",
        transform: "transformMatrix",
        "fill-opacity": "fillOpacity",
        "fill-rule": "fillRule",
        "font-family": "fontFamily",
        "font-size": "fontSize",
        "font-style": "fontStyle",
        "font-weight": "fontWeight",
        "stroke-dasharray": "strokeDashArray",
        "stroke-linecap": "strokeLineCap",
        "stroke-linejoin": "strokeLineJoin",
        "stroke-miterlimit": "strokeMiterLimit",
        "stroke-opacity": "strokeOpacity",
        "stroke-width": "strokeWidth",
        "text-decoration": "textDecoration",
        "text-anchor": "originX"
    }, colorAttributes = {
        stroke: "strokeOpacity",
        fill: "fillOpacity"
    };
    fabric.cssRules = {};
    fabric.gradientDefs = {};
    function normalizeAttr(attr) {
        if (attr in attributesMap) {
            return attributesMap[attr];
        }
        return attr;
    }
    function normalizeValue(attr, value, parentAttributes, fontSize) {
        var isArray = Object.prototype.toString.call(value) === "[object Array]", parsed;
        if ((attr === "fill" || attr === "stroke") && value === "none") {
            value = "";
        } else if (attr === "strokeDashArray") {
            value = value.replace(/,/g, " ").split(/\s+/).map(function(n) {
                return parseFloat(n);
            });
        } else if (attr === "transformMatrix") {
            if (parentAttributes && parentAttributes.transformMatrix) {
                value = multiplyTransformMatrices(parentAttributes.transformMatrix, fabric.parseTransformAttribute(value));
            } else {
                value = fabric.parseTransformAttribute(value);
            }
        } else if (attr === "visible") {
            value = value === "none" || value === "hidden" ? false : true;
            if (parentAttributes && parentAttributes.visible === false) {
                value = false;
            }
        } else if (attr === "originX") {
            value = value === "start" ? "left" : value === "end" ? "right" : "center";
        } else {
            parsed = isArray ? value.map(parseUnit) : parseUnit(value, fontSize);
        }
        return !isArray && isNaN(parsed) ? value : parsed;
    }
    function _setStrokeFillOpacity(attributes) {
        for (var attr in colorAttributes) {
            if (typeof attributes[colorAttributes[attr]] === "undefined" || attributes[attr] === "") {
                continue;
            }
            if (typeof attributes[attr] === "undefined") {
                if (!fabric.Object.prototype[attr]) {
                    continue;
                }
                attributes[attr] = fabric.Object.prototype[attr];
            }
            if (attributes[attr].indexOf("url(") === 0) {
                continue;
            }
            var color = new fabric.Color(attributes[attr]);
            attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2)).toRgba();
        }
        return attributes;
    }
    function _getMultipleNodes(doc, nodeNames) {
        var nodeName, nodeArray = [], nodeList;
        for (var i = 0; i < nodeNames.length; i++) {
            nodeName = nodeNames[i];
            nodeList = doc.getElementsByTagName(nodeName);
            nodeArray = nodeArray.concat(Array.prototype.slice.call(nodeList));
        }
        return nodeArray;
    }
    fabric.parseTransformAttribute = function() {
        function rotateMatrix(matrix, args) {
            var angle = args[0], x = args.length === 3 ? args[1] : 0, y = args.length === 3 ? args[2] : 0;
            matrix[0] = Math.cos(angle);
            matrix[1] = Math.sin(angle);
            matrix[2] = -Math.sin(angle);
            matrix[3] = Math.cos(angle);
            matrix[4] = x - (matrix[0] * x + matrix[2] * y);
            matrix[5] = y - (matrix[1] * x + matrix[3] * y);
        }
        function scaleMatrix(matrix, args) {
            var multiplierX = args[0], multiplierY = args.length === 2 ? args[1] : args[0];
            matrix[0] = multiplierX;
            matrix[3] = multiplierY;
        }
        function skewXMatrix(matrix, args) {
            matrix[2] = Math.tan(fabric.util.degreesToRadians(args[0]));
        }
        function skewYMatrix(matrix, args) {
            matrix[1] = Math.tan(fabric.util.degreesToRadians(args[0]));
        }
        function translateMatrix(matrix, args) {
            matrix[4] = args[0];
            if (args.length === 2) {
                matrix[5] = args[1];
            }
        }
        var iMatrix = [ 1, 0, 0, 1, 0, 0 ], number = fabric.reNum, commaWsp = "(?:\\s+,?\\s*|,\\s*)", skewX = "(?:(skewX)\\s*\\(\\s*(" + number + ")\\s*\\))", skewY = "(?:(skewY)\\s*\\(\\s*(" + number + ")\\s*\\))", rotate = "(?:(rotate)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + "))?\\s*\\))", scale = "(?:(scale)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + "))?\\s*\\))", translate = "(?:(translate)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + "))?\\s*\\))", matrix = "(?:(matrix)\\s*\\(\\s*" + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + "\\s*\\))", transform = "(?:" + matrix + "|" + translate + "|" + scale + "|" + rotate + "|" + skewX + "|" + skewY + ")", transforms = "(?:" + transform + "(?:" + commaWsp + "*" + transform + ")*" + ")", transformList = "^\\s*(?:" + transforms + "?)\\s*$", reTransformList = new RegExp(transformList), reTransform = new RegExp(transform, "g");
        return function(attributeValue) {
            var matrix = iMatrix.concat(), matrices = [];
            if (!attributeValue || attributeValue && !reTransformList.test(attributeValue)) {
                return matrix;
            }
            attributeValue.replace(reTransform, function(match) {
                var m = new RegExp(transform).exec(match).filter(function(match) {
                    return !!match;
                }), operation = m[1], args = m.slice(2).map(parseFloat);
                switch (operation) {
                  case "translate":
                    translateMatrix(matrix, args);
                    break;

                  case "rotate":
                    args[0] = fabric.util.degreesToRadians(args[0]);
                    rotateMatrix(matrix, args);
                    break;

                  case "scale":
                    scaleMatrix(matrix, args);
                    break;

                  case "skewX":
                    skewXMatrix(matrix, args);
                    break;

                  case "skewY":
                    skewYMatrix(matrix, args);
                    break;

                  case "matrix":
                    matrix = args;
                    break;
                }
                matrices.push(matrix.concat());
                matrix = iMatrix.concat();
            });
            var combinedMatrix = matrices[0];
            while (matrices.length > 1) {
                matrices.shift();
                combinedMatrix = fabric.util.multiplyTransformMatrices(combinedMatrix, matrices[0]);
            }
            return combinedMatrix;
        };
    }();
    function parseStyleString(style, oStyle) {
        var attr, value;
        style.replace(/;\s*$/, "").split(";").forEach(function(chunk) {
            var pair = chunk.split(":");
            attr = normalizeAttr(pair[0].trim().toLowerCase());
            value = normalizeValue(attr, pair[1].trim());
            oStyle[attr] = value;
        });
    }
    function parseStyleObject(style, oStyle) {
        var attr, value;
        for (var prop in style) {
            if (typeof style[prop] === "undefined") {
                continue;
            }
            attr = normalizeAttr(prop.toLowerCase());
            value = normalizeValue(attr, style[prop]);
            oStyle[attr] = value;
        }
    }
    function getGlobalStylesForElement(element, svgUid) {
        var styles = {};
        for (var rule in fabric.cssRules[svgUid]) {
            if (elementMatchesRule(element, rule.split(" "))) {
                for (var property in fabric.cssRules[svgUid][rule]) {
                    styles[property] = fabric.cssRules[svgUid][rule][property];
                }
            }
        }
        return styles;
    }
    function elementMatchesRule(element, selectors) {
        var firstMatching, parentMatching = true;
        firstMatching = selectorMatches(element, selectors.pop());
        if (firstMatching && selectors.length) {
            parentMatching = doesSomeParentMatch(element, selectors);
        }
        return firstMatching && parentMatching && selectors.length === 0;
    }
    function doesSomeParentMatch(element, selectors) {
        var selector, parentMatching = true;
        while (element.parentNode && element.parentNode.nodeType === 1 && selectors.length) {
            if (parentMatching) {
                selector = selectors.pop();
            }
            element = element.parentNode;
            parentMatching = selectorMatches(element, selector);
        }
        return selectors.length === 0;
    }
    function selectorMatches(element, selector) {
        var nodeName = element.nodeName, classNames = element.getAttribute("class"), id = element.getAttribute("id"), matcher;
        matcher = new RegExp("^" + nodeName, "i");
        selector = selector.replace(matcher, "");
        if (id && selector.length) {
            matcher = new RegExp("#" + id + "(?![a-zA-Z\\-]+)", "i");
            selector = selector.replace(matcher, "");
        }
        if (classNames && selector.length) {
            classNames = classNames.split(" ");
            for (var i = classNames.length; i--; ) {
                matcher = new RegExp("\\." + classNames[i] + "(?![a-zA-Z\\-]+)", "i");
                selector = selector.replace(matcher, "");
            }
        }
        return selector.length === 0;
    }
    function elementById(doc, id) {
        var el;
        doc.getElementById && (el = doc.getElementById(id));
        if (el) {
            return el;
        }
        var node, i, nodelist = doc.getElementsByTagName("*");
        for (i = 0; i < nodelist.length; i++) {
            node = nodelist[i];
            if (id === node.getAttribute("id")) {
                return node;
            }
        }
    }
    function parseUseDirectives(doc) {
        var nodelist = _getMultipleNodes(doc, [ "use", "svg:use" ]), i = 0;
        while (nodelist.length && i < nodelist.length) {
            var el = nodelist[i], xlink = el.getAttribute("xlink:href").substr(1), x = el.getAttribute("x") || 0, y = el.getAttribute("y") || 0, el2 = elementById(doc, xlink).cloneNode(true), currentTrans = (el2.getAttribute("transform") || "") + " translate(" + x + ", " + y + ")", parentNode, oldLength = nodelist.length, attr, j, attrs, l;
            applyViewboxTransform(el2);
            if (/^svg$/i.test(el2.nodeName)) {
                var el3 = el2.ownerDocument.createElement("g");
                for (j = 0, attrs = el2.attributes, l = attrs.length; j < l; j++) {
                    attr = attrs.item(j);
                    el3.setAttribute(attr.nodeName, attr.nodeValue);
                }
                while (el2.firstChild) {
                    el3.appendChild(el2.firstChild);
                }
                el2 = el3;
            }
            for (j = 0, attrs = el.attributes, l = attrs.length; j < l; j++) {
                attr = attrs.item(j);
                if (attr.nodeName === "x" || attr.nodeName === "y" || attr.nodeName === "xlink:href") {
                    continue;
                }
                if (attr.nodeName === "transform") {
                    currentTrans = attr.nodeValue + " " + currentTrans;
                } else {
                    el2.setAttribute(attr.nodeName, attr.nodeValue);
                }
            }
            el2.setAttribute("transform", currentTrans);
            el2.setAttribute("instantiated_by_use", "1");
            el2.removeAttribute("id");
            parentNode = el.parentNode;
            parentNode.replaceChild(el2, el);
            if (nodelist.length === oldLength) {
                i++;
            }
        }
    }
    var reViewBoxAttrValue = new RegExp("^" + "\\s*(" + fabric.reNum + "+)\\s*,?" + "\\s*(" + fabric.reNum + "+)\\s*,?" + "\\s*(" + fabric.reNum + "+)\\s*,?" + "\\s*(" + fabric.reNum + "+)\\s*" + "$");
    function applyViewboxTransform(element) {
        var viewBoxAttr = element.getAttribute("viewBox"), scaleX = 1, scaleY = 1, minX = 0, minY = 0, viewBoxWidth, viewBoxHeight, matrix, el, widthAttr = element.getAttribute("width"), heightAttr = element.getAttribute("height"), x = element.getAttribute("x") || 0, y = element.getAttribute("y") || 0, preserveAspectRatio = element.getAttribute("preserveAspectRatio") || "", missingViewBox = !viewBoxAttr || !reViewBoxTagNames.test(element.nodeName) || !(viewBoxAttr = viewBoxAttr.match(reViewBoxAttrValue)), missingDimAttr = !widthAttr || !heightAttr || widthAttr === "100%" || heightAttr === "100%", toBeParsed = missingViewBox && missingDimAttr, parsedDim = {}, translateMatrix = "";
        parsedDim.width = 0;
        parsedDim.height = 0;
        parsedDim.toBeParsed = toBeParsed;
        if (toBeParsed) {
            return parsedDim;
        }
        if (missingViewBox) {
            parsedDim.width = parseUnit(widthAttr);
            parsedDim.height = parseUnit(heightAttr);
            return parsedDim;
        }
        minX = -parseFloat(viewBoxAttr[1]);
        minY = -parseFloat(viewBoxAttr[2]);
        viewBoxWidth = parseFloat(viewBoxAttr[3]);
        viewBoxHeight = parseFloat(viewBoxAttr[4]);
        if (!missingDimAttr) {
            parsedDim.width = parseUnit(widthAttr);
            parsedDim.height = parseUnit(heightAttr);
            scaleX = parsedDim.width / viewBoxWidth;
            scaleY = parsedDim.height / viewBoxHeight;
        } else {
            parsedDim.width = viewBoxWidth;
            parsedDim.height = viewBoxHeight;
        }
        preserveAspectRatio = fabric.util.parsePreserveAspectRatioAttribute(preserveAspectRatio);
        if (preserveAspectRatio.alignX !== "none") {
            scaleY = scaleX = scaleX > scaleY ? scaleY : scaleX;
        }
        if (scaleX === 1 && scaleY === 1 && minX === 0 && minY === 0 && x === 0 && y === 0) {
            return parsedDim;
        }
        if (x || y) {
            translateMatrix = " translate(" + parseUnit(x) + " " + parseUnit(y) + ") ";
        }
        matrix = translateMatrix + " matrix(" + scaleX + " 0" + " 0 " + scaleY + " " + minX * scaleX + " " + minY * scaleY + ") ";
        if (element.nodeName === "svg") {
            el = element.ownerDocument.createElement("g");
            while (element.firstChild) {
                el.appendChild(element.firstChild);
            }
            element.appendChild(el);
        } else {
            el = element;
            matrix = el.getAttribute("transform") + matrix;
        }
        el.setAttribute("transform", matrix);
        return parsedDim;
    }
    fabric.parseSVGDocument = function() {
        function hasAncestorWithNodeName(element, nodeName) {
            while (element && (element = element.parentNode)) {
                if (element.nodeName && nodeName.test(element.nodeName.replace("svg:", "")) && !element.getAttribute("instantiated_by_use")) {
                    return true;
                }
            }
            return false;
        }
        return function(doc, callback, reviver) {
            if (!doc) {
                return;
            }
            parseUseDirectives(doc);
            var startTime = new Date(), svgUid = fabric.Object.__uid++, options = applyViewboxTransform(doc), descendants = fabric.util.toArray(doc.getElementsByTagName("*"));
            options.svgUid = svgUid;
            if (descendants.length === 0 && fabric.isLikelyNode) {
                descendants = doc.selectNodes('//*[name(.)!="svg"]');
                var arr = [];
                for (var i = 0, len = descendants.length; i < len; i++) {
                    arr[i] = descendants[i];
                }
                descendants = arr;
            }
            var elements = descendants.filter(function(el) {
                applyViewboxTransform(el);
                return reAllowedSVGTagNames.test(el.nodeName.replace("svg:", "")) && !hasAncestorWithNodeName(el, reNotAllowedAncestors);
            });
            if (!elements || elements && !elements.length) {
                callback && callback([], {});
                return;
            }
            fabric.gradientDefs[svgUid] = fabric.getGradientDefs(doc);
            fabric.cssRules[svgUid] = fabric.getCSSRules(doc);
            fabric.parseElements(elements, function(instances) {
                fabric.documentParsingTime = new Date() - startTime;
                if (callback) {
                    callback(instances, options);
                }
            }, clone(options), reviver);
        };
    }();
    var svgCache = {
        has: function(name, callback) {
            callback(false);
        },
        get: function() {},
        set: function() {}
    };
    function _enlivenCachedObject(cachedObject) {
        var objects = cachedObject.objects, options = cachedObject.options;
        objects = objects.map(function(o) {
            return fabric[capitalize(o.type)].fromObject(o);
        });
        return {
            objects: objects,
            options: options
        };
    }
    function _createSVGPattern(markup, canvas, property) {
        if (canvas[property] && canvas[property].toSVG) {
            markup.push('\t<pattern x="0" y="0" id="', property, 'Pattern" ', 'width="', canvas[property].source.width, '" height="', canvas[property].source.height, '" patternUnits="userSpaceOnUse">\n', '\t\t<image x="0" y="0" ', 'width="', canvas[property].source.width, '" height="', canvas[property].source.height, '" xlink:href="', canvas[property].source.src, '"></image>\n\t</pattern>\n');
        }
    }
    var reFontDeclaration = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*" + "(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + fabric.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + fabric.reNum + "))?\\s+(.*)");
    extend(fabric, {
        parseFontDeclaration: function(value, oStyle) {
            var match = value.match(reFontDeclaration);
            if (!match) {
                return;
            }
            var fontStyle = match[1], fontWeight = match[3], fontSize = match[4], lineHeight = match[5], fontFamily = match[6];
            if (fontStyle) {
                oStyle.fontStyle = fontStyle;
            }
            if (fontWeight) {
                oStyle.fontWeight = isNaN(parseFloat(fontWeight)) ? fontWeight : parseFloat(fontWeight);
            }
            if (fontSize) {
                oStyle.fontSize = parseUnit(fontSize);
            }
            if (fontFamily) {
                oStyle.fontFamily = fontFamily;
            }
            if (lineHeight) {
                oStyle.lineHeight = lineHeight === "normal" ? 1 : lineHeight;
            }
        },
        getGradientDefs: function(doc) {
            var tagArray = [ "linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient" ], elList = _getMultipleNodes(doc, tagArray), el, j = 0, id, xlink, gradientDefs = {}, idsToXlinkMap = {};
            j = elList.length;
            while (j--) {
                el = elList[j];
                xlink = el.getAttribute("xlink:href");
                id = el.getAttribute("id");
                if (xlink) {
                    idsToXlinkMap[id] = xlink.substr(1);
                }
                gradientDefs[id] = el;
            }
            for (id in idsToXlinkMap) {
                var el2 = gradientDefs[idsToXlinkMap[id]].cloneNode(true);
                el = gradientDefs[id];
                while (el2.firstChild) {
                    el.appendChild(el2.firstChild);
                }
            }
            return gradientDefs;
        },
        parseAttributes: function(element, attributes, svgUid) {
            if (!element) {
                return;
            }
            var value, parentAttributes = {}, fontSize;
            if (typeof svgUid === "undefined") {
                svgUid = element.getAttribute("svgUid");
            }
            if (element.parentNode && reAllowedParents.test(element.parentNode.nodeName)) {
                parentAttributes = fabric.parseAttributes(element.parentNode, attributes, svgUid);
            }
            fontSize = parentAttributes && parentAttributes.fontSize || element.getAttribute("font-size") || fabric.Text.DEFAULT_SVG_FONT_SIZE;
            var ownAttributes = attributes.reduce(function(memo, attr) {
                value = element.getAttribute(attr);
                if (value) {
                    attr = normalizeAttr(attr);
                    value = normalizeValue(attr, value, parentAttributes, fontSize);
                    memo[attr] = value;
                }
                return memo;
            }, {});
            ownAttributes = extend(ownAttributes, extend(getGlobalStylesForElement(element, svgUid), fabric.parseStyleAttribute(element)));
            if (ownAttributes.font) {
                fabric.parseFontDeclaration(ownAttributes.font, ownAttributes);
            }
            return _setStrokeFillOpacity(extend(parentAttributes, ownAttributes));
        },
        parseElements: function(elements, callback, options, reviver) {
            new fabric.ElementsParser(elements, callback, options, reviver).parse();
        },
        parseStyleAttribute: function(element) {
            var oStyle = {}, style = element.getAttribute("style");
            if (!style) {
                return oStyle;
            }
            if (typeof style === "string") {
                parseStyleString(style, oStyle);
            } else {
                parseStyleObject(style, oStyle);
            }
            return oStyle;
        },
        parsePointsAttribute: function(points) {
            if (!points) {
                return null;
            }
            points = points.replace(/,/g, " ").trim();
            points = points.split(/\s+/);
            var parsedPoints = [], i, len;
            i = 0;
            len = points.length;
            for (;i < len; i += 2) {
                parsedPoints.push({
                    x: parseFloat(points[i]),
                    y: parseFloat(points[i + 1])
                });
            }
            return parsedPoints;
        },
        getCSSRules: function(doc) {
            var styles = doc.getElementsByTagName("style"), allRules = {}, rules;
            for (var i = 0, len = styles.length; i < len; i++) {
                var styleContents = styles[i].textContent || styles[i].text;
                styleContents = styleContents.replace(/\/\*[\s\S]*?\*\//g, "");
                if (styleContents.trim() === "") {
                    continue;
                }
                rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
                rules = rules.map(function(rule) {
                    return rule.trim();
                });
                rules.forEach(function(rule) {
                    var match = rule.match(/([\s\S]*?)\s*\{([^}]*)\}/), ruleObj = {}, declaration = match[2].trim(), propertyValuePairs = declaration.replace(/;$/, "").split(/\s*;\s*/);
                    for (var i = 0, len = propertyValuePairs.length; i < len; i++) {
                        var pair = propertyValuePairs[i].split(/\s*:\s*/), property = normalizeAttr(pair[0]), value = normalizeValue(property, pair[1], pair[0]);
                        ruleObj[property] = value;
                    }
                    rule = match[1];
                    rule.split(",").forEach(function(_rule) {
                        _rule = _rule.replace(/^svg/i, "").trim();
                        if (_rule === "") {
                            return;
                        }
                        if (allRules[_rule]) {
                            fabric.util.object.extend(allRules[_rule], ruleObj);
                        } else {
                            allRules[_rule] = fabric.util.object.clone(ruleObj);
                        }
                    });
                });
            }
            return allRules;
        },
        loadSVGFromURL: function(url, callback, reviver) {
            url = url.replace(/^\n\s*/, "").trim();
            svgCache.has(url, function(hasUrl) {
                if (hasUrl) {
                    svgCache.get(url, function(value) {
                        var enlivedRecord = _enlivenCachedObject(value);
                        callback(enlivedRecord.objects, enlivedRecord.options);
                    });
                } else {
                    new fabric.util.request(url, {
                        method: "get",
                        onComplete: onComplete
                    });
                }
            });
            function onComplete(r) {
                var xml = r.responseXML;
                if (xml && !xml.documentElement && fabric.window.ActiveXObject && r.responseText) {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(r.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""));
                }
                if (!xml || !xml.documentElement) {
                    callback && callback(null);
                }
                fabric.parseSVGDocument(xml.documentElement, function(results, options) {
                    svgCache.set(url, {
                        objects: fabric.util.array.invoke(results, "toObject"),
                        options: options
                    });
                    callback && callback(results, options);
                }, reviver);
            }
        },
        loadSVGFromString: function(string, callback, reviver) {
            string = string.trim();
            var doc;
            if (typeof DOMParser !== "undefined") {
                var parser = new DOMParser();
                if (parser && parser.parseFromString) {
                    doc = parser.parseFromString(string, "text/xml");
                }
            } else if (fabric.window.ActiveXObject) {
                doc = new ActiveXObject("Microsoft.XMLDOM");
                doc.async = "false";
                doc.loadXML(string.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""));
            }
            fabric.parseSVGDocument(doc.documentElement, function(results, options) {
                callback(results, options);
            }, reviver);
        },
        createSVGFontFacesMarkup: function(objects) {
            var markup = "", fontList = {}, obj, fontFamily, style, row, rowIndex, _char, charIndex, fontPaths = fabric.fontPaths;
            for (var i = 0, len = objects.length; i < len; i++) {
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
        createSVGRefElementsMarkup: function(canvas) {
            var markup = [];
            _createSVGPattern(markup, canvas, "backgroundColor");
            _createSVGPattern(markup, canvas, "overlayColor");
            return markup.join("");
        }
    });
})(typeof exports !== "undefined" ? exports : this);

fabric.ElementsParser = function(elements, callback, options, reviver) {
    this.elements = elements;
    this.callback = callback;
    this.options = options;
    this.reviver = reviver;
    this.svgUid = options && options.svgUid || 0;
};

fabric.ElementsParser.prototype.parse = function() {
    this.instances = new Array(this.elements.length);
    this.numElements = this.elements.length;
    this.createObjects();
};

fabric.ElementsParser.prototype.createObjects = function() {
    for (var i = 0, len = this.elements.length; i < len; i++) {
        this.elements[i].setAttribute("svgUid", this.svgUid);
        (function(_obj, i) {
            setTimeout(function() {
                _obj.createObject(_obj.elements[i], i);
            }, 0);
        })(this, i);
    }
};

fabric.ElementsParser.prototype.createObject = function(el, index) {
    var klass = fabric[fabric.util.string.capitalize(el.tagName.replace("svg:", ""))];
    if (klass && klass.fromElement) {
        try {
            this._createObject(klass, el, index);
        } catch (err) {
            fabric.log(err);
        }
    } else {
        this.checkIfDone();
    }
};

fabric.ElementsParser.prototype._createObject = function(klass, el, index) {
    if (klass.async) {
        klass.fromElement(el, this.createCallback(index, el), this.options);
    } else {
        var obj = klass.fromElement(el, this.options);
        this.resolveGradient(obj, "fill");
        this.resolveGradient(obj, "stroke");
        this.reviver && this.reviver(el, obj);
        this.instances[index] = obj;
        this.checkIfDone();
    }
};

fabric.ElementsParser.prototype.createCallback = function(index, el) {
    var _this = this;
    return function(obj) {
        _this.resolveGradient(obj, "fill");
        _this.resolveGradient(obj, "stroke");
        _this.reviver && _this.reviver(el, obj);
        _this.instances[index] = obj;
        _this.checkIfDone();
    };
};

fabric.ElementsParser.prototype.resolveGradient = function(obj, property) {
    var instanceFillValue = obj.get(property);
    if (!/^url\(/.test(instanceFillValue)) {
        return;
    }
    var gradientId = instanceFillValue.slice(5, instanceFillValue.length - 1);
    if (fabric.gradientDefs[this.svgUid][gradientId]) {
        obj.set(property, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][gradientId], obj));
    }
};

fabric.ElementsParser.prototype.checkIfDone = function() {
    if (--this.numElements === 0) {
        this.instances = this.instances.filter(function(el) {
            return el != null;
        });
        this.callback(this.instances);
    }
};

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
        var result = new Intersection(), length = points.length, b1, b2, inter;
        for (var i = 0; i < length; i++) {
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
        var result = new Intersection(), length = points1.length;
        for (var i = 0; i < length; i++) {
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
            var result = [], alpha = this.getAlpha(), otherAlpha = .5, source = this.getSource(), otherSource = otherColor.getSource();
            for (var i = 0; i < 3; i++) {
                result.push(Math.round(source[i] * (1 - otherAlpha) + otherSource[i] * otherAlpha));
            }
            result[3] = alpha;
            this.setSource(result);
            return this;
        }
    };
    fabric.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    fabric.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    fabric.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
    fabric.Color.colorNameMap = {
        aqua: "#00FFFF",
        black: "#000000",
        blue: "#0000FF",
        fuchsia: "#FF00FF",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        lime: "#00FF00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        orange: "#FFA500",
        purple: "#800080",
        red: "#FF0000",
        silver: "#C0C0C0",
        teal: "#008080",
        white: "#FFFFFF",
        yellow: "#FFFF00"
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
    function getColorStop(el) {
        var style = el.getAttribute("style"), offset = el.getAttribute("offset") || 0, color, colorAlpha, opacity;
        offset = parseFloat(offset) / (/%$/.test(offset) ? 100 : 1);
        offset = offset < 0 ? 0 : offset > 1 ? 1 : offset;
        if (style) {
            var keyValuePairs = style.split(/\s*;\s*/);
            if (keyValuePairs[keyValuePairs.length - 1] === "") {
                keyValuePairs.pop();
            }
            for (var i = keyValuePairs.length; i--; ) {
                var split = keyValuePairs[i].split(/\s*:\s*/), key = split[0].trim(), value = split[1].trim();
                if (key === "stop-color") {
                    color = value;
                } else if (key === "stop-opacity") {
                    opacity = value;
                }
            }
        }
        if (!color) {
            color = el.getAttribute("stop-color") || "rgb(0,0,0)";
        }
        if (!opacity) {
            opacity = el.getAttribute("stop-opacity");
        }
        color = new fabric.Color(color);
        colorAlpha = color.getAlpha();
        opacity = isNaN(parseFloat(opacity)) ? 1 : parseFloat(opacity);
        opacity *= colorAlpha;
        return {
            offset: offset,
            color: color.toRgb(),
            opacity: opacity
        };
    }
    function getLinearCoords(el) {
        return {
            x1: el.getAttribute("x1") || 0,
            y1: el.getAttribute("y1") || 0,
            x2: el.getAttribute("x2") || "100%",
            y2: el.getAttribute("y2") || 0
        };
    }
    function getRadialCoords(el) {
        return {
            x1: el.getAttribute("fx") || el.getAttribute("cx") || "50%",
            y1: el.getAttribute("fy") || el.getAttribute("cy") || "50%",
            r1: 0,
            x2: el.getAttribute("cx") || "50%",
            y2: el.getAttribute("cy") || "50%",
            r2: el.getAttribute("r") || "50%"
        };
    }
    fabric.Gradient = fabric.util.createClass({
        offsetX: 0,
        offsetY: 0,
        initialize: function(options) {
            options || (options = {});
            var coords = {};
            this.id = fabric.Object.__uid++;
            this.type = options.type || "linear";
            coords = {
                x1: options.coords.x1 || 0,
                y1: options.coords.y1 || 0,
                x2: options.coords.x2 || 0,
                y2: options.coords.y2 || 0
            };
            if (this.type === "radial") {
                coords.r1 = options.coords.r1 || 0;
                coords.r2 = options.coords.r2 || 0;
            }
            this.coords = coords;
            this.colorStops = options.colorStops.slice();
            if (options.gradientTransform) {
                this.gradientTransform = options.gradientTransform;
            }
            this.offsetX = options.offsetX || this.offsetX;
            this.offsetY = options.offsetY || this.offsetY;
        },
        addColorStop: function(colorStop) {
            for (var position in colorStop) {
                var color = new fabric.Color(colorStop[position]);
                this.colorStops.push({
                    offset: position,
                    color: color.toRgb(),
                    opacity: color.getAlpha()
                });
            }
            return this;
        },
        toObject: function() {
            return {
                type: this.type,
                coords: this.coords,
                colorStops: this.colorStops,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
            };
        },
        toSVG: function(object) {
            var coords = fabric.util.object.clone(this.coords), markup, commonAttributes;
            this.colorStops.sort(function(a, b) {
                return a.offset - b.offset;
            });
            if (!(object.group && object.group.type === "path-group")) {
                for (var prop in coords) {
                    if (prop === "x1" || prop === "x2" || prop === "r2") {
                        coords[prop] += this.offsetX - object.width / 2;
                    } else if (prop === "y1" || prop === "y2") {
                        coords[prop] += this.offsetY - object.height / 2;
                    }
                }
            }
            commonAttributes = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"';
            if (this.gradientTransform) {
                commonAttributes += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" ';
            }
            if (this.type === "linear") {
                markup = [ "<linearGradient ", commonAttributes, ' x1="', coords.x1, '" y1="', coords.y1, '" x2="', coords.x2, '" y2="', coords.y2, '">\n' ];
            } else if (this.type === "radial") {
                markup = [ "<radialGradient ", commonAttributes, ' cx="', coords.x2, '" cy="', coords.y2, '" r="', coords.r2, '" fx="', coords.x1, '" fy="', coords.y1, '">\n' ];
            }
            for (var i = 0; i < this.colorStops.length; i++) {
                markup.push("<stop ", 'offset="', this.colorStops[i].offset * 100 + "%", '" style="stop-color:', this.colorStops[i].color, this.colorStops[i].opacity !== null ? ";stop-opacity: " + this.colorStops[i].opacity : ";", '"/>\n');
            }
            markup.push(this.type === "linear" ? "</linearGradient>\n" : "</radialGradient>\n");
            return markup.join("");
        },
        toLive: function(ctx, object) {
            var gradient, prop, coords = fabric.util.object.clone(this.coords);
            if (!this.type) {
                return;
            }
            if (object.group && object.group.type === "path-group") {
                for (prop in coords) {
                    if (prop === "x1" || prop === "x2") {
                        coords[prop] += -this.offsetX + object.width / 2;
                    } else if (prop === "y1" || prop === "y2") {
                        coords[prop] += -this.offsetY + object.height / 2;
                    }
                }
            }
            if (this.type === "linear") {
                gradient = ctx.createLinearGradient(coords.x1, coords.y1, coords.x2, coords.y2);
            } else if (this.type === "radial") {
                gradient = ctx.createRadialGradient(coords.x1, coords.y1, coords.r1, coords.x2, coords.y2, coords.r2);
            }
            for (var i = 0, len = this.colorStops.length; i < len; i++) {
                var color = this.colorStops[i].color, opacity = this.colorStops[i].opacity, offset = this.colorStops[i].offset;
                if (typeof opacity !== "undefined") {
                    color = new fabric.Color(color).setAlpha(opacity).toRgba();
                }
                gradient.addColorStop(parseFloat(offset), color);
            }
            return gradient;
        }
    });
    fabric.util.object.extend(fabric.Gradient, {
        fromElement: function(el, instance) {
            var colorStopEls = el.getElementsByTagName("stop"), type, gradientUnits = el.getAttribute("gradientUnits") || "objectBoundingBox", gradientTransform = el.getAttribute("gradientTransform"), colorStops = [], coords, ellipseMatrix;
            if (el.nodeName === "linearGradient" || el.nodeName === "LINEARGRADIENT") {
                type = "linear";
            } else {
                type = "radial";
            }
            if (type === "linear") {
                coords = getLinearCoords(el);
            } else if (type === "radial") {
                coords = getRadialCoords(el);
            }
            for (var i = colorStopEls.length; i--; ) {
                colorStops.push(getColorStop(colorStopEls[i]));
            }
            ellipseMatrix = _convertPercentUnitsToValues(instance, coords, gradientUnits);
            var gradient = new fabric.Gradient({
                type: type,
                coords: coords,
                colorStops: colorStops,
                offsetX: -instance.left,
                offsetY: -instance.top
            });
            if (gradientTransform || ellipseMatrix !== "") {
                gradient.gradientTransform = fabric.parseTransformAttribute((gradientTransform || "") + ellipseMatrix);
            }
            return gradient;
        },
        forObject: function(obj, options) {
            options || (options = {});
            _convertPercentUnitsToValues(obj, options.coords, "userSpaceOnUse");
            return new fabric.Gradient(options);
        }
    });
    function _convertPercentUnitsToValues(object, options, gradientUnits) {
        var propValue, addFactor = 0, multFactor = 1, ellipseMatrix = "";
        for (var prop in options) {
            if (options[prop] === "Infinity") {
                options[prop] = 1;
            } else if (options[prop] === "-Infinity") {
                options[prop] = 0;
            }
            propValue = parseFloat(options[prop], 10);
            if (typeof options[prop] === "string" && /^\d+%$/.test(options[prop])) {
                multFactor = .01;
            } else {
                multFactor = 1;
            }
            if (prop === "x1" || prop === "x2" || prop === "r2") {
                multFactor *= gradientUnits === "objectBoundingBox" ? object.width : 1;
                addFactor = gradientUnits === "objectBoundingBox" ? object.left || 0 : 0;
            } else if (prop === "y1" || prop === "y2") {
                multFactor *= gradientUnits === "objectBoundingBox" ? object.height : 1;
                addFactor = gradientUnits === "objectBoundingBox" ? object.top || 0 : 0;
            }
            options[prop] = propValue * multFactor + addFactor;
        }
        if (object.type === "ellipse" && options.r2 !== null && gradientUnits === "objectBoundingBox" && object.rx !== object.ry) {
            var scaleFactor = object.ry / object.rx;
            ellipseMatrix = " scale(1, " + scaleFactor + ")";
            if (options.y1) {
                options.y1 /= scaleFactor;
            }
            if (options.y2) {
                options.y2 /= scaleFactor;
            }
        }
        return ellipseMatrix;
    }
})();

fabric.Pattern = fabric.util.createClass({
    repeat: "repeat",
    offsetX: 0,
    offsetY: 0,
    initialize: function(options) {
        options || (options = {});
        this.id = fabric.Object.__uid++;
        if (options.source) {
            if (typeof options.source === "string") {
                if (typeof fabric.util.getFunctionBody(options.source) !== "undefined") {
                    this.source = new Function(fabric.util.getFunctionBody(options.source));
                } else {
                    var _this = this;
                    this.source = fabric.util.createImage();
                    fabric.util.loadImage(options.source, function(img) {
                        _this.source = img;
                    });
                }
            } else {
                this.source = options.source;
            }
        }
        if (options.repeat) {
            this.repeat = options.repeat;
        }
        if (options.offsetX) {
            this.offsetX = options.offsetX;
        }
        if (options.offsetY) {
            this.offsetY = options.offsetY;
        }
    },
    toObject: function() {
        var source;
        if (typeof this.source === "function") {
            source = String(this.source);
        } else if (typeof this.source.src === "string") {
            source = this.source.src;
        } else if (typeof this.source === "object" && this.source.toDataURL) {
            source = this.source.toDataURL();
        }
        return {
            source: source,
            repeat: this.repeat,
            offsetX: this.offsetX,
            offsetY: this.offsetY
        };
    },
    toSVG: function(object) {
        var patternSource = typeof this.source === "function" ? this.source() : this.source, patternWidth = patternSource.width / object.getWidth(), patternHeight = patternSource.height / object.getHeight(), patternOffsetX = this.offsetX / object.getWidth(), patternOffsetY = this.offsetY / object.getHeight(), patternImgSrc = "";
        if (this.repeat === "repeat-x" || this.repeat === "no-repeat") {
            patternHeight = 1;
        }
        if (this.repeat === "repeat-y" || this.repeat === "no-repeat") {
            patternWidth = 1;
        }
        if (patternSource.src) {
            patternImgSrc = patternSource.src;
        } else if (patternSource.toDataURL) {
            patternImgSrc = patternSource.toDataURL();
        }
        return '<pattern id="SVGID_' + this.id + '" x="' + patternOffsetX + '" y="' + patternOffsetY + '" width="' + patternWidth + '" height="' + patternHeight + '">\n' + '<image x="0" y="0"' + ' width="' + patternSource.width + '" height="' + patternSource.height + '" xlink:href="' + patternImgSrc + '"></image>\n' + "</pattern>\n";
    },
    toLive: function(ctx) {
        var source = typeof this.source === "function" ? this.source() : this.source;
        if (!source) {
            return "";
        }
        if (typeof source.src !== "undefined") {
            if (!source.complete) {
                return "";
            }
            if (source.naturalWidth === 0 || source.naturalHeight === 0) {
                return "";
            }
        }
        return ctx.createPattern(source, this.repeat);
    }
});

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), toFixed = fabric.util.toFixed;
    if (fabric.Shadow) {
        fabric.warn("fabric.Shadow is already defined.");
        return;
    }
    fabric.Shadow = fabric.util.createClass({
        color: "rgb(0,0,0)",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: false,
        includeDefaultValues: true,
        initialize: function(options) {
            if (typeof options === "string") {
                options = this._parseShadow(options);
            }
            for (var prop in options) {
                this[prop] = options[prop];
            }
            this.id = fabric.Object.__uid++;
        },
        _parseShadow: function(shadow) {
            var shadowStr = shadow.trim(), offsetsAndBlur = fabric.Shadow.reOffsetsAndBlur.exec(shadowStr) || [], color = shadowStr.replace(fabric.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)";
            return {
                color: color.trim(),
                offsetX: parseInt(offsetsAndBlur[1], 10) || 0,
                offsetY: parseInt(offsetsAndBlur[2], 10) || 0,
                blur: parseInt(offsetsAndBlur[3], 10) || 0
            };
        },
        toString: function() {
            return [ this.offsetX, this.offsetY, this.blur, this.color ].join("px ");
        },
        toSVG: function(object) {
            var fBoxX = 40, fBoxY = 40, NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, offset = fabric.util.rotateVector({
                x: this.offsetX,
                y: this.offsetY
            }, fabric.util.degreesToRadians(-object.angle)), BLUR_BOX = 20;
            if (object.width && object.height) {
                fBoxX = toFixed((Math.abs(offset.x) + this.blur) / object.width, NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
                fBoxY = toFixed((Math.abs(offset.y) + this.blur) / object.height, NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
            }
            if (object.flipX) {
                offset.x *= -1;
            }
            if (object.flipY) {
                offset.y *= -1;
            }
            return '<filter id="SVGID_' + this.id + '" y="-' + fBoxY + '%" height="' + (100 + 2 * fBoxY) + '%" ' + 'x="-' + fBoxX + '%" width="' + (100 + 2 * fBoxX) + '%" ' + ">\n" + '\t<feGaussianBlur in="SourceAlpha" stdDeviation="' + toFixed(this.blur ? this.blur / 2 : 0, NUM_FRACTION_DIGITS) + '"></feGaussianBlur>\n' + '\t<feOffset dx="' + toFixed(offset.x, NUM_FRACTION_DIGITS) + '" dy="' + toFixed(offset.y, NUM_FRACTION_DIGITS) + '" result="oBlur" ></feOffset>\n' + '\t<feFlood flood-color="' + this.color + '"/>\n' + '\t<feComposite in2="oBlur" operator="in" />\n' + "\t<feMerge>\n" + "\t\t<feMergeNode></feMergeNode>\n" + '\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n' + "\t</feMerge>\n" + "</filter>\n";
        },
        toObject: function() {
            if (this.includeDefaultValues) {
                return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    affectStroke: this.affectStroke
                };
            }
            var obj = {}, proto = fabric.Shadow.prototype;
            [ "color", "blur", "offsetX", "offsetY", "affectStroke" ].forEach(function(prop) {
                if (this[prop] !== proto[prop]) {
                    obj[prop] = this[prop];
                }
            }, this);
            return obj;
        }
    });
    fabric.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/;
})(typeof exports !== "undefined" ? exports : this);

(function() {
    "use strict";
    if (fabric.StaticCanvas) {
        fabric.warn("fabric.StaticCanvas is already defined.");
        return;
    }
    var extend = fabric.util.object.extend, getElementOffset = fabric.util.getElementOffset, removeFromArray = fabric.util.removeFromArray, toFixed = fabric.util.toFixed, CANVAS_INIT_ERROR = new Error("Could not initialize `canvas` element");
    fabric.StaticCanvas = fabric.util.createClass({
        initialize: function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
        },
        backgroundColor: "",
        backgroundImage: null,
        overlayColor: "",
        overlayImage: null,
        includeDefaultValues: true,
        stateful: true,
        renderOnAddRemove: true,
        clipTo: null,
        controlsAboveOverlay: false,
        allowTouchScrolling: false,
        imageSmoothingEnabled: true,
        viewportTransform: [ 1, 0, 0, 1, 0, 0 ],
        backgroundVpt: true,
        overlayVpt: true,
        onBeforeScaleRotate: function() {},
        enableRetinaScaling: true,
        _initStatic: function(el, options) {
            var cb = fabric.StaticCanvas.prototype.renderAll.bind(this);
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
            if (color && color.source) {
                var _this = this;
                fabric.util.loadImage(color.source, function(img) {
                    _this[property] = new fabric.Pattern({
                        source: img,
                        repeat: color.repeat,
                        offsetX: color.offsetX,
                        offsetY: color.offsetY
                    });
                    callback && callback();
                });
            } else {
                this[property] = color;
                callback && callback();
            }
            return this;
        },
        _createCanvasElement: function(canvasEl) {
            var element = fabric.util.createCanvasElement(canvasEl);
            if (!element.style) {
                element.style = {};
            }
            if (!element) {
                throw CANVAS_INIT_ERROR;
            }
            if (typeof element.getContext === "undefined") {
                throw CANVAS_INIT_ERROR;
            }
            return element;
        },
        _initOptions: function(options) {
            for (var prop in options) {
                this[prop] = options[prop];
            }
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
            this.lowerCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement(canvasEl);
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
            this._initRetinaScaling();
            this._setImageSmoothing();
            this.calcOffset();
            if (!options.cssOnly) {
                this.renderAll();
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
            return Math.sqrt(this.viewportTransform[0] * this.viewportTransform[3]);
        },
        setViewportTransform: function(vpt) {
            var activeGroup = this._activeGroup, object;
            this.viewportTransform = vpt;
            for (var i = 0, len = this._objects.length; i < len; i++) {
                object = this._objects[i];
                object.group || object.setCoords();
            }
            if (activeGroup) {
                activeGroup.setCoords();
            }
            this.renderAll();
            return this;
        },
        zoomToPoint: function(point, value) {
            var before = point, vpt = this.viewportTransform.slice(0);
            point = fabric.util.transformPoint(point, fabric.util.invertTransform(this.viewportTransform));
            vpt[0] = value;
            vpt[3] = value;
            var after = fabric.util.transformPoint(point, vpt);
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
                this.off("selection:cleared", this._canvasITextSelectionClearedHanlder);
                this.off("object:selected", this._canvasITextSelectionClearedHanlder);
                this.off("mouse:up", this._mouseUpITextHandler);
                this._iTextInstances = null;
                this._hasITextHandlers = false;
            }
            this.clearContext(this.contextContainer);
            this.fire("canvas:cleared");
            this.renderAll();
            return this;
        },
        renderAll: function() {
            var canvasToDrawOn = this.contextContainer;
            this.renderCanvas(canvasToDrawOn, this._objects);
            return this;
        },
        renderCanvas: function(ctx, objects) {
            this.clearContext(ctx);
            this.fire("before:render");
            if (this.clipTo) {
                fabric.util.clipContext(this, ctx);
            }
            this._renderBackground(ctx);
            ctx.save();
            ctx.transform.apply(ctx, this.viewportTransform);
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
            for (var i = 0, length = objects.length; i < length; ++i) {
                objects[i] && objects[i].render(ctx);
            }
        },
        _renderBackgroundOrOverlay: function(ctx, property) {
            var object = this[property + "Color"];
            if (object) {
                ctx.fillStyle = object.toLive ? object.toLive(ctx) : object;
                ctx.fillRect(object.offsetX || 0, object.offsetY || 0, this.width, this.height);
            }
            object = this[property + "Image"];
            if (object) {
                if (this[property + "Vpt"]) {
                    ctx.save();
                    ctx.transform.apply(ctx, this.viewportTransform);
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
                top: this.getHeight() / 2,
                left: this.getWidth() / 2
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
            var center = this.getCenter(), iVpt = fabric.util.invertTransform(this.viewportTransform);
            return fabric.util.transformPoint({
                x: center.left,
                y: center.top
            }, iVpt);
        },
        _centerObject: function(object, center) {
            object.setPositionByOrigin(center, "center", "center");
            this.renderAll();
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
            var data = {
                background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject(propertiesToInclude) : this.backgroundColor
            };
            if (this.overlayColor) {
                data.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(propertiesToInclude) : this.overlayColor;
            }
            if (this.backgroundImage) {
                data.backgroundImage = this._toObject(this.backgroundImage, methodName, propertiesToInclude);
            }
            if (this.overlayImage) {
                data.overlayImage = this._toObject(this.overlayImage, methodName, propertiesToInclude);
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
            markup.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', width, '" ', 'height="', height, '" ', this.backgroundColor && !this.backgroundColor.toLive ? 'style="background-color: ' + this.backgroundColor + '" ' : null, viewBox, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>", fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), "</defs>\n");
        },
        _setSVGObjects: function(markup, reviver) {
            var instance;
            for (var i = 0, objects = this.getObjects(), len = objects.length; i < len; i++) {
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
            if (this[property] && this[property].source) {
                markup.push('<rect x="', this[property].offsetX, '" y="', this[property].offsetY, '" ', 'width="', this[property].repeat === "repeat-y" || this[property].repeat === "no-repeat" ? this[property].source.width : this.width, '" height="', this[property].repeat === "repeat-x" || this[property].repeat === "no-repeat" ? this[property].source.height : this.height, '" fill="url(#' + property + 'Pattern)"', "></rect>\n");
            } else if (this[property] && property === "overlayColor") {
                markup.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[property], '"', "></rect>\n");
            }
        },
        sendToBack: function(object) {
            if (!object) {
                return this;
            }
            var activeGroup = this._activeGroup, i, obj, objs;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = objs.length; i--; ) {
                    obj = objs[i];
                    removeFromArray(this._objects, obj);
                    this._objects.unshift(obj);
                }
            } else {
                removeFromArray(this._objects, object);
                this._objects.unshift(object);
            }
            return this.renderAll && this.renderAll();
        },
        bringToFront: function(object) {
            if (!object) {
                return this;
            }
            var activeGroup = this._activeGroup, i, obj, objs;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = 0; i < objs.length; i++) {
                    obj = objs[i];
                    removeFromArray(this._objects, obj);
                    this._objects.push(obj);
                }
            } else {
                removeFromArray(this._objects, object);
                this._objects.push(object);
            }
            return this.renderAll && this.renderAll();
        },
        sendBackwards: function(object, intersecting) {
            if (!object) {
                return this;
            }
            var activeGroup = this._activeGroup, i, obj, idx, newIdx, objs;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = 0; i < objs.length; i++) {
                    obj = objs[i];
                    idx = this._objects.indexOf(obj);
                    if (idx !== 0) {
                        newIdx = idx - 1;
                        removeFromArray(this._objects, obj);
                        this._objects.splice(newIdx, 0, obj);
                    }
                }
            } else {
                idx = this._objects.indexOf(object);
                if (idx !== 0) {
                    newIdx = this._findNewLowerIndex(object, idx, intersecting);
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                }
            }
            this.renderAll && this.renderAll();
            return this;
        },
        _findNewLowerIndex: function(object, idx, intersecting) {
            var newIdx;
            if (intersecting) {
                newIdx = idx;
                for (var i = idx - 1; i >= 0; --i) {
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
            var activeGroup = this._activeGroup, i, obj, idx, newIdx, objs;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = objs.length; i--; ) {
                    obj = objs[i];
                    idx = this._objects.indexOf(obj);
                    if (idx !== this._objects.length - 1) {
                        newIdx = idx + 1;
                        removeFromArray(this._objects, obj);
                        this._objects.splice(newIdx, 0, obj);
                    }
                }
            } else {
                idx = this._objects.indexOf(object);
                if (idx !== this._objects.length - 1) {
                    newIdx = this._findNewUpperIndex(object, idx, intersecting);
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                }
            }
            this.renderAll && this.renderAll();
            return this;
        },
        _findNewUpperIndex: function(object, idx, intersecting) {
            var newIdx;
            if (intersecting) {
                newIdx = idx;
                for (var i = idx + 1; i < this._objects.length; ++i) {
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
            return this.renderAll && this.renderAll();
        },
        dispose: function() {
            this.clear();
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
})();

fabric.BaseBrush = fabric.util.createClass({
    color: "rgb(0, 0, 0)",
    width: 1,
    shadow: null,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    strokeDashArray: null,
    setShadow: function(options) {
        this.shadow = new fabric.Shadow(options);
        return this;
    },
    _setBrushStyles: function() {
        var ctx = this.canvas.contextTop;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = this.strokeLineCap;
        ctx.lineJoin = this.strokeLineJoin;
        if (this.strokeDashArray && fabric.StaticCanvas.supports("setLineDash")) {
            ctx.setLineDash(this.strokeDashArray);
        }
    },
    _setShadow: function() {
        if (!this.shadow) {
            return;
        }
        var ctx = this.canvas.contextTop;
        ctx.shadowColor = this.shadow.color;
        ctx.shadowBlur = this.shadow.blur;
        ctx.shadowOffsetX = this.shadow.offsetX;
        ctx.shadowOffsetY = this.shadow.offsetY;
    },
    _resetShadow: function() {
        var ctx = this.canvas.contextTop;
        ctx.shadowColor = "";
        ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    }
});

(function() {
    fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        initialize: function(canvas) {
            this.canvas = canvas;
            this._points = [];
        },
        onMouseDown: function(pointer) {
            this._prepareForDrawing(pointer);
            this._captureDrawingPath(pointer);
            this._render();
        },
        onMouseMove: function(pointer) {
            this._captureDrawingPath(pointer);
            this.canvas.clearContext(this.canvas.contextTop);
            this._render();
        },
        onMouseUp: function() {
            this._finalizeAndAddPath();
        },
        _prepareForDrawing: function(pointer) {
            var p = new fabric.Point(pointer.x, pointer.y);
            this._reset();
            this._addPoint(p);
            this.canvas.contextTop.moveTo(p.x, p.y);
        },
        _addPoint: function(point) {
            this._points.push(point);
        },
        _reset: function() {
            this._points.length = 0;
            this._setBrushStyles();
            this._setShadow();
        },
        _captureDrawingPath: function(pointer) {
            var pointerPoint = new fabric.Point(pointer.x, pointer.y);
            this._addPoint(pointerPoint);
        },
        _render: function() {
            var ctx = this.canvas.contextTop, v = this.canvas.viewportTransform, p1 = this._points[0], p2 = this._points[1];
            ctx.save();
            ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
            ctx.beginPath();
            if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
                p1.x -= .5;
                p2.x += .5;
            }
            ctx.moveTo(p1.x, p1.y);
            for (var i = 1, len = this._points.length; i < len; i++) {
                var midPoint = p1.midPointFrom(p2);
                ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                p1 = this._points[i];
                p2 = this._points[i + 1];
            }
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
            ctx.restore();
        },
        convertPointsToSVGPath: function(points) {
            var path = [], p1 = new fabric.Point(points[0].x, points[0].y), p2 = new fabric.Point(points[1].x, points[1].y);
            path.push("M ", points[0].x, " ", points[0].y, " ");
            for (var i = 1, len = points.length; i < len; i++) {
                var midPoint = p1.midPointFrom(p2);
                path.push("Q ", p1.x, " ", p1.y, " ", midPoint.x, " ", midPoint.y, " ");
                p1 = new fabric.Point(points[i].x, points[i].y);
                if (i + 1 < points.length) {
                    p2 = new fabric.Point(points[i + 1].x, points[i + 1].y);
                }
            }
            path.push("L ", p1.x, " ", p1.y, " ");
            return path;
        },
        createPath: function(pathData) {
            var path = new fabric.Path(pathData, {
                fill: null,
                stroke: this.color,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray,
                originX: "center",
                originY: "center"
            });
            if (this.shadow) {
                this.shadow.affectStroke = true;
                path.setShadow(this.shadow);
            }
            return path;
        },
        _finalizeAndAddPath: function() {
            var ctx = this.canvas.contextTop;
            ctx.closePath();
            var pathData = this.convertPointsToSVGPath(this._points).join("");
            if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
                this.canvas.renderAll();
                return;
            }
            var path = this.createPath(pathData);
            this.canvas.add(path);
            path.setCoords();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderAll();
            this.canvas.fire("path:created", {
                path: path
            });
        }
    });
})();

fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    initialize: function(canvas) {
        this.canvas = canvas;
        this.points = [];
    },
    drawDot: function(pointer) {
        var point = this.addPoint(pointer), ctx = this.canvas.contextTop, v = this.canvas.viewportTransform;
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        ctx.fillStyle = point.fill;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    onMouseDown: function(pointer) {
        this.points.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.drawDot(pointer);
    },
    onMouseMove: function(pointer) {
        this.drawDot(pointer);
    },
    onMouseUp: function() {
        var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        var circles = [];
        for (var i = 0, len = this.points.length; i < len; i++) {
            var point = this.points[i], circle = new fabric.Circle({
                radius: point.radius,
                left: point.x,
                top: point.y,
                originX: "center",
                originY: "center",
                fill: point.fill
            });
            this.shadow && circle.setShadow(this.shadow);
            circles.push(circle);
        }
        var group = new fabric.Group(circles, {
            originX: "center",
            originY: "center"
        });
        group.canvas = this.canvas;
        this.canvas.add(group);
        this.canvas.fire("path:created", {
            path: group
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        this.canvas.renderAll();
    },
    addPoint: function(pointer) {
        var pointerPoint = new fabric.Point(pointer.x, pointer.y), circleRadius = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2, circleColor = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
        pointerPoint.radius = circleRadius;
        pointerPoint.fill = circleColor;
        this.points.push(pointerPoint);
        return pointerPoint;
    }
});

fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: false,
    optimizeOverlapping: true,
    initialize: function(canvas) {
        this.canvas = canvas;
        this.sprayChunks = [];
    },
    onMouseDown: function(pointer) {
        this.sprayChunks.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.addSprayChunk(pointer);
        this.render();
    },
    onMouseMove: function(pointer) {
        this.addSprayChunk(pointer);
        this.render();
    },
    onMouseUp: function() {
        var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        var rects = [];
        for (var i = 0, ilen = this.sprayChunks.length; i < ilen; i++) {
            var sprayChunk = this.sprayChunks[i];
            for (var j = 0, jlen = sprayChunk.length; j < jlen; j++) {
                var rect = new fabric.Rect({
                    width: sprayChunk[j].width,
                    height: sprayChunk[j].width,
                    left: sprayChunk[j].x + 1,
                    top: sprayChunk[j].y + 1,
                    originX: "center",
                    originY: "center",
                    fill: this.color
                });
                this.shadow && rect.setShadow(this.shadow);
                rects.push(rect);
            }
        }
        if (this.optimizeOverlapping) {
            rects = this._getOptimizedRects(rects);
        }
        var group = new fabric.Group(rects, {
            originX: "center",
            originY: "center"
        });
        group.canvas = this.canvas;
        this.canvas.add(group);
        this.canvas.fire("path:created", {
            path: group
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        this.canvas.renderAll();
    },
    _getOptimizedRects: function(rects) {
        var uniqueRects = {}, key;
        for (var i = 0, len = rects.length; i < len; i++) {
            key = rects[i].left + "" + rects[i].top;
            if (!uniqueRects[key]) {
                uniqueRects[key] = rects[i];
            }
        }
        var uniqueRectsArray = [];
        for (key in uniqueRects) {
            uniqueRectsArray.push(uniqueRects[key]);
        }
        return uniqueRectsArray;
    },
    render: function() {
        var ctx = this.canvas.contextTop;
        ctx.fillStyle = this.color;
        var v = this.canvas.viewportTransform;
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        for (var i = 0, len = this.sprayChunkPoints.length; i < len; i++) {
            var point = this.sprayChunkPoints[i];
            if (typeof point.opacity !== "undefined") {
                ctx.globalAlpha = point.opacity;
            }
            ctx.fillRect(point.x, point.y, point.width, point.width);
        }
        ctx.restore();
    },
    addSprayChunk: function(pointer) {
        this.sprayChunkPoints = [];
        var x, y, width, radius = this.width / 2;
        for (var i = 0; i < this.density; i++) {
            x = fabric.util.getRandomInt(pointer.x - radius, pointer.x + radius);
            y = fabric.util.getRandomInt(pointer.y - radius, pointer.y + radius);
            if (this.dotWidthVariance) {
                width = fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance);
            } else {
                width = this.dotWidth;
            }
            var point = new fabric.Point(x, y);
            point.width = width;
            if (this.randomOpacity) {
                point.opacity = fabric.util.getRandomInt(0, 100) / 100;
            }
            this.sprayChunkPoints.push(point);
        }
        this.sprayChunks.push(this.sprayChunkPoints);
    }
});

fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    getPatternSrc: function() {
        var dotWidth = 20, dotDistance = 5, patternCanvas = fabric.document.createElement("canvas"), patternCtx = patternCanvas.getContext("2d");
        patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;
        patternCtx.fillStyle = this.color;
        patternCtx.beginPath();
        patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
        patternCtx.closePath();
        patternCtx.fill();
        return patternCanvas;
    },
    getPatternSrcFunction: function() {
        return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"');
    },
    getPattern: function() {
        return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat");
    },
    _setBrushStyles: function() {
        this.callSuper("_setBrushStyles");
        this.canvas.contextTop.strokeStyle = this.getPattern();
    },
    createPath: function(pathData) {
        var path = this.callSuper("createPath", pathData), topLeft = path._getLeftTopCoords().scalarAdd(path.strokeWidth / 2);
        path.stroke = new fabric.Pattern({
            source: this.source || this.getPatternSrcFunction(),
            offsetX: -topLeft.x,
            offsetY: -topLeft.y
        });
        return path;
    }
});

(function() {
    var getPointer = fabric.util.getPointer, degreesToRadians = fabric.util.degreesToRadians, radiansToDegrees = fabric.util.radiansToDegrees, atan2 = Math.atan2, abs = Math.abs, supportLineDash = fabric.StaticCanvas.supports("setLineDash"), STROKE_OFFSET = .5;
    fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
        initialize: function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
            this._initInteractive();
            this._createCacheCanvas();
        },
        uniScaleTransform: false,
        uniScaleKey: "shiftKey",
        centeredScaling: false,
        centeredRotation: false,
        centeredKey: "altKey",
        altActionKey: "shiftKey",
        interactive: true,
        selection: true,
        selectionKey: "shiftKey",
        altSelectionKey: null,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionDashArray: [],
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        freeDrawingCursor: "crosshair",
        rotationCursor: "crosshair",
        containerClass: "canvas-container",
        perPixelTargetFind: false,
        targetFindTolerance: 0,
        skipTargetFind: false,
        isDrawingMode: false,
        preserveObjectStacking: false,
        snapAngle: 0,
        snapThreshold: null,
        stopContextMenu: false,
        fireRightClick: false,
        _initInteractive: function() {
            this._currentTransform = null;
            this._groupSelector = null;
            this._initWrapperElement();
            this._createUpperCanvas();
            this._initEventListeners();
            this._initRetinaScaling();
            this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this);
            this.calcOffset();
        },
        _chooseObjectsToRender: function() {
            var activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject(), object, objsToRender = [], activeGroupObjects = [];
            if ((activeGroup || activeObject) && !this.preserveObjectStacking) {
                for (var i = 0, length = this._objects.length; i < length; i++) {
                    object = this._objects[i];
                    if ((!activeGroup || !activeGroup.contains(object)) && object !== activeObject) {
                        objsToRender.push(object);
                    } else {
                        activeGroupObjects.push(object);
                    }
                }
                if (activeGroup) {
                    activeGroup._set("_objects", activeGroupObjects);
                    objsToRender.push(activeGroup);
                }
                activeObject && objsToRender.push(activeObject);
            } else {
                objsToRender = this._objects;
            }
            return objsToRender;
        },
        renderAll: function() {
            if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
                this.clearContext(this.contextTop);
                this.contextTopDirty = false;
            }
            var canvasToDrawOn = this.contextContainer;
            this.renderCanvas(canvasToDrawOn, this._chooseObjectsToRender());
            return this;
        },
        renderTop: function() {
            var ctx = this.contextTop;
            this.clearContext(ctx);
            if (this.selection && this._groupSelector) {
                this._drawSelection(ctx);
            }
            this.fire("after:render");
            this.contextTopDirty = true;
            return this;
        },
        _resetCurrentTransform: function() {
            var t = this._currentTransform;
            t.target.set({
                scaleX: t.original.scaleX,
                scaleY: t.original.scaleY,
                skewX: t.original.skewX,
                skewY: t.original.skewY,
                left: t.original.left,
                top: t.original.top
            });
            if (this._shouldCenterTransform(t.target)) {
                if (t.action === "rotate") {
                    this._setOriginToCenter(t.target);
                } else {
                    if (t.originX !== "center") {
                        if (t.originX === "right") {
                            t.mouseXSign = -1;
                        } else {
                            t.mouseXSign = 1;
                        }
                    }
                    if (t.originY !== "center") {
                        if (t.originY === "bottom") {
                            t.mouseYSign = -1;
                        } else {
                            t.mouseYSign = 1;
                        }
                    }
                    t.originX = "center";
                    t.originY = "center";
                }
            } else {
                t.originX = t.original.originX;
                t.originY = t.original.originY;
            }
        },
        containsPoint: function(e, target, point) {
            var ignoreZoom = true, pointer = point || this.getPointer(e, ignoreZoom), xy;
            if (target.group && target.group === this.getActiveGroup()) {
                xy = this._normalizePointer(target.group, pointer);
            } else {
                xy = {
                    x: pointer.x,
                    y: pointer.y
                };
            }
            return target.containsPoint(xy) || target._findTargetCorner(pointer);
        },
        _normalizePointer: function(object, pointer) {
            var m = object.calcTransformMatrix(), invertedM = fabric.util.invertTransform(m), vpt = this.viewportTransform, vptPointer = this.restorePointerVpt(pointer), p = fabric.util.transformPoint(vptPointer, invertedM);
            return fabric.util.transformPoint(p, vpt);
        },
        isTargetTransparent: function(target, x, y) {
            var hasBorders = target.hasBorders, transparentCorners = target.transparentCorners, ctx = this.contextCache, originalColor = target.selectionBackgroundColor;
            target.hasBorders = target.transparentCorners = false;
            target.selectionBackgroundColor = "";
            ctx.save();
            ctx.transform.apply(ctx, this.viewportTransform);
            target.render(ctx);
            ctx.restore();
            target.active && target._renderControls(ctx);
            target.hasBorders = hasBorders;
            target.transparentCorners = transparentCorners;
            target.selectionBackgroundColor = originalColor;
            var isTransparent = fabric.util.isTransparent(ctx, x, y, this.targetFindTolerance);
            this.clearContext(ctx);
            return isTransparent;
        },
        _shouldClearSelection: function(e, target) {
            var activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject();
            return !target || target && activeGroup && !activeGroup.contains(target) && activeGroup !== target && !e[this.selectionKey] || target && !target.evented || target && !target.selectable && activeObject && activeObject !== target;
        },
        _shouldCenterTransform: function(target) {
            if (!target) {
                return;
            }
            var t = this._currentTransform, centerTransform;
            if (t.action === "scale" || t.action === "scaleX" || t.action === "scaleY") {
                centerTransform = this.centeredScaling || target.centeredScaling;
            } else if (t.action === "rotate") {
                centerTransform = this.centeredRotation || target.centeredRotation;
            }
            return centerTransform ? !t.altKey : t.altKey;
        },
        _getOriginFromCorner: function(target, corner) {
            var origin = {
                x: target.originX,
                y: target.originY
            };
            if (corner === "ml" || corner === "tl" || corner === "bl") {
                origin.x = "right";
            } else if (corner === "mr" || corner === "tr" || corner === "br") {
                origin.x = "left";
            }
            if (corner === "tl" || corner === "mt" || corner === "tr") {
                origin.y = "bottom";
            } else if (corner === "bl" || corner === "mb" || corner === "br") {
                origin.y = "top";
            }
            return origin;
        },
        _getActionFromCorner: function(target, corner, e) {
            if (!corner) {
                return "drag";
            }
            switch (corner) {
              case "mtr":
                return "rotate";

              case "ml":
              case "mr":
                return e[this.altActionKey] ? "skewY" : "scaleX";

              case "mt":
              case "mb":
                return e[this.altActionKey] ? "skewX" : "scaleY";

              default:
                return "scale";
            }
        },
        _setupCurrentTransform: function(e, target) {
            if (!target) {
                return;
            }
            var pointer = this.getPointer(e), corner = target._findTargetCorner(this.getPointer(e, true)), action = this._getActionFromCorner(target, corner, e), origin = this._getOriginFromCorner(target, corner);
            this._currentTransform = {
                target: target,
                action: action,
                corner: corner,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                skewX: target.skewX,
                skewY: target.skewY,
                offsetX: pointer.x - target.left,
                offsetY: pointer.y - target.top,
                originX: origin.x,
                originY: origin.y,
                ex: pointer.x,
                ey: pointer.y,
                lastX: pointer.x,
                lastY: pointer.y,
                left: target.left,
                top: target.top,
                theta: degreesToRadians(target.angle),
                width: target.width * target.scaleX,
                mouseXSign: 1,
                mouseYSign: 1,
                shiftKey: e.shiftKey,
                altKey: e[this.centeredKey]
            };
            this._currentTransform.original = {
                left: target.left,
                top: target.top,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                skewX: target.skewX,
                skewY: target.skewY,
                originX: origin.x,
                originY: origin.y
            };
            this._resetCurrentTransform();
        },
        _translateObject: function(x, y) {
            var transform = this._currentTransform, target = transform.target, newLeft = x - transform.offsetX, newTop = y - transform.offsetY, moveX = !target.get("lockMovementX") && target.left !== newLeft, moveY = !target.get("lockMovementY") && target.top !== newTop;
            moveX && target.set("left", newLeft);
            moveY && target.set("top", newTop);
            return moveX || moveY;
        },
        _changeSkewTransformOrigin: function(mouseMove, t, by) {
            var property = "originX", origins = {
                0: "center"
            }, skew = t.target.skewX, originA = "left", originB = "right", corner = t.corner === "mt" || t.corner === "ml" ? 1 : -1, flipSign = 1;
            mouseMove = mouseMove > 0 ? 1 : -1;
            if (by === "y") {
                skew = t.target.skewY;
                originA = "top";
                originB = "bottom";
                property = "originY";
            }
            origins[-1] = originA;
            origins[1] = originB;
            t.target.flipX && (flipSign *= -1);
            t.target.flipY && (flipSign *= -1);
            if (skew === 0) {
                t.skewSign = -corner * mouseMove * flipSign;
                t[property] = origins[-mouseMove];
            } else {
                skew = skew > 0 ? 1 : -1;
                t.skewSign = skew;
                t[property] = origins[skew * corner * flipSign];
            }
        },
        _skewObject: function(x, y, by) {
            var t = this._currentTransform, target = t.target, skewed = false, lockSkewingX = target.get("lockSkewingX"), lockSkewingY = target.get("lockSkewingY");
            if (lockSkewingX && by === "x" || lockSkewingY && by === "y") {
                return false;
            }
            var center = target.getCenterPoint(), actualMouseByCenter = target.toLocalPoint(new fabric.Point(x, y), "center", "center")[by], lastMouseByCenter = target.toLocalPoint(new fabric.Point(t.lastX, t.lastY), "center", "center")[by], actualMouseByOrigin, constraintPosition, dim = target._getTransformedDimensions();
            this._changeSkewTransformOrigin(actualMouseByCenter - lastMouseByCenter, t, by);
            actualMouseByOrigin = target.toLocalPoint(new fabric.Point(x, y), t.originX, t.originY)[by];
            constraintPosition = target.translateToOriginPoint(center, t.originX, t.originY);
            skewed = this._setObjectSkew(actualMouseByOrigin, t, by, dim);
            t.lastX = x;
            t.lastY = y;
            target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
            return skewed;
        },
        _setObjectSkew: function(localMouse, transform, by, _dim) {
            var target = transform.target, newValue, skewed = false, skewSign = transform.skewSign, newDim, dimNoSkew, otherBy, _otherBy, _by, newDimMouse, skewX, skewY;
            if (by === "x") {
                otherBy = "y";
                _otherBy = "Y";
                _by = "X";
                skewX = 0;
                skewY = target.skewY;
            } else {
                otherBy = "x";
                _otherBy = "X";
                _by = "Y";
                skewX = target.skewX;
                skewY = 0;
            }
            dimNoSkew = target._getTransformedDimensions(skewX, skewY);
            newDimMouse = 2 * Math.abs(localMouse) - dimNoSkew[by];
            if (newDimMouse <= 2) {
                newValue = 0;
            } else {
                newValue = skewSign * Math.atan(newDimMouse / target["scale" + _by] / (dimNoSkew[otherBy] / target["scale" + _otherBy]));
                newValue = fabric.util.radiansToDegrees(newValue);
            }
            skewed = target["skew" + _by] !== newValue;
            target.set("skew" + _by, newValue);
            if (target["skew" + _otherBy] !== 0) {
                newDim = target._getTransformedDimensions();
                newValue = _dim[otherBy] / newDim[otherBy] * target["scale" + _otherBy];
                target.set("scale" + _otherBy, newValue);
            }
            return skewed;
        },
        _scaleObject: function(x, y, by) {
            var t = this._currentTransform, target = t.target, lockScalingX = target.get("lockScalingX"), lockScalingY = target.get("lockScalingY"), lockScalingFlip = target.get("lockScalingFlip");
            if (lockScalingX && lockScalingY) {
                return false;
            }
            var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY), localMouse = target.toLocalPoint(new fabric.Point(x, y), t.originX, t.originY), dim = target._getTransformedDimensions(), scaled = false;
            this._setLocalMouse(localMouse, t);
            scaled = this._setObjectScale(localMouse, t, lockScalingX, lockScalingY, by, lockScalingFlip, dim);
            target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
            return scaled;
        },
        _setObjectScale: function(localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {
            var target = transform.target, forbidScalingX = false, forbidScalingY = false, scaled = false, changeX, changeY, scaleX, scaleY;
            scaleX = localMouse.x * target.scaleX / _dim.x;
            scaleY = localMouse.y * target.scaleY / _dim.y;
            changeX = target.scaleX !== scaleX;
            changeY = target.scaleY !== scaleY;
            if (lockScalingFlip && scaleX <= 0 && scaleX < target.scaleX) {
                forbidScalingX = true;
            }
            if (lockScalingFlip && scaleY <= 0 && scaleY < target.scaleY) {
                forbidScalingY = true;
            }
            if (by === "equally" && !lockScalingX && !lockScalingY) {
                forbidScalingX || forbidScalingY || (scaled = this._scaleObjectEqually(localMouse, target, transform, _dim));
            } else if (!by) {
                forbidScalingX || lockScalingX || target.set("scaleX", scaleX) && (scaled = scaled || changeX);
                forbidScalingY || lockScalingY || target.set("scaleY", scaleY) && (scaled = scaled || changeY);
            } else if (by === "x" && !target.get("lockUniScaling")) {
                forbidScalingX || lockScalingX || target.set("scaleX", scaleX) && (scaled = scaled || changeX);
            } else if (by === "y" && !target.get("lockUniScaling")) {
                forbidScalingY || lockScalingY || target.set("scaleY", scaleY) && (scaled = scaled || changeY);
            }
            transform.newScaleX = scaleX;
            transform.newScaleY = scaleY;
            forbidScalingX || forbidScalingY || this._flipObject(transform, by);
            return scaled;
        },
        _scaleObjectEqually: function(localMouse, target, transform, _dim) {
            var dist = localMouse.y + localMouse.x, lastDist = _dim.y * transform.original.scaleY / target.scaleY + _dim.x * transform.original.scaleX / target.scaleX, scaled;
            transform.newScaleX = transform.original.scaleX * dist / lastDist;
            transform.newScaleY = transform.original.scaleY * dist / lastDist;
            scaled = transform.newScaleX !== target.scaleX || transform.newScaleY !== target.scaleY;
            target.set("scaleX", transform.newScaleX);
            target.set("scaleY", transform.newScaleY);
            return scaled;
        },
        _flipObject: function(transform, by) {
            if (transform.newScaleX < 0 && by !== "y") {
                if (transform.originX === "left") {
                    transform.originX = "right";
                } else if (transform.originX === "right") {
                    transform.originX = "left";
                }
            }
            if (transform.newScaleY < 0 && by !== "x") {
                if (transform.originY === "top") {
                    transform.originY = "bottom";
                } else if (transform.originY === "bottom") {
                    transform.originY = "top";
                }
            }
        },
        _setLocalMouse: function(localMouse, t) {
            var target = t.target;
            if (t.originX === "right") {
                localMouse.x *= -1;
            } else if (t.originX === "center") {
                localMouse.x *= t.mouseXSign * 2;
                if (localMouse.x < 0) {
                    t.mouseXSign = -t.mouseXSign;
                }
            }
            if (t.originY === "bottom") {
                localMouse.y *= -1;
            } else if (t.originY === "center") {
                localMouse.y *= t.mouseYSign * 2;
                if (localMouse.y < 0) {
                    t.mouseYSign = -t.mouseYSign;
                }
            }
            if (abs(localMouse.x) > target.padding) {
                if (localMouse.x < 0) {
                    localMouse.x += target.padding;
                } else {
                    localMouse.x -= target.padding;
                }
            } else {
                localMouse.x = 0;
            }
            if (abs(localMouse.y) > target.padding) {
                if (localMouse.y < 0) {
                    localMouse.y += target.padding;
                } else {
                    localMouse.y -= target.padding;
                }
            } else {
                localMouse.y = 0;
            }
        },
        _rotateObject: function(x, y) {
            var t = this._currentTransform;
            if (t.target.get("lockRotation")) {
                return false;
            }
            var lastAngle = atan2(t.ey - t.top, t.ex - t.left), curAngle = atan2(y - t.top, x - t.left), angle = radiansToDegrees(curAngle - lastAngle + t.theta), hasRoated = true;
            if (angle < 0) {
                angle = 360 + angle;
            }
            angle %= 360;
            if (t.target.snapAngle > 0) {
                var snapAngle = t.target.snapAngle, snapThreshold = t.target.snapThreshold || snapAngle, rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle, leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;
                if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
                    angle = leftAngleLocked;
                } else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
                    angle = rightAngleLocked;
                }
                if (t.target.angle === angle) {
                    hasRoated = false;
                }
            }
            t.target.angle = angle;
            return hasRoated;
        },
        setCursor: function(value) {
            this.upperCanvasEl.style.cursor = value;
        },
        _resetObjectTransform: function(target) {
            target.scaleX = 1;
            target.scaleY = 1;
            target.skewX = 0;
            target.skewY = 0;
            target.setAngle(0);
        },
        _drawSelection: function(ctx) {
            var groupSelector = this._groupSelector, left = groupSelector.left, top = groupSelector.top, aleft = abs(left), atop = abs(top);
            if (this.selectionColor) {
                ctx.fillStyle = this.selectionColor;
                ctx.fillRect(groupSelector.ex - (left > 0 ? 0 : -left), groupSelector.ey - (top > 0 ? 0 : -top), aleft, atop);
            }
            if (!this.selectionLineWidth || !this.selectionBorderColor) {
                return;
            }
            ctx.lineWidth = this.selectionLineWidth;
            ctx.strokeStyle = this.selectionBorderColor;
            if (this.selectionDashArray.length > 1 && !supportLineDash) {
                var px = groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft), py = groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop);
                ctx.beginPath();
                fabric.util.drawDashedLine(ctx, px, py, px + aleft, py, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px, py + atop - 1, px + aleft, py + atop - 1, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px, py, px, py + atop, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px + aleft - 1, py, px + aleft - 1, py + atop, this.selectionDashArray);
                ctx.closePath();
                ctx.stroke();
            } else {
                fabric.Object.prototype._setLineDash.call(this, ctx, this.selectionDashArray);
                ctx.strokeRect(groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft), groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop), aleft, atop);
            }
        },
        findTarget: function(e, skipGroup) {
            if (this.skipTargetFind) {
                return;
            }
            var ignoreZoom = true, pointer = this.getPointer(e, ignoreZoom), activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject(), activeTarget;
            if (activeGroup && !skipGroup && this._checkTarget(pointer, activeGroup)) {
                this._fireOverOutEvents(activeGroup, e);
                return activeGroup;
            }
            if (activeObject && activeObject._findTargetCorner(pointer)) {
                this._fireOverOutEvents(activeObject, e);
                return activeObject;
            }
            if (activeObject && this._checkTarget(pointer, activeObject)) {
                if (!this.preserveObjectStacking) {
                    this._fireOverOutEvents(activeObject, e);
                    return activeObject;
                } else {
                    activeTarget = activeObject;
                }
            }
            this.targets = [];
            var target = this._searchPossibleTargets(this._objects, pointer);
            if (e[this.altSelectionKey] && target && activeTarget && target !== activeTarget) {
                target = activeTarget;
            }
            this._fireOverOutEvents(target, e);
            return target;
        },
        _fireOverOutEvents: function(target, e) {
            if (target) {
                if (this._hoveredTarget !== target) {
                    if (this._hoveredTarget) {
                        this.fire("mouse:out", {
                            target: this._hoveredTarget,
                            e: e
                        });
                        this._hoveredTarget.fire("mouseout");
                    }
                    this.fire("mouse:over", {
                        target: target,
                        e: e
                    });
                    target.fire("mouseover");
                    this._hoveredTarget = target;
                }
            } else if (this._hoveredTarget) {
                this.fire("mouse:out", {
                    target: this._hoveredTarget,
                    e: e
                });
                this._hoveredTarget.fire("mouseout");
                this._hoveredTarget = null;
            }
        },
        _checkTarget: function(pointer, obj) {
            if (obj && obj.visible && obj.evented && this.containsPoint(null, obj, pointer)) {
                if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
                    var isTransparent = this.isTargetTransparent(obj, pointer.x, pointer.y);
                    if (!isTransparent) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        },
        _searchPossibleTargets: function(objects, pointer) {
            var target, i = objects.length, normalizedPointer, subTarget;
            while (i--) {
                if (this._checkTarget(pointer, objects[i])) {
                    target = objects[i];
                    if (target.type === "group" && target.subTargetCheck) {
                        normalizedPointer = this._normalizePointer(target, pointer);
                        subTarget = this._searchPossibleTargets(target._objects, normalizedPointer);
                        subTarget && this.targets.push(subTarget);
                    }
                    break;
                }
            }
            return target;
        },
        restorePointerVpt: function(pointer) {
            return fabric.util.transformPoint(pointer, fabric.util.invertTransform(this.viewportTransform));
        },
        getPointer: function(e, ignoreZoom, upperCanvasEl) {
            if (!upperCanvasEl) {
                upperCanvasEl = this.upperCanvasEl;
            }
            var pointer = getPointer(e), bounds = upperCanvasEl.getBoundingClientRect(), boundsWidth = bounds.width || 0, boundsHeight = bounds.height || 0, cssScale;
            if (!boundsWidth || !boundsHeight) {
                if ("top" in bounds && "bottom" in bounds) {
                    boundsHeight = Math.abs(bounds.top - bounds.bottom);
                }
                if ("right" in bounds && "left" in bounds) {
                    boundsWidth = Math.abs(bounds.right - bounds.left);
                }
            }
            this.calcOffset();
            pointer.x = pointer.x - this._offset.left;
            pointer.y = pointer.y - this._offset.top;
            if (!ignoreZoom) {
                pointer = this.restorePointerVpt(pointer);
            }
            if (boundsWidth === 0 || boundsHeight === 0) {
                cssScale = {
                    width: 1,
                    height: 1
                };
            } else {
                cssScale = {
                    width: upperCanvasEl.width / boundsWidth,
                    height: upperCanvasEl.height / boundsHeight
                };
            }
            return {
                x: pointer.x * cssScale.width,
                y: pointer.y * cssScale.height
            };
        },
        _createUpperCanvas: function() {
            var lowerCanvasClass = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
            this.upperCanvasEl = this._createCanvasElement();
            fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + lowerCanvasClass);
            this.wrapperEl.appendChild(this.upperCanvasEl);
            this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl);
            this._applyCanvasStyle(this.upperCanvasEl);
            this.contextTop = this.upperCanvasEl.getContext("2d");
        },
        _createCacheCanvas: function() {
            this.cacheCanvasEl = this._createCanvasElement();
            this.cacheCanvasEl.setAttribute("width", this.width);
            this.cacheCanvasEl.setAttribute("height", this.height);
            this.contextCache = this.cacheCanvasEl.getContext("2d");
        },
        _initWrapperElement: function() {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                class: this.containerClass
            });
            fabric.util.setStyle(this.wrapperEl, {
                width: this.getWidth() + "px",
                height: this.getHeight() + "px",
                position: "relative"
            });
            fabric.util.makeElementUnselectable(this.wrapperEl);
        },
        _applyCanvasStyle: function(element) {
            var width = this.getWidth() || element.width, height = this.getHeight() || element.height;
            fabric.util.setStyle(element, {
                position: "absolute",
                width: width + "px",
                height: height + "px",
                left: 0,
                top: 0
            });
            element.width = width;
            element.height = height;
            fabric.util.makeElementUnselectable(element);
        },
        _copyCanvasStyle: function(fromEl, toEl) {
            toEl.style.cssText = fromEl.style.cssText;
        },
        getSelectionContext: function() {
            return this.contextTop;
        },
        getSelectionElement: function() {
            return this.upperCanvasEl;
        },
        _setActiveObject: function(object) {
            if (this._activeObject) {
                this._activeObject.set("active", false);
            }
            this._activeObject = object;
            object.set("active", true);
        },
        setActiveObject: function(object, e) {
            this._setActiveObject(object);
            this.renderAll();
            this.fire("object:selected", {
                target: object,
                e: e
            });
            object.fire("selected", {
                e: e
            });
            return this;
        },
        getActiveObject: function() {
            return this._activeObject;
        },
        _onObjectRemoved: function(obj) {
            if (this.getActiveObject() === obj) {
                this.fire("before:selection:cleared", {
                    target: obj
                });
                this._discardActiveObject();
                this.fire("selection:cleared", {
                    target: obj
                });
                obj.fire("deselected");
            }
            this.callSuper("_onObjectRemoved", obj);
        },
        _discardActiveObject: function() {
            if (this._activeObject) {
                this._activeObject.set("active", false);
            }
            this._activeObject = null;
        },
        discardActiveObject: function(e) {
            var activeObject = this._activeObject;
            this.fire("before:selection:cleared", {
                target: activeObject,
                e: e
            });
            this._discardActiveObject();
            this.fire("selection:cleared", {
                e: e
            });
            activeObject && activeObject.fire("deselected", {
                e: e
            });
            return this;
        },
        _setActiveGroup: function(group) {
            this._activeGroup = group;
            if (group) {
                group.set("active", true);
            }
        },
        setActiveGroup: function(group, e) {
            this._setActiveGroup(group);
            if (group) {
                this.fire("object:selected", {
                    target: group,
                    e: e
                });
                group.fire("selected", {
                    e: e
                });
            }
            return this;
        },
        getActiveGroup: function() {
            return this._activeGroup;
        },
        _discardActiveGroup: function() {
            var g = this.getActiveGroup();
            if (g) {
                g.destroy();
            }
            this.setActiveGroup(null);
        },
        discardActiveGroup: function(e) {
            var g = this.getActiveGroup();
            this.fire("before:selection:cleared", {
                e: e,
                target: g
            });
            this._discardActiveGroup();
            this.fire("selection:cleared", {
                e: e
            });
            return this;
        },
        deactivateAll: function() {
            var allObjects = this.getObjects(), i = 0, len = allObjects.length;
            for (;i < len; i++) {
                allObjects[i].set("active", false);
            }
            this._discardActiveGroup();
            this._discardActiveObject();
            return this;
        },
        deactivateAllWithDispatch: function(e) {
            var activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject();
            if (activeObject || activeGroup) {
                this.fire("before:selection:cleared", {
                    target: activeObject || activeGroup,
                    e: e
                });
            }
            this.deactivateAll();
            if (activeObject || activeGroup) {
                this.fire("selection:cleared", {
                    e: e,
                    target: activeObject
                });
                activeObject && activeObject.fire("deselected");
            }
            return this;
        },
        dispose: function() {
            this.callSuper("dispose");
            var wrapper = this.wrapperEl;
            this.removeListeners();
            wrapper.removeChild(this.upperCanvasEl);
            wrapper.removeChild(this.lowerCanvasEl);
            delete this.upperCanvasEl;
            if (wrapper.parentNode) {
                wrapper.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl);
            }
            delete this.wrapperEl;
            return this;
        },
        clear: function() {
            this.discardActiveGroup();
            this.discardActiveObject();
            this.clearContext(this.contextTop);
            return this.callSuper("clear");
        },
        drawControls: function(ctx) {
            var activeGroup = this.getActiveGroup();
            if (activeGroup) {
                activeGroup._renderControls(ctx);
            } else {
                this._drawObjectsControls(ctx);
            }
        },
        _drawObjectsControls: function(ctx) {
            for (var i = 0, len = this._objects.length; i < len; ++i) {
                if (!this._objects[i] || !this._objects[i].active) {
                    continue;
                }
                this._objects[i]._renderControls(ctx);
            }
        },
        _toObject: function(instance, methodName, propertiesToInclude) {
            var originalProperties = this._realizeGroupTransformOnObject(instance), object = this.callSuper("_toObject", instance, methodName, propertiesToInclude);
            this._unwindGroupTransformOnObject(instance, originalProperties);
            return object;
        },
        _realizeGroupTransformOnObject: function(instance) {
            var layoutProps = [ "angle", "flipX", "flipY", "height", "left", "scaleX", "scaleY", "top", "width" ];
            if (instance.group && instance.group === this.getActiveGroup()) {
                var originalValues = {};
                layoutProps.forEach(function(prop) {
                    originalValues[prop] = instance[prop];
                });
                this.getActiveGroup().realizeTransform(instance);
                return originalValues;
            } else {
                return null;
            }
        },
        _unwindGroupTransformOnObject: function(instance, originalValues) {
            if (originalValues) {
                instance.set(originalValues);
            }
        },
        _setSVGObject: function(markup, instance, reviver) {
            var originalProperties;
            originalProperties = this._realizeGroupTransformOnObject(instance);
            this.callSuper("_setSVGObject", markup, instance, reviver);
            this._unwindGroupTransformOnObject(instance, originalProperties);
        }
    });
    for (var prop in fabric.StaticCanvas) {
        if (prop !== "prototype") {
            fabric.Canvas[prop] = fabric.StaticCanvas[prop];
        }
    }
    if (fabric.isTouchSupported) {
        fabric.Canvas.prototype._setCursorFromEvent = function() {};
    }
    fabric.Element = fabric.Canvas;
})();

(function() {
    var cursorOffset = {
        mt: 0,
        tr: 1,
        mr: 2,
        br: 3,
        mb: 4,
        bl: 5,
        ml: 6,
        tl: 7
    }, addListener = fabric.util.addListener, removeListener = fabric.util.removeListener;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        cursorMap: [ "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize" ],
        _initEventListeners: function() {
            this._bindEvents();
            addListener(fabric.window, "resize", this._onResize);
            addListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            addListener(this.upperCanvasEl, "mouseout", this._onMouseOut);
            addListener(this.upperCanvasEl, "mouseenter", this._onMouseEnter);
            addListener(this.upperCanvasEl, "wheel", this._onMouseWheel);
            addListener(this.upperCanvasEl, "contextmenu", this._onContextMenu);
            addListener(this.upperCanvasEl, "touchstart", this._onMouseDown);
            addListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (typeof eventjs !== "undefined" && "add" in eventjs) {
                eventjs.add(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.add(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.add(this.upperCanvasEl, "shake", this._onShake);
                eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress);
            }
        },
        _bindEvents: function() {
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onResize = this._onResize.bind(this);
            this._onGesture = this._onGesture.bind(this);
            this._onDrag = this._onDrag.bind(this);
            this._onShake = this._onShake.bind(this);
            this._onLongPress = this._onLongPress.bind(this);
            this._onOrientationChange = this._onOrientationChange.bind(this);
            this._onMouseWheel = this._onMouseWheel.bind(this);
            this._onMouseOut = this._onMouseOut.bind(this);
            this._onMouseEnter = this._onMouseEnter.bind(this);
            this._onContextMenu = this._onContextMenu.bind(this);
        },
        removeListeners: function() {
            removeListener(fabric.window, "resize", this._onResize);
            removeListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "mouseout", this._onMouseOut);
            removeListener(this.upperCanvasEl, "mouseenter", this._onMouseEnter);
            removeListener(this.upperCanvasEl, "wheel", this._onMouseWheel);
            removeListener(this.upperCanvasEl, "contextmenu", this._onContextMenu);
            removeListener(this.upperCanvasEl, "touchstart", this._onMouseDown);
            removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (typeof eventjs !== "undefined" && "remove" in eventjs) {
                eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.remove(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.remove(this.upperCanvasEl, "shake", this._onShake);
                eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress);
            }
        },
        _onGesture: function(e, self) {
            this.__onTransformGesture && this.__onTransformGesture(e, self);
        },
        _onDrag: function(e, self) {
            this.__onDrag && this.__onDrag(e, self);
        },
        _onMouseWheel: function(e) {
            this.__onMouseWheel(e);
        },
        _onMouseOut: function(e) {
            var target = this._hoveredTarget;
            this.fire("mouse:out", {
                target: target,
                e: e
            });
            this._hoveredTarget = null;
            target && target.fire("mouseout", {
                e: e
            });
        },
        _onMouseEnter: function(e) {
            if (!this.findTarget(e)) {
                this.fire("mouse:over", {
                    target: null,
                    e: e
                });
                this._hoveredTarget = null;
            }
        },
        _onOrientationChange: function(e, self) {
            this.__onOrientationChange && this.__onOrientationChange(e, self);
        },
        _onShake: function(e, self) {
            this.__onShake && this.__onShake(e, self);
        },
        _onLongPress: function(e, self) {
            this.__onLongPress && this.__onLongPress(e, self);
        },
        _onContextMenu: function(e) {
            if (this.stopContextMenu) {
                e.stopPropagation();
                e.preventDefault();
            }
            return false;
        },
        _onMouseDown: function(e) {
            this.__onMouseDown(e);
            addListener(fabric.document, "touchend", this._onMouseUp);
            addListener(fabric.document, "touchmove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (e.type === "touchstart") {
                removeListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            } else {
                addListener(fabric.document, "mouseup", this._onMouseUp);
                addListener(fabric.document, "mousemove", this._onMouseMove);
            }
        },
        _onMouseUp: function(e) {
            this.__onMouseUp(e);
            removeListener(fabric.document, "mouseup", this._onMouseUp);
            removeListener(fabric.document, "touchend", this._onMouseUp);
            removeListener(fabric.document, "mousemove", this._onMouseMove);
            removeListener(fabric.document, "touchmove", this._onMouseMove);
            addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            addListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (e.type === "touchend") {
                var _this = this;
                setTimeout(function() {
                    addListener(_this.upperCanvasEl, "mousedown", _this._onMouseDown);
                }, 400);
            }
        },
        _onMouseMove: function(e) {
            !this.allowTouchScrolling && e.preventDefault && e.preventDefault();
            this.__onMouseMove(e);
        },
        _onResize: function() {
            this.calcOffset();
        },
        _shouldRender: function(target, pointer) {
            var activeObject = this.getActiveGroup() || this.getActiveObject();
            return !!(target && (target.isMoving || target !== activeObject) || !target && !!activeObject || !target && !activeObject && !this._groupSelector || pointer && this._previousPointer && this.selection && (pointer.x !== this._previousPointer.x || pointer.y !== this._previousPointer.y));
        },
        __onMouseUp: function(e) {
            var target, searchTarget = true, transform = this._currentTransform, groupSelector = this._groupSelector, isClick = !groupSelector || groupSelector.left === 0 && groupSelector.top === 0;
            if (this.isDrawingMode && this._isCurrentlyDrawing) {
                this._onMouseUpInDrawingMode(e);
                return;
            }
            if (transform) {
                this._finalizeCurrentTransform();
                searchTarget = !transform.actionPerformed;
            }
            target = searchTarget ? this.findTarget(e, true) : transform.target;
            var shouldRender = this._shouldRender(target, this.getPointer(e));
            if (target || !isClick) {
                this._maybeGroupObjects(e);
            } else {
                this._groupSelector = null;
                this._currentTransform = null;
            }
            if (target) {
                target.isMoving = false;
            }
            this._handleCursorAndEvent(e, target, "up");
            target && (target.__corner = 0);
            shouldRender && this.renderAll();
        },
        _handleCursorAndEvent: function(e, target, eventType) {
            this._setCursorFromEvent(e, target);
            this._handleEvent(e, eventType, target ? target : null);
        },
        _handleEvent: function(e, eventType, targetObj) {
            var target = typeof targetObj === undefined ? this.findTarget(e) : targetObj, targets = this.targets || [], options = {
                e: e,
                target: target,
                subTargets: targets
            };
            this.fire("mouse:" + eventType, options);
            target && target.fire("mouse" + eventType, options);
            for (var i = 0; i < targets.length; i++) {
                targets[i].fire("mouse" + eventType, options);
            }
        },
        _finalizeCurrentTransform: function() {
            var transform = this._currentTransform, target = transform.target;
            if (target._scaling) {
                target._scaling = false;
            }
            target.setCoords();
            this._restoreOriginXY(target);
            if (transform.actionPerformed || this.stateful && target.hasStateChanged()) {
                this.fire("object:modified", {
                    target: target
                });
                target.fire("modified");
            }
        },
        _restoreOriginXY: function(target) {
            if (this._previousOriginX && this._previousOriginY) {
                var originPoint = target.translateToOriginPoint(target.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                target.originX = this._previousOriginX;
                target.originY = this._previousOriginY;
                target.left = originPoint.x;
                target.top = originPoint.y;
                this._previousOriginX = null;
                this._previousOriginY = null;
            }
        },
        _onMouseDownInDrawingMode: function(e) {
            this._isCurrentlyDrawing = true;
            this.discardActiveObject(e).renderAll();
            if (this.clipTo) {
                fabric.util.clipContext(this, this.contextTop);
            }
            var pointer = this.getPointer(e);
            this.freeDrawingBrush.onMouseDown(pointer);
            this._handleEvent(e, "down");
        },
        _onMouseMoveInDrawingMode: function(e) {
            if (this._isCurrentlyDrawing) {
                var pointer = this.getPointer(e);
                this.freeDrawingBrush.onMouseMove(pointer);
            }
            this.setCursor(this.freeDrawingCursor);
            this._handleEvent(e, "move");
        },
        _onMouseUpInDrawingMode: function(e) {
            this._isCurrentlyDrawing = false;
            if (this.clipTo) {
                this.contextTop.restore();
            }
            this.freeDrawingBrush.onMouseUp();
            this._handleEvent(e, "up");
        },
        __onMouseDown: function(e) {
            var target = this.findTarget(e), pointer = this.getPointer(e, true);
            var isRightClick = "which" in e ? e.which === 3 : e.button === 2;
            if (isRightClick) {
                if (this.fireRightClick) {
                    this._handleEvent(e, "down", target ? target : null);
                }
                return;
            }
            if (this.isDrawingMode) {
                this._onMouseDownInDrawingMode(e);
                return;
            }
            if (this._currentTransform) {
                return;
            }
            this._previousPointer = pointer;
            var shouldRender = this._shouldRender(target, pointer), shouldGroup = this._shouldGroup(e, target);
            if (this._shouldClearSelection(e, target)) {
                this._clearSelection(e, target, pointer);
            } else if (shouldGroup) {
                this._handleGrouping(e, target);
                target = this.getActiveGroup();
            }
            if (target) {
                if (target.selectable && (target.__corner || !shouldGroup)) {
                    this._beforeTransform(e, target);
                    this._setupCurrentTransform(e, target);
                }
                if (target !== this.getActiveGroup() && target !== this.getActiveObject()) {
                    this.deactivateAll();
                    target.selectable && this.setActiveObject(target, e);
                }
            }
            this._handleEvent(e, "down", target ? target : null);
            shouldRender && this.renderAll();
        },
        _beforeTransform: function(e, target) {
            this.stateful && target.saveState();
            if (target._findTargetCorner(this.getPointer(e))) {
                this.onBeforeScaleRotate(target);
            }
        },
        _clearSelection: function(e, target, pointer) {
            this.deactivateAllWithDispatch(e);
            if (target && target.selectable) {
                this.setActiveObject(target, e);
            } else if (this.selection) {
                this._groupSelector = {
                    ex: pointer.x,
                    ey: pointer.y,
                    top: 0,
                    left: 0
                };
            }
        },
        _setOriginToCenter: function(target) {
            this._previousOriginX = this._currentTransform.target.originX;
            this._previousOriginY = this._currentTransform.target.originY;
            var center = target.getCenterPoint();
            target.originX = "center";
            target.originY = "center";
            target.left = center.x;
            target.top = center.y;
            this._currentTransform.left = target.left;
            this._currentTransform.top = target.top;
        },
        _setCenterToOrigin: function(target) {
            var originPoint = target.translateToOriginPoint(target.getCenterPoint(), this._previousOriginX, this._previousOriginY);
            target.originX = this._previousOriginX;
            target.originY = this._previousOriginY;
            target.left = originPoint.x;
            target.top = originPoint.y;
            this._previousOriginX = null;
            this._previousOriginY = null;
        },
        __onMouseMove: function(e) {
            var target, pointer;
            if (this.isDrawingMode) {
                this._onMouseMoveInDrawingMode(e);
                return;
            }
            if (typeof e.touches !== "undefined" && e.touches.length > 1) {
                return;
            }
            var groupSelector = this._groupSelector;
            if (groupSelector) {
                pointer = this.getPointer(e, true);
                groupSelector.left = pointer.x - groupSelector.ex;
                groupSelector.top = pointer.y - groupSelector.ey;
                this.renderTop();
            } else if (!this._currentTransform) {
                target = this.findTarget(e);
                this._setCursorFromEvent(e, target);
            } else {
                this._transformObject(e);
            }
            this._handleEvent(e, "move", target ? target : null);
        },
        __onMouseWheel: function(e) {
            this.fire("mouse:wheel", {
                e: e
            });
        },
        _transformObject: function(e) {
            var pointer = this.getPointer(e), transform = this._currentTransform;
            transform.reset = false;
            transform.target.isMoving = true;
            this._beforeScaleTransform(e, transform);
            this._performTransformAction(e, transform, pointer);
            transform.actionPerformed && this.renderAll();
        },
        _performTransformAction: function(e, transform, pointer) {
            var x = pointer.x, y = pointer.y, target = transform.target, action = transform.action, actionPerformed = false;
            if (action === "rotate") {
                (actionPerformed = this._rotateObject(x, y)) && this._fire("rotating", target, e);
            } else if (action === "scale") {
                (actionPerformed = this._onScale(e, transform, x, y)) && this._fire("scaling", target, e);
            } else if (action === "scaleX") {
                (actionPerformed = this._scaleObject(x, y, "x")) && this._fire("scaling", target, e);
            } else if (action === "scaleY") {
                (actionPerformed = this._scaleObject(x, y, "y")) && this._fire("scaling", target, e);
            } else if (action === "skewX") {
                (actionPerformed = this._skewObject(x, y, "x")) && this._fire("skewing", target, e);
            } else if (action === "skewY") {
                (actionPerformed = this._skewObject(x, y, "y")) && this._fire("skewing", target, e);
            } else {
                actionPerformed = this._translateObject(x, y);
                if (actionPerformed) {
                    this._fire("moving", target, e);
                    this.setCursor(target.moveCursor || this.moveCursor);
                }
            }
            transform.actionPerformed = actionPerformed;
        },
        _fire: function(eventName, target, e) {
            this.fire("object:" + eventName, {
                target: target,
                e: e
            });
            target.fire(eventName, {
                e: e
            });
        },
        _beforeScaleTransform: function(e, transform) {
            if (transform.action === "scale" || transform.action === "scaleX" || transform.action === "scaleY") {
                var centerTransform = this._shouldCenterTransform(transform.target);
                if (centerTransform && (transform.originX !== "center" || transform.originY !== "center") || !centerTransform && transform.originX === "center" && transform.originY === "center") {
                    this._resetCurrentTransform();
                    transform.reset = true;
                }
            }
        },
        _onScale: function(e, transform, x, y) {
            if ((e[this.uniScaleKey] || this.uniScaleTransform) && !transform.target.get("lockUniScaling")) {
                transform.currentAction = "scale";
                return this._scaleObject(x, y);
            } else {
                if (!transform.reset && transform.currentAction === "scale") {
                    this._resetCurrentTransform();
                }
                transform.currentAction = "scaleEqually";
                return this._scaleObject(x, y, "equally");
            }
        },
        _setCursorFromEvent: function(e, target) {
            if (!target) {
                this.setCursor(this.defaultCursor);
                return false;
            }
            var hoverCursor = target.hoverCursor || this.hoverCursor;
            if (!target.selectable) {
                this.setCursor(hoverCursor);
            } else {
                var activeGroup = this.getActiveGroup(), corner = target._findTargetCorner && (!activeGroup || !activeGroup.contains(target)) && target._findTargetCorner(this.getPointer(e, true));
                if (!corner) {
                    this.setCursor(hoverCursor);
                } else {
                    this._setCornerCursor(corner, target, e);
                }
            }
            return true;
        },
        _setCornerCursor: function(corner, target, e) {
            if (corner in cursorOffset) {
                this.setCursor(this._getRotatedCornerCursor(corner, target, e));
            } else if (corner === "mtr" && target.hasRotatingPoint) {
                this.setCursor(this.rotationCursor);
            } else {
                this.setCursor(this.defaultCursor);
                return false;
            }
        },
        _getRotatedCornerCursor: function(corner, target, e) {
            var n = Math.round(target.getAngle() % 360 / 45);
            if (n < 0) {
                n += 8;
            }
            n += cursorOffset[corner];
            if (e[this.altActionKey] && cursorOffset[corner] % 2 === 0) {
                n += 2;
            }
            n %= 8;
            return this.cursorMap[n];
        }
    });
})();

(function() {
    var min = Math.min, max = Math.max;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _shouldGroup: function(e, target) {
            var activeObject = this.getActiveObject();
            return e[this.selectionKey] && target && target.selectable && (this.getActiveGroup() || activeObject && activeObject !== target) && this.selection;
        },
        _handleGrouping: function(e, target) {
            var activeGroup = this.getActiveGroup();
            if (target === activeGroup) {
                target = this.findTarget(e, true);
                if (!target) {
                    return;
                }
            }
            if (activeGroup) {
                this._updateActiveGroup(target, e);
            } else {
                this._createActiveGroup(target, e);
            }
            if (this._activeGroup) {
                this._activeGroup.saveCoords();
            }
        },
        _updateActiveGroup: function(target, e) {
            var activeGroup = this.getActiveGroup();
            if (activeGroup.contains(target)) {
                activeGroup.removeWithUpdate(target);
                target.set("active", false);
                if (activeGroup.size() === 1) {
                    this.discardActiveGroup(e);
                    this.setActiveObject(activeGroup.item(0));
                    return;
                }
            } else {
                activeGroup.addWithUpdate(target);
            }
            this.fire("selection:created", {
                target: activeGroup,
                e: e
            });
            activeGroup.set("active", true);
        },
        _createActiveGroup: function(target, e) {
            if (this._activeObject && target !== this._activeObject) {
                var group = this._createGroup(target);
                group.addWithUpdate();
                this.setActiveGroup(group);
                this._activeObject = null;
                this.fire("selection:created", {
                    target: group,
                    e: e
                });
            }
            target.set("active", true);
        },
        _createGroup: function(target) {
            var objects = this.getObjects(), isActiveLower = objects.indexOf(this._activeObject) < objects.indexOf(target), groupObjects = isActiveLower ? [ this._activeObject, target ] : [ target, this._activeObject ];
            this._activeObject.isEditing && this._activeObject.exitEditing();
            return new fabric.Group(groupObjects, {
                canvas: this
            });
        },
        _groupSelectedObjects: function(e) {
            var group = this._collectObjects();
            if (group.length === 1) {
                this.setActiveObject(group[0], e);
            } else if (group.length > 1) {
                group = new fabric.Group(group.reverse(), {
                    canvas: this
                });
                group.addWithUpdate();
                this.setActiveGroup(group, e);
                group.saveCoords();
                this.fire("selection:created", {
                    target: group
                });
                this.renderAll();
            }
        },
        _collectObjects: function() {
            var group = [], currentObject, x1 = this._groupSelector.ex, y1 = this._groupSelector.ey, x2 = x1 + this._groupSelector.left, y2 = y1 + this._groupSelector.top, selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)), selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2)), isClick = x1 === x2 && y1 === y2;
            for (var i = this._objects.length; i--; ) {
                currentObject = this._objects[i];
                if (!currentObject || !currentObject.selectable || !currentObject.visible) {
                    continue;
                }
                if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) || currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2) || currentObject.containsPoint(selectionX1Y1) || currentObject.containsPoint(selectionX2Y2)) {
                    currentObject.set("active", true);
                    group.push(currentObject);
                    if (isClick) {
                        break;
                    }
                }
            }
            return group;
        },
        _maybeGroupObjects: function(e) {
            if (this.selection && this._groupSelector) {
                this._groupSelectedObjects(e);
            }
            var activeGroup = this.getActiveGroup();
            if (activeGroup) {
                activeGroup.setObjectsCoords().setCoords();
                activeGroup.isMoving = false;
                this.setCursor(this.defaultCursor);
            }
            this._groupSelector = null;
            this._currentTransform = null;
        }
    });
})();

(function() {
    var supportQuality = fabric.StaticCanvas.supports("toDataURLWithQuality");
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(options) {
            options || (options = {});
            var format = options.format || "png", quality = options.quality || 1, multiplier = options.multiplier || 1, cropping = {
                left: options.left || 0,
                top: options.top || 0,
                width: options.width || 0,
                height: options.height || 0
            };
            return this.__toDataURLWithMultiplier(format, quality, cropping, multiplier);
        },
        __toDataURLWithMultiplier: function(format, quality, cropping, multiplier) {
            var origWidth = this.getWidth(), origHeight = this.getHeight(), scaledWidth = (cropping.width || this.getWidth()) * multiplier, scaledHeight = (cropping.height || this.getHeight()) * multiplier, zoom = this.getZoom(), newZoom = zoom * multiplier, vp = this.viewportTransform, translateX = (vp[4] - cropping.left) * multiplier, translateY = (vp[5] - cropping.top) * multiplier, newVp = [ newZoom, 0, 0, newZoom, translateX, translateY ], originalInteractive = this.interactive;
            this.viewportTransform = newVp;
            this.interactive && (this.interactive = false);
            if (origWidth !== scaledWidth || origHeight !== scaledHeight) {
                this.setDimensions({
                    width: scaledWidth,
                    height: scaledHeight
                });
            } else {
                this.renderAll();
            }
            var data = this.__toDataURL(format, quality, cropping);
            originalInteractive && (this.interactive = originalInteractive);
            this.viewportTransform = vp;
            this.setDimensions({
                width: origWidth,
                height: origHeight
            });
            return data;
        },
        __toDataURL: function(format, quality) {
            var canvasEl = this.contextContainer.canvas;
            if (format === "jpg") {
                format = "jpeg";
            }
            var data = supportQuality ? canvasEl.toDataURL("image/" + format, quality) : canvasEl.toDataURL("image/" + format);
            return data;
        },
        toDataURLWithMultiplier: function(format, multiplier, quality) {
            return this.toDataURL({
                format: format,
                multiplier: multiplier,
                quality: quality
            });
        }
    });
})();

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function(json, callback, reviver) {
        return this.loadFromJSON(json, callback, reviver);
    },
    loadFromJSON: function(json, callback, reviver) {
        if (!json) {
            return;
        }
        var serialized = typeof json === "string" ? JSON.parse(json) : fabric.util.object.clone(json);
        this.clear();
        var _this = this;
        this._enlivenObjects(serialized.objects, function() {
            _this._setBgOverlay(serialized, function() {
                delete serialized.objects;
                delete serialized.backgroundImage;
                delete serialized.overlayImage;
                delete serialized.background;
                delete serialized.overlay;
                for (var prop in serialized) {
                    _this[prop] = serialized[prop];
                }
                callback && callback();
            });
        }, reviver);
        return this;
    },
    _setBgOverlay: function(serialized, callback) {
        var _this = this, loaded = {
            backgroundColor: false,
            overlayColor: false,
            backgroundImage: false,
            overlayImage: false
        };
        if (!serialized.backgroundImage && !serialized.overlayImage && !serialized.background && !serialized.overlay) {
            callback && callback();
            return;
        }
        var cbIfLoaded = function() {
            if (loaded.backgroundImage && loaded.overlayImage && loaded.backgroundColor && loaded.overlayColor) {
                _this.renderAll();
                callback && callback();
            }
        };
        this.__setBgOverlay("backgroundImage", serialized.backgroundImage, loaded, cbIfLoaded);
        this.__setBgOverlay("overlayImage", serialized.overlayImage, loaded, cbIfLoaded);
        this.__setBgOverlay("backgroundColor", serialized.background, loaded, cbIfLoaded);
        this.__setBgOverlay("overlayColor", serialized.overlay, loaded, cbIfLoaded);
        cbIfLoaded();
    },
    __setBgOverlay: function(property, value, loaded, callback) {
        var _this = this;
        if (!value) {
            loaded[property] = true;
            return;
        }
        if (property === "backgroundImage" || property === "overlayImage") {
            fabric.Image.fromObject(value, function(img) {
                _this[property] = img;
                loaded[property] = true;
                callback && callback();
            });
        } else {
            this["set" + fabric.util.string.capitalize(property, true)](value, function() {
                loaded[property] = true;
                callback && callback();
            });
        }
    },
    _enlivenObjects: function(objects, callback, reviver) {
        var _this = this;
        if (!objects || objects.length === 0) {
            callback && callback();
            return;
        }
        var renderOnAddRemove = this.renderOnAddRemove;
        this.renderOnAddRemove = false;
        fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
            enlivenedObjects.forEach(function(obj, index) {
                _this.insertAt(obj, index);
            });
            _this.renderOnAddRemove = renderOnAddRemove;
            callback && callback();
        }, null, reviver);
    },
    _toDataURL: function(format, callback) {
        this.clone(function(clone) {
            callback(clone.toDataURL(format));
        });
    },
    _toDataURLWithMultiplier: function(format, multiplier, callback) {
        this.clone(function(clone) {
            callback(clone.toDataURLWithMultiplier(format, multiplier));
        });
    },
    clone: function(callback, properties) {
        var data = JSON.stringify(this.toJSON(properties));
        this.cloneWithoutData(function(clone) {
            clone.loadFromJSON(data, function() {
                callback && callback(clone);
            });
        });
    },
    cloneWithoutData: function(callback) {
        var el = fabric.document.createElement("canvas");
        el.width = this.getWidth();
        el.height = this.getHeight();
        var clone = new fabric.Canvas(el);
        clone.clipTo = this.clipTo;
        if (this.backgroundImage) {
            clone.setBackgroundImage(this.backgroundImage.src, function() {
                clone.renderAll();
                callback && callback(clone);
            });
            clone.backgroundImageOpacity = this.backgroundImageOpacity;
            clone.backgroundImageStretch = this.backgroundImageStretch;
        } else {
            callback && callback(clone);
        }
    }
});

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, toFixed = fabric.util.toFixed, capitalize = fabric.util.string.capitalize, degreesToRadians = fabric.util.degreesToRadians, supportsLineDash = fabric.StaticCanvas.supports("setLineDash");
    if (fabric.Object) {
        return;
    }
    fabric.Object = fabric.util.createClass({
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
        minScaleLimit: .01,
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
        stateProperties: ("top left width height scaleX scaleY flipX flipY originX originY transformMatrix " + "stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit " + "angle opacity fill fillRule globalCompositeOperation shadow clipTo visible backgroundColor " + "skewX skewY").split(" "),
        initialize: function(options) {
            if (options) {
                this.setOptions(options);
            }
        },
        _initGradient: function(options) {
            if (options.fill && options.fill.colorStops && !(options.fill instanceof fabric.Gradient)) {
                this.set("fill", new fabric.Gradient(options.fill));
            }
            if (options.stroke && options.stroke.colorStops && !(options.stroke instanceof fabric.Gradient)) {
                this.set("stroke", new fabric.Gradient(options.stroke));
            }
        },
        _initPattern: function(options) {
            if (options.fill && options.fill.source && !(options.fill instanceof fabric.Pattern)) {
                this.set("fill", new fabric.Pattern(options.fill));
            }
            if (options.stroke && options.stroke.source && !(options.stroke instanceof fabric.Pattern)) {
                this.set("stroke", new fabric.Pattern(options.stroke));
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
        setOptions: function(options) {
            for (var prop in options) {
                this.set(prop, options[prop]);
            }
            this._initGradient(options);
            this._initPattern(options);
            this._initClipping(options);
        },
        transform: function(ctx, fromLeft) {
            if (this.group && !this.group._transformDone && this.group === this.canvas._activeGroup) {
                this.group.transform(ctx);
            }
            var center = fromLeft ? this._getLeftTopCoords() : this.getCenterPoint();
            ctx.translate(center.x, center.y);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
            ctx.transform(1, 0, Math.tan(degreesToRadians(this.skewX)), 1, 0, 0);
            ctx.transform(1, Math.tan(degreesToRadians(this.skewY)), 0, 1, 0, 0);
        },
        toObject: function(propertiesToInclude) {
            var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, object = {
                type: this.type,
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
                angle: toFixed(this.getAngle(), NUM_FRACTION_DIGITS),
                flipX: this.flipX,
                flipY: this.flipY,
                opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
                shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                visible: this.visible,
                clipTo: this.clipTo && String(this.clipTo),
                backgroundColor: this.backgroundColor,
                fillRule: this.fillRule,
                globalCompositeOperation: this.globalCompositeOperation,
                transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : this.transformMatrix,
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
        get: function(property) {
            return this[property];
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
            var shouldConstrainValue = key === "scaleX" || key === "scaleY";
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
            }
            this[key] = value;
            if (key === "width" || key === "height") {
                this.minScaleLimit = Math.min(.1, 1 / Math.max(this.width, this.height));
            }
            return this;
        },
        setOnGroup: function() {},
        toggle: function(property) {
            var value = this.get(property);
            if (typeof value === "boolean") {
                this.set(property, !value);
            }
            return this;
        },
        setSourcePath: function(value) {
            this.sourcePath = value;
            return this;
        },
        getViewportTransform: function() {
            if (this.canvas && this.canvas.viewportTransform) {
                return this.canvas.viewportTransform;
            }
            return [ 1, 0, 0, 1, 0, 0 ];
        },
        render: function(ctx, noTransform) {
            if (this.width === 0 && this.height === 0 || !this.visible) {
                return;
            }
            ctx.save();
            this._setupCompositeOperation(ctx);
            this.drawSelectionBackground(ctx);
            if (!noTransform) {
                this.transform(ctx);
            }
            this._setOpacity(ctx);
            this._setShadow(ctx);
            this._renderBackground(ctx);
            this._setStrokeStyles(ctx);
            this._setFillStyles(ctx);
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this.clipTo && fabric.util.clipContext(this, ctx);
            this._render(ctx, noTransform);
            this.clipTo && ctx.restore();
            ctx.restore();
        },
        _renderBackground: function(ctx) {
            if (!this.backgroundColor) {
                return;
            }
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            this._removeShadow(ctx);
        },
        _setOpacity: function(ctx) {
            if (this.group) {
                this.group._setOpacity(ctx);
            }
            ctx.globalAlpha *= this.opacity;
        },
        _setStrokeStyles: function(ctx) {
            if (this.stroke) {
                ctx.lineWidth = this.strokeWidth;
                ctx.lineCap = this.strokeLineCap;
                ctx.lineJoin = this.strokeLineJoin;
                ctx.miterLimit = this.strokeMiterLimit;
                ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx, this) : this.stroke;
            }
        },
        _setFillStyles: function(ctx) {
            if (this.fill) {
                ctx.fillStyle = this.fill.toLive ? this.fill.toLive(ctx, this) : this.fill;
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
        _renderControls: function(ctx, noTransform) {
            if (!this.active || noTransform || this.group && this.group !== this.canvas.getActiveGroup()) {
                return;
            }
            var vpt = this.getViewportTransform(), matrix = this.calcTransformMatrix(), options;
            matrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
            options = fabric.util.qrDecompose(matrix);
            ctx.save();
            ctx.translate(options.translateX, options.translateY);
            ctx.lineWidth = 1 * this.borderScaleFactor;
            ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            if (this.group && this.group === this.canvas.getActiveGroup()) {
                ctx.rotate(degreesToRadians(options.angle));
                this.drawBordersInGroup(ctx, options);
            } else {
                ctx.rotate(degreesToRadians(this.angle));
                this.drawBorders(ctx);
            }
            this.drawControls(ctx);
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
            ctx.shadowBlur = this.shadow.blur * (multX + multY) * (scaling.scaleX + scaling.scaleY) / 4;
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
        _renderFill: function(ctx) {
            if (!this.fill) {
                return;
            }
            ctx.save();
            if (this.fill.gradientTransform) {
                var g = this.fill.gradientTransform;
                ctx.transform.apply(ctx, g);
            }
            if (this.fill.toLive) {
                ctx.translate(-this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0);
            }
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
            if (this.stroke.gradientTransform) {
                var g = this.stroke.gradientTransform;
                ctx.transform.apply(ctx, g);
            }
            if (this.stroke.toLive) {
                ctx.translate(-this.width / 2 + this.stroke.offsetX || 0, -this.height / 2 + this.stroke.offsetY || 0);
            }
            ctx.stroke();
            ctx.restore();
        },
        clone: function(callback, propertiesToInclude) {
            if (this.constructor.fromObject) {
                return this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
            }
            return new fabric.Object(this.toObject(propertiesToInclude));
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
                enableRetinaScaling: options.enableRetinaScaling
            });
            if (options.format === "jpg") {
                options.format = "jpeg";
            }
            if (options.format === "jpeg") {
                canvas.backgroundColor = "#fff";
            }
            var origParams = {
                active: this.get("active"),
                left: this.getLeft(),
                top: this.getTop()
            };
            this.set("active", false);
            this.setPositionByOrigin(new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), "center", "center");
            var originalCanvas = this.canvas;
            canvas.add(this);
            var data = canvas.toDataURL(options);
            this.set(origParams).setCoords();
            this.canvas = originalCanvas;
            canvas.dispose();
            canvas = null;
            return data;
        },
        isType: function(type) {
            return this.type === type;
        },
        complexity: function() {
            return 0;
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
            options.gradientTransform && (gradient.gradientTransform = options.gradientTransform);
            for (var position in options.colorStops) {
                var color = new fabric.Color(options.colorStops[position]);
                gradient.colorStops.push({
                    offset: position,
                    color: color.toRgb(),
                    opacity: color.getAlpha()
                });
            }
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
        setAngle: function(angle) {
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
        remove: function() {
            this.canvas && this.canvas.remove(this);
            return this;
        },
        getLocalPointer: function(e, pointer) {
            pointer = pointer || this.canvas.getPointer(e);
            var pClicked = new fabric.Point(pointer.x, pointer.y), objectLeftTop = this._getLeftTopCoords();
            if (this.angle) {
                pClicked = fabric.util.rotatePoint(pClicked, objectLeftTop, fabric.util.degreesToRadians(-this.angle));
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
    fabric.util.createAccessors(fabric.Object);
    fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;
    extend(fabric.Object.prototype, fabric.Observable);
    fabric.Object.NUM_FRACTION_DIGITS = 2;
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
            var angle = degreesToRadians(this.angle), hypotFull = this.getWidth(), xFull = Math.cos(angle) * hypotFull, yFull = Math.sin(angle) * hypotFull, offsetFrom, offsetTo;
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
        }
    });
})();

(function() {
    function getCoords(oCoords) {
        return [ new fabric.Point(oCoords.tl.x, oCoords.tl.y), new fabric.Point(oCoords.tr.x, oCoords.tr.y), new fabric.Point(oCoords.br.x, oCoords.br.y), new fabric.Point(oCoords.bl.x, oCoords.bl.y) ];
    }
    var degreesToRadians = fabric.util.degreesToRadians, multiplyMatrices = fabric.util.multiplyTransformMatrices;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null,
        intersectsWithRect: function(pointTL, pointBR) {
            var oCoords = getCoords(this.oCoords), intersection = fabric.Intersection.intersectPolygonRectangle(oCoords, pointTL, pointBR);
            return intersection.status === "Intersection";
        },
        intersectsWithObject: function(other) {
            var intersection = fabric.Intersection.intersectPolygonPolygon(getCoords(this.oCoords), getCoords(other.oCoords));
            return intersection.status === "Intersection" || other.isContainedWithinObject(this) || this.isContainedWithinObject(other);
        },
        isContainedWithinObject: function(other) {
            var points = getCoords(this.oCoords), i = 0;
            for (;i < 4; i++) {
                if (!other.containsPoint(points[i])) {
                    return false;
                }
            }
            return true;
        },
        isContainedWithinRect: function(pointTL, pointBR) {
            var boundingRect = this.getBoundingRect();
            return boundingRect.left >= pointTL.x && boundingRect.left + boundingRect.width <= pointBR.x && boundingRect.top >= pointTL.y && boundingRect.top + boundingRect.height <= pointBR.y;
        },
        containsPoint: function(point) {
            if (!this.oCoords) {
                this.setCoords();
            }
            var lines = this._getImageLines(this.oCoords), xPoints = this._findCrossPoints(point, lines);
            return xPoints !== 0 && xPoints % 2 === 1;
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
        _findCrossPoints: function(point, oCoords) {
            var b1, b2, a1, a2, xi, xcount = 0, iLine;
            for (var lineKey in oCoords) {
                iLine = oCoords[lineKey];
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
        getBoundingRectWidth: function() {
            return this.getBoundingRect().width;
        },
        getBoundingRectHeight: function() {
            return this.getBoundingRect().height;
        },
        getBoundingRect: function() {
            this.oCoords || this.setCoords();
            return fabric.util.makeBoundingBoxFromPoints([ this.oCoords.tl, this.oCoords.tr, this.oCoords.br, this.oCoords.bl ]);
        },
        getWidth: function() {
            return this._getTransformedDimensions().x;
        },
        getHeight: function() {
            return this._getTransformedDimensions().y;
        },
        _constrainScale: function(value) {
            if (Math.abs(value) < this.minScaleLimit) {
                if (value < 0) {
                    return -this.minScaleLimit;
                } else {
                    return this.minScaleLimit;
                }
            }
            return value;
        },
        scale: function(value) {
            value = this._constrainScale(value);
            if (value < 0) {
                this.flipX = !this.flipX;
                this.flipY = !this.flipY;
                value *= -1;
            }
            this.scaleX = value;
            this.scaleY = value;
            this.setCoords();
            return this;
        },
        scaleToWidth: function(value) {
            var boundingRectFactor = this.getBoundingRect().width / this.getWidth();
            return this.scale(value / this.width / boundingRectFactor);
        },
        scaleToHeight: function(value) {
            var boundingRectFactor = this.getBoundingRect().height / this.getHeight();
            return this.scale(value / this.height / boundingRectFactor);
        },
        setCoords: function() {
            var theta = degreesToRadians(this.angle), vpt = this.getViewportTransform(), dim = this._calculateCurrentDimensions(), currentWidth = dim.x, currentHeight = dim.y;
            if (currentWidth < 0) {
                currentWidth = Math.abs(currentWidth);
            }
            var sinTh = Math.sin(theta), cosTh = Math.cos(theta), _angle = currentWidth > 0 ? Math.atan(currentHeight / currentWidth) : 0, _hypotenuse = currentWidth / Math.cos(_angle) / 2, offsetX = Math.cos(_angle + theta) * _hypotenuse, offsetY = Math.sin(_angle + theta) * _hypotenuse, coords = fabric.util.transformPoint(this.getCenterPoint(), vpt), tl = new fabric.Point(coords.x - offsetX, coords.y - offsetY), tr = new fabric.Point(tl.x + currentWidth * cosTh, tl.y + currentWidth * sinTh), bl = new fabric.Point(tl.x - currentHeight * sinTh, tl.y + currentHeight * cosTh), br = new fabric.Point(coords.x + offsetX, coords.y + offsetY), ml = new fabric.Point((tl.x + bl.x) / 2, (tl.y + bl.y) / 2), mt = new fabric.Point((tr.x + tl.x) / 2, (tr.y + tl.y) / 2), mr = new fabric.Point((br.x + tr.x) / 2, (br.y + tr.y) / 2), mb = new fabric.Point((br.x + bl.x) / 2, (br.y + bl.y) / 2), mtr = new fabric.Point(mt.x + sinTh * this.rotatingPointOffset, mt.y - cosTh * this.rotatingPointOffset);
            this.oCoords = {
                tl: tl,
                tr: tr,
                br: br,
                bl: bl,
                ml: ml,
                mt: mt,
                mr: mr,
                mb: mb,
                mtr: mtr
            };
            this._setCornerCoords && this._setCornerCoords();
            return this;
        },
        _calcRotateMatrix: function() {
            if (this.angle) {
                var theta = degreesToRadians(this.angle), cos = Math.cos(theta), sin = Math.sin(theta);
                return [ cos, sin, -sin, cos, 0, 0 ];
            }
            return [ 1, 0, 0, 1, 0, 0 ];
        },
        calcTransformMatrix: function() {
            var center = this.getCenterPoint(), translateMatrix = [ 1, 0, 0, 1, center.x, center.y ], rotateMatrix = this._calcRotateMatrix(), dimensionMatrix = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, true), matrix = this.group ? this.group.calcTransformMatrix() : [ 1, 0, 0, 1, 0, 0 ];
            matrix = multiplyMatrices(matrix, translateMatrix);
            matrix = multiplyMatrices(matrix, rotateMatrix);
            matrix = multiplyMatrices(matrix, dimensionMatrix);
            return matrix;
        },
        _calcDimensionsTransformMatrix: function(skewX, skewY, flipping) {
            var skewMatrixX = [ 1, 0, Math.tan(degreesToRadians(skewX)), 1 ], skewMatrixY = [ 1, Math.tan(degreesToRadians(skewY)), 0, 1 ], scaleX = this.scaleX * (flipping && this.flipX ? -1 : 1), scaleY = this.scaleY * (flipping && this.flipY ? -1 : 1), scaleMatrix = [ scaleX, 0, 0, scaleY ], m = multiplyMatrices(scaleMatrix, skewMatrixX, true);
            return multiplyMatrices(m, skewMatrixY, true);
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
        if (this.group) {
            fabric.StaticCanvas.prototype.moveTo.call(this.group, this, index);
        } else {
            this.canvas.moveTo(this, index);
        }
        return this;
    }
});

(function() {
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
    fabric.util.object.extend(fabric.Object.prototype, {
        getSvgStyles: function(skipShadow) {
            var fillRule = this.fillRule, strokeWidth = this.strokeWidth ? this.strokeWidth : "0", strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none", strokeLineCap = this.strokeLineCap ? this.strokeLineCap : "butt", strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : "miter", strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : "4", opacity = typeof this.opacity !== "undefined" ? this.opacity : "1", visibility = this.visible ? "" : " visibility: hidden;", filter = skipShadow ? "" : this.getSvgFilter(), fill = getSvgColorString("fill", this.fill), stroke = getSvgColorString("stroke", this.stroke);
            return [ stroke, "stroke-width: ", strokeWidth, "; ", "stroke-dasharray: ", strokeDashArray, "; ", "stroke-linecap: ", strokeLineCap, "; ", "stroke-linejoin: ", strokeLineJoin, "; ", "stroke-miterlimit: ", strokeMiterLimit, "; ", fill, "fill-rule: ", fillRule, "; ", "opacity: ", opacity, ";", filter, visibility ].join("");
        },
        getSvgFilter: function() {
            return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : "";
        },
        getSvgId: function() {
            return this.id ? 'id="' + this.id + '" ' : "";
        },
        getSvgTransform: function() {
            if (this.group && this.group.type === "path-group") {
                return "";
            }
            var toFixed = fabric.util.toFixed, angle = this.getAngle(), skewX = this.getSkewX() % 360, skewY = this.getSkewY() % 360, center = this.getCenterPoint(), NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, translatePart = this.type === "path-group" ? "" : "translate(" + toFixed(center.x, NUM_FRACTION_DIGITS) + " " + toFixed(center.y, NUM_FRACTION_DIGITS) + ")", anglePart = angle !== 0 ? " rotate(" + toFixed(angle, NUM_FRACTION_DIGITS) + ")" : "", scalePart = this.scaleX === 1 && this.scaleY === 1 ? "" : " scale(" + toFixed(this.scaleX, NUM_FRACTION_DIGITS) + " " + toFixed(this.scaleY, NUM_FRACTION_DIGITS) + ")", skewXPart = skewX !== 0 ? " skewX(" + toFixed(skewX, NUM_FRACTION_DIGITS) + ")" : "", skewYPart = skewY !== 0 ? " skewY(" + toFixed(skewY, NUM_FRACTION_DIGITS) + ")" : "", addTranslateX = this.type === "path-group" ? this.width : 0, flipXPart = this.flipX ? " matrix(-1 0 0 1 " + addTranslateX + " 0) " : "", addTranslateY = this.type === "path-group" ? this.height : 0, flipYPart = this.flipY ? " matrix(1 0 0 -1 0 " + addTranslateY + ")" : "";
            return [ translatePart, anglePart, scalePart, flipXPart, flipYPart, skewXPart, skewYPart ].join("");
        },
        getSvgTransformMatrix: function() {
            return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : "";
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
        }
    });
})();

(function() {
    var extend = fabric.util.object.extend;
    function saveProps(origin, destination, props) {
        var tmpObj = {}, deep = true;
        props.forEach(function(prop) {
            tmpObj[prop] = origin[prop];
        });
        extend(origin[destination], tmpObj, deep);
    }
    function _isEqual(origValue, currentValue) {
        if (!fabric.isLikelyNode && origValue instanceof Element) {
            return origValue === currentValue;
        } else if (origValue instanceof Array) {
            if (origValue.length !== currentValue.length) {
                return false;
            }
            var _currentValue = currentValue.concat().sort(), _origValue = origValue.concat().sort();
            return !_origValue.some(function(v, i) {
                return !_isEqual(_currentValue[i], v);
            });
        } else if (origValue instanceof Object) {
            for (var key in origValue) {
                if (!_isEqual(origValue[key], currentValue[key])) {
                    return false;
                }
            }
            return true;
        } else {
            return origValue === currentValue;
        }
    }
    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function() {
            return !_isEqual(this.originalState, this);
        },
        saveState: function(options) {
            saveProps(this, "originalState", this.stateProperties);
            if (options && options.stateProperties) {
                saveProps(this, "originalState", options.stateProperties);
            }
            return this;
        },
        setupState: function(options) {
            this.originalState = {};
            this.saveState(options);
            return this;
        }
    });
})();

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, isVML = function() {
        return typeof G_vmlCanvasManager !== "undefined";
    };
    fabric.util.object.extend(fabric.Object.prototype, {
        _controlsVisibility: null,
        _findTargetCorner: function(pointer) {
            if (!this.hasControls || !this.active) {
                return false;
            }
            var ex = pointer.x, ey = pointer.y, xPoints, lines;
            this.__corner = 0;
            for (var i in this.oCoords) {
                if (!this.isControlVisible(i)) {
                    continue;
                }
                if (i === "mtr" && !this.hasRotatingPoint) {
                    continue;
                }
                if (this.get("lockUniScaling") && (i === "mt" || i === "mr" || i === "mb" || i === "ml")) {
                    continue;
                }
                lines = this._getImageLines(this.oCoords[i].corner);
                xPoints = this._findCrossPoints({
                    x: ex,
                    y: ey
                }, lines);
                if (xPoints !== 0 && xPoints % 2 === 1) {
                    this.__corner = i;
                    return i;
                }
            }
            return false;
        },
        _setCornerCoords: function() {
            var coords = this.oCoords, newTheta = degreesToRadians(45 - this.angle), cornerHypotenuse = this.cornerSize * .707106, cosHalfOffset = cornerHypotenuse * Math.cos(newTheta), sinHalfOffset = cornerHypotenuse * Math.sin(newTheta), x, y;
            for (var point in coords) {
                x = coords[point].x;
                y = coords[point].y;
                coords[point].corner = {
                    tl: {
                        x: x - sinHalfOffset,
                        y: y - cosHalfOffset
                    },
                    tr: {
                        x: x + cosHalfOffset,
                        y: y - sinHalfOffset
                    },
                    bl: {
                        x: x - cosHalfOffset,
                        y: y + sinHalfOffset
                    },
                    br: {
                        x: x + sinHalfOffset,
                        y: y + cosHalfOffset
                    }
                };
            }
        },
        _getNonTransformedDimensions: function() {
            var strokeWidth = this.strokeWidth, w = this.width, h = this.height, addStrokeToW = true, addStrokeToH = true;
            if (this.type === "line" && this.strokeLineCap === "butt") {
                addStrokeToH = w;
                addStrokeToW = h;
            }
            if (addStrokeToH) {
                h += h < 0 ? -strokeWidth : strokeWidth;
            }
            if (addStrokeToW) {
                w += w < 0 ? -strokeWidth : strokeWidth;
            }
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
            var vpt = this.getViewportTransform(), dim = this._getTransformedDimensions(), w = dim.x, h = dim.y, p = fabric.util.transformPoint(new fabric.Point(w, h), vpt, true);
            return p.scalarAdd(2 * this.padding);
        },
        drawSelectionBackground: function(ctx) {
            if (!this.selectionBackgroundColor || this.group || !this.active) {
                return this;
            }
            ctx.save();
            var center = this.getCenterPoint(), wh = this._calculateCurrentDimensions(), vpt = this.canvas.viewportTransform;
            ctx.translate(center.x, center.y);
            ctx.scale(1 / vpt[0], 1 / vpt[3]);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.fillStyle = this.selectionBackgroundColor;
            ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
            ctx.restore();
            return this;
        },
        drawBorders: function(ctx) {
            if (!this.hasBorders) {
                return this;
            }
            var wh = this._calculateCurrentDimensions(), strokeWidth = 1 / this.borderScaleFactor, width = wh.x + strokeWidth, height = wh.y + strokeWidth;
            ctx.save();
            ctx.strokeStyle = this.borderColor;
            this._setLineDash(ctx, this.borderDashArray, null);
            ctx.strokeRect(-width / 2, -height / 2, width, height);
            if (this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls) {
                var rotateHeight = -height / 2;
                ctx.beginPath();
                ctx.moveTo(0, rotateHeight);
                ctx.lineTo(0, rotateHeight - this.rotatingPointOffset);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
            return this;
        },
        drawBordersInGroup: function(ctx, options) {
            if (!this.hasBorders) {
                return this;
            }
            var p = this._getNonTransformedDimensions(), matrix = fabric.util.customTransformMatrix(options.scaleX, options.scaleY, options.skewX), wh = fabric.util.transformPoint(p, matrix), strokeWidth = 1 / this.borderScaleFactor, width = wh.x + strokeWidth + 2 * this.padding, height = wh.y + strokeWidth + 2 * this.padding;
            ctx.save();
            this._setLineDash(ctx, this.borderDashArray, null);
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(-width / 2, -height / 2, width, height);
            ctx.restore();
            return this;
        },
        drawControls: function(ctx) {
            if (!this.hasControls) {
                return this;
            }
            var wh = this._calculateCurrentDimensions(), width = wh.x, height = wh.y, scaleOffset = this.cornerSize, left = -(width + scaleOffset) / 2, top = -(height + scaleOffset) / 2, methodName = this.transparentCorners ? "stroke" : "fill";
            ctx.save();
            ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
            if (!this.transparentCorners) {
                ctx.strokeStyle = this.cornerStrokeColor;
            }
            this._setLineDash(ctx, this.cornerDashArray, null);
            this._drawControl("tl", ctx, methodName, left, top);
            this._drawControl("tr", ctx, methodName, left + width, top);
            this._drawControl("bl", ctx, methodName, left, top + height);
            this._drawControl("br", ctx, methodName, left + width, top + height);
            if (!this.get("lockUniScaling")) {
                this._drawControl("mt", ctx, methodName, left + width / 2, top);
                this._drawControl("mb", ctx, methodName, left + width / 2, top + height);
                this._drawControl("mr", ctx, methodName, left + width, top + height / 2);
                this._drawControl("ml", ctx, methodName, left, top + height / 2);
            }
            if (this.hasRotatingPoint) {
                this._drawControl("mtr", ctx, methodName, left + width / 2, top - this.rotatingPointOffset);
            }
            ctx.restore();
            return this;
        },
        _drawControl: function(control, ctx, methodName, left, top) {
            if (!this.isControlVisible(control)) {
                return;
            }
            var size = this.cornerSize, stroke = !this.transparentCorners && this.cornerStrokeColor;
            switch (this.cornerStyle) {
              case "circle":
                ctx.beginPath();
                ctx.arc(left + size / 2, top + size / 2, size / 2, 0, 2 * Math.PI, false);
                ctx[methodName]();
                if (stroke) {
                    ctx.stroke();
                }
                break;

              default:
                isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);
                ctx[methodName + "Rect"](left, top, size, size);
                if (stroke) {
                    ctx.strokeRect(left, top, size, size);
                }
            }
        },
        isControlVisible: function(controlName) {
            return this._getControlsVisibility()[controlName];
        },
        setControlVisible: function(controlName, visible) {
            this._getControlsVisibility()[controlName] = visible;
            return this;
        },
        setControlsVisibility: function(options) {
            options || (options = {});
            for (var p in options) {
                this.setControlVisible(p, options[p]);
            }
            return this;
        },
        _getControlsVisibility: function() {
            if (!this._controlsVisibility) {
                this._controlsVisibility = {
                    tl: true,
                    tr: true,
                    br: true,
                    bl: true,
                    ml: true,
                    mt: true,
                    mr: true,
                    mb: true,
                    mtr: true
                };
            }
            return this._controlsVisibility;
        }
    });
})();

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 500,
    fxCenterObjectH: function(object, callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: object.get("left"),
            endValue: this.getCenter().left,
            duration: this.FX_DURATION,
            onChange: function(value) {
                object.set("left", value);
                _this.renderAll();
                onChange();
            },
            onComplete: function() {
                object.setCoords();
                onComplete();
            }
        });
        return this;
    },
    fxCenterObjectV: function(object, callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: object.get("top"),
            endValue: this.getCenter().top,
            duration: this.FX_DURATION,
            onChange: function(value) {
                object.set("top", value);
                _this.renderAll();
                onChange();
            },
            onComplete: function() {
                object.setCoords();
                onComplete();
            }
        });
        return this;
    },
    fxRemove: function(object, callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: object.get("opacity"),
            endValue: 0,
            duration: this.FX_DURATION,
            onStart: function() {
                object.set("active", false);
            },
            onChange: function(value) {
                object.set("opacity", value);
                _this.renderAll();
                onChange();
            },
            onComplete: function() {
                _this.remove(object);
                onComplete();
            }
        });
        return this;
    }
});

fabric.util.object.extend(fabric.Object.prototype, {
    animate: function() {
        if (arguments[0] && typeof arguments[0] === "object") {
            var propsToAnimate = [], prop, skipCallbacks;
            for (prop in arguments[0]) {
                propsToAnimate.push(prop);
            }
            for (var i = 0, len = propsToAnimate.length; i < len; i++) {
                prop = propsToAnimate[i];
                skipCallbacks = i !== len - 1;
                this._animate(prop, arguments[0][prop], arguments[1], skipCallbacks);
            }
        } else {
            this._animate.apply(this, arguments);
        }
        return this;
    },
    _animate: function(property, to, options, skipCallbacks) {
        var _this = this, propPair;
        to = to.toString();
        if (!options) {
            options = {};
        } else {
            options = fabric.util.object.clone(options);
        }
        if (~property.indexOf(".")) {
            propPair = property.split(".");
        }
        var currentValue = propPair ? this.get(propPair[0])[propPair[1]] : this.get(property);
        if (!("from" in options)) {
            options.from = currentValue;
        }
        if (~to.indexOf("=")) {
            to = currentValue + parseFloat(to.replace("=", ""));
        } else {
            to = parseFloat(to);
        }
        fabric.util.animate({
            startValue: options.from,
            endValue: to,
            byValue: options.by,
            easing: options.easing,
            duration: options.duration,
            abort: options.abort && function() {
                return options.abort.call(_this);
            },
            onChange: function(value) {
                if (propPair) {
                    _this[propPair[0]][propPair[1]] = value;
                } else {
                    _this.set(property, value);
                }
                if (skipCallbacks) {
                    return;
                }
                options.onChange && options.onChange();
            },
            onComplete: function() {
                if (skipCallbacks) {
                    return;
                }
                _this.setCoords();
                options.onComplete && options.onComplete();
            }
        });
    }
});

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, coordProps = {
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
        initialize: function(points, options) {
            options = options || {};
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
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            if (noTransform) {
                var cp = this.getCenterPoint();
                ctx.translate(cp.x - this.strokeWidth / 2, cp.y - this.strokeWidth / 2);
            }
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
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), this.calcLinePoints());
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
            var markup = this._createBaseSVGMarkup(), p = {
                x1: this.x1,
                x2: this.x2,
                y1: this.y1,
                y2: this.y2
            };
            if (!(this.group && this.group.type === "path-group")) {
                p = this.calcLinePoints();
            }
            markup.push("<line ", this.getSvgId(), 'x1="', p.x1, '" y1="', p.y1, '" x2="', p.x2, '" y2="', p.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Line.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" "));
    fabric.Line.fromElement = function(element, options) {
        var parsedAttributes = fabric.parseAttributes(element, fabric.Line.ATTRIBUTE_NAMES), points = [ parsedAttributes.x1 || 0, parsedAttributes.y1 || 0, parsedAttributes.x2 || 0, parsedAttributes.y2 || 0 ];
        return new fabric.Line(points, extend(parsedAttributes, options));
    };
    fabric.Line.fromObject = function(object, callback) {
        var points = [ object.x1, object.y1, object.x2, object.y2 ], line = new fabric.Line(points, object);
        callback && callback(line);
        return line;
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
    var fabric = global.fabric || (global.fabric = {}), pi = Math.PI, extend = fabric.util.object.extend;
    if (fabric.Circle) {
        fabric.warn("fabric.Circle is already defined.");
        return;
    }
    fabric.Circle = fabric.util.createClass(fabric.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: pi * 2,
        initialize: function(options) {
            options = options || {};
            this.callSuper("initialize", options);
            this.set("radius", options.radius || 0);
            this.startAngle = options.startAngle || this.startAngle;
            this.endAngle = options.endAngle || this.endAngle;
        },
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
                if (this.group && this.group.type === "path-group") {
                    x = this.left + this.radius;
                    y = this.top + this.radius;
                }
                markup.push("<circle ", this.getSvgId(), 'cx="' + x + '" cy="' + y + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
            } else {
                var startX = Math.cos(this.startAngle) * this.radius, startY = Math.sin(this.startAngle) * this.radius, endX = Math.cos(this.endAngle) * this.radius, endY = Math.sin(this.endAngle) * this.radius, largeFlag = angle > pi ? "1" : "0";
                markup.push('<path d="M ' + startX + " " + startY, " A " + this.radius + " " + this.radius, " 0 ", +largeFlag + " 1", " " + endX + " " + endY, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
            }
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            ctx.arc(noTransform ? this.left + this.radius : 0, noTransform ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, false);
            this._renderFill(ctx);
            this._renderStroke(ctx);
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
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Circle.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("cx cy r".split(" "));
    fabric.Circle.fromElement = function(element, options) {
        options || (options = {});
        var parsedAttributes = fabric.parseAttributes(element, fabric.Circle.ATTRIBUTE_NAMES);
        if (!isValidRadius(parsedAttributes)) {
            throw new Error("value of `r` attribute is required and can not be negative");
        }
        parsedAttributes.left = parsedAttributes.left || 0;
        parsedAttributes.top = parsedAttributes.top || 0;
        var obj = new fabric.Circle(extend(parsedAttributes, options));
        obj.left -= obj.radius;
        obj.top -= obj.radius;
        return obj;
    };
    function isValidRadius(attributes) {
        return "radius" in attributes && attributes.radius >= 0;
    }
    fabric.Circle.fromObject = function(object, callback) {
        var circle = new fabric.Circle(object);
        callback && callback(circle);
        return circle;
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
        initialize: function(options) {
            options = options || {};
            this.callSuper("initialize", options);
            this.set("width", options.width || 100).set("height", options.height || 100);
        },
        _render: function(ctx) {
            var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
            ctx.beginPath();
            ctx.moveTo(-widthBy2, heightBy2);
            ctx.lineTo(0, -heightBy2);
            ctx.lineTo(widthBy2, heightBy2);
            ctx.closePath();
            this._renderFill(ctx);
            this._renderStroke(ctx);
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
            markup.push("<polygon ", this.getSvgId(), 'points="', points, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Triangle.fromObject = function(object, callback) {
        var triangle = new fabric.Triangle(object);
        callback && callback(triangle);
        return triangle;
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), piBy2 = Math.PI * 2, extend = fabric.util.object.extend;
    if (fabric.Ellipse) {
        fabric.warn("fabric.Ellipse is already defined.");
        return;
    }
    fabric.Ellipse = fabric.util.createClass(fabric.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        initialize: function(options) {
            options = options || {};
            this.callSuper("initialize", options);
            this.set("rx", options.rx || 0);
            this.set("ry", options.ry || 0);
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
            var markup = this._createBaseSVGMarkup(), x = 0, y = 0;
            if (this.group && this.group.type === "path-group") {
                x = this.left + this.rx;
                y = this.top + this.ry;
            }
            markup.push("<ellipse ", this.getSvgId(), 'cx="', x, '" cy="', y, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            ctx.save();
            ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
            ctx.arc(noTransform ? this.left + this.rx : 0, noTransform ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, piBy2, false);
            ctx.restore();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Ellipse.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" "));
    fabric.Ellipse.fromElement = function(element, options) {
        options || (options = {});
        var parsedAttributes = fabric.parseAttributes(element, fabric.Ellipse.ATTRIBUTE_NAMES);
        parsedAttributes.left = parsedAttributes.left || 0;
        parsedAttributes.top = parsedAttributes.top || 0;
        var ellipse = new fabric.Ellipse(extend(parsedAttributes, options));
        ellipse.top -= ellipse.ry;
        ellipse.left -= ellipse.rx;
        return ellipse;
    };
    fabric.Ellipse.fromObject = function(object, callback) {
        var ellipse = new fabric.Ellipse(object);
        callback && callback(ellipse);
        return ellipse;
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    if (fabric.Rect) {
        fabric.warn("fabric.Rect is already defined");
        return;
    }
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("rx", "ry", "x", "y");
    fabric.Rect = fabric.util.createClass(fabric.Object, {
        stateProperties: stateProperties,
        type: "rect",
        rx: 0,
        ry: 0,
        strokeDashArray: null,
        initialize: function(options) {
            options = options || {};
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
        _render: function(ctx, noTransform) {
            if (this.width === 1 && this.height === 1) {
                ctx.fillRect(-.5, -.5, 1, 1);
                return;
            }
            var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0, ry = this.ry ? Math.min(this.ry, this.height / 2) : 0, w = this.width, h = this.height, x = noTransform ? this.left : -this.width / 2, y = noTransform ? this.top : -this.height / 2, isRounded = rx !== 0 || ry !== 0, k = 1 - .5522847498;
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
            this._renderFill(ctx);
            this._renderStroke(ctx);
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
            var markup = this._createBaseSVGMarkup(), x = this.left, y = this.top;
            if (!(this.group && this.group.type === "path-group")) {
                x = -this.width / 2;
                y = -this.height / 2;
            }
            markup.push("<rect ", this.getSvgId(), 'x="', x, '" y="', y, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Rect.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" "));
    fabric.Rect.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        options = options || {};
        var parsedAttributes = fabric.parseAttributes(element, fabric.Rect.ATTRIBUTE_NAMES);
        parsedAttributes.left = parsedAttributes.left || 0;
        parsedAttributes.top = parsedAttributes.top || 0;
        var rect = new fabric.Rect(extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes));
        rect.visible = rect.visible && rect.width > 0 && rect.height > 0;
        return rect;
    };
    fabric.Rect.fromObject = function(object, callback) {
        var rect = new fabric.Rect(object);
        callback && callback(rect);
        return rect;
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Polyline) {
        fabric.warn("fabric.Polyline is already defined");
        return;
    }
    fabric.Polyline = fabric.util.createClass(fabric.Object, {
        type: "polyline",
        points: null,
        minX: 0,
        minY: 0,
        initialize: function(points, options) {
            return fabric.Polygon.prototype.initialize.call(this, points, options);
        },
        _calcDimensions: function() {
            return fabric.Polygon.prototype._calcDimensions.call(this);
        },
        toObject: function(propertiesToInclude) {
            return fabric.Polygon.prototype.toObject.call(this, propertiesToInclude);
        },
        toSVG: function(reviver) {
            return fabric.Polygon.prototype.toSVG.call(this, reviver);
        },
        _render: function(ctx, noTransform) {
            if (!fabric.Polygon.prototype.commonRender.call(this, ctx, noTransform)) {
                return;
            }
            this._renderFill(ctx);
            this._renderStroke(ctx);
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
    fabric.Polyline.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();
    fabric.Polyline.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        options || (options = {});
        var points = fabric.parsePointsAttribute(element.getAttribute("points")), parsedAttributes = fabric.parseAttributes(element, fabric.Polyline.ATTRIBUTE_NAMES);
        return new fabric.Polyline(points, fabric.util.object.extend(parsedAttributes, options));
    };
    fabric.Polyline.fromObject = function(object, callback) {
        var polyline = new fabric.Polyline(object.points, object);
        callback && callback(polyline);
        return polyline;
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max, toFixed = fabric.util.toFixed;
    if (fabric.Polygon) {
        fabric.warn("fabric.Polygon is already defined");
        return;
    }
    fabric.Polygon = fabric.util.createClass(fabric.Object, {
        type: "polygon",
        points: null,
        minX: 0,
        minY: 0,
        initialize: function(points, options) {
            options = options || {};
            this.points = points || [];
            this.callSuper("initialize", options);
            this._calcDimensions();
            if (!("top" in options)) {
                this.top = this.minY;
            }
            if (!("left" in options)) {
                this.left = this.minX;
            }
            this.pathOffset = {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            };
        },
        _calcDimensions: function() {
            var points = this.points, minX = min(points, "x"), minY = min(points, "y"), maxX = max(points, "x"), maxY = max(points, "y");
            this.width = maxX - minX || 0;
            this.height = maxY - minY || 0;
            this.minX = minX || 0;
            this.minY = minY || 0;
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                points: this.points.concat()
            });
        },
        toSVG: function(reviver) {
            var points = [], addTransform, markup = this._createBaseSVGMarkup();
            for (var i = 0, len = this.points.length; i < len; i++) {
                points.push(toFixed(this.points[i].x, 2), ",", toFixed(this.points[i].y, 2), " ");
            }
            if (!(this.group && this.group.type === "path-group")) {
                addTransform = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") ";
            }
            markup.push("<", this.type, " ", this.getSvgId(), 'points="', points.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), addTransform, " ", this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx, noTransform) {
            if (!this.commonRender(ctx, noTransform)) {
                return;
            }
            this._renderFill(ctx);
            if (this.stroke || this.strokeDashArray) {
                ctx.closePath();
                this._renderStroke(ctx);
            }
        },
        commonRender: function(ctx, noTransform) {
            var point, len = this.points.length;
            if (!len || isNaN(this.points[len - 1].y)) {
                return false;
            }
            noTransform || ctx.translate(-this.pathOffset.x, -this.pathOffset.y);
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 0; i < len; i++) {
                point = this.points[i];
                ctx.lineTo(point.x, point.y);
            }
            return true;
        },
        _renderDashedStroke: function(ctx) {
            fabric.Polyline.prototype._renderDashedStroke.call(this, ctx);
            ctx.closePath();
        },
        complexity: function() {
            return this.points.length;
        }
    });
    fabric.Polygon.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();
    fabric.Polygon.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        options || (options = {});
        var points = fabric.parsePointsAttribute(element.getAttribute("points")), parsedAttributes = fabric.parseAttributes(element, fabric.Polygon.ATTRIBUTE_NAMES);
        return new fabric.Polygon(points, extend(parsedAttributes, options));
    };
    fabric.Polygon.fromObject = function(object, callback) {
        var polygon = new fabric.Polygon(object.points, object);
        callback && callback(polygon);
        return polygon;
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
        minX: 0,
        minY: 0,
        initialize: function(path, options) {
            options = options || {};
            this.setOptions(options);
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
            if (options.sourcePath) {
                this.setSourcePath(options.sourcePath);
            }
        },
        _setPositionDimensions: function(options) {
            var calcDim = this._parseDimensions();
            this.minX = calcDim.left;
            this.minY = calcDim.top;
            this.width = calcDim.width;
            this.height = calcDim.height;
            if (typeof options.left === "undefined") {
                this.left = calcDim.left + (this.originX === "center" ? this.width / 2 : this.originX === "right" ? this.width : 0);
            }
            if (typeof options.top === "undefined") {
                this.top = calcDim.top + (this.originY === "center" ? this.height / 2 : this.originY === "bottom" ? this.height : 0);
            }
            this.pathOffset = this.pathOffset || {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            };
        },
        _renderPathCommands: function(ctx) {
            var current, previous = null, subpathStartX = 0, subpathStartY = 0, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, l = -this.pathOffset.x, t = -this.pathOffset.y;
            if (this.group && this.group.type === "path-group") {
                l = 0;
                t = 0;
            }
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
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        toString: function() {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>";
        },
        toObject: function(propertiesToInclude) {
            var o = extend(this.callSuper("toObject", [ "sourcePath", "pathOffset" ].concat(propertiesToInclude)), {
                path: this.path.map(function(item) {
                    return item.slice();
                })
            });
            return o;
        },
        toDatalessObject: function(propertiesToInclude) {
            var o = this.toObject(propertiesToInclude);
            if (this.sourcePath) {
                o.path = this.sourcePath;
            }
            delete o.sourcePath;
            return o;
        },
        toSVG: function(reviver) {
            var chunks = [], markup = this._createBaseSVGMarkup(), addTransform = "";
            for (var i = 0, len = this.path.length; i < len; i++) {
                chunks.push(this.path[i].join(" "));
            }
            var path = chunks.join(" ");
            if (!(this.group && this.group.type === "path-group")) {
                addTransform = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") ";
            }
            markup.push("<path ", this.getSvgId(), 'd="', path, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), addTransform, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n");
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
                    x = current[5];
                    y = current[6];
                    controlX = current[3];
                    controlY = current[4];
                    bounds = fabric.util.getBoundsOfCurve(x, y, current[1], current[2], controlX, controlY, x, y);
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
        var path;
        if (typeof object.path === "string") {
            fabric.loadSVGFromURL(object.path, function(elements) {
                var pathUrl = object.path;
                path = elements[0];
                delete object.path;
                fabric.util.object.extend(path, object);
                path.setSourcePath(pathUrl);
                callback && callback(path);
            });
        } else {
            path = new fabric.Path(object.path, object);
            callback && callback(path);
            return path;
        }
    };
    fabric.Path.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat([ "d" ]);
    fabric.Path.fromElement = function(element, callback, options) {
        var parsedAttributes = fabric.parseAttributes(element, fabric.Path.ATTRIBUTE_NAMES);
        callback && callback(new fabric.Path(parsedAttributes.d, extend(parsedAttributes, options)));
    };
    fabric.Path.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, invoke = fabric.util.array.invoke, parentToObject = fabric.Object.prototype.toObject;
    if (fabric.PathGroup) {
        fabric.warn("fabric.PathGroup is already defined");
        return;
    }
    fabric.PathGroup = fabric.util.createClass(fabric.Path, {
        type: "path-group",
        fill: "",
        initialize: function(paths, options) {
            options = options || {};
            this.paths = paths || [];
            for (var i = this.paths.length; i--; ) {
                this.paths[i].group = this;
            }
            if (options.toBeParsed) {
                this.parseDimensionsFromPaths(options);
                delete options.toBeParsed;
            }
            this.setOptions(options);
            this.setCoords();
            if (options.sourcePath) {
                this.setSourcePath(options.sourcePath);
            }
        },
        parseDimensionsFromPaths: function(options) {
            var points, p, xC = [], yC = [], path, height, width, m;
            for (var j = this.paths.length; j--; ) {
                path = this.paths[j];
                height = path.height + path.strokeWidth;
                width = path.width + path.strokeWidth;
                points = [ {
                    x: path.left,
                    y: path.top
                }, {
                    x: path.left + width,
                    y: path.top
                }, {
                    x: path.left,
                    y: path.top + height
                }, {
                    x: path.left + width,
                    y: path.top + height
                } ];
                m = this.paths[j].transformMatrix;
                for (var i = 0; i < points.length; i++) {
                    p = points[i];
                    if (m) {
                        p = fabric.util.transformPoint(p, m, false);
                    }
                    xC.push(p.x);
                    yC.push(p.y);
                }
            }
            options.width = Math.max.apply(null, xC);
            options.height = Math.max.apply(null, yC);
        },
        render: function(ctx) {
            if (!this.visible) {
                return;
            }
            ctx.save();
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this.transform(ctx);
            this._setShadow(ctx);
            this.clipTo && fabric.util.clipContext(this, ctx);
            ctx.translate(-this.width / 2, -this.height / 2);
            for (var i = 0, l = this.paths.length; i < l; ++i) {
                this.paths[i].render(ctx, true);
            }
            this.clipTo && ctx.restore();
            ctx.restore();
        },
        _set: function(prop, value) {
            if (prop === "fill" && value && this.isSameColor()) {
                var i = this.paths.length;
                while (i--) {
                    this.paths[i]._set(prop, value);
                }
            }
            return this.callSuper("_set", prop, value);
        },
        toObject: function(propertiesToInclude) {
            var o = extend(parentToObject.call(this, [ "sourcePath" ].concat(propertiesToInclude)), {
                paths: invoke(this.getObjects(), "toObject", propertiesToInclude)
            });
            return o;
        },
        toDatalessObject: function(propertiesToInclude) {
            var o = this.toObject(propertiesToInclude);
            if (this.sourcePath) {
                o.paths = this.sourcePath;
            }
            return o;
        },
        toSVG: function(reviver) {
            var objects = this.getObjects(), p = this.getPointByOrigin("left", "top"), translatePart = "translate(" + p.x + " " + p.y + ")", markup = this._createBaseSVGMarkup();
            markup.push("<g ", this.getSvgId(), 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransformMatrix(), translatePart, this.getSvgTransform(), '" ', ">\n");
            for (var i = 0, len = objects.length; i < len; i++) {
                markup.push("\t", objects[i].toSVG(reviver));
            }
            markup.push("</g>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        toString: function() {
            return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>";
        },
        isSameColor: function() {
            var firstPathFill = this.getObjects()[0].get("fill") || "";
            if (typeof firstPathFill !== "string") {
                return false;
            }
            firstPathFill = firstPathFill.toLowerCase();
            return this.getObjects().every(function(path) {
                var pathFill = path.get("fill") || "";
                return typeof pathFill === "string" && pathFill.toLowerCase() === firstPathFill;
            });
        },
        complexity: function() {
            return this.paths.reduce(function(total, path) {
                return total + (path && path.complexity ? path.complexity() : 0);
            }, 0);
        },
        getObjects: function() {
            return this.paths;
        }
    });
    fabric.PathGroup.fromObject = function(object, callback) {
        if (typeof object.paths === "string") {
            fabric.loadSVGFromURL(object.paths, function(elements) {
                var pathUrl = object.paths;
                delete object.paths;
                var pathGroup = fabric.util.groupSVGElements(elements, object, pathUrl);
                callback(pathGroup);
            });
        } else {
            fabric.util.enlivenObjects(object.paths, function(enlivenedObjects) {
                delete object.paths;
                callback(new fabric.PathGroup(enlivenedObjects, object));
            });
        }
    };
    fabric.PathGroup.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max, invoke = fabric.util.array.invoke;
    if (fabric.Group) {
        return;
    }
    var _lockProperties = {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true
    };
    fabric.Group = fabric.util.createClass(fabric.Object, fabric.Collection, {
        type: "group",
        strokeWidth: 0,
        subTargetCheck: false,
        initialize: function(objects, options, isAlreadyGrouped) {
            options = options || {};
            this._objects = [];
            isAlreadyGrouped && this.callSuper("initialize", options);
            this._objects = objects || [];
            for (var i = this._objects.length; i--; ) {
                this._objects[i].group = this;
            }
            this.originalState = {};
            if (options.originX) {
                this.originX = options.originX;
            }
            if (options.originY) {
                this.originY = options.originY;
            }
            if (isAlreadyGrouped) {
                this._updateObjectsCoords(true);
            } else {
                this._calcBounds();
                this._updateObjectsCoords();
                this.callSuper("initialize", options);
            }
            this.setCoords();
            this.saveCoords();
        },
        _updateObjectsCoords: function(skipCoordsChange) {
            for (var i = this._objects.length; i--; ) {
                this._updateObjectCoords(this._objects[i], skipCoordsChange);
            }
        },
        _updateObjectCoords: function(object, skipCoordsChange) {
            object.__origHasControls = object.hasControls;
            object.hasControls = false;
            if (skipCoordsChange) {
                return;
            }
            var objectLeft = object.getLeft(), objectTop = object.getTop(), center = this.getCenterPoint();
            object.set({
                originalLeft: objectLeft,
                originalTop: objectTop,
                left: objectLeft - center.x,
                top: objectTop - center.y
            });
            object.setCoords();
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
            this.forEachObject(this._setObjectActive, this);
            this._calcBounds();
            this._updateObjectsCoords();
            return this;
        },
        _setObjectActive: function(object) {
            object.set("active", true);
            object.group = this;
        },
        removeWithUpdate: function(object) {
            this._restoreObjectsState();
            fabric.util.resetObjectTransform(this);
            this.forEachObject(this._setObjectActive, this);
            this.remove(object);
            this._calcBounds();
            this._updateObjectsCoords();
            return this;
        },
        _onObjectAdded: function(object) {
            object.group = this;
            object._set("canvas", this.canvas);
        },
        _onObjectRemoved: function(object) {
            delete object.group;
            object.set("active", false);
        },
        delegatedProperties: {
            fill: true,
            stroke: true,
            strokeWidth: true,
            fontFamily: true,
            fontWeight: true,
            fontSize: true,
            fontStyle: true,
            lineHeight: true,
            textDecoration: true,
            textAlign: true,
            backgroundColor: true
        },
        _set: function(key, value) {
            var i = this._objects.length;
            if (this.delegatedProperties[key] || key === "canvas") {
                while (i--) {
                    this._objects[i].set(key, value);
                }
            } else {
                while (i--) {
                    this._objects[i].setOnGroup(key, value);
                }
            }
            this.callSuper("_set", key, value);
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                objects: invoke(this._objects, "toObject", propertiesToInclude)
            });
        },
        render: function(ctx) {
            if (!this.visible) {
                return;
            }
            ctx.save();
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this.transform(ctx);
            this._setShadow(ctx);
            this.clipTo && fabric.util.clipContext(this, ctx);
            this._transformDone = true;
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._renderObject(this._objects[i], ctx);
            }
            this.clipTo && ctx.restore();
            ctx.restore();
            this._transformDone = false;
        },
        _renderControls: function(ctx, noTransform) {
            this.callSuper("_renderControls", ctx, noTransform);
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i]._renderControls(ctx);
            }
        },
        _renderObject: function(object, ctx) {
            if (!object.visible) {
                return;
            }
            var originalHasRotatingPoint = object.hasRotatingPoint;
            object.hasRotatingPoint = false;
            object.render(ctx);
            object.hasRotatingPoint = originalHasRotatingPoint;
        },
        _restoreObjectsState: function() {
            this._objects.forEach(this._restoreObjectState, this);
            return this;
        },
        realizeTransform: function(object) {
            var matrix = object.calcTransformMatrix(), options = fabric.util.qrDecompose(matrix), center = new fabric.Point(options.translateX, options.translateY);
            object.scaleX = options.scaleX;
            object.scaleY = options.scaleY;
            object.skewX = options.skewX;
            object.skewY = options.skewY;
            object.angle = options.angle;
            object.flipX = false;
            object.flipY = false;
            object.setPositionByOrigin(center, "center", "center");
            return object;
        },
        _restoreObjectState: function(object) {
            this.realizeTransform(object);
            object.setCoords();
            object.hasControls = object.__origHasControls;
            delete object.__origHasControls;
            object.set("active", false);
            delete object.group;
            return this;
        },
        destroy: function() {
            return this._restoreObjectsState();
        },
        saveCoords: function() {
            this._originalLeft = this.get("left");
            this._originalTop = this.get("top");
            return this;
        },
        hasMoved: function() {
            return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top");
        },
        setObjectsCoords: function() {
            this.forEachObject(function(object) {
                object.setCoords();
            });
            return this;
        },
        _calcBounds: function(onlyWidthHeight) {
            var aX = [], aY = [], o, prop, props = [ "tr", "br", "bl", "tl" ], i = 0, iLen = this._objects.length, j, jLen = props.length;
            for (;i < iLen; ++i) {
                o = this._objects[i];
                o.setCoords();
                for (j = 0; j < jLen; j++) {
                    prop = props[j];
                    aX.push(o.oCoords[prop].x);
                    aY.push(o.oCoords[prop].y);
                }
            }
            this.set(this._getBounds(aX, aY, onlyWidthHeight));
        },
        _getBounds: function(aX, aY, onlyWidthHeight) {
            var ivt = fabric.util.invertTransform(this.getViewportTransform()), minXY = fabric.util.transformPoint(new fabric.Point(min(aX), min(aY)), ivt), maxXY = fabric.util.transformPoint(new fabric.Point(max(aX), max(aY)), ivt), obj = {
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
        },
        get: function(prop) {
            if (prop in _lockProperties) {
                if (this[prop]) {
                    return this[prop];
                } else {
                    for (var i = 0, len = this._objects.length; i < len; i++) {
                        if (this._objects[i][prop]) {
                            return true;
                        }
                    }
                    return false;
                }
            } else {
                if (prop in this.delegatedProperties) {
                    return this._objects[0] && this._objects[0].get(prop);
                }
                return this[prop];
            }
        }
    });
    fabric.Group.fromObject = function(object, callback) {
        fabric.util.enlivenObjects(object.objects, function(enlivenedObjects) {
            delete object.objects;
            callback && callback(new fabric.Group(enlivenedObjects, object, true));
        });
    };
    fabric.Group.async = true;
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
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("alignX", "alignY", "meetOrSlice");
    fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        alignX: "none",
        alignY: "none",
        meetOrSlice: "meet",
        strokeWidth: 0,
        _lastScaleX: 1,
        _lastScaleY: 1,
        minimumScaleTrigger: .5,
        stateProperties: stateProperties,
        initialize: function(element, options, callback) {
            options || (options = {});
            this.filters = [];
            this.resizeFilters = [];
            this.callSuper("initialize", options);
            this._initElement(element, options, callback);
        },
        getElement: function() {
            return this._element;
        },
        setElement: function(element, callback, options) {
            var _callback, _this;
            this._element = element;
            this._originalElement = element;
            this._initConfig(options);
            if (this.resizeFilters.length === 0) {
                _callback = callback;
            } else {
                _this = this;
                _callback = function() {
                    _this.applyFilters(callback, _this.resizeFilters, _this._filteredEl || _this._originalElement, true);
                };
            }
            if (this.filters.length !== 0) {
                this.applyFilters(_callback);
            } else if (_callback) {
                _callback(this);
            }
            return this;
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
            this._setStrokeStyles(ctx);
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
            ctx.closePath();
            ctx.restore();
        },
        toObject: function(propertiesToInclude) {
            var filters = [], resizeFilters = [], scaleX = 1, scaleY = 1;
            this.filters.forEach(function(filterObj) {
                if (filterObj) {
                    if (filterObj.type === "Resize") {
                        scaleX *= filterObj.scaleX;
                        scaleY *= filterObj.scaleY;
                    }
                    filters.push(filterObj.toObject());
                }
            });
            this.resizeFilters.forEach(function(filterObj) {
                filterObj && resizeFilters.push(filterObj.toObject());
            });
            var object = extend(this.callSuper("toObject", [ "crossOrigin", "alignX", "alignY", "meetOrSlice" ].concat(propertiesToInclude)), {
                src: this.getSrc(),
                filters: filters,
                resizeFilters: resizeFilters
            });
            object.width /= scaleX;
            object.height /= scaleY;
            return object;
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), x = -this.width / 2, y = -this.height / 2, preserveAspectRatio = "none", filtered = true;
            if (this.group && this.group.type === "path-group") {
                x = this.left;
                y = this.top;
            }
            if (this.alignX !== "none" && this.alignY !== "none") {
                preserveAspectRatio = "x" + this.alignX + "Y" + this.alignY + " " + this.meetOrSlice;
            }
            markup.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', "<image ", this.getSvgId(), 'xlink:href="', this.getSvgSrc(filtered), '" x="', x, '" y="', y, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="', preserveAspectRatio, '"', "></image>\n");
            if (this.stroke || this.strokeDashArray) {
                var origFill = this.fill;
                this.fill = null;
                markup.push("<rect ", 'x="', x, '" y="', y, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n');
                this.fill = origFill;
            }
            markup.push("</g>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        getSrc: function(filtered) {
            var element = filtered ? this._element : this._originalElement;
            if (element) {
                return fabric.isLikelyNode ? element._src : element.src;
            } else {
                return this.src || "";
            }
        },
        setSrc: function(src, callback, options) {
            fabric.util.loadImage(src, function(img) {
                return this.setElement(img, callback, options);
            }, this, options && options.crossOrigin);
        },
        toString: function() {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
        },
        applyFilters: function(callback, filters, imgElement, forResizing) {
            filters = filters || this.filters;
            imgElement = imgElement || this._originalElement;
            if (!imgElement) {
                return;
            }
            var replacement = fabric.util.createImage(), retinaScaling = this.canvas ? this.canvas.getRetinaScaling() : fabric.devicePixelRatio, minimumScale = this.minimumScaleTrigger / retinaScaling, _this = this, scaleX, scaleY;
            if (filters.length === 0) {
                this._element = imgElement;
                callback && callback(this);
                return imgElement;
            }
            var canvasEl = fabric.util.createCanvasElement();
            canvasEl.width = imgElement.width;
            canvasEl.height = imgElement.height;
            canvasEl.getContext("2d").drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
            filters.forEach(function(filter) {
                if (!filter) {
                    return;
                }
                if (forResizing) {
                    scaleX = _this.scaleX < minimumScale ? _this.scaleX : 1;
                    scaleY = _this.scaleY < minimumScale ? _this.scaleY : 1;
                    if (scaleX * retinaScaling < 1) {
                        scaleX *= retinaScaling;
                    }
                    if (scaleY * retinaScaling < 1) {
                        scaleY *= retinaScaling;
                    }
                } else {
                    scaleX = filter.scaleX;
                    scaleY = filter.scaleY;
                }
                filter.applyTo(canvasEl, scaleX, scaleY);
                if (!forResizing && filter.type === "Resize") {
                    _this.width *= filter.scaleX;
                    _this.height *= filter.scaleY;
                }
            });
            replacement.width = canvasEl.width;
            replacement.height = canvasEl.height;
            if (fabric.isLikelyNode) {
                replacement.src = canvasEl.toBuffer(undefined, fabric.Image.pngCompression);
                _this._element = replacement;
                !forResizing && (_this._filteredEl = replacement);
                callback && callback(_this);
            } else {
                replacement.onload = function() {
                    _this._element = replacement;
                    !forResizing && (_this._filteredEl = replacement);
                    callback && callback(_this);
                    replacement.onload = canvasEl = null;
                };
                replacement.src = canvasEl.toDataURL("image/png");
            }
            return canvasEl;
        },
        _render: function(ctx, noTransform) {
            var x, y, imageMargins = this._findMargins(), elementToDraw;
            x = noTransform ? this.left : -this.width / 2;
            y = noTransform ? this.top : -this.height / 2;
            if (this.meetOrSlice === "slice") {
                ctx.beginPath();
                ctx.rect(x, y, this.width, this.height);
                ctx.clip();
            }
            if (this.isMoving === false && this.resizeFilters.length && this._needsResize()) {
                this._lastScaleX = this.scaleX;
                this._lastScaleY = this.scaleY;
                elementToDraw = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, true);
            } else {
                elementToDraw = this._element;
            }
            elementToDraw && ctx.drawImage(elementToDraw, x + imageMargins.marginX, y + imageMargins.marginY, imageMargins.width, imageMargins.height);
            this._stroke(ctx);
            this._renderStroke(ctx);
        },
        _needsResize: function() {
            return this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY;
        },
        _findMargins: function() {
            var width = this.width, height = this.height, scales, scale, marginX = 0, marginY = 0;
            if (this.alignX !== "none" || this.alignY !== "none") {
                scales = [ this.width / this._element.width, this.height / this._element.height ];
                scale = this.meetOrSlice === "meet" ? Math.min.apply(null, scales) : Math.max.apply(null, scales);
                width = this._element.width * scale;
                height = this._element.height * scale;
                if (this.alignX === "Mid") {
                    marginX = (this.width - width) / 2;
                }
                if (this.alignX === "Max") {
                    marginX = this.width - width;
                }
                if (this.alignY === "Mid") {
                    marginY = (this.height - height) / 2;
                }
                if (this.alignY === "Max") {
                    marginY = this.height - height;
                }
            }
            return {
                width: width,
                height: height,
                marginX: marginX,
                marginY: marginY
            };
        },
        _resetWidthHeight: function() {
            var element = this.getElement();
            this.set("width", element.width);
            this.set("height", element.height);
        },
        _initElement: function(element, options, callback) {
            this.setElement(fabric.util.getById(element), callback, options);
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
        complexity: function() {
            return 1;
        }
    });
    fabric.Image.CSS_CANVAS = "canvas-img";
    fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;
    fabric.Image.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img) {
            fabric.Image.prototype._initFilters.call(object, object.filters, function(filters) {
                object.filters = filters || [];
                fabric.Image.prototype._initFilters.call(object, object.resizeFilters, function(resizeFilters) {
                    object.resizeFilters = resizeFilters || [];
                    return new fabric.Image(img, object, callback);
                });
            });
        }, null, object.crossOrigin);
    };
    fabric.Image.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
            callback && callback(new fabric.Image(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
    };
    fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href".split(" "));
    fabric.Image.fromElement = function(element, callback, options) {
        var parsedAttributes = fabric.parseAttributes(element, fabric.Image.ATTRIBUTE_NAMES), preserveAR;
        if (parsedAttributes.preserveAspectRatio) {
            preserveAR = fabric.util.parsePreserveAspectRatioAttribute(parsedAttributes.preserveAspectRatio);
            extend(parsedAttributes, preserveAR);
        }
        fabric.Image.fromURL(parsedAttributes["xlink:href"], callback, extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes));
    };
    fabric.Image.async = true;
    fabric.Image.pngCompression = 1;
})(typeof exports !== "undefined" ? exports : this);

fabric.util.object.extend(fabric.Object.prototype, {
    _getAngleValueForStraighten: function() {
        var angle = this.getAngle() % 360;
        if (angle > 0) {
            return Math.round((angle - 1) / 90) * 90;
        }
        return Math.round(angle / 90) * 90;
    },
    straighten: function() {
        this.setAngle(this._getAngleValueForStraighten());
        return this;
    },
    fxStraighten: function(callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: this.get("angle"),
            endValue: this._getAngleValueForStraighten(),
            duration: this.FX_DURATION,
            onChange: function(value) {
                _this.setAngle(value);
                onChange();
            },
            onComplete: function() {
                _this.setCoords();
                onComplete();
            },
            onStart: function() {
                _this.set("active", false);
            }
        });
        return this;
    }
});

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function(object) {
        object.straighten();
        this.renderAll();
        return this;
    },
    fxStraightenObject: function(object) {
        object.fxStraighten({
            onChange: this.renderAll.bind(this)
        });
        return this;
    }
});

fabric.Image.filters = fabric.Image.filters || {};

fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: "BaseFilter",
    initialize: function(options) {
        if (options) {
            this.setOptions(options);
        }
    },
    setOptions: function(options) {
        for (var prop in options) {
            this[prop] = options[prop];
        }
    },
    toObject: function() {
        return {
            type: this.type
        };
    },
    toJSON: function() {
        return this.toObject();
    }
});

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Brightness = createClass(filters.BaseFilter, {
        type: "Brightness",
        initialize: function(options) {
            options = options || {};
            this.brightness = options.brightness || 0;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, brightness = this.brightness;
            for (var i = 0, len = data.length; i < len; i += 4) {
                data[i] += brightness;
                data[i + 1] += brightness;
                data[i + 2] += brightness;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                brightness: this.brightness
            });
        }
    });
    fabric.Image.filters.Brightness.fromObject = function(object) {
        return new fabric.Image.filters.Brightness(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Convolute = createClass(filters.BaseFilter, {
        type: "Convolute",
        initialize: function(options) {
            options = options || {};
            this.opaque = options.opaque;
            this.matrix = options.matrix || [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ];
        },
        applyTo: function(canvasEl) {
            var weights = this.matrix, context = canvasEl.getContext("2d"), pixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height), side = Math.round(Math.sqrt(weights.length)), halfSide = Math.floor(side / 2), src = pixels.data, sw = pixels.width, sh = pixels.height, output = context.createImageData(sw, sh), dst = output.data, alphaFac = this.opaque ? 1 : 0, r, g, b, a, dstOff, scx, scy, srcOff, wt;
            for (var y = 0; y < sh; y++) {
                for (var x = 0; x < sw; x++) {
                    dstOff = (y * sw + x) * 4;
                    r = 0;
                    g = 0;
                    b = 0;
                    a = 0;
                    for (var cy = 0; cy < side; cy++) {
                        for (var cx = 0; cx < side; cx++) {
                            scy = y + cy - halfSide;
                            scx = x + cx - halfSide;
                            if (scy < 0 || scy > sh || scx < 0 || scx > sw) {
                                continue;
                            }
                            srcOff = (scy * sw + scx) * 4;
                            wt = weights[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                    }
                    dst[dstOff] = r;
                    dst[dstOff + 1] = g;
                    dst[dstOff + 2] = b;
                    dst[dstOff + 3] = a + alphaFac * (255 - a);
                }
            }
            context.putImageData(output, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                opaque: this.opaque,
                matrix: this.matrix
            });
        }
    });
    fabric.Image.filters.Convolute.fromObject = function(object) {
        return new fabric.Image.filters.Convolute(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.GradientTransparency = createClass(filters.BaseFilter, {
        type: "GradientTransparency",
        initialize: function(options) {
            options = options || {};
            this.threshold = options.threshold || 100;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, threshold = this.threshold, total = data.length;
            for (var i = 0, len = data.length; i < len; i += 4) {
                data[i + 3] = threshold + 255 * (total - i) / total;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                threshold: this.threshold
            });
        }
    });
    fabric.Image.filters.GradientTransparency.fromObject = function(object) {
        return new fabric.Image.filters.GradientTransparency(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Grayscale = createClass(filters.BaseFilter, {
        type: "Grayscale",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, len = imageData.width * imageData.height * 4, index = 0, average;
            while (index < len) {
                average = (data[index] + data[index + 1] + data[index + 2]) / 3;
                data[index] = average;
                data[index + 1] = average;
                data[index + 2] = average;
                index += 4;
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Grayscale.fromObject = function() {
        return new fabric.Image.filters.Grayscale();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Invert = createClass(filters.BaseFilter, {
        type: "Invert",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i;
            for (i = 0; i < iLen; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Invert.fromObject = function() {
        return new fabric.Image.filters.Invert();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Mask = createClass(filters.BaseFilter, {
        type: "Mask",
        initialize: function(options) {
            options = options || {};
            this.mask = options.mask;
            this.channel = [ 0, 1, 2, 3 ].indexOf(options.channel) > -1 ? options.channel : 0;
        },
        applyTo: function(canvasEl) {
            if (!this.mask) {
                return;
            }
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, maskEl = this.mask.getElement(), maskCanvasEl = fabric.util.createCanvasElement(), channel = this.channel, i, iLen = imageData.width * imageData.height * 4;
            maskCanvasEl.width = canvasEl.width;
            maskCanvasEl.height = canvasEl.height;
            maskCanvasEl.getContext("2d").drawImage(maskEl, 0, 0, canvasEl.width, canvasEl.height);
            var maskImageData = maskCanvasEl.getContext("2d").getImageData(0, 0, canvasEl.width, canvasEl.height), maskData = maskImageData.data;
            for (i = 0; i < iLen; i += 4) {
                data[i + 3] = maskData[i + channel];
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                mask: this.mask.toObject(),
                channel: this.channel
            });
        }
    });
    fabric.Image.filters.Mask.fromObject = function(object, callback) {
        fabric.util.loadImage(object.mask.src, function(img) {
            object.mask = new fabric.Image(img, object.mask);
            callback && callback(new fabric.Image.filters.Mask(object));
        });
    };
    fabric.Image.filters.Mask.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Noise = createClass(filters.BaseFilter, {
        type: "Noise",
        initialize: function(options) {
            options = options || {};
            this.noise = options.noise || 0;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, noise = this.noise, rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                noise: this.noise
            });
        }
    });
    fabric.Image.filters.Noise.fromObject = function(object) {
        return new fabric.Image.filters.Noise(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Pixelate = createClass(filters.BaseFilter, {
        type: "Pixelate",
        initialize: function(options) {
            options = options || {};
            this.blocksize = options.blocksize || 4;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = imageData.height, jLen = imageData.width, index, i, j, r, g, b, a;
            for (i = 0; i < iLen; i += this.blocksize) {
                for (j = 0; j < jLen; j += this.blocksize) {
                    index = i * 4 * jLen + j * 4;
                    r = data[index];
                    g = data[index + 1];
                    b = data[index + 2];
                    a = data[index + 3];
                    for (var _i = i, _ilen = i + this.blocksize; _i < _ilen; _i++) {
                        for (var _j = j, _jlen = j + this.blocksize; _j < _jlen; _j++) {
                            index = _i * 4 * jLen + _j * 4;
                            data[index] = r;
                            data[index + 1] = g;
                            data[index + 2] = b;
                            data[index + 3] = a;
                        }
                    }
                }
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                blocksize: this.blocksize
            });
        }
    });
    fabric.Image.filters.Pixelate.fromObject = function(object) {
        return new fabric.Image.filters.Pixelate(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.RemoveWhite = createClass(filters.BaseFilter, {
        type: "RemoveWhite",
        initialize: function(options) {
            options = options || {};
            this.threshold = options.threshold || 30;
            this.distance = options.distance || 20;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, threshold = this.threshold, distance = this.distance, limit = 255 - threshold, abs = Math.abs, r, g, b;
            for (var i = 0, len = data.length; i < len; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                if (r > limit && g > limit && b > limit && abs(r - g) < distance && abs(r - b) < distance && abs(g - b) < distance) {
                    data[i + 3] = 0;
                }
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                threshold: this.threshold,
                distance: this.distance
            });
        }
    });
    fabric.Image.filters.RemoveWhite.fromObject = function(object) {
        return new fabric.Image.filters.RemoveWhite(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Sepia = createClass(filters.BaseFilter, {
        type: "Sepia",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, avg;
            for (i = 0; i < iLen; i += 4) {
                avg = .3 * data[i] + .59 * data[i + 1] + .11 * data[i + 2];
                data[i] = avg + 100;
                data[i + 1] = avg + 50;
                data[i + 2] = avg + 255;
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Sepia.fromObject = function() {
        return new fabric.Image.filters.Sepia();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Sepia2 = createClass(filters.BaseFilter, {
        type: "Sepia2",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, r, g, b;
            for (i = 0; i < iLen; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                data[i] = (r * .393 + g * .769 + b * .189) / 1.351;
                data[i + 1] = (r * .349 + g * .686 + b * .168) / 1.203;
                data[i + 2] = (r * .272 + g * .534 + b * .131) / 2.14;
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Sepia2.fromObject = function() {
        return new fabric.Image.filters.Sepia2();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Tint = createClass(filters.BaseFilter, {
        type: "Tint",
        initialize: function(options) {
            options = options || {};
            this.color = options.color || "#000000";
            this.opacity = typeof options.opacity !== "undefined" ? options.opacity : new fabric.Color(this.color).getAlpha();
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, tintR, tintG, tintB, r, g, b, alpha1, source;
            source = new fabric.Color(this.color).getSource();
            tintR = source[0] * this.opacity;
            tintG = source[1] * this.opacity;
            tintB = source[2] * this.opacity;
            alpha1 = 1 - this.opacity;
            for (i = 0; i < iLen; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                data[i] = tintR + r * alpha1;
                data[i + 1] = tintG + g * alpha1;
                data[i + 2] = tintB + b * alpha1;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                color: this.color,
                opacity: this.opacity
            });
        }
    });
    fabric.Image.filters.Tint.fromObject = function(object) {
        return new fabric.Image.filters.Tint(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Multiply = createClass(filters.BaseFilter, {
        type: "Multiply",
        initialize: function(options) {
            options = options || {};
            this.color = options.color || "#000000";
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, source;
            source = new fabric.Color(this.color).getSource();
            for (i = 0; i < iLen; i += 4) {
                data[i] *= source[0] / 255;
                data[i + 1] *= source[1] / 255;
                data[i + 2] *= source[2] / 255;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                color: this.color
            });
        }
    });
    fabric.Image.filters.Multiply.fromObject = function(object) {
        return new fabric.Image.filters.Multiply(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Blend = createClass(filters.BaseFilter, {
        type: "Blend",
        initialize: function(options) {
            options = options || {};
            this.color = options.color || "#000";
            this.image = options.image || false;
            this.mode = options.mode || "multiply";
            this.alpha = options.alpha || 1;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, tr, tg, tb, r, g, b, _r, _g, _b, source, isImage = false;
            if (this.image) {
                isImage = true;
                var _el = fabric.util.createCanvasElement();
                _el.width = this.image.width;
                _el.height = this.image.height;
                var tmpCanvas = new fabric.StaticCanvas(_el);
                tmpCanvas.add(this.image);
                var context2 = tmpCanvas.getContext("2d");
                source = context2.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data;
            } else {
                source = new fabric.Color(this.color).getSource();
                tr = source[0] * this.alpha;
                tg = source[1] * this.alpha;
                tb = source[2] * this.alpha;
            }
            for (var i = 0, len = data.length; i < len; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                if (isImage) {
                    tr = source[i] * this.alpha;
                    tg = source[i + 1] * this.alpha;
                    tb = source[i + 2] * this.alpha;
                }
                switch (this.mode) {
                  case "multiply":
                    data[i] = r * tr / 255;
                    data[i + 1] = g * tg / 255;
                    data[i + 2] = b * tb / 255;
                    break;

                  case "screen":
                    data[i] = 1 - (1 - r) * (1 - tr);
                    data[i + 1] = 1 - (1 - g) * (1 - tg);
                    data[i + 2] = 1 - (1 - b) * (1 - tb);
                    break;

                  case "add":
                    data[i] = Math.min(255, r + tr);
                    data[i + 1] = Math.min(255, g + tg);
                    data[i + 2] = Math.min(255, b + tb);
                    break;

                  case "diff":
                  case "difference":
                    data[i] = Math.abs(r - tr);
                    data[i + 1] = Math.abs(g - tg);
                    data[i + 2] = Math.abs(b - tb);
                    break;

                  case "subtract":
                    _r = r - tr;
                    _g = g - tg;
                    _b = b - tb;
                    data[i] = _r < 0 ? 0 : _r;
                    data[i + 1] = _g < 0 ? 0 : _g;
                    data[i + 2] = _b < 0 ? 0 : _b;
                    break;

                  case "darken":
                    data[i] = Math.min(r, tr);
                    data[i + 1] = Math.min(g, tg);
                    data[i + 2] = Math.min(b, tb);
                    break;

                  case "lighten":
                    data[i] = Math.max(r, tr);
                    data[i + 1] = Math.max(g, tg);
                    data[i + 2] = Math.max(b, tb);
                    break;
                }
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return {
                color: this.color,
                image: this.image,
                mode: this.mode,
                alpha: this.alpha
            };
        }
    });
    fabric.Image.filters.Blend.fromObject = function(object) {
        return new fabric.Image.filters.Blend(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), pow = Math.pow, floor = Math.floor, sqrt = Math.sqrt, abs = Math.abs, max = Math.max, round = Math.round, sin = Math.sin, ceil = Math.ceil, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Resize = createClass(filters.BaseFilter, {
        type: "Resize",
        resizeType: "hermite",
        scaleX: 0,
        scaleY: 0,
        lanczosLobes: 3,
        applyTo: function(canvasEl, scaleX, scaleY) {
            if (scaleX === 1 && scaleY === 1) {
                return;
            }
            this.rcpScaleX = 1 / scaleX;
            this.rcpScaleY = 1 / scaleY;
            var oW = canvasEl.width, oH = canvasEl.height, dW = round(oW * scaleX), dH = round(oH * scaleY), imageData;
            if (this.resizeType === "sliceHack") {
                imageData = this.sliceByTwo(canvasEl, oW, oH, dW, dH);
            }
            if (this.resizeType === "hermite") {
                imageData = this.hermiteFastResize(canvasEl, oW, oH, dW, dH);
            }
            if (this.resizeType === "bilinear") {
                imageData = this.bilinearFiltering(canvasEl, oW, oH, dW, dH);
            }
            if (this.resizeType === "lanczos") {
                imageData = this.lanczosResize(canvasEl, oW, oH, dW, dH);
            }
            canvasEl.width = dW;
            canvasEl.height = dH;
            canvasEl.getContext("2d").putImageData(imageData, 0, 0);
        },
        sliceByTwo: function(canvasEl, oW, oH, dW, dH) {
            var context = canvasEl.getContext("2d"), imageData, multW = .5, multH = .5, signW = 1, signH = 1, doneW = false, doneH = false, stepW = oW, stepH = oH, tmpCanvas = fabric.util.createCanvasElement(), tmpCtx = tmpCanvas.getContext("2d");
            dW = floor(dW);
            dH = floor(dH);
            tmpCanvas.width = max(dW, oW);
            tmpCanvas.height = max(dH, oH);
            if (dW > oW) {
                multW = 2;
                signW = -1;
            }
            if (dH > oH) {
                multH = 2;
                signH = -1;
            }
            imageData = context.getImageData(0, 0, oW, oH);
            canvasEl.width = max(dW, oW);
            canvasEl.height = max(dH, oH);
            context.putImageData(imageData, 0, 0);
            while (!doneW || !doneH) {
                oW = stepW;
                oH = stepH;
                if (dW * signW < floor(stepW * multW * signW)) {
                    stepW = floor(stepW * multW);
                } else {
                    stepW = dW;
                    doneW = true;
                }
                if (dH * signH < floor(stepH * multH * signH)) {
                    stepH = floor(stepH * multH);
                } else {
                    stepH = dH;
                    doneH = true;
                }
                imageData = context.getImageData(0, 0, oW, oH);
                tmpCtx.putImageData(imageData, 0, 0);
                context.clearRect(0, 0, stepW, stepH);
                context.drawImage(tmpCanvas, 0, 0, oW, oH, 0, 0, stepW, stepH);
            }
            return context.getImageData(0, 0, dW, dH);
        },
        lanczosResize: function(canvasEl, oW, oH, dW, dH) {
            function lanczosCreate(lobes) {
                return function(x) {
                    if (x > lobes) {
                        return 0;
                    }
                    x *= Math.PI;
                    if (abs(x) < 1e-16) {
                        return 1;
                    }
                    var xx = x / lobes;
                    return sin(x) * sin(xx) / x / xx;
                };
            }
            function process(u) {
                var v, i, weight, idx, a, red, green, blue, alpha, fX, fY;
                center.x = (u + .5) * ratioX;
                icenter.x = floor(center.x);
                for (v = 0; v < dH; v++) {
                    center.y = (v + .5) * ratioY;
                    icenter.y = floor(center.y);
                    a = 0;
                    red = 0;
                    green = 0;
                    blue = 0;
                    alpha = 0;
                    for (i = icenter.x - range2X; i <= icenter.x + range2X; i++) {
                        if (i < 0 || i >= oW) {
                            continue;
                        }
                        fX = floor(1e3 * abs(i - center.x));
                        if (!cacheLanc[fX]) {
                            cacheLanc[fX] = {};
                        }
                        for (var j = icenter.y - range2Y; j <= icenter.y + range2Y; j++) {
                            if (j < 0 || j >= oH) {
                                continue;
                            }
                            fY = floor(1e3 * abs(j - center.y));
                            if (!cacheLanc[fX][fY]) {
                                cacheLanc[fX][fY] = lanczos(sqrt(pow(fX * rcpRatioX, 2) + pow(fY * rcpRatioY, 2)) / 1e3);
                            }
                            weight = cacheLanc[fX][fY];
                            if (weight > 0) {
                                idx = (j * oW + i) * 4;
                                a += weight;
                                red += weight * srcData[idx];
                                green += weight * srcData[idx + 1];
                                blue += weight * srcData[idx + 2];
                                alpha += weight * srcData[idx + 3];
                            }
                        }
                    }
                    idx = (v * dW + u) * 4;
                    destData[idx] = red / a;
                    destData[idx + 1] = green / a;
                    destData[idx + 2] = blue / a;
                    destData[idx + 3] = alpha / a;
                }
                if (++u < dW) {
                    return process(u);
                } else {
                    return destImg;
                }
            }
            var context = canvasEl.getContext("2d"), srcImg = context.getImageData(0, 0, oW, oH), destImg = context.getImageData(0, 0, dW, dH), srcData = srcImg.data, destData = destImg.data, lanczos = lanczosCreate(this.lanczosLobes), ratioX = this.rcpScaleX, ratioY = this.rcpScaleY, rcpRatioX = 2 / this.rcpScaleX, rcpRatioY = 2 / this.rcpScaleY, range2X = ceil(ratioX * this.lanczosLobes / 2), range2Y = ceil(ratioY * this.lanczosLobes / 2), cacheLanc = {}, center = {}, icenter = {};
            return process(0);
        },
        bilinearFiltering: function(canvasEl, oW, oH, dW, dH) {
            var a, b, c, d, x, y, i, j, xDiff, yDiff, chnl, color, offset = 0, origPix, ratioX = this.rcpScaleX, ratioY = this.rcpScaleY, context = canvasEl.getContext("2d"), w4 = 4 * (oW - 1), img = context.getImageData(0, 0, oW, oH), pixels = img.data, destImage = context.getImageData(0, 0, dW, dH), destPixels = destImage.data;
            for (i = 0; i < dH; i++) {
                for (j = 0; j < dW; j++) {
                    x = floor(ratioX * j);
                    y = floor(ratioY * i);
                    xDiff = ratioX * j - x;
                    yDiff = ratioY * i - y;
                    origPix = 4 * (y * oW + x);
                    for (chnl = 0; chnl < 4; chnl++) {
                        a = pixels[origPix + chnl];
                        b = pixels[origPix + 4 + chnl];
                        c = pixels[origPix + w4 + chnl];
                        d = pixels[origPix + w4 + 4 + chnl];
                        color = a * (1 - xDiff) * (1 - yDiff) + b * xDiff * (1 - yDiff) + c * yDiff * (1 - xDiff) + d * xDiff * yDiff;
                        destPixels[offset++] = color;
                    }
                }
            }
            return destImage;
        },
        hermiteFastResize: function(canvasEl, oW, oH, dW, dH) {
            var ratioW = this.rcpScaleX, ratioH = this.rcpScaleY, ratioWHalf = ceil(ratioW / 2), ratioHHalf = ceil(ratioH / 2), context = canvasEl.getContext("2d"), img = context.getImageData(0, 0, oW, oH), data = img.data, img2 = context.getImageData(0, 0, dW, dH), data2 = img2.data;
            for (var j = 0; j < dH; j++) {
                for (var i = 0; i < dW; i++) {
                    var x2 = (i + j * dW) * 4, weight = 0, weights = 0, weightsAlpha = 0, gxR = 0, gxG = 0, gxB = 0, gxA = 0, centerY = (j + .5) * ratioH;
                    for (var yy = floor(j * ratioH); yy < (j + 1) * ratioH; yy++) {
                        var dy = abs(centerY - (yy + .5)) / ratioHHalf, centerX = (i + .5) * ratioW, w0 = dy * dy;
                        for (var xx = floor(i * ratioW); xx < (i + 1) * ratioW; xx++) {
                            var dx = abs(centerX - (xx + .5)) / ratioWHalf, w = sqrt(w0 + dx * dx);
                            if (w > 1 && w < -1) {
                                continue;
                            }
                            weight = 2 * w * w * w - 3 * w * w + 1;
                            if (weight > 0) {
                                dx = 4 * (xx + yy * oW);
                                gxA += weight * data[dx + 3];
                                weightsAlpha += weight;
                                if (data[dx + 3] < 255) {
                                    weight = weight * data[dx + 3] / 250;
                                }
                                gxR += weight * data[dx];
                                gxG += weight * data[dx + 1];
                                gxB += weight * data[dx + 2];
                                weights += weight;
                            }
                        }
                    }
                    data2[x2] = gxR / weights;
                    data2[x2 + 1] = gxG / weights;
                    data2[x2 + 2] = gxB / weights;
                    data2[x2 + 3] = gxA / weightsAlpha;
                }
            }
            return img2;
        },
        toObject: function() {
            return {
                type: this.type,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                resizeType: this.resizeType,
                lanczosLobes: this.lanczosLobes
            };
        }
    });
    fabric.Image.filters.Resize.fromObject = function(object) {
        return new fabric.Image.filters.Resize(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.ColorMatrix = createClass(filters.BaseFilter, {
        type: "ColorMatrix",
        initialize: function(options) {
            options || (options = {});
            this.matrix = options.matrix || [ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0 ];
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, r, g, b, a, m = this.matrix;
            for (i = 0; i < iLen; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                a = data[i + 3];
                data[i] = r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4];
                data[i + 1] = r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9];
                data[i + 2] = r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14];
                data[i + 3] = r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19];
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                type: this.type,
                matrix: this.matrix
            });
        }
    });
    fabric.Image.filters.ColorMatrix.fromObject = function(object) {
        return new fabric.Image.filters.ColorMatrix(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Contrast = createClass(filters.BaseFilter, {
        type: "Contrast",
        initialize: function(options) {
            options = options || {};
            this.contrast = options.contrast || 0;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, contrastF = 259 * (this.contrast + 255) / (255 * (259 - this.contrast));
            for (var i = 0, len = data.length; i < len; i += 4) {
                data[i] = contrastF * (data[i] - 128) + 128;
                data[i + 1] = contrastF * (data[i + 1] - 128) + 128;
                data[i + 2] = contrastF * (data[i + 2] - 128) + 128;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                contrast: this.contrast
            });
        }
    });
    fabric.Image.filters.Contrast.fromObject = function(object) {
        return new fabric.Image.filters.Contrast(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, filters = fabric.Image.filters, createClass = fabric.util.createClass;
    filters.Saturate = createClass(filters.BaseFilter, {
        type: "Saturate",
        initialize: function(options) {
            options = options || {};
            this.saturate = options.saturate || 0;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, max, adjust = -this.saturate * .01;
            for (var i = 0, len = data.length; i < len; i += 4) {
                max = Math.max(data[i], data[i + 1], data[i + 2]);
                data[i] += max !== data[i] ? (max - data[i]) * adjust : 0;
                data[i + 1] += max !== data[i + 1] ? (max - data[i + 1]) * adjust : 0;
                data[i + 2] += max !== data[i + 2] ? (max - data[i + 2]) * adjust : 0;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                saturate: this.saturate
            });
        }
    });
    fabric.Image.filters.Saturate.fromObject = function(object) {
        return new fabric.Image.filters.Saturate(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, MIN_TEXT_WIDTH = 2;
    if (fabric.Text) {
        fabric.warn("fabric.Text is already defined");
        return;
    }
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor");
    fabric.Text = fabric.util.createClass(fabric.Object, {
        _dimensionAffectingProps: {
            fontSize: true,
            fontWeight: true,
            fontFamily: true,
            fontStyle: true,
            lineHeight: true,
            text: true,
            charSpacing: true,
            textAlign: true,
            strokeWidth: false
        },
        _reNewline: /\r?\n/,
        _reSpacesAndTabs: /[ \t\r]+/g,
        type: "text",
        fontSize: 40,
        fontWeight: "normal",
        fontFamily: "Times New Roman",
        textDecoration: "",
        textAlign: "left",
        fontStyle: "",
        lineHeight: 1.16,
        textBackgroundColor: "",
        stateProperties: stateProperties,
        stroke: null,
        shadow: null,
        _fontSizeFraction: .25,
        _fontSizeMult: 1.13,
        charSpacing: 0,
        initialize: function(text, options) {
            options = options || {};
            this.text = text;
            this.__skipDimension = true;
            this.setOptions(options);
            this.__skipDimension = false;
            this._initDimensions();
        },
        _initDimensions: function(ctx) {
            if (this.__skipDimension) {
                return;
            }
            if (!ctx) {
                ctx = fabric.util.createCanvasElement().getContext("2d");
                this._setTextStyles(ctx);
            }
            this._textLines = this._splitTextIntoLines();
            this._clearCache();
            this.width = this._getTextWidth(ctx) || this.cursorWidth || MIN_TEXT_WIDTH;
            this.height = this._getTextHeight(ctx);
        },
        toString: function() {
            return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
        },
        _render: function(ctx) {
            this.clipTo && fabric.util.clipContext(this, ctx);
            this._setOpacity(ctx);
            this._setShadow(ctx);
            this._setupCompositeOperation(ctx);
            this._renderTextBackground(ctx);
            this._setStrokeStyles(ctx);
            this._setFillStyles(ctx);
            this._renderText(ctx);
            this._renderTextDecoration(ctx);
            this.clipTo && ctx.restore();
        },
        _renderText: function(ctx) {
            this._renderTextFill(ctx);
            this._renderTextStroke(ctx);
        },
        _setTextStyles: function(ctx) {
            ctx.textBaseline = "alphabetic";
            ctx.font = this._getFontDeclaration();
        },
        _getTextHeight: function() {
            return this._getHeightOfSingleLine() + (this._textLines.length - 1) * this._getHeightOfLine();
        },
        _getTextWidth: function(ctx) {
            var maxWidth = this._getLineWidth(ctx, 0);
            for (var i = 1, len = this._textLines.length; i < len; i++) {
                var currentLineWidth = this._getLineWidth(ctx, i);
                if (currentLineWidth > maxWidth) {
                    maxWidth = currentLineWidth;
                }
            }
            return maxWidth;
        },
        _getNonTransformedDimensions: function() {
            return {
                x: this.width,
                y: this.height
            };
        },
        _renderChars: function(method, ctx, chars, left, top) {
            var shortM = method.slice(0, -4), char, width;
            if (this[shortM].toLive) {
                var offsetX = -this.width / 2 + this[shortM].offsetX || 0, offsetY = -this.height / 2 + this[shortM].offsetY || 0;
                ctx.save();
                ctx.translate(offsetX, offsetY);
                left -= offsetX;
                top -= offsetY;
            }
            if (this.charSpacing !== 0) {
                var additionalSpace = this._getWidthOfCharSpacing();
                chars = chars.split("");
                for (var i = 0, len = chars.length; i < len; i++) {
                    char = chars[i];
                    width = ctx.measureText(char).width + additionalSpace;
                    ctx[method](char, left, top);
                    left += width > 0 ? width : 0;
                }
            } else {
                ctx[method](chars, left, top);
            }
            this[shortM].toLive && ctx.restore();
        },
        _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
            top -= this.fontSize * this._fontSizeFraction;
            var lineWidth = this._getLineWidth(ctx, lineIndex);
            if (this.textAlign !== "justify" || this.width < lineWidth) {
                this._renderChars(method, ctx, line, left, top, lineIndex);
                return;
            }
            var words = line.split(/\s+/), charOffset = 0, wordsWidth = this._getWidthOfWords(ctx, words.join(" "), lineIndex, 0), widthDiff = this.width - wordsWidth, numSpaces = words.length - 1, spaceWidth = numSpaces > 0 ? widthDiff / numSpaces : 0, leftOffset = 0, word;
            for (var i = 0, len = words.length; i < len; i++) {
                while (line[charOffset] === " " && charOffset < line.length) {
                    charOffset++;
                }
                word = words[i];
                this._renderChars(method, ctx, word, left + leftOffset, top, lineIndex, charOffset);
                leftOffset += this._getWidthOfWords(ctx, word, lineIndex, charOffset) + spaceWidth;
                charOffset += word.length;
            }
        },
        _getWidthOfWords: function(ctx, word) {
            var width = ctx.measureText(word).width, charCount, additionalSpace;
            if (this.charSpacing !== 0) {
                charCount = word.split("").length;
                additionalSpace = charCount * this._getWidthOfCharSpacing();
                width += additionalSpace;
            }
            return width > 0 ? width : 0;
        },
        _getLeftOffset: function() {
            return -this.width / 2;
        },
        _getTopOffset: function() {
            return -this.height / 2;
        },
        isEmptyStyles: function() {
            return true;
        },
        _renderTextCommon: function(ctx, method) {
            var lineHeights = 0, left = this._getLeftOffset(), top = this._getTopOffset();
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                var heightOfLine = this._getHeightOfLine(ctx, i), maxHeight = heightOfLine / this.lineHeight, lineWidth = this._getLineWidth(ctx, i), leftOffset = this._getLineLeftOffset(lineWidth);
                this._renderTextLine(method, ctx, this._textLines[i], left + leftOffset, top + lineHeights + maxHeight, i);
                lineHeights += heightOfLine;
            }
        },
        _renderTextFill: function(ctx) {
            if (!this.fill && this.isEmptyStyles()) {
                return;
            }
            this._renderTextCommon(ctx, "fillText");
        },
        _renderTextStroke: function(ctx) {
            if ((!this.stroke || this.strokeWidth === 0) && this.isEmptyStyles()) {
                return;
            }
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(ctx);
            }
            ctx.save();
            this._setLineDash(ctx, this.strokedashArray);
            ctx.beginPath();
            this._renderTextCommon(ctx, "strokeText");
            ctx.closePath();
            ctx.restore();
        },
        _getHeightOfLine: function() {
            return this._getHeightOfSingleLine() * this.lineHeight;
        },
        _getHeightOfSingleLine: function() {
            return this.fontSize * this._fontSizeMult;
        },
        _renderTextBackground: function(ctx) {
            this._renderBackground(ctx);
            this._renderTextLinesBackground(ctx);
        },
        _renderTextLinesBackground: function(ctx) {
            if (!this.textBackgroundColor) {
                return;
            }
            var lineTopOffset = 0, heightOfLine, lineWidth, lineLeftOffset;
            ctx.fillStyle = this.textBackgroundColor;
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                heightOfLine = this._getHeightOfLine(ctx, i);
                lineWidth = this._getLineWidth(ctx, i);
                if (lineWidth > 0) {
                    lineLeftOffset = this._getLineLeftOffset(lineWidth);
                    ctx.fillRect(this._getLeftOffset() + lineLeftOffset, this._getTopOffset() + lineTopOffset, lineWidth, heightOfLine / this.lineHeight);
                }
                lineTopOffset += heightOfLine;
            }
            this._removeShadow(ctx);
        },
        _getLineLeftOffset: function(lineWidth) {
            if (this.textAlign === "center") {
                return (this.width - lineWidth) / 2;
            }
            if (this.textAlign === "right") {
                return this.width - lineWidth;
            }
            return 0;
        },
        _clearCache: function() {
            this.__lineWidths = [];
            this.__lineHeights = [];
        },
        _shouldClearCache: function() {
            var shouldClear = false;
            if (this._forceClearCache) {
                this._forceClearCache = false;
                return true;
            }
            for (var prop in this._dimensionAffectingProps) {
                if (this["__" + prop] !== this[prop]) {
                    this["__" + prop] = this[prop];
                    shouldClear = true;
                }
            }
            return shouldClear;
        },
        _getLineWidth: function(ctx, lineIndex) {
            if (this.__lineWidths[lineIndex]) {
                return this.__lineWidths[lineIndex] === -1 ? this.width : this.__lineWidths[lineIndex];
            }
            var width, wordCount, line = this._textLines[lineIndex];
            if (line === "") {
                width = 0;
            } else {
                width = this._measureLine(ctx, lineIndex);
            }
            this.__lineWidths[lineIndex] = width;
            if (width && this.textAlign === "justify") {
                wordCount = line.split(/\s+/);
                if (wordCount.length > 1) {
                    this.__lineWidths[lineIndex] = -1;
                }
            }
            return width;
        },
        _getWidthOfCharSpacing: function() {
            if (this.charSpacing !== 0) {
                return this.fontSize * this.charSpacing / 1e3;
            }
            return 0;
        },
        _measureLine: function(ctx, lineIndex) {
            var line = this._textLines[lineIndex], width = ctx.measureText(line).width, additionalSpace = 0, charCount, finalWidth;
            if (this.charSpacing !== 0) {
                charCount = line.split("").length;
                additionalSpace = (charCount - 1) * this._getWidthOfCharSpacing();
            }
            finalWidth = width + additionalSpace;
            return finalWidth > 0 ? finalWidth : 0;
        },
        _renderTextDecoration: function(ctx) {
            if (!this.textDecoration) {
                return;
            }
            var halfOfVerticalBox = this.height / 2, _this = this, offsets = [];
            function renderLinesAtOffset(offsets) {
                var i, lineHeight = 0, len, j, oLen, lineWidth, lineLeftOffset, heightOfLine;
                for (i = 0, len = _this._textLines.length; i < len; i++) {
                    lineWidth = _this._getLineWidth(ctx, i);
                    lineLeftOffset = _this._getLineLeftOffset(lineWidth);
                    heightOfLine = _this._getHeightOfLine(ctx, i);
                    for (j = 0, oLen = offsets.length; j < oLen; j++) {
                        ctx.fillRect(_this._getLeftOffset() + lineLeftOffset, lineHeight + (_this._fontSizeMult - 1 + offsets[j]) * _this.fontSize - halfOfVerticalBox, lineWidth, _this.fontSize / 15);
                    }
                    lineHeight += heightOfLine;
                }
            }
            if (this.textDecoration.indexOf("underline") > -1) {
                offsets.push(.85);
            }
            if (this.textDecoration.indexOf("line-through") > -1) {
                offsets.push(.43);
            }
            if (this.textDecoration.indexOf("overline") > -1) {
                offsets.push(-.12);
            }
            if (offsets.length > 0) {
                renderLinesAtOffset(offsets);
            }
        },
        _getFontDeclaration: function() {
            return [ fabric.isLikelyNode ? this.fontWeight : this.fontStyle, fabric.isLikelyNode ? this.fontStyle : this.fontWeight, this.fontSize + "px", fabric.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily ].join(" ");
        },
        render: function(ctx, noTransform) {
            if (!this.visible) {
                return;
            }
            ctx.save();
            this._setTextStyles(ctx);
            if (this._shouldClearCache()) {
                this._initDimensions(ctx);
            }
            this.drawSelectionBackground(ctx);
            if (!noTransform) {
                this.transform(ctx);
            }
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            if (this.group && this.group.type === "path-group") {
                ctx.translate(this.left, this.top);
            }
            this._render(ctx);
            ctx.restore();
        },
        _splitTextIntoLines: function() {
            return this.text.split(this._reNewline);
        },
        toObject: function(propertiesToInclude) {
            var additionalProperties = [ "text", "fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "textDecoration", "textAlign", "textBackgroundColor", "charSpacing" ].concat(propertiesToInclude);
            return this.callSuper("toObject", additionalProperties);
        },
        toSVG: function(reviver) {
            if (!this.ctx) {
                this.ctx = fabric.util.createCanvasElement().getContext("2d");
            }
            var markup = this._createBaseSVGMarkup(), offsets = this._getSVGLeftTopOffsets(this.ctx), textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
            this._wrapSVGTextAndBg(markup, textAndBg);
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _getSVGLeftTopOffsets: function(ctx) {
            var lineTop = this._getHeightOfLine(ctx, 0), textLeft = -this.width / 2, textTop = 0;
            return {
                textLeft: textLeft + (this.group && this.group.type === "path-group" ? this.left : 0),
                textTop: textTop + (this.group && this.group.type === "path-group" ? -this.top : 0),
                lineTop: lineTop
            };
        },
        _wrapSVGTextAndBg: function(markup, textAndBg) {
            var noShadow = true, filter = this.getSvgFilter(), style = filter === "" ? "" : ' style="' + filter + '"';
            markup.push("\t<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"', style, ">\n", textAndBg.textBgRects.join(""), "\t\t<text ", this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(noShadow), '" >\n', textAndBg.textSpans.join(""), "\t\t</text>\n", "\t</g>\n");
        },
        _getSVGTextAndBg: function(textTopOffset, textLeftOffset) {
            var textSpans = [], textBgRects = [], height = 0;
            this._setSVGBg(textBgRects);
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                if (this.textBackgroundColor) {
                    this._setSVGTextLineBg(textBgRects, i, textLeftOffset, textTopOffset, height);
                }
                this._setSVGTextLineText(i, textSpans, height, textLeftOffset, textTopOffset, textBgRects);
                height += this._getHeightOfLine(this.ctx, i);
            }
            return {
                textSpans: textSpans,
                textBgRects: textBgRects
            };
        },
        _setSVGTextLineText: function(i, textSpans, height, textLeftOffset, textTopOffset) {
            var yPos = this.fontSize * (this._fontSizeMult - this._fontSizeFraction) - textTopOffset + height - this.height / 2;
            if (this.textAlign === "justify") {
                this._setSVGTextLineJustifed(i, textSpans, yPos, textLeftOffset);
                return;
            }
            textSpans.push('\t\t\t<tspan x="', toFixed(textLeftOffset + this._getLineLeftOffset(this._getLineWidth(this.ctx, i)), NUM_FRACTION_DIGITS), '" ', 'y="', toFixed(yPos, NUM_FRACTION_DIGITS), '" ', this._getFillAttributes(this.fill), ">", fabric.util.string.escapeXml(this._textLines[i]), "</tspan>\n");
        },
        _setSVGTextLineJustifed: function(i, textSpans, yPos, textLeftOffset) {
            var ctx = fabric.util.createCanvasElement().getContext("2d");
            this._setTextStyles(ctx);
            var line = this._textLines[i], words = line.split(/\s+/), wordsWidth = this._getWidthOfWords(ctx, words.join("")), widthDiff = this.width - wordsWidth, numSpaces = words.length - 1, spaceWidth = numSpaces > 0 ? widthDiff / numSpaces : 0, word, attributes = this._getFillAttributes(this.fill), len;
            textLeftOffset += this._getLineLeftOffset(this._getLineWidth(ctx, i));
            for (i = 0, len = words.length; i < len; i++) {
                word = words[i];
                textSpans.push('\t\t\t<tspan x="', toFixed(textLeftOffset, NUM_FRACTION_DIGITS), '" ', 'y="', toFixed(yPos, NUM_FRACTION_DIGITS), '" ', attributes, ">", fabric.util.string.escapeXml(word), "</tspan>\n");
                textLeftOffset += this._getWidthOfWords(ctx, word) + spaceWidth;
            }
        },
        _setSVGTextLineBg: function(textBgRects, i, textLeftOffset, textTopOffset, height) {
            textBgRects.push("\t\t<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', toFixed(textLeftOffset + this._getLineLeftOffset(this._getLineWidth(this.ctx, i)), NUM_FRACTION_DIGITS), '" y="', toFixed(height - this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(this._getLineWidth(this.ctx, i), NUM_FRACTION_DIGITS), '" height="', toFixed(this._getHeightOfLine(this.ctx, i) / this.lineHeight, NUM_FRACTION_DIGITS), '"></rect>\n');
        },
        _setSVGBg: function(textBgRects) {
            if (this.backgroundColor) {
                textBgRects.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', toFixed(-this.width / 2, NUM_FRACTION_DIGITS), '" y="', toFixed(-this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(this.width, NUM_FRACTION_DIGITS), '" height="', toFixed(this.height, NUM_FRACTION_DIGITS), '"></rect>\n');
            }
        },
        _getFillAttributes: function(value) {
            var fillColor = value && typeof value === "string" ? new fabric.Color(value) : "";
            if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
                return 'fill="' + value + '"';
            }
            return 'opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (key in this._dimensionAffectingProps) {
                this._initDimensions();
                this.setCoords();
            }
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Text.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" "));
    fabric.Text.DEFAULT_SVG_FONT_SIZE = 16;
    fabric.Text.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        var parsedAttributes = fabric.parseAttributes(element, fabric.Text.ATTRIBUTE_NAMES);
        options = fabric.util.object.extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes);
        options.top = options.top || 0;
        options.left = options.left || 0;
        if ("dx" in parsedAttributes) {
            options.left += parsedAttributes.dx;
        }
        if ("dy" in parsedAttributes) {
            options.top += parsedAttributes.dy;
        }
        if (!("fontSize" in options)) {
            options.fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
        }
        if (!options.originX) {
            options.originX = "left";
        }
        var textContent = "";
        if (!("textContent" in element)) {
            if ("firstChild" in element && element.firstChild !== null) {
                if ("data" in element.firstChild && element.firstChild.data !== null) {
                    textContent = element.firstChild.data;
                }
            }
        } else {
            textContent = element.textContent;
        }
        textContent = textContent.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
        var text = new fabric.Text(textContent, options), textHeightScaleFactor = text.getHeight() / text.height, lineHeightDiff = (text.height + text.strokeWidth) * text.lineHeight - text.height, scaledDiff = lineHeightDiff * textHeightScaleFactor, textHeight = text.getHeight() + scaledDiff, offX = 0;
        if (text.originX === "left") {
            offX = text.getWidth() / 2;
        }
        if (text.originX === "right") {
            offX = -text.getWidth() / 2;
        }
        text.set({
            left: text.getLeft() + offX,
            top: text.getTop() - textHeight / 2 + text.fontSize * (.18 + text._fontSizeFraction) / text.lineHeight
        });
        return text;
    };
    fabric.Text.fromObject = function(object, callback) {
        var text = new fabric.Text(object.text, clone(object));
        callback && callback(text);
        return text;
    };
    fabric.util.createAccessors(fabric.Text);
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var clone = fabric.util.object.clone;
    fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
        type: "i-text",
        selectionStart: 0,
        selectionEnd: 0,
        selectionColor: "rgba(17,119,255,0.3)",
        isEditing: false,
        editable: true,
        editingBorderColor: "rgba(102,153,255,0.25)",
        cursorWidth: 2,
        cursorColor: "#333",
        cursorDelay: 1e3,
        cursorDuration: 600,
        styles: null,
        caching: true,
        _reSpace: /\s|\n/,
        _currentCursorOpacity: 0,
        _selectionDirection: null,
        _abortCursorAnimation: false,
        __widthOfSpace: [],
        initialize: function(text, options) {
            this.styles = options ? options.styles || {} : {};
            this.callSuper("initialize", text, options);
            this.initBehavior();
        },
        _clearCache: function() {
            this.callSuper("_clearCache");
            this.__widthOfSpace = [];
        },
        isEmptyStyles: function() {
            if (!this.styles) {
                return true;
            }
            var obj = this.styles;
            for (var p1 in obj) {
                for (var p2 in obj[p1]) {
                    for (var p3 in obj[p1][p2]) {
                        return false;
                    }
                }
            }
            return true;
        },
        setSelectionStart: function(index) {
            index = Math.max(index, 0);
            this._updateAndFire("selectionStart", index);
        },
        setSelectionEnd: function(index) {
            index = Math.min(index, this.text.length);
            this._updateAndFire("selectionEnd", index);
        },
        _updateAndFire: function(property, index) {
            if (this[property] !== index) {
                this._fireSelectionChanged();
                this[property] = index;
            }
            this._updateTextarea();
        },
        _fireSelectionChanged: function() {
            this.fire("selection:changed");
            this.canvas && this.canvas.fire("text:selection:changed", {
                target: this
            });
        },
        getSelectionStyles: function(startIndex, endIndex) {
            if (arguments.length === 2) {
                var styles = [];
                for (var i = startIndex; i < endIndex; i++) {
                    styles.push(this.getSelectionStyles(i));
                }
                return styles;
            }
            var loc = this.get2DCursorLocation(startIndex), style = this._getStyleDeclaration(loc.lineIndex, loc.charIndex);
            return style || {};
        },
        setSelectionStyles: function(styles) {
            if (this.selectionStart === this.selectionEnd) {
                this._extendStyles(this.selectionStart, styles);
            } else {
                for (var i = this.selectionStart; i < this.selectionEnd; i++) {
                    this._extendStyles(i, styles);
                }
            }
            this._forceClearCache = true;
            return this;
        },
        _extendStyles: function(index, styles) {
            var loc = this.get2DCursorLocation(index);
            if (!this._getLineStyle(loc.lineIndex)) {
                this._setLineStyle(loc.lineIndex, {});
            }
            if (!this._getStyleDeclaration(loc.lineIndex, loc.charIndex)) {
                this._setStyleDeclaration(loc.lineIndex, loc.charIndex, {});
            }
            fabric.util.object.extend(this._getStyleDeclaration(loc.lineIndex, loc.charIndex), styles);
        },
        render: function(ctx, noTransform) {
            this.clearContextTop();
            this.callSuper("render", ctx, noTransform);
        },
        _render: function(ctx) {
            this.callSuper("_render", ctx);
            this.ctx = ctx;
            this.cursorOffsetCache = {};
            this.renderCursorOrSelection();
        },
        clearContextTop: function() {
            if (!this.active || !this.isEditing) {
                return;
            }
            if (this.canvas && this.canvas.contextTop) {
                var ctx = this.canvas.contextTop;
                ctx.save();
                ctx.transform.apply(ctx, this.canvas.viewportTransform);
                this.transform(ctx);
                this.transformMatrix && ctx.transform.apply(ctx, this.transformMatrix);
                this._clearTextArea(ctx);
                ctx.restore();
            }
        },
        renderCursorOrSelection: function() {
            if (!this.active || !this.isEditing) {
                return;
            }
            var chars = this.text.split(""), boundaries, ctx;
            if (this.canvas && this.canvas.contextTop) {
                ctx = this.canvas.contextTop;
                ctx.save();
                ctx.transform.apply(ctx, this.canvas.viewportTransform);
                this.transform(ctx);
                this.transformMatrix && ctx.transform.apply(ctx, this.transformMatrix);
                this._clearTextArea(ctx);
            } else {
                ctx = this.ctx;
                ctx.save();
            }
            if (this.selectionStart === this.selectionEnd) {
                boundaries = this._getCursorBoundaries(chars, "cursor");
                this.renderCursor(boundaries, ctx);
            } else {
                boundaries = this._getCursorBoundaries(chars, "selection");
                this.renderSelection(chars, boundaries, ctx);
            }
            ctx.restore();
        },
        _clearTextArea: function(ctx) {
            var width = this.width + 4, height = this.height + 4;
            ctx.clearRect(-width / 2, -height / 2, width, height);
        },
        get2DCursorLocation: function(selectionStart) {
            if (typeof selectionStart === "undefined") {
                selectionStart = this.selectionStart;
            }
            var len = this._textLines.length;
            for (var i = 0; i < len; i++) {
                if (selectionStart <= this._textLines[i].length) {
                    return {
                        lineIndex: i,
                        charIndex: selectionStart
                    };
                }
                selectionStart -= this._textLines[i].length + 1;
            }
            return {
                lineIndex: i - 1,
                charIndex: this._textLines[i - 1].length < selectionStart ? this._textLines[i - 1].length : selectionStart
            };
        },
        getCurrentCharStyle: function(lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
            return {
                fontSize: style && style.fontSize || this.fontSize,
                fill: style && style.fill || this.fill,
                textBackgroundColor: style && style.textBackgroundColor || this.textBackgroundColor,
                textDecoration: style && style.textDecoration || this.textDecoration,
                fontFamily: style && style.fontFamily || this.fontFamily,
                fontWeight: style && style.fontWeight || this.fontWeight,
                fontStyle: style && style.fontStyle || this.fontStyle,
                stroke: style && style.stroke || this.stroke,
                strokeWidth: style && style.strokeWidth || this.strokeWidth
            };
        },
        getCurrentCharFontSize: function(lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
            return style && style.fontSize ? style.fontSize : this.fontSize;
        },
        getCurrentCharColor: function(lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
            return style && style.fill ? style.fill : this.cursorColor;
        },
        _getCursorBoundaries: function(chars, typeOfBoundaries) {
            var left = Math.round(this._getLeftOffset()), top = this._getTopOffset(), offsets = this._getCursorBoundariesOffsets(chars, typeOfBoundaries);
            return {
                left: left,
                top: top,
                leftOffset: offsets.left + offsets.lineLeft,
                topOffset: offsets.top
            };
        },
        _getCursorBoundariesOffsets: function(chars, typeOfBoundaries) {
            if (this.cursorOffsetCache && "top" in this.cursorOffsetCache) {
                return this.cursorOffsetCache;
            }
            var lineLeftOffset = 0, lineIndex = 0, charIndex = 0, topOffset = 0, leftOffset = 0, boundaries;
            for (var i = 0; i < this.selectionStart; i++) {
                if (chars[i] === "\n") {
                    leftOffset = 0;
                    topOffset += this._getHeightOfLine(this.ctx, lineIndex);
                    lineIndex++;
                    charIndex = 0;
                } else {
                    leftOffset += this._getWidthOfChar(this.ctx, chars[i], lineIndex, charIndex);
                    charIndex++;
                }
                lineLeftOffset = this._getLineLeftOffset(this._getLineWidth(this.ctx, lineIndex));
            }
            if (typeOfBoundaries === "cursor") {
                topOffset += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, lineIndex) / this.lineHeight - this.getCurrentCharFontSize(lineIndex, charIndex) * (1 - this._fontSizeFraction);
            }
            if (this.charSpacing !== 0 && charIndex === this._textLines[lineIndex].length) {
                leftOffset -= this._getWidthOfCharSpacing();
            }
            boundaries = {
                top: topOffset,
                left: leftOffset > 0 ? leftOffset : 0,
                lineLeft: lineLeftOffset
            };
            this.cursorOffsetCache = boundaries;
            return this.cursorOffsetCache;
        },
        renderCursor: function(boundaries, ctx) {
            var cursorLocation = this.get2DCursorLocation(), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex, charHeight = this.getCurrentCharFontSize(lineIndex, charIndex), leftOffset = lineIndex === 0 && charIndex === 0 ? this._getLineLeftOffset(this._getLineWidth(ctx, lineIndex)) : boundaries.leftOffset, multiplier = this.scaleX * this.canvas.getZoom(), cursorWidth = this.cursorWidth / multiplier;
            ctx.fillStyle = this.getCurrentCharColor(lineIndex, charIndex);
            ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
            ctx.fillRect(boundaries.left + leftOffset - cursorWidth / 2, boundaries.top + boundaries.topOffset, cursorWidth, charHeight);
        },
        renderSelection: function(chars, boundaries, ctx) {
            ctx.fillStyle = this.selectionColor;
            var start = this.get2DCursorLocation(this.selectionStart), end = this.get2DCursorLocation(this.selectionEnd), startLine = start.lineIndex, endLine = end.lineIndex;
            for (var i = startLine; i <= endLine; i++) {
                var lineOffset = this._getLineLeftOffset(this._getLineWidth(ctx, i)) || 0, lineHeight = this._getHeightOfLine(this.ctx, i), realLineHeight = 0, boxWidth = 0, line = this._textLines[i];
                if (i === startLine) {
                    for (var j = 0, len = line.length; j < len; j++) {
                        if (j >= start.charIndex && (i !== endLine || j < end.charIndex)) {
                            boxWidth += this._getWidthOfChar(ctx, line[j], i, j);
                        }
                        if (j < start.charIndex) {
                            lineOffset += this._getWidthOfChar(ctx, line[j], i, j);
                        }
                    }
                    if (j === line.length) {
                        boxWidth -= this._getWidthOfCharSpacing();
                    }
                } else if (i > startLine && i < endLine) {
                    boxWidth += this._getLineWidth(ctx, i) || 5;
                } else if (i === endLine) {
                    for (var j2 = 0, j2len = end.charIndex; j2 < j2len; j2++) {
                        boxWidth += this._getWidthOfChar(ctx, line[j2], i, j2);
                    }
                    if (end.charIndex === line.length) {
                        boxWidth -= this._getWidthOfCharSpacing();
                    }
                }
                realLineHeight = lineHeight;
                if (this.lineHeight < 1 || i === endLine && this.lineHeight > 1) {
                    lineHeight /= this.lineHeight;
                }
                ctx.fillRect(boundaries.left + lineOffset, boundaries.top + boundaries.topOffset, boxWidth > 0 ? boxWidth : 0, lineHeight);
                boundaries.topOffset += realLineHeight;
            }
        },
        _renderChars: function(method, ctx, line, left, top, lineIndex, charOffset) {
            if (this.isEmptyStyles()) {
                return this._renderCharsFast(method, ctx, line, left, top);
            }
            charOffset = charOffset || 0;
            var lineHeight = this._getHeightOfLine(ctx, lineIndex), prevStyle, thisStyle, charsToRender = "";
            ctx.save();
            top -= lineHeight / this.lineHeight * this._fontSizeFraction;
            for (var i = charOffset, len = line.length + charOffset; i <= len; i++) {
                prevStyle = prevStyle || this.getCurrentCharStyle(lineIndex, i);
                thisStyle = this.getCurrentCharStyle(lineIndex, i + 1);
                if (this._hasStyleChanged(prevStyle, thisStyle) || i === len) {
                    this._renderChar(method, ctx, lineIndex, i - 1, charsToRender, left, top, lineHeight);
                    charsToRender = "";
                    prevStyle = thisStyle;
                }
                charsToRender += line[i - charOffset];
            }
            ctx.restore();
        },
        _renderCharsFast: function(method, ctx, line, left, top) {
            if (method === "fillText" && this.fill) {
                this.callSuper("_renderChars", method, ctx, line, left, top);
            }
            if (method === "strokeText" && (this.stroke && this.strokeWidth > 0 || this.skipFillStrokeCheck)) {
                this.callSuper("_renderChars", method, ctx, line, left, top);
            }
        },
        _renderChar: function(method, ctx, lineIndex, i, _char, left, top, lineHeight) {
            var charWidth, charHeight, shouldFill, shouldStroke, decl = this._getStyleDeclaration(lineIndex, i), offset, textDecoration, chars, additionalSpace, _charWidth;
            if (decl) {
                charHeight = this._getHeightOfChar(ctx, _char, lineIndex, i);
                shouldStroke = decl.stroke;
                shouldFill = decl.fill;
                textDecoration = decl.textDecoration;
            } else {
                charHeight = this.fontSize;
            }
            shouldStroke = (shouldStroke || this.stroke) && method === "strokeText";
            shouldFill = (shouldFill || this.fill) && method === "fillText";
            decl && ctx.save();
            charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i, decl || null);
            textDecoration = textDecoration || this.textDecoration;
            if (decl && decl.textBackgroundColor) {
                this._removeShadow(ctx);
            }
            if (this.charSpacing !== 0) {
                additionalSpace = this._getWidthOfCharSpacing();
                chars = _char.split("");
                charWidth = 0;
                for (var j = 0, len = chars.length, char; j < len; j++) {
                    char = chars[j];
                    shouldFill && ctx.fillText(char, left + charWidth, top);
                    shouldStroke && ctx.strokeText(char, left + charWidth, top);
                    _charWidth = ctx.measureText(char).width + additionalSpace;
                    charWidth += _charWidth > 0 ? _charWidth : 0;
                }
            } else {
                shouldFill && ctx.fillText(_char, left, top);
                shouldStroke && ctx.strokeText(_char, left, top);
            }
            if (textDecoration || textDecoration !== "") {
                offset = this._fontSizeFraction * lineHeight / this.lineHeight;
                this._renderCharDecoration(ctx, textDecoration, left, top, offset, charWidth, charHeight);
            }
            decl && ctx.restore();
            ctx.translate(charWidth, 0);
        },
        _hasStyleChanged: function(prevStyle, thisStyle) {
            return prevStyle.fill !== thisStyle.fill || prevStyle.fontSize !== thisStyle.fontSize || prevStyle.textBackgroundColor !== thisStyle.textBackgroundColor || prevStyle.textDecoration !== thisStyle.textDecoration || prevStyle.fontFamily !== thisStyle.fontFamily || prevStyle.fontWeight !== thisStyle.fontWeight || prevStyle.fontStyle !== thisStyle.fontStyle || prevStyle.stroke !== thisStyle.stroke || prevStyle.strokeWidth !== thisStyle.strokeWidth;
        },
        _renderCharDecoration: function(ctx, textDecoration, left, top, offset, charWidth, charHeight) {
            if (!textDecoration) {
                return;
            }
            var decorationWeight = charHeight / 15, positions = {
                underline: top + charHeight / 10,
                "line-through": top - charHeight * (this._fontSizeFraction + this._fontSizeMult - 1) + decorationWeight,
                overline: top - (this._fontSizeMult - this._fontSizeFraction) * charHeight
            }, decorations = [ "underline", "line-through", "overline" ], i, decoration;
            for (i = 0; i < decorations.length; i++) {
                decoration = decorations[i];
                if (textDecoration.indexOf(decoration) > -1) {
                    ctx.fillRect(left, positions[decoration], charWidth, decorationWeight);
                }
            }
        },
        _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
            if (!this.isEmptyStyles()) {
                top += this.fontSize * (this._fontSizeFraction + .03);
            }
            this.callSuper("_renderTextLine", method, ctx, line, left, top, lineIndex);
        },
        _renderTextDecoration: function(ctx) {
            if (this.isEmptyStyles()) {
                return this.callSuper("_renderTextDecoration", ctx);
            }
        },
        _renderTextLinesBackground: function(ctx) {
            this.callSuper("_renderTextLinesBackground", ctx);
            var lineTopOffset = 0, heightOfLine, lineWidth, lineLeftOffset, leftOffset = this._getLeftOffset(), topOffset = this._getTopOffset(), line, _char, style;
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                heightOfLine = this._getHeightOfLine(ctx, i);
                line = this._textLines[i];
                if (line === "" || !this.styles || !this._getLineStyle(i)) {
                    lineTopOffset += heightOfLine;
                    continue;
                }
                lineWidth = this._getLineWidth(ctx, i);
                lineLeftOffset = this._getLineLeftOffset(lineWidth);
                for (var j = 0, jlen = line.length; j < jlen; j++) {
                    style = this._getStyleDeclaration(i, j);
                    if (!style || !style.textBackgroundColor) {
                        continue;
                    }
                    _char = line[j];
                    ctx.fillStyle = style.textBackgroundColor;
                    ctx.fillRect(leftOffset + lineLeftOffset + this._getWidthOfCharsAt(ctx, i, j), topOffset + lineTopOffset, this._getWidthOfChar(ctx, _char, i, j), heightOfLine / this.lineHeight);
                }
                lineTopOffset += heightOfLine;
            }
        },
        _getCacheProp: function(_char, styleDeclaration) {
            return _char + styleDeclaration.fontSize + styleDeclaration.fontWeight + styleDeclaration.fontStyle;
        },
        _getFontCache: function(fontFamily) {
            if (!fabric.charWidthsCache[fontFamily]) {
                fabric.charWidthsCache[fontFamily] = {};
            }
            return fabric.charWidthsCache[fontFamily];
        },
        _applyCharStylesGetWidth: function(ctx, _char, lineIndex, charIndex, decl) {
            var charDecl = decl || this._getStyleDeclaration(lineIndex, charIndex), styleDeclaration = clone(charDecl), width, cacheProp, charWidthsCache;
            this._applyFontStyles(styleDeclaration);
            charWidthsCache = this._getFontCache(styleDeclaration.fontFamily);
            cacheProp = this._getCacheProp(_char, styleDeclaration);
            if (!charDecl && charWidthsCache[cacheProp] && this.caching) {
                return charWidthsCache[cacheProp];
            }
            if (typeof styleDeclaration.shadow === "string") {
                styleDeclaration.shadow = new fabric.Shadow(styleDeclaration.shadow);
            }
            var fill = styleDeclaration.fill || this.fill;
            ctx.fillStyle = fill.toLive ? fill.toLive(ctx, this) : fill;
            if (styleDeclaration.stroke) {
                ctx.strokeStyle = styleDeclaration.stroke && styleDeclaration.stroke.toLive ? styleDeclaration.stroke.toLive(ctx, this) : styleDeclaration.stroke;
            }
            ctx.lineWidth = styleDeclaration.strokeWidth || this.strokeWidth;
            ctx.font = this._getFontDeclaration.call(styleDeclaration);
            if (styleDeclaration.shadow) {
                styleDeclaration.scaleX = this.scaleX;
                styleDeclaration.scaleY = this.scaleY;
                styleDeclaration.canvas = this.canvas;
                styleDeclaration.getObjectScaling = this.getObjectScaling;
                this._setShadow.call(styleDeclaration, ctx);
            }
            if (!this.caching || !charWidthsCache[cacheProp]) {
                width = ctx.measureText(_char).width;
                this.caching && (charWidthsCache[cacheProp] = width);
                return width;
            }
            return charWidthsCache[cacheProp];
        },
        _applyFontStyles: function(styleDeclaration) {
            if (!styleDeclaration.fontFamily) {
                styleDeclaration.fontFamily = this.fontFamily;
            }
            if (!styleDeclaration.fontSize) {
                styleDeclaration.fontSize = this.fontSize;
            }
            if (!styleDeclaration.fontWeight) {
                styleDeclaration.fontWeight = this.fontWeight;
            }
            if (!styleDeclaration.fontStyle) {
                styleDeclaration.fontStyle = this.fontStyle;
            }
        },
        _getStyleDeclaration: function(lineIndex, charIndex, returnCloneOrEmpty) {
            if (returnCloneOrEmpty) {
                return this.styles[lineIndex] && this.styles[lineIndex][charIndex] ? clone(this.styles[lineIndex][charIndex]) : {};
            }
            return this.styles[lineIndex] && this.styles[lineIndex][charIndex] ? this.styles[lineIndex][charIndex] : null;
        },
        _setStyleDeclaration: function(lineIndex, charIndex, style) {
            this.styles[lineIndex][charIndex] = style;
        },
        _deleteStyleDeclaration: function(lineIndex, charIndex) {
            delete this.styles[lineIndex][charIndex];
        },
        _getLineStyle: function(lineIndex) {
            return this.styles[lineIndex];
        },
        _setLineStyle: function(lineIndex, style) {
            this.styles[lineIndex] = style;
        },
        _deleteLineStyle: function(lineIndex) {
            delete this.styles[lineIndex];
        },
        _getWidthOfChar: function(ctx, _char, lineIndex, charIndex) {
            if (!this._isMeasuring && this.textAlign === "justify" && this._reSpacesAndTabs.test(_char)) {
                return this._getWidthOfSpace(ctx, lineIndex);
            }
            ctx.save();
            var width = this._applyCharStylesGetWidth(ctx, _char, lineIndex, charIndex);
            if (this.charSpacing !== 0) {
                width += this._getWidthOfCharSpacing();
            }
            ctx.restore();
            return width > 0 ? width : 0;
        },
        _getHeightOfChar: function(ctx, lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex);
            return style && style.fontSize ? style.fontSize : this.fontSize;
        },
        _getWidthOfCharsAt: function(ctx, lineIndex, charIndex) {
            var width = 0, i, _char;
            for (i = 0; i < charIndex; i++) {
                _char = this._textLines[lineIndex][i];
                width += this._getWidthOfChar(ctx, _char, lineIndex, i);
            }
            return width;
        },
        _measureLine: function(ctx, lineIndex) {
            this._isMeasuring = true;
            var width = this._getWidthOfCharsAt(ctx, lineIndex, this._textLines[lineIndex].length);
            if (this.charSpacing !== 0) {
                width -= this._getWidthOfCharSpacing();
            }
            this._isMeasuring = false;
            return width > 0 ? width : 0;
        },
        _getWidthOfSpace: function(ctx, lineIndex) {
            if (this.__widthOfSpace[lineIndex]) {
                return this.__widthOfSpace[lineIndex];
            }
            var line = this._textLines[lineIndex], wordsWidth = this._getWidthOfWords(ctx, line, lineIndex, 0), widthDiff = this.width - wordsWidth, numSpaces = line.length - line.replace(this._reSpacesAndTabs, "").length, width = Math.max(widthDiff / numSpaces, ctx.measureText(" ").width);
            this.__widthOfSpace[lineIndex] = width;
            return width;
        },
        _getWidthOfWords: function(ctx, line, lineIndex, charOffset) {
            var width = 0;
            for (var charIndex = 0; charIndex < line.length; charIndex++) {
                var _char = line[charIndex];
                if (!_char.match(/\s/)) {
                    width += this._getWidthOfChar(ctx, _char, lineIndex, charIndex + charOffset);
                }
            }
            return width;
        },
        _getHeightOfLine: function(ctx, lineIndex) {
            if (this.__lineHeights[lineIndex]) {
                return this.__lineHeights[lineIndex];
            }
            var line = this._textLines[lineIndex], maxHeight = this._getHeightOfChar(ctx, lineIndex, 0);
            for (var i = 1, len = line.length; i < len; i++) {
                var currentCharHeight = this._getHeightOfChar(ctx, lineIndex, i);
                if (currentCharHeight > maxHeight) {
                    maxHeight = currentCharHeight;
                }
            }
            this.__lineHeights[lineIndex] = maxHeight * this.lineHeight * this._fontSizeMult;
            return this.__lineHeights[lineIndex];
        },
        _getTextHeight: function(ctx) {
            var lineHeight, height = 0;
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                lineHeight = this._getHeightOfLine(ctx, i);
                height += i === len - 1 ? lineHeight / this.lineHeight : lineHeight;
            }
            return height;
        },
        toObject: function(propertiesToInclude) {
            return fabric.util.object.extend(this.callSuper("toObject", propertiesToInclude), {
                styles: clone(this.styles, true)
            });
        }
    });
    fabric.IText.fromObject = function(object, callback) {
        var iText = new fabric.IText(object.text, clone(object));
        callback && callback(iText);
        return iText;
    };
})();

(function() {
    var clone = fabric.util.object.clone;
    fabric.util.object.extend(fabric.IText.prototype, {
        initBehavior: function() {
            this.initAddedHandler();
            this.initRemovedHandler();
            this.initCursorSelectionHandlers();
            this.initDoubleClickSimulation();
            this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        },
        initSelectedHandler: function() {
            this.on("selected", function() {
                var _this = this;
                setTimeout(function() {
                    _this.selected = true;
                }, 100);
            });
        },
        initAddedHandler: function() {
            var _this = this;
            this.on("added", function() {
                var canvas = _this.canvas;
                if (canvas) {
                    if (!canvas._hasITextHandlers) {
                        canvas._hasITextHandlers = true;
                        _this._initCanvasHandlers(canvas);
                    }
                    canvas._iTextInstances = canvas._iTextInstances || [];
                    canvas._iTextInstances.push(_this);
                }
            });
        },
        initRemovedHandler: function() {
            var _this = this;
            this.on("removed", function() {
                var canvas = _this.canvas;
                if (canvas) {
                    canvas._iTextInstances = canvas._iTextInstances || [];
                    fabric.util.removeFromArray(canvas._iTextInstances, _this);
                    if (canvas._iTextInstances.length === 0) {
                        canvas._hasITextHandlers = false;
                        _this._removeCanvasHandlers(canvas);
                    }
                }
            });
        },
        _initCanvasHandlers: function(canvas) {
            canvas._canvasITextSelectionClearedHanlder = function() {
                fabric.IText.prototype.exitEditingOnOthers(canvas);
            }.bind(this);
            canvas._mouseUpITextHandler = function() {
                if (canvas._iTextInstances) {
                    canvas._iTextInstances.forEach(function(obj) {
                        obj.__isMousedown = false;
                    });
                }
            }.bind(this);
            canvas.on("selection:cleared", canvas._canvasITextSelectionClearedHanlder);
            canvas.on("object:selected", canvas._canvasITextSelectionClearedHanlder);
            canvas.on("mouse:up", canvas._mouseUpITextHandler);
        },
        _removeCanvasHandlers: function(canvas) {
            canvas.off("selection:cleared", canvas._canvasITextSelectionClearedHanlder);
            canvas.off("object:selected", canvas._canvasITextSelectionClearedHanlder);
            canvas.off("mouse:up", canvas._mouseUpITextHandler);
        },
        _tick: function() {
            this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete");
        },
        _animateCursor: function(obj, targetOpacity, duration, completeMethod) {
            var tickState;
            tickState = {
                isAborted: false,
                abort: function() {
                    this.isAborted = true;
                }
            };
            obj.animate("_currentCursorOpacity", targetOpacity, {
                duration: duration,
                onComplete: function() {
                    if (!tickState.isAborted) {
                        obj[completeMethod]();
                    }
                },
                onChange: function() {
                    if (obj.canvas && obj.selectionStart === obj.selectionEnd) {
                        obj.renderCursorOrSelection();
                    }
                },
                abort: function() {
                    return tickState.isAborted;
                }
            });
            return tickState;
        },
        _onTickComplete: function() {
            var _this = this;
            if (this._cursorTimeout1) {
                clearTimeout(this._cursorTimeout1);
            }
            this._cursorTimeout1 = setTimeout(function() {
                _this._currentTickCompleteState = _this._animateCursor(_this, 0, this.cursorDuration / 2, "_tick");
            }, 100);
        },
        initDelayedCursor: function(restart) {
            var _this = this, delay = restart ? 0 : this.cursorDelay;
            this.abortCursorAnimation();
            this._currentCursorOpacity = 1;
            this._cursorTimeout2 = setTimeout(function() {
                _this._tick();
            }, delay);
        },
        abortCursorAnimation: function() {
            var shouldClear = this._currentTickState || this._currentTickCompleteState;
            this._currentTickState && this._currentTickState.abort();
            this._currentTickCompleteState && this._currentTickCompleteState.abort();
            clearTimeout(this._cursorTimeout1);
            clearTimeout(this._cursorTimeout2);
            this._currentCursorOpacity = 0;
            if (shouldClear) {
                this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx);
            }
        },
        selectAll: function() {
            this.selectionStart = 0;
            this.selectionEnd = this.text.length;
            this._fireSelectionChanged();
            this._updateTextarea();
        },
        getSelectedText: function() {
            return this.text.slice(this.selectionStart, this.selectionEnd);
        },
        findWordBoundaryLeft: function(startFrom) {
            var offset = 0, index = startFrom - 1;
            if (this._reSpace.test(this.text.charAt(index))) {
                while (this._reSpace.test(this.text.charAt(index))) {
                    offset++;
                    index--;
                }
            }
            while (/\S/.test(this.text.charAt(index)) && index > -1) {
                offset++;
                index--;
            }
            return startFrom - offset;
        },
        findWordBoundaryRight: function(startFrom) {
            var offset = 0, index = startFrom;
            if (this._reSpace.test(this.text.charAt(index))) {
                while (this._reSpace.test(this.text.charAt(index))) {
                    offset++;
                    index++;
                }
            }
            while (/\S/.test(this.text.charAt(index)) && index < this.text.length) {
                offset++;
                index++;
            }
            return startFrom + offset;
        },
        findLineBoundaryLeft: function(startFrom) {
            var offset = 0, index = startFrom - 1;
            while (!/\n/.test(this.text.charAt(index)) && index > -1) {
                offset++;
                index--;
            }
            return startFrom - offset;
        },
        findLineBoundaryRight: function(startFrom) {
            var offset = 0, index = startFrom;
            while (!/\n/.test(this.text.charAt(index)) && index < this.text.length) {
                offset++;
                index++;
            }
            return startFrom + offset;
        },
        getNumNewLinesInSelectedText: function() {
            var selectedText = this.getSelectedText(), numNewLines = 0;
            for (var i = 0, len = selectedText.length; i < len; i++) {
                if (selectedText[i] === "\n") {
                    numNewLines++;
                }
            }
            return numNewLines;
        },
        searchWordBoundary: function(selectionStart, direction) {
            var index = this._reSpace.test(this.text.charAt(selectionStart)) ? selectionStart - 1 : selectionStart, _char = this.text.charAt(index), reNonWord = /[ \n\.,;!\?\-]/;
            while (!reNonWord.test(_char) && index > 0 && index < this.text.length) {
                index += direction;
                _char = this.text.charAt(index);
            }
            if (reNonWord.test(_char) && _char !== "\n") {
                index += direction === 1 ? 0 : 1;
            }
            return index;
        },
        selectWord: function(selectionStart) {
            selectionStart = selectionStart || this.selectionStart;
            var newSelectionStart = this.searchWordBoundary(selectionStart, -1), newSelectionEnd = this.searchWordBoundary(selectionStart, 1);
            this.selectionStart = newSelectionStart;
            this.selectionEnd = newSelectionEnd;
            this._fireSelectionChanged();
            this._updateTextarea();
            this.renderCursorOrSelection();
        },
        selectLine: function(selectionStart) {
            selectionStart = selectionStart || this.selectionStart;
            var newSelectionStart = this.findLineBoundaryLeft(selectionStart), newSelectionEnd = this.findLineBoundaryRight(selectionStart);
            this.selectionStart = newSelectionStart;
            this.selectionEnd = newSelectionEnd;
            this._fireSelectionChanged();
            this._updateTextarea();
        },
        enterEditing: function(e) {
            if (this.isEditing || !this.editable) {
                return;
            }
            if (this.canvas) {
                this.exitEditingOnOthers(this.canvas);
            }
            this.isEditing = true;
            this.initHiddenTextarea(e);
            this.hiddenTextarea.focus();
            this._updateTextarea();
            this._saveEditingProps();
            this._setEditingProps();
            this._textBeforeEdit = this.text;
            this._tick();
            this.fire("editing:entered");
            if (!this.canvas) {
                return this;
            }
            this.canvas.fire("text:editing:entered", {
                target: this
            });
            this.initMouseMoveHandler();
            this.canvas.renderAll();
            return this;
        },
        exitEditingOnOthers: function(canvas) {
            if (canvas._iTextInstances) {
                canvas._iTextInstances.forEach(function(obj) {
                    obj.selected = false;
                    if (obj.isEditing) {
                        obj.exitEditing();
                    }
                });
            }
        },
        initMouseMoveHandler: function() {
            this.canvas.on("mouse:move", this.mouseMoveHandler);
        },
        mouseMoveHandler: function(options) {
            if (!this.__isMousedown || !this.isEditing) {
                return;
            }
            var newSelectionStart = this.getSelectionStartFromPointer(options.e), currentStart = this.selectionStart, currentEnd = this.selectionEnd;
            if (newSelectionStart === this.__selectionStartOnMouseDown) {
                return;
            }
            if (newSelectionStart > this.__selectionStartOnMouseDown) {
                this.selectionStart = this.__selectionStartOnMouseDown;
                this.selectionEnd = newSelectionStart;
            } else {
                this.selectionStart = newSelectionStart;
                this.selectionEnd = this.__selectionStartOnMouseDown;
            }
            if (this.selectionStart !== currentStart || this.selectionEnd !== currentEnd) {
                this._fireSelectionChanged();
                this._updateTextarea();
                this.renderCursorOrSelection();
            }
        },
        _setEditingProps: function() {
            this.hoverCursor = "text";
            if (this.canvas) {
                this.canvas.defaultCursor = this.canvas.moveCursor = "text";
            }
            this.borderColor = this.editingBorderColor;
            this.hasControls = this.selectable = false;
            this.lockMovementX = this.lockMovementY = true;
        },
        _updateTextarea: function() {
            if (!this.hiddenTextarea || this.inCompositionMode) {
                return;
            }
            this.cursorOffsetCache = {};
            this.hiddenTextarea.value = this.text;
            this.hiddenTextarea.selectionStart = this.selectionStart;
            this.hiddenTextarea.selectionEnd = this.selectionEnd;
            if (this.selectionStart === this.selectionEnd) {
                var style = this._calcTextareaPosition();
                this.hiddenTextarea.style.left = style.left;
                this.hiddenTextarea.style.top = style.top;
                this.hiddenTextarea.style.fontSize = style.fontSize;
            }
        },
        _calcTextareaPosition: function() {
            if (!this.canvas) {
                return {
                    x: 1,
                    y: 1
                };
            }
            var chars = this.text.split(""), boundaries = this._getCursorBoundaries(chars, "cursor"), cursorLocation = this.get2DCursorLocation(), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex, charHeight = this.getCurrentCharFontSize(lineIndex, charIndex), leftOffset = lineIndex === 0 && charIndex === 0 ? this._getLineLeftOffset(this._getLineWidth(this.ctx, lineIndex)) : boundaries.leftOffset, m = this.calcTransformMatrix(), p = {
                x: boundaries.left + leftOffset,
                y: boundaries.top + boundaries.topOffset + charHeight
            }, upperCanvas = this.canvas.upperCanvasEl, maxWidth = upperCanvas.width - charHeight, maxHeight = upperCanvas.height - charHeight;
            p = fabric.util.transformPoint(p, m);
            p = fabric.util.transformPoint(p, this.canvas.viewportTransform);
            if (p.x < 0) {
                p.x = 0;
            }
            if (p.x > maxWidth) {
                p.x = maxWidth;
            }
            if (p.y < 0) {
                p.y = 0;
            }
            if (p.y > maxHeight) {
                p.y = maxHeight;
            }
            p.x += this.canvas._offset.left;
            p.y += this.canvas._offset.top;
            return {
                left: p.x + "px",
                top: p.y + "px",
                fontSize: charHeight
            };
        },
        _saveEditingProps: function() {
            this._savedProps = {
                hasControls: this.hasControls,
                borderColor: this.borderColor,
                lockMovementX: this.lockMovementX,
                lockMovementY: this.lockMovementY,
                hoverCursor: this.hoverCursor,
                defaultCursor: this.canvas && this.canvas.defaultCursor,
                moveCursor: this.canvas && this.canvas.moveCursor
            };
        },
        _restoreEditingProps: function() {
            if (!this._savedProps) {
                return;
            }
            this.hoverCursor = this._savedProps.overCursor;
            this.hasControls = this._savedProps.hasControls;
            this.borderColor = this._savedProps.borderColor;
            this.lockMovementX = this._savedProps.lockMovementX;
            this.lockMovementY = this._savedProps.lockMovementY;
            if (this.canvas) {
                this.canvas.defaultCursor = this._savedProps.defaultCursor;
                this.canvas.moveCursor = this._savedProps.moveCursor;
            }
        },
        exitEditing: function() {
            var isTextChanged = this._textBeforeEdit !== this.text;
            this.selected = false;
            this.isEditing = false;
            this.selectable = true;
            this.selectionEnd = this.selectionStart;
            this.hiddenTextarea && this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
            this.hiddenTextarea = null;
            this.abortCursorAnimation();
            this._restoreEditingProps();
            this._currentCursorOpacity = 0;
            this.fire("editing:exited");
            isTextChanged && this.fire("modified");
            if (this.canvas) {
                this.canvas.off("mouse:move", this.mouseMoveHandler);
                this.canvas.fire("text:editing:exited", {
                    target: this
                });
                isTextChanged && this.canvas.fire("object:modified", {
                    target: this
                });
            }
            return this;
        },
        _removeExtraneousStyles: function() {
            for (var prop in this.styles) {
                if (!this._textLines[prop]) {
                    delete this.styles[prop];
                }
            }
        },
        _removeCharsFromTo: function(start, end) {
            while (end !== start) {
                this._removeSingleCharAndStyle(start + 1);
                end--;
            }
            this.selectionStart = start;
            this.selectionEnd = start;
        },
        _removeSingleCharAndStyle: function(index) {
            var isBeginningOfLine = this.text[index - 1] === "\n", indexStyle = isBeginningOfLine ? index : index - 1;
            this.removeStyleObject(isBeginningOfLine, indexStyle);
            this.text = this.text.slice(0, index - 1) + this.text.slice(index);
            this._textLines = this._splitTextIntoLines();
        },
        insertChars: function(_chars, useCopiedStyle) {
            var style;
            if (this.selectionEnd - this.selectionStart > 1) {
                this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
            }
            if (!useCopiedStyle && this.isEmptyStyles()) {
                this.insertChar(_chars, false);
                return;
            }
            for (var i = 0, len = _chars.length; i < len; i++) {
                if (useCopiedStyle) {
                    style = fabric.copiedTextStyle[i];
                }
                this.insertChar(_chars[i], i < len - 1, style);
            }
        },
        insertChar: function(_char, skipUpdate, styleObject) {
            var isEndOfLine = this.text[this.selectionStart] === "\n";
            this.text = this.text.slice(0, this.selectionStart) + _char + this.text.slice(this.selectionEnd);
            this._textLines = this._splitTextIntoLines();
            this.insertStyleObjects(_char, isEndOfLine, styleObject);
            this.selectionStart += _char.length;
            this.selectionEnd = this.selectionStart;
            if (skipUpdate) {
                return;
            }
            this._updateTextarea();
            this.setCoords();
            this._fireSelectionChanged();
            this.fire("changed");
            this.canvas && this.canvas.fire("text:changed", {
                target: this
            });
            this.canvas && this.canvas.renderAll();
        },
        insertNewlineStyleObject: function(lineIndex, charIndex, isEndOfLine) {
            this.shiftLineStyles(lineIndex, +1);
            if (!this.styles[lineIndex + 1]) {
                this.styles[lineIndex + 1] = {};
            }
            var currentCharStyle = {}, newLineStyles = {};
            if (this.styles[lineIndex] && this.styles[lineIndex][charIndex - 1]) {
                currentCharStyle = this.styles[lineIndex][charIndex - 1];
            }
            if (isEndOfLine) {
                newLineStyles[0] = clone(currentCharStyle);
                this.styles[lineIndex + 1] = newLineStyles;
            } else {
                for (var index in this.styles[lineIndex]) {
                    if (parseInt(index, 10) >= charIndex) {
                        newLineStyles[parseInt(index, 10) - charIndex] = this.styles[lineIndex][index];
                        delete this.styles[lineIndex][index];
                    }
                }
                this.styles[lineIndex + 1] = newLineStyles;
            }
            this._forceClearCache = true;
        },
        insertCharStyleObject: function(lineIndex, charIndex, style) {
            var currentLineStyles = this.styles[lineIndex], currentLineStylesCloned = clone(currentLineStyles);
            if (charIndex === 0 && !style) {
                charIndex = 1;
            }
            for (var index in currentLineStylesCloned) {
                var numericIndex = parseInt(index, 10);
                if (numericIndex >= charIndex) {
                    currentLineStyles[numericIndex + 1] = currentLineStylesCloned[numericIndex];
                    if (!currentLineStylesCloned[numericIndex - 1]) {
                        delete currentLineStyles[numericIndex];
                    }
                }
            }
            this.styles[lineIndex][charIndex] = style || clone(currentLineStyles[charIndex - 1]);
            this._forceClearCache = true;
        },
        insertStyleObjects: function(_chars, isEndOfLine, styleObject) {
            var cursorLocation = this.get2DCursorLocation(), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex;
            if (!this._getLineStyle(lineIndex)) {
                this._setLineStyle(lineIndex, {});
            }
            if (_chars === "\n") {
                this.insertNewlineStyleObject(lineIndex, charIndex, isEndOfLine);
            } else {
                this.insertCharStyleObject(lineIndex, charIndex, styleObject);
            }
        },
        shiftLineStyles: function(lineIndex, offset) {
            var clonedStyles = clone(this.styles);
            for (var line in this.styles) {
                var numericLine = parseInt(line, 10);
                if (numericLine > lineIndex) {
                    this.styles[numericLine + offset] = clonedStyles[numericLine];
                    if (!clonedStyles[numericLine - offset]) {
                        delete this.styles[numericLine];
                    }
                }
            }
        },
        removeStyleObject: function(isBeginningOfLine, index) {
            var cursorLocation = this.get2DCursorLocation(index), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex;
            this._removeStyleObject(isBeginningOfLine, cursorLocation, lineIndex, charIndex);
        },
        _getTextOnPreviousLine: function(lIndex) {
            return this._textLines[lIndex - 1];
        },
        _removeStyleObject: function(isBeginningOfLine, cursorLocation, lineIndex, charIndex) {
            if (isBeginningOfLine) {
                var textOnPreviousLine = this._getTextOnPreviousLine(cursorLocation.lineIndex), newCharIndexOnPrevLine = textOnPreviousLine ? textOnPreviousLine.length : 0;
                if (!this.styles[lineIndex - 1]) {
                    this.styles[lineIndex - 1] = {};
                }
                for (charIndex in this.styles[lineIndex]) {
                    this.styles[lineIndex - 1][parseInt(charIndex, 10) + newCharIndexOnPrevLine] = this.styles[lineIndex][charIndex];
                }
                this.shiftLineStyles(cursorLocation.lineIndex, -1);
            } else {
                var currentLineStyles = this.styles[lineIndex];
                if (currentLineStyles) {
                    delete currentLineStyles[charIndex];
                }
                var currentLineStylesCloned = clone(currentLineStyles);
                for (var i in currentLineStylesCloned) {
                    var numericIndex = parseInt(i, 10);
                    if (numericIndex >= charIndex && numericIndex !== 0) {
                        currentLineStyles[numericIndex - 1] = currentLineStylesCloned[numericIndex];
                        delete currentLineStyles[numericIndex];
                    }
                }
            }
        },
        insertNewline: function() {
            this.insertChars("\n");
        },
        setSelectionStartEndWithShift: function(start, end, newSelection) {
            if (newSelection <= start) {
                if (end === start) {
                    this._selectionDirection = "left";
                } else if (this._selectionDirection === "right") {
                    this._selectionDirection = "left";
                    this.selectionEnd = start;
                }
                this.selectionStart = newSelection;
            } else if (newSelection > start && newSelection < end) {
                if (this._selectionDirection === "right") {
                    this.selectionEnd = newSelection;
                } else {
                    this.selectionStart = newSelection;
                }
            } else {
                if (end === start) {
                    this._selectionDirection = "right";
                } else if (this._selectionDirection === "left") {
                    this._selectionDirection = "right";
                    this.selectionStart = end;
                }
                this.selectionEnd = newSelection;
            }
        },
        setSelectionInBoundaries: function() {
            var length = this.text.length;
            if (this.selectionStart > length) {
                this.selectionStart = length;
            } else if (this.selectionStart < 0) {
                this.selectionStart = 0;
            }
            if (this.selectionEnd > length) {
                this.selectionEnd = length;
            } else if (this.selectionEnd < 0) {
                this.selectionEnd = 0;
            }
        }
    });
})();

fabric.util.object.extend(fabric.IText.prototype, {
    initDoubleClickSimulation: function() {
        this.__lastClickTime = +new Date();
        this.__lastLastClickTime = +new Date();
        this.__lastPointer = {};
        this.on("mousedown", this.onMouseDown.bind(this));
    },
    onMouseDown: function(options) {
        this.__newClickTime = +new Date();
        var newPointer = this.canvas.getPointer(options.e);
        if (this.isTripleClick(newPointer)) {
            this.fire("tripleclick", options);
            this._stopEvent(options.e);
        } else if (this.isDoubleClick(newPointer)) {
            this.fire("dblclick", options);
            this._stopEvent(options.e);
        }
        this.__lastLastClickTime = this.__lastClickTime;
        this.__lastClickTime = this.__newClickTime;
        this.__lastPointer = newPointer;
        this.__lastIsEditing = this.isEditing;
        this.__lastSelected = this.selected;
    },
    isDoubleClick: function(newPointer) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastPointer.x === newPointer.x && this.__lastPointer.y === newPointer.y && this.__lastIsEditing;
    },
    isTripleClick: function(newPointer) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === newPointer.x && this.__lastPointer.y === newPointer.y;
    },
    _stopEvent: function(e) {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    },
    initCursorSelectionHandlers: function() {
        this.initSelectedHandler();
        this.initMousedownHandler();
        this.initMouseupHandler();
        this.initClicks();
    },
    initClicks: function() {
        this.on("dblclick", function(options) {
            this.selectWord(this.getSelectionStartFromPointer(options.e));
        });
        this.on("tripleclick", function(options) {
            this.selectLine(this.getSelectionStartFromPointer(options.e));
        });
    },
    initMousedownHandler: function() {
        this.on("mousedown", function(options) {
            if (!this.editable) {
                return;
            }
            var pointer = this.canvas.getPointer(options.e);
            this.__mousedownX = pointer.x;
            this.__mousedownY = pointer.y;
            this.__isMousedown = true;
            if (this.selected) {
                this.setCursorByClick(options.e);
            }
            if (this.isEditing) {
                this.__selectionStartOnMouseDown = this.selectionStart;
                if (this.selectionStart === this.selectionEnd) {
                    this.abortCursorAnimation();
                }
                this.renderCursorOrSelection();
            }
        });
    },
    _isObjectMoved: function(e) {
        var pointer = this.canvas.getPointer(e);
        return this.__mousedownX !== pointer.x || this.__mousedownY !== pointer.y;
    },
    initMouseupHandler: function() {
        this.on("mouseup", function(options) {
            this.__isMousedown = false;
            if (!this.editable || this._isObjectMoved(options.e)) {
                return;
            }
            if (this.__lastSelected && !this.__corner) {
                this.enterEditing(options.e);
                if (this.selectionStart === this.selectionEnd) {
                    this.initDelayedCursor(true);
                } else {
                    this.renderCursorOrSelection();
                }
            }
            this.selected = true;
        });
    },
    setCursorByClick: function(e) {
        var newSelection = this.getSelectionStartFromPointer(e), start = this.selectionStart, end = this.selectionEnd;
        if (e.shiftKey) {
            this.setSelectionStartEndWithShift(start, end, newSelection);
        } else {
            this.selectionStart = newSelection;
            this.selectionEnd = newSelection;
        }
        this._fireSelectionChanged();
        this._updateTextarea();
    },
    getSelectionStartFromPointer: function(e) {
        var mouseOffset = this.getLocalPointer(e), prevWidth = 0, width = 0, height = 0, charIndex = 0, newSelectionStart, line;
        for (var i = 0, len = this._textLines.length; i < len; i++) {
            line = this._textLines[i];
            height += this._getHeightOfLine(this.ctx, i) * this.scaleY;
            var widthOfLine = this._getLineWidth(this.ctx, i), lineLeftOffset = this._getLineLeftOffset(widthOfLine);
            width = lineLeftOffset * this.scaleX;
            for (var j = 0, jlen = line.length; j < jlen; j++) {
                prevWidth = width;
                width += this._getWidthOfChar(this.ctx, line[j], i, this.flipX ? jlen - j : j) * this.scaleX;
                if (height <= mouseOffset.y || width <= mouseOffset.x) {
                    charIndex++;
                    continue;
                }
                return this._getNewSelectionStartFromOffset(mouseOffset, prevWidth, width, charIndex + i, jlen);
            }
            if (mouseOffset.y < height) {
                return this._getNewSelectionStartFromOffset(mouseOffset, prevWidth, width, charIndex + i - 1, jlen);
            }
        }
        if (typeof newSelectionStart === "undefined") {
            return this.text.length;
        }
    },
    _getNewSelectionStartFromOffset: function(mouseOffset, prevWidth, width, index, jlen) {
        var distanceBtwLastCharAndCursor = mouseOffset.x - prevWidth, distanceBtwNextCharAndCursor = width - mouseOffset.x, offset = distanceBtwNextCharAndCursor > distanceBtwLastCharAndCursor ? 0 : 1, newSelectionStart = index + offset;
        if (this.flipX) {
            newSelectionStart = jlen - newSelectionStart;
        }
        if (newSelectionStart > this.text.length) {
            newSelectionStart = this.text.length;
        }
        return newSelectionStart;
    }
});

fabric.util.object.extend(fabric.IText.prototype, {
    initHiddenTextarea: function() {
        this.hiddenTextarea = fabric.document.createElement("textarea");
        this.hiddenTextarea.setAttribute("autocapitalize", "off");
        var style = this._calcTextareaPosition();
        this.hiddenTextarea.style.cssText = "position: absolute; top: " + style.top + "; left: " + style.left + ";" + " opacity: 0; width: 0px; height: 0px; z-index: -999;";
        fabric.document.body.appendChild(this.hiddenTextarea);
        fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "cut", this.cut.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this));
        if (!this._clickHandlerInitialized && this.canvas) {
            fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this));
            this._clickHandlerInitialized = true;
        }
    },
    _keysMap: {
        8: "removeChars",
        9: "exitEditing",
        27: "exitEditing",
        13: "insertNewline",
        33: "moveCursorUp",
        34: "moveCursorDown",
        35: "moveCursorRight",
        36: "moveCursorLeft",
        37: "moveCursorLeft",
        38: "moveCursorUp",
        39: "moveCursorRight",
        40: "moveCursorDown",
        46: "forwardDelete"
    },
    _ctrlKeysMapUp: {
        67: "copy",
        88: "cut"
    },
    _ctrlKeysMapDown: {
        65: "selectAll"
    },
    onClick: function() {
        this.hiddenTextarea && this.hiddenTextarea.focus();
    },
    onKeyDown: function(e) {
        if (!this.isEditing) {
            return;
        }
        if (e.keyCode in this._keysMap) {
            this[this._keysMap[e.keyCode]](e);
        } else if (e.keyCode in this._ctrlKeysMapDown && (e.ctrlKey || e.metaKey)) {
            this[this._ctrlKeysMapDown[e.keyCode]](e);
        } else {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        this.canvas && this.canvas.renderAll();
    },
    onKeyUp: function(e) {
        if (!this.isEditing || this._copyDone) {
            this._copyDone = false;
            return;
        }
        if (e.keyCode in this._ctrlKeysMapUp && (e.ctrlKey || e.metaKey)) {
            this[this._ctrlKeysMapUp[e.keyCode]](e);
        } else {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        this.canvas && this.canvas.renderAll();
    },
    onInput: function(e) {
        if (!this.isEditing || this.inCompositionMode) {
            return;
        }
        var offset = this.selectionStart || 0, offsetEnd = this.selectionEnd || 0, textLength = this.text.length, newTextLength = this.hiddenTextarea.value.length, diff, charsToInsert, start;
        if (newTextLength > textLength) {
            start = this._selectionDirection === "left" ? offsetEnd : offset;
            diff = newTextLength - textLength;
            charsToInsert = this.hiddenTextarea.value.slice(start, start + diff);
        } else {
            diff = newTextLength - textLength + offsetEnd - offset;
            charsToInsert = this.hiddenTextarea.value.slice(offset, offset + diff);
        }
        this.insertChars(charsToInsert);
        e.stopPropagation();
    },
    onCompositionStart: function() {
        this.inCompositionMode = true;
        this.prevCompositionLength = 0;
        this.compositionStart = this.selectionStart;
    },
    onCompositionEnd: function() {
        this.inCompositionMode = false;
    },
    onCompositionUpdate: function(e) {
        var data = e.data;
        this.selectionStart = this.compositionStart;
        this.selectionEnd = this.selectionEnd === this.selectionStart ? this.compositionStart + this.prevCompositionLength : this.selectionEnd;
        this.insertChars(data, false);
        this.prevCompositionLength = data.length;
    },
    forwardDelete: function(e) {
        if (this.selectionStart === this.selectionEnd) {
            if (this.selectionStart === this.text.length) {
                return;
            }
            this.moveCursorRight(e);
        }
        this.removeChars(e);
    },
    copy: function(e) {
        if (this.selectionStart === this.selectionEnd) {
            return;
        }
        var selectedText = this.getSelectedText(), clipboardData = this._getClipboardData(e);
        if (clipboardData) {
            clipboardData.setData("text", selectedText);
        }
        fabric.copiedText = selectedText;
        fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd);
        e.stopImmediatePropagation();
        e.preventDefault();
        this._copyDone = true;
    },
    paste: function(e) {
        var copiedText = null, clipboardData = this._getClipboardData(e), useCopiedStyle = true;
        if (clipboardData) {
            copiedText = clipboardData.getData("text").replace(/\r/g, "");
            if (!fabric.copiedTextStyle || fabric.copiedText !== copiedText) {
                useCopiedStyle = false;
            }
        } else {
            copiedText = fabric.copiedText;
        }
        if (copiedText) {
            this.insertChars(copiedText, useCopiedStyle);
        }
        e.stopImmediatePropagation();
        e.preventDefault();
    },
    cut: function(e) {
        if (this.selectionStart === this.selectionEnd) {
            return;
        }
        this.copy(e);
        this.removeChars(e);
    },
    _getClipboardData: function(e) {
        return e && e.clipboardData || fabric.window.clipboardData;
    },
    _getWidthBeforeCursor: function(lineIndex, charIndex) {
        var textBeforeCursor = this._textLines[lineIndex].slice(0, charIndex), widthOfLine = this._getLineWidth(this.ctx, lineIndex), widthBeforeCursor = this._getLineLeftOffset(widthOfLine), _char;
        for (var i = 0, len = textBeforeCursor.length; i < len; i++) {
            _char = textBeforeCursor[i];
            widthBeforeCursor += this._getWidthOfChar(this.ctx, _char, lineIndex, i);
        }
        return widthBeforeCursor;
    },
    getDownCursorOffset: function(e, isRight) {
        var selectionProp = this._getSelectionForOffset(e, isRight), cursorLocation = this.get2DCursorLocation(selectionProp), lineIndex = cursorLocation.lineIndex;
        if (lineIndex === this._textLines.length - 1 || e.metaKey || e.keyCode === 34) {
            return this.text.length - selectionProp;
        }
        var charIndex = cursorLocation.charIndex, widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex), indexOnOtherLine = this._getIndexOnLine(lineIndex + 1, widthBeforeCursor), textAfterCursor = this._textLines[lineIndex].slice(charIndex);
        return textAfterCursor.length + indexOnOtherLine + 2;
    },
    _getSelectionForOffset: function(e, isRight) {
        if (e.shiftKey && this.selectionStart !== this.selectionEnd && isRight) {
            return this.selectionEnd;
        } else {
            return this.selectionStart;
        }
    },
    getUpCursorOffset: function(e, isRight) {
        var selectionProp = this._getSelectionForOffset(e, isRight), cursorLocation = this.get2DCursorLocation(selectionProp), lineIndex = cursorLocation.lineIndex;
        if (lineIndex === 0 || e.metaKey || e.keyCode === 33) {
            return -selectionProp;
        }
        var charIndex = cursorLocation.charIndex, widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex), indexOnOtherLine = this._getIndexOnLine(lineIndex - 1, widthBeforeCursor), textBeforeCursor = this._textLines[lineIndex].slice(0, charIndex);
        return -this._textLines[lineIndex - 1].length + indexOnOtherLine - textBeforeCursor.length;
    },
    _getIndexOnLine: function(lineIndex, width) {
        var widthOfLine = this._getLineWidth(this.ctx, lineIndex), textOnLine = this._textLines[lineIndex], lineLeftOffset = this._getLineLeftOffset(widthOfLine), widthOfCharsOnLine = lineLeftOffset, indexOnLine = 0, foundMatch;
        for (var j = 0, jlen = textOnLine.length; j < jlen; j++) {
            var _char = textOnLine[j], widthOfChar = this._getWidthOfChar(this.ctx, _char, lineIndex, j);
            widthOfCharsOnLine += widthOfChar;
            if (widthOfCharsOnLine > width) {
                foundMatch = true;
                var leftEdge = widthOfCharsOnLine - widthOfChar, rightEdge = widthOfCharsOnLine, offsetFromLeftEdge = Math.abs(leftEdge - width), offsetFromRightEdge = Math.abs(rightEdge - width);
                indexOnLine = offsetFromRightEdge < offsetFromLeftEdge ? j : j - 1;
                break;
            }
        }
        if (!foundMatch) {
            indexOnLine = textOnLine.length - 1;
        }
        return indexOnLine;
    },
    moveCursorDown: function(e) {
        if (this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length) {
            return;
        }
        this._moveCursorUpOrDown("Down", e);
    },
    moveCursorUp: function(e) {
        if (this.selectionStart === 0 && this.selectionEnd === 0) {
            return;
        }
        this._moveCursorUpOrDown("Up", e);
    },
    _moveCursorUpOrDown: function(direction, e) {
        var action = "get" + direction + "CursorOffset", offset = this[action](e, this._selectionDirection === "right");
        if (e.shiftKey) {
            this.moveCursorWithShift(offset);
        } else {
            this.moveCursorWithoutShift(offset);
        }
        if (offset !== 0) {
            this.setSelectionInBoundaries();
            this.abortCursorAnimation();
            this._currentCursorOpacity = 1;
            this.initDelayedCursor();
            this._fireSelectionChanged();
            this._updateTextarea();
        }
    },
    moveCursorWithShift: function(offset) {
        var newSelection = this._selectionDirection === "left" ? this.selectionStart + offset : this.selectionEnd + offset;
        this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, newSelection);
        return offset !== 0;
    },
    moveCursorWithoutShift: function(offset) {
        if (offset < 0) {
            this.selectionStart += offset;
            this.selectionEnd = this.selectionStart;
        } else {
            this.selectionEnd += offset;
            this.selectionStart = this.selectionEnd;
        }
        return offset !== 0;
    },
    moveCursorLeft: function(e) {
        if (this.selectionStart === 0 && this.selectionEnd === 0) {
            return;
        }
        this._moveCursorLeftOrRight("Left", e);
    },
    _move: function(e, prop, direction) {
        var newValue;
        if (e.altKey) {
            newValue = this["findWordBoundary" + direction](this[prop]);
        } else if (e.metaKey || e.keyCode === 35 || e.keyCode === 36) {
            newValue = this["findLineBoundary" + direction](this[prop]);
        } else {
            this[prop] += direction === "Left" ? -1 : 1;
            return true;
        }
        if (typeof newValue !== undefined && this[prop] !== newValue) {
            this[prop] = newValue;
            return true;
        }
    },
    _moveLeft: function(e, prop) {
        return this._move(e, prop, "Left");
    },
    _moveRight: function(e, prop) {
        return this._move(e, prop, "Right");
    },
    moveCursorLeftWithoutShift: function(e) {
        var change = true;
        this._selectionDirection = "left";
        if (this.selectionEnd === this.selectionStart && this.selectionStart !== 0) {
            change = this._moveLeft(e, "selectionStart");
        }
        this.selectionEnd = this.selectionStart;
        return change;
    },
    moveCursorLeftWithShift: function(e) {
        if (this._selectionDirection === "right" && this.selectionStart !== this.selectionEnd) {
            return this._moveLeft(e, "selectionEnd");
        } else if (this.selectionStart !== 0) {
            this._selectionDirection = "left";
            return this._moveLeft(e, "selectionStart");
        }
    },
    moveCursorRight: function(e) {
        if (this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length) {
            return;
        }
        this._moveCursorLeftOrRight("Right", e);
    },
    _moveCursorLeftOrRight: function(direction, e) {
        var actionName = "moveCursor" + direction + "With";
        this._currentCursorOpacity = 1;
        if (e.shiftKey) {
            actionName += "Shift";
        } else {
            actionName += "outShift";
        }
        if (this[actionName](e)) {
            this.abortCursorAnimation();
            this.initDelayedCursor();
            this._fireSelectionChanged();
            this._updateTextarea();
        }
    },
    moveCursorRightWithShift: function(e) {
        if (this._selectionDirection === "left" && this.selectionStart !== this.selectionEnd) {
            return this._moveRight(e, "selectionStart");
        } else if (this.selectionEnd !== this.text.length) {
            this._selectionDirection = "right";
            return this._moveRight(e, "selectionEnd");
        }
    },
    moveCursorRightWithoutShift: function(e) {
        var changed = true;
        this._selectionDirection = "right";
        if (this.selectionStart === this.selectionEnd) {
            changed = this._moveRight(e, "selectionStart");
            this.selectionEnd = this.selectionStart;
        } else {
            this.selectionStart = this.selectionEnd;
        }
        return changed;
    },
    removeChars: function(e) {
        if (this.selectionStart === this.selectionEnd) {
            this._removeCharsNearCursor(e);
        } else {
            this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
        }
        this.setSelectionEnd(this.selectionStart);
        this._removeExtraneousStyles();
        this.canvas && this.canvas.renderAll();
        this.setCoords();
        this.fire("changed");
        this.canvas && this.canvas.fire("text:changed", {
            target: this
        });
    },
    _removeCharsNearCursor: function(e) {
        if (this.selectionStart === 0) {
            return;
        }
        if (e.metaKey) {
            var leftLineBoundary = this.findLineBoundaryLeft(this.selectionStart);
            this._removeCharsFromTo(leftLineBoundary, this.selectionStart);
            this.setSelectionStart(leftLineBoundary);
        } else if (e.altKey) {
            var leftWordBoundary = this.findWordBoundaryLeft(this.selectionStart);
            this._removeCharsFromTo(leftWordBoundary, this.selectionStart);
            this.setSelectionStart(leftWordBoundary);
        } else {
            this._removeSingleCharAndStyle(this.selectionStart);
            this.setSelectionStart(this.selectionStart - 1);
        }
    }
});

(function() {
    var toFixed = fabric.util.toFixed, NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
    fabric.util.object.extend(fabric.IText.prototype, {
        _setSVGTextLineText: function(lineIndex, textSpans, height, textLeftOffset, textTopOffset, textBgRects) {
            if (!this._getLineStyle(lineIndex)) {
                fabric.Text.prototype._setSVGTextLineText.call(this, lineIndex, textSpans, height, textLeftOffset, textTopOffset);
            } else {
                this._setSVGTextLineChars(lineIndex, textSpans, height, textLeftOffset, textBgRects);
            }
        },
        _setSVGTextLineChars: function(lineIndex, textSpans, height, textLeftOffset, textBgRects) {
            var chars = this._textLines[lineIndex], charOffset = 0, lineLeftOffset = this._getLineLeftOffset(this._getLineWidth(this.ctx, lineIndex)) - this.width / 2, lineOffset = this._getSVGLineTopOffset(lineIndex), heightOfLine = this._getHeightOfLine(this.ctx, lineIndex);
            for (var i = 0, len = chars.length; i < len; i++) {
                var styleDecl = this._getStyleDeclaration(lineIndex, i) || {};
                textSpans.push(this._createTextCharSpan(chars[i], styleDecl, lineLeftOffset, lineOffset.lineTop + lineOffset.offset, charOffset));
                var charWidth = this._getWidthOfChar(this.ctx, chars[i], lineIndex, i);
                if (styleDecl.textBackgroundColor) {
                    textBgRects.push(this._createTextCharBg(styleDecl, lineLeftOffset, lineOffset.lineTop, heightOfLine, charWidth, charOffset));
                }
                charOffset += charWidth;
            }
        },
        _getSVGLineTopOffset: function(lineIndex) {
            var lineTopOffset = 0, lastHeight = 0;
            for (var j = 0; j < lineIndex; j++) {
                lineTopOffset += this._getHeightOfLine(this.ctx, j);
            }
            lastHeight = this._getHeightOfLine(this.ctx, j);
            return {
                lineTop: lineTopOffset,
                offset: (this._fontSizeMult - this._fontSizeFraction) * lastHeight / (this.lineHeight * this._fontSizeMult)
            };
        },
        _createTextCharBg: function(styleDecl, lineLeftOffset, lineTopOffset, heightOfLine, charWidth, charOffset) {
            return [ '\t\t<rect fill="', styleDecl.textBackgroundColor, '" x="', toFixed(lineLeftOffset + charOffset, NUM_FRACTION_DIGITS), '" y="', toFixed(lineTopOffset - this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(charWidth, NUM_FRACTION_DIGITS), '" height="', toFixed(heightOfLine / this.lineHeight, NUM_FRACTION_DIGITS), '"></rect>\n' ].join("");
        },
        _createTextCharSpan: function(_char, styleDecl, lineLeftOffset, lineTopOffset, charOffset) {
            var fillStyles = this.getSvgStyles.call(fabric.util.object.extend({
                visible: true,
                fill: this.fill,
                stroke: this.stroke,
                type: "text",
                getSvgFilter: fabric.Object.prototype.getSvgFilter
            }, styleDecl));
            return [ '\t\t\t<tspan x="', toFixed(lineLeftOffset + charOffset, NUM_FRACTION_DIGITS), '" y="', toFixed(lineTopOffset - this.height / 2, NUM_FRACTION_DIGITS), '" ', styleDecl.fontFamily ? 'font-family="' + styleDecl.fontFamily.replace(/"/g, "'") + '" ' : "", styleDecl.fontSize ? 'font-size="' + styleDecl.fontSize + '" ' : "", styleDecl.fontStyle ? 'font-style="' + styleDecl.fontStyle + '" ' : "", styleDecl.fontWeight ? 'font-weight="' + styleDecl.fontWeight + '" ' : "", styleDecl.textDecoration ? 'text-decoration="' + styleDecl.textDecoration + '" ' : "", 'style="', fillStyles, '">', fabric.util.string.escapeXml(_char), "</tspan>\n" ].join("");
        }
    });
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), clone = fabric.util.object.clone;
    fabric.Textbox = fabric.util.createClass(fabric.IText, fabric.Observable, {
        type: "textbox",
        minWidth: 20,
        dynamicMinWidth: 2,
        __cachedLines: null,
        lockScalingY: true,
        lockScalingFlip: true,
        initialize: function(text, options) {
            this.ctx = fabric.util.createCanvasElement().getContext("2d");
            this.callSuper("initialize", text, options);
            this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
            this._dimensionAffectingProps.width = true;
        },
        _initDimensions: function(ctx) {
            if (this.__skipDimension) {
                return;
            }
            if (!ctx) {
                ctx = fabric.util.createCanvasElement().getContext("2d");
                this._setTextStyles(ctx);
            }
            this.dynamicMinWidth = 0;
            this._textLines = this._splitTextIntoLines();
            if (this.dynamicMinWidth > this.width) {
                this._set("width", this.dynamicMinWidth);
            }
            this._clearCache();
            this.height = this._getTextHeight(ctx);
        },
        _generateStyleMap: function() {
            var realLineCount = 0, realLineCharCount = 0, charCount = 0, map = {};
            for (var i = 0; i < this._textLines.length; i++) {
                if (this.text[charCount] === "\n" && i > 0) {
                    realLineCharCount = 0;
                    charCount++;
                    realLineCount++;
                } else if (this.text[charCount] === " " && i > 0) {
                    realLineCharCount++;
                    charCount++;
                }
                map[i] = {
                    line: realLineCount,
                    offset: realLineCharCount
                };
                charCount += this._textLines[i].length;
                realLineCharCount += this._textLines[i].length;
            }
            return map;
        },
        _getStyleDeclaration: function(lineIndex, charIndex, returnCloneOrEmpty) {
            if (this._styleMap) {
                var map = this._styleMap[lineIndex];
                if (!map) {
                    return returnCloneOrEmpty ? {} : null;
                }
                lineIndex = map.line;
                charIndex = map.offset + charIndex;
            }
            return this.callSuper("_getStyleDeclaration", lineIndex, charIndex, returnCloneOrEmpty);
        },
        _setStyleDeclaration: function(lineIndex, charIndex, style) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            this.styles[lineIndex][charIndex] = style;
        },
        _deleteStyleDeclaration: function(lineIndex, charIndex) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            delete this.styles[lineIndex][charIndex];
        },
        _getLineStyle: function(lineIndex) {
            var map = this._styleMap[lineIndex];
            return this.styles[map.line];
        },
        _setLineStyle: function(lineIndex, style) {
            var map = this._styleMap[lineIndex];
            this.styles[map.line] = style;
        },
        _deleteLineStyle: function(lineIndex) {
            var map = this._styleMap[lineIndex];
            delete this.styles[map.line];
        },
        _wrapText: function(ctx, text) {
            var lines = text.split(this._reNewline), wrapped = [], i;
            for (i = 0; i < lines.length; i++) {
                wrapped = wrapped.concat(this._wrapLine(ctx, lines[i], i));
            }
            return wrapped;
        },
        _measureText: function(ctx, text, lineIndex, charOffset) {
            var width = 0;
            charOffset = charOffset || 0;
            for (var i = 0, len = text.length; i < len; i++) {
                width += this._getWidthOfChar(ctx, text[i], lineIndex, i + charOffset);
            }
            return width;
        },
        _wrapLine: function(ctx, text, lineIndex) {
            var lineWidth = 0, lines = [], line = "", words = text.split(" "), word = "", offset = 0, infix = " ", wordWidth = 0, infixWidth = 0, largestWordWidth = 0, lineJustStarted = true, additionalSpace = this._getWidthOfCharSpacing();
            for (var i = 0; i < words.length; i++) {
                word = words[i];
                wordWidth = this._measureText(ctx, word, lineIndex, offset);
                offset += word.length;
                lineWidth += infixWidth + wordWidth - additionalSpace;
                if (lineWidth >= this.width && !lineJustStarted) {
                    lines.push(line);
                    line = "";
                    lineWidth = wordWidth;
                    lineJustStarted = true;
                } else {
                    lineWidth += additionalSpace;
                }
                if (!lineJustStarted) {
                    line += infix;
                }
                line += word;
                infixWidth = this._measureText(ctx, infix, lineIndex, offset);
                offset++;
                lineJustStarted = false;
                if (wordWidth > largestWordWidth) {
                    largestWordWidth = wordWidth;
                }
            }
            i && lines.push(line);
            if (largestWordWidth > this.dynamicMinWidth) {
                this.dynamicMinWidth = largestWordWidth - additionalSpace;
            }
            return lines;
        },
        _splitTextIntoLines: function() {
            var originalAlign = this.textAlign;
            this.ctx.save();
            this._setTextStyles(this.ctx);
            this.textAlign = "left";
            var lines = this._wrapText(this.ctx, this.text);
            this.textAlign = originalAlign;
            this.ctx.restore();
            this._textLines = lines;
            this._styleMap = this._generateStyleMap();
            return lines;
        },
        setOnGroup: function(key, value) {
            if (key === "scaleX") {
                this.set("scaleX", Math.abs(1 / value));
                this.set("width", this.get("width") * value / (typeof this.__oldScaleX === "undefined" ? 1 : this.__oldScaleX));
                this.__oldScaleX = value;
            }
        },
        get2DCursorLocation: function(selectionStart) {
            if (typeof selectionStart === "undefined") {
                selectionStart = this.selectionStart;
            }
            var numLines = this._textLines.length, removed = 0;
            for (var i = 0; i < numLines; i++) {
                var line = this._textLines[i], lineLen = line.length;
                if (selectionStart <= removed + lineLen) {
                    return {
                        lineIndex: i,
                        charIndex: selectionStart - removed
                    };
                }
                removed += lineLen;
                if (this.text[removed] === "\n" || this.text[removed] === " ") {
                    removed++;
                }
            }
            return {
                lineIndex: numLines - 1,
                charIndex: this._textLines[numLines - 1].length
            };
        },
        _getCursorBoundariesOffsets: function(chars, typeOfBoundaries) {
            var topOffset = 0, leftOffset = 0, cursorLocation = this.get2DCursorLocation(), lineChars = this._textLines[cursorLocation.lineIndex].split(""), lineLeftOffset = this._getLineLeftOffset(this._getLineWidth(this.ctx, cursorLocation.lineIndex));
            for (var i = 0; i < cursorLocation.charIndex; i++) {
                leftOffset += this._getWidthOfChar(this.ctx, lineChars[i], cursorLocation.lineIndex, i);
            }
            for (i = 0; i < cursorLocation.lineIndex; i++) {
                topOffset += this._getHeightOfLine(this.ctx, i);
            }
            if (typeOfBoundaries === "cursor") {
                topOffset += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, cursorLocation.lineIndex) / this.lineHeight - this.getCurrentCharFontSize(cursorLocation.lineIndex, cursorLocation.charIndex) * (1 - this._fontSizeFraction);
            }
            return {
                top: topOffset,
                left: leftOffset,
                lineLeft: lineLeftOffset
            };
        },
        getMinWidth: function() {
            return Math.max(this.minWidth, this.dynamicMinWidth);
        },
        toObject: function(propertiesToInclude) {
            return this.callSuper("toObject", [ "minWidth" ].concat(propertiesToInclude));
        }
    });
    fabric.Textbox.fromObject = function(object, callback) {
        var textbox = new fabric.Textbox(object.text, clone(object));
        callback && callback(textbox);
        return textbox;
    };
    fabric.Textbox.getTextboxControlVisibility = function() {
        return {
            tl: false,
            tr: false,
            br: false,
            bl: false,
            ml: true,
            mt: false,
            mr: true,
            mb: false,
            mtr: true
        };
    };
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var setObjectScaleOverridden = fabric.Canvas.prototype._setObjectScale;
    fabric.Canvas.prototype._setObjectScale = function(localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {
        var t = transform.target;
        if (t instanceof fabric.Textbox) {
            var w = t.width * (localMouse.x / transform.scaleX / (t.width + t.strokeWidth));
            if (w >= t.getMinWidth()) {
                t.set("width", w);
                return true;
            }
        } else {
            return setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip, _dim);
        }
    };
    fabric.Group.prototype._refreshControlsVisibility = function() {
        if (typeof fabric.Textbox === "undefined") {
            return;
        }
        for (var i = this._objects.length; i--; ) {
            if (this._objects[i] instanceof fabric.Textbox) {
                this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
                return;
            }
        }
    };
    var clone = fabric.util.object.clone;
    fabric.util.object.extend(fabric.Textbox.prototype, {
        _removeExtraneousStyles: function() {
            for (var prop in this._styleMap) {
                if (!this._textLines[prop]) {
                    delete this.styles[this._styleMap[prop].line];
                }
            }
        },
        insertCharStyleObject: function(lineIndex, charIndex, style) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            fabric.IText.prototype.insertCharStyleObject.apply(this, [ lineIndex, charIndex, style ]);
        },
        insertNewlineStyleObject: function(lineIndex, charIndex, isEndOfLine) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            fabric.IText.prototype.insertNewlineStyleObject.apply(this, [ lineIndex, charIndex, isEndOfLine ]);
        },
        shiftLineStyles: function(lineIndex, offset) {
            var clonedStyles = clone(this.styles), map = this._styleMap[lineIndex];
            lineIndex = map.line;
            for (var line in this.styles) {
                var numericLine = parseInt(line, 10);
                if (numericLine > lineIndex) {
                    this.styles[numericLine + offset] = clonedStyles[numericLine];
                    if (!clonedStyles[numericLine - offset]) {
                        delete this.styles[numericLine];
                    }
                }
            }
        },
        _getTextOnPreviousLine: function(lIndex) {
            var textOnPreviousLine = this._textLines[lIndex - 1];
            while (this._styleMap[lIndex - 2] && this._styleMap[lIndex - 2].line === this._styleMap[lIndex - 1].line) {
                textOnPreviousLine = this._textLines[lIndex - 2] + textOnPreviousLine;
                lIndex--;
            }
            return textOnPreviousLine;
        },
        removeStyleObject: function(isBeginningOfLine, index) {
            var cursorLocation = this.get2DCursorLocation(index), map = this._styleMap[cursorLocation.lineIndex], lineIndex = map.line, charIndex = map.offset + cursorLocation.charIndex;
            this._removeStyleObject(isBeginningOfLine, cursorLocation, lineIndex, charIndex);
        }
    });
})();

(function() {
    var override = fabric.IText.prototype._getNewSelectionStartFromOffset;
    fabric.IText.prototype._getNewSelectionStartFromOffset = function(mouseOffset, prevWidth, width, index, jlen) {
        index = override.call(this, mouseOffset, prevWidth, width, index, jlen);
        var tmp = 0, removed = 0;
        for (var i = 0; i < this._textLines.length; i++) {
            tmp += this._textLines[i].length;
            if (tmp + removed >= index) {
                break;
            }
            if (this.text[tmp + removed] === "\n" || this.text[tmp + removed] === " ") {
                removed++;
            }
        }
        return index - i + removed;
    };
})();

(function() {
    if (typeof document !== "undefined" && typeof window !== "undefined") {
        return;
    }
    var DOMParser = require("xmldom").DOMParser, URL = require("url"), HTTP = require("http"), HTTPS = require("https"), Canvas = require("canvas"), Image = require("canvas").Image;
    function request(url, encoding, callback) {
        var oURL = URL.parse(url);
        if (!oURL.port) {
            oURL.port = oURL.protocol.indexOf("https:") === 0 ? 443 : 80;
        }
        var reqHandler = oURL.protocol.indexOf("https:") === 0 ? HTTPS : HTTP, req = reqHandler.request({
            hostname: oURL.hostname,
            port: oURL.port,
            path: oURL.path,
            method: "GET"
        }, function(response) {
            var body = "";
            if (encoding) {
                response.setEncoding(encoding);
            }
            response.on("end", function() {
                callback(body);
            });
            response.on("data", function(chunk) {
                if (response.statusCode === 200) {
                    body += chunk;
                }
            });
        });
        req.on("error", function(err) {
            if (err.errno === process.ECONNREFUSED) {
                fabric.log("ECONNREFUSED: connection refused to " + oURL.hostname + ":" + oURL.port);
            } else {
                fabric.log(err.message);
            }
            callback(null);
        });
        req.end();
    }
    function requestFs(path, callback) {
        var fs = require("fs");
        fs.readFile(path, function(err, data) {
            if (err) {
                fabric.log(err);
                throw err;
            } else {
                callback(data);
            }
        });
    }
    fabric.util.loadImage = function(url, callback, context) {
        function createImageAndCallBack(data) {
            if (data) {
                img.src = new Buffer(data, "binary");
                img._src = url;
                callback && callback.call(context, img);
            } else {
                img = null;
                callback && callback.call(context, null, true);
            }
        }
        var img = new Image();
        if (url && (url instanceof Buffer || url.indexOf("data") === 0)) {
            img.src = img._src = url;
            callback && callback.call(context, img);
        } else if (url && url.indexOf("http") !== 0) {
            requestFs(url, createImageAndCallBack);
        } else if (url) {
            request(url, "binary", createImageAndCallBack);
        } else {
            callback && callback.call(context, url);
        }
    };
    fabric.loadSVGFromURL = function(url, callback, reviver) {
        url = url.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim();
        if (url.indexOf("http") !== 0) {
            requestFs(url, function(body) {
                fabric.loadSVGFromString(body.toString(), callback, reviver);
            });
        } else {
            request(url, "", function(body) {
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
        request(url, "", function(body) {
            eval(body);
            callback && callback();
        });
    };
    fabric.createCanvasForNode = function(width, height, options, nodeCanvasOptions) {
        nodeCanvasOptions = nodeCanvasOptions || options;
        var canvasEl = fabric.document.createElement("canvas"), nodeCanvas = new Canvas(width || 600, height || 600, nodeCanvasOptions), nodeCacheCanvas = new Canvas(width || 600, height || 600, nodeCanvasOptions);
        canvasEl.style = {};
        canvasEl.width = nodeCanvas.width;
        canvasEl.height = nodeCanvas.height;
        options = options || {};
        options.nodeCanvas = nodeCanvas;
        options.nodeCacheCanvas = nodeCacheCanvas;
        var FabricCanvas = fabric.Canvas || fabric.StaticCanvas, fabricCanvas = new FabricCanvas(canvasEl, options);
        fabricCanvas.nodeCanvas = nodeCanvas;
        fabricCanvas.nodeCacheCanvas = nodeCacheCanvas;
        fabricCanvas.contextContainer = nodeCanvas.getContext("2d");
        fabricCanvas.contextCache = nodeCacheCanvas.getContext("2d");
        fabricCanvas.Font = Canvas.Font;
        return fabricCanvas;
    };
    var originaInitStatic = fabric.StaticCanvas.prototype._initStatic;
    fabric.StaticCanvas.prototype._initStatic = function(el, options) {
        el = el || fabric.document.createElement("canvas");
        this.nodeCanvas = new Canvas(el.width, el.height);
        this.nodeCacheCanvas = new Canvas(el.width, el.height);
        originaInitStatic.call(this, el, options);
        this.contextContainer = this.nodeCanvas.getContext("2d");
        this.contextCache = this.nodeCacheCanvas.getContext("2d");
        this.Font = Canvas.Font;
    };
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
        this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio);
        this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio);
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

window.fabric = fabric;

if (typeof define === "function" && define.amd) {
    define([], function() {
        return fabric;
    });
}