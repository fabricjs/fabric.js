(function(window, undefined) {
    var exports = exports || {};
    var fabric = fabric || {
        version: "1.2.9"
    };
    exports.fabric = fabric;
    if (typeof document !== "undefined" && typeof window !== "undefined") {
        fabric.document = document;
        fabric.window = window;
    } else {
        fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>");
        fabric.window = fabric.document.createWindow();
    }
    fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;
    fabric.isLikelyNode = typeof Buffer !== "undefined" && typeof window === "undefined";
    fabric.log = function() {};
    fabric.warn = function() {};
    if (typeof console !== "undefined") {
        if (typeof console.log !== "undefined" && console.log.apply) {
            fabric.log = function() {
                return console.log.apply(console, arguments);
            };
        }
        if (typeof console.warn !== "undefined" && console.warn.apply) {
            fabric.warn = function() {
                return console.warn.apply(console, arguments);
            };
        }
    }
    (function() {
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
        }
        function stopObserving(eventName, handler) {
            if (!this.__eventListeners) {
                this.__eventListeners = {};
            }
            if (this.__eventListeners[eventName]) {
                if (handler) {
                    fabric.util.removeFromArray(this.__eventListeners[eventName], handler);
                } else {
                    this.__eventListeners[eventName].length = 0;
                }
            }
        }
        function fire(eventName, options) {
            if (!this.__eventListeners) {
                this.__eventListeners = {};
            }
            var listenersForEvent = this.__eventListeners[eventName];
            if (!listenersForEvent) return;
            for (var i = 0, len = listenersForEvent.length; i < len; i++) {
                listenersForEvent[i](options || {});
            }
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
        add: function() {
            this._objects.push.apply(this._objects, arguments);
            for (var i = arguments.length; i--; ) {
                this._onObjectAdded(arguments[i]);
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
            this._onObjectAdded(object);
            this.renderOnAddRemove && this.renderAll();
            return this;
        },
        remove: function(object) {
            var objects = this.getObjects(), index = objects.indexOf(object);
            if (index !== -1) {
                objects.splice(index, 1);
                this._onObjectRemoved(object);
            }
            this.renderOnAddRemove && this.renderAll();
            return object;
        },
        forEachObject: function(callback, context) {
            var objects = this.getObjects(), i = objects.length;
            while (i--) {
                callback.call(context, objects[i], i, objects);
            }
            return this;
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
        },
        toGrayscale: function() {
            return this.forEachObject(function(obj) {
                obj.toGrayscale();
            });
        }
    };
    (function() {
        var sqrt = Math.sqrt, atan2 = Math.atan2;
        fabric.util = {};
        function removeFromArray(array, value) {
            var idx = array.indexOf(value);
            if (idx !== -1) {
                array.splice(idx, 1);
            }
            return array;
        }
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var PiBy180 = Math.PI / 180;
        function degreesToRadians(degrees) {
            return degrees * PiBy180;
        }
        function radiansToDegrees(radians) {
            return radians / PiBy180;
        }
        function rotatePoint(point, origin, radians) {
            var sin = Math.sin(radians), cos = Math.cos(radians);
            point.subtractEquals(origin);
            var rx = point.x * cos - point.y * sin;
            var ry = point.x * sin + point.y * cos;
            return new fabric.Point(rx, ry).addEquals(origin);
        }
        function toFixed(number, fractionDigits) {
            return parseFloat(Number(number).toFixed(fractionDigits));
        }
        function falseFunction() {
            return false;
        }
        function getKlass(type, namespace) {
            return resolveNamespace(namespace)[fabric.util.string.camelize(fabric.util.string.capitalize(type))];
        }
        function resolveNamespace(namespace) {
            if (!namespace) return fabric;
            var parts = namespace.split("."), len = parts.length, obj = fabric.window;
            for (var i = 0; i < len; ++i) {
                obj = obj[parts[i]];
            }
            return obj;
        }
        function loadImage(url, callback, context) {
            if (url) {
                var img = fabric.util.createImage();
                img.onload = function() {
                    callback && callback.call(context, img);
                    img = img.onload = null;
                };
                img.src = url;
            } else {
                callback && callback.call(context, url);
            }
        }
        function enlivenObjects(objects, callback, namespace) {
            function onLoaded() {
                if (++numLoadedObjects === numTotalObjects) {
                    if (callback) {
                        callback(enlivenedObjects);
                    }
                }
            }
            var enlivenedObjects = [], numLoadedObjects = 0, numTotalObjects = objects.length;
            objects.forEach(function(o, index) {
                if (!o.type) {
                    return;
                }
                var klass = fabric.util.getKlass(o.type, namespace);
                if (klass.async) {
                    klass.fromObject(o, function(o, error) {
                        if (!error) {
                            enlivenedObjects[index] = o;
                        }
                        onLoaded();
                    });
                } else {
                    enlivenedObjects[index] = klass.fromObject(o);
                    onLoaded();
                }
            });
        }
        function groupSVGElements(elements, options, path) {
            var object;
            if (elements.length > 1) {
                object = new fabric.PathGroup(elements, options);
            } else {
                object = elements[0];
            }
            if (typeof path !== "undefined") {
                object.setSourcePath(path);
            }
            return object;
        }
        function populateWithProperties(source, destination, properties) {
            if (properties && Object.prototype.toString.call(properties) === "[object Array]") {
                for (var i = 0, len = properties.length; i < len; i++) {
                    if (properties[i] in source) {
                        destination[properties[i]] = source[properties[i]];
                    }
                }
            }
        }
        function drawDashedLine(ctx, x, y, x2, y2, da) {
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
        }
        function createCanvasElement(canvasEl) {
            canvasEl || (canvasEl = fabric.document.createElement("canvas"));
            if (!canvasEl.getContext && typeof G_vmlCanvasManager !== "undefined") {
                G_vmlCanvasManager.initElement(canvasEl);
            }
            return canvasEl;
        }
        function createImage() {
            return fabric.isLikelyNode ? new (require("canvas").Image)() : fabric.document.createElement("img");
        }
        function createAccessors(klass) {
            var proto = klass.prototype;
            for (var i = proto.stateProperties.length; i--; ) {
                var propName = proto.stateProperties[i], capitalizedPropName = propName.charAt(0).toUpperCase() + propName.slice(1), setterName = "set" + capitalizedPropName, getterName = "get" + capitalizedPropName;
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
        }
        function clipContext(receiver, ctx) {
            ctx.save();
            ctx.beginPath();
            receiver.clipTo(ctx);
            ctx.clip();
        }
        function multiplyTransformMatrices(matrixA, matrixB) {
            var a = [ [ matrixA[0], matrixA[2], matrixA[4] ], [ matrixA[1], matrixA[3], matrixA[5] ], [ 0, 0, 1 ] ];
            var b = [ [ matrixB[0], matrixB[2], matrixB[4] ], [ matrixB[1], matrixB[3], matrixB[5] ], [ 0, 0, 1 ] ];
            var result = [];
            for (var r = 0; r < 3; r++) {
                result[r] = [];
                for (var c = 0; c < 3; c++) {
                    var sum = 0;
                    for (var k = 0; k < 3; k++) {
                        sum += a[r][k] * b[k][c];
                    }
                    result[r][c] = sum;
                }
            }
            return [ result[0][0], result[1][0], result[0][1], result[1][1], result[0][2], result[1][2] ];
        }
        function getFunctionBody(fn) {
            return (String(fn).match(/function[^{]*\{([\s\S]*)\}/) || {})[1];
        }
        function drawArc(ctx, x, y, coords) {
            var rx = coords[0];
            var ry = coords[1];
            var rot = coords[2];
            var large = coords[3];
            var sweep = coords[4];
            var ex = coords[5];
            var ey = coords[6];
            var segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);
            for (var i = 0; i < segs.length; i++) {
                var bez = segmentToBezier.apply(this, segs[i]);
                ctx.bezierCurveTo.apply(ctx, bez);
            }
        }
        var arcToSegmentsCache = {}, segmentToBezierCache = {}, _join = Array.prototype.join, argsString;
        function arcToSegments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
            argsString = _join.call(arguments);
            if (arcToSegmentsCache[argsString]) {
                return arcToSegmentsCache[argsString];
            }
            var th = rotateX * (Math.PI / 180);
            var sin_th = Math.sin(th);
            var cos_th = Math.cos(th);
            rx = Math.abs(rx);
            ry = Math.abs(ry);
            var px = cos_th * (ox - x) * .5 + sin_th * (oy - y) * .5;
            var py = cos_th * (oy - y) * .5 - sin_th * (ox - x) * .5;
            var pl = px * px / (rx * rx) + py * py / (ry * ry);
            if (pl > 1) {
                pl = Math.sqrt(pl);
                rx *= pl;
                ry *= pl;
            }
            var a00 = cos_th / rx;
            var a01 = sin_th / rx;
            var a10 = -sin_th / ry;
            var a11 = cos_th / ry;
            var x0 = a00 * ox + a01 * oy;
            var y0 = a10 * ox + a11 * oy;
            var x1 = a00 * x + a01 * y;
            var y1 = a10 * x + a11 * y;
            var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
            var sfactor_sq = 1 / d - .25;
            if (sfactor_sq < 0) sfactor_sq = 0;
            var sfactor = Math.sqrt(sfactor_sq);
            if (sweep === large) sfactor = -sfactor;
            var xc = .5 * (x0 + x1) - sfactor * (y1 - y0);
            var yc = .5 * (y0 + y1) + sfactor * (x1 - x0);
            var th0 = Math.atan2(y0 - yc, x0 - xc);
            var th1 = Math.atan2(y1 - yc, x1 - xc);
            var th_arc = th1 - th0;
            if (th_arc < 0 && sweep === 1) {
                th_arc += 2 * Math.PI;
            } else if (th_arc > 0 && sweep === 0) {
                th_arc -= 2 * Math.PI;
            }
            var segments = Math.ceil(Math.abs(th_arc / (Math.PI * .5 + .001)));
            var result = [];
            for (var i = 0; i < segments; i++) {
                var th2 = th0 + i * th_arc / segments;
                var th3 = th0 + (i + 1) * th_arc / segments;
                result[i] = [ xc, yc, th2, th3, rx, ry, sin_th, cos_th ];
            }
            arcToSegmentsCache[argsString] = result;
            return result;
        }
        function segmentToBezier(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
            argsString = _join.call(arguments);
            if (segmentToBezierCache[argsString]) {
                return segmentToBezierCache[argsString];
            }
            var a00 = cos_th * rx;
            var a01 = -sin_th * ry;
            var a10 = sin_th * rx;
            var a11 = cos_th * ry;
            var th_half = .5 * (th1 - th0);
            var t = 8 / 3 * Math.sin(th_half * .5) * Math.sin(th_half * .5) / Math.sin(th_half);
            var x1 = cx + Math.cos(th0) - t * Math.sin(th0);
            var y1 = cy + Math.sin(th0) + t * Math.cos(th0);
            var x3 = cx + Math.cos(th1);
            var y3 = cy + Math.sin(th1);
            var x2 = x3 + t * Math.sin(th1);
            var y2 = y3 - t * Math.cos(th1);
            segmentToBezierCache[argsString] = [ a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3 ];
            return segmentToBezierCache[argsString];
        }
        fabric.util.removeFromArray = removeFromArray;
        fabric.util.degreesToRadians = degreesToRadians;
        fabric.util.radiansToDegrees = radiansToDegrees;
        fabric.util.rotatePoint = rotatePoint;
        fabric.util.toFixed = toFixed;
        fabric.util.getRandomInt = getRandomInt;
        fabric.util.falseFunction = falseFunction;
        fabric.util.getKlass = getKlass;
        fabric.util.resolveNamespace = resolveNamespace;
        fabric.util.loadImage = loadImage;
        fabric.util.enlivenObjects = enlivenObjects;
        fabric.util.groupSVGElements = groupSVGElements;
        fabric.util.populateWithProperties = populateWithProperties;
        fabric.util.drawDashedLine = drawDashedLine;
        fabric.util.createCanvasElement = createCanvasElement;
        fabric.util.createImage = createImage;
        fabric.util.createAccessors = createAccessors;
        fabric.util.clipContext = clipContext;
        fabric.util.multiplyTransformMatrices = multiplyTransformMatrices;
        fabric.util.getFunctionBody = getFunctionBody;
        fabric.util.drawArc = drawArc;
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
            if (!array || array.length === 0) return undefined;
            var i = array.length - 1, result = byProperty ? array[i][byProperty] : array[i];
            if (byProperty) {
                while (i--) {
                    if (array[i][byProperty] >= result) {
                        result = array[i][byProperty];
                    }
                }
            } else {
                while (i--) {
                    if (array[i] >= result) {
                        result = array[i];
                    }
                }
            }
            return result;
        }
        function min(array, byProperty) {
            if (!array || array.length === 0) return undefined;
            var i = array.length - 1, result = byProperty ? array[i][byProperty] : array[i];
            if (byProperty) {
                while (i--) {
                    if (array[i][byProperty] < result) {
                        result = array[i][byProperty];
                    }
                }
            } else {
                while (i--) {
                    if (array[i] < result) {
                        result = array[i];
                    }
                }
            }
            return result;
        }
        fabric.util.array = {
            invoke: invoke,
            min: min,
            max: max
        };
    })();
    (function() {
        function extend(destination, source) {
            for (var property in source) {
                destination[property] = source[property];
            }
            return destination;
        }
        function clone(object) {
            return extend({}, object);
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
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
                var fn = this, args = slice.call(arguments, 1), bound;
                if (args.length) {
                    bound = function() {
                        return apply.call(fn, this instanceof Dummy ? this : thisArg, args.concat(slice.call(arguments)));
                    };
                } else {
                    bound = function() {
                        return apply.call(fn, this instanceof Dummy ? this : thisArg, arguments);
                    };
                }
                Dummy.prototype = this.prototype;
                bound.prototype = new Dummy();
                return bound;
            };
        }
    })();
    (function() {
        var slice = Array.prototype.slice, emptyFunction = function() {};
        var IS_DONTENUM_BUGGY = function() {
            for (var p in {
                toString: 1
            }) {
                if (p === "toString") return false;
            }
            return true;
        }();
        var addMethods = function(klass, source, parent) {
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
        function areHostMethods(object) {
            var methodNames = Array.prototype.slice.call(arguments, 1), t, i, len = methodNames.length;
            for (i = 0; i < len; i++) {
                t = typeof object[methodNames[i]];
                if (!/^(?:function|object|unknown)$/.test(t)) return false;
            }
            return true;
        }
        var getUniqueId = function() {
            var uid = 0;
            return function(element) {
                return element.__uniqueID || (element.__uniqueID = "uniqueID__" + uid++);
            };
        }();
        var getElement, setElement;
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
        function getPointer(event, upperCanvasEl) {
            event || (event = fabric.window.event);
            var element = event.target || (typeof event.srcElement !== "unknown" ? event.srcElement : null), body = fabric.document.body || {
                scrollLeft: 0,
                scrollTop: 0
            }, docElement = fabric.document.documentElement, orgElement = element, scrollLeft = 0, scrollTop = 0, firstFixedAncestor;
            while (element && element.parentNode && !firstFixedAncestor) {
                element = element.parentNode;
                if (element !== fabric.document && fabric.util.getElementStyle(element, "position") === "fixed") {
                    firstFixedAncestor = element;
                }
                if (element !== fabric.document && orgElement !== upperCanvasEl && fabric.util.getElementStyle(element, "position") === "absolute") {
                    scrollLeft = 0;
                    scrollTop = 0;
                } else if (element === fabric.document) {
                    scrollLeft = body.scrollLeft || docElement.scrollLeft || 0;
                    scrollTop = body.scrollTop || docElement.scrollTop || 0;
                } else {
                    scrollLeft += element.scrollLeft || 0;
                    scrollTop += element.scrollTop || 0;
                }
            }
            return {
                x: pointerX(event) + scrollLeft,
                y: pointerY(event) + scrollTop
            };
        }
        var pointerX = function(event) {
            return typeof event.clientX !== "unknown" ? event.clientX : 0;
        };
        var pointerY = function(event) {
            return typeof event.clientY !== "unknown" ? event.clientY : 0;
        };
        if (fabric.isTouchSupported) {
            pointerX = function(event) {
                if (event.type !== "touchend") {
                    return event.touches && event.touches[0] ? event.touches[0].pageX - (event.touches[0].pageX - event.touches[0].clientX) || event.clientX : event.clientX;
                }
                return event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageX - (event.changedTouches[0].pageX - event.changedTouches[0].clientX) || event.clientX : event.clientX;
            };
            pointerY = function(event) {
                if (event.type !== "touchend") {
                    return event.touches && event.touches[0] ? event.touches[0].pageY - (event.touches[0].pageY - event.touches[0].clientY) || event.clientY : event.clientY;
                }
                return event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageY - (event.changedTouches[0].pageY - event.changedTouches[0].clientY) || event.clientY : event.clientY;
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
        var toArray = function(arrayLike) {
            return _slice.call(arrayLike, 0);
        };
        var sliceCanConvertNodelists;
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
            if ((" " + element.className + " ").indexOf(" " + className + " ") === -1) {
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
        function getElementOffset(element) {
            var docElem, win, box = {
                left: 0,
                top: 0
            }, doc = element && element.ownerDocument, offset = {
                left: 0,
                top: 0
            }, offsetAttributes = {
                borderLeftWidth: "left",
                borderTopWidth: "top",
                paddingLeft: "left",
                paddingTop: "top"
            };
            if (!doc) {
                return {
                    left: 0,
                    top: 0
                };
            }
            for (var attr in offsetAttributes) {
                offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
            }
            docElem = doc.documentElement;
            if (typeof element.getBoundingClientRect !== "undefined") {
                box = element.getBoundingClientRect();
            }
            if (doc != null && doc === doc.window) {
                win = doc;
            } else {
                win = doc.nodeType === 9 && (doc.defaultView || doc.parentWindow);
            }
            return {
                left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0) + offset.left,
                top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0) + offset.top
            };
        }
        function getElementStyle(element, attr) {
            if (!element.style) {
                element.style = {};
            }
            if (fabric.document.defaultView && fabric.document.defaultView.getComputedStyle) {
                return fabric.document.defaultView.getComputedStyle(element, null)[attr];
            } else {
                var value = element.style[attr];
                if (!value && element.currentStyle) value = element.currentStyle[attr];
                return value;
            }
        }
        (function() {
            var style = fabric.document.documentElement.style;
            var selectProp = "userSelect" in style ? "userSelect" : "MozUserSelect" in style ? "MozUserSelect" : "WebkitUserSelect" in style ? "WebkitUserSelect" : "KhtmlUserSelect" in style ? "KhtmlUserSelect" : "";
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
                        if (typeof this.readyState === "string" && this.readyState !== "loaded" && this.readyState !== "complete") return;
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
            var method = options.method ? options.method.toUpperCase() : "GET", onComplete = options.onComplete || function() {}, xhr = makeXHR(), body;
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
    (function() {
        function animate(options) {
            options || (options = {});
            var start = +new Date(), duration = options.duration || 500, finish = start + duration, time, onChange = options.onChange || function() {}, abort = options.abort || function() {
                return false;
            }, easing = options.easing || function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            }, startValue = "startValue" in options ? options.startValue : 0, endValue = "endValue" in options ? options.endValue : 100, byValue = options.byValue || endValue - startValue;
            options.onStart && options.onStart();
            (function tick() {
                time = +new Date();
                var currentTime = time > finish ? duration : time - start;
                onChange(easing(currentTime, startValue, byValue, duration));
                if (time > finish || abort()) {
                    options.onComplete && options.onComplete();
                    return;
                }
                requestAnimFrame(tick);
            })();
        }
        var _requestAnimFrame = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(callback) {
            fabric.window.setTimeout(callback, 1e3 / 60);
        };
        var requestAnimFrame = function() {
            return _requestAnimFrame.apply(fabric.window, arguments);
        };
        fabric.util.animate = animate;
        fabric.util.requestAnimFrame = requestAnimFrame;
    })();
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
                return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
            },
            distanceFrom: function(that) {
                var dx = this.x - that.x, dy = this.y - that.y;
                return Math.sqrt(dx * dx + dy * dy);
            },
            midPointFrom: function(that) {
                return new Point(this.x + (that.x - this.x) / 2, this.y + (that.y - this.y) / 2);
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
            },
            setFromPoint: function(that) {
                this.x = that.x;
                this.y = that.y;
            },
            swap: function(that) {
                var x = this.x, y = this.y;
                this.x = that.x;
                this.y = that.y;
                that.x = x;
                that.y = y;
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
            appendPoint: function(point) {
                this.points.push(point);
            },
            appendPoints: function(points) {
                this.points = this.points.concat(points);
            }
        };
        fabric.Intersection.intersectLineLine = function(a1, a2, b1, b2) {
            var result, ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x), ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x), u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
            if (u_b !== 0) {
                var ua = ua_t / u_b, ub = ub_t / u_b;
                if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                    result = new Intersection("Intersection");
                    result.points.push(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
                } else {
                    result = new Intersection();
                }
            } else {
                if (ua_t === 0 || ub_t === 0) {
                    result = new Intersection("Coincident");
                } else {
                    result = new Intersection("Parallel");
                }
            }
            return result;
        };
        fabric.Intersection.intersectLinePolygon = function(a1, a2, points) {
            var result = new Intersection(), length = points.length;
            for (var i = 0; i < length; i++) {
                var b1 = points[i], b2 = points[(i + 1) % length], inter = Intersection.intersectLineLine(a1, a2, b1, b2);
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
                source = Color.sourceFromHex(color);
                if (!source) {
                    source = Color.sourceFromRgb(color);
                }
                if (!source) {
                    source = Color.sourceFromHsl(color);
                }
                if (source) {
                    this.setSource(source);
                }
            },
            _rgbToHsl: function(r, g, b) {
                r /= 255, g /= 255, b /= 255;
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
                var source = this.getSource();
                var r = source[0].toString(16);
                r = r.length === 1 ? "0" + r : r;
                var g = source[1].toString(16);
                g = g.length === 1 ? "0" + g : g;
                var b = source[2].toString(16);
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
        fabric.Color.reRGBa = /^rgba?\(\s*(\d{1,3}\%?)\s*,\s*(\d{1,3}\%?)\s*,\s*(\d{1,3}\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
        fabric.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
        fabric.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;
        fabric.Color.colorNameMap = {
            aqua: "#00FFFF",
            black: "#000000",
            blue: "#0000FF",
            fuchsia: "#FF00FF",
            gray: "#808080",
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
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
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
            if (!match) return;
            var h = (parseFloat(match[1]) % 360 + 360) % 360 / 360, s = parseFloat(match[2]) / (/%$/.test(match[2]) ? 100 : 1), l = parseFloat(match[3]) / (/%$/.test(match[3]) ? 100 : 1), r, g, b;
            if (s === 0) {
                r = g = b = l;
            } else {
                var q = l <= .5 ? l * (s + 1) : l + s - l * s;
                var p = l * 2 - q;
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
                var value = color.slice(color.indexOf("#") + 1), isShortNotation = value.length === 3, r = isShortNotation ? value.charAt(0) + value.charAt(0) : value.substring(0, 2), g = isShortNotation ? value.charAt(1) + value.charAt(1) : value.substring(2, 4), b = isShortNotation ? value.charAt(2) + value.charAt(2) : value.substring(4, 6);
                return [ parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1 ];
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
        var extend = fabric.util.object.extend, getElementOffset = fabric.util.getElementOffset, removeFromArray = fabric.util.removeFromArray, removeListener = fabric.util.removeListener, CANVAS_INIT_ERROR = new Error("Could not initialize `canvas` element");
        fabric.StaticCanvas = function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
            fabric.StaticCanvas.activeInstance = this;
        };
        extend(fabric.StaticCanvas.prototype, fabric.Observable);
        extend(fabric.StaticCanvas.prototype, fabric.Collection);
        extend(fabric.StaticCanvas.prototype, fabric.DataURLExporter);
        extend(fabric.StaticCanvas.prototype, {
            backgroundColor: "",
            backgroundImage: "",
            backgroundImageOpacity: 1,
            backgroundImageStretch: true,
            overlayImage: "",
            overlayImageLeft: 0,
            overlayImageTop: 0,
            includeDefaultValues: true,
            stateful: true,
            renderOnAddRemove: true,
            clipTo: null,
            controlsAboveOverlay: false,
            allowTouchScrolling: false,
            onBeforeScaleRotate: function() {},
            _initStatic: function(el, options) {
                this._objects = [];
                this._createLowerCanvas(el);
                this._initOptions(options);
                if (options.overlayImage) {
                    this.setOverlayImage(options.overlayImage, this.renderAll.bind(this));
                }
                if (options.backgroundImage) {
                    this.setBackgroundImage(options.backgroundImage, this.renderAll.bind(this));
                }
                if (options.backgroundColor) {
                    this.setBackgroundColor(options.backgroundColor, this.renderAll.bind(this));
                }
                this.calcOffset();
            },
            calcOffset: function() {
                this._offset = getElementOffset(this.lowerCanvasEl);
                return this;
            },
            setOverlayImage: function(url, callback, options) {
                fabric.util.loadImage(url, function(img) {
                    this.overlayImage = img;
                    if (options && "overlayImageLeft" in options) {
                        this.overlayImageLeft = options.overlayImageLeft;
                    }
                    if (options && "overlayImageTop" in options) {
                        this.overlayImageTop = options.overlayImageTop;
                    }
                    callback && callback();
                }, this);
                return this;
            },
            setBackgroundImage: function(url, callback, options) {
                fabric.util.loadImage(url, function(img) {
                    this.backgroundImage = img;
                    if (options && "backgroundImageOpacity" in options) {
                        this.backgroundImageOpacity = options.backgroundImageOpacity;
                    }
                    if (options && "backgroundImageStretch" in options) {
                        this.backgroundImageStretch = options.backgroundImageStretch;
                    }
                    callback && callback();
                }, this);
                return this;
            },
            setBackgroundColor: function(backgroundColor, callback) {
                if (backgroundColor.source) {
                    var _this = this;
                    fabric.util.loadImage(backgroundColor.source, function(img) {
                        _this.backgroundColor = new fabric.Pattern({
                            source: img,
                            repeat: backgroundColor.repeat
                        });
                        callback && callback();
                    });
                } else {
                    this.backgroundColor = backgroundColor;
                    callback && callback();
                }
                return this;
            },
            _createCanvasElement: function() {
                var element = fabric.document.createElement("canvas");
                if (!element.style) {
                    element.style = {};
                }
                if (!element) {
                    throw CANVAS_INIT_ERROR;
                }
                this._initCanvasElement(element);
                return element;
            },
            _initCanvasElement: function(element) {
                fabric.util.createCanvasElement(element);
                if (typeof element.getContext === "undefined") {
                    throw CANVAS_INIT_ERROR;
                }
            },
            _initOptions: function(options) {
                for (var prop in options) {
                    this[prop] = options[prop];
                }
                this.width = parseInt(this.lowerCanvasEl.width, 10) || 0;
                this.height = parseInt(this.lowerCanvasEl.height, 10) || 0;
                if (!this.lowerCanvasEl.style) return;
                this.lowerCanvasEl.style.width = this.width + "px";
                this.lowerCanvasEl.style.height = this.height + "px";
            },
            _createLowerCanvas: function(canvasEl) {
                this.lowerCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement();
                this._initCanvasElement(this.lowerCanvasEl);
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
            setWidth: function(value) {
                return this._setDimension("width", value);
            },
            setHeight: function(value) {
                return this._setDimension("height", value);
            },
            setDimensions: function(dimensions) {
                for (var prop in dimensions) {
                    this._setDimension(prop, dimensions[prop]);
                }
                return this;
            },
            _setDimension: function(prop, value) {
                this.lowerCanvasEl[prop] = value;
                this.lowerCanvasEl.style[prop] = value + "px";
                if (this.upperCanvasEl) {
                    this.upperCanvasEl[prop] = value;
                    this.upperCanvasEl.style[prop] = value + "px";
                }
                if (this.cacheCanvasEl) {
                    this.cacheCanvasEl[prop] = value;
                }
                if (this.wrapperEl) {
                    this.wrapperEl.style[prop] = value + "px";
                }
                this[prop] = value;
                this.calcOffset();
                this.renderAll();
                return this;
            },
            getElement: function() {
                return this.lowerCanvasEl;
            },
            getActiveObject: function() {
                return null;
            },
            getActiveGroup: function() {
                return null;
            },
            _draw: function(ctx, object) {
                if (!object) return;
                if (this.controlsAboveOverlay) {
                    var hasBorders = object.hasBorders, hasControls = object.hasControls;
                    object.hasBorders = object.hasControls = false;
                    object.render(ctx);
                    object.hasBorders = hasBorders;
                    object.hasControls = hasControls;
                } else {
                    object.render(ctx);
                }
            },
            _onObjectAdded: function(obj) {
                this.stateful && obj.setupState();
                obj.setCoords();
                obj.canvas = this;
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
            },
            getObjects: function() {
                return this._objects;
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
                if (this.discardActiveGroup) {
                    this.discardActiveGroup();
                }
                if (this.discardActiveObject) {
                    this.discardActiveObject();
                }
                this.clearContext(this.contextContainer);
                if (this.contextTop) {
                    this.clearContext(this.contextTop);
                }
                this.fire("canvas:cleared");
                this.renderAll();
                return this;
            },
            renderAll: function(allOnTop) {
                var canvasToDrawOn = this[allOnTop === true && this.interactive ? "contextTop" : "contextContainer"];
                if (this.contextTop && this.selection && !this._groupSelector) {
                    this.clearContext(this.contextTop);
                }
                if (!allOnTop) {
                    this.clearContext(canvasToDrawOn);
                }
                this.fire("before:render");
                if (this.clipTo) {
                    fabric.util.clipContext(this, canvasToDrawOn);
                }
                if (this.backgroundColor) {
                    canvasToDrawOn.fillStyle = this.backgroundColor.toLive ? this.backgroundColor.toLive(canvasToDrawOn) : this.backgroundColor;
                    canvasToDrawOn.fillRect(this.backgroundColor.offsetX || 0, this.backgroundColor.offsetY || 0, this.width, this.height);
                }
                if (typeof this.backgroundImage === "object") {
                    this._drawBackroundImage(canvasToDrawOn);
                }
                var activeGroup = this.getActiveGroup();
                for (var i = 0, length = this._objects.length; i < length; ++i) {
                    if (!activeGroup || activeGroup && this._objects[i] && !activeGroup.contains(this._objects[i])) {
                        this._draw(canvasToDrawOn, this._objects[i]);
                    }
                }
                if (activeGroup) {
                    var sortedObjects = [];
                    this.forEachObject(function(object) {
                        if (activeGroup.contains(object)) {
                            sortedObjects.push(object);
                        }
                    });
                    activeGroup._set("objects", sortedObjects);
                    this._draw(canvasToDrawOn, activeGroup);
                }
                if (this.clipTo) {
                    canvasToDrawOn.restore();
                }
                if (this.overlayImage) {
                    canvasToDrawOn.drawImage(this.overlayImage, this.overlayImageLeft, this.overlayImageTop);
                }
                if (this.controlsAboveOverlay && this.interactive) {
                    this.drawControls(canvasToDrawOn);
                }
                this.fire("after:render");
                return this;
            },
            _drawBackroundImage: function(canvasToDrawOn) {
                canvasToDrawOn.save();
                canvasToDrawOn.globalAlpha = this.backgroundImageOpacity;
                if (this.backgroundImageStretch) {
                    canvasToDrawOn.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
                } else {
                    canvasToDrawOn.drawImage(this.backgroundImage, 0, 0);
                }
                canvasToDrawOn.restore();
            },
            renderTop: function() {
                var ctx = this.contextTop || this.contextContainer;
                this.clearContext(ctx);
                if (this.selection && this._groupSelector) {
                    this._drawSelection();
                }
                var activeGroup = this.getActiveGroup();
                if (activeGroup) {
                    activeGroup.render(ctx);
                }
                if (this.overlayImage) {
                    ctx.drawImage(this.overlayImage, this.overlayImageLeft, this.overlayImageTop);
                }
                this.fire("after:render");
                return this;
            },
            getCenter: function() {
                return {
                    top: this.getHeight() / 2,
                    left: this.getWidth() / 2
                };
            },
            centerObjectH: function(object) {
                object.set("left", this.getCenter().left);
                this.renderAll();
                return this;
            },
            centerObjectV: function(object) {
                object.set("top", this.getCenter().top);
                this.renderAll();
                return this;
            },
            centerObject: function(object) {
                return this.centerObjectH(object).centerObjectV(object);
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
                var activeGroup = this.getActiveGroup();
                if (activeGroup) {
                    this.discardActiveGroup();
                }
                var data = {
                    objects: this.getObjects().map(function(instance) {
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
                    }, this),
                    background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject() : this.backgroundColor
                };
                if (this.backgroundImage) {
                    data.backgroundImage = this.backgroundImage.src;
                    data.backgroundImageOpacity = this.backgroundImageOpacity;
                    data.backgroundImageStretch = this.backgroundImageStretch;
                }
                if (this.overlayImage) {
                    data.overlayImage = this.overlayImage.src;
                    data.overlayImageLeft = this.overlayImageLeft;
                    data.overlayImageTop = this.overlayImageTop;
                }
                fabric.util.populateWithProperties(this, data, propertiesToInclude);
                if (activeGroup) {
                    this.setActiveGroup(new fabric.Group(activeGroup.getObjects()));
                    activeGroup.forEachObject(function(o) {
                        o.set("active", true);
                    });
                }
                return data;
            },
            toSVG: function(options) {
                options || (options = {});
                var markup = [];
                if (!options.suppressPreamble) {
                    markup.push('<?xml version="1.0" standalone="no" ?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n');
                }
                markup.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', options.viewBox ? options.viewBox.width : this.width, '" ', 'height="', options.viewBox ? options.viewBox.height : this.height, '" ', this.backgroundColor && !this.backgroundColor.source ? 'style="background-color: ' + this.backgroundColor + '" ' : null, options.viewBox ? 'viewBox="' + options.viewBox.x + " " + options.viewBox.y + " " + options.viewBox.width + " " + options.viewBox.height + '" ' : null, 'xml:space="preserve">', "<desc>Created with Fabric.js ", fabric.version, "</desc>", "<defs>", fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), "</defs>");
                if (this.backgroundColor && this.backgroundColor.source) {
                    markup.push('<rect x="0" y="0" ', 'width="', this.backgroundColor.repeat === "repeat-y" || this.backgroundColor.repeat === "no-repeat" ? this.backgroundColor.source.width : this.width, '" height="', this.backgroundColor.repeat === "repeat-x" || this.backgroundColor.repeat === "no-repeat" ? this.backgroundColor.source.height : this.height, '" fill="url(#backgroundColorPattern)"', "></rect>");
                }
                if (this.backgroundImage) {
                    markup.push('<image x="0" y="0" ', 'width="', this.backgroundImageStretch ? this.width : this.backgroundImage.width, '" height="', this.backgroundImageStretch ? this.height : this.backgroundImage.height, '" preserveAspectRatio="', this.backgroundImageStretch ? "none" : "defer", '" xlink:href="', this.backgroundImage.src, '" style="opacity:', this.backgroundImageOpacity, '"></image>');
                }
                if (this.overlayImage) {
                    markup.push('<image x="', this.overlayImageLeft, '" y="', this.overlayImageTop, '" width="', this.overlayImage.width, '" height="', this.overlayImage.height, '" xlink:href="', this.overlayImage.src, '"></image>');
                }
                var activeGroup = this.getActiveGroup();
                if (activeGroup) {
                    this.discardActiveGroup();
                }
                for (var i = 0, objects = this.getObjects(), len = objects.length; i < len; i++) {
                    markup.push(objects[i].toSVG());
                }
                if (activeGroup) {
                    this.setActiveGroup(new fabric.Group(activeGroup.getObjects()));
                    activeGroup.forEachObject(function(o) {
                        o.set("active", true);
                    });
                }
                markup.push("</svg>");
                return markup.join("");
            },
            remove: function(object) {
                if (this.getActiveObject() === object) {
                    this.fire("before:selection:cleared", {
                        target: object
                    });
                    this.discardActiveObject();
                    this.fire("selection:cleared");
                }
                return fabric.Collection.remove.call(this, object);
            },
            sendToBack: function(object) {
                removeFromArray(this._objects, object);
                this._objects.unshift(object);
                return this.renderAll && this.renderAll();
            },
            bringToFront: function(object) {
                removeFromArray(this._objects, object);
                this._objects.push(object);
                return this.renderAll && this.renderAll();
            },
            sendBackwards: function(object, intersecting) {
                var idx = this._objects.indexOf(object);
                if (idx !== 0) {
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
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                    this.renderAll && this.renderAll();
                }
                return this;
            },
            bringForward: function(object, intersecting) {
                var idx = this._objects.indexOf(object);
                if (idx !== this._objects.length - 1) {
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
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                    this.renderAll && this.renderAll();
                }
                return this;
            },
            moveTo: function(object, index) {
                removeFromArray(this._objects, object);
                this._objects.splice(index, 0, object);
                return this.renderAll && this.renderAll();
            },
            dispose: function() {
                this.clear();
                if (!this.interactive) return this;
                if (fabric.isTouchSupported) {
                    removeListener(this.upperCanvasEl, "touchstart", this._onMouseDown);
                    removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
                    if (typeof Event !== "undefined" && "remove" in Event) {
                        Event.remove(this.upperCanvasEl, "gesture", this._onGesture);
                    }
                } else {
                    removeListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
                    removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
                    removeListener(fabric.window, "resize", this._onResize);
                }
                return this;
            }
        });
        fabric.StaticCanvas.prototype.toString = function() {
            return "#<fabric.Canvas (" + this.complexity() + "): " + "{ objects: " + this.getObjects().length + " }>";
        };
        extend(fabric.StaticCanvas, {
            EMPTY_JSON: '{"objects": [], "background": "white"}',
            toGrayscale: function(canvasEl) {
                var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = imageData.width, jLen = imageData.height, index, average, i, j;
                for (i = 0; i < iLen; i++) {
                    for (j = 0; j < jLen; j++) {
                        index = i * 4 * jLen + j * 4;
                        average = (data[index] + data[index + 1] + data[index + 2]) / 3;
                        data[index] = average;
                        data[index + 1] = average;
                        data[index + 2] = average;
                    }
                }
                context.putImageData(imageData, 0, 0);
            },
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
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(options) {
            options || (options = {});
            var format = options.format || "png", quality = options.quality || 1, multiplier = options.multiplier || 1;
            if (multiplier !== 1) {
                return this.__toDataURLWithMultiplier(format, quality, multiplier);
            } else {
                return this.__toDataURL(format, quality);
            }
        },
        __toDataURL: function(format, quality) {
            this.renderAll(true);
            var canvasEl = this.upperCanvasEl || this.lowerCanvasEl;
            var data = fabric.StaticCanvas.supports("toDataURLWithQuality") ? canvasEl.toDataURL("image/" + format, quality) : canvasEl.toDataURL("image/" + format);
            this.contextTop && this.clearContext(this.contextTop);
            this.renderAll();
            return data;
        },
        __toDataURLWithMultiplier: function(format, quality, multiplier) {
            var origWidth = this.getWidth(), origHeight = this.getHeight(), scaledWidth = origWidth * multiplier, scaledHeight = origHeight * multiplier, activeObject = this.getActiveObject(), activeGroup = this.getActiveGroup(), ctx = this.contextTop || this.contextContainer;
            this.setWidth(scaledWidth).setHeight(scaledHeight);
            ctx.scale(multiplier, multiplier);
            if (activeGroup) {
                this._tempRemoveBordersControlsFromGroup(activeGroup);
            } else if (activeObject && this.deactivateAll) {
                this.deactivateAll();
            }
            this.width = origWidth;
            this.height = origHeight;
            this.renderAll(true);
            var data = this.__toDataURL(format, quality);
            ctx.scale(1 / multiplier, 1 / multiplier);
            this.setWidth(origWidth).setHeight(origHeight);
            if (activeGroup) {
                this._restoreBordersControlsOnGroup(activeGroup);
            } else if (activeObject && this.setActiveObject) {
                this.setActiveObject(activeObject);
            }
            this.contextTop && this.clearContext(this.contextTop);
            this.renderAll();
            return data;
        },
        toDataURLWithMultiplier: function(format, multiplier, quality) {
            return this.toDataURL({
                format: format,
                multiplier: multiplier,
                quality: quality
            });
        },
        _tempRemoveBordersControlsFromGroup: function(group) {
            group.origHasControls = group.hasControls;
            group.origBorderColor = group.borderColor;
            group.hasControls = true;
            group.borderColor = "rgba(0,0,0,0)";
            group.forEachObject(function(o) {
                o.origBorderColor = o.borderColor;
                o.borderColor = "rgba(0,0,0,0)";
            });
        },
        _restoreBordersControlsOnGroup: function(group) {
            group.hideControls = group.origHideControls;
            group.borderColor = group.origBorderColor;
            group.forEachObject(function(o) {
                o.borderColor = o.origBorderColor;
                delete o.origBorderColor;
            });
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
            originX: "center",
            originY: "center",
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
            cornerSize: 12,
            transparentCorners: true,
            padding: 0,
            borderColor: "rgba(102,153,255,0.75)",
            cornerColor: "rgba(102,153,255,0.5)",
            centerTransform: false,
            fill: "rgb(0,0,0)",
            fillRule: "source-over",
            overlayFill: null,
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
            stateProperties: ("top left width height scaleX scaleY flipX flipY " + "angle opacity cornerSize fill overlayFill originX originY " + "stroke strokeWidth strokeDashArray fillRule " + "borderScaleFactor transformMatrix selectable shadow visible").split(" "),
            initialize: function(options) {
                if (options) {
                    this.setOptions(options);
                }
            },
            _initGradient: function(options) {
                if (options.fill && options.fill.colorStops && !(options.fill instanceof fabric.Gradient)) {
                    this.set("fill", new fabric.Gradient(options.fill));
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
            _initShadow: function(options) {
                if (options.shadow && !(options.shadow instanceof fabric.Shadow)) {
                    this.setShadow(options.shadow);
                }
            },
            _initClipping: function(options) {
                if (!options.clipTo || typeof options.clipTo !== "string") return;
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
                this._initShadow(options);
                this._initClipping(options);
            },
            transform: function(ctx, fromLeft) {
                ctx.globalAlpha = this.opacity;
                var center = fromLeft ? this._getLeftTopCoords() : this.getCenterPoint();
                ctx.translate(center.x, center.y);
                ctx.rotate(degreesToRadians(this.angle));
                ctx.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
            },
            toObject: function(propertiesToInclude) {
                var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
                var object = {
                    type: this.type,
                    originX: this.originX,
                    originY: this.originY,
                    left: toFixed(this.left, NUM_FRACTION_DIGITS),
                    top: toFixed(this.top, NUM_FRACTION_DIGITS),
                    width: toFixed(this.width, NUM_FRACTION_DIGITS),
                    height: toFixed(this.height, NUM_FRACTION_DIGITS),
                    fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                    overlayFill: this.overlayFill,
                    stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                    strokeWidth: toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
                    strokeDashArray: this.strokeDashArray,
                    strokeLineCap: this.strokeLineCap,
                    strokeLineJoin: this.strokeLineJoin,
                    strokeMiterLimit: toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
                    scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
                    scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
                    angle: toFixed(this.getAngle(), NUM_FRACTION_DIGITS),
                    flipX: this.flipX,
                    flipY: this.flipY,
                    opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
                    selectable: this.selectable,
                    hasControls: this.hasControls,
                    hasBorders: this.hasBorders,
                    hasRotatingPoint: this.hasRotatingPoint,
                    transparentCorners: this.transparentCorners,
                    perPixelTargetFind: this.perPixelTargetFind,
                    shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                    visible: this.visible,
                    clipTo: this.clipTo && String(this.clipTo)
                };
                if (!this.includeDefaultValues) {
                    object = this._removeDefaultValues(object);
                }
                fabric.util.populateWithProperties(this, object, propertiesToInclude);
                return object;
            },
            toDatalessObject: function(propertiesToInclude) {
                return this.toObject(propertiesToInclude);
            },
            getSvgStyles: function() {
                var fill = this.fill ? this.fill.toLive ? "url(#SVGID_" + this.fill.id + ")" : this.fill : "none";
                var stroke = this.stroke ? this.stroke.toLive ? "url(#SVGID_" + this.stroke.id + ")" : this.stroke : "none";
                var strokeWidth = this.strokeWidth ? this.strokeWidth : "0";
                var strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(" ") : "";
                var strokeLineCap = this.strokeLineCap ? this.strokeLineCap : "butt";
                var strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : "miter";
                var strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : "4";
                var opacity = typeof this.opacity !== "undefined" ? this.opacity : "1";
                var visibility = this.visible ? "" : " visibility: hidden;";
                var filter = this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : "";
                return [ "stroke: ", stroke, "; ", "stroke-width: ", strokeWidth, "; ", "stroke-dasharray: ", strokeDashArray, "; ", "stroke-linecap: ", strokeLineCap, "; ", "stroke-linejoin: ", strokeLineJoin, "; ", "stroke-miterlimit: ", strokeMiterLimit, "; ", "fill: ", fill, "; ", "opacity: ", opacity, ";", filter, visibility ].join("");
            },
            getSvgTransform: function() {
                var angle = this.getAngle();
                var center = this.getCenterPoint();
                var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
                var translatePart = "translate(" + toFixed(center.x, NUM_FRACTION_DIGITS) + " " + toFixed(center.y, NUM_FRACTION_DIGITS) + ")";
                var anglePart = angle !== 0 ? " rotate(" + toFixed(angle, NUM_FRACTION_DIGITS) + ")" : "";
                var scalePart = this.scaleX === 1 && this.scaleY === 1 ? "" : " scale(" + toFixed(this.scaleX, NUM_FRACTION_DIGITS) + " " + toFixed(this.scaleY, NUM_FRACTION_DIGITS) + ")";
                var flipXPart = this.flipX ? "matrix(-1 0 0 1 0 0) " : "";
                var flipYPart = this.flipY ? "matrix(1 0 0 -1 0 0)" : "";
                return [ translatePart, anglePart, scalePart, flipXPart, flipYPart ].join("");
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
            _removeDefaultValues: function(object) {
                var defaultOptions = fabric.Object.prototype.options;
                if (defaultOptions) {
                    this.stateProperties.forEach(function(prop) {
                        if (object[prop] === defaultOptions[prop]) {
                            delete object[prop];
                        }
                    });
                }
                return object;
            },
            toString: function() {
                return "#<fabric." + capitalize(this.type) + ">";
            },
            get: function(property) {
                return this[property];
            },
            set: function(key, value) {
                if (typeof key === "object") {
                    for (var prop in key) {
                        this._set(prop, key[prop]);
                    }
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
                } else if (key === "width" || key === "height") {
                    this.minScaleLimit = toFixed(Math.min(.1, 1 / Math.max(this.width, this.height)), 2);
                }
                this[key] = value;
                return this;
            },
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
            render: function(ctx, noTransform) {
                if (this.width === 0 || this.height === 0 || !this.visible) return;
                ctx.save();
                var m = this.transformMatrix;
                if (m && !this.group) {
                    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
                }
                if (!noTransform) {
                    this.transform(ctx);
                }
                if (this.stroke) {
                    ctx.lineWidth = this.strokeWidth;
                    ctx.lineCap = this.strokeLineCap;
                    ctx.lineJoin = this.strokeLineJoin;
                    ctx.miterLimit = this.strokeMiterLimit;
                    ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx) : this.stroke;
                }
                if (this.overlayFill) {
                    ctx.fillStyle = this.overlayFill;
                } else if (this.fill) {
                    ctx.fillStyle = this.fill.toLive ? this.fill.toLive(ctx) : this.fill;
                }
                if (m && this.group) {
                    ctx.translate(-this.group.width / 2, -this.group.height / 2);
                    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                }
                this._setShadow(ctx);
                this.clipTo && fabric.util.clipContext(this, ctx);
                this._render(ctx, noTransform);
                this.clipTo && ctx.restore();
                this._removeShadow(ctx);
                if (this.active && !noTransform) {
                    this.drawBorders(ctx);
                    this.drawControls(ctx);
                }
                ctx.restore();
            },
            _setShadow: function(ctx) {
                if (!this.shadow) return;
                ctx.shadowColor = this.shadow.color;
                ctx.shadowBlur = this.shadow.blur;
                ctx.shadowOffsetX = this.shadow.offsetX;
                ctx.shadowOffsetY = this.shadow.offsetY;
            },
            _removeShadow: function(ctx) {
                ctx.shadowColor = "";
                ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
            },
            _renderFill: function(ctx) {
                if (!this.fill) return;
                if (this.fill.toLive) {
                    ctx.save();
                    ctx.translate(-this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0);
                }
                ctx.fill();
                if (this.fill.toLive) {
                    ctx.restore();
                }
                if (this.shadow && !this.shadow.affectStroke) {
                    this._removeShadow(ctx);
                }
            },
            _renderStroke: function(ctx) {
                if (!this.stroke) return;
                ctx.save();
                if (this.strokeDashArray) {
                    if (1 & this.strokeDashArray.length) {
                        this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
                    }
                    if (supportsLineDash) {
                        ctx.setLineDash(this.strokeDashArray);
                        this._stroke && this._stroke(ctx);
                    } else {
                        this._renderDashedStroke && this._renderDashedStroke(ctx);
                    }
                    ctx.stroke();
                } else {
                    this._stroke ? this._stroke(ctx) : ctx.stroke();
                }
                this._removeShadow(ctx);
                ctx.restore();
            },
            clone: function(callback, propertiesToInclude) {
                if (this.constructor.fromObject) {
                    return this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
                }
                return new fabric.Object(this.toObject(propertiesToInclude));
            },
            cloneAsImage: function(callback) {
                var dataUrl = this.toDataURL();
                fabric.util.loadImage(dataUrl, function(img) {
                    if (callback) {
                        callback(new fabric.Image(img));
                    }
                });
                return this;
            },
            toDataURL: function(options) {
                options || (options = {});
                var el = fabric.util.createCanvasElement();
                el.width = this.getBoundingRectWidth();
                el.height = this.getBoundingRectHeight();
                fabric.util.wrapElement(el, "div");
                var canvas = new fabric.Canvas(el);
                if (options.format === "jpeg") {
                    canvas.backgroundColor = "#fff";
                }
                var origParams = {
                    active: this.get("active"),
                    left: this.getLeft(),
                    top: this.getTop()
                };
                this.set({
                    active: false,
                    left: el.width / 2,
                    top: el.height / 2
                });
                canvas.add(this);
                var data = canvas.toDataURL(options);
                this.set(origParams).setCoords();
                canvas.dispose();
                canvas = null;
                return data;
            },
            isType: function(type) {
                return this.type === type;
            },
            toGrayscale: function() {
                var fillValue = this.get("fill");
                if (fillValue) {
                    this.set("overlayFill", new fabric.Color(fillValue).toGrayscale().toRgb());
                }
                return this;
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
                for (var position in options.colorStops) {
                    var color = new fabric.Color(options.colorStops[position]);
                    gradient.colorStops.push({
                        offset: position,
                        color: color.toRgb(),
                        opacity: color.getAlpha()
                    });
                }
                this.set(property, fabric.Gradient.forObject(this, gradient));
            },
            setPatternFill: function(options) {
                return this.set("fill", new fabric.Pattern(options));
            },
            setShadow: function(options) {
                return this.set("shadow", new fabric.Shadow(options));
            },
            centerH: function() {
                this.canvas.centerObjectH(this);
                return this;
            },
            centerV: function() {
                this.canvas.centerObjectV(this);
                return this;
            },
            center: function() {
                return this.centerH().centerV();
            },
            remove: function() {
                return this.canvas.remove(this);
            },
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
        fabric.util.createAccessors(fabric.Object);
        fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;
        extend(fabric.Object.prototype, fabric.Observable);
        fabric.Object.NUM_FRACTION_DIGITS = 2;
        fabric.Object.__uid = 0;
    })(typeof exports !== "undefined" ? exports : this);
    (function() {
        var degreesToRadians = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            translateToCenterPoint: function(point, originX, originY) {
                var cx = point.x, cy = point.y;
                if (originX === "left") {
                    cx = point.x + (this.getWidth() + this.strokeWidth * this.scaleX) / 2;
                } else if (originX === "right") {
                    cx = point.x - (this.getWidth() + this.strokeWidth * this.scaleX) / 2;
                }
                if (originY === "top") {
                    cy = point.y + (this.getHeight() + this.strokeWidth * this.scaleY) / 2;
                } else if (originY === "bottom") {
                    cy = point.y - (this.getHeight() + this.strokeWidth * this.scaleY) / 2;
                }
                return fabric.util.rotatePoint(new fabric.Point(cx, cy), point, degreesToRadians(this.angle));
            },
            translateToOriginPoint: function(center, originX, originY) {
                var x = center.x, y = center.y;
                if (originX === "left") {
                    x = center.x - (this.getWidth() + this.strokeWidth * this.scaleX) / 2;
                } else if (originX === "right") {
                    x = center.x + (this.getWidth() + this.strokeWidth * this.scaleX) / 2;
                }
                if (originY === "top") {
                    y = center.y - (this.getHeight() + this.strokeWidth * this.scaleY) / 2;
                } else if (originY === "bottom") {
                    y = center.y + (this.getHeight() + this.strokeWidth * this.scaleY) / 2;
                }
                return fabric.util.rotatePoint(new fabric.Point(x, y), center, degreesToRadians(this.angle));
            },
            getCenterPoint: function() {
                return this.translateToCenterPoint(new fabric.Point(this.left, this.top), this.originX, this.originY);
            },
            toLocalPoint: function(point, originX, originY) {
                var center = this.getCenterPoint();
                var x, y;
                if (originX !== undefined && originY !== undefined) {
                    if (originX === "left") {
                        x = center.x - (this.getWidth() + this.strokeWidth * this.scaleX) / 2;
                    } else if (originX === "right") {
                        x = center.x + (this.getWidth() + this.strokeWidth * this.scaleX) / 2;
                    } else {
                        x = center.x;
                    }
                    if (originY === "top") {
                        y = center.y - (this.getHeight() + this.strokeWidth * this.scaleY) / 2;
                    } else if (originY === "bottom") {
                        y = center.y + (this.getHeight() + this.strokeWidth * this.scaleY) / 2;
                    } else {
                        y = center.y;
                    }
                } else {
                    x = this.left;
                    y = this.top;
                }
                return fabric.util.rotatePoint(new fabric.Point(point.x, point.y), center, -degreesToRadians(this.angle)).subtractEquals(new fabric.Point(x, y));
            },
            setPositionByOrigin: function(pos, originX, originY) {
                var center = this.translateToCenterPoint(pos, originX, originY);
                var position = this.translateToOriginPoint(center, this.originX, this.originY);
                this.set("left", position.x);
                this.set("top", position.y);
            },
            adjustPosition: function(to) {
                var angle = degreesToRadians(this.angle);
                var hypotHalf = this.getWidth() / 2;
                var xHalf = Math.cos(angle) * hypotHalf;
                var yHalf = Math.sin(angle) * hypotHalf;
                var hypotFull = this.getWidth();
                var xFull = Math.cos(angle) * hypotFull;
                var yFull = Math.sin(angle) * hypotFull;
                if (this.originX === "center" && to === "left" || this.originX === "right" && to === "center") {
                    this.left -= xHalf;
                    this.top -= yHalf;
                } else if (this.originX === "left" && to === "center" || this.originX === "center" && to === "right") {
                    this.left += xHalf;
                    this.top += yHalf;
                } else if (this.originX === "left" && to === "right") {
                    this.left += xFull;
                    this.top += yFull;
                } else if (this.originX === "right" && to === "left") {
                    this.left -= xFull;
                    this.top -= yFull;
                }
                this.setCoords();
                this.originX = to;
            },
            _getLeftTopCoords: function() {
                var angle = degreesToRadians(this.angle);
                var hypotHalf = this.getWidth() / 2;
                var xHalf = Math.cos(angle) * hypotHalf;
                var yHalf = Math.sin(angle) * hypotHalf;
                var x = this.left;
                var y = this.top;
                if (this.originX === "center" || this.originX === "right") {
                    x -= xHalf;
                }
                if (this.originY === "center" || this.originY === "bottom") {
                    y -= yHalf;
                }
                return {
                    x: x,
                    y: y
                };
            }
        });
    })();
    (function() {
        var degreesToRadians = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            oCoords: null,
            intersectsWithRect: function(pointTL, pointBR) {
                var oCoords = this.oCoords, tl = new fabric.Point(oCoords.tl.x, oCoords.tl.y), tr = new fabric.Point(oCoords.tr.x, oCoords.tr.y), bl = new fabric.Point(oCoords.bl.x, oCoords.bl.y), br = new fabric.Point(oCoords.br.x, oCoords.br.y);
                var intersection = fabric.Intersection.intersectPolygonRectangle([ tl, tr, br, bl ], pointTL, pointBR);
                return intersection.status === "Intersection";
            },
            intersectsWithObject: function(other) {
                function getCoords(oCoords) {
                    return {
                        tl: new fabric.Point(oCoords.tl.x, oCoords.tl.y),
                        tr: new fabric.Point(oCoords.tr.x, oCoords.tr.y),
                        bl: new fabric.Point(oCoords.bl.x, oCoords.bl.y),
                        br: new fabric.Point(oCoords.br.x, oCoords.br.y)
                    };
                }
                var thisCoords = getCoords(this.oCoords), otherCoords = getCoords(other.oCoords);
                var intersection = fabric.Intersection.intersectPolygonPolygon([ thisCoords.tl, thisCoords.tr, thisCoords.br, thisCoords.bl ], [ otherCoords.tl, otherCoords.tr, otherCoords.br, otherCoords.bl ]);
                return intersection.status === "Intersection";
            },
            isContainedWithinObject: function(other) {
                var boundingRect = other.getBoundingRect(), point1 = new fabric.Point(boundingRect.left, boundingRect.top), point2 = new fabric.Point(boundingRect.left + boundingRect.width, boundingRect.top + boundingRect.height);
                return this.isContainedWithinRect(point1, point2);
            },
            isContainedWithinRect: function(pointTL, pointBR) {
                var boundingRect = this.getBoundingRect();
                return boundingRect.left > pointTL.x && boundingRect.left + boundingRect.width < pointBR.x && boundingRect.top > pointTL.y && boundingRect.top + boundingRect.height < pointBR.y;
            },
            containsPoint: function(point) {
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
                var b1, b2, a1, a2, xi, yi, xcount = 0, iLine;
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
                        yi = point.y;
                    } else {
                        b1 = 0;
                        b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
                        a1 = point.y - b1 * point.x;
                        a2 = iLine.o.y - b2 * iLine.o.x;
                        xi = -(a1 - a2) / (b1 - b2);
                        yi = a1 + b1 * xi;
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
                var xCoords = [ this.oCoords.tl.x, this.oCoords.tr.x, this.oCoords.br.x, this.oCoords.bl.x ];
                var minX = fabric.util.array.min(xCoords);
                var maxX = fabric.util.array.max(xCoords);
                var width = Math.abs(minX - maxX);
                var yCoords = [ this.oCoords.tl.y, this.oCoords.tr.y, this.oCoords.br.y, this.oCoords.bl.y ];
                var minY = fabric.util.array.min(yCoords);
                var maxY = fabric.util.array.max(yCoords);
                var height = Math.abs(minY - maxY);
                return {
                    left: minX,
                    top: minY,
                    width: width,
                    height: height
                };
            },
            getWidth: function() {
                return this.width * this.scaleX;
            },
            getHeight: function() {
                return this.height * this.scaleY;
            },
            _constrainScale: function(value) {
                if (Math.abs(value) < this.minScaleLimit) {
                    if (value < 0) return -this.minScaleLimit; else return this.minScaleLimit;
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
                var boundingRectFactor = this.getBoundingRectWidth() / this.getWidth();
                return this.scale(value / this.width / boundingRectFactor);
            },
            scaleToHeight: function(value) {
                var boundingRectFactor = this.getBoundingRectHeight() / this.getHeight();
                return this.scale(value / this.height / boundingRectFactor);
            },
            setCoords: function() {
                var strokeWidth = this.strokeWidth > 1 ? this.strokeWidth : 0, padding = this.padding, theta = degreesToRadians(this.angle);
                this.currentWidth = (this.width + strokeWidth) * this.scaleX + padding * 2;
                this.currentHeight = (this.height + strokeWidth) * this.scaleY + padding * 2;
                if (this.currentWidth < 0) {
                    this.currentWidth = Math.abs(this.currentWidth);
                }
                var _hypotenuse = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2));
                var _angle = Math.atan(isFinite(this.currentHeight / this.currentWidth) ? this.currentHeight / this.currentWidth : 0);
                var offsetX = Math.cos(_angle + theta) * _hypotenuse, offsetY = Math.sin(_angle + theta) * _hypotenuse, sinTh = Math.sin(theta), cosTh = Math.cos(theta);
                var coords = this.getCenterPoint();
                var tl = {
                    x: coords.x - offsetX,
                    y: coords.y - offsetY
                };
                var tr = {
                    x: tl.x + this.currentWidth * cosTh,
                    y: tl.y + this.currentWidth * sinTh
                };
                var br = {
                    x: tr.x - this.currentHeight * sinTh,
                    y: tr.y + this.currentHeight * cosTh
                };
                var bl = {
                    x: tl.x - this.currentHeight * sinTh,
                    y: tl.y + this.currentHeight * cosTh
                };
                var ml = {
                    x: tl.x - this.currentHeight / 2 * sinTh,
                    y: tl.y + this.currentHeight / 2 * cosTh
                };
                var mt = {
                    x: tl.x + this.currentWidth / 2 * cosTh,
                    y: tl.y + this.currentWidth / 2 * sinTh
                };
                var mr = {
                    x: tr.x - this.currentHeight / 2 * sinTh,
                    y: tr.y + this.currentHeight / 2 * cosTh
                };
                var mb = {
                    x: bl.x + this.currentWidth / 2 * cosTh,
                    y: bl.y + this.currentWidth / 2 * sinTh
                };
                var mtr = {
                    x: mt.x,
                    y: mt.y
                };
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
            }
        });
    })();
    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function() {
            return this.stateProperties.some(function(prop) {
                return this[prop] !== this.originalState[prop];
            }, this);
        },
        saveState: function(options) {
            this.stateProperties.forEach(function(prop) {
                this.originalState[prop] = this.get(prop);
            }, this);
            if (options && options.stateProperties) {
                options.stateProperties.forEach(function(prop) {
                    this.originalState[prop] = this.get(prop);
                }, this);
            }
            return this;
        },
        setupState: function() {
            this.originalState = {};
            this.saveState();
            return this;
        }
    });
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
            var obj = this, propPair;
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
                    return options.abort.call(obj);
                },
                onChange: function(value) {
                    if (propPair) {
                        obj[propPair[0]][propPair[1]] = value;
                    } else {
                        obj.set(property, value);
                    }
                    if (skipCallbacks) return;
                    options.onChange && options.onChange();
                },
                onComplete: function() {
                    if (skipCallbacks) return;
                    obj.setCoords();
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
                this.set("width", Math.abs(this.x2 - this.x1) || 1);
                this.set("height", Math.abs(this.y2 - this.y1) || 1);
                this.set("left", "left" in options ? options.left : Math.min(this.x1, this.x2) + this.width / 2);
                this.set("top", "top" in options ? options.top : Math.min(this.y1, this.y2) + this.height / 2);
            },
            _set: function(key, value) {
                this[key] = value;
                if (key in coordProps) {
                    this._setWidthHeight();
                }
                return this;
            },
            _render: function(ctx) {
                ctx.beginPath();
                var isInPathGroup = this.group && this.group.type !== "group";
                if (isInPathGroup && !this.transformMatrix) {
                    ctx.translate(-this.group.width / 2 + this.left, -this.group.height / 2 + this.top);
                }
                if (!this.strokeDashArray || this.strokeDashArray && supportsLineDash) {
                    var xMult = this.x1 <= this.x2 ? -1 : 1;
                    var yMult = this.y1 <= this.y2 ? -1 : 1;
                    ctx.moveTo(this.width === 1 ? 0 : xMult * this.width / 2, this.height === 1 ? 0 : yMult * this.height / 2);
                    ctx.lineTo(this.width === 1 ? 0 : xMult * -1 * this.width / 2, this.height === 1 ? 0 : yMult * -1 * this.height / 2);
                }
                ctx.lineWidth = this.strokeWidth;
                var origStrokeStyle = ctx.strokeStyle;
                ctx.strokeStyle = this.stroke || ctx.fillStyle;
                this._renderStroke(ctx);
                ctx.strokeStyle = origStrokeStyle;
            },
            _renderDashedStroke: function(ctx) {
                var xMult = this.x1 <= this.x2 ? -1 : 1, yMult = this.y1 <= this.y2 ? -1 : 1, x = this.width === 1 ? 0 : xMult * this.width / 2, y = this.height === 1 ? 0 : yMult * this.height / 2;
                ctx.beginPath();
                fabric.util.drawDashedLine(ctx, x, y, -x, -y, this.strokeDashArray);
                ctx.closePath();
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    x1: this.get("x1"),
                    y1: this.get("y1"),
                    x2: this.get("x2"),
                    y2: this.get("y2")
                });
            },
            toSVG: function() {
                var markup = this._createBaseSVGMarkup();
                markup.push("<line ", 'x1="', this.get("x1"), '" y1="', this.get("y1"), '" x2="', this.get("x2"), '" y2="', this.get("y2"), '" style="', this.getSvgStyles(), '"/>');
                return markup.join("");
            },
            complexity: function() {
                return 1;
            }
        });
        fabric.Line.fromObject = function(object) {
            var points = [ object.x1, object.y1, object.x2, object.y2 ];
            return new fabric.Line(points, object);
        };
    })(typeof exports !== "undefined" ? exports : this);
    (function(global) {
        "use strict";
        var fabric = global.fabric || (global.fabric = {}), piBy2 = Math.PI * 2, extend = fabric.util.object.extend;
        if (fabric.Circle) {
            fabric.warn("fabric.Circle is already defined.");
            return;
        }
        fabric.Circle = fabric.util.createClass(fabric.Object, {
            type: "circle",
            initialize: function(options) {
                options = options || {};
                this.set("radius", options.radius || 0);
                this.callSuper("initialize", options);
                var diameter = this.get("radius") * 2;
                this.set("width", diameter).set("height", diameter);
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    radius: this.get("radius")
                });
            },
            toSVG: function() {
                var markup = this._createBaseSVGMarkup();
                markup.push("<circle ", 'cx="0" cy="0" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
                return markup.join("");
            },
            _render: function(ctx, noTransform) {
                ctx.beginPath();
                ctx.globalAlpha = this.group ? ctx.globalAlpha * this.opacity : this.opacity;
                ctx.arc(noTransform ? this.left : 0, noTransform ? this.top : 0, this.radius, 0, piBy2, false);
                ctx.closePath();
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
                this.set("width", value * 2).set("height", value * 2);
            },
            complexity: function() {
                return 1;
            }
        });
        fabric.Circle.fromObject = function(object) {
            return new fabric.Circle(object);
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
            toSVG: function() {
                var markup = this._createBaseSVGMarkup(), widthBy2 = this.width / 2, heightBy2 = this.height / 2;
                var points = [ -widthBy2 + " " + heightBy2, "0 " + -heightBy2, widthBy2 + " " + heightBy2 ].join(",");
                markup.push("<polygon ", 'points="', points, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
                return markup.join("");
            },
            complexity: function() {
                return 1;
            }
        });
        fabric.Triangle.fromObject = function(object) {
            return new fabric.Triangle(object);
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
                this.set("width", this.get("rx") * 2);
                this.set("height", this.get("ry") * 2);
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    rx: this.get("rx"),
                    ry: this.get("ry")
                });
            },
            toSVG: function() {
                var markup = this._createBaseSVGMarkup();
                markup.push("<ellipse ", 'rx="', this.get("rx"), '" ry="', this.get("ry"), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
                return markup.join("");
            },
            render: function(ctx, noTransform) {
                if (this.rx === 0 || this.ry === 0) return;
                return this.callSuper("render", ctx, noTransform);
            },
            _render: function(ctx, noTransform) {
                ctx.beginPath();
                ctx.save();
                ctx.globalAlpha = this.group ? ctx.globalAlpha * this.opacity : this.opacity;
                if (this.transformMatrix && this.group) {
                    ctx.translate(this.cx, this.cy);
                }
                ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
                ctx.arc(noTransform ? this.left : 0, noTransform ? this.top : 0, this.rx, 0, piBy2, false);
                this._renderFill(ctx);
                this._renderStroke(ctx);
                ctx.restore();
            },
            complexity: function() {
                return 1;
            }
        });
        fabric.Ellipse.fromObject = function(object) {
            return new fabric.Ellipse(object);
        };
    })(typeof exports !== "undefined" ? exports : this);
    (function(global) {
        "use strict";
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        if (fabric.Rect) {
            console.warn("fabric.Rect is already defined");
            return;
        }
        fabric.Rect = fabric.util.createClass(fabric.Object, {
            type: "rect",
            rx: 0,
            ry: 0,
            strokeDashArray: null,
            initialize: function(options) {
                options = options || {};
                this._initStateProperties();
                this.callSuper("initialize", options);
                this._initRxRy();
                this.x = options.x || 0;
                this.y = options.y || 0;
            },
            _initStateProperties: function() {
                this.stateProperties = this.stateProperties.concat([ "rx", "ry" ]);
            },
            _initRxRy: function() {
                if (this.rx && !this.ry) {
                    this.ry = this.rx;
                } else if (this.ry && !this.rx) {
                    this.rx = this.ry;
                }
            },
            _render: function(ctx) {
                var rx = this.rx || 0, ry = this.ry || 0, x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height, isInPathGroup = this.group && this.group.type !== "group";
                ctx.beginPath();
                ctx.globalAlpha = isInPathGroup ? ctx.globalAlpha * this.opacity : this.opacity;
                if (this.transformMatrix && isInPathGroup) {
                    ctx.translate(this.width / 2 + this.x, this.height / 2 + this.y);
                }
                if (!this.transformMatrix && isInPathGroup) {
                    ctx.translate(-this.group.width / 2 + this.width / 2 + this.x, -this.group.height / 2 + this.height / 2 + this.y);
                }
                var isRounded = rx !== 0 || ry !== 0;
                ctx.moveTo(x + rx, y);
                ctx.lineTo(x + w - rx, y);
                isRounded && ctx.quadraticCurveTo(x + w, y, x + w, y + ry, x + w, y + ry);
                ctx.lineTo(x + w, y + h - ry);
                isRounded && ctx.quadraticCurveTo(x + w, y + h, x + w - rx, y + h, x + w - rx, y + h);
                ctx.lineTo(x + rx, y + h);
                isRounded && ctx.quadraticCurveTo(x, y + h, x, y + h - ry, x, y + h - ry);
                ctx.lineTo(x, y + ry);
                isRounded && ctx.quadraticCurveTo(x, y, x + rx, y, x + rx, y);
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
            _normalizeLeftTopProperties: function(parsedAttributes) {
                if ("left" in parsedAttributes) {
                    this.set("left", parsedAttributes.left + this.getWidth() / 2);
                }
                this.set("x", parsedAttributes.left || 0);
                if ("top" in parsedAttributes) {
                    this.set("top", parsedAttributes.top + this.getHeight() / 2);
                }
                this.set("y", parsedAttributes.top || 0);
                return this;
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    rx: this.get("rx") || 0,
                    ry: this.get("ry") || 0,
                    x: this.get("x"),
                    y: this.get("y")
                });
            },
            toSVG: function() {
                var markup = this._createBaseSVGMarkup();
                markup.push("<rect ", 'x="', -1 * this.width / 2, '" y="', -1 * this.height / 2, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
                return markup.join("");
            },
            complexity: function() {
                return 1;
            }
        });
        fabric.Rect.fromObject = function(object) {
            return new fabric.Rect(object);
        };
    })(typeof exports !== "undefined" ? exports : this);
    (function(global) {
        "use strict";
        var fabric = global.fabric || (global.fabric = {}), toFixed = fabric.util.toFixed, min = fabric.util.array.min;
        if (fabric.Polyline) {
            fabric.warn("fabric.Polyline is already defined");
            return;
        }
        fabric.Polyline = fabric.util.createClass(fabric.Object, {
            type: "polyline",
            initialize: function(points, options, skipOffset) {
                options = options || {};
                this.set("points", points);
                this.callSuper("initialize", options);
                this._calcDimensions(skipOffset);
            },
            _calcDimensions: function(skipOffset) {
                return fabric.Polygon.prototype._calcDimensions.call(this, skipOffset);
            },
            toObject: function(propertiesToInclude) {
                return fabric.Polygon.prototype.toObject.call(this, propertiesToInclude);
            },
            toSVG: function() {
                var points = [], markup = this._createBaseSVGMarkup();
                for (var i = 0, len = this.points.length; i < len; i++) {
                    points.push(toFixed(this.points[i].x, 2), ",", toFixed(this.points[i].y, 2), " ");
                }
                markup.push("<polyline ", 'points="', points.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
                return markup.join("");
            },
            _render: function(ctx) {
                var point;
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 0, len = this.points.length; i < len; i++) {
                    point = this.points[i];
                    ctx.lineTo(point.x, point.y);
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
        fabric.Polyline.fromObject = function(object) {
            var points = object.points;
            return new fabric.Polyline(points, object, true);
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
            initialize: function(points, options, skipOffset) {
                options = options || {};
                this.points = points;
                this.callSuper("initialize", options);
                this._calcDimensions(skipOffset);
            },
            _calcDimensions: function(skipOffset) {
                var points = this.points, minX = min(points, "x"), minY = min(points, "y"), maxX = max(points, "x"), maxY = max(points, "y");
                this.width = maxX - minX || 1;
                this.height = maxY - minY || 1;
                this.minX = minX;
                this.minY = minY;
                if (skipOffset) return;
                var halfWidth = this.width / 2 + this.minX, halfHeight = this.height / 2 + this.minY;
                this.points.forEach(function(p) {
                    p.x -= halfWidth;
                    p.y -= halfHeight;
                }, this);
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    points: this.points.concat()
                });
            },
            toSVG: function() {
                var points = [], markup = this._createBaseSVGMarkup();
                for (var i = 0, len = this.points.length; i < len; i++) {
                    points.push(toFixed(this.points[i].x, 2), ",", toFixed(this.points[i].y, 2), " ");
                }
                markup.push("<polygon ", 'points="', points.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
                return markup.join("");
            },
            _render: function(ctx) {
                var point;
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 0, len = this.points.length; i < len; i++) {
                    point = this.points[i];
                    ctx.lineTo(point.x, point.y);
                }
                this._renderFill(ctx);
                if (this.stroke || this.strokeDashArray) {
                    ctx.closePath();
                    this._renderStroke(ctx);
                }
            },
            _renderDashedStroke: function(ctx) {
                var p1, p2;
                ctx.beginPath();
                for (var i = 0, len = this.points.length; i < len; i++) {
                    p1 = this.points[i];
                    p2 = this.points[i + 1] || this.points[0];
                    fabric.util.drawDashedLine(ctx, p1.x, p1.y, p2.x, p2.y, this.strokeDashArray);
                }
                ctx.closePath();
            },
            complexity: function() {
                return this.points.length;
            }
        });
        fabric.Polygon.fromObject = function(object) {
            return new fabric.Polygon(object.points, object, true);
        };
    })(typeof exports !== "undefined" ? exports : this);
    (function(global) {
        var commandLengths = {
            m: 2,
            l: 2,
            h: 1,
            v: 1,
            c: 6,
            s: 4,
            q: 4,
            t: 2,
            a: 7
        };
        "use strict";
        var fabric = global.fabric || (global.fabric = {}), min = fabric.util.array.min, max = fabric.util.array.max, extend = fabric.util.object.extend, _toString = Object.prototype.toString, drawArc = fabric.util.drawArc;
        if (fabric.Path) {
            fabric.warn("fabric.Path is already defined");
            return;
        }
        function getX(item) {
            if (item[0] === "H") {
                return item[1];
            }
            return item[item.length - 2];
        }
        function getY(item) {
            if (item[0] === "V") {
                return item[1];
            }
            return item[item.length - 1];
        }
        fabric.Path = fabric.util.createClass(fabric.Object, {
            type: "path",
            initialize: function(path, options) {
                options = options || {};
                this.setOptions(options);
                if (!path) {
                    throw new Error("`path` argument is required");
                }
                var fromArray = _toString.call(path) === "[object Array]";
                this.path = fromArray ? path : path.match && path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
                if (!this.path) return;
                if (!fromArray) {
                    this.path = this._parsePath();
                }
                this._initializePath(options);
                if (options.sourcePath) {
                    this.setSourcePath(options.sourcePath);
                }
            },
            _initializePath: function(options) {
                var isWidthSet = "width" in options && options.width != null, isHeightSet = "height" in options && options.width != null, isLeftSet = "left" in options, isTopSet = "top" in options, origLeft = isLeftSet ? this.left : 0, origTop = isTopSet ? this.top : 0;
                if (!isWidthSet || !isHeightSet) {
                    extend(this, this._parseDimensions());
                    if (isWidthSet) {
                        this.width = options.width;
                    }
                    if (isHeightSet) {
                        this.height = options.height;
                    }
                } else {
                    if (!isTopSet) {
                        this.top = this.height / 2;
                    }
                    if (!isLeftSet) {
                        this.left = this.width / 2;
                    }
                }
                this.pathOffset = this.pathOffset || this._calculatePathOffset(origLeft, origTop);
            },
            _calculatePathOffset: function(origLeft, origTop) {
                return {
                    x: this.left - origLeft - this.width / 2,
                    y: this.top - origTop - this.height / 2
                };
            },
            _render: function(ctx) {
                var current, previous = null, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, tempControlX, tempControlY, l = -(this.width / 2 + this.pathOffset.x), t = -(this.height / 2 + this.pathOffset.y);
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
                        ctx[previous && (previous[0] === "m" || previous[0] === "M") ? "lineTo" : "moveTo"](x + l, y + t);
                        break;

                      case "M":
                        x = current[1];
                        y = current[2];
                        ctx[previous && (previous[0] === "m" || previous[0] === "M") ? "lineTo" : "moveTo"](x + l, y + t);
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
                        controlX = controlX ? 2 * x - controlX : x;
                        controlY = controlY ? 2 * y - controlY : y;
                        ctx.bezierCurveTo(controlX + l, controlY + t, x + current[1] + l, y + current[2] + t, tempX + l, tempY + t);
                        controlX = x + current[1];
                        controlY = y + current[2];
                        x = tempX;
                        y = tempY;
                        break;

                      case "S":
                        tempX = current[3];
                        tempY = current[4];
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
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
                        } else if (previous[0] === "t") {
                            controlX = 2 * x - tempControlX;
                            controlY = 2 * y - tempControlY;
                        } else if (previous[0] === "q") {
                            controlX = 2 * x - controlX;
                            controlY = 2 * y - controlY;
                        }
                        tempControlX = controlX;
                        tempControlY = controlY;
                        ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                        x = tempX;
                        y = tempY;
                        controlX = x + current[1];
                        controlY = y + current[2];
                        break;

                      case "T":
                        tempX = current[1];
                        tempY = current[2];
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
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
                        ctx.closePath();
                        break;
                    }
                    previous = current;
                }
            },
            render: function(ctx, noTransform) {
                if (!this.visible) return;
                ctx.save();
                var m = this.transformMatrix;
                if (m) {
                    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                }
                if (!noTransform) {
                    this.transform(ctx);
                }
                if (this.overlayFill) {
                    ctx.fillStyle = this.overlayFill;
                } else if (this.fill) {
                    ctx.fillStyle = this.fill.toLive ? this.fill.toLive(ctx) : this.fill;
                }
                if (this.stroke) {
                    ctx.lineWidth = this.strokeWidth;
                    ctx.lineCap = this.strokeLineCap;
                    ctx.lineJoin = this.strokeLineJoin;
                    ctx.miterLimit = this.strokeMiterLimit;
                    ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx) : this.stroke;
                }
                this._setShadow(ctx);
                this.clipTo && fabric.util.clipContext(this, ctx);
                ctx.beginPath();
                this._render(ctx);
                this._renderFill(ctx);
                this._renderStroke(ctx);
                this.clipTo && ctx.restore();
                this._removeShadow(ctx);
                if (!noTransform && this.active) {
                    this.drawBorders(ctx);
                    this.drawControls(ctx);
                }
                ctx.restore();
            },
            toString: function() {
                return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>";
            },
            toObject: function(propertiesToInclude) {
                var o = extend(this.callSuper("toObject", propertiesToInclude), {
                    path: this.path,
                    pathOffset: this.pathOffset
                });
                if (this.sourcePath) {
                    o.sourcePath = this.sourcePath;
                }
                if (this.transformMatrix) {
                    o.transformMatrix = this.transformMatrix;
                }
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
            toSVG: function() {
                var chunks = [], markup = this._createBaseSVGMarkup();
                for (var i = 0, len = this.path.length; i < len; i++) {
                    chunks.push(this.path[i].join(" "));
                }
                var path = chunks.join(" ");
                markup.push('<g transform="', this.group ? "" : this.getSvgTransform(), '">', "<path ", 'd="', path, '" style="', this.getSvgStyles(), '" transform="translate(', -this.width / 2, " ", -this.height / 2, ")", '" stroke-linecap="round" ', "/>", "</g>");
                return markup.join("");
            },
            complexity: function() {
                return this.path.length;
            },
            _parsePath: function() {
                var result = [], coords = [], currentPath, parsed, re = /(-?\.\d+)|(-?\d+(\.\d+)?)/g, match, coordsStr;
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
                    var command = coordsParsed[0].toLowerCase(), commandLength = commandLengths[command];
                    if (coordsParsed.length - 1 > commandLength) {
                        for (var k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
                            result.push([ coordsParsed[0] ].concat(coordsParsed.slice(k, k + commandLength)));
                        }
                    } else {
                        result.push(coordsParsed);
                    }
                }
                return result;
            },
            _parseDimensions: function() {
                var aX = [], aY = [], previousX, previousY, isLowerCase = false, x, y;
                this.path.forEach(function(item, i) {
                    if (item[0] !== "H") {
                        previousX = i === 0 ? getX(item) : getX(this.path[i - 1]);
                    }
                    if (item[0] !== "V") {
                        previousY = i === 0 ? getY(item) : getY(this.path[i - 1]);
                    }
                    if (item[0] === item[0].toLowerCase()) {
                        isLowerCase = true;
                    }
                    x = isLowerCase ? previousX + getX(item) : item[0] === "V" ? previousX : getX(item);
                    y = isLowerCase ? previousY + getY(item) : item[0] === "H" ? previousY : getY(item);
                    var val = parseInt(x, 10);
                    if (!isNaN(val)) aX.push(val);
                    val = parseInt(y, 10);
                    if (!isNaN(val)) aY.push(val);
                }, this);
                var minX = min(aX), minY = min(aY), maxX = max(aX), maxY = max(aY), deltaX = maxX - minX, deltaY = maxY - minY;
                var o = {
                    left: this.left + (minX + deltaX / 2),
                    top: this.top + (minY + deltaY / 2),
                    width: deltaX,
                    height: deltaY
                };
                return o;
            }
        });
        fabric.Path.fromObject = function(object, callback) {
            if (typeof object.path === "string") {
                fabric.loadSVGFromURL(object.path, function(elements) {
                    var path = elements[0];
                    var pathUrl = object.path;
                    delete object.path;
                    fabric.util.object.extend(path, object);
                    path.setSourcePath(pathUrl);
                    callback(path);
                });
            } else {
                callback(new fabric.Path(object.path, object));
            }
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
                this.setOptions(options);
                this.setCoords();
                if (options.sourcePath) {
                    this.setSourcePath(options.sourcePath);
                }
            },
            render: function(ctx) {
                if (!this.visible) return;
                ctx.save();
                var m = this.transformMatrix;
                if (m) {
                    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                }
                this.transform(ctx);
                this._setShadow(ctx);
                this.clipTo && fabric.util.clipContext(this, ctx);
                for (var i = 0, l = this.paths.length; i < l; ++i) {
                    this.paths[i].render(ctx, true);
                }
                this.clipTo && ctx.restore();
                this._removeShadow(ctx);
                if (this.active) {
                    this.drawBorders(ctx);
                    this.drawControls(ctx);
                }
                ctx.restore();
            },
            _set: function(prop, value) {
                if ((prop === "fill" || prop === "overlayFill") && value && this.isSameColor()) {
                    var i = this.paths.length;
                    while (i--) {
                        this.paths[i]._set(prop, value);
                    }
                }
                return this.callSuper("_set", prop, value);
            },
            toObject: function(propertiesToInclude) {
                return extend(parentToObject.call(this, propertiesToInclude), {
                    paths: invoke(this.getObjects(), "toObject", propertiesToInclude),
                    sourcePath: this.sourcePath
                });
            },
            toDatalessObject: function(propertiesToInclude) {
                var o = this.toObject(propertiesToInclude);
                if (this.sourcePath) {
                    o.paths = this.sourcePath;
                }
                return o;
            },
            toSVG: function() {
                var objects = this.getObjects();
                var markup = [ "<g ", 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', ">" ];
                for (var i = 0, len = objects.length; i < len; i++) {
                    markup.push(objects[i].toSVG());
                }
                markup.push("</g>");
                return markup.join("");
            },
            toString: function() {
                return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>";
            },
            isSameColor: function() {
                var firstPathFill = this.getObjects()[0].get("fill");
                return this.getObjects().every(function(path) {
                    return path.get("fill") === firstPathFill;
                });
            },
            complexity: function() {
                return this.paths.reduce(function(total, path) {
                    return total + (path && path.complexity ? path.complexity() : 0);
                }, 0);
            },
            toGrayscale: function() {
                var i = this.paths.length;
                while (i--) {
                    this.paths[i].toGrayscale();
                }
                return this;
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
            initialize: function(objects, options) {
                options = options || {};
                this._objects = objects || [];
                for (var i = this._objects.length; i--; ) {
                    this._objects[i].group = this;
                }
                this.originalState = {};
                this.callSuper("initialize");
                this._calcBounds();
                this._updateObjectsCoords();
                if (options) {
                    extend(this, options);
                }
                this._setOpacityIfSame();
                this.setCoords(true);
                this.saveCoords();
            },
            _updateObjectsCoords: function() {
                var groupDeltaX = this.left, groupDeltaY = this.top;
                this.forEachObject(function(object) {
                    var objectLeft = object.get("left"), objectTop = object.get("top");
                    object.set("originalLeft", objectLeft);
                    object.set("originalTop", objectTop);
                    object.set("left", objectLeft - groupDeltaX);
                    object.set("top", objectTop - groupDeltaY);
                    object.setCoords();
                    object.__origHasControls = object.hasControls;
                    object.hasControls = false;
                }, this);
            },
            toString: function() {
                return "#<fabric.Group: (" + this.complexity() + ")>";
            },
            getObjects: function() {
                return this._objects;
            },
            addWithUpdate: function(object) {
                this._restoreObjectsState();
                this._objects.push(object);
                object.group = this;
                this.forEachObject(function(o) {
                    o.set("active", true);
                    o.group = this;
                }, this);
                this._calcBounds();
                this._updateObjectsCoords();
                return this;
            },
            removeWithUpdate: function(object) {
                this._restoreObjectsState();
                this.forEachObject(function(o) {
                    o.set("active", true);
                    o.group = this;
                }, this);
                this.remove(object);
                this._calcBounds();
                this._updateObjectsCoords();
                return this;
            },
            _onObjectAdded: function(object) {
                object.group = this;
            },
            _onObjectRemoved: function(object) {
                delete object.group;
                object.set("active", false);
            },
            delegatedProperties: {
                fill: true,
                opacity: true,
                fontFamily: true,
                fontWeight: true,
                fontSize: true,
                fontStyle: true,
                lineHeight: true,
                textDecoration: true,
                textShadow: true,
                textAlign: true,
                backgroundColor: true
            },
            _set: function(key, value) {
                if (key in this.delegatedProperties) {
                    var i = this._objects.length;
                    this[key] = value;
                    while (i--) {
                        this._objects[i].set(key, value);
                    }
                } else {
                    this[key] = value;
                }
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    objects: invoke(this._objects, "toObject", propertiesToInclude)
                });
            },
            render: function(ctx, noTransform) {
                if (!this.visible) return;
                ctx.save();
                this.transform(ctx);
                var groupScaleFactor = Math.max(this.scaleX, this.scaleY);
                this.clipTo && fabric.util.clipContext(this, ctx);
                for (var i = 0, len = this._objects.length; i < len; i++) {
                    var object = this._objects[i], originalScaleFactor = object.borderScaleFactor, originalHasRotatingPoint = object.hasRotatingPoint;
                    if (!object.visible) continue;
                    object.borderScaleFactor = groupScaleFactor;
                    object.hasRotatingPoint = false;
                    object.render(ctx);
                    object.borderScaleFactor = originalScaleFactor;
                    object.hasRotatingPoint = originalHasRotatingPoint;
                }
                this.clipTo && ctx.restore();
                if (!noTransform && this.active) {
                    this.drawBorders(ctx);
                    this.drawControls(ctx);
                }
                ctx.restore();
                this.setCoords();
            },
            _restoreObjectsState: function() {
                this._objects.forEach(this._restoreObjectState, this);
                return this;
            },
            _restoreObjectState: function(object) {
                var groupLeft = this.get("left"), groupTop = this.get("top"), groupAngle = this.getAngle() * (Math.PI / 180), rotatedTop = Math.cos(groupAngle) * object.get("top") * this.get("scaleY") + Math.sin(groupAngle) * object.get("left") * this.get("scaleX"), rotatedLeft = -Math.sin(groupAngle) * object.get("top") * this.get("scaleY") + Math.cos(groupAngle) * object.get("left") * this.get("scaleX");
                object.setAngle(object.getAngle() + this.getAngle());
                object.set("left", groupLeft + rotatedLeft);
                object.set("top", groupTop + rotatedTop);
                object.set("scaleX", object.get("scaleX") * this.get("scaleX"));
                object.set("scaleY", object.get("scaleY") * this.get("scaleY"));
                object.setCoords();
                object.hasControls = object.__origHasControls;
                delete object.__origHasControls;
                object.set("active", false);
                object.setCoords();
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
            _setOpacityIfSame: function() {
                var objects = this.getObjects(), firstValue = objects[0] ? objects[0].get("opacity") : 1;
                var isSameOpacity = objects.every(function(o) {
                    return o.get("opacity") === firstValue;
                });
                if (isSameOpacity) {
                    this.opacity = firstValue;
                }
            },
            _calcBounds: function() {
                var aX = [], aY = [], minX, minY, maxX, maxY, o, width, height, i = 0, len = this._objects.length;
                for (;i < len; ++i) {
                    o = this._objects[i];
                    o.setCoords();
                    for (var prop in o.oCoords) {
                        aX.push(o.oCoords[prop].x);
                        aY.push(o.oCoords[prop].y);
                    }
                }
                minX = min(aX);
                maxX = max(aX);
                minY = min(aY);
                maxY = max(aY);
                width = maxX - minX || 0;
                height = maxY - minY || 0;
                this.width = width;
                this.height = height;
                this.left = minX + width / 2 || 0;
                this.top = minY + height / 2 || 0;
            },
            toSVG: function() {
                var objectsMarkup = [];
                for (var i = this._objects.length; i--; ) {
                    objectsMarkup.push(this._objects[i].toSVG());
                }
                return '<g transform="' + this.getSvgTransform() + '">' + objectsMarkup.join("") + "</g>";
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
                callback && callback(new fabric.Group(enlivenedObjects, object));
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
        fabric.Image = fabric.util.createClass(fabric.Object, {
            type: "image",
            initialize: function(element, options) {
                options || (options = {});
                this.filters = [];
                this.callSuper("initialize", options);
                this._initElement(element);
                this._initConfig(options);
                if (options.filters) {
                    this.filters = options.filters;
                    this.applyFilters();
                }
            },
            getElement: function() {
                return this._element;
            },
            setElement: function(element, callback) {
                this._element = element;
                this._originalElement = element;
                this._initConfig();
                if (this.filters.length !== 0) {
                    this.applyFilters(callback);
                }
                return this;
            },
            getOriginalSize: function() {
                var element = this.getElement();
                return {
                    width: element.width,
                    height: element.height
                };
            },
            render: function(ctx, noTransform) {
                if (!this.visible) return;
                ctx.save();
                var m = this.transformMatrix;
                var isInPathGroup = this.group && this.group.type !== "group";
                if (isInPathGroup) {
                    ctx.translate(-this.group.width / 2 + this.width / 2, -this.group.height / 2 + this.height / 2);
                }
                if (m) {
                    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                }
                if (!noTransform) {
                    this.transform(ctx);
                }
                ctx.save();
                this._setShadow(ctx);
                this.clipTo && fabric.util.clipContext(this, ctx);
                this._render(ctx);
                if (this.shadow && !this.shadow.affectStroke) {
                    this._removeShadow(ctx);
                }
                this._renderStroke(ctx);
                this.clipTo && ctx.restore();
                ctx.restore();
                if (this.active && !noTransform) {
                    this.drawBorders(ctx);
                    this.drawControls(ctx);
                }
                ctx.restore();
            },
            _stroke: function(ctx) {
                ctx.save();
                ctx.lineWidth = this.strokeWidth;
                ctx.lineCap = this.strokeLineCap;
                ctx.lineJoin = this.strokeLineJoin;
                ctx.miterLimit = this.strokeMiterLimit;
                ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx) : this.stroke;
                ctx.beginPath();
                ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
                ctx.closePath();
                ctx.restore();
            },
            _renderDashedStroke: function(ctx) {
                var x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height;
                ctx.save();
                ctx.lineWidth = this.strokeWidth;
                ctx.lineCap = this.strokeLineCap;
                ctx.lineJoin = this.strokeLineJoin;
                ctx.miterLimit = this.strokeMiterLimit;
                ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx) : this.stroke;
                ctx.beginPath();
                fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
                fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
                fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
                fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
                ctx.closePath();
                ctx.restore();
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    src: this._originalElement.src || this._originalElement._src,
                    filters: this.filters.map(function(filterObj) {
                        return filterObj && filterObj.toObject();
                    })
                });
            },
            toSVG: function() {
                var markup = [];
                markup.push('<g transform="', this.getSvgTransform(), '">', '<image xlink:href="', this.getSvgSrc(), '" style="', this.getSvgStyles(), '" transform="translate(' + -this.width / 2 + " " + -this.height / 2 + ")", '" width="', this.width, '" height="', this.height, '"></image>');
                if (this.stroke || this.strokeDashArray) {
                    var origFill = this.fill;
                    this.fill = null;
                    markup.push("<rect ", 'x="', -1 * this.width / 2, '" y="', -1 * this.height / 2, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>');
                    this.fill = origFill;
                }
                markup.push("</g>");
                return markup.join("");
            },
            getSrc: function() {
                return this.getElement().src || this.getElement()._src;
            },
            toString: function() {
                return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
            },
            clone: function(callback, propertiesToInclude) {
                this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
            },
            applyFilters: function(callback) {
                if (this.filters.length === 0) {
                    this._element = this._originalElement;
                    callback && callback();
                    return;
                }
                var imgEl = this._originalElement, canvasEl = fabric.util.createCanvasElement(), replacement = fabric.util.createImage(), _this = this;
                canvasEl.width = imgEl.width;
                canvasEl.height = imgEl.height;
                canvasEl.getContext("2d").drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);
                this.filters.forEach(function(filter) {
                    filter && filter.applyTo(canvasEl);
                });
                replacement.width = imgEl.width;
                replacement.height = imgEl.height;
                if (fabric.isLikelyNode) {
                    replacement.src = canvasEl.toBuffer(undefined, fabric.Image.pngCompression);
                    _this._element = replacement;
                    callback && callback();
                } else {
                    replacement.onload = function() {
                        _this._element = replacement;
                        callback && callback();
                        replacement.onload = canvasEl = imgEl = null;
                    };
                    replacement.src = canvasEl.toDataURL("image/png");
                }
                return this;
            },
            _render: function(ctx) {
                ctx.drawImage(this._element, -this.width / 2, -this.height / 2, this.width, this.height);
            },
            _resetWidthHeight: function() {
                var element = this.getElement();
                this.set("width", element.width);
                this.set("height", element.height);
            },
            _initElement: function(element) {
                this.setElement(fabric.util.getById(element));
                fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
            },
            _initConfig: function(options) {
                options || (options = {});
                this.setOptions(options);
                this._setWidthHeight(options);
            },
            _initFilters: function(object, callback) {
                if (object.filters && object.filters.length) {
                    fabric.util.enlivenObjects(object.filters, function(enlivenedObjects) {
                        callback && callback(enlivenedObjects);
                    }, "fabric.Image.filters");
                } else {
                    callback && callback();
                }
            },
            _setWidthHeight: function(options) {
                this.width = "width" in options ? options.width : this.getElement().width || 0;
                this.height = "height" in options ? options.height : this.getElement().height || 0;
            },
            complexity: function() {
                return 1;
            }
        });
        fabric.Image.CSS_CANVAS = "canvas-img";
        fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;
        fabric.Image.fromObject = function(object, callback) {
            var img = fabric.document.createElement("img"), src = object.src;
            img.onload = function() {
                fabric.Image.prototype._initFilters.call(object, object, function(filters) {
                    object.filters = filters || [];
                    var instance = new fabric.Image(img, object);
                    callback && callback(instance);
                    img = img.onload = img.onerror = null;
                });
            };
            img.onerror = function() {
                fabric.log("Error loading " + img.src);
                callback && callback(null, true);
                img = img.onload = img.onerror = null;
            };
            img.src = src;
        };
        fabric.Image.fromURL = function(url, callback, imgOptions) {
            fabric.util.loadImage(url, function(img) {
                callback(new fabric.Image(img, imgOptions));
            });
        };
        fabric.Image.async = true;
        fabric.Image.pngCompression = 1;
    })(typeof exports !== "undefined" ? exports : this);
})(window);