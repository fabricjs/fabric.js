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
    var Cufon = function() {
        var api = function() {
            return api.replace.apply(null, arguments);
        };
        var DOM = api.DOM = {
            ready: function() {
                var complete = false, readyStatus = {
                    loaded: 1,
                    complete: 1
                };
                var queue = [], perform = function() {
                    if (complete) return;
                    complete = true;
                    for (var fn; fn = queue.shift(); fn()) ;
                };
                if (fabric.document.addEventListener) {
                    fabric.document.addEventListener("DOMContentLoaded", perform, false);
                    fabric.window.addEventListener("pageshow", perform, false);
                }
                if (!fabric.window.opera && fabric.document.readyState) (function() {
                    readyStatus[fabric.document.readyState] ? perform() : setTimeout(arguments.callee, 10);
                })();
                if (fabric.document.readyState && fabric.document.createStyleSheet) (function() {
                    try {
                        fabric.document.body.doScroll("left");
                        perform();
                    } catch (e) {
                        setTimeout(arguments.callee, 1);
                    }
                })();
                addEvent(fabric.window, "load", perform);
                return function(listener) {
                    if (!arguments.length) perform(); else complete ? listener() : queue.push(listener);
                };
            }()
        };
        var CSS = api.CSS = {
            Size: function(value, base) {
                this.value = parseFloat(value);
                this.unit = String(value).match(/[a-z%]*$/)[0] || "px";
                this.convert = function(value) {
                    return value / base * this.value;
                };
                this.convertFrom = function(value) {
                    return value / this.value * base;
                };
                this.toString = function() {
                    return this.value + this.unit;
                };
            },
            getStyle: function(el) {
                return new Style(el.style);
            },
            quotedList: cached(function(value) {
                var list = [], re = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g, match;
                while (match = re.exec(value)) list.push(match[3] || match[1]);
                return list;
            }),
            ready: function() {
                var complete = false;
                var queue = [], perform = function() {
                    complete = true;
                    for (var fn; fn = queue.shift(); fn()) ;
                };
                var styleElements = Object.prototype.propertyIsEnumerable ? elementsByTagName("style") : {
                    length: 0
                };
                var linkElements = elementsByTagName("link");
                DOM.ready(function() {
                    var linkStyles = 0, link;
                    for (var i = 0, l = linkElements.length; link = linkElements[i], i < l; ++i) {
                        if (!link.disabled && link.rel.toLowerCase() == "stylesheet") ++linkStyles;
                    }
                    if (fabric.document.styleSheets.length >= styleElements.length + linkStyles) perform(); else setTimeout(arguments.callee, 10);
                });
                return function(listener) {
                    if (complete) listener(); else queue.push(listener);
                };
            }(),
            supports: function(property, value) {
                var checker = fabric.document.createElement("span").style;
                if (checker[property] === undefined) return false;
                checker[property] = value;
                return checker[property] === value;
            },
            textAlign: function(word, style, position, wordCount) {
                if (style.get("textAlign") == "right") {
                    if (position > 0) word = " " + word;
                } else if (position < wordCount - 1) word += " ";
                return word;
            },
            textDecoration: function(el, style) {
                if (!style) style = this.getStyle(el);
                var types = {
                    underline: null,
                    overline: null,
                    "line-through": null
                };
                for (var search = el; search.parentNode && search.parentNode.nodeType == 1; ) {
                    var foundAll = true;
                    for (var type in types) {
                        if (types[type]) continue;
                        if (style.get("textDecoration").indexOf(type) != -1) types[type] = style.get("color");
                        foundAll = false;
                    }
                    if (foundAll) break;
                    style = this.getStyle(search = search.parentNode);
                }
                return types;
            },
            textShadow: cached(function(value) {
                if (value == "none") return null;
                var shadows = [], currentShadow = {}, result, offCount = 0;
                var re = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/gi;
                while (result = re.exec(value)) {
                    if (result[0] == ",") {
                        shadows.push(currentShadow);
                        currentShadow = {}, offCount = 0;
                    } else if (result[1]) {
                        currentShadow.color = result[1];
                    } else {
                        currentShadow[[ "offX", "offY", "blur" ][offCount++]] = result[2];
                    }
                }
                shadows.push(currentShadow);
                return shadows;
            }),
            color: cached(function(value) {
                var parsed = {};
                parsed.color = value.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function($0, $1, $2) {
                    parsed.opacity = parseFloat($2);
                    return "rgb(" + $1 + ")";
                });
                return parsed;
            }),
            textTransform: function(text, style) {
                return text[{
                    uppercase: "toUpperCase",
                    lowercase: "toLowerCase"
                }[style.get("textTransform")] || "toString"]();
            }
        };
        function Font(data) {
            var face = this.face = data.face;
            this.glyphs = data.glyphs;
            this.w = data.w;
            this.baseSize = parseInt(face["units-per-em"], 10);
            this.family = face["font-family"].toLowerCase();
            this.weight = face["font-weight"];
            this.style = face["font-style"] || "normal";
            this.viewBox = function() {
                var parts = face.bbox.split(/\s+/);
                var box = {
                    minX: parseInt(parts[0], 10),
                    minY: parseInt(parts[1], 10),
                    maxX: parseInt(parts[2], 10),
                    maxY: parseInt(parts[3], 10)
                };
                box.width = box.maxX - box.minX, box.height = box.maxY - box.minY;
                box.toString = function() {
                    return [ this.minX, this.minY, this.width, this.height ].join(" ");
                };
                return box;
            }();
            this.ascent = -parseInt(face.ascent, 10);
            this.descent = -parseInt(face.descent, 10);
            this.height = -this.ascent + this.descent;
        }
        function FontFamily() {
            var styles = {}, mapping = {
                oblique: "italic",
                italic: "oblique"
            };
            this.add = function(font) {
                (styles[font.style] || (styles[font.style] = {}))[font.weight] = font;
            };
            this.get = function(style, weight) {
                var weights = styles[style] || styles[mapping[style]] || styles.normal || styles.italic || styles.oblique;
                if (!weights) return null;
                weight = {
                    normal: 400,
                    bold: 700
                }[weight] || parseInt(weight, 10);
                if (weights[weight]) return weights[weight];
                var up = {
                    1: 1,
                    99: 0
                }[weight % 100], alts = [], min, max;
                if (up === undefined) up = weight > 400;
                if (weight == 500) weight = 400;
                for (var alt in weights) {
                    alt = parseInt(alt, 10);
                    if (!min || alt < min) min = alt;
                    if (!max || alt > max) max = alt;
                    alts.push(alt);
                }
                if (weight < min) weight = min;
                if (weight > max) weight = max;
                alts.sort(function(a, b) {
                    return (up ? a > weight && b > weight ? a < b : a > b : a < weight && b < weight ? a > b : a < b) ? -1 : 1;
                });
                return weights[alts[0]];
            };
        }
        function HoverHandler() {
            function contains(node, anotherNode) {
                if (node.contains) return node.contains(anotherNode);
                return node.compareDocumentPosition(anotherNode) & 16;
            }
            function onOverOut(e) {
                var related = e.relatedTarget;
                if (!related || contains(this, related)) return;
                trigger(this);
            }
            function onEnterLeave(e) {
                trigger(this);
            }
            function trigger(el) {
                setTimeout(function() {
                    api.replace(el, sharedStorage.get(el).options, true);
                }, 10);
            }
            this.attach = function(el) {
                if (el.onmouseenter === undefined) {
                    addEvent(el, "mouseover", onOverOut);
                    addEvent(el, "mouseout", onOverOut);
                } else {
                    addEvent(el, "mouseenter", onEnterLeave);
                    addEvent(el, "mouseleave", onEnterLeave);
                }
            };
        }
        function Storage() {
            var map = {}, at = 0;
            function identify(el) {
                return el.cufid || (el.cufid = ++at);
            }
            this.get = function(el) {
                var id = identify(el);
                return map[id] || (map[id] = {});
            };
        }
        function Style(style) {
            var custom = {}, sizes = {};
            this.get = function(property) {
                return custom[property] != undefined ? custom[property] : style[property];
            };
            this.getSize = function(property, base) {
                return sizes[property] || (sizes[property] = new CSS.Size(this.get(property), base));
            };
            this.extend = function(styles) {
                for (var property in styles) custom[property] = styles[property];
                return this;
            };
        }
        function addEvent(el, type, listener) {
            if (el.addEventListener) {
                el.addEventListener(type, listener, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + type, function() {
                    return listener.call(el, fabric.window.event);
                });
            }
        }
        function attach(el, options) {
            var storage = sharedStorage.get(el);
            if (storage.options) return el;
            if (options.hover && options.hoverables[el.nodeName.toLowerCase()]) {
                hoverHandler.attach(el);
            }
            storage.options = options;
            return el;
        }
        function cached(fun) {
            var cache = {};
            return function(key) {
                if (!cache.hasOwnProperty(key)) cache[key] = fun.apply(null, arguments);
                return cache[key];
            };
        }
        function getFont(el, style) {
            if (!style) style = CSS.getStyle(el);
            var families = CSS.quotedList(style.get("fontFamily").toLowerCase()), family;
            for (var i = 0, l = families.length; i < l; ++i) {
                family = families[i];
                if (fonts[family]) return fonts[family].get(style.get("fontStyle"), style.get("fontWeight"));
            }
            return null;
        }
        function elementsByTagName(query) {
            return fabric.document.getElementsByTagName(query);
        }
        function merge() {
            var merged = {}, key;
            for (var i = 0, l = arguments.length; i < l; ++i) {
                for (key in arguments[i]) merged[key] = arguments[i][key];
            }
            return merged;
        }
        function process(font, text, style, options, node, el) {
            var separate = options.separate;
            if (separate == "none") return engines[options.engine].apply(null, arguments);
            var fragment = fabric.document.createDocumentFragment(), processed;
            var parts = text.split(separators[separate]), needsAligning = separate == "words";
            if (needsAligning && HAS_BROKEN_REGEXP) {
                if (/^\s/.test(text)) parts.unshift("");
                if (/\s$/.test(text)) parts.push("");
            }
            for (var i = 0, l = parts.length; i < l; ++i) {
                processed = engines[options.engine](font, needsAligning ? CSS.textAlign(parts[i], style, i, l) : parts[i], style, options, node, el, i < l - 1);
                if (processed) fragment.appendChild(processed);
            }
            return fragment;
        }
        function replaceElement(el, options) {
            var font, style, nextNode, redraw;
            for (var node = attach(el, options).firstChild; node; node = nextNode) {
                nextNode = node.nextSibling;
                redraw = false;
                if (node.nodeType == 1) {
                    if (!node.firstChild) continue;
                    if (!/cufon/.test(node.className)) {
                        arguments.callee(node, options);
                        continue;
                    } else redraw = true;
                }
                if (!style) style = CSS.getStyle(el).extend(options);
                if (!font) font = getFont(el, style);
                if (!font) continue;
                if (redraw) {
                    engines[options.engine](font, null, style, options, node, el);
                    continue;
                }
                var text = node.data;
                if (typeof G_vmlCanvasManager != "undefined") {
                    text = text.replace(/\r/g, "\n");
                }
                if (text === "") continue;
                var processed = process(font, text, style, options, node, el);
                if (processed) node.parentNode.replaceChild(processed, node); else node.parentNode.removeChild(node);
            }
        }
        var HAS_BROKEN_REGEXP = " ".split(/\s+/).length == 0;
        var sharedStorage = new Storage();
        var hoverHandler = new HoverHandler();
        var replaceHistory = [];
        var engines = {}, fonts = {}, defaultOptions = {
            engine: null,
            hover: false,
            hoverables: {
                a: true
            },
            printable: true,
            selector: fabric.window.Sizzle || fabric.window.jQuery && function(query) {
                return jQuery(query);
            } || fabric.window.dojo && dojo.query || fabric.window.$$ && function(query) {
                return $$(query);
            } || fabric.window.$ && function(query) {
                return $(query);
            } || fabric.document.querySelectorAll && function(query) {
                return fabric.document.querySelectorAll(query);
            } || elementsByTagName,
            separate: "words",
            textShadow: "none"
        };
        var separators = {
            words: /\s+/,
            characters: ""
        };
        api.now = function() {
            DOM.ready();
            return api;
        };
        api.refresh = function() {
            var currentHistory = replaceHistory.splice(0, replaceHistory.length);
            for (var i = 0, l = currentHistory.length; i < l; ++i) {
                api.replace.apply(null, currentHistory[i]);
            }
            return api;
        };
        api.registerEngine = function(id, engine) {
            if (!engine) return api;
            engines[id] = engine;
            return api.set("engine", id);
        };
        api.registerFont = function(data) {
            var font = new Font(data), family = font.family;
            if (!fonts[family]) fonts[family] = new FontFamily();
            fonts[family].add(font);
            return api.set("fontFamily", '"' + family + '"');
        };
        api.replace = function(elements, options, ignoreHistory) {
            options = merge(defaultOptions, options);
            if (!options.engine) return api;
            if (typeof options.textShadow == "string" && options.textShadow) options.textShadow = CSS.textShadow(options.textShadow);
            if (!ignoreHistory) replaceHistory.push(arguments);
            if (elements.nodeType || typeof elements == "string") elements = [ elements ];
            CSS.ready(function() {
                for (var i = 0, l = elements.length; i < l; ++i) {
                    var el = elements[i];
                    if (typeof el == "string") api.replace(options.selector(el), options, true); else replaceElement(el, options);
                }
            });
            return api;
        };
        api.replaceElement = function(el, options) {
            options = merge(defaultOptions, options);
            if (typeof options.textShadow == "string" && options.textShadow) options.textShadow = CSS.textShadow(options.textShadow);
            return replaceElement(el, options);
        };
        api.engines = engines;
        api.fonts = fonts;
        api.getOptions = function() {
            return merge(defaultOptions);
        };
        api.set = function(option, value) {
            defaultOptions[option] = value;
            return api;
        };
        return api;
    }();
    Cufon.registerEngine("canvas", function() {
        var HAS_INLINE_BLOCK = Cufon.CSS.supports("display", "inline-block");
        var HAS_BROKEN_LINEHEIGHT = !HAS_INLINE_BLOCK && (fabric.document.compatMode == "BackCompat" || /frameset|transitional/i.test(fabric.document.doctype.publicId));
        var styleSheet = fabric.document.createElement("style");
        styleSheet.type = "text/css";
        var textNode = fabric.document.createTextNode(".cufon-canvas{text-indent:0}" + "@media screen,projection{" + ".cufon-canvas{display:inline;display:inline-block;position:relative;vertical-align:middle" + (HAS_BROKEN_LINEHEIGHT ? "" : ";font-size:1px;line-height:1px") + "}.cufon-canvas .cufon-alt{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden}" + (HAS_INLINE_BLOCK ? ".cufon-canvas canvas{position:relative}" : ".cufon-canvas canvas{position:absolute}") + "}" + "@media print{" + ".cufon-canvas{padding:0 !important}" + ".cufon-canvas canvas{display:none}" + ".cufon-canvas .cufon-alt{display:inline}" + "}");
        try {
            styleSheet.appendChild(textNode);
        } catch (e) {
            styleSheet.setAttribute("type", "text/css");
            styleSheet.styleSheet.cssText = textNode.data;
        }
        fabric.document.getElementsByTagName("head")[0].appendChild(styleSheet);
        function generateFromVML(path, context) {
            var atX = 0, atY = 0;
            var code = [], re = /([mrvxe])([^a-z]*)/g, match;
            generate: for (var i = 0; match = re.exec(path); ++i) {
                var c = match[2].split(",");
                switch (match[1]) {
                  case "v":
                    code[i] = {
                        m: "bezierCurveTo",
                        a: [ atX + ~~c[0], atY + ~~c[1], atX + ~~c[2], atY + ~~c[3], atX += ~~c[4], atY += ~~c[5] ]
                    };
                    break;

                  case "r":
                    code[i] = {
                        m: "lineTo",
                        a: [ atX += ~~c[0], atY += ~~c[1] ]
                    };
                    break;

                  case "m":
                    code[i] = {
                        m: "moveTo",
                        a: [ atX = ~~c[0], atY = ~~c[1] ]
                    };
                    break;

                  case "x":
                    code[i] = {
                        m: "closePath",
                        a: []
                    };
                    break;

                  case "e":
                    break generate;
                }
                context[code[i].m].apply(context, code[i].a);
            }
            return code;
        }
        function interpret(code, context) {
            for (var i = 0, l = code.length; i < l; ++i) {
                var line = code[i];
                context[line.m].apply(context, line.a);
            }
        }
        return function(font, text, style, options, node, el) {
            var redraw = text === null;
            var viewBox = font.viewBox;
            var size = style.getSize("fontSize", font.baseSize);
            var letterSpacing = style.get("letterSpacing");
            letterSpacing = letterSpacing == "normal" ? 0 : size.convertFrom(parseInt(letterSpacing, 10));
            var expandTop = 0, expandRight = 0, expandBottom = 0, expandLeft = 0;
            var shadows = options.textShadow, shadowOffsets = [];
            Cufon.textOptions.shadowOffsets = [];
            Cufon.textOptions.shadows = null;
            if (shadows) {
                Cufon.textOptions.shadows = shadows;
                for (var i = 0, l = shadows.length; i < l; ++i) {
                    var shadow = shadows[i];
                    var x = size.convertFrom(parseFloat(shadow.offX));
                    var y = size.convertFrom(parseFloat(shadow.offY));
                    shadowOffsets[i] = [ x, y ];
                }
            }
            var chars = Cufon.CSS.textTransform(redraw ? node.alt : text, style).split("");
            var width = 0, lastWidth = null;
            var maxWidth = 0, lines = 1, lineWidths = [];
            for (var i = 0, l = chars.length; i < l; ++i) {
                if (chars[i] === "\n") {
                    lines++;
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                    lineWidths.push(width);
                    width = 0;
                    continue;
                }
                var glyph = font.glyphs[chars[i]] || font.missingGlyph;
                if (!glyph) continue;
                width += lastWidth = Number(glyph.w || font.w) + letterSpacing;
            }
            lineWidths.push(width);
            width = Math.max(maxWidth, width);
            var lineOffsets = [];
            for (var i = lineWidths.length; i--; ) {
                lineOffsets[i] = width - lineWidths[i];
            }
            if (lastWidth === null) return null;
            expandRight += viewBox.width - lastWidth;
            expandLeft += viewBox.minX;
            var wrapper, canvas;
            if (redraw) {
                wrapper = node;
                canvas = node.firstChild;
            } else {
                wrapper = fabric.document.createElement("span");
                wrapper.className = "cufon cufon-canvas";
                wrapper.alt = text;
                canvas = fabric.document.createElement("canvas");
                wrapper.appendChild(canvas);
                if (options.printable) {
                    var print = fabric.document.createElement("span");
                    print.className = "cufon-alt";
                    print.appendChild(fabric.document.createTextNode(text));
                    wrapper.appendChild(print);
                }
            }
            var wStyle = wrapper.style;
            var cStyle = canvas.style || {};
            var height = size.convert(viewBox.height - expandTop + expandBottom);
            var roundedHeight = Math.ceil(height);
            var roundingFactor = roundedHeight / height;
            canvas.width = Math.ceil(size.convert(width + expandRight - expandLeft) * roundingFactor);
            canvas.height = roundedHeight;
            expandTop += viewBox.minY;
            cStyle.top = Math.round(size.convert(expandTop - font.ascent)) + "px";
            cStyle.left = Math.round(size.convert(expandLeft)) + "px";
            var _width = Math.ceil(size.convert(width * roundingFactor));
            var wrapperWidth = _width + "px";
            var _height = size.convert(font.height);
            var totalLineHeight = (options.lineHeight - 1) * size.convert(-font.ascent / 5) * (lines - 1);
            Cufon.textOptions.width = _width;
            Cufon.textOptions.height = _height * lines + totalLineHeight;
            Cufon.textOptions.lines = lines;
            Cufon.textOptions.totalLineHeight = totalLineHeight;
            if (HAS_INLINE_BLOCK) {
                wStyle.width = wrapperWidth;
                wStyle.height = _height + "px";
            } else {
                wStyle.paddingLeft = wrapperWidth;
                wStyle.paddingBottom = _height - 1 + "px";
            }
            var g = Cufon.textOptions.context || canvas.getContext("2d"), scale = roundedHeight / viewBox.height;
            Cufon.textOptions.fontAscent = font.ascent * scale;
            Cufon.textOptions.boundaries = null;
            for (var offsets = Cufon.textOptions.shadowOffsets, i = shadowOffsets.length; i--; ) {
                offsets[i] = [ shadowOffsets[i][0] * scale, shadowOffsets[i][1] * scale ];
            }
            g.save();
            g.scale(scale, scale);
            g.translate(-expandLeft - 1 / scale * canvas.width / 2 + (Cufon.fonts[font.family].offsetLeft || 0), -expandTop - Cufon.textOptions.height / scale / 2 + (Cufon.fonts[font.family].offsetTop || 0));
            g.lineWidth = font.face["underline-thickness"];
            g.save();
            function line(y, color) {
                g.strokeStyle = color;
                g.beginPath();
                g.moveTo(0, y);
                g.lineTo(width, y);
                g.stroke();
            }
            var textDecoration = Cufon.getTextDecoration(options), isItalic = options.fontStyle === "italic";
            function renderBackground() {
                g.save();
                var left = 0, lineNum = 0, boundaries = [ {
                    left: 0
                } ];
                if (options.backgroundColor) {
                    g.save();
                    g.fillStyle = options.backgroundColor;
                    g.translate(0, font.ascent);
                    g.fillRect(0, 0, width + 10, (-font.ascent + font.descent) * lines);
                    g.restore();
                }
                if (options.textAlign === "right") {
                    g.translate(lineOffsets[lineNum], 0);
                    boundaries[0].left = lineOffsets[lineNum] * scale;
                } else if (options.textAlign === "center") {
                    g.translate(lineOffsets[lineNum] / 2, 0);
                    boundaries[0].left = lineOffsets[lineNum] / 2 * scale;
                }
                for (var i = 0, l = chars.length; i < l; ++i) {
                    if (chars[i] === "\n") {
                        lineNum++;
                        var topOffset = -font.ascent - font.ascent / 5 * options.lineHeight;
                        var boundary = boundaries[boundaries.length - 1];
                        var nextBoundary = {
                            left: 0
                        };
                        boundary.width = left * scale;
                        boundary.height = (-font.ascent + font.descent) * scale;
                        if (options.textAlign === "right") {
                            g.translate(-width, topOffset);
                            g.translate(lineOffsets[lineNum], 0);
                            nextBoundary.left = lineOffsets[lineNum] * scale;
                        } else if (options.textAlign === "center") {
                            g.translate(-left - lineOffsets[lineNum - 1] / 2, topOffset);
                            g.translate(lineOffsets[lineNum] / 2, 0);
                            nextBoundary.left = lineOffsets[lineNum] / 2 * scale;
                        } else {
                            g.translate(-left, topOffset);
                        }
                        boundaries.push(nextBoundary);
                        left = 0;
                        continue;
                    }
                    var glyph = font.glyphs[chars[i]] || font.missingGlyph;
                    if (!glyph) continue;
                    var charWidth = Number(glyph.w || font.w) + letterSpacing;
                    if (options.textBackgroundColor) {
                        g.save();
                        g.fillStyle = options.textBackgroundColor;
                        g.translate(0, font.ascent);
                        g.fillRect(0, 0, charWidth + 10, -font.ascent + font.descent);
                        g.restore();
                    }
                    g.translate(charWidth, 0);
                    left += charWidth;
                    if (i == l - 1) {
                        boundaries[boundaries.length - 1].width = left * scale;
                        boundaries[boundaries.length - 1].height = (-font.ascent + font.descent) * scale;
                    }
                }
                g.restore();
                Cufon.textOptions.boundaries = boundaries;
            }
            function renderText(color) {
                g.fillStyle = color || Cufon.textOptions.color || style.get("color");
                var left = 0, lineNum = 0;
                if (options.textAlign === "right") {
                    g.translate(lineOffsets[lineNum], 0);
                } else if (options.textAlign === "center") {
                    g.translate(lineOffsets[lineNum] / 2, 0);
                }
                for (var i = 0, l = chars.length; i < l; ++i) {
                    if (chars[i] === "\n") {
                        lineNum++;
                        var topOffset = -font.ascent - font.ascent / 5 * options.lineHeight;
                        if (options.textAlign === "right") {
                            g.translate(-width, topOffset);
                            g.translate(lineOffsets[lineNum], 0);
                        } else if (options.textAlign === "center") {
                            g.translate(-left - lineOffsets[lineNum - 1] / 2, topOffset);
                            g.translate(lineOffsets[lineNum] / 2, 0);
                        } else {
                            g.translate(-left, topOffset);
                        }
                        left = 0;
                        continue;
                    }
                    var glyph = font.glyphs[chars[i]] || font.missingGlyph;
                    if (!glyph) continue;
                    var charWidth = Number(glyph.w || font.w) + letterSpacing;
                    if (textDecoration) {
                        g.save();
                        g.strokeStyle = g.fillStyle;
                        g.lineWidth += g.lineWidth;
                        g.beginPath();
                        if (textDecoration.underline) {
                            g.moveTo(0, -font.face["underline-position"] + .5);
                            g.lineTo(charWidth, -font.face["underline-position"] + .5);
                        }
                        if (textDecoration.overline) {
                            g.moveTo(0, font.ascent + .5);
                            g.lineTo(charWidth, font.ascent + .5);
                        }
                        if (textDecoration["line-through"]) {
                            g.moveTo(0, -font.descent + .5);
                            g.lineTo(charWidth, -font.descent + .5);
                        }
                        g.stroke();
                        g.restore();
                    }
                    if (isItalic) {
                        g.save();
                        g.transform(1, 0, -.25, 1, 0, 0);
                    }
                    g.beginPath();
                    if (glyph.d) {
                        if (glyph.code) interpret(glyph.code, g); else glyph.code = generateFromVML("m" + glyph.d, g);
                    }
                    g.fill();
                    if (options.strokeStyle) {
                        g.closePath();
                        g.save();
                        g.lineWidth = options.strokeWidth;
                        g.strokeStyle = options.strokeStyle;
                        g.stroke();
                        g.restore();
                    }
                    if (isItalic) {
                        g.restore();
                    }
                    g.translate(charWidth, 0);
                    left += charWidth;
                }
            }
            g.save();
            renderBackground();
            if (shadows) {
                for (var i = 0, l = shadows.length; i < l; ++i) {
                    var shadow = shadows[i];
                    g.save();
                    g.translate.apply(g, shadowOffsets[i]);
                    renderText(shadow.color);
                    g.restore();
                }
            }
            renderText();
            g.restore();
            g.restore();
            g.restore();
            return wrapper;
        };
    }());
    Cufon.registerEngine("vml", function() {
        if (!fabric.document.namespaces) return;
        var canvasEl = fabric.document.createElement("canvas");
        if (canvasEl && canvasEl.getContext && canvasEl.getContext.apply) return;
        if (fabric.document.namespaces.cvml == null) {
            fabric.document.namespaces.add("cvml", "urn:schemas-microsoft-com:vml");
        }
        var check = fabric.document.createElement("cvml:shape");
        check.style.behavior = "url(#default#VML)";
        if (!check.coordsize) return;
        check = null;
        fabric.document.write('<style type="text/css">' + ".cufon-vml-canvas{text-indent:0}" + "@media screen{" + "cvml\\:shape,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute}" + ".cufon-vml-canvas{position:absolute;text-align:left}" + ".cufon-vml{display:inline-block;position:relative;vertical-align:middle}" + ".cufon-vml .cufon-alt{position:absolute;left:-10000in;font-size:1px}" + "a .cufon-vml{cursor:pointer}" + "}" + "@media print{" + ".cufon-vml *{display:none}" + ".cufon-vml .cufon-alt{display:inline}" + "}" + "</style>");
        function getFontSizeInPixels(el, value) {
            return getSizeInPixels(el, /(?:em|ex|%)$/i.test(value) ? "1em" : value);
        }
        function getSizeInPixels(el, value) {
            if (/px$/i.test(value)) return parseFloat(value);
            var style = el.style.left, runtimeStyle = el.runtimeStyle.left;
            el.runtimeStyle.left = el.currentStyle.left;
            el.style.left = value;
            var result = el.style.pixelLeft;
            el.style.left = style;
            el.runtimeStyle.left = runtimeStyle;
            return result;
        }
        return function(font, text, style, options, node, el, hasNext) {
            var redraw = text === null;
            if (redraw) text = node.alt;
            var viewBox = font.viewBox;
            var size = style.computedFontSize || (style.computedFontSize = new Cufon.CSS.Size(getFontSizeInPixels(el, style.get("fontSize")) + "px", font.baseSize));
            var letterSpacing = style.computedLSpacing;
            if (letterSpacing == undefined) {
                letterSpacing = style.get("letterSpacing");
                style.computedLSpacing = letterSpacing = letterSpacing == "normal" ? 0 : ~~size.convertFrom(getSizeInPixels(el, letterSpacing));
            }
            var wrapper, canvas;
            if (redraw) {
                wrapper = node;
                canvas = node.firstChild;
            } else {
                wrapper = fabric.document.createElement("span");
                wrapper.className = "cufon cufon-vml";
                wrapper.alt = text;
                canvas = fabric.document.createElement("span");
                canvas.className = "cufon-vml-canvas";
                wrapper.appendChild(canvas);
                if (options.printable) {
                    var print = fabric.document.createElement("span");
                    print.className = "cufon-alt";
                    print.appendChild(fabric.document.createTextNode(text));
                    wrapper.appendChild(print);
                }
                if (!hasNext) wrapper.appendChild(fabric.document.createElement("cvml:shape"));
            }
            var wStyle = wrapper.style;
            var cStyle = canvas.style;
            var height = size.convert(viewBox.height), roundedHeight = Math.ceil(height);
            var roundingFactor = roundedHeight / height;
            var minX = viewBox.minX, minY = viewBox.minY;
            cStyle.height = roundedHeight;
            cStyle.top = Math.round(size.convert(minY - font.ascent));
            cStyle.left = Math.round(size.convert(minX));
            wStyle.height = size.convert(font.height) + "px";
            var textDecoration = Cufon.getTextDecoration(options);
            var color = style.get("color");
            var chars = Cufon.CSS.textTransform(text, style).split("");
            var width = 0, offsetX = 0, advance = null;
            var glyph, shape, shadows = options.textShadow;
            for (var i = 0, k = 0, l = chars.length; i < l; ++i) {
                glyph = font.glyphs[chars[i]] || font.missingGlyph;
                if (glyph) width += advance = ~~(glyph.w || font.w) + letterSpacing;
            }
            if (advance === null) return null;
            var fullWidth = -minX + width + (viewBox.width - advance);
            var shapeWidth = size.convert(fullWidth * roundingFactor), roundedShapeWidth = Math.round(shapeWidth);
            var coordSize = fullWidth + "," + viewBox.height, coordOrigin;
            var stretch = "r" + coordSize + "nsnf";
            for (i = 0; i < l; ++i) {
                glyph = font.glyphs[chars[i]] || font.missingGlyph;
                if (!glyph) continue;
                if (redraw) {
                    shape = canvas.childNodes[k];
                    if (shape.firstChild) shape.removeChild(shape.firstChild);
                } else {
                    shape = fabric.document.createElement("cvml:shape");
                    canvas.appendChild(shape);
                }
                shape.stroked = "f";
                shape.coordsize = coordSize;
                shape.coordorigin = coordOrigin = minX - offsetX + "," + minY;
                shape.path = (glyph.d ? "m" + glyph.d + "xe" : "") + "m" + coordOrigin + stretch;
                shape.fillcolor = color;
                var sStyle = shape.style;
                sStyle.width = roundedShapeWidth;
                sStyle.height = roundedHeight;
                if (shadows) {
                    var shadow1 = shadows[0], shadow2 = shadows[1];
                    var color1 = Cufon.CSS.color(shadow1.color), color2;
                    var shadow = fabric.document.createElement("cvml:shadow");
                    shadow.on = "t";
                    shadow.color = color1.color;
                    shadow.offset = shadow1.offX + "," + shadow1.offY;
                    if (shadow2) {
                        color2 = Cufon.CSS.color(shadow2.color);
                        shadow.type = "double";
                        shadow.color2 = color2.color;
                        shadow.offset2 = shadow2.offX + "," + shadow2.offY;
                    }
                    shadow.opacity = color1.opacity || color2 && color2.opacity || 1;
                    shape.appendChild(shadow);
                }
                offsetX += ~~(glyph.w || font.w) + letterSpacing;
                ++k;
            }
            wStyle.width = Math.max(Math.ceil(size.convert(width * roundingFactor)), 0);
            return wrapper;
        };
    }());
    Cufon.getTextDecoration = function(options) {
        return {
            underline: options.textDecoration === "underline",
            overline: options.textDecoration === "overline",
            "line-through": options.textDecoration === "line-through"
        };
    };
    if (typeof exports != "undefined") {
        exports.Cufon = Cufon;
    }
    var JSON;
    if (!JSON) {
        JSON = {};
    }
    (function() {
        "use strict";
        function f(n) {
            return n < 10 ? "0" + n : n;
        }
        if (typeof Date.prototype.toJSON !== "function") {
            Date.prototype.toJSON = function(key) {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
            };
            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
                return this.valueOf();
            };
        }
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;
        function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }
        function str(key, holder) {
            var i, k, v, length, mind = gap, partial, value = holder[key];
            if (value && typeof value === "object" && typeof value.toJSON === "function") {
                value = value.toJSON(key);
            }
            if (typeof rep === "function") {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
              case "string":
                return quote(value);

              case "number":
                return isFinite(value) ? String(value) : "null";

              case "boolean":
              case "null":
                return String(value);

              case "object":
                if (!value) {
                    return "null";
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
            }
        }
        if (typeof JSON.stringify !== "function") {
            JSON.stringify = function(value, replacer, space) {
                var i;
                gap = "";
                indent = "";
                if (typeof space === "number") {
                    for (i = 0; i < space; i += 1) {
                        indent += " ";
                    }
                } else if (typeof space === "string") {
                    indent = space;
                }
                rep = replacer;
                if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                    throw new Error("JSON.stringify");
                }
                return str("", {
                    "": value
                });
            };
        }
        if (typeof JSON.parse !== "function") {
            JSON.parse = function(text, reviver) {
                var j;
                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function(a) {
                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                    j = eval("(" + text + ")");
                    return typeof reviver === "function" ? walk({
                        "": j
                    }, "") : j;
                }
                throw new SyntaxError("JSON.parse");
            };
        }
    })();
    if (typeof Event === "undefined") var Event = {};
    if (typeof eventjs === "undefined") var eventjs = Event;
    Event = function(root) {
        "use strict";
        root.modifyEventListener = false;
        root.modifySelectors = false;
        root.add = function(target, type, listener, configure) {
            return eventManager(target, type, listener, configure, "add");
        };
        root.remove = function(target, type, listener, configure) {
            return eventManager(target, type, listener, configure, "remove");
        };
        root.stop = function(event) {
            if (event.stopPropagation) event.stopPropagation();
            event.cancelBubble = true;
            event.bubble = 0;
        };
        root.prevent = function(event) {
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
        };
        root.cancel = function(event) {
            root.stop(event);
            root.prevent(event);
        };
        root.supports = function(target, type) {
            if (typeof target === "string") {
                type = target;
                target = window;
            }
            type = "on" + type;
            if (type in target) return true;
            if (!target.setAttribute) target = document.createElement("div");
            if (target.setAttribute && target.removeAttribute) {
                target.setAttribute(type, "");
                var isSupported = typeof target[type] === "function";
                if (typeof target[type] !== "undefined") target[type] = null;
                target.removeAttribute(type);
                return isSupported;
            }
        };
        var clone = function(obj) {
            if (!obj || typeof obj !== "object") return obj;
            var temp = new obj.constructor();
            for (var key in obj) {
                if (!obj[key] || typeof obj[key] !== "object") {
                    temp[key] = obj[key];
                } else {
                    temp[key] = clone(obj[key]);
                }
            }
            return temp;
        };
        var eventManager = function(target, type, listener, configure, trigger, fromOverwrite) {
            configure = configure || {};
            if (typeof target === "string" && type === "ready") {
                var time = new Date().getTime();
                var timeout = configure.timeout;
                var ms = configure.interval || 1e3 / 60;
                var interval = window.setInterval(function() {
                    if (new Date().getTime() - time > timeout) {
                        window.clearInterval(interval);
                    }
                    if (document.querySelector(target)) {
                        window.clearInterval(interval);
                        listener();
                    }
                }, ms);
                return;
            }
            if (typeof target === "string") {
                target = document.querySelectorAll(target);
                if (target.length === 0) return createError("Missing target on listener!");
                if (target.length === 1) {
                    target = target[0];
                }
            }
            var event;
            var events = {};
            if (target.length > 0) {
                for (var n0 = 0, length0 = target.length; n0 < length0; n0++) {
                    event = eventManager(target[n0], type, listener, clone(configure), trigger);
                    if (event) events[n0] = event;
                }
                return createBatchCommands(events);
            }
            if (type.indexOf && type.indexOf(" ") !== -1) type = type.split(" ");
            if (type.indexOf && type.indexOf(",") !== -1) type = type.split(",");
            if (typeof type !== "string") {
                if (typeof type.length === "number") {
                    for (var n1 = 0, length1 = type.length; n1 < length1; n1++) {
                        event = eventManager(target, type[n1], listener, clone(configure), trigger);
                        if (event) events[type[n1]] = event;
                    }
                } else {
                    for (var key in type) {
                        if (typeof type[key] === "function") {
                            event = eventManager(target, key, type[key], clone(configure), trigger);
                        } else {
                            event = eventManager(target, key, type[key].listener, clone(type[key]), trigger);
                        }
                        if (event) events[key] = event;
                    }
                }
                return createBatchCommands(events);
            }
            if (typeof listener !== "function") return createError("Listener is not a function!");
            var useCapture = configure.useCapture || false;
            var id = normalize(type) + getID(target) + "." + getID(listener) + "." + (useCapture ? 1 : 0);
            if (root.Gesture && root.Gesture._gestureHandlers[type]) {
                if (trigger === "remove") {
                    if (!wrappers[id]) return;
                    wrappers[id].remove();
                    delete wrappers[id];
                } else if (trigger === "add") {
                    if (wrappers[id]) return wrappers[id];
                    if (configure.useCall && !root.modifyEventListener) {
                        var tmp = listener;
                        listener = function(event, self) {
                            for (var key in self) event[key] = self[key];
                            return tmp.call(target, event);
                        };
                    }
                    configure.gesture = type;
                    configure.target = target;
                    configure.listener = listener;
                    configure.fromOverwrite = fromOverwrite;
                    wrappers[id] = root.proxy[type](configure);
                }
            } else {
                type = normalize(type);
                if (trigger === "remove") {
                    if (!wrappers[id]) return;
                    target[remove](type, listener, useCapture);
                    delete wrappers[id];
                } else if (trigger === "add") {
                    if (wrappers[id]) return wrappers[id];
                    target[add](type, listener, useCapture);
                    wrappers[id] = {
                        type: type,
                        target: target,
                        listener: listener,
                        remove: function() {
                            root.remove(target, type, listener, configure);
                        }
                    };
                }
            }
            return wrappers[id];
        };
        var createBatchCommands = function(events) {
            return {
                remove: function() {
                    for (var key in events) {
                        events[key].remove();
                    }
                },
                add: function() {
                    for (var key in events) {
                        events[key].add();
                    }
                }
            };
        };
        var createError = function(message) {
            if (typeof console === "undefined") return;
            if (typeof console.error === "undefined") return;
            console.error(message);
        };
        var normalize = function() {
            var translate = {};
            return function(type) {
                if (!root.pointerType) {
                    if (window.navigator.msPointerEnabled) {
                        root.pointerType = "mspointer";
                        translate = {
                            mousedown: "MSPointerDown",
                            mousemove: "MSPointerMove",
                            mouseup: "MSPointerUp"
                        };
                    } else if (root.supports("touchstart")) {
                        root.pointerType = "touch";
                        translate = {
                            mousedown: "touchstart",
                            mouseup: "touchend",
                            mousemove: "touchmove"
                        };
                    } else {
                        root.pointerType = "mouse";
                    }
                }
                if (translate[type]) type = translate[type];
                if (!document.addEventListener) {
                    return "on" + type;
                } else {
                    return type;
                }
            };
        }();
        var wrappers = {};
        var counter = 0;
        var getID = function(object) {
            if (object === window) return "#window";
            if (object === document) return "#document";
            if (!object) return createError("Missing target on listener!");
            if (!object.uniqueID) object.uniqueID = "id" + counter++;
            return object.uniqueID;
        };
        var add = document.addEventListener ? "addEventListener" : "attachEvent";
        var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
        root.createPointerEvent = function(event, self, preventRecord) {
            var eventName = self.gesture;
            var target = self.target;
            var pts = event.changedTouches || root.proxy.getCoords(event);
            if (pts.length) {
                var pt = pts[0];
                self.pointers = preventRecord ? [] : pts;
                self.pageX = pt.pageX;
                self.pageY = pt.pageY;
                self.x = self.pageX;
                self.y = self.pageY;
            }
            var newEvent = document.createEvent("Event");
            newEvent.initEvent(eventName, true, true);
            newEvent.originalEvent = event;
            for (var k in self) {
                if (k === "target") continue;
                newEvent[k] = self[k];
            }
            target.dispatchEvent(newEvent);
        };
        if (root.modifyEventListener && window.HTMLElement) (function() {
            var augmentEventListener = function(proto) {
                var recall = function(trigger) {
                    var handle = trigger + "EventListener";
                    var handler = proto[handle];
                    proto[handle] = function(type, listener, useCapture) {
                        if (root.Gesture && root.Gesture._gestureHandlers[type]) {
                            var configure = useCapture;
                            if (typeof useCapture === "object") {
                                configure.useCall = true;
                            } else {
                                configure = {
                                    useCall: true,
                                    useCapture: useCapture
                                };
                            }
                            eventManager(this, type, listener, configure, trigger, true);
                            handler.call(this, type, listener, useCapture);
                        } else {
                            handler.call(this, normalize(type), listener, useCapture);
                        }
                    };
                };
                recall("add");
                recall("remove");
            };
            if (navigator.userAgent.match(/Firefox/)) {
                augmentEventListener(HTMLDivElement.prototype);
                augmentEventListener(HTMLCanvasElement.prototype);
            } else {
                augmentEventListener(HTMLElement.prototype);
            }
            augmentEventListener(document);
            augmentEventListener(window);
        })();
        if (root.modifySelectors) (function() {
            var proto = NodeList.prototype;
            proto.removeEventListener = function(type, listener, useCapture) {
                for (var n = 0, length = this.length; n < length; n++) {
                    this[n].removeEventListener(type, listener, useCapture);
                }
            };
            proto.addEventListener = function(type, listener, useCapture) {
                for (var n = 0, length = this.length; n < length; n++) {
                    this[n].addEventListener(type, listener, useCapture);
                }
            };
        })();
        return root;
    }(Event);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.pointerSetup = function(conf, self) {
            conf.doc = conf.target.ownerDocument || conf.target;
            conf.minFingers = conf.minFingers || conf.fingers || 1;
            conf.maxFingers = conf.maxFingers || conf.fingers || Infinity;
            conf.position = conf.position || "relative";
            delete conf.fingers;
            self = self || {};
            self.gesture = conf.gesture;
            self.target = conf.target;
            self.pointerType = Event.pointerType;
            if (Event.modifyEventListener && conf.fromOverwrite) conf.listener = Event.createPointerEvent;
            var fingers = 0;
            var type = self.gesture.indexOf("pointer") === 0 && Event.modifyEventListener ? "pointer" : "mouse";
            self.listener = conf.listener;
            self.proxy = function(listener) {
                self.defaultListener = conf.listener;
                conf.listener = listener;
                listener(conf.event, self);
            };
            self.remove = function() {
                if (conf.onPointerDown) Event.remove(conf.target, type + "down", conf.onPointerDown);
                if (conf.onPointerMove) Event.remove(conf.doc, type + "move", conf.onPointerMove);
                if (conf.onPointerUp) Event.remove(conf.doc, type + "up", conf.onPointerUp);
            };
            self.resume = function(opt) {
                if (conf.onPointerMove && (!opt || opt.move)) Event.add(conf.doc, type + "move", conf.onPointerMove);
                if (conf.onPointerUp && (!opt || opt.move)) Event.add(conf.doc, type + "up", conf.onPointerUp);
                conf.fingers = fingers;
            };
            self.pause = function(opt) {
                fingers = conf.fingers;
                if (conf.onPointerMove && (!opt || opt.move)) Event.remove(conf.doc, type + "move", conf.onPointerMove);
                if (conf.onPointerUp && (!opt || opt.up)) Event.remove(conf.doc, type + "up", conf.onPointerUp);
                conf.fingers = 0;
            };
            return self;
        };
        root.pointerStart = function(event, self, conf) {
            var addTouchStart = function(touch, sid) {
                var bbox = conf.bbox;
                var pt = track[sid] = {};
                switch (conf.position) {
                  case "absolute":
                    pt.offsetX = 0;
                    pt.offsetY = 0;
                    break;

                  case "difference":
                    pt.offsetX = touch.pageX;
                    pt.offsetY = touch.pageY;
                    break;

                  case "move":
                    pt.offsetX = touch.pageX - bbox.x1;
                    pt.offsetY = touch.pageY - bbox.y1;
                    break;

                  default:
                    pt.offsetX = bbox.x1;
                    pt.offsetY = bbox.y1;
                    break;
                }
                if (conf.position === "relative") {
                    var x = (touch.pageX + bbox.scrollLeft - pt.offsetX) * bbox.scaleX;
                    var y = (touch.pageY + bbox.scrollTop - pt.offsetY) * bbox.scaleY;
                } else {
                    var x = touch.pageX - pt.offsetX;
                    var y = touch.pageY - pt.offsetY;
                }
                pt.rotation = 0;
                pt.scale = 1;
                pt.startTime = pt.moveTime = new Date().getTime();
                pt.move = {
                    x: x,
                    y: y
                };
                pt.start = {
                    x: x,
                    y: y
                };
                conf.fingers++;
            };
            conf.event = event;
            if (self.defaultListener) {
                conf.listener = self.defaultListener;
                delete self.defaultListener;
            }
            var isTouchStart = !conf.fingers;
            var track = conf.tracker;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier || Infinity;
                if (conf.fingers) {
                    if (conf.fingers >= conf.maxFingers) {
                        var ids = [];
                        for (var sid in conf.tracker) ids.push(sid);
                        self.identifier = ids.join(",");
                        return isTouchStart;
                    }
                    var fingers = 0;
                    for (var rid in track) {
                        if (track[rid].up) {
                            delete track[rid];
                            addTouchStart(touch, sid);
                            conf.cancel = true;
                            break;
                        }
                        fingers++;
                    }
                    if (track[sid]) continue;
                    addTouchStart(touch, sid);
                } else {
                    track = conf.tracker = {};
                    self.bbox = conf.bbox = root.getBoundingBox(conf.target);
                    conf.fingers = 0;
                    conf.cancel = false;
                    addTouchStart(touch, sid);
                }
            }
            var ids = [];
            for (var sid in conf.tracker) ids.push(sid);
            self.identifier = ids.join(",");
            return isTouchStart;
        };
        root.pointerEnd = function(event, self, conf, onPointerUp) {
            var touches = event.touches || [];
            var length = touches.length;
            var exists = {};
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier;
                exists[sid || Infinity] = true;
            }
            for (var sid in conf.tracker) {
                var track = conf.tracker[sid];
                if (exists[sid] || track.up) continue;
                if (onPointerUp) {
                    onPointerUp({
                        pageX: track.pageX,
                        pageY: track.pageY,
                        changedTouches: [ {
                            pageX: track.pageX,
                            pageY: track.pageY,
                            identifier: sid === "Infinity" ? Infinity : sid
                        } ]
                    }, "up");
                }
                track.up = true;
                conf.fingers--;
            }
            if (conf.fingers !== 0) return false;
            var ids = [];
            conf.gestureFingers = 0;
            for (var sid in conf.tracker) {
                conf.gestureFingers++;
                ids.push(sid);
            }
            self.identifier = ids.join(",");
            return true;
        };
        root.getCoords = function(event) {
            if (typeof event.pageX !== "undefined") {
                root.getCoords = function(event) {
                    return Array({
                        type: "mouse",
                        x: event.pageX,
                        y: event.pageY,
                        pageX: event.pageX,
                        pageY: event.pageY,
                        identifier: Infinity
                    });
                };
            } else {
                root.getCoords = function(event) {
                    event = event || window.event;
                    return Array({
                        type: "mouse",
                        x: event.clientX + document.documentElement.scrollLeft,
                        y: event.clientY + document.documentElement.scrollTop,
                        pageX: event.clientX + document.documentElement.scrollLeft,
                        pageY: event.clientY + document.documentElement.scrollTop,
                        identifier: Infinity
                    });
                };
            }
            return root.getCoords(event);
        };
        root.getCoord = function(event) {
            if ("ontouchstart" in window) {
                var pX = 0;
                var pY = 0;
                root.getCoord = function(event) {
                    var touches = event.changedTouches;
                    if (touches.length) {
                        return {
                            x: pX = touches[0].pageX,
                            y: pY = touches[0].pageY
                        };
                    } else {
                        return {
                            x: pX,
                            y: pY
                        };
                    }
                };
            } else if (typeof event.pageX !== "undefined" && typeof event.pageY !== "undefined") {
                root.getCoord = function(event) {
                    return {
                        x: event.pageX,
                        y: event.pageY
                    };
                };
            } else {
                root.getCoord = function(event) {
                    event = event || window.event;
                    return {
                        x: event.clientX + document.documentElement.scrollLeft,
                        y: event.clientY + document.documentElement.scrollTop
                    };
                };
            }
            return root.getCoord(event);
        };
        root.getBoundingBox = function(o) {
            if (o === window || o === document) o = document.body;
            var bbox = {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                scrollLeft: 0,
                scrollTop: 0
            };
            if (o === document.body) {
                bbox.height = window.innerHeight;
                bbox.width = window.innerWidth;
            } else {
                bbox.height = o.offsetHeight;
                bbox.width = o.offsetWidth;
            }
            bbox.scaleX = o.width / bbox.width || 1;
            bbox.scaleY = o.height / bbox.height || 1;
            var tmp = o;
            while (tmp !== null) {
                bbox.x1 += tmp.offsetLeft;
                bbox.y1 += tmp.offsetTop;
                tmp = tmp.offsetParent;
            }
            var tmp = o.parentNode;
            while (tmp !== null) {
                if (tmp === document.body) break;
                if (tmp.scrollTop === undefined) break;
                bbox.scrollLeft += tmp.scrollLeft;
                bbox.scrollTop += tmp.scrollTop;
                tmp = tmp.parentNode;
            }
            bbox.x2 = bbox.x1 + bbox.width;
            bbox.y2 = bbox.y1 + bbox.height;
            return bbox;
        };
        (function() {
            var agent = navigator.userAgent.toLowerCase();
            var mac = agent.indexOf("macintosh") !== -1;
            if (mac && agent.indexOf("khtml") !== -1) {
                var watch = {
                    91: true,
                    93: true
                };
            } else if (mac && agent.indexOf("firefox") !== -1) {
                var watch = {
                    224: true
                };
            } else {
                var watch = {
                    17: true
                };
            }
            root.isMetaKey = function(event) {
                return !!watch[event.keyCode];
            };
            root.metaTracker = function(event) {
                if (watch[event.keyCode]) {
                    root.metaKey = event.type === "keydown";
                }
            };
        })();
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.click = function(conf) {
            conf.maxFingers = conf.maxFingers || conf.fingers || 1;
            var EVENT;
            conf.onPointerDown = function(event) {
                if (root.pointerStart(event, self, conf)) {
                    Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                    Event.add(conf.doc, "mouseup", conf.onPointerUp);
                }
            };
            conf.onPointerMove = function(event) {
                EVENT = event;
            };
            conf.onPointerUp = function(event) {
                if (root.pointerEnd(event, self, conf)) {
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                    if (EVENT.cancelBubble && ++EVENT.bubble > 1) return;
                    var pointers = EVENT.changedTouches || root.getCoords(EVENT);
                    var pointer = pointers[0];
                    var bbox = conf.bbox;
                    var newbbox = root.getBoundingBox(conf.target);
                    if (conf.position === "relative") {
                        var ax = (pointer.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                        var ay = (pointer.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
                    } else {
                        var ax = pointer.pageX - bbox.x1;
                        var ay = pointer.pageY - bbox.y1;
                    }
                    if (ax > 0 && ax < bbox.width && ay > 0 && ay < bbox.height && bbox.scrollTop === newbbox.scrollTop) {
                        conf.listener(EVENT, self);
                    }
                }
            };
            var self = root.pointerSetup(conf);
            self.state = "click";
            Event.add(conf.target, "mousedown", conf.onPointerDown);
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.click = root.click;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.dbltap = root.dblclick = function(conf) {
            conf.maxFingers = conf.maxFingers || conf.fingers || 1;
            var delay = 700;
            var time0, time1, timeout;
            var pointer0, pointer1;
            conf.onPointerDown = function(event) {
                var pointers = event.changedTouches || root.getCoords(event);
                if (time0 && !time1) {
                    pointer1 = pointers[0];
                    time1 = new Date().getTime() - time0;
                } else {
                    pointer0 = pointers[0];
                    time0 = new Date().getTime();
                    time1 = 0;
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        time0 = 0;
                    }, delay);
                }
                if (root.pointerStart(event, self, conf)) {
                    Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                    Event.add(conf.doc, "mouseup", conf.onPointerUp);
                }
            };
            conf.onPointerMove = function(event) {
                if (time0 && !time1) {
                    var pointers = event.changedTouches || root.getCoords(event);
                    pointer1 = pointers[0];
                }
                var bbox = conf.bbox;
                if (conf.position === "relative") {
                    var ax = (pointer1.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                    var ay = (pointer1.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
                } else {
                    var ax = pointer1.pageX - bbox.x1;
                    var ay = pointer1.pageY - bbox.y1;
                }
                if (!(ax > 0 && ax < bbox.width && ay > 0 && ay < bbox.height && Math.abs(pointer1.pageX - pointer0.pageX) <= 25 && Math.abs(pointer1.pageY - pointer0.pageY) <= 25)) {
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    clearTimeout(timeout);
                    time0 = time1 = 0;
                }
            };
            conf.onPointerUp = function(event) {
                if (root.pointerEnd(event, self, conf)) {
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                }
                if (time0 && time1) {
                    if (time1 <= delay && !(event.cancelBubble && ++event.bubble > 1)) {
                        self.state = conf.gesture;
                        conf.listener(event, self);
                    }
                    clearTimeout(timeout);
                    time0 = time1 = 0;
                }
            };
            var self = root.pointerSetup(conf);
            self.state = "dblclick";
            Event.add(conf.target, "mousedown", conf.onPointerDown);
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.dbltap = root.dbltap;
        Event.Gesture._gestureHandlers.dblclick = root.dblclick;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.dragElement = function(that, event) {
            root.drag({
                event: event,
                target: that,
                position: "move",
                listener: function(event, self) {
                    that.style.left = self.x + "px";
                    that.style.top = self.y + "px";
                    Event.prevent(event);
                }
            });
        };
        root.drag = function(conf) {
            conf.gesture = "drag";
            conf.onPointerDown = function(event) {
                if (root.pointerStart(event, self, conf)) {
                    if (!conf.monitor) {
                        Event.add(conf.doc, "mousemove", conf.onPointerMove);
                        Event.add(conf.doc, "mouseup", conf.onPointerUp);
                    }
                }
                conf.onPointerMove(event, "down");
            };
            conf.onPointerMove = function(event, state) {
                if (!conf.tracker) return conf.onPointerDown(event);
                var bbox = conf.bbox;
                var touches = event.changedTouches || root.getCoords(event);
                var length = touches.length;
                for (var i = 0; i < length; i++) {
                    var touch = touches[i];
                    var identifier = touch.identifier || Infinity;
                    var pt = conf.tracker[identifier];
                    if (!pt) continue;
                    pt.pageX = touch.pageX;
                    pt.pageY = touch.pageY;
                    self.state = state || "move";
                    self.identifier = identifier;
                    self.start = pt.start;
                    self.fingers = conf.fingers;
                    if (conf.position === "relative") {
                        self.x = (pt.pageX + bbox.scrollLeft - pt.offsetX) * bbox.scaleX;
                        self.y = (pt.pageY + bbox.scrollTop - pt.offsetY) * bbox.scaleY;
                    } else {
                        self.x = pt.pageX - pt.offsetX;
                        self.y = pt.pageY - pt.offsetY;
                    }
                    conf.listener(event, self);
                }
            };
            conf.onPointerUp = function(event) {
                if (root.pointerEnd(event, self, conf, conf.onPointerMove)) {
                    if (!conf.monitor) {
                        Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                        Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                    }
                }
            };
            var self = root.pointerSetup(conf);
            if (conf.event) {
                conf.onPointerDown(conf.event);
            } else {
                Event.add(conf.target, "mousedown", conf.onPointerDown);
                if (conf.monitor) {
                    Event.add(conf.doc, "mousemove", conf.onPointerMove);
                    Event.add(conf.doc, "mouseup", conf.onPointerUp);
                }
            }
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.drag = root.drag;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        var RAD_DEG = Math.PI / 180;
        root.gesture = function(conf) {
            conf.minFingers = conf.minFingers || conf.fingers || 2;
            conf.onPointerDown = function(event) {
                var fingers = conf.fingers;
                if (root.pointerStart(event, self, conf)) {
                    Event.add(conf.doc, "mousemove", conf.onPointerMove);
                    Event.add(conf.doc, "mouseup", conf.onPointerUp);
                }
                if (conf.fingers === conf.minFingers && fingers !== conf.fingers) {
                    self.fingers = conf.minFingers;
                    self.scale = 1;
                    self.rotation = 0;
                    self.state = "start";
                    var sids = "";
                    for (var key in conf.tracker) sids += key;
                    self.identifier = parseInt(sids);
                    conf.listener(event, self);
                }
            };
            conf.onPointerMove = function(event, state) {
                var bbox = conf.bbox;
                var points = conf.tracker;
                var touches = event.changedTouches || root.getCoords(event);
                var length = touches.length;
                for (var i = 0; i < length; i++) {
                    var touch = touches[i];
                    var sid = touch.identifier || Infinity;
                    var pt = points[sid];
                    if (!pt) continue;
                    if (conf.position === "relative") {
                        pt.move.x = (touch.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                        pt.move.y = (touch.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
                    } else {
                        pt.move.x = touch.pageX - bbox.x1;
                        pt.move.y = touch.pageY - bbox.y1;
                    }
                }
                if (conf.fingers < conf.minFingers) return;
                var touches = [];
                var scale = 0;
                var rotation = 0;
                var centroidx = 0;
                var centroidy = 0;
                var length = 0;
                for (var sid in points) {
                    var touch = points[sid];
                    if (touch.up) continue;
                    centroidx += touch.move.x;
                    centroidy += touch.move.y;
                    length++;
                }
                centroidx /= length;
                centroidy /= length;
                for (var sid in points) {
                    var touch = points[sid];
                    if (touch.up) continue;
                    var start = touch.start;
                    if (!start.distance) {
                        var dx = start.x - centroidx;
                        var dy = start.y - centroidy;
                        start.distance = Math.sqrt(dx * dx + dy * dy);
                        start.angle = Math.atan2(dx, dy) / RAD_DEG;
                    }
                    var dx = touch.move.x - centroidx;
                    var dy = touch.move.y - centroidy;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    scale += distance / start.distance;
                    var angle = Math.atan2(dx, dy) / RAD_DEG;
                    var rotate = (start.angle - angle + 360) % 360 - 180;
                    touch.DEG2 = touch.DEG1;
                    touch.DEG1 = rotate > 0 ? rotate : -rotate;
                    if (typeof touch.DEG2 !== "undefined") {
                        if (rotate > 0) {
                            touch.rotation += touch.DEG1 - touch.DEG2;
                        } else {
                            touch.rotation -= touch.DEG1 - touch.DEG2;
                        }
                        rotation += touch.rotation;
                    }
                    touches.push(touch.move);
                }
                self.touches = touches;
                self.fingers = conf.fingers;
                self.scale = scale / conf.fingers;
                self.rotation = rotation / conf.fingers;
                self.state = "change";
                conf.listener(event, self);
            };
            conf.onPointerUp = function(event) {
                var fingers = conf.fingers;
                if (root.pointerEnd(event, self, conf)) {
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                }
                if (fingers === conf.minFingers && conf.fingers < conf.minFingers) {
                    self.fingers = conf.fingers;
                    self.state = "end";
                    conf.listener(event, self);
                }
            };
            var self = root.pointerSetup(conf);
            Event.add(conf.target, "mousedown", conf.onPointerDown);
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.gesture = root.gesture;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.pointerdown = root.pointermove = root.pointerup = function(conf) {
            if (conf.target.isPointerEmitter) return;
            var isDown = true;
            conf.onPointerDown = function(event) {
                isDown = false;
                self.gesture = "pointerdown";
                conf.listener(event, self);
            };
            conf.onPointerMove = function(event) {
                self.gesture = "pointermove";
                conf.listener(event, self, isDown);
            };
            conf.onPointerUp = function(event) {
                isDown = true;
                self.gesture = "pointerup";
                conf.listener(event, self, true);
            };
            var self = root.pointerSetup(conf);
            Event.add(conf.target, "mousedown", conf.onPointerDown);
            Event.add(conf.target, "mousemove", conf.onPointerMove);
            Event.add(conf.doc, "mouseup", conf.onPointerUp);
            conf.target.isPointerEmitter = true;
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.pointerdown = root.pointerdown;
        Event.Gesture._gestureHandlers.pointermove = root.pointermove;
        Event.Gesture._gestureHandlers.pointerup = root.pointerup;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.shake = function(conf) {
            var self = {
                gesture: "devicemotion",
                acceleration: {},
                accelerationIncludingGravity: {},
                target: conf.target,
                listener: conf.listener,
                remove: function() {
                    window.removeEventListener("devicemotion", onDeviceMotion, false);
                }
            };
            var threshold = 4;
            var timeout = 1e3;
            var timeframe = 200;
            var shakes = 3;
            var lastShake = new Date().getTime();
            var gravity = {
                x: 0,
                y: 0,
                z: 0
            };
            var delta = {
                x: {
                    count: 0,
                    value: 0
                },
                y: {
                    count: 0,
                    value: 0
                },
                z: {
                    count: 0,
                    value: 0
                }
            };
            var onDeviceMotion = function(e) {
                var alpha = .8;
                var o = e.accelerationIncludingGravity;
                gravity.x = alpha * gravity.x + (1 - alpha) * o.x;
                gravity.y = alpha * gravity.y + (1 - alpha) * o.y;
                gravity.z = alpha * gravity.z + (1 - alpha) * o.z;
                self.accelerationIncludingGravity = gravity;
                self.acceleration.x = o.x - gravity.x;
                self.acceleration.y = o.y - gravity.y;
                self.acceleration.z = o.z - gravity.z;
                if (conf.gesture === "devicemotion") {
                    conf.listener(e, self);
                    return;
                }
                var data = "xyz";
                var now = new Date().getTime();
                for (var n = 0, length = data.length; n < length; n++) {
                    var letter = data[n];
                    var ACCELERATION = self.acceleration[letter];
                    var DELTA = delta[letter];
                    var abs = Math.abs(ACCELERATION);
                    if (now - lastShake < timeout) continue;
                    if (abs > threshold) {
                        var idx = now * ACCELERATION / abs;
                        var span = Math.abs(idx + DELTA.value);
                        if (DELTA.value && span < timeframe) {
                            DELTA.value = idx;
                            DELTA.count++;
                            if (DELTA.count === shakes) {
                                conf.listener(e, self);
                                lastShake = now;
                                DELTA.value = 0;
                                DELTA.count = 0;
                            }
                        } else {
                            DELTA.value = idx;
                            DELTA.count = 1;
                        }
                    }
                }
            };
            if (!window.addEventListener) return;
            window.addEventListener("devicemotion", onDeviceMotion, false);
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.shake = root.shake;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        var RAD_DEG = Math.PI / 180;
        root.swipe = function(conf) {
            conf.snap = conf.snap || 90;
            conf.threshold = conf.threshold || 1;
            conf.onPointerDown = function(event) {
                if (root.pointerStart(event, self, conf)) {
                    Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                    Event.add(conf.doc, "mouseup", conf.onPointerUp);
                }
            };
            conf.onPointerMove = function(event) {
                var touches = event.changedTouches || root.getCoords(event);
                var length = touches.length;
                for (var i = 0; i < length; i++) {
                    var touch = touches[i];
                    var sid = touch.identifier || Infinity;
                    var o = conf.tracker[sid];
                    if (!o) continue;
                    o.move.x = touch.pageX;
                    o.move.y = touch.pageY;
                    o.moveTime = new Date().getTime();
                }
            };
            conf.onPointerUp = function(event) {
                if (root.pointerEnd(event, self, conf)) {
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                    var velocity1;
                    var velocity2;
                    var degree1;
                    var degree2;
                    var start = {
                        x: 0,
                        y: 0
                    };
                    var endx = 0;
                    var endy = 0;
                    var length = 0;
                    for (var sid in conf.tracker) {
                        var touch = conf.tracker[sid];
                        var xdist = touch.move.x - touch.start.x;
                        var ydist = touch.move.y - touch.start.y;
                        endx += touch.move.x;
                        endy += touch.move.y;
                        start.x += touch.start.x;
                        start.y += touch.start.y;
                        length++;
                        var distance = Math.sqrt(xdist * xdist + ydist * ydist);
                        var ms = touch.moveTime - touch.startTime;
                        var degree2 = Math.atan2(xdist, ydist) / RAD_DEG + 180;
                        var velocity2 = ms ? distance / ms : 0;
                        if (typeof degree1 === "undefined") {
                            degree1 = degree2;
                            velocity1 = velocity2;
                        } else if (Math.abs(degree2 - degree1) <= 20) {
                            degree1 = (degree1 + degree2) / 2;
                            velocity1 = (velocity1 + velocity2) / 2;
                        } else {
                            return;
                        }
                    }
                    if (velocity1 > conf.threshold) {
                        start.x /= length;
                        start.y /= length;
                        self.start = start;
                        self.x = endx / length;
                        self.y = endy / length;
                        self.angle = -(((degree1 / conf.snap + .5 >> 0) * conf.snap || 360) - 360);
                        self.velocity = velocity1;
                        self.fingers = conf.gestureFingers;
                        self.state = "swipe";
                        conf.listener(event, self);
                    }
                }
            };
            var self = root.pointerSetup(conf);
            Event.add(conf.target, "mousedown", conf.onPointerDown);
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.swipe = root.swipe;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.tap = root.longpress = function(conf) {
            conf.delay = conf.delay || 500;
            conf.timeout = conf.timeout || 250;
            var timestamp, timeout;
            conf.onPointerDown = function(event) {
                if (root.pointerStart(event, self, conf)) {
                    timestamp = new Date().getTime();
                    Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                    Event.add(conf.doc, "mouseup", conf.onPointerUp);
                    if (conf.gesture !== "longpress") return;
                    timeout = setTimeout(function() {
                        if (event.cancelBubble && ++event.bubble > 1) return;
                        var fingers = 0;
                        for (var key in conf.tracker) {
                            if (conf.tracker[key].end === true) return;
                            if (conf.cancel) return;
                            fingers++;
                        }
                        self.state = "start";
                        self.fingers = fingers;
                        conf.listener(event, self);
                    }, conf.delay);
                }
            };
            conf.onPointerMove = function(event) {
                var bbox = conf.bbox;
                var touches = event.changedTouches || root.getCoords(event);
                var length = touches.length;
                for (var i = 0; i < length; i++) {
                    var touch = touches[i];
                    var identifier = touch.identifier || Infinity;
                    var pt = conf.tracker[identifier];
                    if (!pt) continue;
                    if (conf.position === "relative") {
                        var x = (touch.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                        var y = (touch.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
                    } else {
                        var x = touch.pageX - bbox.x1;
                        var y = touch.pageY - bbox.y1;
                    }
                    if (!(x > 0 && x < bbox.width && y > 0 && y < bbox.height && Math.abs(x - pt.start.x) <= 25 && Math.abs(y - pt.start.y) <= 25)) {
                        Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                        conf.cancel = true;
                        return;
                    }
                }
            };
            conf.onPointerUp = function(event) {
                if (root.pointerEnd(event, self, conf)) {
                    clearTimeout(timeout);
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                    if (event.cancelBubble && ++event.bubble > 1) return;
                    if (conf.gesture === "longpress") {
                        if (self.state === "start") {
                            self.state = "end";
                            conf.listener(event, self);
                        }
                        return;
                    }
                    if (conf.cancel) return;
                    if (new Date().getTime() - timestamp > conf.timeout) return;
                    self.state = "tap";
                    self.fingers = conf.gestureFingers;
                    conf.listener(event, self);
                }
            };
            var self = root.pointerSetup(conf);
            Event.add(conf.target, "mousedown", conf.onPointerDown);
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.tap = root.tap;
        Event.Gesture._gestureHandlers.longpress = root.longpress;
        return root;
    }(Event.proxy);
    if (typeof Event === "undefined") var Event = {};
    if (typeof Event.proxy === "undefined") Event.proxy = {};
    Event.proxy = function(root) {
        "use strict";
        root.wheel = function(conf) {
            var interval;
            var timeout = conf.timeout || 150;
            var count = 0;
            var self = {
                gesture: "wheel",
                state: "start",
                wheelDelta: 0,
                target: conf.target,
                listener: conf.listener,
                remove: function() {
                    conf.target[remove](type, onMouseWheel, false);
                }
            };
            var onMouseWheel = function(event) {
                event = event || window.event;
                self.state = count++ ? "change" : "start";
                self.wheelDelta = event.detail ? event.detail * -20 : event.wheelDelta;
                conf.listener(event, self);
                clearTimeout(interval);
                interval = setTimeout(function() {
                    count = 0;
                    self.state = "end";
                    self.wheelDelta = 0;
                    conf.listener(event, self);
                }, timeout);
            };
            var add = document.addEventListener ? "addEventListener" : "attachEvent";
            var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
            var type = Event.supports("mousewheel") ? "mousewheel" : "DOMMouseScroll";
            conf.target[add](type, onMouseWheel, false);
            return self;
        };
        Event.Gesture = Event.Gesture || {};
        Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
        Event.Gesture._gestureHandlers.wheel = root.wheel;
        return root;
    }(Event.proxy);
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
    (function() {
        function easeInQuad(t, b, c, d) {
            return c * (t /= d) * t + b;
        }
        function easeOutQuad(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            return -c / 2 * (--t * (t - 2) - 1) + b;
        }
        function easeInCubic(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        }
        function easeOutCubic(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
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
            if (t < 1) return c / 2 * t * t * t * t + b;
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
            if (t < 1) return c / 2 * t * t * t * t * t + b;
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
            if (t === 0) return b;
            if (t === d) return b + c;
            t /= d / 2;
            if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
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
            if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
        function easeInElastic(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) return b;
            t /= d;
            if (t === 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * 2 * Math.PI / p)) + b;
        }
        function easeOutElastic(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) return b;
            t /= d;
            if (t === 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * 2 * Math.PI / p) + c + b;
        }
        function easeInOutElastic(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) return b;
            t /= d / 2;
            if (t === 2) return b + c;
            if (!p) p = d * .3 * 1.5;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * 2 * Math.PI / p) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * 2 * Math.PI / p) * .5 + c + b;
        }
        function easeInBack(t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        }
        function easeOutBack(t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        }
        function easeInOutBack(t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * (((s *= 1.525) + 1) * t - s) + b;
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
        }
        function easeInBounce(t, b, c, d) {
            return c - easeOutBounce(d - t, 0, c, d) + b;
        }
        function easeOutBounce(t, b, c, d) {
            if ((t /= d) < 1 / 2.75) {
                return c * 7.5625 * t * t + b;
            } else if (t < 2 / 2.75) {
                return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
            } else if (t < 2.5 / 2.75) {
                return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
            }
        }
        function easeInOutBounce(t, b, c, d) {
            if (t < d / 2) return easeInBounce(t * 2, 0, c, d) * .5 + b;
            return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
        fabric.util.ease = {
            easeInQuad: easeInQuad,
            easeOutQuad: easeOutQuad,
            easeInOutQuad: easeInOutQuad,
            easeInCubic: easeInCubic,
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, capitalize = fabric.util.string.capitalize, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, multiplyTransformMatrices = fabric.util.multiplyTransformMatrices;
        fabric.SHARED_ATTRIBUTES = [ "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width" ];
        var attributesMap = {
            "fill-opacity": "fillOpacity",
            "fill-rule": "fillRule",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-style": "fontStyle",
            "font-weight": "fontWeight",
            cx: "left",
            x: "left",
            r: "radius",
            "stroke-dasharray": "strokeDashArray",
            "stroke-linecap": "strokeLineCap",
            "stroke-linejoin": "strokeLineJoin",
            "stroke-miterlimit": "strokeMiterLimit",
            "stroke-opacity": "strokeOpacity",
            "stroke-width": "strokeWidth",
            "text-decoration": "textDecoration",
            cy: "top",
            y: "top",
            transform: "transformMatrix"
        };
        var colorAttributes = {
            stroke: "strokeOpacity",
            fill: "fillOpacity"
        };
        function normalizeAttr(attr) {
            if (attr in attributesMap) {
                return attributesMap[attr];
            }
            return attr;
        }
        function normalizeValue(attr, value, parentAttributes) {
            var isArray;
            if ((attr === "fill" || attr === "stroke") && value === "none") {
                value = "";
            } else if (attr === "fillRule") {
                value = value === "evenodd" ? "destination-over" : value;
            } else if (attr === "strokeDashArray") {
                value = value.replace(/,/g, " ").split(/\s+/);
            } else if (attr === "transformMatrix") {
                if (parentAttributes && parentAttributes.transformMatrix) {
                    value = multiplyTransformMatrices(parentAttributes.transformMatrix, fabric.parseTransformAttribute(value));
                } else {
                    value = fabric.parseTransformAttribute(value);
                }
            }
            isArray = Object.prototype.toString.call(value) === "[object Array]";
            var parsed = isArray ? value.map(parseFloat) : parseFloat(value);
            return !isArray && isNaN(parsed) ? value : parsed;
        }
        function _setStrokeFillOpacity(attributes) {
            for (var attr in colorAttributes) {
                if (!attributes[attr] || typeof attributes[colorAttributes[attr]] === "undefined") continue;
                if (attributes[attr].indexOf("url(") === 0) continue;
                var color = new fabric.Color(attributes[attr]);
                attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2)).toRgba();
                delete attributes[colorAttributes[attr]];
            }
            return attributes;
        }
        function parseAttributes(element, attributes) {
            if (!element) {
                return;
            }
            var value, parentAttributes = {};
            if (element.parentNode && /^g$/i.test(element.parentNode.nodeName)) {
                parentAttributes = fabric.parseAttributes(element.parentNode, attributes);
            }
            var ownAttributes = attributes.reduce(function(memo, attr) {
                value = element.getAttribute(attr);
                if (value) {
                    attr = normalizeAttr(attr);
                    value = normalizeValue(attr, value, parentAttributes);
                    memo[attr] = value;
                }
                return memo;
            }, {});
            ownAttributes = extend(ownAttributes, extend(getGlobalStylesForElement(element), fabric.parseStyleAttribute(element)));
            return _setStrokeFillOpacity(extend(parentAttributes, ownAttributes));
        }
        fabric.parseTransformAttribute = function() {
            function rotateMatrix(matrix, args) {
                var angle = args[0];
                matrix[0] = Math.cos(angle);
                matrix[1] = Math.sin(angle);
                matrix[2] = -Math.sin(angle);
                matrix[3] = Math.cos(angle);
            }
            function scaleMatrix(matrix, args) {
                var multiplierX = args[0], multiplierY = args.length === 2 ? args[1] : args[0];
                matrix[0] = multiplierX;
                matrix[3] = multiplierY;
            }
            function skewXMatrix(matrix, args) {
                matrix[2] = args[0];
            }
            function skewYMatrix(matrix, args) {
                matrix[1] = args[0];
            }
            function translateMatrix(matrix, args) {
                matrix[4] = args[0];
                if (args.length === 2) {
                    matrix[5] = args[1];
                }
            }
            var iMatrix = [ 1, 0, 0, 1, 0, 0 ], number = "(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)", comma_wsp = "(?:\\s+,?\\s*|,\\s*)", skewX = "(?:(skewX)\\s*\\(\\s*(" + number + ")\\s*\\))", skewY = "(?:(skewY)\\s*\\(\\s*(" + number + ")\\s*\\))", rotate = "(?:(rotate)\\s*\\(\\s*(" + number + ")(?:" + comma_wsp + "(" + number + ")" + comma_wsp + "(" + number + "))?\\s*\\))", scale = "(?:(scale)\\s*\\(\\s*(" + number + ")(?:" + comma_wsp + "(" + number + "))?\\s*\\))", translate = "(?:(translate)\\s*\\(\\s*(" + number + ")(?:" + comma_wsp + "(" + number + "))?\\s*\\))", matrix = "(?:(matrix)\\s*\\(\\s*" + "(" + number + ")" + comma_wsp + "(" + number + ")" + comma_wsp + "(" + number + ")" + comma_wsp + "(" + number + ")" + comma_wsp + "(" + number + ")" + comma_wsp + "(" + number + ")" + "\\s*\\))", transform = "(?:" + matrix + "|" + translate + "|" + scale + "|" + rotate + "|" + skewX + "|" + skewY + ")", transforms = "(?:" + transform + "(?:" + comma_wsp + transform + ")*" + ")", transform_list = "^\\s*(?:" + transforms + "?)\\s*$", reTransformList = new RegExp(transform_list), reTransform = new RegExp(transform, "g");
            return function(attributeValue) {
                var matrix = iMatrix.concat();
                var matrices = [];
                if (!attributeValue || attributeValue && !reTransformList.test(attributeValue)) {
                    return matrix;
                }
                attributeValue.replace(reTransform, function(match) {
                    var m = new RegExp(transform).exec(match).filter(function(match) {
                        return match !== "" && match != null;
                    }), operation = m[1], args = m.slice(2).map(parseFloat);
                    switch (operation) {
                      case "translate":
                        translateMatrix(matrix, args);
                        break;

                      case "rotate":
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
        function parsePointsAttribute(points) {
            if (!points) return null;
            points = points.trim();
            var asPairs = points.indexOf(",") > -1;
            points = points.split(/\s+/);
            var parsedPoints = [], i, len;
            if (asPairs) {
                i = 0;
                len = points.length;
                for (;i < len; i++) {
                    var pair = points[i].split(",");
                    parsedPoints.push({
                        x: parseFloat(pair[0]),
                        y: parseFloat(pair[1])
                    });
                }
            } else {
                i = 0;
                len = points.length;
                for (;i < len; i += 2) {
                    parsedPoints.push({
                        x: parseFloat(points[i]),
                        y: parseFloat(points[i + 1])
                    });
                }
            }
            if (parsedPoints.length % 2 !== 0) {}
            return parsedPoints;
        }
        function parseFontDeclaration(value, oStyle) {
            var match = value.match(/(normal|italic)?\s*(normal|small-caps)?\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\s*(\d+)px(?:\/(normal|[\d\.]+))?\s+(.*)/);
            if (!match) return;
            var fontStyle = match[1];
            var fontWeight = match[3];
            var fontSize = match[4];
            var lineHeight = match[5];
            var fontFamily = match[6];
            if (fontStyle) {
                oStyle.fontStyle = fontStyle;
            }
            if (fontWeight) {
                oStyle.fontSize = isNaN(parseFloat(fontWeight)) ? fontWeight : parseFloat(fontWeight);
            }
            if (fontSize) {
                oStyle.fontSize = parseFloat(fontSize);
            }
            if (fontFamily) {
                oStyle.fontFamily = fontFamily;
            }
            if (lineHeight) {
                oStyle.lineHeight = lineHeight === "normal" ? 1 : lineHeight;
            }
        }
        function parseStyleAttribute(element) {
            var oStyle = {}, style = element.getAttribute("style"), attr, value;
            if (!style) return oStyle;
            if (typeof style === "string") {
                style.replace(/;$/, "").split(";").forEach(function(chunk) {
                    var pair = chunk.split(":");
                    attr = normalizeAttr(pair[0].trim().toLowerCase());
                    value = normalizeValue(attr, pair[1].trim());
                    if (attr === "font") {
                        parseFontDeclaration(value, oStyle);
                    } else {
                        oStyle[attr] = value;
                    }
                });
            } else {
                for (var prop in style) {
                    if (typeof style[prop] === "undefined") continue;
                    attr = normalizeAttr(prop.toLowerCase());
                    value = normalizeValue(attr, style[prop]);
                    if (attr === "font") {
                        parseFontDeclaration(value, oStyle);
                    } else {
                        oStyle[attr] = value;
                    }
                }
            }
            return oStyle;
        }
        function resolveGradients(instances) {
            for (var i = instances.length; i--; ) {
                var instanceFillValue = instances[i].get("fill");
                if (/^url\(/.test(instanceFillValue)) {
                    var gradientId = instanceFillValue.slice(5, instanceFillValue.length - 1);
                    if (fabric.gradientDefs[gradientId]) {
                        instances[i].set("fill", fabric.Gradient.fromElement(fabric.gradientDefs[gradientId], instances[i]));
                    }
                }
            }
        }
        function parseElements(elements, callback, options, reviver) {
            var instances = new Array(elements.length), i = elements.length;
            function checkIfDone() {
                if (--i === 0) {
                    instances = instances.filter(function(el) {
                        return el != null;
                    });
                    resolveGradients(instances);
                    callback(instances);
                }
            }
            for (var index = 0, el, len = elements.length; index < len; index++) {
                el = elements[index];
                var klass = fabric[capitalize(el.tagName)];
                if (klass && klass.fromElement) {
                    try {
                        if (klass.async) {
                            klass.fromElement(el, function(index, el) {
                                return function(obj) {
                                    reviver && reviver(el, obj);
                                    instances.splice(index, 0, obj);
                                    checkIfDone();
                                };
                            }(index, el), options);
                        } else {
                            var obj = klass.fromElement(el, options);
                            reviver && reviver(el, obj);
                            instances.splice(index, 0, obj);
                            checkIfDone();
                        }
                    } catch (err) {
                        fabric.log(err);
                    }
                } else {
                    checkIfDone();
                }
            }
        }
        function getCSSRules(doc) {
            var styles = doc.getElementsByTagName("style"), allRules = {}, rules;
            for (var i = 0, len = styles.length; i < len; i++) {
                var styleContents = styles[0].textContent;
                styleContents = styleContents.replace(/\/\*[\s\S]*?\*\//g, "");
                rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
                rules = rules.map(function(rule) {
                    return rule.trim();
                });
                rules.forEach(function(rule) {
                    var match = rule.match(/([\s\S]*?)\s*\{([^}]*)\}/);
                    rule = match[1];
                    var declaration = match[2].trim(), propertyValuePairs = declaration.replace(/;$/, "").split(/\s*;\s*/);
                    if (!allRules[rule]) {
                        allRules[rule] = {};
                    }
                    for (var i = 0, len = propertyValuePairs.length; i < len; i++) {
                        var pair = propertyValuePairs[i].split(/\s*:\s*/), property = pair[0], value = pair[1];
                        allRules[rule][property] = value;
                    }
                });
            }
            return allRules;
        }
        function getGlobalStylesForElement(element) {
            var nodeName = element.nodeName, className = element.getAttribute("class"), id = element.getAttribute("id"), styles = {};
            for (var rule in fabric.cssRules) {
                var ruleMatchesElement = className && new RegExp("^\\." + className).test(rule) || id && new RegExp("^#" + id).test(rule) || new RegExp("^" + nodeName).test(rule);
                if (ruleMatchesElement) {
                    for (var property in fabric.cssRules[rule]) {
                        styles[property] = fabric.cssRules[rule][property];
                    }
                }
            }
            return styles;
        }
        fabric.parseSVGDocument = function() {
            var reAllowedSVGTagNames = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/;
            var reNum = "(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)";
            var reViewBoxAttrValue = new RegExp("^" + "\\s*(" + reNum + "+)\\s*,?" + "\\s*(" + reNum + "+)\\s*,?" + "\\s*(" + reNum + "+)\\s*,?" + "\\s*(" + reNum + "+)\\s*" + "$");
            function hasAncestorWithNodeName(element, nodeName) {
                while (element && (element = element.parentNode)) {
                    if (nodeName.test(element.nodeName)) {
                        return true;
                    }
                }
                return false;
            }
            return function(doc, callback, reviver) {
                if (!doc) return;
                var startTime = new Date(), descendants = fabric.util.toArray(doc.getElementsByTagName("*"));
                if (descendants.length === 0) {
                    descendants = doc.selectNodes("//*[name(.)!='svg']");
                    var arr = [];
                    for (var i = 0, len = descendants.length; i < len; i++) {
                        arr[i] = descendants[i];
                    }
                    descendants = arr;
                }
                var elements = descendants.filter(function(el) {
                    return reAllowedSVGTagNames.test(el.tagName) && !hasAncestorWithNodeName(el, /^(?:pattern|defs)$/);
                });
                if (!elements || elements && !elements.length) return;
                var viewBoxAttr = doc.getAttribute("viewBox"), widthAttr = doc.getAttribute("width"), heightAttr = doc.getAttribute("height"), width = null, height = null, minX, minY;
                if (viewBoxAttr && (viewBoxAttr = viewBoxAttr.match(reViewBoxAttrValue))) {
                    minX = parseInt(viewBoxAttr[1], 10);
                    minY = parseInt(viewBoxAttr[2], 10);
                    width = parseInt(viewBoxAttr[3], 10);
                    height = parseInt(viewBoxAttr[4], 10);
                }
                width = widthAttr ? parseFloat(widthAttr) : width;
                height = heightAttr ? parseFloat(heightAttr) : height;
                var options = {
                    width: width,
                    height: height
                };
                fabric.gradientDefs = fabric.getGradientDefs(doc);
                fabric.cssRules = getCSSRules(doc);
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
        function loadSVGFromURL(url, callback, reviver) {
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
                if (!xml.documentElement && fabric.window.ActiveXObject && r.responseText) {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(r.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""));
                }
                if (!xml.documentElement) return;
                fabric.parseSVGDocument(xml.documentElement, function(results, options) {
                    svgCache.set(url, {
                        objects: fabric.util.array.invoke(results, "toObject"),
                        options: options
                    });
                    callback(results, options);
                }, reviver);
            }
        }
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
        function loadSVGFromString(string, callback, reviver) {
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
        }
        function createSVGFontFacesMarkup(objects) {
            var markup = "";
            for (var i = 0, len = objects.length; i < len; i++) {
                if (objects[i].type !== "text" || !objects[i].path) continue;
                markup += [ "@font-face {", "font-family: ", objects[i].fontFamily, "; ", "src: url('", objects[i].path, "')", "}" ].join("");
            }
            if (markup) {
                markup = [ '<style type="text/css">', "<![CDATA[", markup, "]]>", "</style>" ].join("");
            }
            return markup;
        }
        function createSVGRefElementsMarkup(canvas) {
            var markup = "";
            if (canvas.backgroundColor && canvas.backgroundColor.source) {
                markup = [ '<pattern x="0" y="0" id="backgroundColorPattern" ', 'width="', canvas.backgroundColor.source.width, '" height="', canvas.backgroundColor.source.height, '" patternUnits="userSpaceOnUse">', '<image x="0" y="0" ', 'width="', canvas.backgroundColor.source.width, '" height="', canvas.backgroundColor.source.height, '" xlink:href="', canvas.backgroundColor.source.src, '"></image></pattern>' ].join("");
            }
            return markup;
        }
        function getGradientDefs(doc) {
            var linearGradientEls = doc.getElementsByTagName("linearGradient"), radialGradientEls = doc.getElementsByTagName("radialGradient"), el, i, gradientDefs = {};
            i = linearGradientEls.length;
            for (;i--; ) {
                el = linearGradientEls[i];
                gradientDefs[el.getAttribute("id")] = el;
            }
            i = radialGradientEls.length;
            for (;i--; ) {
                el = radialGradientEls[i];
                gradientDefs[el.getAttribute("id")] = el;
            }
            return gradientDefs;
        }
        extend(fabric, {
            parseAttributes: parseAttributes,
            parseElements: parseElements,
            parseStyleAttribute: parseStyleAttribute,
            parsePointsAttribute: parsePointsAttribute,
            getCSSRules: getCSSRules,
            loadSVGFromURL: loadSVGFromURL,
            loadSVGFromString: loadSVGFromString,
            createSVGFontFacesMarkup: createSVGFontFacesMarkup,
            createSVGRefElementsMarkup: createSVGRefElementsMarkup,
            getGradientDefs: getGradientDefs
        });
    })(typeof exports !== "undefined" ? exports : this);
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
        function getColorStop(el) {
            var style = el.getAttribute("style"), offset = el.getAttribute("offset"), color, opacity;
            offset = parseFloat(offset) / (/%$/.test(offset) ? 100 : 1);
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
            color = new fabric.Color(color).toRgb();
            return {
                offset: offset,
                color: color,
                opacity: isNaN(parseFloat(opacity)) ? 1 : parseFloat(opacity)
            };
        }
        fabric.Gradient = fabric.util.createClass({
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
                this.gradientUnits = options.gradientUnits || "objectBoundingBox";
                this.colorStops = options.colorStops.slice();
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
                    gradientUnits: this.gradientUnits,
                    colorStops: this.colorStops
                };
            },
            toSVG: function(object, normalize) {
                var coords = fabric.util.object.clone(this.coords), markup;
                this.colorStops.sort(function(a, b) {
                    return a.offset - b.offset;
                });
                if (normalize && this.gradientUnits === "userSpaceOnUse") {
                    coords.x1 += object.width / 2;
                    coords.y1 += object.height / 2;
                    coords.x2 += object.width / 2;
                    coords.y2 += object.height / 2;
                } else if (this.gradientUnits === "objectBoundingBox") {
                    _convertValuesToPercentUnits(object, coords);
                }
                if (this.type === "linear") {
                    markup = [ "<linearGradient ", 'id="SVGID_', this.id, '" gradientUnits="', this.gradientUnits, '" x1="', coords.x1, '" y1="', coords.y1, '" x2="', coords.x2, '" y2="', coords.y2, '">' ];
                } else if (this.type === "radial") {
                    markup = [ "<radialGradient ", 'id="SVGID_', this.id, '" gradientUnits="', this.gradientUnits, '" cx="', coords.x2, '" cy="', coords.y2, '" r="', coords.r2, '" fx="', coords.x1, '" fy="', coords.y1, '">' ];
                }
                for (var i = 0; i < this.colorStops.length; i++) {
                    markup.push("<stop ", 'offset="', this.colorStops[i].offset * 100 + "%", '" style="stop-color:', this.colorStops[i].color, this.colorStops[i].opacity ? ";stop-opacity: " + this.colorStops[i].opacity : ";", '"/>');
                }
                markup.push(this.type === "linear" ? "</linearGradient>" : "</radialGradient>");
                return markup.join("");
            },
            toLive: function(ctx) {
                var gradient;
                if (!this.type) return;
                if (this.type === "linear") {
                    gradient = ctx.createLinearGradient(this.coords.x1, this.coords.y1, this.coords.x2, this.coords.y2);
                } else if (this.type === "radial") {
                    gradient = ctx.createRadialGradient(this.coords.x1, this.coords.y1, this.coords.r1, this.coords.x2, this.coords.y2, this.coords.r2);
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
                var colorStopEls = el.getElementsByTagName("stop"), type = el.nodeName === "linearGradient" ? "linear" : "radial", gradientUnits = el.getAttribute("gradientUnits") || "objectBoundingBox", colorStops = [], coords = {};
                if (type === "linear") {
                    coords = {
                        x1: el.getAttribute("x1") || 0,
                        y1: el.getAttribute("y1") || 0,
                        x2: el.getAttribute("x2") || "100%",
                        y2: el.getAttribute("y2") || 0
                    };
                } else if (type === "radial") {
                    coords = {
                        x1: el.getAttribute("fx") || el.getAttribute("cx") || "50%",
                        y1: el.getAttribute("fy") || el.getAttribute("cy") || "50%",
                        r1: 0,
                        x2: el.getAttribute("cx") || "50%",
                        y2: el.getAttribute("cy") || "50%",
                        r2: el.getAttribute("r") || "50%"
                    };
                }
                for (var i = colorStopEls.length; i--; ) {
                    colorStops.push(getColorStop(colorStopEls[i]));
                }
                _convertPercentUnitsToValues(instance, coords);
                return new fabric.Gradient({
                    type: type,
                    coords: coords,
                    gradientUnits: gradientUnits,
                    colorStops: colorStops
                });
            },
            forObject: function(obj, options) {
                options || (options = {});
                _convertPercentUnitsToValues(obj, options);
                return new fabric.Gradient(options);
            }
        });
        function _convertPercentUnitsToValues(object, options) {
            for (var prop in options) {
                if (typeof options[prop] === "string" && /^\d+%$/.test(options[prop])) {
                    var percents = parseFloat(options[prop], 10);
                    if (prop === "x1" || prop === "x2" || prop === "r2") {
                        options[prop] = fabric.util.toFixed(object.width * percents / 100, 2);
                    } else if (prop === "y1" || prop === "y2") {
                        options[prop] = fabric.util.toFixed(object.height * percents / 100, 2);
                    }
                }
                if (prop === "x1" || prop === "x2") {
                    options[prop] -= fabric.util.toFixed(object.width / 2, 2);
                } else if (prop === "y1" || prop === "y2") {
                    options[prop] -= fabric.util.toFixed(object.height / 2, 2);
                }
            }
        }
        function _convertValuesToPercentUnits(object, options) {
            for (var prop in options) {
                if (prop === "x1" || prop === "x2") {
                    options[prop] += fabric.util.toFixed(object.width / 2, 2);
                } else if (prop === "y1" || prop === "y2") {
                    options[prop] += fabric.util.toFixed(object.height / 2, 2);
                }
                if (prop === "x1" || prop === "x2" || prop === "r2") {
                    options[prop] = fabric.util.toFixed(options[prop] / object.width * 100, 2) + "%";
                } else if (prop === "y1" || prop === "y2") {
                    options[prop] = fabric.util.toFixed(options[prop] / object.height * 100, 2) + "%";
                }
            }
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
            }
            return {
                source: source,
                repeat: this.repeat,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            };
        },
        toSVG: function(object) {
            var patternSource = typeof this.source === "function" ? this.source() : this.source;
            var patternWidth = patternSource.width / object.getWidth();
            var patternHeight = patternSource.height / object.getHeight();
            var patternImgSrc = "";
            if (patternSource.src) {
                patternImgSrc = patternSource.src;
            } else if (patternSource.toDataURL) {
                patternImgSrc = patternSource.toDataURL();
            }
            return '<pattern id="SVGID_' + this.id + '" x="' + this.offsetX + '" y="' + this.offsetY + '" width="' + patternWidth + '" height="' + patternHeight + '">' + '<image x="0" y="0"' + ' width="' + patternSource.width + '" height="' + patternSource.height + '" xlink:href="' + patternImgSrc + '"></image>' + "</pattern>";
        },
        toLive: function(ctx) {
            var source = typeof this.source === "function" ? this.source() : this.source;
            return ctx.createPattern(source, this.repeat);
        }
    });
    fabric.Shadow = fabric.util.createClass({
        color: "rgb(0,0,0)",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: false,
        initialize: function(options) {
            for (var prop in options) {
                this[prop] = options[prop];
            }
            this.id = fabric.Object.__uid++;
        },
        toSVG: function(object) {
            var mode = "SourceAlpha";
            if (object.fill === this.color || object.stroke === this.color) {
                mode = "SourceGraphic";
            }
            return '<filter id="SVGID_' + this.id + '" y="-40%" height="180%">' + '<feGaussianBlur in="' + mode + '" stdDeviation="' + (this.blur ? this.blur / 3 : 0) + '"></feGaussianBlur>' + '<feOffset dx="' + this.offsetX + '" dy="' + this.offsetY + '"></feOffset>' + "<feMerge>" + "<feMergeNode></feMergeNode>" + '<feMergeNode in="SourceGraphic"></feMergeNode>' + "</feMerge>" + "</filter>";
        },
        toObject: function() {
            return {
                color: this.color,
                blur: this.blur,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            };
        }
    });
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
    fabric.BaseBrush = fabric.util.createClass({
        color: "rgb(0, 0, 0)",
        width: 1,
        shadowBlur: 0,
        shadowColor: "",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        setBrushStyles: function() {
            var ctx = this.canvas.contextTop;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.lineCap = this.strokeLineCap;
            ctx.lineJoin = this.strokeLineJoin;
        },
        setShadowStyles: function() {
            if (!this.shadowColor) return;
            var ctx = this.canvas.contextTop;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowColor = this.shadowColor;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        },
        removeShadowStyles: function() {
            var ctx = this.canvas.contextTop;
            ctx.shadowColor = "";
            ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
        }
    });
    (function() {
        var utilMin = fabric.util.array.min, utilMax = fabric.util.array.max;
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
                this.setBrushStyles();
                this.setShadowStyles();
            },
            _captureDrawingPath: function(pointer) {
                var pointerPoint = new fabric.Point(pointer.x, pointer.y);
                this._addPoint(pointerPoint);
            },
            _render: function() {
                var ctx = this.canvas.contextTop;
                ctx.beginPath();
                var p1 = this._points[0];
                var p2 = this._points[1];
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
            },
            _getSVGPathData: function() {
                this.box = this.getPathBoundingBox(this._points);
                return this.convertPointsToSVGPath(this._points, this.box.minx, this.box.maxx, this.box.miny, this.box.maxy);
            },
            getPathBoundingBox: function(points) {
                var xBounds = [], yBounds = [], p1 = points[0], p2 = points[1], startPoint = p1;
                for (var i = 1, len = points.length; i < len; i++) {
                    var midPoint = p1.midPointFrom(p2);
                    xBounds.push(startPoint.x);
                    xBounds.push(midPoint.x);
                    yBounds.push(startPoint.y);
                    yBounds.push(midPoint.y);
                    p1 = points[i];
                    p2 = points[i + 1];
                    startPoint = midPoint;
                }
                xBounds.push(p1.x);
                yBounds.push(p1.y);
                return {
                    minx: utilMin(xBounds),
                    miny: utilMin(yBounds),
                    maxx: utilMax(xBounds),
                    maxy: utilMax(yBounds)
                };
            },
            convertPointsToSVGPath: function(points, minX, maxX, minY) {
                var path = [];
                var p1 = new fabric.Point(points[0].x - minX, points[0].y - minY);
                var p2 = new fabric.Point(points[1].x - minX, points[1].y - minY);
                path.push("M ", points[0].x - minX, " ", points[0].y - minY, " ");
                for (var i = 1, len = points.length; i < len; i++) {
                    var midPoint = p1.midPointFrom(p2);
                    path.push("Q ", p1.x, " ", p1.y, " ", midPoint.x, " ", midPoint.y, " ");
                    p1 = new fabric.Point(points[i].x - minX, points[i].y - minY);
                    if (i + 1 < points.length) {
                        p2 = new fabric.Point(points[i + 1].x - minX, points[i + 1].y - minY);
                    }
                }
                path.push("L ", p1.x, " ", p1.y, " ");
                return path;
            },
            createPath: function(pathData) {
                var path = new fabric.Path(pathData);
                path.fill = null;
                path.stroke = this.color;
                path.strokeWidth = this.width;
                path.strokeLineCap = this.strokeLineCap;
                path.strokeLineJoin = this.strokeLineJoin;
                if (this.shadowColor) {
                    path.setShadow({
                        color: this.shadowColor,
                        blur: this.shadowBlur,
                        offsetX: this.shadowOffsetX,
                        offsetY: this.shadowOffsetY,
                        affectStroke: true
                    });
                }
                return path;
            },
            _finalizeAndAddPath: function() {
                var ctx = this.canvas.contextTop;
                ctx.closePath();
                var pathData = this._getSVGPathData().join("");
                if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
                    this.canvas.renderAll();
                    return;
                }
                var originLeft = this.box.minx + (this.box.maxx - this.box.minx) / 2;
                var originTop = this.box.miny + (this.box.maxy - this.box.miny) / 2;
                this.canvas.contextTop.arc(originLeft, originTop, 3, 0, Math.PI * 2, false);
                var path = this.createPath(pathData);
                path.set({
                    left: originLeft,
                    top: originTop
                });
                this.canvas.add(path);
                path.setCoords();
                this.canvas.clearContext(this.canvas.contextTop);
                this.removeShadowStyles();
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
            var point = this.addPoint(pointer);
            var ctx = this.canvas.contextTop;
            ctx.fillStyle = point.fill;
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        },
        onMouseDown: function(pointer) {
            this.points.length = 0;
            this.canvas.clearContext(this.canvas.contextTop);
            this.setShadowStyles();
            this.drawDot(pointer);
        },
        onMouseMove: function(pointer) {
            this.drawDot(pointer);
        },
        onMouseUp: function() {
            var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = false;
            for (var i = 0, len = this.points.length; i < len; i++) {
                var point = this.points[i];
                var circle = new fabric.Circle({
                    radius: point.radius,
                    left: point.x,
                    top: point.y,
                    fill: point.fill
                });
                if (this.shadowColor) {
                    circle.setShadow({
                        color: this.shadowColor,
                        blur: this.shadowBlur,
                        offsetX: this.shadowOffsetX,
                        offsetY: this.shadowOffsetY
                    });
                }
                this.canvas.add(circle);
                this.canvas.fire("path:created", {
                    path: circle
                });
            }
            this.canvas.clearContext(this.canvas.contextTop);
            this.removeShadowStyles();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
            this.canvas.renderAll();
        },
        addPoint: function(pointer) {
            var pointerPoint = new fabric.Point(pointer.x, pointer.y);
            var circleRadius = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2;
            var circleColor = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
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
        initialize: function(canvas) {
            this.canvas = canvas;
            this.sprayChunks = [];
        },
        onMouseDown: function(pointer) {
            this.sprayChunks.length = 0;
            this.canvas.clearContext(this.canvas.contextTop);
            this.setShadowStyles();
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
            for (var i = 0, ilen = this.sprayChunks.length; i < ilen; i++) {
                var sprayChunk = this.sprayChunks[i];
                for (var j = 0, jlen = sprayChunk.length; j < jlen; j++) {
                    var rect = new fabric.Rect({
                        width: sprayChunk[j].width,
                        height: sprayChunk[j].width,
                        left: sprayChunk[j].x + 1,
                        top: sprayChunk[j].y + 1,
                        fill: this.color
                    });
                    if (this.shadowColor) {
                        rect.setShadow({
                            color: this.shadowColor,
                            blur: this.shadowBlur,
                            offsetX: this.shadowOffsetX,
                            offsetY: this.shadowOffsetY
                        });
                    }
                    this.canvas.add(rect);
                    this.canvas.fire("path:created", {
                        path: rect
                    });
                }
            }
            this.canvas.clearContext(this.canvas.contextTop);
            this.removeShadowStyles();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
            this.canvas.renderAll();
        },
        render: function() {
            var ctx = this.canvas.contextTop;
            ctx.fillStyle = this.color;
            ctx.save();
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
                var point = {
                    x: x,
                    y: y,
                    width: width
                };
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
        setBrushStyles: function() {
            this.callSuper("setBrushStyles");
            this.canvas.contextTop.strokeStyle = this.getPattern();
        },
        createPath: function(pathData) {
            var path = this.callSuper("createPath", pathData);
            path.stroke = new fabric.Pattern({
                source: this.source || this.getPatternSrcFunction()
            });
            return path;
        }
    });
    (function() {
        var extend = fabric.util.object.extend, getPointer = fabric.util.getPointer, degreesToRadians = fabric.util.degreesToRadians, radiansToDegrees = fabric.util.radiansToDegrees, atan2 = Math.atan2, abs = Math.abs, min = Math.min, max = Math.max, STROKE_OFFSET = .5;
        fabric.Canvas = function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
            this._initInteractive();
            this._createCacheCanvas();
            fabric.Canvas.activeInstance = this;
        };
        function ProtoProxy() {}
        ProtoProxy.prototype = fabric.StaticCanvas.prototype;
        fabric.Canvas.prototype = new ProtoProxy();
        var InteractiveMethods = {
            uniScaleTransform: false,
            centerTransform: false,
            interactive: true,
            selection: true,
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
            _initInteractive: function() {
                this._currentTransform = null;
                this._groupSelector = null;
                this._initWrapperElement();
                this._createUpperCanvas();
                this._initEvents();
                this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this);
                this.calcOffset();
            },
            _resetCurrentTransform: function(e) {
                var t = this._currentTransform;
                t.target.set("scaleX", t.original.scaleX);
                t.target.set("scaleY", t.original.scaleY);
                t.target.set("left", t.original.left);
                t.target.set("top", t.original.top);
                if (e.altKey || this.centerTransform || t.target.centerTransform) {
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
                } else {
                    t.originX = t.original.originX;
                    t.originY = t.original.originY;
                }
            },
            containsPoint: function(e, target) {
                var pointer = this.getPointer(e), xy = this._normalizePointer(target, pointer);
                return target.containsPoint(xy) || target._findTargetCorner(e, this._offset);
            },
            _normalizePointer: function(object, pointer) {
                var activeGroup = this.getActiveGroup(), x = pointer.x, y = pointer.y;
                var isObjectInGroup = activeGroup && object.type !== "group" && activeGroup.contains(object);
                if (isObjectInGroup) {
                    x -= activeGroup.left;
                    y -= activeGroup.top;
                }
                return {
                    x: x,
                    y: y
                };
            },
            isTargetTransparent: function(target, x, y) {
                var cacheContext = this.contextCache;
                var hasBorders = target.hasBorders, transparentCorners = target.transparentCorners;
                target.hasBorders = target.transparentCorners = false;
                this._draw(cacheContext, target);
                target.hasBorders = hasBorders;
                target.transparentCorners = transparentCorners;
                if (this.targetFindTolerance > 0) {
                    if (x > this.targetFindTolerance) {
                        x -= this.targetFindTolerance;
                    } else {
                        x = 0;
                    }
                    if (y > this.targetFindTolerance) {
                        y -= this.targetFindTolerance;
                    } else {
                        y = 0;
                    }
                }
                var isTransparent = true;
                var imageData = cacheContext.getImageData(x, y, this.targetFindTolerance * 2 || 1, this.targetFindTolerance * 2 || 1);
                for (var i = 3, l = imageData.data.length; i < l; i += 4) {
                    var temp = imageData.data[i];
                    isTransparent = temp <= 0;
                    if (isTransparent === false) break;
                }
                imageData = null;
                this.clearContext(cacheContext);
                return isTransparent;
            },
            _shouldClearSelection: function(e, target) {
                var activeGroup = this.getActiveGroup();
                return !target || target && activeGroup && !activeGroup.contains(target) && activeGroup !== target && !e.shiftKey || target && !target.selectable;
            },
            _setupCurrentTransform: function(e, target) {
                if (!target) return;
                var action = "drag", corner, pointer = getPointer(e, target.canvas.upperCanvasEl);
                corner = target._findTargetCorner(e, this._offset);
                if (corner) {
                    action = corner === "ml" || corner === "mr" ? "scaleX" : corner === "mt" || corner === "mb" ? "scaleY" : corner === "mtr" ? "rotate" : "scale";
                }
                var originX = "center", originY = "center";
                if (corner === "ml" || corner === "tl" || corner === "bl") {
                    originX = "right";
                } else if (corner === "mr" || corner === "tr" || corner === "br") {
                    originX = "left";
                }
                if (corner === "tl" || corner === "mt" || corner === "tr") {
                    originY = "bottom";
                } else if (corner === "bl" || corner === "mb" || corner === "br") {
                    originY = "top";
                }
                if (corner === "mtr") {
                    originX = "center";
                    originY = "center";
                }
                this._currentTransform = {
                    target: target,
                    action: action,
                    scaleX: target.scaleX,
                    scaleY: target.scaleY,
                    offsetX: pointer.x - target.left,
                    offsetY: pointer.y - target.top,
                    originX: originX,
                    originY: originY,
                    ex: pointer.x,
                    ey: pointer.y,
                    left: target.left,
                    top: target.top,
                    theta: degreesToRadians(target.angle),
                    width: target.width * target.scaleX,
                    mouseXSign: 1,
                    mouseYSign: 1
                };
                this._currentTransform.original = {
                    left: target.left,
                    top: target.top,
                    scaleX: target.scaleX,
                    scaleY: target.scaleY,
                    originX: originX,
                    originY: originY
                };
                this._resetCurrentTransform(e);
            },
            _shouldHandleGroupLogic: function(e, target) {
                var activeObject = this.getActiveObject();
                return e.shiftKey && (this.getActiveGroup() || activeObject && activeObject !== target) && this.selection;
            },
            _handleGroupLogic: function(e, target) {
                if (target === this.getActiveGroup()) {
                    target = this.findTarget(e, true);
                    if (!target || target.isType("group")) {
                        return;
                    }
                }
                var activeGroup = this.getActiveGroup();
                if (activeGroup) {
                    if (activeGroup.contains(target)) {
                        activeGroup.removeWithUpdate(target);
                        this._resetObjectTransform(activeGroup);
                        target.set("active", false);
                        if (activeGroup.size() === 1) {
                            this.discardActiveGroup();
                        }
                    } else {
                        activeGroup.addWithUpdate(target);
                        this._resetObjectTransform(activeGroup);
                    }
                    this.fire("selection:created", {
                        target: activeGroup,
                        e: e
                    });
                    activeGroup.set("active", true);
                } else {
                    if (this._activeObject) {
                        if (target !== this._activeObject) {
                            var objects = this.getObjects();
                            var isActiveLower = objects.indexOf(this._activeObject) < objects.indexOf(target);
                            var group = new fabric.Group(isActiveLower ? [ target, this._activeObject ] : [ this._activeObject, target ]);
                            this.setActiveGroup(group);
                            this._activeObject = null;
                            activeGroup = this.getActiveGroup();
                            this.fire("selection:created", {
                                target: activeGroup,
                                e: e
                            });
                        }
                    }
                    target.set("active", true);
                }
                if (activeGroup) {
                    activeGroup.saveCoords();
                }
            },
            _translateObject: function(x, y) {
                var target = this._currentTransform.target;
                if (!target.get("lockMovementX")) {
                    target.set("left", x - this._currentTransform.offsetX);
                }
                if (!target.get("lockMovementY")) {
                    target.set("top", y - this._currentTransform.offsetY);
                }
            },
            _scaleObject: function(x, y, by) {
                var t = this._currentTransform, offset = this._offset, target = t.target;
                var lockScalingX = target.get("lockScalingX"), lockScalingY = target.get("lockScalingY");
                if (lockScalingX && lockScalingY) return;
                var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);
                var localMouse = target.toLocalPoint(new fabric.Point(x - offset.left, y - offset.top), t.originX, t.originY);
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
                var newScaleX = target.scaleX, newScaleY = target.scaleY;
                if (by === "equally" && !lockScalingX && !lockScalingY) {
                    var dist = localMouse.y + localMouse.x;
                    var lastDist = (target.height + target.strokeWidth) * t.original.scaleY + (target.width + target.strokeWidth) * t.original.scaleX;
                    newScaleX = t.original.scaleX * dist / lastDist;
                    newScaleY = t.original.scaleY * dist / lastDist;
                    target.set("scaleX", newScaleX);
                    target.set("scaleY", newScaleY);
                } else if (!by) {
                    newScaleX = localMouse.x / (target.width + target.strokeWidth);
                    newScaleY = localMouse.y / (target.height + target.strokeWidth);
                    lockScalingX || target.set("scaleX", newScaleX);
                    lockScalingY || target.set("scaleY", newScaleY);
                } else if (by === "x" && !target.get("lockUniScaling")) {
                    newScaleX = localMouse.x / (target.width + target.strokeWidth);
                    lockScalingX || target.set("scaleX", newScaleX);
                } else if (by === "y" && !target.get("lockUniScaling")) {
                    newScaleY = localMouse.y / (target.height + target.strokeWidth);
                    lockScalingY || target.set("scaleY", newScaleY);
                }
                if (newScaleX < 0) {
                    if (t.originX === "left") t.originX = "right"; else if (t.originX === "right") t.originX = "left";
                }
                if (newScaleY < 0) {
                    if (t.originY === "top") t.originY = "bottom"; else if (t.originY === "bottom") t.originY = "top";
                }
                target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
            },
            _rotateObject: function(x, y) {
                var t = this._currentTransform, o = this._offset;
                if (t.target.get("lockRotation")) return;
                var lastAngle = atan2(t.ey - t.top - o.top, t.ex - t.left - o.left), curAngle = atan2(y - t.top - o.top, x - t.left - o.left), angle = radiansToDegrees(curAngle - lastAngle + t.theta);
                if (angle < 0) {
                    angle = 360 + angle;
                }
                t.target.angle = angle;
            },
            _setCursor: function(value) {
                this.upperCanvasEl.style.cursor = value;
            },
            _resetObjectTransform: function(target) {
                target.scaleX = 1;
                target.scaleY = 1;
                target.setAngle(0);
            },
            _drawSelection: function() {
                var ctx = this.contextTop, groupSelector = this._groupSelector, left = groupSelector.left, top = groupSelector.top, aleft = abs(left), atop = abs(top);
                ctx.fillStyle = this.selectionColor;
                ctx.fillRect(groupSelector.ex - (left > 0 ? 0 : -left), groupSelector.ey - (top > 0 ? 0 : -top), aleft, atop);
                ctx.lineWidth = this.selectionLineWidth;
                ctx.strokeStyle = this.selectionBorderColor;
                if (this.selectionDashArray.length > 1) {
                    var px = groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft);
                    var py = groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop);
                    ctx.beginPath();
                    fabric.util.drawDashedLine(ctx, px, py, px + aleft, py, this.selectionDashArray);
                    fabric.util.drawDashedLine(ctx, px, py + atop - 1, px + aleft, py + atop - 1, this.selectionDashArray);
                    fabric.util.drawDashedLine(ctx, px, py, px, py + atop, this.selectionDashArray);
                    fabric.util.drawDashedLine(ctx, px + aleft - 1, py, px + aleft - 1, py + atop, this.selectionDashArray);
                    ctx.closePath();
                    ctx.stroke();
                } else {
                    ctx.strokeRect(groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft), groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop), aleft, atop);
                }
            },
            _findSelectedObjects: function(e) {
                var group = [], x1 = this._groupSelector.ex, y1 = this._groupSelector.ey, x2 = x1 + this._groupSelector.left, y2 = y1 + this._groupSelector.top, currentObject, selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)), selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2)), isClick = x1 === x2 && y1 === y2;
                for (var i = this._objects.length; i--; ) {
                    currentObject = this._objects[i];
                    if (!currentObject) continue;
                    if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) || currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2) || currentObject.containsPoint(selectionX1Y1) || currentObject.containsPoint(selectionX2Y2)) {
                        if (this.selection && currentObject.selectable) {
                            currentObject.set("active", true);
                            group.push(currentObject);
                            if (isClick) break;
                        }
                    }
                }
                if (group.length === 1) {
                    this.setActiveObject(group[0], e);
                } else if (group.length > 1) {
                    group = new fabric.Group(group.reverse());
                    this.setActiveGroup(group);
                    group.saveCoords();
                    this.fire("selection:created", {
                        target: group
                    });
                    this.renderAll();
                }
            },
            findTarget: function(e, skipGroup) {
                if (this.skipTargetFind) return;
                var target, pointer = this.getPointer(e);
                if (this.controlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay.visible && this.containsPoint(e, this.lastRenderedObjectWithControlsAboveOverlay) && this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(e, this._offset)) {
                    target = this.lastRenderedObjectWithControlsAboveOverlay;
                    return target;
                }
                var activeGroup = this.getActiveGroup();
                if (activeGroup && !skipGroup && this.containsPoint(e, activeGroup)) {
                    target = activeGroup;
                    return target;
                }
                var possibleTargets = [];
                for (var i = this._objects.length; i--; ) {
                    if (this._objects[i] && this._objects[i].visible && this.containsPoint(e, this._objects[i])) {
                        if (this.perPixelTargetFind || this._objects[i].perPixelTargetFind) {
                            possibleTargets[possibleTargets.length] = this._objects[i];
                        } else {
                            target = this._objects[i];
                            this.relatedTarget = target;
                            break;
                        }
                    }
                }
                for (var j = 0, len = possibleTargets.length; j < len; j++) {
                    pointer = this.getPointer(e);
                    var isTransparent = this.isTargetTransparent(possibleTargets[j], pointer.x, pointer.y);
                    if (!isTransparent) {
                        target = possibleTargets[j];
                        this.relatedTarget = target;
                        break;
                    }
                }
                return target;
            },
            getPointer: function(e) {
                var pointer = getPointer(e, this.upperCanvasEl);
                return {
                    x: pointer.x - this._offset.left,
                    y: pointer.y - this._offset.top
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
                    "class": this.containerClass
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
            setActiveObject: function(object, e) {
                if (this._activeObject) {
                    this._activeObject.set("active", false);
                }
                this._activeObject = object;
                object.set("active", true);
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
            discardActiveObject: function() {
                if (this._activeObject) {
                    this._activeObject.set("active", false);
                }
                this._activeObject = null;
                return this;
            },
            setActiveGroup: function(group) {
                this._activeGroup = group;
                if (group) {
                    group.canvas = this;
                    group.set("active", true);
                }
                return this;
            },
            getActiveGroup: function() {
                return this._activeGroup;
            },
            discardActiveGroup: function() {
                var g = this.getActiveGroup();
                if (g) {
                    g.destroy();
                }
                return this.setActiveGroup(null);
            },
            deactivateAll: function() {
                var allObjects = this.getObjects(), i = 0, len = allObjects.length;
                for (;i < len; i++) {
                    allObjects[i].set("active", false);
                }
                this.discardActiveGroup();
                this.discardActiveObject();
                return this;
            },
            deactivateAllWithDispatch: function() {
                var activeObject = this.getActiveGroup() || this.getActiveObject();
                if (activeObject) {
                    this.fire("before:selection:cleared", {
                        target: activeObject
                    });
                }
                this.deactivateAll();
                if (activeObject) {
                    this.fire("selection:cleared");
                }
                return this;
            },
            drawControls: function(ctx) {
                var activeGroup = this.getActiveGroup();
                if (activeGroup) {
                    ctx.save();
                    fabric.Group.prototype.transform.call(activeGroup, ctx);
                    activeGroup.drawBorders(ctx).drawControls(ctx);
                    ctx.restore();
                } else {
                    for (var i = 0, len = this._objects.length; i < len; ++i) {
                        if (!this._objects[i] || !this._objects[i].active) continue;
                        ctx.save();
                        fabric.Object.prototype.transform.call(this._objects[i], ctx);
                        this._objects[i].drawBorders(ctx).drawControls(ctx);
                        ctx.restore();
                        this.lastRenderedObjectWithControlsAboveOverlay = this._objects[i];
                    }
                }
            }
        };
        fabric.Canvas.prototype.toString = fabric.StaticCanvas.prototype.toString;
        extend(fabric.Canvas.prototype, InteractiveMethods);
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
        var cursorMap = [ "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize" ], cursorOffset = {
            mt: 0,
            tr: 1,
            mr: 2,
            br: 3,
            mb: 4,
            bl: 5,
            ml: 6,
            tl: 7
        }, addListener = fabric.util.addListener, removeListener = fabric.util.removeListener, getPointer = fabric.util.getPointer;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            _initEvents: function() {
                var _this = this;
                this._onMouseDown = this._onMouseDown.bind(this);
                this._onMouseMove = this._onMouseMove.bind(this);
                this._onMouseUp = this._onMouseUp.bind(this);
                this._onResize = this._onResize.bind(this);
                this._onGesture = function(e, s) {
                    _this.__onTransformGesture(e, s);
                };
                addListener(fabric.window, "resize", this._onResize);
                if (fabric.isTouchSupported) {
                    addListener(this.upperCanvasEl, "touchstart", this._onMouseDown);
                    addListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
                    if (typeof Event !== "undefined" && "add" in Event) {
                        Event.add(this.upperCanvasEl, "gesture", this._onGesture);
                    }
                } else {
                    addListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
                    addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
                }
            },
            _onMouseDown: function(e) {
                this.__onMouseDown(e);
                !fabric.isTouchSupported && addListener(fabric.document, "mouseup", this._onMouseUp);
                fabric.isTouchSupported && addListener(fabric.document, "touchend", this._onMouseUp);
                !fabric.isTouchSupported && addListener(fabric.document, "mousemove", this._onMouseMove);
                fabric.isTouchSupported && addListener(fabric.document, "touchmove", this._onMouseMove);
                !fabric.isTouchSupported && removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
                fabric.isTouchSupported && removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            },
            _onMouseUp: function(e) {
                this.__onMouseUp(e);
                !fabric.isTouchSupported && removeListener(fabric.document, "mouseup", this._onMouseUp);
                fabric.isTouchSupported && removeListener(fabric.document, "touchend", this._onMouseUp);
                !fabric.isTouchSupported && removeListener(fabric.document, "mousemove", this._onMouseMove);
                fabric.isTouchSupported && removeListener(fabric.document, "touchmove", this._onMouseMove);
                !fabric.isTouchSupported && addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
                fabric.isTouchSupported && addListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            },
            _onMouseMove: function(e) {
                !this.allowTouchScrolling && e.preventDefault && e.preventDefault();
                this.__onMouseMove(e);
            },
            _onResize: function() {
                this.calcOffset();
            },
            __onMouseUp: function(e) {
                var target;
                if (this.isDrawingMode && this._isCurrentlyDrawing) {
                    this._isCurrentlyDrawing = false;
                    if (this.clipTo) {
                        this.contextTop.restore();
                    }
                    this.freeDrawingBrush.onMouseUp();
                    this.fire("mouse:up", {
                        e: e
                    });
                    return;
                }
                if (this._currentTransform) {
                    var transform = this._currentTransform;
                    target = transform.target;
                    if (target._scaling) {
                        target._scaling = false;
                    }
                    target.isMoving = false;
                    target.setCoords();
                    if (this.stateful && target.hasStateChanged()) {
                        this.fire("object:modified", {
                            target: target
                        });
                        target.fire("modified");
                    }
                    if (this._previousOriginX) {
                        this._currentTransform.target.adjustPosition(this._previousOriginX);
                        this._previousOriginX = null;
                    }
                }
                this._currentTransform = null;
                if (this.selection && this._groupSelector) {
                    this._findSelectedObjects(e);
                }
                var activeGroup = this.getActiveGroup();
                if (activeGroup) {
                    activeGroup.setObjectsCoords();
                    activeGroup.set("isMoving", false);
                    this._setCursor(this.defaultCursor);
                }
                this._groupSelector = null;
                this.renderAll();
                this._setCursorFromEvent(e, target);
                var _this = this;
                setTimeout(function() {
                    _this._setCursorFromEvent(e, target);
                }, 50);
                this.fire("mouse:up", {
                    target: target,
                    e: e
                });
                target && target.fire("mouseup", {
                    e: e
                });
            },
            __onMouseDown: function(e) {
                var pointer;
                var isLeftClick = "which" in e ? e.which === 1 : e.button === 1;
                if (!isLeftClick && !fabric.isTouchSupported) return;
                if (this.isDrawingMode) {
                    pointer = this.getPointer(e);
                    this._isCurrentlyDrawing = true;
                    this.discardActiveObject().renderAll();
                    if (this.clipTo) {
                        fabric.util.clipContext(this, this.contextTop);
                    }
                    this.freeDrawingBrush.onMouseDown(pointer);
                    this.fire("mouse:down", {
                        e: e
                    });
                    return;
                }
                if (this._currentTransform) return;
                var target = this.findTarget(e), corner;
                pointer = this.getPointer(e);
                if (this._shouldClearSelection(e, target)) {
                    this._groupSelector = {
                        ex: pointer.x,
                        ey: pointer.y,
                        top: 0,
                        left: 0
                    };
                    this.deactivateAllWithDispatch();
                    target && target.selectable && this.setActiveObject(target, e);
                } else if (this._shouldHandleGroupLogic(e, target)) {
                    this._handleGroupLogic(e, target);
                    target = this.getActiveGroup();
                } else {
                    this.stateful && target.saveState();
                    if (corner = target._findTargetCorner(e, this._offset)) {
                        this.onBeforeScaleRotate(target);
                    }
                    if (target !== this.getActiveGroup() && target !== this.getActiveObject()) {
                        this.deactivateAll();
                        this.setActiveObject(target, e);
                    }
                    this._setupCurrentTransform(e, target);
                }
                this.renderAll();
                this.fire("mouse:down", {
                    target: target,
                    e: e
                });
                target && target.fire("mousedown", {
                    e: e
                });
                if (corner === "mtr") {
                    this._previousOriginX = this._currentTransform.target.originX;
                    this._currentTransform.target.adjustPosition("center");
                    this._currentTransform.left = this._currentTransform.target.left;
                    this._currentTransform.top = this._currentTransform.target.top;
                }
            },
            __onMouseMove: function(e) {
                var target, pointer;
                if (this.isDrawingMode) {
                    if (this._isCurrentlyDrawing) {
                        pointer = this.getPointer(e);
                        this.freeDrawingBrush.onMouseMove(pointer);
                    }
                    this.upperCanvasEl.style.cursor = this.freeDrawingCursor;
                    this.fire("mouse:move", {
                        e: e
                    });
                    return;
                }
                var groupSelector = this._groupSelector;
                if (groupSelector) {
                    pointer = getPointer(e, this.upperCanvasEl);
                    groupSelector.left = pointer.x - this._offset.left - groupSelector.ex;
                    groupSelector.top = pointer.y - this._offset.top - groupSelector.ey;
                    this.renderTop();
                } else if (!this._currentTransform) {
                    var style = this.upperCanvasEl.style;
                    target = this.findTarget(e);
                    if (!target || target && !target.selectable) {
                        for (var i = this._objects.length; i--; ) {
                            if (this._objects[i] && !this._objects[i].active) {
                                this._objects[i].set("active", false);
                            }
                        }
                        style.cursor = this.defaultCursor;
                    } else {
                        this._setCursorFromEvent(e, target);
                    }
                } else {
                    pointer = getPointer(e, this.upperCanvasEl);
                    var x = pointer.x, y = pointer.y, reset = false, transform = this._currentTransform;
                    target = transform.target;
                    target.isMoving = true;
                    if ((transform.action === "scale" || transform.action === "scaleX" || transform.action === "scaleY") && (e.altKey && (transform.originX !== "center" || transform.originY !== "center") || !e.altKey && transform.originX === "center" && transform.originY === "center")) {
                        this._resetCurrentTransform(e);
                        reset = true;
                    }
                    if (transform.action === "rotate") {
                        this._rotateObject(x, y);
                        this.fire("object:rotating", {
                            target: target,
                            e: e
                        });
                        target.fire("rotating", {
                            e: e
                        });
                    } else if (transform.action === "scale") {
                        if ((e.shiftKey || this.uniScaleTransform) && !target.get("lockUniScaling")) {
                            transform.currentAction = "scale";
                            this._scaleObject(x, y);
                        } else {
                            if (!reset && transform.currentAction === "scale") {
                                this._resetCurrentTransform(e);
                            }
                            transform.currentAction = "scaleEqually";
                            this._scaleObject(x, y, "equally");
                        }
                        this.fire("object:scaling", {
                            target: target,
                            e: e
                        });
                        target.fire("scaling", {
                            e: e
                        });
                    } else if (transform.action === "scaleX") {
                        this._scaleObject(x, y, "x");
                        this.fire("object:scaling", {
                            target: target,
                            e: e
                        });
                        target.fire("scaling", {
                            e: e
                        });
                    } else if (transform.action === "scaleY") {
                        this._scaleObject(x, y, "y");
                        this.fire("object:scaling", {
                            target: target,
                            e: e
                        });
                        target.fire("scaling", {
                            e: e
                        });
                    } else {
                        this._translateObject(x, y);
                        this.fire("object:moving", {
                            target: target,
                            e: e
                        });
                        target.fire("moving", {
                            e: e
                        });
                        this._setCursor(this.moveCursor);
                    }
                    this.renderAll();
                }
                this.fire("mouse:move", {
                    target: target,
                    e: e
                });
                target && target.fire("mousemove", {
                    e: e
                });
            },
            _setCursorFromEvent: function(e, target) {
                var s = this.upperCanvasEl.style;
                if (!target) {
                    s.cursor = this.defaultCursor;
                    return false;
                } else {
                    var activeGroup = this.getActiveGroup();
                    var corner = target._findTargetCorner && (!activeGroup || !activeGroup.contains(target)) && target._findTargetCorner(e, this._offset);
                    if (!corner) {
                        s.cursor = this.hoverCursor;
                    } else {
                        if (corner in cursorOffset) {
                            var n = Math.round(target.getAngle() % 360 / 45);
                            if (n < 0) {
                                n += 8;
                            }
                            n += cursorOffset[corner];
                            n %= 8;
                            s.cursor = cursorMap[n];
                        } else if (corner === "mtr" && target.hasRotatingPoint) {
                            s.cursor = this.rotationCursor;
                        } else {
                            s.cursor = this.defaultCursor;
                            return false;
                        }
                    }
                }
                return true;
            }
        });
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
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        loadFromDatalessJSON: function(json, callback) {
            return this.loadFromJSON(json, callback);
        },
        loadFromJSON: function(json, callback) {
            if (!json) return;
            var serialized = typeof json === "string" ? JSON.parse(json) : json;
            this.clear();
            var _this = this;
            this._enlivenObjects(serialized.objects, function() {
                _this._setBgOverlayImages(serialized, callback);
            });
            return this;
        },
        _setBgOverlayImages: function(serialized, callback) {
            var _this = this, backgroundPatternLoaded, backgroundImageLoaded, overlayImageLoaded;
            var cbIfLoaded = function() {
                callback && backgroundImageLoaded && overlayImageLoaded && backgroundPatternLoaded && callback();
            };
            if (serialized.backgroundImage) {
                this.setBackgroundImage(serialized.backgroundImage, function() {
                    _this.backgroundImageOpacity = serialized.backgroundImageOpacity;
                    _this.backgroundImageStretch = serialized.backgroundImageStretch;
                    _this.renderAll();
                    backgroundImageLoaded = true;
                    cbIfLoaded();
                });
            } else {
                backgroundImageLoaded = true;
            }
            if (serialized.overlayImage) {
                this.setOverlayImage(serialized.overlayImage, function() {
                    _this.overlayImageLeft = serialized.overlayImageLeft || 0;
                    _this.overlayImageTop = serialized.overlayImageTop || 0;
                    _this.renderAll();
                    overlayImageLoaded = true;
                    cbIfLoaded();
                });
            } else {
                overlayImageLoaded = true;
            }
            if (serialized.background) {
                this.setBackgroundColor(serialized.background, function() {
                    _this.renderAll();
                    backgroundPatternLoaded = true;
                    cbIfLoaded();
                });
            } else {
                backgroundPatternLoaded = true;
            }
            if (!serialized.backgroundImage && !serialized.overlayImage && !serialized.background) {
                callback && callback();
            }
        },
        _enlivenObjects: function(objects, callback) {
            var _this = this;
            if (objects.length === 0) {
                callback && callback();
            }
            var renderOnAddRemove = this.renderOnAddRemove;
            this.renderOnAddRemove = false;
            fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
                enlivenedObjects.forEach(function(obj, index) {
                    _this.insertAt(obj, index, true);
                });
                _this.renderOnAddRemove = renderOnAddRemove;
                callback && callback();
            });
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
        clone: function(callback) {
            var data = JSON.stringify(this);
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
    (function() {
        var degreesToRadians = fabric.util.degreesToRadians, radiansToDegrees = fabric.util.radiansToDegrees;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            __onTransformGesture: function(e, self) {
                if (this.isDrawingMode || e.touches.length !== 2 || "gesture" !== self.gesture) {
                    return;
                }
                var target = this.findTarget(e);
                if ("undefined" !== typeof target) {
                    this.onBeforeScaleRotate(target);
                    this._rotateObjectByAngle(self.rotation);
                    this._scaleObjectBy(self.scale);
                }
                this.fire("touch:gesture", {
                    target: target,
                    e: e,
                    self: self
                });
            },
            _scaleObjectBy: function(s, by) {
                var t = this._currentTransform, target = t.target;
                var lockScalingX = target.get("lockScalingX"), lockScalingY = target.get("lockScalingY");
                if (lockScalingX && lockScalingY) return;
                target._scaling = true;
                if (!by) {
                    if (!lockScalingX) {
                        target.set("scaleX", t.scaleX * s);
                    }
                    if (!lockScalingY) {
                        target.set("scaleY", t.scaleY * s);
                    }
                } else if (by === "x" && !target.get("lockUniScaling")) {
                    lockScalingX || target.set("scaleX", t.scaleX * s);
                } else if (by === "y" && !target.get("lockUniScaling")) {
                    lockScalingY || target.set("scaleY", t.scaleY * s);
                }
            },
            _rotateObjectByAngle: function(curAngle) {
                var t = this._currentTransform;
                if (t.target.get("lockRotation")) return;
                t.target.angle = radiansToDegrees(degreesToRadians(curAngle) + t.theta);
            }
        });
    })();
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
    (function() {
        var getPointer = fabric.util.getPointer, degreesToRadians = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            _findTargetCorner: function(e, offset) {
                if (!this.hasControls || !this.active) return false;
                var pointer = getPointer(e, this.canvas.upperCanvasEl), ex = pointer.x - offset.left, ey = pointer.y - offset.top, xPoints, lines;
                for (var i in this.oCoords) {
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
                var coords = this.oCoords, theta = degreesToRadians(this.angle), newTheta = degreesToRadians(45 - this.angle), cornerHypotenuse = Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2, cosHalfOffset = cornerHypotenuse * Math.cos(newTheta), sinHalfOffset = cornerHypotenuse * Math.sin(newTheta), sinTh = Math.sin(theta), cosTh = Math.cos(theta);
                coords.tl.corner = {
                    tl: {
                        x: coords.tl.x - sinHalfOffset,
                        y: coords.tl.y - cosHalfOffset
                    },
                    tr: {
                        x: coords.tl.x + cosHalfOffset,
                        y: coords.tl.y - sinHalfOffset
                    },
                    bl: {
                        x: coords.tl.x - cosHalfOffset,
                        y: coords.tl.y + sinHalfOffset
                    },
                    br: {
                        x: coords.tl.x + sinHalfOffset,
                        y: coords.tl.y + cosHalfOffset
                    }
                };
                coords.tr.corner = {
                    tl: {
                        x: coords.tr.x - sinHalfOffset,
                        y: coords.tr.y - cosHalfOffset
                    },
                    tr: {
                        x: coords.tr.x + cosHalfOffset,
                        y: coords.tr.y - sinHalfOffset
                    },
                    br: {
                        x: coords.tr.x + sinHalfOffset,
                        y: coords.tr.y + cosHalfOffset
                    },
                    bl: {
                        x: coords.tr.x - cosHalfOffset,
                        y: coords.tr.y + sinHalfOffset
                    }
                };
                coords.bl.corner = {
                    tl: {
                        x: coords.bl.x - sinHalfOffset,
                        y: coords.bl.y - cosHalfOffset
                    },
                    bl: {
                        x: coords.bl.x - cosHalfOffset,
                        y: coords.bl.y + sinHalfOffset
                    },
                    br: {
                        x: coords.bl.x + sinHalfOffset,
                        y: coords.bl.y + cosHalfOffset
                    },
                    tr: {
                        x: coords.bl.x + cosHalfOffset,
                        y: coords.bl.y - sinHalfOffset
                    }
                };
                coords.br.corner = {
                    tr: {
                        x: coords.br.x + cosHalfOffset,
                        y: coords.br.y - sinHalfOffset
                    },
                    bl: {
                        x: coords.br.x - cosHalfOffset,
                        y: coords.br.y + sinHalfOffset
                    },
                    br: {
                        x: coords.br.x + sinHalfOffset,
                        y: coords.br.y + cosHalfOffset
                    },
                    tl: {
                        x: coords.br.x - sinHalfOffset,
                        y: coords.br.y - cosHalfOffset
                    }
                };
                coords.ml.corner = {
                    tl: {
                        x: coords.ml.x - sinHalfOffset,
                        y: coords.ml.y - cosHalfOffset
                    },
                    tr: {
                        x: coords.ml.x + cosHalfOffset,
                        y: coords.ml.y - sinHalfOffset
                    },
                    bl: {
                        x: coords.ml.x - cosHalfOffset,
                        y: coords.ml.y + sinHalfOffset
                    },
                    br: {
                        x: coords.ml.x + sinHalfOffset,
                        y: coords.ml.y + cosHalfOffset
                    }
                };
                coords.mt.corner = {
                    tl: {
                        x: coords.mt.x - sinHalfOffset,
                        y: coords.mt.y - cosHalfOffset
                    },
                    tr: {
                        x: coords.mt.x + cosHalfOffset,
                        y: coords.mt.y - sinHalfOffset
                    },
                    bl: {
                        x: coords.mt.x - cosHalfOffset,
                        y: coords.mt.y + sinHalfOffset
                    },
                    br: {
                        x: coords.mt.x + sinHalfOffset,
                        y: coords.mt.y + cosHalfOffset
                    }
                };
                coords.mr.corner = {
                    tl: {
                        x: coords.mr.x - sinHalfOffset,
                        y: coords.mr.y - cosHalfOffset
                    },
                    tr: {
                        x: coords.mr.x + cosHalfOffset,
                        y: coords.mr.y - sinHalfOffset
                    },
                    bl: {
                        x: coords.mr.x - cosHalfOffset,
                        y: coords.mr.y + sinHalfOffset
                    },
                    br: {
                        x: coords.mr.x + sinHalfOffset,
                        y: coords.mr.y + cosHalfOffset
                    }
                };
                coords.mb.corner = {
                    tl: {
                        x: coords.mb.x - sinHalfOffset,
                        y: coords.mb.y - cosHalfOffset
                    },
                    tr: {
                        x: coords.mb.x + cosHalfOffset,
                        y: coords.mb.y - sinHalfOffset
                    },
                    bl: {
                        x: coords.mb.x - cosHalfOffset,
                        y: coords.mb.y + sinHalfOffset
                    },
                    br: {
                        x: coords.mb.x + sinHalfOffset,
                        y: coords.mb.y + cosHalfOffset
                    }
                };
                coords.mtr.corner = {
                    tl: {
                        x: coords.mtr.x - sinHalfOffset + sinTh * this.rotatingPointOffset,
                        y: coords.mtr.y - cosHalfOffset - cosTh * this.rotatingPointOffset
                    },
                    tr: {
                        x: coords.mtr.x + cosHalfOffset + sinTh * this.rotatingPointOffset,
                        y: coords.mtr.y - sinHalfOffset - cosTh * this.rotatingPointOffset
                    },
                    bl: {
                        x: coords.mtr.x - cosHalfOffset + sinTh * this.rotatingPointOffset,
                        y: coords.mtr.y + sinHalfOffset - cosTh * this.rotatingPointOffset
                    },
                    br: {
                        x: coords.mtr.x + sinHalfOffset + sinTh * this.rotatingPointOffset,
                        y: coords.mtr.y + cosHalfOffset - cosTh * this.rotatingPointOffset
                    }
                };
            },
            drawBorders: function(ctx) {
                if (!this.hasBorders) return this;
                var padding = this.padding, padding2 = padding * 2, strokeWidth = ~~(this.strokeWidth / 2) * 2;
                ctx.save();
                ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
                ctx.strokeStyle = this.borderColor;
                var scaleX = 1 / this._constrainScale(this.scaleX), scaleY = 1 / this._constrainScale(this.scaleY);
                ctx.lineWidth = 1 / this.borderScaleFactor;
                ctx.scale(scaleX, scaleY);
                var w = this.getWidth(), h = this.getHeight();
                ctx.strokeRect(~~(-(w / 2) - padding - strokeWidth / 2 * this.scaleX) - .5, ~~(-(h / 2) - padding - strokeWidth / 2 * this.scaleY) - .5, ~~(w + padding2 + strokeWidth * this.scaleX) + 1, ~~(h + padding2 + strokeWidth * this.scaleY) + 1);
                if (this.hasRotatingPoint && !this.get("lockRotation") && this.hasControls) {
                    var rotateHeight = (this.flipY ? h + strokeWidth * this.scaleY + padding * 2 : -h - strokeWidth * this.scaleY - padding * 2) / 2;
                    ctx.beginPath();
                    ctx.moveTo(0, rotateHeight);
                    ctx.lineTo(0, rotateHeight + (this.flipY ? this.rotatingPointOffset : -this.rotatingPointOffset));
                    ctx.closePath();
                    ctx.stroke();
                }
                ctx.restore();
                return this;
            },
            drawControls: function(ctx) {
                if (!this.hasControls) return this;
                var size = this.cornerSize, size2 = size / 2, strokeWidth2 = ~~(this.strokeWidth / 2), left = -(this.width / 2), top = -(this.height / 2), _left, _top, sizeX = size / this.scaleX, sizeY = size / this.scaleY, paddingX = this.padding / this.scaleX, paddingY = this.padding / this.scaleY, scaleOffsetY = size2 / this.scaleY, scaleOffsetX = size2 / this.scaleX, scaleOffsetSizeX = (size2 - size) / this.scaleX, scaleOffsetSizeY = (size2 - size) / this.scaleY, height = this.height, width = this.width, methodName = this.transparentCorners ? "strokeRect" : "fillRect", transparent = this.transparentCorners, isVML = typeof G_vmlCanvasManager !== "undefined";
                ctx.save();
                ctx.lineWidth = 1 / Math.max(this.scaleX, this.scaleY);
                ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
                ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
                _left = left - scaleOffsetX - strokeWidth2 - paddingX;
                _top = top - scaleOffsetY - strokeWidth2 - paddingY;
                isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                ctx[methodName](_left, _top, sizeX, sizeY);
                _left = left + width - scaleOffsetX + strokeWidth2 + paddingX;
                _top = top - scaleOffsetY - strokeWidth2 - paddingY;
                isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                ctx[methodName](_left, _top, sizeX, sizeY);
                _left = left - scaleOffsetX - strokeWidth2 - paddingX;
                _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;
                isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                ctx[methodName](_left, _top, sizeX, sizeY);
                _left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
                _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;
                isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                ctx[methodName](_left, _top, sizeX, sizeY);
                if (!this.get("lockUniScaling")) {
                    _left = left + width / 2 - scaleOffsetX;
                    _top = top - scaleOffsetY - strokeWidth2 - paddingY;
                    isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                    ctx[methodName](_left, _top, sizeX, sizeY);
                    _left = left + width / 2 - scaleOffsetX;
                    _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;
                    isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                    ctx[methodName](_left, _top, sizeX, sizeY);
                    _left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
                    _top = top + height / 2 - scaleOffsetY;
                    isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                    ctx[methodName](_left, _top, sizeX, sizeY);
                    _left = left - scaleOffsetX - strokeWidth2 - paddingX;
                    _top = top + height / 2 - scaleOffsetY;
                    isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                    ctx[methodName](_left, _top, sizeX, sizeY);
                }
                if (this.hasRotatingPoint) {
                    _left = left + width / 2 - scaleOffsetX;
                    _top = this.flipY ? top + height + this.rotatingPointOffset / this.scaleY - sizeY / 2 + strokeWidth2 + paddingY : top - this.rotatingPointOffset / this.scaleY - sizeY / 2 - strokeWidth2 - paddingY;
                    isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
                    ctx[methodName](_left, _top, sizeX, sizeY);
                }
                ctx.restore();
                return this;
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
        fabric.Line.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" "));
        fabric.Line.fromElement = function(element, options) {
            var parsedAttributes = fabric.parseAttributes(element, fabric.Line.ATTRIBUTE_NAMES);
            var points = [ parsedAttributes.x1 || 0, parsedAttributes.y1 || 0, parsedAttributes.x2 || 0, parsedAttributes.y2 || 0 ];
            return new fabric.Line(points, extend(parsedAttributes, options));
        };
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
        fabric.Circle.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("cx cy r".split(" "));
        fabric.Circle.fromElement = function(element, options) {
            options || (options = {});
            var parsedAttributes = fabric.parseAttributes(element, fabric.Circle.ATTRIBUTE_NAMES);
            if (!isValidRadius(parsedAttributes)) {
                throw new Error("value of `r` attribute is required and can not be negative");
            }
            if ("left" in parsedAttributes) {
                parsedAttributes.left -= options.width / 2 || 0;
            }
            if ("top" in parsedAttributes) {
                parsedAttributes.top -= options.height / 2 || 0;
            }
            var obj = new fabric.Circle(extend(parsedAttributes, options));
            obj.cx = parseFloat(element.getAttribute("cx")) || 0;
            obj.cy = parseFloat(element.getAttribute("cy")) || 0;
            return obj;
        };
        function isValidRadius(attributes) {
            return "radius" in attributes && attributes.radius > 0;
        }
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
        fabric.Ellipse.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" "));
        fabric.Ellipse.fromElement = function(element, options) {
            options || (options = {});
            var parsedAttributes = fabric.parseAttributes(element, fabric.Ellipse.ATTRIBUTE_NAMES);
            var cx = parsedAttributes.left;
            var cy = parsedAttributes.top;
            if ("left" in parsedAttributes) {
                parsedAttributes.left -= options.width / 2 || 0;
            }
            if ("top" in parsedAttributes) {
                parsedAttributes.top -= options.height / 2 || 0;
            }
            var ellipse = new fabric.Ellipse(extend(parsedAttributes, options));
            ellipse.cx = cx || 0;
            ellipse.cy = cy || 0;
            return ellipse;
        };
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
        fabric.Rect.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" "));
        function _setDefaultLeftTopValues(attributes) {
            attributes.left = attributes.left || 0;
            attributes.top = attributes.top || 0;
            return attributes;
        }
        fabric.Rect.fromElement = function(element, options) {
            if (!element) {
                return null;
            }
            var parsedAttributes = fabric.parseAttributes(element, fabric.Rect.ATTRIBUTE_NAMES);
            parsedAttributes = _setDefaultLeftTopValues(parsedAttributes);
            var rect = new fabric.Rect(extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes));
            rect._normalizeLeftTopProperties(parsedAttributes);
            return rect;
        };
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
        fabric.Polyline.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();
        fabric.Polyline.fromElement = function(element, options) {
            if (!element) {
                return null;
            }
            options || (options = {});
            var points = fabric.parsePointsAttribute(element.getAttribute("points")), parsedAttributes = fabric.parseAttributes(element, fabric.Polyline.ATTRIBUTE_NAMES), minX = min(points, "x"), minY = min(points, "y");
            minX = minX < 0 ? minX : 0;
            minY = minX < 0 ? minY : 0;
            for (var i = 0, len = points.length; i < len; i++) {
                points[i].x -= options.width / 2 + minX || 0;
                points[i].y -= options.height / 2 + minY || 0;
            }
            return new fabric.Polyline(points, fabric.util.object.extend(parsedAttributes, options), true);
        };
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
        fabric.Polygon.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();
        fabric.Polygon.fromElement = function(element, options) {
            if (!element) {
                return null;
            }
            options || (options = {});
            var points = fabric.parsePointsAttribute(element.getAttribute("points")), parsedAttributes = fabric.parseAttributes(element, fabric.Polygon.ATTRIBUTE_NAMES), minX = min(points, "x"), minY = min(points, "y");
            minX = minX < 0 ? minX : 0;
            minY = minX < 0 ? minY : 0;
            for (var i = 0, len = points.length; i < len; i++) {
                points[i].x -= options.width / 2 + minX || 0;
                points[i].y -= options.height / 2 + minY || 0;
            }
            return new fabric.Polygon(points, extend(parsedAttributes, options), true);
        };
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
        fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height xlink:href".split(" "));
        fabric.Image.fromElement = function(element, callback, options) {
            var parsedAttributes = fabric.parseAttributes(element, fabric.Image.ATTRIBUTE_NAMES);
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.Brightness = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
            type: "Brightness",
            initialize: function(options) {
                options = options || {};
                this.brightness = options.brightness || 100;
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.Convolute = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
            type: "Convolute",
            initialize: function(options) {
                options = options || {};
                this.opaque = options.opaque;
                this.matrix = options.matrix || [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ];
                var canvasEl = fabric.util.createCanvasElement();
                this.tmpCtx = canvasEl.getContext("2d");
            },
            _createImageData: function(w, h) {
                return this.tmpCtx.createImageData(w, h);
            },
            applyTo: function(canvasEl) {
                var weights = this.matrix;
                var context = canvasEl.getContext("2d");
                var pixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height);
                var side = Math.round(Math.sqrt(weights.length));
                var halfSide = Math.floor(side / 2);
                var src = pixels.data;
                var sw = pixels.width;
                var sh = pixels.height;
                var w = sw;
                var h = sh;
                var output = this._createImageData(w, h);
                var dst = output.data;
                var alphaFac = this.opaque ? 1 : 0;
                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        var sy = y;
                        var sx = x;
                        var dstOff = (y * w + x) * 4;
                        var r = 0, g = 0, b = 0, a = 0;
                        for (var cy = 0; cy < side; cy++) {
                            for (var cx = 0; cx < side; cx++) {
                                var scy = sy + cy - halfSide;
                                var scx = sx + cx - halfSide;
                                if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                                    var srcOff = (scy * sw + scx) * 4;
                                    var wt = weights[cy * side + cx];
                                    r += src[srcOff] * wt;
                                    g += src[srcOff + 1] * wt;
                                    b += src[srcOff + 2] * wt;
                                    a += src[srcOff + 3] * wt;
                                }
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.GradientTransparency = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
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
        var fabric = global.fabric || (global.fabric = {});
        fabric.Image.filters.Grayscale = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
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
        var fabric = global.fabric || (global.fabric = {});
        fabric.Image.filters.Invert = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.Mask = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
            type: "Mask",
            initialize: function(options) {
                options = options || {};
                this.mask = options.mask;
                this.channel = [ 0, 1, 2, 3 ].indexOf(options.channel) > -1 ? options.channel : 0;
            },
            applyTo: function(canvasEl) {
                if (!this.mask) return;
                var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, maskEl = this.mask.getElement(), maskCanvasEl = fabric.util.createCanvasElement(), channel = this.channel, i, iLen = imageData.width * imageData.height * 4;
                maskCanvasEl.width = maskEl.width;
                maskCanvasEl.height = maskEl.height;
                maskCanvasEl.getContext("2d").drawImage(maskEl, 0, 0, maskEl.width, maskEl.height);
                var maskImageData = maskCanvasEl.getContext("2d").getImageData(0, 0, maskEl.width, maskEl.height), maskData = maskImageData.data;
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
            var img = fabric.document.createElement("img"), src = object.mask.src;
            img.onload = function() {
                object.mask = new fabric.Image(img, object.mask);
                callback && callback(new fabric.Image.filters.Mask(object));
                img = img.onload = img.onerror = null;
            };
            img.onerror = function() {
                fabric.log("Error loading " + img.src);
                callback && callback(null, true);
                img = img.onload = img.onerror = null;
            };
            img.src = src;
        };
        fabric.Image.filters.Mask.async = true;
    })(typeof exports !== "undefined" ? exports : this);
    (function(global) {
        "use strict";
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.Noise = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
            type: "Noise",
            initialize: function(options) {
                options = options || {};
                this.noise = options.noise || 100;
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.Pixelate = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.RemoveWhite = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
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
                        data[i + 3] = 1;
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
        var fabric = global.fabric || (global.fabric = {});
        fabric.Image.filters.Sepia = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
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
        var fabric = global.fabric || (global.fabric = {});
        fabric.Image.filters.Sepia2 = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
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
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
        fabric.Image.filters.Tint = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
            type: "Tint",
            initialize: function(options) {
                options = options || {};
                this.color = options.color || 0;
            },
            applyTo: function(canvasEl) {
                var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, a;
                var rgb = parseInt(this.color, 10).toString(16);
                var cr = parseInt("0x" + rgb.substr(0, 2), 16);
                var cg = parseInt("0x" + rgb.substr(2, 2), 16);
                var cb = parseInt("0x" + rgb.substr(4, 2), 16);
                for (i = 0; i < iLen; i += 4) {
                    a = data[i + 3];
                    if (a > 0) {
                        data[i] = cr;
                        data[i + 1] = cg;
                        data[i + 2] = cb;
                    }
                }
                context.putImageData(imageData, 0, 0);
            },
            toObject: function() {
                return extend(this.callSuper("toObject"), {
                    color: this.color
                });
            }
        });
        fabric.Image.filters.Tint.fromObject = function(object) {
            return new fabric.Image.filters.Tint(object);
        };
    })(typeof exports !== "undefined" ? exports : this);
    (function(global) {
        "use strict";
        var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, supportsLineDash = fabric.StaticCanvas.supports("setLineDash");
        if (fabric.Text) {
            fabric.warn("fabric.Text is already defined");
            return;
        }
        var stateProperties = fabric.Object.prototype.stateProperties.concat();
        stateProperties.push("fontFamily", "fontWeight", "fontSize", "path", "text", "textDecoration", "textShadow", "textAlign", "fontStyle", "lineHeight", "backgroundColor", "textBackgroundColor", "useNative");
        fabric.Text = fabric.util.createClass(fabric.Object, {
            _dimensionAffectingProps: {
                fontSize: true,
                fontWeight: true,
                fontFamily: true,
                textDecoration: true,
                fontStyle: true,
                lineHeight: true,
                stroke: true,
                strokeWidth: true,
                text: true
            },
            type: "text",
            fontSize: 40,
            fontWeight: "normal",
            fontFamily: "Times New Roman",
            textDecoration: "",
            textShadow: "",
            textAlign: "left",
            fontStyle: "",
            lineHeight: 1.3,
            backgroundColor: "",
            textBackgroundColor: "",
            path: null,
            useNative: true,
            stateProperties: stateProperties,
            initialize: function(text, options) {
                options = options || {};
                this.text = text;
                this.__skipDimension = true;
                this.setOptions(options);
                this.__skipDimension = false;
                this._initDimensions();
                this.setCoords();
            },
            _initDimensions: function() {
                if (this.__skipDimension) return;
                var canvasEl = fabric.util.createCanvasElement();
                this._render(canvasEl.getContext("2d"));
            },
            toString: function() {
                return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
            },
            _render: function(ctx) {
                var isInPathGroup = this.group && this.group.type !== "group";
                if (isInPathGroup && !this.transformMatrix) {
                    ctx.translate(-this.group.width / 2 + this.left, -this.group.height / 2 + this.top);
                } else if (isInPathGroup && this.transformMatrix) {
                    ctx.translate(-this.group.width / 2, -this.group.height / 2);
                }
                if (typeof Cufon === "undefined" || this.useNative === true) {
                    this._renderViaNative(ctx);
                } else {
                    this._renderViaCufon(ctx);
                }
            },
            _renderViaNative: function(ctx) {
                this.transform(ctx, fabric.isLikelyNode);
                this._setTextStyles(ctx);
                var textLines = this.text.split(/\r?\n/);
                this.width = this._getTextWidth(ctx, textLines);
                this.height = this._getTextHeight(ctx, textLines);
                this.clipTo && fabric.util.clipContext(this, ctx);
                this._renderTextBackground(ctx, textLines);
                if (this.textAlign !== "left" && this.textAlign !== "justify") {
                    ctx.save();
                    ctx.translate(this.textAlign === "center" ? this.width / 2 : this.width, 0);
                }
                ctx.save();
                this._setTextShadow(ctx);
                this._renderTextFill(ctx, textLines);
                this._renderTextStroke(ctx, textLines);
                this.textShadow && ctx.restore();
                ctx.restore();
                if (this.textAlign !== "left" && this.textAlign !== "justify") {
                    ctx.restore();
                }
                this._renderTextDecoration(ctx, textLines);
                this.clipTo && ctx.restore();
                this._setBoundaries(ctx, textLines);
                this._totalLineHeight = 0;
            },
            _setBoundaries: function(ctx, textLines) {
                this._boundaries = [];
                for (var i = 0, len = textLines.length; i < len; i++) {
                    var lineWidth = this._getLineWidth(ctx, textLines[i]);
                    var lineLeftOffset = this._getLineLeftOffset(lineWidth);
                    this._boundaries.push({
                        height: this.fontSize * this.lineHeight,
                        width: lineWidth,
                        left: lineLeftOffset
                    });
                }
            },
            _setTextStyles: function(ctx) {
                if (this.fill) {
                    ctx.fillStyle = this.fill.toLive ? this.fill.toLive(ctx) : this.fill;
                }
                if (this.stroke) {
                    ctx.lineWidth = this.strokeWidth;
                    ctx.lineCap = this.strokeLineCap;
                    ctx.lineJoin = this.strokeLineJoin;
                    ctx.miterLimit = this.strokeMiterLimit;
                    ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx) : this.stroke;
                }
                ctx.textBaseline = "alphabetic";
                ctx.textAlign = this.textAlign;
                ctx.font = this._getFontDeclaration();
            },
            _getTextHeight: function(ctx, textLines) {
                return this.fontSize * textLines.length * this.lineHeight;
            },
            _getTextWidth: function(ctx, textLines) {
                var maxWidth = ctx.measureText(textLines[0]).width;
                for (var i = 1, len = textLines.length; i < len; i++) {
                    var currentLineWidth = ctx.measureText(textLines[i]).width;
                    if (currentLineWidth > maxWidth) {
                        maxWidth = currentLineWidth;
                    }
                }
                return maxWidth;
            },
            _setTextShadow: function(ctx) {
                if (!this.textShadow) return;
                var reOffsetsAndBlur = /\s+(-?\d+)(?:px)?\s+(-?\d+)(?:px)?\s+(\d+)(?:px)?\s*/;
                var shadowDeclaration = this.textShadow;
                var offsetsAndBlur = reOffsetsAndBlur.exec(this.textShadow);
                var shadowColor = shadowDeclaration.replace(reOffsetsAndBlur, "");
                ctx.save();
                ctx.shadowColor = shadowColor;
                ctx.shadowOffsetX = parseInt(offsetsAndBlur[1], 10);
                ctx.shadowOffsetY = parseInt(offsetsAndBlur[2], 10);
                ctx.shadowBlur = parseInt(offsetsAndBlur[3], 10);
                this._shadows = [ {
                    blur: ctx.shadowBlur,
                    color: ctx.shadowColor,
                    offX: ctx.shadowOffsetX,
                    offY: ctx.shadowOffsetY
                } ];
                this._shadowOffsets = [ [ parseInt(ctx.shadowOffsetX, 10), parseInt(ctx.shadowOffsetY, 10) ] ];
            },
            _drawChars: function(method, ctx, chars, left, top) {
                ctx[method](chars, left, top);
            },
            _drawTextLine: function(method, ctx, line, left, top, lineIndex) {
                if (this.textAlign !== "justify") {
                    this._drawChars(method, ctx, line, left, top, lineIndex);
                    return;
                }
                var lineWidth = ctx.measureText(line).width;
                var totalWidth = this.width;
                if (totalWidth > lineWidth) {
                    var words = line.split(/\s+/);
                    var wordsWidth = ctx.measureText(line.replace(/\s+/g, "")).width;
                    var widthDiff = totalWidth - wordsWidth;
                    var numSpaces = words.length - 1;
                    var spaceWidth = widthDiff / numSpaces;
                    var leftOffset = 0;
                    for (var i = 0, len = words.length; i < len; i++) {
                        this._drawChars(method, ctx, words[i], left + leftOffset, top, lineIndex);
                        leftOffset += ctx.measureText(words[i]).width + spaceWidth;
                    }
                } else {
                    this._drawChars(method, ctx, line, left, top, lineIndex);
                }
            },
            _getLeftOffset: function() {
                if (fabric.isLikelyNode && (this.originX === "left" || this.originX === "center")) {
                    return 0;
                }
                return -this.width / 2;
            },
            _getTopOffset: function() {
                if (fabric.isLikelyNode) {
                    if (this.originY === "center") {
                        return -this.height / 2;
                    } else if (this.originY === "bottom") {
                        return -this.height;
                    }
                    return 0;
                }
                return -this.height / 2;
            },
            _renderTextFill: function(ctx, textLines) {
                if (!this.fill && !this.skipFillStrokeCheck) return;
                this._boundaries = [];
                for (var i = 0, len = textLines.length; i < len; i++) {
                    this._drawTextLine("fillText", ctx, textLines[i], this._getLeftOffset(), this._getTopOffset() + i * this.fontSize * this.lineHeight + this.fontSize, i);
                }
            },
            _renderTextStroke: function(ctx, textLines) {
                if (!this.stroke && !this.skipFillStrokeCheck) return;
                ctx.save();
                if (this.strokeDashArray) {
                    if (1 & this.strokeDashArray.length) {
                        this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
                    }
                    supportsLineDash && ctx.setLineDash(this.strokeDashArray);
                }
                ctx.beginPath();
                for (var i = 0, len = textLines.length; i < len; i++) {
                    this._drawTextLine("strokeText", ctx, textLines[i], this._getLeftOffset(), this._getTopOffset() + i * this.fontSize * this.lineHeight + this.fontSize, i);
                }
                ctx.closePath();
                ctx.restore();
            },
            _renderTextBackground: function(ctx, textLines) {
                this._renderTextBoxBackground(ctx);
                this._renderTextLinesBackground(ctx, textLines);
            },
            _renderTextBoxBackground: function(ctx) {
                if (!this.backgroundColor) return;
                ctx.save();
                ctx.fillStyle = this.backgroundColor;
                ctx.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height);
                ctx.restore();
            },
            _renderTextLinesBackground: function(ctx, textLines) {
                if (!this.textBackgroundColor) return;
                ctx.save();
                ctx.fillStyle = this.textBackgroundColor;
                for (var i = 0, len = textLines.length; i < len; i++) {
                    if (textLines[i] !== "") {
                        var lineWidth = this._getLineWidth(ctx, textLines[i]);
                        var lineLeftOffset = this._getLineLeftOffset(lineWidth);
                        ctx.fillRect(this._getLeftOffset() + lineLeftOffset, this._getTopOffset() + i * this.fontSize * this.lineHeight, lineWidth, this.fontSize * this.lineHeight);
                    }
                }
                ctx.restore();
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
            _getLineWidth: function(ctx, line) {
                return this.textAlign === "justify" ? this.width : ctx.measureText(line).width;
            },
            _renderTextDecoration: function(ctx, textLines) {
                if (!this.textDecoration) return;
                var halfOfVerticalBox = this.originY === "top" ? 0 : this._getTextHeight(ctx, textLines) / 2;
                var _this = this;
                function renderLinesAtOffset(offset) {
                    for (var i = 0, len = textLines.length; i < len; i++) {
                        var lineWidth = _this._getLineWidth(ctx, textLines[i]);
                        var lineLeftOffset = _this._getLineLeftOffset(lineWidth);
                        ctx.fillRect(_this._getLeftOffset() + lineLeftOffset, offset + i * _this.fontSize * _this.lineHeight - halfOfVerticalBox, lineWidth, 1);
                    }
                }
                if (this.textDecoration.indexOf("underline") > -1) {
                    renderLinesAtOffset(this.fontSize);
                }
                if (this.textDecoration.indexOf("line-through") > -1) {
                    renderLinesAtOffset(this.fontSize / 2);
                }
                if (this.textDecoration.indexOf("overline") > -1) {
                    renderLinesAtOffset(0);
                }
            },
            _getFontDeclaration: function() {
                return [ fabric.isLikelyNode ? this.fontWeight : this.fontStyle, fabric.isLikelyNode ? this.fontStyle : this.fontWeight, this.fontSize + "px", fabric.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily ].join(" ");
            },
            render: function(ctx, noTransform) {
                if (!this.visible) return;
                ctx.save();
                this._render(ctx);
                if (!noTransform && this.active) {
                    this.drawBorders(ctx);
                    this.drawControls(ctx);
                }
                ctx.restore();
            },
            toObject: function(propertiesToInclude) {
                return extend(this.callSuper("toObject", propertiesToInclude), {
                    text: this.text,
                    fontSize: this.fontSize,
                    fontWeight: this.fontWeight,
                    fontFamily: this.fontFamily,
                    fontStyle: this.fontStyle,
                    lineHeight: this.lineHeight,
                    textDecoration: this.textDecoration,
                    textShadow: this.textShadow,
                    textAlign: this.textAlign,
                    path: this.path,
                    backgroundColor: this.backgroundColor,
                    textBackgroundColor: this.textBackgroundColor,
                    useNative: this.useNative
                });
            },
            toSVG: function() {
                var textLines = this.text.split(/\r?\n/), lineTopOffset = this.useNative ? this.fontSize * this.lineHeight : -this._fontAscent - this._fontAscent / 5 * this.lineHeight, textLeftOffset = -(this.width / 2), textTopOffset = this.useNative ? this.fontSize - 1 : this.height / 2 - textLines.length * this.fontSize - this._totalLineHeight, textAndBg = this._getSVGTextAndBg(lineTopOffset, textLeftOffset, textLines), shadowSpans = this._getSVGShadows(lineTopOffset, textLines);
                textTopOffset += this._fontAscent ? this._fontAscent / 5 * this.lineHeight : 0;
                return [ '<g transform="', this.getSvgTransform(), '">', textAndBg.textBgRects.join(""), "<text ", this.fontFamily ? "font-family=\"'" + this.fontFamily + "'\" " : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(), '" ', 'transform="translate(', toFixed(textLeftOffset, 2), " ", toFixed(textTopOffset, 2), ')">', shadowSpans.join(""), textAndBg.textSpans.join(""), "</text>", "</g>" ].join("");
            },
            _getSVGShadows: function(lineTopOffset, textLines) {
                var shadowSpans = [], j, i, jlen, ilen, lineTopOffsetMultiplier = 1;
                if (!this._shadows || !this._boundaries) {
                    return shadowSpans;
                }
                for (j = 0, jlen = this._shadows.length; j < jlen; j++) {
                    for (i = 0, ilen = textLines.length; i < ilen; i++) {
                        if (textLines[i] !== "") {
                            var lineLeftOffset = this._boundaries && this._boundaries[i] ? this._boundaries[i].left : 0;
                            shadowSpans.push('<tspan x="', toFixed(lineLeftOffset + lineTopOffsetMultiplier + this._shadowOffsets[j][0], 2), i === 0 || this.useNative ? '" y' : '" dy', '="', toFixed(this.useNative ? lineTopOffset * i - this.height / 2 + this._shadowOffsets[j][1] : lineTopOffset + (i === 0 ? this._shadowOffsets[j][1] : 0), 2), '" ', this._getFillAttributes(this._shadows[j].color), ">", fabric.util.string.escapeXml(textLines[i]), "</tspan>");
                            lineTopOffsetMultiplier = 1;
                        } else {
                            lineTopOffsetMultiplier++;
                        }
                    }
                }
                return shadowSpans;
            },
            _getSVGTextAndBg: function(lineTopOffset, textLeftOffset, textLines) {
                var textSpans = [], textBgRects = [], i, lineLeftOffset, len, lineTopOffsetMultiplier = 1;
                if (this.backgroundColor && this._boundaries) {
                    textBgRects.push("<rect ", this._getFillAttributes(this.backgroundColor), ' x="', toFixed(-this.width / 2, 2), '" y="', toFixed(-this.height / 2, 2), '" width="', toFixed(this.width, 2), '" height="', toFixed(this.height, 2), '"></rect>');
                }
                for (i = 0, len = textLines.length; i < len; i++) {
                    if (textLines[i] !== "") {
                        lineLeftOffset = this._boundaries && this._boundaries[i] ? toFixed(this._boundaries[i].left, 2) : 0;
                        textSpans.push('<tspan x="', lineLeftOffset, '" ', i === 0 || this.useNative ? "y" : "dy", '="', toFixed(this.useNative ? lineTopOffset * i - this.height / 2 : lineTopOffset * lineTopOffsetMultiplier, 2), '" ', this._getFillAttributes(this.fill), ">", fabric.util.string.escapeXml(textLines[i]), "</tspan>");
                        lineTopOffsetMultiplier = 1;
                    } else {
                        lineTopOffsetMultiplier++;
                    }
                    if (!this.textBackgroundColor || !this._boundaries) continue;
                    textBgRects.push("<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', toFixed(textLeftOffset + this._boundaries[i].left, 2), '" y="', toFixed(lineTopOffset * i - this.height / 2, 2), '" width="', toFixed(this._boundaries[i].width, 2), '" height="', toFixed(this._boundaries[i].height, 2), '"></rect>');
                }
                return {
                    textSpans: textSpans,
                    textBgRects: textBgRects
                };
            },
            _getFillAttributes: function(value) {
                var fillColor = value && typeof value === "string" ? new fabric.Color(value) : "";
                if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
                    return 'fill="' + value + '"';
                }
                return 'opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
            },
            setColor: function(value) {
                this.set("fill", value);
                return this;
            },
            getText: function() {
                return this.text;
            },
            _set: function(name, value) {
                if (name === "fontFamily" && this.path) {
                    this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, "$1" + value + "$3");
                }
                this.callSuper("_set", name, value);
                if (name in this._dimensionAffectingProps) {
                    this._initDimensions();
                    this.setCoords();
                }
            },
            complexity: function() {
                return 1;
            }
        });
        fabric.Text.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y font-family font-style font-weight font-size text-decoration".split(" "));
        fabric.Text.fromElement = function(element, options) {
            if (!element) {
                return null;
            }
            var parsedAttributes = fabric.parseAttributes(element, fabric.Text.ATTRIBUTE_NAMES);
            options = fabric.util.object.extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes);
            var text = new fabric.Text(element.textContent, options);
            text.set({
                left: text.getLeft() + text.getWidth() / 2,
                top: text.getTop() - text.getHeight() / 2
            });
            return text;
        };
        fabric.Text.fromObject = function(object) {
            return new fabric.Text(object.text, clone(object));
        };
        fabric.util.createAccessors(fabric.Text);
    })(typeof exports !== "undefined" ? exports : this);
    fabric.util.object.extend(fabric.Text.prototype, {
        _renderViaCufon: function(ctx) {
            var o = Cufon.textOptions || (Cufon.textOptions = {});
            o.left = this.left;
            o.top = this.top;
            o.context = ctx;
            o.color = this.fill;
            var el = this._initDummyElementForCufon();
            this.transform(ctx);
            Cufon.replaceElement(el, {
                engine: "canvas",
                separate: "none",
                fontFamily: this.fontFamily,
                fontWeight: this.fontWeight,
                textDecoration: this.textDecoration,
                textShadow: this.textShadow,
                textAlign: this.textAlign,
                fontStyle: this.fontStyle,
                lineHeight: this.lineHeight,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
                backgroundColor: this.backgroundColor,
                textBackgroundColor: this.textBackgroundColor
            });
            this.width = o.width;
            this.height = o.height;
            this._totalLineHeight = o.totalLineHeight;
            this._fontAscent = o.fontAscent;
            this._boundaries = o.boundaries;
            this._shadowOffsets = o.shadowOffsets;
            this._shadows = o.shadows || [];
            el = null;
            this.setCoords();
        },
        _initDummyElementForCufon: function() {
            var el = fabric.document.createElement("pre"), container = fabric.document.createElement("div");
            container.appendChild(el);
            if (typeof G_vmlCanvasManager === "undefined") {
                el.innerHTML = this.text;
            } else {
                el.innerText = this.text.replace(/\r?\n/gi, "\r");
            }
            el.style.fontSize = this.fontSize + "px";
            el.style.letterSpacing = "normal";
            return el;
        }
    });
    (function() {
        if (typeof document !== "undefined" && typeof window !== "undefined") {
            return;
        }
        var DOMParser = new require("xmldom").DOMParser, URL = require("url"), HTTP = require("http"), HTTPS = require("https"), Canvas = require("canvas"), Image = require("canvas").Image;
        function request(url, encoding, callback) {
            var oURL = URL.parse(url);
            if (!oURL.port) {
                oURL.port = oURL.protocol.indexOf("https:") === 0 ? 443 : 80;
            }
            var reqHandler = oURL.port === 443 ? HTTPS : HTTP;
            var req = reqHandler.request({
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
            });
            req.end();
        }
        function request_fs(url, callback) {
            var fs = require("fs"), stream = fs.createReadStream(url), body = "";
            stream.on("data", function(chunk) {
                body += chunk;
            });
            stream.on("end", function() {
                callback(body);
            });
        }
        fabric.util.loadImage = function(url, callback, context) {
            var createImageAndCallBack = function(data) {
                img.src = new Buffer(data, "binary");
                img._src = url;
                callback && callback.call(context, img);
            };
            var img = new Image();
            if (url && (url instanceof Buffer || url.indexOf("data") === 0)) {
                img.src = img._src = url;
                callback && callback.call(context, img);
            } else if (url && url.indexOf("http") !== 0) {
                request_fs(url, createImageAndCallBack);
            } else if (url) {
                request(url, "binary", createImageAndCallBack);
            }
        };
        fabric.loadSVGFromURL = function(url, callback, reviver) {
            url = url.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim();
            if (url.indexOf("http") !== 0) {
                request_fs(url, function(body) {
                    fabric.loadSVGFromString(body, callback, reviver);
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
        fabric.Image.fromObject = function(object, callback) {
            fabric.util.loadImage(object.src, function(img) {
                var oImg = new fabric.Image(img);
                oImg._initConfig(object);
                oImg._initFilters(object, function(filters) {
                    oImg.filters = filters || [];
                    callback && callback(oImg);
                });
            });
        };
        fabric.createCanvasForNode = function(width, height) {
            var canvasEl = fabric.document.createElement("canvas"), nodeCanvas = new Canvas(width || 600, height || 600);
            canvasEl.style = {};
            canvasEl.width = nodeCanvas.width;
            canvasEl.height = nodeCanvas.height;
            var FabricCanvas = fabric.Canvas || fabric.StaticCanvas;
            var fabricCanvas = new FabricCanvas(canvasEl);
            fabricCanvas.contextContainer = nodeCanvas.getContext("2d");
            fabricCanvas.nodeCanvas = nodeCanvas;
            fabricCanvas.Font = Canvas.Font;
            return fabricCanvas;
        };
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
})(window);