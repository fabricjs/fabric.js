/*!
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 */

var Cufon = (function() {

  /** @ignore */
  var api = function() {
    return api.replace.apply(null, arguments);
  };

  /** @ignore */
  var DOM = api.DOM = {

    ready: (function() {

      var complete = false, readyStatus = { loaded: 1, complete: 1 };

      var queue = [], /** @ignore */ perform = function() {
        if (complete) return;
        complete = true;
        for (var fn; fn = queue.shift(); fn());
      };

      // Gecko, Opera, WebKit r26101+

      if (fabric.document.addEventListener) {
        fabric.document.addEventListener('DOMContentLoaded', perform, false);
        fabric.window.addEventListener('pageshow', perform, false); // For cached Gecko pages
      }

      // Old WebKit, Internet Explorer

      if (!fabric.window.opera && fabric.document.readyState) (function() {
        readyStatus[fabric.document.readyState] ? perform() : setTimeout(arguments.callee, 10);
      })();

      // Internet Explorer

      if (fabric.document.readyState && fabric.document.createStyleSheet) (function() {
        try {
          fabric.document.body.doScroll('left');
          perform();
        }
        catch (e) {
          setTimeout(arguments.callee, 1);
        }
      })();

      addEvent(fabric.window, 'load', perform); // Fallback

      return function(listener) {
        if (!arguments.length) perform();
        else complete ? listener() : queue.push(listener);
      };

    })()

  };

  /** @ignore */
  var CSS = api.CSS = /** @ignore */ {

    /** @ignore */
    Size: function(value, base) {

      this.value = parseFloat(value);
      this.unit = String(value).match(/[a-z%]*$/)[0] || 'px';

      /** @ignore */
      this.convert = function(value) {
        return value / base * this.value;
      };

      /** @ignore */
      this.convertFrom = function(value) {
        return value / this.value * base;
      };

      /** @ignore */
      this.toString = function() {
        return this.value + this.unit;
      };

    },

    /** @ignore */
    getStyle: function(el) {
      return new Style(el.style);
      /*
      var view = document.defaultView;
      if (view && view.getComputedStyle) return new Style(view.getComputedStyle(el, null));
      if (el.currentStyle) return new Style(el.currentStyle);
      return new Style(el.style);
      */
    },

    quotedList: cached(function(value) {
      // doesn't work properly with empty quoted strings (""), but
      // it's not worth the extra code.
      var list = [], re = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g, match;
      while (match = re.exec(value)) list.push(match[3] || match[1]);
      return list;
    }),

    ready: (function() {

      var complete = false;

      var queue = [], perform = function() {
        complete = true;
        for (var fn; fn = queue.shift(); fn());
      };

      // Safari 2 does not include <style> elements in document.styleSheets.
      // Safari 2 also does not support Object.prototype.propertyIsEnumerable.

      var styleElements = Object.prototype.propertyIsEnumerable ? elementsByTagName('style') : { length: 0 };
      var linkElements = elementsByTagName('link');

      DOM.ready(function() {
        // These checks are actually only needed for WebKit-based browsers, but don't really hurt other browsers.
        var linkStyles = 0, link;
        for (var i = 0, l = linkElements.length; link = linkElements[i], i < l; ++i) {
          // WebKit does not load alternate stylesheets.
          if (!link.disabled && link.rel.toLowerCase() == 'stylesheet') ++linkStyles;
        }
        if (fabric.document.styleSheets.length >= styleElements.length + linkStyles) perform();
        else setTimeout(arguments.callee, 10);
      });

      return function(listener) {
        if (complete) listener();
        else queue.push(listener);
      };

    })(),

    /** @ignore */
    supports: function(property, value) {
      var checker = fabric.document.createElement('span').style;
      if (checker[property] === undefined) return false;
      checker[property] = value;
      return checker[property] === value;
    },

    /** @ignore */
    textAlign: function(word, style, position, wordCount) {
      if (style.get('textAlign') == 'right') {
        if (position > 0) word = ' ' + word;
      }
      else if (position < wordCount - 1) word += ' ';
      return word;
    },

    /** @ignore */
    textDecoration: function(el, style) {
      if (!style) style = this.getStyle(el);
      var types = {
        underline: null,
        overline: null,
        'line-through': null
      };
      for (var search = el; search.parentNode && search.parentNode.nodeType == 1; ) {
        var foundAll = true;
        for (var type in types) {
          if (types[type]) continue;
          if (style.get('textDecoration').indexOf(type) != -1) types[type] = style.get('color');
          foundAll = false;
        }
        if (foundAll) break; // this is rather unlikely to happen
        style = this.getStyle(search = search.parentNode);
      }
      return types;
    },

    textShadow: cached(function(value) {
      if (value == 'none') return null;
      var shadows = [], currentShadow = {}, result, offCount = 0;
      var re = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
      while (result = re.exec(value)) {
        if (result[0] == ',') {
          shadows.push(currentShadow);
          currentShadow = {}, offCount = 0;
        }
        else if (result[1]) {
          currentShadow.color = result[1];
        }
        else {
          currentShadow[[ 'offX', 'offY', 'blur' ][offCount++]] = result[2];
        }
      }
      shadows.push(currentShadow);
      return shadows;
    }),

    color: cached(function(value) {
      var parsed = {};
      parsed.color = value.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function($0, $1, $2) {
        parsed.opacity = parseFloat($2);
        return 'rgb(' + $1 + ')';
      });
      return parsed;
    }),

    /** @ignore */
    textTransform: function(text, style) {
      return text[{
        uppercase: 'toUpperCase',
        lowercase: 'toLowerCase'
      }[style.get('textTransform')] || 'toString']();
    }

  };

  function Font(data) {

    var face = this.face = data.face;
    this.glyphs = data.glyphs;
    this.w = data.w;
    this.baseSize = parseInt(face['units-per-em'], 10);

    this.family = face['font-family'].toLowerCase();
    this.weight = face['font-weight'];
    this.style = face['font-style'] || 'normal';

    this.viewBox = (function () {
      var parts = face.bbox.split(/\s+/);
      var box = {
        minX: parseInt(parts[0], 10),
        minY: parseInt(parts[1], 10),
        maxX: parseInt(parts[2], 10),
        maxY: parseInt(parts[3], 10)
      };
      box.width = box.maxX - box.minX,
      box.height = box.maxY - box.minY;
      /** @ignore */
      box.toString = function() {
        return [ this.minX, this.minY, this.width, this.height ].join(' ');
      };
      return box;
    })();

    this.ascent = -parseInt(face.ascent, 10);
    this.descent = -parseInt(face.descent, 10);

    this.height = -this.ascent + this.descent;

  }

  function FontFamily() {

    var styles = {}, mapping = {
      oblique: 'italic',
      italic: 'oblique'
    };

    this.add = function(font) {
      (styles[font.style] || (styles[font.style] = {}))[font.weight] = font;
    };

    /** @ignore */
    this.get = function(style, weight) {
      var weights = styles[style] || styles[mapping[style]]
        || styles.normal || styles.italic || styles.oblique;
      if (!weights) return null;
      // we don't have to worry about "bolder" and "lighter"
      // because IE's currentStyle returns a numeric value for it,
      // and other browsers use the computed value anyway
      weight = {
        normal: 400,
        bold: 700
      }[weight] || parseInt(weight, 10);
      if (weights[weight]) return weights[weight];
      // http://www.w3.org/TR/CSS21/fonts.html#propdef-font-weight
      // Gecko uses x99/x01 for lighter/bolder
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
        return (up
          ? (a > weight && b > weight) ? a < b : a > b
          : (a < weight && b < weight) ? a > b : a < b) ? -1 : 1;
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
      // A timeout is needed so that the event can actually "happen"
      // before replace is triggered. This ensures that styles are up
      // to date.
      setTimeout(function() {
        api.replace(el, sharedStorage.get(el).options, true);
      }, 10);
    }

    this.attach = function(el) {
      if (el.onmouseenter === undefined) {
        addEvent(el, 'mouseover', onOverOut);
        addEvent(el, 'mouseout', onOverOut);
      }
      else {
        addEvent(el, 'mouseenter', onEnterLeave);
        addEvent(el, 'mouseleave', onEnterLeave);
      }
    };

  }

  function Storage() {

    var map = {}, at = 0;

    function identify(el) {
      return el.cufid || (el.cufid = ++at);
    }

    /** @ignore */
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
    }
    else if (el.attachEvent) {
      el.attachEvent('on' + type, function() {
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
    var families = CSS.quotedList(style.get('fontFamily').toLowerCase()), family;
    for (var i = 0, l = families.length; i < l; ++i) {
      family = families[i];
      if (fonts[family]) return fonts[family].get(style.get('fontStyle'), style.get('fontWeight'));
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
    if (separate == 'none') return engines[options.engine].apply(null, arguments);
    var fragment = fabric.document.createDocumentFragment(), processed;
    var parts = text.split(separators[separate]), needsAligning = (separate == 'words');
    if (needsAligning && HAS_BROKEN_REGEXP) {
      // @todo figure out a better way to do this
      if (/^\s/.test(text)) parts.unshift('');
      if (/\s$/.test(text)) parts.push('');
    }
    for (var i = 0, l = parts.length; i < l; ++i) {
      processed = engines[options.engine](font,
        needsAligning ? CSS.textAlign(parts[i], style, i, l) : parts[i],
        style, options, node, el, i < l - 1);
      if (processed) fragment.appendChild(processed);
    }
    return fragment;
  }

  /** @ignore */
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
        }
        else redraw = true;
      }
      if (!style) style = CSS.getStyle(el).extend(options);
      if (!font) font = getFont(el, style);

      if (!font) continue;
      if (redraw) {
        engines[options.engine](font, null, style, options, node, el);
        continue;
      }
      var text = node.data;
      //for some reason, the carriage return is not stripped by IE but "\n" is, so let's keep \r as a new line marker...
      if (typeof G_vmlCanvasManager != 'undefined') {
          text = text.replace(/\r/g, "\n");
      }
      if (text === '') continue;
      var processed = process(font, text, style, options, node, el);
      if (processed) node.parentNode.replaceChild(processed, node);
      else node.parentNode.removeChild(node);
    }
  }

  var HAS_BROKEN_REGEXP = ' '.split(/\s+/).length == 0;

  var sharedStorage = new Storage();
  var hoverHandler = new HoverHandler();
  var replaceHistory = [];

  var engines = {}, fonts = {}, defaultOptions = {
    engine: null,
    //fontScale: 1,
    //fontScaling: false,
    hover: false,
    hoverables: {
      a: true
    },
    printable: true,
    //rotation: 0,
    //selectable: false,
    selector: (
        fabric.window.Sizzle
      ||  (fabric.window.jQuery && function(query) { return jQuery(query); }) // avoid noConflict issues
      ||  (fabric.window.dojo && dojo.query)
      ||  (fabric.window.$$ && function(query) { return $$(query); })
      ||  (fabric.window.$ && function(query) { return $(query); })
      ||  (fabric.document.querySelectorAll && function(query) { return fabric.document.querySelectorAll(query); })
      ||  elementsByTagName
    ),
    separate: 'words', // 'none' and 'characters' are also accepted
    textShadow: 'none'
  };

  var separators = {
    words: /\s+/,
    characters: ''
  };

  /** @ignore */
  api.now = function() {
    DOM.ready();
    return api;
  };

  /** @ignore */
  api.refresh = function() {
    var currentHistory = replaceHistory.splice(0, replaceHistory.length);
    for (var i = 0, l = currentHistory.length; i < l; ++i) {
      api.replace.apply(null, currentHistory[i]);
    }
    return api;
  };

  /** @ignore */
  api.registerEngine = function(id, engine) {
    if (!engine) return api;
    engines[id] = engine;
    return api.set('engine', id);
  };

  /** @ignore */
  api.registerFont = function(data) {
    var font = new Font(data), family = font.family;
    if (!fonts[family]) fonts[family] = new FontFamily();
    fonts[family].add(font);
    return api.set('fontFamily', '"' + family + '"');
  };

  /** @ignore */
  api.replace = function(elements, options, ignoreHistory) {
    options = merge(defaultOptions, options);
    if (!options.engine) return api; // there's no browser support so we'll just stop here
    if (typeof options.textShadow == 'string' && options.textShadow)
      options.textShadow = CSS.textShadow(options.textShadow);
    if (!ignoreHistory) replaceHistory.push(arguments);
    if (elements.nodeType || typeof elements == 'string') elements = [ elements ];
    CSS.ready(function() {
      for (var i = 0, l = elements.length; i < l; ++i) {
        var el = elements[i];
        if (typeof el == 'string') api.replace(options.selector(el), options, true);
        else replaceElement(el, options);
      }
    });
    return api;
  };

  /** @ignore */
  api.replaceElement = function(el, options) {
    options = merge(defaultOptions, options);
    if (typeof options.textShadow == 'string' && options.textShadow)
      options.textShadow = CSS.textShadow(options.textShadow);
    return replaceElement(el, options);
  };

  api.engines = engines;
  api.fonts = fonts;
  /** @ignore */
  api.getOptions = function() {
    return merge(defaultOptions);
  };

  /** @ignore */
  api.set = function(option, value) {
    defaultOptions[option] = value;
    return api;
  };

  return api;

})();

Cufon.registerEngine('canvas', (function() {

  // Safari 2 doesn't support .apply() on native methods
  var HAS_INLINE_BLOCK = Cufon.CSS.supports('display', 'inline-block');

  // Firefox 2 w/ non-strict doctype (almost standards mode)
  var HAS_BROKEN_LINEHEIGHT = !HAS_INLINE_BLOCK && (fabric.document.compatMode == 'BackCompat' || /frameset|transitional/i.test(fabric.document.doctype.publicId));

  var styleSheet = fabric.document.createElement('style');
  styleSheet.type = 'text/css';

    var textNode = fabric.document.createTextNode(
        '.cufon-canvas{text-indent:0}' +
        '@media screen,projection{' +
          '.cufon-canvas{display:inline;display:inline-block;position:relative;vertical-align:middle' +
          (HAS_BROKEN_LINEHEIGHT
            ? ''
            : ';font-size:1px;line-height:1px') +
          '}.cufon-canvas .cufon-alt{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden}' +
          (HAS_INLINE_BLOCK
            ? '.cufon-canvas canvas{position:relative}'
            : '.cufon-canvas canvas{position:absolute}') +
        '}' +
        '@media print{' +
          '.cufon-canvas{padding:0 !important}' +
          '.cufon-canvas canvas{display:none}' +
          '.cufon-canvas .cufon-alt{display:inline}' +
        '}'
      )

  try {
      styleSheet.appendChild(textNode);
  } catch(e) {
      //IE8- can't do this...
      styleSheet.setAttribute("type", "text/css");
      styleSheet.styleSheet.cssText = textNode.data;
  }
  fabric.document.getElementsByTagName('head')[0].appendChild(styleSheet);

  function generateFromVML(path, context) {
    var atX = 0, atY = 0;
    var code = [], re = /([mrvxe])([^a-z]*)/g, match;
    generate: for (var i = 0; match = re.exec(path); ++i) {
      var c = match[2].split(',');
      switch (match[1]) {
        case 'v':
          code[i] = { m: 'bezierCurveTo', a: [ atX + ~~c[0], atY + ~~c[1], atX + ~~c[2], atY + ~~c[3], atX += ~~c[4], atY += ~~c[5] ] };
          break;
        case 'r':
          code[i] = { m: 'lineTo', a: [ atX += ~~c[0], atY += ~~c[1] ] };
          break;
        case 'm':
          code[i] = { m: 'moveTo', a: [ atX = ~~c[0], atY = ~~c[1] ] };
          break;
        case 'x':
          code[i] = { m: 'closePath', a: [] };
          break;
        case 'e':
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

    var redraw = (text === null);

    var viewBox = font.viewBox;

    var size = style.getSize('fontSize', font.baseSize);

    var letterSpacing = style.get('letterSpacing');
    letterSpacing = (letterSpacing == 'normal') ? 0 : size.convertFrom(parseInt(letterSpacing, 10));

    var expandTop = 0, expandRight = 0, expandBottom = 0, expandLeft = 0;
    var shadows = options.textShadow, shadowOffsets = [];

    Cufon.textOptions.shadowOffsets = [ ];
    Cufon.textOptions.shadows = null;

    if (shadows) {
      Cufon.textOptions.shadows = shadows;
      for (var i = 0, l = shadows.length; i < l; ++i) {
        var shadow = shadows[i];
        var x = size.convertFrom(parseFloat(shadow.offX));
        var y = size.convertFrom(parseFloat(shadow.offY));
        shadowOffsets[i] = [ x, y ];
        //if (y < expandTop) expandTop = y;
        //if (x > expandRight) expandRight = x;
        //if (y > expandBottom) expandBottom = y;
        //if (x < expandLeft) expandLeft = x;
      }
    }

    var chars = Cufon.CSS.textTransform(redraw ? node.alt : text, style).split('');

    var width = 0, lastWidth = null;

    var maxWidth = 0, lines = 1, lineWidths = [ ];
    for (var i = 0, l = chars.length; i < l; ++i) {
      if (chars[i] === '\n') {
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

    var lineOffsets = [ ];
    for (var i = lineWidths.length; i--; ) {
      lineOffsets[i] = width - lineWidths[i];
    }

    if (lastWidth === null) return null; // there's nothing to render

    expandRight += (viewBox.width - lastWidth);
    expandLeft += viewBox.minX;

    var wrapper, canvas;

    if (redraw) {
      wrapper = node;
      canvas = node.firstChild;
    }
    else {
      wrapper = fabric.document.createElement('span');
      wrapper.className = 'cufon cufon-canvas';
      wrapper.alt = text;

      canvas = fabric.document.createElement('canvas');
      wrapper.appendChild(canvas);

      if (options.printable) {
        var print = fabric.document.createElement('span');
        print.className = 'cufon-alt';
        print.appendChild(fabric.document.createTextNode(text));
        wrapper.appendChild(print);
      }
    }

    var wStyle = wrapper.style;
    var cStyle = canvas.style || { };

    var height = size.convert(viewBox.height - expandTop + expandBottom);
    var roundedHeight = Math.ceil(height);
    var roundingFactor = roundedHeight / height;

    canvas.width = Math.ceil(size.convert(width + expandRight - expandLeft) * roundingFactor);
    canvas.height = roundedHeight;

    expandTop += viewBox.minY;

    cStyle.top = Math.round(size.convert(expandTop - font.ascent)) + 'px';
    cStyle.left = Math.round(size.convert(expandLeft)) + 'px';

    var _width = Math.ceil(size.convert(width * roundingFactor));
    var wrapperWidth = _width + 'px';
    var _height = size.convert(font.height);
    var totalLineHeight = (options.lineHeight - 1) * size.convert(-font.ascent / 5) * (lines - 1);

    Cufon.textOptions.width = _width;
    Cufon.textOptions.height = (_height * lines) + totalLineHeight;
    Cufon.textOptions.lines = lines;
    Cufon.textOptions.totalLineHeight = totalLineHeight;

    if (HAS_INLINE_BLOCK) {
      wStyle.width = wrapperWidth;
      wStyle.height = _height + 'px';
    }
    else {
      wStyle.paddingLeft = wrapperWidth;
      wStyle.paddingBottom = (_height - 1) + 'px';
    }

    var g = Cufon.textOptions.context || canvas.getContext('2d'),
        scale = roundedHeight / viewBox.height;

    Cufon.textOptions.fontAscent = font.ascent * scale;
    Cufon.textOptions.boundaries = null;

    for (var offsets = Cufon.textOptions.shadowOffsets, i = shadowOffsets.length; i--; ) {
      offsets[i] = [ shadowOffsets[i][0] * scale, shadowOffsets[i][1] * scale ];
    }

    g.save();
    g.scale(scale, scale);

    g.translate(
      // we're at the center of an object and need to jump to the top left corner
      // where first character is to be drawn
      -expandLeft - ((1/scale * canvas.width) / 2) + (Cufon.fonts[font.family].offsetLeft || 0),
      -expandTop - ((Cufon.textOptions.height / scale) / 2) + (Cufon.fonts[font.family].offsetTop || 0)
    );

    g.lineWidth = font.face['underline-thickness'];

    g.save();

    function line(y, color) {
      g.strokeStyle = color;

      g.beginPath();

      g.moveTo(0, y);
      g.lineTo(width, y);

      g.stroke();
    }

    var textDecoration = Cufon.getTextDecoration(options),
        isItalic = options.fontStyle === 'italic';

    function renderBackground() {
      g.save();

      var left = 0, lineNum = 0, boundaries = [{ left: 0 }];

      if (options.backgroundColor) {
        g.save();
        g.fillStyle = options.backgroundColor;
        g.translate(0, font.ascent);
        g.fillRect(0, 0, width + 10, (-font.ascent + font.descent) * lines);
        g.restore();
      }

      if (options.textAlign === 'right') {
        g.translate(lineOffsets[lineNum], 0);
        boundaries[0].left = lineOffsets[lineNum] * scale;
      }
      else if (options.textAlign === 'center') {
        g.translate(lineOffsets[lineNum] / 2, 0);
        boundaries[0].left = lineOffsets[lineNum] / 2 * scale;
      }

      for (var i = 0, l = chars.length; i < l; ++i) {
        if (chars[i] === '\n') {

          lineNum++;

          var topOffset = -font.ascent - ((font.ascent / 5) * options.lineHeight);
          var boundary = boundaries[boundaries.length - 1];
          var nextBoundary = { left: 0 };

          boundary.width = left * scale;
          boundary.height = (-font.ascent + font.descent) * scale;

          if (options.textAlign === 'right') {
            g.translate(-width, topOffset);
            g.translate(lineOffsets[lineNum], 0);
            nextBoundary.left = lineOffsets[lineNum] * scale;
          }
          else if (options.textAlign === 'center') {
            // offset to the start of text in previous line AND half of its offset
            // (essentially moving caret to the left edge of bounding box)
            g.translate(-left - (lineOffsets[lineNum - 1] / 2), topOffset);
            g.translate(lineOffsets[lineNum] / 2, 0);
            nextBoundary.left = lineOffsets[lineNum] / 2 * scale;
          }
          else {
            g.translate(-left, topOffset);
          }

          /* push next boundary (for the next line) */
          boundaries.push(nextBoundary);

          left = 0;

          continue;
        }
        var glyph = font.glyphs[chars[i]] || font.missingGlyph;
        if (!glyph) continue;

        var charWidth = Number(glyph.w || font.w) + letterSpacing;

        // only draw text-background when there's some kind of value
        if (options.textBackgroundColor) {
          g.save();
          g.fillStyle = options.textBackgroundColor;
          g.translate(0, font.ascent);
          g.fillRect(0, 0, charWidth + 10, -font.ascent + font.descent);
          g.restore();
        }

        g.translate(charWidth, 0);
        left += charWidth;

        if (i == l-1) {
          boundaries[boundaries.length - 1].width = left * scale;
          boundaries[boundaries.length - 1].height = (-font.ascent + font.descent) * scale;
        }
      }
      g.restore();

      Cufon.textOptions.boundaries = boundaries;
    }

    function renderText(color) {
      g.fillStyle = color || Cufon.textOptions.color || style.get('color');

      var left = 0, lineNum = 0;

      if (options.textAlign === 'right') {
        g.translate(lineOffsets[lineNum], 0);
      }
      else if (options.textAlign === 'center') {
        g.translate(lineOffsets[lineNum] / 2, 0);
      }

      for (var i = 0, l = chars.length; i < l; ++i) {
        if (chars[i] === '\n') {

          lineNum++;

          var topOffset = -font.ascent - ((font.ascent / 5) * options.lineHeight);

          if (options.textAlign === 'right') {
            g.translate(-width, topOffset);
            g.translate(lineOffsets[lineNum], 0);
          }
          else if (options.textAlign === 'center') {
            // offset to the start of text in previous line AND half of its offset
            // (essentially moving caret to the left edge of bounding box)
            g.translate(-left - (lineOffsets[lineNum - 1] / 2), topOffset);
            g.translate(lineOffsets[lineNum] / 2, 0);
          }
          else {
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

          // add 2x more thickness — closer to SVG rendering
          g.lineWidth += g.lineWidth;

          g.beginPath();
          if (textDecoration.underline) {
            g.moveTo(0, -font.face['underline-position'] + 0.5);
            g.lineTo(charWidth, -font.face['underline-position'] + 0.5);
          }
          if (textDecoration.overline) {
            g.moveTo(0, font.ascent + 0.5);
            g.lineTo(charWidth, font.ascent + 0.5);
          }
          if (textDecoration['line-through']) {
            g.moveTo(0, -font.descent + 0.5);
            g.lineTo(charWidth, -font.descent + 0.5);
          }
          g.stroke();
          g.restore();
        }

        if (isItalic) {
          g.save();
          g.transform(1, 0, -0.25, 1, 0, 0);
        }

        g.beginPath();
        if (glyph.d) {
          if (glyph.code) interpret(glyph.code, g);
          else glyph.code = generateFromVML('m' + glyph.d, g);
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

})());

Cufon.registerEngine('vml', (function() {

  if (!fabric.document.namespaces) return;

  var canvasEl = fabric.document.createElement('canvas');
  if (canvasEl && canvasEl.getContext && canvasEl.getContext.apply) return;

  if (fabric.document.namespaces.cvml == null) {
    fabric.document.namespaces.add('cvml', 'urn:schemas-microsoft-com:vml');
  }

  var check = fabric.document.createElement('cvml:shape');
  check.style.behavior = 'url(#default#VML)';
  if (!check.coordsize) return; // VML isn't supported
  check = null;

  fabric.document.write('<style type="text/css">' +
    '.cufon-vml-canvas{text-indent:0}' +
    '@media screen{' +
      'cvml\\:shape,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute}' +
      '.cufon-vml-canvas{position:absolute;text-align:left}' +
      '.cufon-vml{display:inline-block;position:relative;vertical-align:middle}' +
      '.cufon-vml .cufon-alt{position:absolute;left:-10000in;font-size:1px}' +
      'a .cufon-vml{cursor:pointer}' +
    '}' +
    '@media print{' +
      '.cufon-vml *{display:none}' +
      '.cufon-vml .cufon-alt{display:inline}' +
    '}' +
  '</style>');

  function getFontSizeInPixels(el, value) {
    return getSizeInPixels(el, /(?:em|ex|%)$/i.test(value) ? '1em' : value);
  }

  // Original by Dead Edwards.
  // Combined with getFontSizeInPixels it also works with relative units.
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
    var redraw = (text === null);

    if (redraw) text = node.alt;

    // @todo word-spacing, text-decoration

    var viewBox = font.viewBox;

    var size = style.computedFontSize ||
      (style.computedFontSize = new Cufon.CSS.Size(getFontSizeInPixels(el, style.get('fontSize')) + 'px', font.baseSize));

    var letterSpacing = style.computedLSpacing;

    if (letterSpacing == undefined) {
      letterSpacing = style.get('letterSpacing');
      style.computedLSpacing = letterSpacing =
        (letterSpacing == 'normal') ? 0 : ~~size.convertFrom(getSizeInPixels(el, letterSpacing));
    }

    var wrapper, canvas;

    if (redraw) {
      wrapper = node;
      canvas = node.firstChild;
    }
    else {
      wrapper = fabric.document.createElement('span');
      wrapper.className = 'cufon cufon-vml';
      wrapper.alt = text;

      canvas = fabric.document.createElement('span');
      canvas.className = 'cufon-vml-canvas';
      wrapper.appendChild(canvas);

      if (options.printable) {
        var print = fabric.document.createElement('span');
        print.className = 'cufon-alt';
        print.appendChild(fabric.document.createTextNode(text));
        wrapper.appendChild(print);
      }

      // ie6, for some reason, has trouble rendering the last VML element in the document.
      // we can work around this by injecting a dummy element where needed.
      // @todo find a better solution
      if (!hasNext) wrapper.appendChild(fabric.document.createElement('cvml:shape'));
    }

    var wStyle = wrapper.style;
    var cStyle = canvas.style;

    var height = size.convert(viewBox.height), roundedHeight = Math.ceil(height);
    var roundingFactor = roundedHeight / height;
    var minX = viewBox.minX, minY = viewBox.minY;

    cStyle.height = roundedHeight;
    cStyle.top = Math.round(size.convert(minY - font.ascent));
    cStyle.left = Math.round(size.convert(minX));

    wStyle.height = size.convert(font.height) + 'px';

    var textDecoration = Cufon.getTextDecoration(options);

    var color = style.get('color');

    var chars = Cufon.CSS.textTransform(text, style).split('');

    var width = 0, offsetX = 0, advance = null;

    var glyph, shape, shadows = options.textShadow;

    // pre-calculate width
    for (var i = 0, k = 0, l = chars.length; i < l; ++i) {
      glyph = font.glyphs[chars[i]] || font.missingGlyph;
      if (glyph) width += advance = ~~(glyph.w || font.w) + letterSpacing;
    }

    if (advance === null) return null;

    var fullWidth = -minX + width + (viewBox.width - advance);

    var shapeWidth = size.convert(fullWidth * roundingFactor), roundedShapeWidth = Math.round(shapeWidth);

    var coordSize = fullWidth + ',' + viewBox.height, coordOrigin;
    var stretch = 'r' + coordSize + 'nsnf';

    for (i = 0; i < l; ++i) {

      glyph = font.glyphs[chars[i]] || font.missingGlyph;
      if (!glyph) continue;

      if (redraw) {
        // some glyphs may be missing so we can't use i
        shape = canvas.childNodes[k];
        if (shape.firstChild) shape.removeChild(shape.firstChild); // shadow
      }
      else {
        shape = fabric.document.createElement('cvml:shape');
        canvas.appendChild(shape);
      }

      shape.stroked = 'f';
      shape.coordsize = coordSize;
      shape.coordorigin = coordOrigin = (minX - offsetX) + ',' + minY;
      shape.path = (glyph.d ? 'm' + glyph.d + 'xe' : '') + 'm' + coordOrigin + stretch;
      shape.fillcolor = color;

      // it's important to not set top/left or IE8 will grind to a halt
      var sStyle = shape.style;
      sStyle.width = roundedShapeWidth;
      sStyle.height = roundedHeight;

      if (shadows) {
        // due to the limitations of the VML shadow element there
        // can only be two visible shadows. opacity is shared
        // for all shadows.
        var shadow1 = shadows[0], shadow2 = shadows[1];
        var color1 = Cufon.CSS.color(shadow1.color), color2;
        var shadow = fabric.document.createElement('cvml:shadow');
        shadow.on = 't';
        shadow.color = color1.color;
        shadow.offset = shadow1.offX + ',' + shadow1.offY;
        if (shadow2) {
          color2 = Cufon.CSS.color(shadow2.color);
          shadow.type = 'double';
          shadow.color2 = color2.color;
          shadow.offset2 = shadow2.offX + ',' + shadow2.offY;
        }
        shadow.opacity = color1.opacity || (color2 && color2.opacity) || 1;
        shape.appendChild(shadow);
      }

      offsetX += ~~(glyph.w || font.w) + letterSpacing;

      ++k;

    }

    wStyle.width = Math.max(Math.ceil(size.convert(width * roundingFactor)), 0);

    return wrapper;

  };

})());

Cufon.getTextDecoration = function(options) {
  return {
    underline: options.textDecoration === 'underline',
    overline: options.textDecoration === 'overline',
    'line-through': options.textDecoration === 'line-through'
  };
};

if (typeof exports != 'undefined') {
  exports.Cufon = Cufon;
}
