/*  Prototype JavaScript framework, version 1.6.1
 *  (c) 2005-2009 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Prototype = {
  Version: '1.6.1',

  Browser: (function(){
    var ua = navigator.userAgent;
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE:             !!window.attachEvent && !isOpera,
      Opera:          isOpera,
      WebKit:         ua.indexOf('AppleWebKit/') > -1,
      Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari:   /Apple.*Mobile.*Safari/.test(ua)
    }
  })(),

  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function() {
      var constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    })(),
    SpecificElementExtensions: (function() {
      if (typeof window.HTMLDivElement !== 'undefined')
        return true;

      var div = document.createElement('div'),
          form = document.createElement('form'),
          isSupported = false;

      if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
        isSupported = true;
      }

      div = form = null;

      return isSupported;
    })()
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction: function() { },
  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;


var Abstract = { };


var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

/* Based on Alex Arnell's inheritance implementation. */

var Class = (function() {

  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  function subclass() {};
  function create() {
    var parent = null, properties = $A(arguments);
    if (Object.isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0, length = properties.length; i < length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = Object.keys(source);

    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames()[0] == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();
(function() {

  var _toString = Object.prototype.toString;

  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  function inspect(object) {
    try {
      if (isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }

  function toJSON(object) {
    var type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }

    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (isElement(object)) return;

    var results = [];
    for (var property in object) {
      var value = toJSON(object[property]);
      if (!isUndefined(value))
        results.push(property.toJSON() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
  }

  function toQueryString(object) {
    return $H(object).toQueryString();
  }

  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }

  function keys(object) {
    var results = [];
    for (var property in object)
      results.push(property);
    return results;
  }

  function values(object) {
    var results = [];
    for (var property in object)
      results.push(object[property]);
    return results;
  }

  function clone(object) {
    return extend({ }, object);
  }

  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  function isArray(object) {
    return _toString.call(object) == "[object Array]";
  }


  function isHash(object) {
    return object instanceof Hash;
  }

  function isFunction(object) {
    return typeof object === "function";
  }

  function isString(object) {
    return _toString.call(object) == "[object String]";
  }

  function isNumber(object) {
    return _toString.call(object) == "[object Number]";
  }

  function isUndefined(object) {
    return typeof object === "undefined";
  }

  extend(Object, {
    extend:        extend,
    inspect:       inspect,
    toJSON:        toJSON,
    toQueryString: toQueryString,
    toHTML:        toHTML,
    keys:          keys,
    values:        values,
    clone:         clone,
    isElement:     isElement,
    isArray:       isArray,
    isHash:        isHash,
    isFunction:    isFunction,
    isString:      isString,
    isNumber:      isNumber,
    isUndefined:   isUndefined
  });
})();
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }

  function bind(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = slice.call(arguments, 1);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(context, a);
    }
  }

  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    }
  }

  function curry() {
    if (!arguments.length) return this;
    var __method = this, args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    }
  }

  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    timeout = timeout * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }

  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    }
  }

  function methodize() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      var a = update([this], arguments);
      return __method.apply(null, a);
    };
  }

  return {
    argumentNames:       argumentNames,
    bind:                bind,
    bindAsEventListener: bindAsEventListener,
    curry:               curry,
    delay:               delay,
    defer:               defer,
    wrap:                wrap,
    methodize:           methodize
  }
})());


Date.prototype.toJSON = function() {
  return '"' + this.getUTCFullYear() + '-' +
    (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
    this.getUTCDate().toPaddedString(2) + 'T' +
    this.getUTCHours().toPaddedString(2) + ':' +
    this.getUTCMinutes().toPaddedString(2) + ':' +
    this.getUTCSeconds().toPaddedString(2) + 'Z"';
};


RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch(e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, (function() {

  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) return replacement;
    var template = new Template(replacement);
    return function(match) { return template.evaluate(match) };
  }

  function gsub(pattern, replacement) {
    var result = '', source = this, match;
    replacement = prepareReplacement(replacement);

    if (Object.isString(pattern))
      pattern = RegExp.escape(pattern);

    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  }

  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  }

  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
  }

  function strip() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
  }

  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  }

  function extractScripts() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
        matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  }

  function evalScripts() {
    return this.extractScripts().map(function(script) { return eval(script) });
  }

  function escapeHTML() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }


  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift()),
            value = pair.length > 1 ? pair.join('=') : pair[0];

        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  }

  function toArray() {
    return this.split('');
  }

  function succ() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  }

  function times(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  }

  function camelize() {
    return this.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  function underscore() {
    return this.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/-/g, '_')
               .toLowerCase();
  }

  function dasherize() {
    return this.replace(/_/g, '-');
  }

  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in String.specialChar) {
        return String.specialChar[character];
      }
      return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  }

  function toJSON() {
    return this.inspect(true);
  }

  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, '$1');
  }

  function isJSON() {
    var str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  }

  function evalJSON(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1;
  }

  function startsWith(pattern) {
    return this.lastIndexOf(pattern, 0) === 0;
  }

  function endsWith(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.indexOf(pattern, d) === d;
  }

  function empty() {
    return this == '';
  }

  function blank() {
    return /^\s*$/.test(this);
  }

  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }

  return {
    gsub:           gsub,
    sub:            sub,
    scan:           scan,
    truncate:       truncate,
    strip:          String.prototype.trim || strip,
    stripTags:      stripTags,
    stripScripts:   stripScripts,
    extractScripts: extractScripts,
    evalScripts:    evalScripts,
    escapeHTML:     escapeHTML,
    unescapeHTML:   unescapeHTML,
    toQueryParams:  toQueryParams,
    parseQuery:     toQueryParams,
    toArray:        toArray,
    succ:           succ,
    times:          times,
    camelize:       camelize,
    capitalize:     capitalize,
    underscore:     underscore,
    dasherize:      dasherize,
    inspect:        inspect,
    toJSON:         toJSON,
    unfilterJSON:   unfilterJSON,
    isJSON:         isJSON,
    evalJSON:       evalJSON,
    include:        include,
    startsWith:     startsWith,
    endsWith:       endsWith,
    empty:          empty,
    blank:          blank,
    interpolate:    interpolate
  };
})());

var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    if (object && Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return (match[1] + '');

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3],
          pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

var $break = { };

var Enumerable = (function() {
  function each(iterator, context) {
    var index = 0;
    try {
      this._each(function(value) {
        iterator.call(context, value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }

  function eachSlice(number, iterator, context) {
    var index = -number, slices = [], array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  }

  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = true;
    this.each(function(value, index) {
      result = result && !!iterator.call(context, value, index);
      if (!result) throw $break;
    });
    return result;
  }

  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator.call(context, value, index))
        throw $break;
    });
    return result;
  }

  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function detect(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  }

  function findAll(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  }

  function grep(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];

    if (Object.isString(filter))
      filter = new RegExp(RegExp.escape(filter));

    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function include(object) {
    if (Object.isFunction(this.indexOf))
      if (this.indexOf(object) != -1) return true;

    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }

  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  }

  function inject(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
  }

  function invoke(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  }

  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value >= result)
        result = value;
    });
    return result;
  }

  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value < result)
        result = value;
    });
    return result;
  }

  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator.call(context, value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  }

  function pluck(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  }

  function reject(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  }

  function sortBy(iterator, context) {
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  }

  function toArray() {
    return this.map();
  }

  function zip() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  }

  function size() {
    return this.toArray().length;
  }

  function inspect() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }









  return {
    each:       each,
    eachSlice:  eachSlice,
    all:        all,
    every:      all,
    any:        any,
    some:       any,
    collect:    collect,
    map:        collect,
    detect:     detect,
    findAll:    findAll,
    select:     findAll,
    filter:     findAll,
    grep:       grep,
    include:    include,
    member:     include,
    inGroupsOf: inGroupsOf,
    inject:     inject,
    invoke:     invoke,
    max:        max,
    min:        min,
    partition:  partition,
    pluck:      pluck,
    reject:     reject,
    sortBy:     sortBy,
    toArray:    toArray,
    entries:    toArray,
    zip:        zip,
    size:       size,
    inspect:    inspect,
    find:       detect
  };
})();
function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

Array.from = $A;


(function() {
  var arrayProto = Array.prototype,
      slice = arrayProto.slice,
      _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

  function each(iterator) {
    for (var i = 0, length = this.length; i < length; i++)
      iterator(this[i]);
  }
  if (!_each) _each = each;

  function clear() {
    this.length = 0;
    return this;
  }

  function first() {
    return this[0];
  }

  function last() {
    return this[this.length - 1];
  }

  function compact() {
    return this.select(function(value) {
      return value != null;
    });
  }

  function flatten() {
    return this.inject([], function(array, value) {
      if (Object.isArray(value))
        return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }

  function without() {
    var values = slice.call(arguments, 0);
    return this.select(function(value) {
      return !values.include(value);
    });
  }

  function reverse(inline) {
    return (inline === false ? this.toArray() : this)._reverse();
  }

  function uniq(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  }

  function intersect(array) {
    return this.uniq().findAll(function(item) {
      return array.detect(function(value) { return item === value });
    });
  }


  function clone() {
    return slice.call(this, 0);
  }

  function size() {
    return this.length;
  }

  function inspect() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  }

  function toJSON() {
    var results = [];
    this.each(function(object) {
      var value = Object.toJSON(object);
      if (!Object.isUndefined(value)) results.push(value);
    });
    return '[' + results.join(', ') + ']';
  }

  function indexOf(item, i) {
    i || (i = 0);
    var length = this.length;
    if (i < 0) i = length + i;
    for (; i < length; i++)
      if (this[i] === item) return i;
    return -1;
  }

  function lastIndexOf(item, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    var n = this.slice(0, i).reverse().indexOf(item);
    return (n < 0) ? n : i - n - 1;
  }

  function concat() {
    var array = slice.call(this, 0), item;
    for (var i = 0, length = arguments.length; i < length; i++) {
      item = arguments[i];
      if (Object.isArray(item) && !('callee' in item)) {
        for (var j = 0, arrayLength = item.length; j < arrayLength; j++)
          array.push(item[j]);
      } else {
        array.push(item);
      }
    }
    return array;
  }

  Object.extend(arrayProto, Enumerable);

  if (!arrayProto._reverse)
    arrayProto._reverse = arrayProto.reverse;

  Object.extend(arrayProto, {
    _each:     _each,
    clear:     clear,
    first:     first,
    last:      last,
    compact:   compact,
    flatten:   flatten,
    without:   without,
    reverse:   reverse,
    uniq:      uniq,
    intersect: intersect,
    clone:     clone,
    toArray:   clone,
    size:      size,
    inspect:   inspect,
    toJSON:    toJSON
  });

  var CONCAT_ARGUMENTS_BUGGY = (function() {
    return [].concat(arguments)[0][0] !== 1;
  })(1,2)

  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }


  function _each(iterator) {
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  }

  function set(key, value) {
    return this._object[key] = value;
  }

  function get(key) {
    if (this._object[key] !== Object.prototype[key])
      return this._object[key];
  }

  function unset(key) {
    var value = this._object[key];
    delete this._object[key];
    return value;
  }

  function toObject() {
    return Object.clone(this._object);
  }

  function keys() {
    return this.pluck('key');
  }

  function values() {
    return this.pluck('value');
  }

  function index(value) {
    var match = this.detect(function(pair) {
      return pair.value === value;
    });
    return match && match.key;
  }

  function merge(object) {
    return this.clone().update(object);
  }

  function update(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  }

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    return key + '=' + encodeURIComponent(String.interpret(value));
  }

  function toQueryString() {
    return this.inject([], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;

      if (values && typeof values == 'object') {
        if (Object.isArray(values))
          return results.concat(values.map(toQueryPair.curry(key)));
      } else results.push(toQueryPair(key, values));
      return results;
    }).join('&');
  }

  function inspect() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }

  function toJSON() {
    return Object.toJSON(this.toObject());
  }

  function clone() {
    return new Hash(this);
  }

  return {
    initialize:             initialize,
    _each:                  _each,
    set:                    set,
    get:                    get,
    unset:                  unset,
    toObject:               toObject,
    toTemplateReplacements: toObject,
    keys:                   keys,
    values:                 values,
    index:                  index,
    merge:                  merge,
    update:                 update,
    toQueryString:          toQueryString,
    inspect:                inspect,
    toJSON:                 toJSON,
    clone:                  clone
  };
})());

Hash.from = $H;
Object.extend(Number.prototype, (function() {
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }

  function succ() {
    return this + 1;
  }

  function times(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  }

  function toPaddedString(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  }

  function toJSON() {
    return isFinite(this) ? this.toString() : 'null';
  }

  function abs() {
    return Math.abs(this);
  }

  function round() {
    return Math.round(this);
  }

  function ceil() {
    return Math.ceil(this);
  }

  function floor() {
    return Math.floor(this);
  }

  return {
    toColorPart:    toColorPart,
    succ:           succ,
    times:          times,
    toPaddedString: toPaddedString,
    toJSON:         toJSON,
    abs:            abs,
    round:          round,
    ceil:           ceil,
    floor:          floor
  };
})());

function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function() {
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }

  function _each(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  }

  function include(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }

  return {
    initialize: initialize,
    _each:      _each,
    include:    include
  };
})());



var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});
Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isString(this.options.parameters))
      this.options.parameters = this.options.parameters.toQueryParams();
    else if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.clone(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      params['_method'] = this.method;
      this.method = 'post';
    }

    this.parameters = params;

    if (params = Object.toQueryString(params)) {
      if (this.method == 'get')
        this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
        params += '&_=';
    }

    try {
      var response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus: function() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: location.hostname,
      port: location.port ? ':' + location.port : ''
    }));
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null; }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];








Ajax.Response = Class.create({
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;

    if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if (readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,

  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});



function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

/*--------------------------------------------------------------------------*/

if (!window.Node) var Node = { };

if (!Node.ELEMENT_NODE) {
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  });
}


(function(global) {

  var SETATTRIBUTE_IGNORES_NAME = (function(){
    var elForm = document.createElement("form"),
        elInput = document.createElement("input"),
        root = document.documentElement;
    elInput.setAttribute("name", "test");
    elForm.appendChild(elInput);
    root.appendChild(elForm);
    var isBuggy = elForm.elements
      ? (typeof elForm.elements.test == "undefined")
      : null;
    root.removeChild(elForm);
    elForm = elInput = null;
    return isBuggy;
  })();

  var element = global.Element;
  global.Element = function(tagName, attributes) {
    attributes = attributes || { };
    tagName = tagName.toLowerCase();
    var cache = Element.cache;
    if (SETATTRIBUTE_IGNORES_NAME && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }
    if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
    return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
  };
  Object.extend(global.Element, element || { });
  if (element) global.Element.prototype = element.prototype;
})(this);

Element.cache = { };
Element.idCounter = 1;

Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },


  hide: function(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  },

  show: function(element) {
    element = $(element);
    element.style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: (function(){

    var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
      var el = document.createElement("select"),
          isBuggy = true;
      el.innerHTML = "<option value=\"test\">test</option>";
      if (el.options && el.options[0]) {
        isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
      }
      el = null;
      return isBuggy;
    })();

    var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
      try {
        var el = document.createElement("table");
        if (el && el.tBodies) {
          el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
          var isBuggy = typeof el.tBodies[0] == "undefined";
          el = null;
          return isBuggy;
        }
      } catch (e) {
        return true;
      }
    })();

    var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
      var s = document.createElement("script"),
          isBuggy = false;
      try {
        s.appendChild(document.createTextNode(""));
        isBuggy = !s.firstChild ||
          s.firstChild && s.firstChild.nodeType !== 3;
      } catch (e) {
        isBuggy = true;
      }
      s = null;
      return isBuggy;
    })();

    function update(element, content) {
      element = $(element);

      if (content && content.toElement)
        content = content.toElement();

      if (Object.isElement(content))
        return element.update().insert(content);

      content = Object.toHTML(content);

      var tagName = element.tagName.toUpperCase();

      if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
        element.text = content;
        return element;
      }

      if (SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY) {
        if (tagName in Element._insertionTranslations.tags) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          Element._getContentFromAnonymousElement(tagName, content.stripScripts())
            .each(function(node) {
              element.appendChild(node)
            });
        }
        else {
          element.innerHTML = content.stripScripts();
        }
      }
      else {
        element.innerHTML = content.stripScripts();
      }

      content.evalScripts.bind(content).defer();
      return element;
    }

    return update;
  })(),

  replace: function(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    element.parentNode.replaceChild(content, element);
    return element;
  },

  insert: function(element, insertions) {
    element = $(element);

    if (Object.isString(insertions) || Object.isNumber(insertions) ||
        Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
          insertions = {bottom:insertions};

    var content, insert, tagName, childNodes;

    for (var position in insertions) {
      content  = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap: function(element, wrapper, attributes) {
    element = $(element);
    if (Object.isElement(wrapper))
      $(wrapper).writeAttribute(attributes || { });
    else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    if (element.parentNode)
      element.parentNode.replaceChild(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      var property = pair.first(),
          attribute = pair.last(),
          value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },

  recursivelyCollect: function(element, property, maximumLength) {
    element = $(element);
    maximumLength = maximumLength || -1;
    var elements = [];

    while (element = element[property]) {
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
      if (elements.length == maximumLength)
        break;
    }

    return elements;
  },

  ancestors: function(element) {
    return Element.recursivelyCollect(element, 'parentNode');
  },

  descendants: function(element) {
    return Element.select(element, "*");
  },

  firstDescendant: function(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants: function(element) {
    var results = [], child = $(element).firstChild;
    while (child) {
      if (child.nodeType === 1) {
        results.push(Element.extend(child));
      }
      child = child.nextSibling;
    }
    return results;
  },

  previousSiblings: function(element, maximumLength) {
    return Element.recursivelyCollect(element, 'previousSibling');
  },

  nextSiblings: function(element) {
    return Element.recursivelyCollect(element, 'nextSibling');
  },

  siblings: function(element) {
    element = $(element);
    return Element.previousSiblings(element).reverse()
      .concat(Element.nextSiblings(element));
  },

  match: function(element, selector) {
    element = $(element);
    if (Object.isString(selector))
      return Prototype.Selector.match(element, selector);
    return selector.match(element);
  },

  up: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    var ancestors = Element.ancestors(element);
    return Object.isNumber(expression) ? ancestors[expression] :
      Prototype.Selector.filter(ancestors, expression)[index || 0];
  },

  down: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return Element.firstDescendant(element);
    return Object.isNumber(expression) ? Element.descendants(element)[expression] :
      Element.select(element, expression)[index || 0];
  },

  previous: function(element, expression, index) {
    element = $(element);
    if (Object.isNumber(expression)) index = expression, expression = false;
    if (!Object.isNumber(index)) index = 0;

    if (expression) {
      return Prototype.Selector.filter(element.previousSiblings(), expression)[index];
    } else {
      return element.recursivelyCollect("previousSibling", index + 1)[index];
    }
  },

  next: function(element, expression, index) {
    element = $(element);
    if (Object.isNumber(expression)) index = expression, expression = false;
    if (!Object.isNumber(index)) index = 0;

    if (expression) {
      return Prototype.Selector.filter(element.nextSiblings(), expression)[index];
    } else {
      var maximumLength = Object.isNumber(index) ? index + 1 : 1;
      return element.recursivelyCollect("nextSibling", index + 1)[index];
    }
  },


  select: function(element) {
    element = $(element);
    var expressions = Array.prototype.slice.call(arguments, 1).join(', ');
    return Prototype.Selector.select(expressions, element);
  },

  adjacent: function(element) {
    element = $(element);
    var expressions = Array.prototype.slice.call(arguments, 1).join(', ');
    return Prototype.Selector.select(expressions, element.parentNode).without(element);
  },

  identify: function(element) {
    element = $(element);
    var id = Element.readAttribute(element, 'id');
    if (id) return id;
    do { id = 'anonymous_element_' + Element.idCounter++ } while ($(id));
    Element.writeAttribute(element, 'id', id);
    return id;
  },

  readAttribute: function(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      var t = Element._attributeTranslations.read;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.include(':')) {
        return (!element.attributes || !element.attributes[name]) ? null :
         element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  },

  writeAttribute: function(element, name, value) {
    element = $(element);
    var attributes = { }, t = Element._attributeTranslations.write;

    if (typeof name == 'object') attributes = name;
    else attributes[name] = Object.isUndefined(value) ? true : value;

    for (var attr in attributes) {
      name = t.names[attr] || attr;
      value = attributes[attr];
      if (t.values[attr]) name = t.values[attr](element, value);
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  },

  getHeight: function(element) {
    return Element.getDimensions(element).height;
  },

  getWidth: function(element) {
    return Element.getDimensions(element).width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    if (!Element.hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element[Element.hasClassName(element, className) ?
      'removeClassName' : 'addClassName'](element, className);
  },

  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty: function(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);

    if (element.compareDocumentPosition)
      return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (ancestor.contains)
      return ancestor.contains(element) && ancestor !== element;

    while (element = element.parentNode)
      if (element == ancestor) return true;

    return false;
  },

  scrollTo: function(element) {
    element = $(element);
    var pos = Element.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle: function(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    var value = element.style[style];
    if (!value || value == 'auto') {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity: function(element) {
    return $(element).getStyle('opacity');
  },

  setStyle: function(element, styles) {
    element = $(element);
    var elementStyle = element.style, match;
    if (Object.isString(styles)) {
      element.style.cssText += ';' + styles;
      return styles.include('opacity') ?
        element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (var property in styles)
      if (property == 'opacity') element.setOpacity(styles[property]);
      else
        elementStyle[(property == 'float' || property == 'cssFloat') ?
          (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
            property] = styles[property];

    return element;
  },

  setOpacity: function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;
    return element;
  },

  getDimensions: function(element) {
    element = $(element);
    var display = Element.getStyle(element, 'display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    var els = element.style,
        originalVisibility = els.visibility,
        originalPosition = els.position,
        originalDisplay = els.display;
    els.visibility = 'hidden';
    if (originalPosition != 'fixed') // Switching fixed to absolute causes issues in Safari
      els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth,
        originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      if (Prototype.Browser.Opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = Element.getStyle(element, 'overflow') || 'auto';
    if (element._overflow !== 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (element.tagName.toUpperCase() == 'BODY') break;
        var p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  absolutize: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'absolute') return element;

    var offsets = Element.positionedOffset(element),
        top     = offsets[1],
        left    = offsets[0],
        width   = element.clientWidth,
        height  = element.clientHeight;

    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.width  = width + 'px';
    element.style.height = height + 'px';
    return element;
  },

  relativize: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'relative') return element;

    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0),
        left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
    return element;
  },

  cumulativeScrollOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  getOffsetParent: function(element) {
    if (element.offsetParent) return $(element.offsetParent);
    if (element == document.body) return $(element);

    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return $(element);

    return $(document.body);
  },

  viewportOffset: function(forElement) {
    var valueT = 0,
        valueL = 0,
        element = forElement;

    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      if (element.offsetParent == document.body &&
        Element.getStyle(element, 'position') == 'absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (!Prototype.Browser.Opera || (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return Element._returnOffset(valueL, valueT);
  },

  clonePosition: function(element, source) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || { });

    source = $(source);
    var p = Element.viewportOffset(source), delta = [0, 0], parent = null;

    element = $(element);

    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = Element.getOffsetParent(element);
      delta = Element.viewportOffset(parent);
    }

    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    if (options.setLeft)   element.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)    element.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if (options.setWidth)  element.style.width = source.offsetWidth + 'px';
    if (options.setHeight) element.style.height = source.offsetHeight + 'px';
    return element;
  }
};

Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,

  childElements: Element.Methods.immediateDescendants
});

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor:   'for'
    },
    values: { }
  }
};

if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap(
    function(proceed, element, style) {
      switch (style) {
        case 'left': case 'top': case 'right': case 'bottom':
          if (proceed(element, 'position') === 'static') return null;
        case 'height': case 'width':
          if (!Element.visible(element)) return null;

          var dim = parseInt(proceed(element, style), 10);

          if (dim !== element['offset' + style.capitalize()])
            return dim + 'px';

          var properties;
          if (style === 'height') {
            properties = ['border-top-width', 'padding-top',
             'padding-bottom', 'border-bottom-width'];
          }
          else {
            properties = ['border-left-width', 'padding-left',
             'padding-right', 'border-right-width'];
          }
          return properties.inject(dim, function(memo, property) {
            var val = proceed(element, property);
            return val === null ? memo : memo - parseInt(val, 10);
          }) + 'px';
        default: return proceed(element, style);
      }
    }
  );

  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
    function(proceed, element, attribute) {
      if (attribute === 'title') return element.title;
      return proceed(element, attribute);
    }
  );
}

else if (Prototype.Browser.IE) {
  Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(
    function(proceed, element) {
      element = $(element);
      try { element.offsetParent }
      catch(e) { return $(document.body) }
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);
      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    }
  );

  $w('positionedOffset viewportOffset').each(function(method) {
    Element.Methods[method] = Element.Methods[method].wrap(
      function(proceed, element) {
        element = $(element);
        try { element.offsetParent }
        catch(e) { return Element._returnOffset(0,0) }
        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
        var offsetParent = element.getOffsetParent();
        if (offsetParent && offsetParent.getStyle('position') === 'fixed')
          offsetParent.setStyle({ zoom: 1 });
        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );
  });

  Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(
    function(proceed, element) {
      try { element.offsetParent }
      catch(e) { return Element._returnOffset(0,0) }
      return proceed(element);
    }
  );

  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    var value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
        return element['offset' + style.capitalize()] + 'px';
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    function stripAlpha(filter){
      return filter.replace(/alpha\([^\)]*\)/gi,'');
    }
    element = $(element);
    var currentStyle = element.currentStyle;
    if ((currentStyle && !currentStyle.hasLayout) ||
      (!currentStyle && element.style.zoom == 'normal'))
        element.style.zoom = 1;

    var filter = element.getStyle('filter'), style = element.style;
    if (value == 1 || value === '') {
      (filter = stripAlpha(filter)) ?
        style.filter = filter : style.removeAttribute('filter');
      return element;
    } else if (value < 0.00001) value = 0;
    style.filter = stripAlpha(filter) +
      'alpha(opacity=' + (value * 100) + ')';
    return element;
  };

  Element._attributeTranslations = (function(){

    var classProp = 'className',
        forProp = 'for',
        el = document.createElement('div');

    el.setAttribute(classProp, 'x');

    if (el.className !== 'x') {
      el.setAttribute('class', 'x');
      if (el.className === 'x') {
        classProp = 'class';
      }
    }
    el = null;

    el = document.createElement('label');
    el.setAttribute(forProp, 'x');
    if (el.htmlFor !== 'x') {
      el.setAttribute('htmlFor', 'x');
      if (el.htmlFor === 'x') {
        forProp = 'htmlFor';
      }
    }
    el = null;

    return {
      read: {
        names: {
          'class':      classProp,
          'className':  classProp,
          'for':        forProp,
          'htmlFor':    forProp
        },
        values: {
          _getAttr: function(element, attribute) {
            return element.getAttribute(attribute);
          },
          _getAttr2: function(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode: function(element, attribute) {
            var node = element.getAttributeNode(attribute);
            return node ? node.value : "";
          },
          _getEv: (function(){

            var el = document.createElement('div'), f;
            el.onclick = Prototype.emptyFunction;
            var value = el.getAttribute('onclick');

            if (String(value).indexOf('{') > -1) {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                attribute = attribute.toString();
                attribute = attribute.split('{')[1];
                attribute = attribute.split('}')[0];
                return attribute.strip();
              };
            }
            else if (value === '') {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                return attribute.strip();
              };
            }
            el = null;
            return f;
          })(),
          _flag: function(element, attribute) {
            return $(element).hasAttribute(attribute) ? attribute : null;
          },
          style: function(element) {
            return element.style.cssText.toLowerCase();
          },
          title: function(element) {
            return element.title;
          }
        }
      }
    }
  })();

  Element._attributeTranslations.write = {
    names: Object.extend({
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    }, Element._attributeTranslations.read.names),
    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
      'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
  });

  (function(v) {
    Object.extend(v, {
      href:        v._getAttr2,
      src:         v._getAttr2,
      type:        v._getAttr,
      action:      v._getAttrNode,
      disabled:    v._flag,
      checked:     v._flag,
      readonly:    v._flag,
      multiple:    v._flag,
      onload:      v._getEv,
      onunload:    v._getEv,
      onclick:     v._getEv,
      ondblclick:  v._getEv,
      onmousedown: v._getEv,
      onmouseup:   v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout:  v._getEv,
      onfocus:     v._getEv,
      onblur:      v._getEv,
      onkeypress:  v._getEv,
      onkeydown:   v._getEv,
      onkeyup:     v._getEv,
      onsubmit:    v._getEv,
      onreset:     v._getEv,
      onselect:    v._getEv,
      onchange:    v._getEv
    });
  })(Element._attributeTranslations.read.values);

  if (Prototype.BrowserFeatures.ElementExtensions) {
    (function() {
      function _descendants(element) {
        var nodes = element.getElementsByTagName('*'), results = [];
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName !== "!") // Filter out comment nodes.
            results.push(node);
        return results;
      }

      Element.Methods.down = function(element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return element.firstDescendant();
        return Object.isNumber(expression) ? _descendants(element)[expression] :
          Element.select(element, expression)[index || 0];
      }
    })();
  }

}

else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999 :
      (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
}

else if (Prototype.Browser.WebKit) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;

    if (value == 1)
      if (element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++; element.width--;
      } else try {
        var n = document.createTextNode(' ');
        element.appendChild(n);
        element.removeChild(n);
      } catch (e) { }

    return element;
  };

  Element.Methods.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return Element._returnOffset(valueL, valueT);
  };
}

if ('outerHTML' in document.documentElement) {
  Element.Methods.replace = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      var nextSibling = element.next(),
          fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      parent.removeChild(element);
      if (nextSibling)
        fragments.each(function(node) { parent.insertBefore(node, nextSibling) });
      else
        fragments.each(function(node) { parent.appendChild(node) });
    }
    else element.outerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

Element._returnOffset = function(l, t) {
  var result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function(tagName, html) {
  var div = new Element('div'),
      t = Element._insertionTranslations.tags[tagName];
  if (t) {
    div.innerHTML = t[0] + html + t[1];
    for (var i = t[2]; i--; ) {
      div = div.firstChild;
    }
  }
  else {
    div.innerHTML = html;
  }
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before: function(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top: function(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom: function(element, node) {
    element.appendChild(node);
  },
  after: function(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};

(function() {
  var tags = Element._insertionTranslations.tags;
  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH:    tags.TD
  });
})();

Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }
};

Element.Methods.ByTag = { };

Object.extend(Element, Element.Methods);

(function(div) {

  if (!Prototype.BrowserFeatures.ElementExtensions && div['__proto__']) {
    window.HTMLElement = { };
    window.HTMLElement.prototype = div['__proto__'];
    Prototype.BrowserFeatures.ElementExtensions = true;
  }

  div = null;

})(document.createElement('div'));

Element.extend = (function() {

  function checkDeficiency(tagName) {
    if (typeof window.Element != 'undefined') {
      var proto = window.Element.prototype;
      if (proto) {
        var id = '_' + (Math.random()+'').slice(2),
            el = document.createElement(tagName);
        proto[id] = 'x';
        var isBuggy = (el[id] !== 'x');
        delete proto[id];
        el = null;
        return isBuggy;
      }
    }
    return false;
  }

  function extendElementWith(element, methods) {
    for (var property in methods) {
      var value = methods[property];
      if (Object.isFunction(value) && !(property in element))
        element[property] = value.methodize();
    }
  }

  var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkDeficiency('object');

  if (Prototype.BrowserFeatures.SpecificElementExtensions) {
    if (HTMLOBJECTELEMENT_PROTOTYPE_BUGGY) {
      return function(element) {
        if (element && typeof element._extendedByPrototype == 'undefined') {
          var t = element.tagName;
          if (t && (/^(?:object|applet|embed)$/i.test(t))) {
            extendElementWith(element, Element.Methods);
            extendElementWith(element, Element.Methods.Simulated);
            extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
          }
        }
        return element;
      }
    }
    return Prototype.K;
  }

  var Methods = { }, ByTag = Element.Methods.ByTag;

  var extend = Object.extend(function(element) {
    if (!element || typeof element._extendedByPrototype != 'undefined' ||
        element.nodeType != 1 || element == window) return element;

    var methods = Object.clone(Methods),
        tagName = element.tagName.toUpperCase();

    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

    extendElementWith(element, methods);

    element._extendedByPrototype = Prototype.emptyFunction;
    return element;

  }, {
    refresh: function() {
      if (!Prototype.BrowserFeatures.ElementExtensions) {
        Object.extend(Methods, Element.Methods);
        Object.extend(Methods, Element.Methods.Simulated);
      }
    }
  });

  extend.refresh();
  return extend;
})();

if (document.documentElement.hasAttribute) {
  Element.hasAttribute = function(element, attribute) {
    return element.hasAttribute(attribute);
  };
}
else {
  Element.hasAttribute = Element.Methods.Simulated.hasAttribute;
}

Element.addMethods = function(methods) {
  var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || { });
  else {
    if (Object.isArray(tagName)) tagName.each(extend);
    else extend(tagName);
  }

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName])
      Element.Methods.ByTag[tagName] = { };
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    var element = document.createElement(tagName),
        proto = element['__proto__'] || element.constructor.prototype;

    element = null;
    return proto;
  }

  var elementPrototype = window.HTMLElement ? HTMLElement.prototype :
   Element.prototype;

  if (F.ElementExtensions) {
    copy(Element.Methods, elementPrototype);
    copy(Element.Methods.Simulated, elementPrototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (var tag in Element.Methods.ByTag) {
      var klass = findDOMClass(tag);
      if (Object.isUndefined(klass)) continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;

  if (Element.extend.refresh) Element.extend.refresh();
  Element.cache = { };
};


document.viewport = {

  getDimensions: function() {
    return { width: this.getWidth(), height: this.getHeight() };
  },

  getScrollOffsets: function() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop);
  }
};

(function(viewport) {
  var B = Prototype.Browser, doc = document, element, property = {};

  function getRootElement() {
    if (B.WebKit && !doc.evaluate)
      return document;

    if (B.Opera && window.parseFloat(window.opera.version()) < 9.5)
      return document.body;

    return document.documentElement;
  }

  function define(D) {
    if (!element) element = getRootElement();

    property[D] = 'client' + D;

    viewport['get' + D] = function() { return element[property[D]] };
    return viewport['get' + D]();
  }

  viewport.getWidth  = define.curry('Width');

  viewport.getHeight = define.curry('Height');
})(document.viewport);


Element.Storage = {
  UID: 1
};

Element.addMethods({
  getStorage: function(element) {
    if (!(element = $(element))) return;

    var uid;
    if (element === window) {
      uid = 0;
    } else {
      if (typeof element._prototypeUID === "undefined")
        element._prototypeUID = [Element.Storage.UID++];
      uid = element._prototypeUID[0];
    }

    if (!Element.Storage[uid])
      Element.Storage[uid] = $H();

    return Element.Storage[uid];
  },

  store: function(element, key, value) {
    if (!(element = $(element))) return;

    if (arguments.length === 2) {
      Element.getStorage(element).update(key);
    } else {
      Element.getStorage(element).set(key, value);
    }

    return element;
  },

  retrieve: function(element, key, defaultValue) {
    if (!(element = $(element))) return;
    var hash = Element.getStorage(element), value = hash.get(key);

    if (Object.isUndefined(value)) {
      hash.set(key, defaultValue);
      value = defaultValue;
    }

    return value;
  },

  clone: function(element, deep) {
    if (!(element = $(element))) return;
    var clone = element.cloneNode(deep);
    clone._prototypeUID = void 0;
    if (deep) {
      var descendants = Element.select(clone, '*'),
          i = descendants.length;
      while (i--) {
        descendants[i]._prototypeUID = void 0;
      }
    }
    return Element.extend(clone);
  }
});
Prototype._original_property = window.NW;
/*
 * Copyright (C) 2007-2009 Diego Perini
 * All rights reserved.
 *
 * nwmatcher.js - A fast CSS selector engine and matcher
 *
 * Author: Diego Perini <diego.perini at gmail com>
 * Version: 1.2.0
 * Created: 20070722
 * Release: 20091001
 *
 * License:
 *  http://javascript.nwbox.com/NWMatcher/MIT-LICENSE
 * Download:
 *  http://javascript.nwbox.com/NWMatcher/nwmatcher.js
 */

window.NW || (window.NW = {});

NW.Dom = (function(global) {

  var version = 'nwmatcher-1.2.0',

  base = global.document,

  context = global.document,

  docType = context.doctype,

  root = context.documentElement,

  view = base.defaultView || base.parentWindow,

  slice = Array.prototype.slice,

  compatMode = context.compatMode ||
    (function() {
      var el; (el = document.createElement('div')).style.width = 1;
      return el.style.width == '1px' ? 'BackCompat' : 'CSS1Compat';
    })(),

  stripTags = function(s) {
    return s.replace(/<\/?("[^\"]*"|'[^\']*'|[^>])+>/gi, '');
  },


  trim = String.prototype.trim && !' \t\n\r\f'.trim() ?
    String.prototype.trim :
    function() { return this.replace(/^[\x20\t\n\r\f]+|[\x20\t\n\r\f]+$/g, ''); },

  /* BEGIN FEATURE TESTING */

  isNative = (function() {
    var s = (global.open + '').replace(/open/g, '');
    return function(object, method) {
      var m = object ? object[method] : false, r = new RegExp(method, 'g');
      return !!(m && typeof m != 'string' && s === (m + '').replace(r, ''));
    };
  })(),

  NATIVE_TRAVERSAL_API =
    'nextElementSibling' in root &&
    'previousElementSibling' in root,

  NATIVE_HAS_ATTRIBUTE = isNative(root, 'hasAttribute'),

  NATIVE_QSAPI = isNative(context, 'querySelector'),
  NATIVE_GEBID = isNative(context, 'getElementById'),
  NATIVE_GEBTN = isNative(root, 'getElementsByTagName'),
  NATIVE_GEBCN = isNative(root, 'getElementsByClassName'),

  CHILD_NODES =
    'children' in root ?
      (view && global !== view ?
        'childNodes' :
        'children') :
      'childNodes',

  NATIVE_SLICE_PROTO =
    (function() {
      var isSupported = false, div = context.createElement('div');
      try {
        div.innerHTML = '<div id="length"></div>';
        root.insertBefore(div, root.firstChild);
        isSupported = !!slice.call(div.childNodes, 0)[0];
      } catch(e) {
      } finally {
        root.removeChild(div).innerHTML = '';
      }
      return isSupported;
    })(),

  NATIVE_MUTATION_EVENTS = root.addEventListener ?
    (function() {
      var isSupported, id = root.id,
      handler = function() {
        root.removeEventListener('DOMAttrModified', handler, false);
        isSupported = true;
      };

      root.addEventListener('DOMAttrModified', handler, false);
      root.id = 'nw';

      root.id = id;
      handler = null;
      return !!isSupported;
    })() :
    false,


  BUGGY_GEBID = NATIVE_GEBID ?
    (function() {
      var isBuggy, div = context.createElement('div');
      div.innerHTML = '<a name="Z"></a>';
      root.insertBefore(div, root.firstChild);
      isBuggy = !!div.ownerDocument.getElementById('Z');
      div.innerHTML = '';
      root.removeChild(div);
      div = null;
      return isBuggy;
    })() :
    true,

  BUGGY_GEBTN = NATIVE_GEBTN ?
    (function() {
      var isBuggy, div = context.createElement('div');
      div.appendChild(context.createComment(''));
      isBuggy = div.getElementsByTagName('*')[0];
      div.innerHTML = '';
      div = null;
      return isBuggy;
    })() :
    true,

  BUGGY_GEBCN = NATIVE_GEBCN ?
    (function() {
      var isBuggy,
        div = context.createElement('div'),
        method = 'getElementsByClassName',
        test = /\u53f0\u5317/;

      div.innerHTML = '<span class="' + test + 'abc ' + test + '"></span><span class="x"></span>';
      isBuggy = !div[method](test)[0];

      div.lastChild.className = test;
      if (!isBuggy) isBuggy = div[method](test).length !== 2;

      div.innerHTML = '';
      div = null;
      return isBuggy;
    })() :
    true,

  BUGGY_QSAPI = NATIVE_QSAPI ? (function() {
    var pattern = [ ], div = context.createElement('div');

    div.innerHTML = '<b class="X"></b>';
    if (compatMode == 'BackCompat' && div.querySelector('.x') === null) {
      return { 'test': function() { return true; } };
    }

    div.innerHTML = '<input type="hidden">';
    try {
      div.querySelectorAll(':enabled').length === 1 && pattern.push(':enabled', ':disabled');
    } catch(e) { }

    div.innerHTML = '<input type="checkbox" checked>';
    try {
      div.querySelectorAll(':checked').length !== 1 && pattern.push(':checked');
    } catch(e) { }

    div.innerHTML = '<a href="x"></a>';
    div.querySelectorAll(':link').length !== 1 && pattern.push(':link');

    div.innerHTML = '';
    div = null;

    return pattern.length ?
      new RegExp(pattern.join('|')) :
      { 'test': function() { return false; } };
  })() :
  true,

  /* END FEATURE TESTING */

  XHTML_TABLE = {
    'accept': 1, 'accept-charset': 1, 'alink': 1, 'axis': 1,
    'bgcolor': 1, 'charset': 1, 'codetype': 1, 'color': 1,
    'enctype': 1, 'face': 1, 'hreflang': 1, 'http-equiv': 1,
    'lang': 1, 'language': 1, 'link': 1, 'media': 1, 'rel': 1,
    'rev': 1, 'target': 1, 'text': 1, 'type': 1, 'vlink': 1
  },

  HTML_TABLE = {
    'class': compatMode.indexOf('CSS') > -1 ? 0 : 1,
    'accept': 1, 'accept-charset': 1, 'align': 1, 'alink': 1, 'axis': 1,
    'bgcolor': 1, 'charset': 1, 'checked': 1, 'clear': 1, 'codetype': 1, 'color': 1,
    'compact': 1, 'declare': 1, 'defer': 1, 'dir': 1, 'direction': 1, 'disabled': 1,
    'enctype': 1, 'face': 1, 'frame': 1, 'hreflang': 1, 'http-equiv': 1, 'lang': 1,
    'language': 1, 'link': 1, 'media': 1, 'method': 1, 'multiple': 1, 'nohref': 1,
    'noresize': 1, 'noshade': 1, 'nowrap': 1, 'readonly': 1, 'rel': 1, 'rev': 1,
    'rules': 1, 'scope': 1, 'scrolling': 1, 'selected': 1, 'shape': 1, 'target': 1,
    'text': 1, 'type': 1, 'valign': 1, 'valuetype': 1, 'vlink': 1
  },

  INSENSITIVE_TABLE = docType && docType.systemId && docType.systemId.indexOf('xhtml') > -1 ?
    XHTML_TABLE : HTML_TABLE,

  attributesURI = {
    'action': 2, 'cite': 2, 'codebase': 2, 'data': 2, 'href': 2,
    'longdesc': 2, 'lowsrc': 2, 'src': 2, 'usemap': 2
  },

  compiledSelectors = { },

  compiledMatchers = { },

  isClassNameLowered = INSENSITIVE_TABLE['class'],

  encoding = '((?:[-\\w]|[^\\x00-\\xa0]|\\\\.)+)',

  skipgroup = '(?:\\[.*\\]|\\(.*\\))',

  validator = /([.:#*\w]|[^\x00-\xa0])/,

  simpleSelector = /^[.#]?[-\w]+$/,

  noncomplex = /([-\w]+)?(?:\#([-\w]+))?(?:\.([-\w]+))?/,

  group = /([^,()[\]]+|\([^()]+\)|\(.*\)|\[(?:\[[^[\]]*\]|["'][^'"]*["']|[^'"[\]]+)+\]|\[.*\]|\\.)+/g,

  Selectors = {
  },

  Operators = {
     '=': "%p==='%m'",
    '!=': "%p!=='%m'",
    '^=': "%p.indexOf('%m')==0",
    '*=': "%p.indexOf('%m')>-1",
    '|=': "(%p+'-').indexOf('%m-')==0",
    '~=': "(' '+%p+' ').indexOf(' %m ')>-1",
    '$=': "%p.substr(%p.length - '%m'.length) === '%m'"
  },

  Optimize = {
    ID: new RegExp("#" + encoding + "|" + skipgroup + "*"),
    TAG: new RegExp(encoding + "|" + skipgroup + "*"),
    CLASS: new RegExp("\\." + encoding + "|" + skipgroup + "*"),
    TOKEN: /([^ >+~,\\()[\]]+|\([^()]+\)|\(.*\)|\[[^[\]]+\]|\[.*\]|\\.)+/g
  },

  rePositionals = /:(nth|of-type)/,
  reDescendants = /[^> \w]/,
  reClassValue = /([-\w]+)/,
  reSiblings = /[^+~\w]/,
  reTrim = /^[\x20\t\n\r\f]+|[\x20\t\n\r\f]+$/g,

  reIdSelector  = /\#([-\w]+)$/,

  Patterns = {
    attribute: /^\[[\x20\t\n\r\f]*([-\w]*:?(?:[-\w])+)[\x20\t\n\r\f]*(?:([~*^$|!]?=)[\x20\t\n\r\f]*(["']*)([^'"()]*?)\3)?[\x20\t\n\r\f]*\](.*)/,
    spseudos: /^\:(root|empty|nth)?-?(first|last|only)?-?(child)?-?(of-type)?(\((?:even|odd|[^\)]*)\))?(.*)/,
    dpseudos: /^\:([\w]+|[^\x00-\xa0]+)(?:\((["']*)(.*?(\(.*\))?[^'"()]*?)\2\))?(.*)/,
    children: /^[\x20\t\n\r\f]*\>[\x20\t\n\r\f]*(.*)/,
    adjacent: /^[\x20\t\n\r\f]*\+[\x20\t\n\r\f]*(.*)/,
    relative: /^[\x20\t\n\r\f]*\~[\x20\t\n\r\f]*(.*)/,
    ancestor: /^[\x20\t\n\r\f]+(.*)/,
    universal: /^\*(.*)/,
    id: new RegExp("^#" + encoding + "(.*)"),
    tagName: new RegExp("^" + encoding + "(.*)"),
    className: new RegExp("^\\." + encoding + "(.*)")
  },

  CSS3PseudoClasses = {
    Structural: {
      'root': 3, 'empty': 3,
      'first-child': 3, 'last-child': 3, 'only-child': 3,
      'first-of-type': 3, 'last-of-type': 3, 'only-of-type': 3,
      'first-child-of-type': 3, 'last-child-of-type': 3, 'only-child-of-type': 3,
      'nth-child': 3, 'nth-last-child': 3, 'nth-of-type': 3, 'nth-last-of-type': 3
    },

    Others: {
      'checked': 3, 'disabled': 3, 'enabled': 3, 'selected': 2, 'indeterminate': '?',
      'active': 3, 'focus': 3, 'hover': 3, 'link': 3, 'visited': 3,
      'target': 3,
      'lang': 3,
      'not': 3,
      'contains': '?'
    }
  },


  ACCEPT_NODE = 'f&&f(N);r[r.length]=N;continue main;',

  SKIP_COMMENTS = BUGGY_GEBTN ? 'if(e.nodeType!=1){continue;}' : '',

  CONTAINS_TEXT =
    'textContent' in root ?
    'e.textContent' :
    (function() {
      var t = context.createElement('div');
      t.innerHTML = '<p>p</p>';
      t.style.display = 'none';
      return t.innerText.length > 0 ?
        'e.innerText' :
        's.stripTags(e.innerHTML)';
    })(),

  compileGroup =
    function(selector, source, mode) {
      var i = 0, seen = { }, parts, token;
      if ((parts = selector.match(group))) {
        while ((token = parts[i++])) {
          token = token.replace(reTrim, '');
          if (!seen[token]) source += 'e=N;' + compileSelector(token, mode ? ACCEPT_NODE : 'return true;');
          seen[token] = true;
        }
      }
      if (mode) {
        return new Function('c,s,d,h,g,f', 'var k,e,r,n,C,N,T,x=0;main:for(k=0,r=[];e=N=c[k];k++){' + SKIP_COMMENTS + source + '}return r;');
      } else {
        return new Function('e,s,d,h,g,f', 'var n,C,N=e,T,x=0;' + source + 'return false;');
      }
    },

  compileSelector =
    function(selector, source) {

      var i, a, b, n, k, expr, match, result, status, test, type;

      k = 0;

      while (selector) {

        if ((match = selector.match(Patterns.universal))) {
          true;
        }

        else if ((match = selector.match(Patterns.id))) {
          if (base.getElementsByName('id')[0] || base.getElementById('id')) {
            source = 'if((e.submit?s.getAttribute(e,"id"):e.id)=="' + match[1] + '"){' + source + '}';
          } else {
            source = 'if(e.id=="' + match[1] + '"){' + source + '}';
          }
        }

        else if ((match = selector.match(Patterns.tagName))) {
          source = 'if(e.nodeName=="' + match[1].toUpperCase() + '"||e.nodeName=="' + match[1].toLowerCase() + '"){' + source + '}';
        }

        else if ((match = selector.match(Patterns.className))) {
          source = 'if((" "+e.className+" ").replace(/[\\t\\n\\r\\f]/g," ").indexOf(" ' + match[1] + ' ")>-1){' + source + '}';
        }

        else if ((match = selector.match(Patterns.attribute))) {
          expr = match[1].split(':');
          expr = expr.length == 2 ? expr[1] : expr[0] + '';

          if (match[4] && INSENSITIVE_TABLE[expr.toLowerCase()]) {
            match[4] = match[4].toLowerCase();
          }

          source = (match[2] ? 'T=s.getAttribute(e,"' + match[1] + '");' : '') +
            'if(' + (match[2] ? Operators[match[2]].replace(/\%p/g, 'T' +
              (expr ? '' : '.toLowerCase()')).replace(/\%m/g, match[4]) :
              's.hasAttribute(e,"' + match[1] + '")') +
            '){' + source + '}';
        }

        else if ((match = selector.match(Patterns.adjacent))) {
          if (NATIVE_TRAVERSAL_API) {
            source = 'if((e=e.previousElementSibling)){' + source + '}';
          } else {
            source = 'while((e=e.previousSibling)){if(e.nodeType==1){' + source + 'break;}}';
          }
        }

        else if ((match = selector.match(Patterns.relative))) {
          k++;
          if (NATIVE_TRAVERSAL_API) {
            source =
              'var N' + k + '=e;e=e.parentNode.firstElementChild;' +
              'while(e!=N' + k +'){if(e){' + source + '}e=e.nextElementSibling;}';
          } else {
            source =
              'var N' + k + '=e;e=e.parentNode.firstChild;' +
              'while(e!=N' + k +'){if(e.nodeType==1){' + source + '}e=e.nextSibling;}';
          }
        }

        else if ((match = selector.match(Patterns.children))) {
          source = 'if((e=e.parentNode)&&e.nodeType==1){' + source + '}';
        }

        else if ((match = selector.match(Patterns.ancestor))) {
          source = 'while((e=e.parentNode)&&e.nodeType==1&&e!==g){' + source + '}';
        }

        else if ((match = selector.match(Patterns.spseudos)) &&
          CSS3PseudoClasses.Structural[selector.match(reClassValue)[0]]) {

          switch (match[1]) {
            case 'root':
              source = 'if(e===h){' + source + '}';
              break;
            case 'empty':
              source = 'if(!e.firstChild){' + source + '}';
              break;
            default:
              type = match[4] == 'of-type' ? 'OfType' : 'Element';

              if (match[1] && match[5]) {
                match[5] = match[5].replace(/\(|\)/g, '');
                if (match[5] == 'even') {
                  a = 2;
                  b = 0;
                } else if (match[5] == 'odd') {
                  a = 2;
                  b = 1;
                } else {
                  a = match[5].match(/^-/) ? -1 : match[5].match(/^n/) ? 1 : 0;
                  a = a || ((n = match[5].match(/(-?\d{1,})n/)) ? parseInt(n[1], 10) : 0);
                  b = 0 || ((n = match[5].match(/(-?\d{1,})$/)) ? parseInt(n[1], 10) : 0);
                }

                expr = match[2] == 'last' ? (match[4] ?
                    '(e==h?1:s.TwinsCount[e.parentNode._cssId][e.nodeName.toLowerCase()])' :
                    '(e==h?1:s.ChildCount[e.parentNode._cssId])') + '-' + (b - 1) : b;

                test =
                  b < 0 ?
                    a <= 1 ?
                      '<=' + Math.abs(b) :
                      '%' + a + '===' + (a + b) :
                  a > Math.abs(b) ? '%' + a + '===' + b :
                  a === Math.abs(b) ? '%' + a + '===' + 0 :
                  a === 0 ? '==' + expr :
                  a < 0 ? '<=' + b :
                  a > 0 ? '>=' + b :
                    '';

                source = 'if(s.' + match[1] + type + '(e)' + test + '){' + source + '}';
              } else {
                source = NATIVE_TRAVERSAL_API ?
                  ((match[4] ? 'T=e.nodeName;' : '') +
                    'n=e;while((n=n.' + (match[2] == 'first' ? 'previous' : 'next') + 'ElementSibling)){' +
                      (match[4] ? 'if(n.nodeName==T)' : '') + 'break;}' +
                    'if(!n){' + (match[2] == 'first' || match[2] == 'last' ? source :
                    'n=e;while((n=n.' + (match[2] == 'only' ? 'previous' : 'next') + 'ElementSibling)){' +
                      (match[4] ? 'if(n.nodeName==T)' : '') + 'break;}' +
                    'if(!n){' + source + '}') +
                    '}') :
                  ((match[4] ? 'T=e.nodeName;' : '') +
                    'n=e;while((n=n.' + (match[2] == 'first' ? 'previous' : 'next') + 'Sibling)&&' +
                      'n.node' + (match[4] ? 'Name!=T' : 'Type!=1') + ');' +
                    'if(!n){' + (match[2] == 'first' || match[2] == 'last' ? source :
                    'n=e;while((n=n.' + (match[2] == 'only' ? 'previous' : 'next') + 'Sibling)&&' +
                      'n.node' + (match[4] ? 'Name!=T' : 'Type!=1') + ');' +
                    'if(!n){' + source + '}') +
                    '}');
              }
              break;
          }

        }

        else if ((match = selector.match(Patterns.dpseudos)) &&
          CSS3PseudoClasses.Others[selector.match(reClassValue)[0]]) {

          switch (match[1]) {
            case 'not':
              source = 'if(!s.match(e, "' + match[3].replace(/\x22/g, '\\"') + '")){' + source +'}';
              break;

            case 'checked':
              source = 'if("form" in e&&/radio|checkbox/i.test(e.type)&&e.checked===true){' + source + '}';
              break;
            case 'enabled':
              source = 'if((("form" in e&&e.type!=="hidden")||s.isLink(e))&&e.disabled===false){' + source + '}';
              break;
            case 'disabled':
              source = 'if((("form" in e&&e.type!=="hidden")||s.isLink(e))&&e.disabled===true){' + source + '}';
              break;

            case 'target':
              n = base.location.hash;
              source = 'if(e.id!=""&&e.id=="' + n + '"&&"href" in e){' + source + '}';
              break;

            case 'link':
              source = 'if(s.isLink(e)&&!e.visited){' + source + '}';
              break;
            case 'visited':
              source = 'if(s.isLink(e)&&!!e.visited){' + source + '}';
              break;

            case 'active':
              source = 'if("activeElement" in d&&e===d.activeElement){' + source + '}';
              break;
            case 'hover':
              source = 'if("hoverElement" in d&&e===d.hoverElement){' + source + '}';
              break;
            case 'focus':
              source = 'if("form" in e&&e===d.activeElement&&typeof d.hasFocus=="function"&&d.hasFocus()===true){' + source + '}';
              break;

            case 'contains':
              source = 'if(' + CONTAINS_TEXT + '.indexOf("' + match[3] + '")>-1){' + source + '}';
              break;
            case 'selected':
              n = base.getElementsByTagName('select');
              for (i = 0; n[i]; i++) {
                n[i].selectedIndex;
              }
              source = 'if("form" in e&&e.selected===true){' + source + '}';
              break;
            default:
              break;
          }
        } else {

          status = true;
          for (expr in Selectors) {
            if ((match = selector.match(Selectors[expr].Expression))) {
              result = Selectors[expr].Callback(match, source);
              source = result.source;
              status |= result.status;
            }
          }

          if (!status) {
            emit('DOMException: unknown pseudo selector "' + selector + '"');
            return source;
          }

          if (!expr) {
            emit('DOMException: unknown token in selector "' + selector + '"');
            return source;
          }

        }

        selector = match && match[match.length - 1];
      }

      return source;
    },

  VERBOSE = false,

  emit =
    function(message) {
      if (VERBOSE) {
        var console = global.console;
        if (console && console.log) {
          console.log(message);
        } else {
          if (/exception/i.test(message)) {
            global.status = message;
            global.defaultStatus = message;
          } else {
            global.status += message;
          }
        }
      }
    },

  match =
    function(element, selector, from) {
      if (element && element.nodeType == 1) {
        if (typeof selector == 'string' && selector.length) {
          base = element.ownerDocument;
          root = base.documentElement;
          if (!compiledMatchers[selector]) {
            compiledMatchers[selector] = compileGroup(selector, '', false);
          }
          return compiledMatchers[selector](element, snap, base, root, from || base);
        } else {
          emit('DOMException: "' + selector + '" is not a valid CSS selector.');
        }
      }
      return false;
    },

  select_qsa =
    function (selector, from, data, callback) {

      var elements;

      if (!simpleSelector.test(selector) &&
          (!from || from.nodeType == 9 || from.nodeType == 11) &&
          !BUGGY_QSAPI.test(selector)) {
        try {
          elements = (from || context).querySelectorAll(selector);
          if (elements.length == 1) {
            callback && callback(elements[0]);
            return [ elements[0] ];
          }
        } catch(e) { }

        if (elements) {
          if (callback) return concatCall(data || [ ], elements, callback);
          return NATIVE_SLICE_PROTO ?
            slice.call(elements) :
            concatList(data || [ ], elements);
        }
      }

      return client_api(selector, from, data, callback);
    },

  lastSelector,
  lastContext,
  lastCalled,
  lastSlice,

  client_api =
    function client_api(selector, from, data, callback) {

      var i = 0, done, now, disconnected, className,
        element, elements, parts, token, isCacheable,
        concat = callback ? concatCall : concatList;

      data || (data = [ ]);

      from || (from = context);

      if (!from || lastContext != from) {
        lastContext = from;
        root = (base = from.ownerDocument || from).documentElement;
      }

      selector = selector.replace(reTrim, '');

      if (lastSelector != selector) {
        if (validator.test(selector)) {
          lastSelector = selector;
          parts = selector.match(Optimize.TOKEN);
          lastSlice = parts[parts.length - 1].split(':not')[0];
        } else {
          emit('DOMException: "' + selector + '" is not a valid CSS selector.');
          return data;
        }
      }

      disconnected = from != base && isDisconnected(from, root);

      isCacheable = cachingEnabled && !cachingPaused && !disconnected;

      if (isCacheable) {
        snap = base.snapshot;
        if (snap && !snap.isExpired) {
          if (snap.Results[selector] &&
            snap.Roots[selector] == from) {
            return callback ?
              concat(data, snap.Results[selector], callback) :
              snap.Results[selector];
          }
        } else {
          now = new Date;
          if ((now - lastCalled) < minCallThreshold) {
            cachingPaused =
              (base.snapshot = new Snapshot).isExpired = true;
            setTimeout(function() { cachingPaused = false; }, 10);
          } else setCache(true, base);
          snap = base.snapshot;
          lastCalled = now;
        }
      } else {
        if (rePositionals.test(selector)) {
          snap = new Snapshot;
        }
      }


      if (simpleSelector.test(selector)) {
        switch (selector.charAt(0)) {
          case '.': data = concat(data, byClass(selector.slice(1), from), callback); break;
          case '#': data = concat(data, [ byId(selector.slice(1), from) ], callback); break;
          default: data = concat(data, byTag(selector, from), callback); break;
        }
        snap.Roots[selector] = from;
        snap.Results[selector] = data;
        return data;
      }

      if (selector.indexOf(',') < 0) {

        if ((parts = selector.match(Optimize.ID))) {
          if ((element = context.getElementById(parts[1]))) {
            from = element.parentNode;
          }
        }

        if ((parts = lastSlice.match(Optimize.ID)) &&
          (token = parts[parts.length - 1]) && NATIVE_GEBID) {
          if ((element = byId(token, context))) {
            if (match(element, selector)) {
              elements = [ element ];
              done = true;
            }
          } else return data;
        }

        else if ((parts = lastSlice.match(Optimize.CLASS)) &&
          (token = parts[parts.length - 1]) && NATIVE_GEBCN) {
          elements = byClass(token, from);
          if (selector == '.' + token) done = true;
        }

        else if ((parts = lastSlice.match(Optimize.TAG)) &&
          (token = parts[parts.length - 1]) && NATIVE_GEBTN) {
          elements = byTag(token, from);
          if (selector == token) done = true;
        }

      }

      if (!done) {

        if (!elements || elements.length === 0) {

          elements = from.getElementsByTagName('*');

          if ((parts = lastSlice.match(reIdSelector)) && selector == '#' + parts[1]) {
            while ((element = elements[i++])) {
              if (element.id == parts[1]) {
                callback && callback(element);
                data.push(element);
                return data;
              }
            }
            return data;
          }
          else if ((parts = lastSlice.match(/\b([-\w]+)?(\.|#)([-\w]+)/))) {
            parts[1] = parts[1].toUpperCase();

            if (parts[2] == '.' && isClassNameLowered)
              parts[3] = parts[3].toLowerCase();

            while ((element = elements[i++])) {
              if (
                  (!parts[1] || element.nodeName.toUpperCase() == parts[1]) && (
                  ( parts[2] == '#' && element.id == parts[3]) ||
                  ( parts[2] == '.' && (className = element.className) &&
                  (isClassNameLowered ? className.length && className.toLowerCase() :
                   className) == parts[3]))) {
                callback && callback(element);
                data.push(element);
                return data;
              }
            }
          }
        }

        if (!compiledSelectors[selector]) {
          compiledSelectors[selector] = compileGroup(selector, '', true);
        }

      }

      if (isCacheable) {
        snap.Results[selector] = done ?
          concat(data, elements, callback) :
          concat(data, compiledSelectors[selector](elements, snap, base, root, from), callback);
        snap.Roots[selector] = from;
        return snap.Results[selector];
      }

      return done ?
        concat(data, elements, callback) :
        concat(data, compiledSelectors[selector](elements, snap, base, root, from), callback);
    },

  select = NATIVE_QSAPI ?
    select_qsa :
    client_api,


  byId =
    function(id, from) {
      var i = 0, element, names, result;
      from || (from = context);
      id = id.replace(/\\/g, '');
      if (from.getElementById) {
        result = from.getElementById(id);
        if (result && id != getAttribute(result, 'id') && from.getElementsByName) {
          names = from.getElementsByName(id);
          result = null;
          while ((element = names[i++])) {
            if (element.getAttributeNode('id').value == id) {
              result = element;
              break;
            }
          }
        }
      } else {
        result = select('[id="' + id + '"]', from)[0] || null;
      }
      return result;
    },

  byTag =
    function(tag, from) {
      return (from || context).getElementsByTagName(tag);
    },

  byName =
    function(name, from) {
      return select('[name="' + name.replace(/\\/g, '') + '"]', from || context);
    },

  byClass = !BUGGY_GEBCN ?
    function(className, from) {
      return from.getElementsByClassName(className.replace(/\\/g, ''));
    } :
    function(className, from) {
      var cn, element, original, i = 0, j = 0, results = [ ],
        elements = from.getElementsByTagName('*');

      className = className.replace(/\\/g, '');
      if (isClassNameLowered) className = className.toLowerCase();

      while ((element = elements[i++])) {
        if ((original = element.className).length) {
          cn = original.replace(/[\t\n\r\f]/g, ' ');
          if ((' ' + (isClassNameLowered ? cn.toLowerCase() : cn) + ' ')
            .indexOf(' ' + className + ' ') > -1) {
            results[j++] = element;
          }
        }
      }
      return results;
    },


  getAttribute = NATIVE_HAS_ATTRIBUTE ?
    function(element, attribute) {
      return element.getAttribute(attribute) + '';
    } :
    function(element, attribute) {
      var node;
      if (attributesURI[attribute.toLowerCase()]) {
        return element.getAttribute(attribute, 2) + '';
      }
      node = element.getAttributeNode(attribute);
      return (node && node.value) + '';
    },

  hasAttribute = NATIVE_HAS_ATTRIBUTE ?
    function(element, attribute) {
      return element.hasAttribute(attribute);
    } :
    function(element, attribute) {
      var node = element.getAttributeNode(attribute);
      return !!(node && (node.specified || node.nodeValue));
    },

  isLink =
    (function() {
      var LINK_NODES = { 'a': 1, 'area': 1, 'link': 1 };
      return function(element) {
        return hasAttribute(element,'href') && LINK_NODES[element.nodeName.toLowerCase()];
      };
    })(),

  nthElement =
    function(element) {
      var i, j, node, nodes, parent, cache = snap.ChildIndex;
      if (!element._cssId || !cache[element._cssId]) {
        if ((parent = element.parentNode).nodeType == 1) {
          i = 0;
          j = 0;
          nodes = parent[CHILD_NODES];
          while ((node = nodes[i++])) {
            if (node.nodeType == 1) {
              cache[node._cssId || (node._cssId = ++cssId)] = ++j;
            }
          }
          snap.ChildCount[parent._cssId || (parent._cssId = ++cssId)] = j;
        } else {
          return 0;
        }
      }
      return cache[element._cssId];
    },

  nthOfType =
    function(element) {
      var i, j, name, node, nodes, pid, parent, cache = snap.TwinsIndex;
      if (!element._cssId || !cache[element._cssId]) {
        if ((parent = element.parentNode).nodeType == 1) {
          i = 0;
          j = 0;
          nodes = parent[CHILD_NODES];
          name = element.nodeName.toLowerCase();
          while ((node = nodes[i++])) {
            if (node.nodeName.toLowerCase() == name) {
              cache[node._cssId || (node._cssId = ++cssId)] = ++j;
            }
          }
          pid = (parent._cssId || (parent._cssId = ++cssId));
          snap.TwinsCount[pid] || (snap.TwinsCount[pid] = { });
          snap.TwinsCount[pid][name] = j;
        } else {
          return 0;
        }
      }
      return cache[element._cssId];
    },

  concatList =
    function(listout, listin) {
      var i = 0, element;
      while ((element = listin[i++])) listout[listout.length] = element;
      return listout;
    },

  concatCall =
    function(listout, listin, fn) {
      var i = 0, element;
      while ((element = listin[i++])) fn(listout[listout.length] = element);
      return listout;
    },

  getElements =
    function(tag, from) {
      var element = from.firstChild, elements = [ ];
      if (!tag) return elements;
      tag = tag.toLowerCase();
      while (element) {
        if ((element.nodeType == 1 && tag == '*') ||
            element.nodeName.toLowerCase() == tag) {
            elements[elements.length] = element;
        }
        getElements(tag, element, elements);
        element = element.nextSibling;
      }
      return elements;
    },

  isDisconnected = 'compareDocumentPosition' in root ?
    function(element, container) {
      return (container.compareDocumentPosition(element) & 1) == 1;
    } : 'contains' in root ?
    function(element, container) {
      return !container.contains(element);
    } :
    function(element, container) {
      while ((element = element.parentNode)) {
        if (element === container) return false;
      }
      return true;
    },

  sortByContextOrder = (function() {
    var sorter =
      'compareDocumentPosition' in root ?
        function (a, b) {
          return (a.compareDocumentPosition(b) & 2) ? 1 : a === b ? 0 : -1;
        } :
      'createRange' in context ?
        function(a, b) {
          var start = context.createRange(), end = context.createRange();
          start.selectNode(a); start.collapse(true);
          end.selectNode(b); end.collapse(true);
          return start.compareBoundaryPoints(Range.START_TO_END, end);
        } :
      'sourceIndex' in root ?
        function (a, b) {
          return a.sourceIndex - b.sourceIndex;
        } :
        function (a, b) {
          return false;
        };

    return function(nodeList) {
      return nodeList.sort(sorter);
    };
  })(),

  unique =
    function(elements, data, callback, accepted) {
      var i = 0, id, element;
      while ((element = elements[i++])) {
        id = (element._cssId || (element._cssId = ++cssId));
        if (!accepted[id]) {
          accepted[id] = true;
          callback && callback(element);
          data[data.length] = element;
        }
      }
      return data;
    },

  cssId = 1,


  cachingEnabled = NATIVE_MUTATION_EVENTS,

  cachingPaused = false,

  minCallThreshold = 15,

  snap,

  Snapshot =
    function() {
      this.ChildCount = [ ];
      this.TwinsCount = [ ];

      this.ChildIndex = [ ];
      this.TwinsIndex = [ ];

      this.Results = [ ];
      this.Roots   = [ ];
    },

  setCache =
    function(enable, d) {
      d || (d = context);
      if (!!enable) {
        d.snapshot = new Snapshot;
        startMutation(d);
      } else {
        stopMutation(d);
      }
      cachingEnabled = !!enable;
    },

  mutationWrapper =
    function(event) {
      var d = event.target.ownerDocument || event.target;
      stopMutation(d);
      expireCache(d);
    },

  startMutation =
    function(d) {
      if (!d.isCaching) {
        d.addEventListener('DOMAttrModified', mutationWrapper, false);
        d.addEventListener('DOMNodeInserted', mutationWrapper, false);
        d.addEventListener('DOMNodeRemoved', mutationWrapper, false);
        d.isCaching = true;
      }
    },

  stopMutation =
    function(d) {
      if (d.isCaching) {
        d.removeEventListener('DOMAttrModified', mutationWrapper, false);
        d.removeEventListener('DOMNodeInserted', mutationWrapper, false);
        d.removeEventListener('DOMNodeRemoved', mutationWrapper, false);
        d.isCaching = false;
      }
    },

  expireCache =
    function(d) {
      if (d && d.snapshot) {
        d.snapshot.isExpired = true;
      }
    };

  Snapshot.prototype = {
    isExpired: false,

    getAttribute: getAttribute,
    hasAttribute: hasAttribute,
    nthElement: nthElement,
    nthOfType: nthOfType,

    byClass: byClass,
    byName: byName,
    byTag: byTag,
    byId: byId,

    stripTags: stripTags,
    isLink: isLink,

    select: select,
    match: match
  };

  snap = new Snapshot;


  return {

    compile:
      function(selector, mode) {
        return compileGroup(selector, '', mode || false).toString();
      },

    setCache: setCache,

    expireCache: expireCache,

    match: match,

    select: select,

    registerSelector:
      function (name, rexp, func) {
        if (!Selectors[name]) {
          Selectors[name] = { };
          Selectors[name].Expression = rexp;
          Selectors[name].Callback = func;
        }
      },

    registerOperator:
      function (symbol, resolver) {
        if (!Operators[symbol]) {
          Operators[symbol] = resolver;
        }
      },

    byId: byId,

    byTag: byTag,

    byName: byName,

    byClass: byClass,

    getAttribute: getAttribute,

    hasAttribute: hasAttribute

  };

})(this);

Prototype.Selector = (function(engine) {
  function select(selector, scope) {
    return engine.select(selector, scope || document, null, Element.extend);
  }

  function filter(elements, selector) {
    var results = [], element, i = 0;
    while (element = elements[i++]) {
      if (engine.match(element, selector)) {
        Element.extend(element);
        results.push(element);
      }
    }
    return results;
  }

  return {
    engine:  engine,
    select:  select,
    match:   engine.match,
    filter:  filter
  };
})(NW.Dom);

window.NW = Prototype._original_property;
delete Prototype._original_property;

window.$$ = function() {
  var expression = $A(arguments).join(', ');
  return Prototype.Selector.select(expression, document);
};










var Form = {
  reset: function(form) {
    form = $(form);
    form.reset();
    return form;
  },

  serializeElements: function(elements, options) {
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit;

    var data = elements.inject({ }, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          if (key in result) {
            if (!Object.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          }
          else result[key] = value;
        }
      }
      return result;
    });

    return options.hash ? data : Object.toQueryString(data);
  }
};

Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },

  getElements: function(form) {
    var elements = $(form).getElementsByTagName('*'),
        element,
        arr = [ ],
        serializers = Form.Element.Serializers;
    for (var i = 0; element = elements[i]; i++) {
      arr.push(element);
    }
    return arr.inject([], function(elements, child) {
      if (serializers[child.tagName.toLowerCase()])
        elements.push(Element.extend(child));
      return elements;
    })
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return /^(?:input|select|textarea)$/i.test(element.tagName);
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });

    var params = options.parameters, action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;

    return new Ajax.Request(action, options);
  }
};

/*--------------------------------------------------------------------------*/


Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {

  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !(/^(?:button|reset|submit)$/i.test(element.type))))
        element.select();
    } catch (e) { }
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;

var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input: function(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element, value);
      default:
        return Form.Element.Serializers.textarea(element, value);
    }
  },

  inputSelector: function(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    else element.checked = !!value;
  },

  textarea: function(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  },

  select: function(element, value) {
    if (Object.isUndefined(value))
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    else {
      var opt, currentValue, single = !Object.isArray(value);
      for (var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        currentValue = this.optionValue(opt);
        if (single) {
          if (currentValue == value) {
            opt.selected = true;
            return;
          }
        }
        else opt.selected = value.include(currentValue);
      }
    }
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  }
};

(function() {

  var Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45,

    cache: {}
  };

  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
    && 'onmouseleave' in docEl;

  var _isButton;
  if (Prototype.Browser.IE) {
    var buttonMap = { 0: 1, 1: 4, 2: 2 };
    _isButton = function(event, code) {
      return event.button === buttonMap[code];
    };
  } else if (Prototype.Browser.WebKit) {
    _isButton = function(event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 1 && event.metaKey;
        default: return false;
      }
    };
  } else {
    _isButton = function(event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    };
  }

  function isLeftClick(event)   { return _isButton(event, 0) }

  function isMiddleClick(event) { return _isButton(event, 1) }

  function isRightClick(event)  { return _isButton(event, 2) }

  function element(event) {
    event = Event.extend(event);

    var node = event.target, type = event.type,
     currentTarget = event.currentTarget;

    if (currentTarget && currentTarget.tagName) {
      if (type === 'load' || type === 'error' ||
        (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
          && currentTarget.type === 'radio'))
            node = currentTarget;
    }

    if (node.nodeType == Node.TEXT_NODE)
      node = node.parentNode;

    return Element.extend(node);
  }

  function findElement(event, expression) {
    var element = Event.element(event);
    if (!expression) return element;
    while (element) {
      if (Prototype.Selector.match(element, expression)) {
        return Element.extend(element);
      }
      element = element.parentNode
    }
  }

  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollLeft: 0 };

    return event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));
  }

  function pointerY(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollTop: 0 };

    return  event.pageY || (event.clientY +
       (docElement.scrollTop || body.scrollTop) -
       (docElement.clientTop || 0));
  }


  function stop(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();

    event.stopped = true;
  }

  Event.Methods = {
    isLeftClick: isLeftClick,
    isMiddleClick: isMiddleClick,
    isRightClick: isRightClick,

    element: element,
    findElement: findElement,

    pointer: pointer,
    pointerX: pointerX,
    pointerY: pointerY,

    stop: stop
  };


  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (Prototype.Browser.IE) {
    function _relatedTarget(event) {
      var element;
      switch (event.type) {
        case 'mouseover': element = event.fromElement; break;
        case 'mouseout':  element = event.toElement;   break;
        default: return null;
      }
      return Element.extend(element);
    }

    Object.extend(methods, {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return '[object Event]' }
    });

    Event.extend = function(event, element) {
      if (!event) return false;
      if (event._extendedByPrototype) return event;

      event._extendedByPrototype = Prototype.emptyFunction;
      var pointer = Event.pointer(event);

      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
      });

      return Object.extend(event, methods);
    };
  } else {
    Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
    Object.extend(Event.prototype, methods);
    Event.extend = Prototype.K;
  }

  function _createResponder(element, eventName, handler) {
    var registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) {
      CACHE.push(element);
      registry = Element.retrieve(element, 'prototype_event_registry', $H());
    }

    var respondersForEvent = registry.get(eventName);
    if (Object.isUndefined(respondersForEvent)) {
      respondersForEvent = [];
      registry.set(eventName, respondersForEvent);
    }

    if (respondersForEvent.pluck('handler').include(handler)) return false;

    var responder;
    if (eventName.include(":")) {
      responder = function(event) {
        if (Object.isUndefined(event.eventName))
          return false;

        if (event.eventName !== eventName)
          return false;

        Event.extend(event, element);
        handler.call(element, event);
      };
    } else {
      if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
       (eventName === "mouseenter" || eventName === "mouseleave")) {
        if (eventName === "mouseenter" || eventName === "mouseleave") {
          responder = function(event) {
            Event.extend(event, element);

            var parent = event.relatedTarget;
            while (parent && parent !== element) {
              try { parent = parent.parentNode; }
              catch(e) { parent = element; }
            }

            if (parent === element) return;

            handler.call(element, event);
          };
        }
      } else {
        responder = function(event) {
          Event.extend(event, element);
          handler.call(element, event);
        };
      }
    }

    responder.handler = handler;
    respondersForEvent.push(responder);
    return responder;
  }

  function _destroyCache() {
    for (var i = 0, length = CACHE.length; i < length; i++) {
      Event.stopObserving(CACHE[i]);
      CACHE[i] = null;
    }
  }

  var CACHE = [];

  if (Prototype.Browser.IE)
    window.attachEvent('onunload', _destroyCache);

  (function(){
    if (!window.addEventListener) return;

    var match = /webkit\/(\d+(?:\.\d+)?)/i.exec(window.navigator.userAgent);
    if (match && match[1]) {
      var version = parseFloat(match[1]);
      if (!isNaN(version) && version < 525.27) {
        window.addEventListener('unload', Prototype.emptyFunction, false);
      }
    }
  })();

  var _getDOMEventName = Prototype.K,
      translations = { mouseenter: "mouseover", mouseleave: "mouseout" };

  if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
    _getDOMEventName = function(eventName) {
      return (translations[eventName] || eventName);
    };
  }

  function observe(element, eventName, handler) {
    element = $(element);

    var responder = _createResponder(element, eventName, handler);

    if (!responder) return element;

    if (eventName.include(':')) {
      if (element.addEventListener)
        element.addEventListener("dataavailable", responder, false);
      else {
        element.attachEvent("ondataavailable", responder);
        element.attachEvent("onfilterchange", responder);
      }
    } else {
      var actualEventName = _getDOMEventName(eventName);

      if (element.addEventListener)
        element.addEventListener(actualEventName, responder, false);
      else
        element.attachEvent("on" + actualEventName, responder);
    }

    return element;
  }

  function stopObserving(element, eventName, handler) {
    element = $(element);

    var registry = Element.retrieve(element, 'prototype_event_registry');
    if (!registry) return element;

    if (!eventName) {
      registry.each( function(pair) {
        var eventName = pair.key;
        stopObserving(element, eventName);
      });
      return element;
    }

    var responders = registry.get(eventName);
    if (!responders) return element;

    if (!handler) {
      responders.each(function(r) {
        stopObserving(element, eventName, r.handler);
      });
      return element;
    }

    var responder = responders.find( function(r) { return r.handler === handler; });
    if (!responder) return element;

    if (eventName.include(':')) {
      if (element.removeEventListener)
        element.removeEventListener("dataavailable", responder, false);
      else {
        element.detachEvent("ondataavailable", responder);
        element.detachEvent("onfilterchange",  responder);
      }
    } else {
      var actualEventName = _getDOMEventName(eventName);
      if (element.removeEventListener)
        element.removeEventListener(actualEventName, responder, false);
      else
        element.detachEvent('on' + actualEventName, responder);
    }

    registry.set(eventName, responders.without(responder));

    return element;
  }

  function fire(element, eventName, memo, bubble) {
    element = $(element);

    if (Object.isUndefined(bubble))
      bubble = true;

    if (element == document && document.createEvent && !element.dispatchEvent)
      element = document.documentElement;

    var event;
    if (document.createEvent) {
      event = document.createEvent('HTMLEvents');
      event.initEvent('dataavailable', true, true);
    } else {
      event = document.createEventObject();
      event.eventType = bubble ? 'ondataavailable' : 'onfilterchange';
    }

    event.eventName = eventName;
    event.memo = memo || { };

    if (document.createEvent)
      element.dispatchEvent(event);
    else
      element.fireEvent(event.eventType, event);

    return Event.extend(event);
  }


  Object.extend(Event, Event.Methods);

  Object.extend(Event, {
    fire:          fire,
    observe:       observe,
    stopObserving: stopObserving
  });

  Element.addMethods({
    fire:          fire,

    observe:       observe,

    stopObserving: stopObserving
  });

  Object.extend(document, {
    fire:          fire.methodize(),

    observe:       observe.methodize(),

    stopObserving: stopObserving.methodize(),

    loaded:        false
  });

  if (window.Event) Object.extend(window.Event, Event);
  else window.Event = Event;
})();

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

  var timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearTimeout(timer);
    document.loaded = true;
    document.fire('dom:loaded');
  }

  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.stopObserving('readystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }

  function pollDoScroll() {
    try { document.documentElement.doScroll('left'); }
    catch(e) {
      timer = pollDoScroll.defer();
      return;
    }
    fireContentLoadedEvent();
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.observe('readystatechange', checkReadyState);
    if (window == top)
      timer = pollDoScroll.defer();
  }

  Event.observe(window, 'load', fireContentLoadedEvent);
})();

Element.addMethods();

/*--------------------------------------------------------------------------*/

(function() {
  window.Selector = Class.create({
    initialize: function(expression) {
      this.expression = expression.strip();
    },

    findElements: function(rootElement) {
      return Prototype.Selector.select(this.expression, rootElement);
    },

    match: function(element) {
      return Prototype.Selector.match(element, this.expression);
    },

    toString: function() {
      return this.expression;
    },

    inspect: function() {
      return "#<Selector: " + this.expression + ">";
    }
  });

  Object.extend(Selector, {
    matchElements: Prototype.Selector.filter,

    findElement: function(elements, expression, index) {
      index = index || 0;
      var matchIndex = 0, element;
      for (var i = 0, length = elements.length; i < length; i++) {
        element = elements[i];
        if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
          return Element.extend(element);
        }
      }
    },

    findChildElements: function(element, expressions) {
      var selector = expressions.toArray().join(', ');
      return Prototype.Selector.select(selector, element || document);
    }
  });
})();

Prototype.falseFunction = function () { return false; };

Element.addMethods({
  makeUnselectable: (function () {
    var style = document.documentElement.style;

    var selectProp = 'userSelect' in style
      ? 'userSelect'
      : 'MozUserSelect' in style
        ? 'MozUserSelect'
        : 'WebkitUserSelect' in style
          ? 'WebkitUserSelect'
          : 'KhtmlUserSelect' in style
            ? 'KhtmlUserSelect'
            : '';

    function makeUnselectable(element) {
      if (typeof element.onselectstart !== 'undefined') {
        element.onselectstart = Prototype.falseFunction;
      }
      if (selectProp) {
        element.style[selectProp] = 'none';
      }
      else if (typeof element.unselectable == 'string') {
        element.unselectable = 'on';
      }
      return element;
    }
    return makeUnselectable;
  })()
});

Element.addMethods('button', {
  enable: Field.enable,
  disable: Field.disable
});

/* speed up toJSON on arrays by not using `each` */
Array.prototype.toJSON = function() {
  var results = [];
  for (var i = 0, len = this.length; i < len; i++) {
    var value = Object.toJSON(this[i]);
    if (typeof value !== 'undefined') {
      results.push(value);
    }
  }
  return "[" + results.join(", ") + "]";
};

(function(){

  function getScript(url, callback) {
  	var headEl = document.getElementsByTagName("head")[0],
  	    scriptEl = document.createElement('script'),
  	    loading = true;

  	scriptEl.type = 'text/javascript';
  	scriptEl.setAttribute('runat', 'server');
  	scriptEl.onload = scriptEl.onreadystatechange = function(e) {
  	  if (loading) {
  	    if (typeof this.readyState == 'string' &&
  	        this.readyState !== 'loaded' &&
  	        this.readyState !== 'complete') return;
    	  loading = false;
    		callback(e || window.event);
    		scriptEl = scriptEl.onload = scriptEl.onreadystatechange = null;
    	}
  	};
  	scriptEl.src = url;
  	headEl.appendChild(scriptEl);
  }

  function getScriptJaxer(url, callback) {
    Jaxer.load(url);
    callback();
  }

  Prototype.getScript = getScript;

  var Jaxer = this.Jaxer;
  if (Jaxer && Jaxer.load) {
    Prototype.getScript = getScriptJaxer;
  }
})();
/*
  Copyright (c) Garrett Smith.
  Licensed under the AFL license.
*/

/**
 * @fileoverview
 * <code>APE</code> provides core features, including namespacing and object creational aspects.
 *
 * <h3>APE JavaScript Library</h3>
 * <p>
 * Released under Academic Free Licence 3.0.
 * </p>
 *
 * @author Garrett Smith
 */

/** @name APE
 * @namespace */
if(APE !== undefined) throw Error("APE is already defined.");
var APE = {

    /**
     * @memberOf APE
     * @description Prototype inheritance.
     * @param {Object} subclass
     * @param {Object} superclass
     * @param {Object} mixin If present, <var>mixin</var>'s own properties are copied to receiver
     * using APE.mixin(subclass.prototoype, superclass.prototype).
     */
    extend : function(subclass, superclass, mixin) {
        if(arguments.length === 0) return;
        var f = arguments.callee, subp;
        f.prototype = superclass.prototype;
        subclass.prototype = subp = new f;
        if(typeof mixin == "object")
            APE.mixin(subp, mixin);
        subp.constructor = subclass;
        return subclass;
    },

    /**
     * Shallow copy of properties; does not look up prototype chain.
     * Copies all properties in s to r, using hasOwnProperty.
     * @param {Object} r the receiver of properties.
     * @param {Object} s the supplier of properties.
     * Accounts for JScript DontEnum bug for valueOf and toString.
     * @return {Object} r the receiver.
     */
    mixin : function(r, s) {
        var jscriptSkips = ['toString', 'valueOf'],
            prop,
            i = 0,
            skipped;
        for(prop in s) {
            if(s.hasOwnProperty(prop))
                r[prop] = s[prop];
        }
        for( ; i < jscriptSkips.length; i++) {
            skipped = jscriptSkips[i];
            if(s.hasOwnProperty(skipped))
                r[skipped] = s[skipped];
        }
        return r;
    },

    toString : function() { return "[APE JavaScript Library]"; },

    /** Creational method meant for being cross-cut.
     * Uses APE.newApply to create
     * @param {HTMLElement} el An element. If el does not have
     * an ID, then an ID will be automatically generated, based on the
     * constructor's (this) identifier, or, If this is anonymous, "APE".
     * @requires {Object} an object to be attached to as a property.
     * @aspect
     * @scope {Function} that accepts an HTMLElement for
     * its first argument.
     * APE.getByNode is intended to be bouund to a constructor function.
     * @return <code>{new this(el [,args...])}</code>
     */
    getByNode : function(el) {
        var id = el.id,
            fName;
        if(!id) {
            if(!APE.getByNode._i) APE.getByNode._i = 0;
            fName = APE.getFunctionName(this);
            if(!fName) fName = "APE";
            id = el.id = fName+"_" + (APE.getByNode._i++);
        }
        if(!this.hasOwnProperty("instances")) this.instances = {};
        return this.instances[id] || (this.instances[id] = APE.newApply(this, arguments));
    },

    /** Tries to get a name of a function object, returns "" if anonymous.
     */
    getFunctionName : function(fun) {
        if(typeof fun.name == "string") return fun.name;
        var name = Function.prototype.toString.call(fun).match(/\s([a-z]+)\(/i);
        return name && name[1]||"";
    },

    /** Creational method meant for being cross-cut.
     * @param {HTMLElement} el An element that has an id.
     * @requires {Object} an object to bind to.
     * @aspect
     * @description <code>getById</code> must be assigned to a function constructor
     * that accepts an HTMLElement's <code>id</code> for
     * its first argument.
     * @example <pre>
     * function Slider(el, config){ }
     * Slider.getById = APE.getById;
     * </pre>
     * This allows for implementations to use a factory method with the constructor.
     * <pre>
     * Slider.getById( "weight", 1 );
     * </pre>
     * Subsequent calls to:
     * <pre>
     * Slider.getById( "weight" );
     * </pre>
     * will return the same Slider instance.
     * An <code>instances</code> property is added to the constructor object
     * that <code>getById</code> is assigned to.
     * @return <pre>new this(id [,args...])</pre>
     */
    getById : function(id) {
        if(!this.hasOwnProperty("instances")) this.instances = {};
        return this.instances[id] || (this.instances[id] = APE.newApply(this, arguments));
    },

    /** Creates a Factory method out of a function.
     * @param {Function} constructor
     * @param {Object} prototype
     * @memberOf APE
     */
    createFactory : function(constructor, prot) {
        var baseObject = {},
            instances = baseObject.instances = {}; // Export, for purge or cleanup.
        if(prot) {
            constructor.prototype = prot;
        }
        baseObject.getById = getById;
        return baseObject;
        function getById(id) {
            return instances[id] || (instances[id] = APE.newApply(constructor, arguments));
        }
    },

    newApply : (function() {
        function F(){}
        return newApply;
        /**
         * @param {Function} constructor constructor to be invoked.
         * @param {Array} args arguments to pass to the constructor.
         * Instantiates a constructor and uses apply().
         * @memberOf APE
         */
        function newApply(constructor, args) {
            var i;
            F.prototype = constructor.prototype;// Copy prototype.
            F.prototype.constructor = constructor;
            i = new F;
            constructor.apply(i, args); // Apply the original constructor.
            return i;
        }
    })(),

    /** Throws the error in a setTimeout 1ms.
     *  Deferred errors are useful for Event Notification systems,
     * Animation, and testing.
     * @param {Error} error that occurred.
     */
    deferError : function(error) {
        throw error;
    }
};

(function(){

    APE.namespace = namespace;

    /**
     * @memberOf APE
     * @description creates a namespace split on "."
     * does <em>not</em> automatically add APE to the front of the chain, as YUI does.
     * @param {String} s the namespace. "foo.bar" would create a namespace foo.bar, but only
     * if that namespace did not exist.
     * @return {Package} the namespace.
     */
    function namespace(s) {
        var packages = s.split("."),
            pkg = window,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            qName = pkg.qualifiedName,
            i = 0,
            len = packages.length,
            name;
        for (; i < len; i++) {
            name = packages[i];

            if(!hasOwnProperty.call(pkg, name)) {
                pkg[name] = new Package((qName||"APE")+"."+name);
            }
            pkg = pkg[name];
        }

        return pkg;
    }

    Package.prototype.toString = function(){
        return"["+this.qualifiedName+"]";
    };

    /* constructor Package
     */
    function Package(qualifiedName) {
        this.qualifiedName = qualifiedName;
    }
})();

(function(){
/**@class
 * A safe patch to the Object object. This patch addresses a bug that only affects Opera.
 * <strong>It does <em>not</em> affect any for-in loops in any browser</strong> (see tests).
 */
var O = Object.prototype, hasOwnProperty = O.hasOwnProperty;
if(typeof window != "undefined" && hasOwnProperty && !hasOwnProperty.call(window, "Object")) {
/**
 * @overrides Object.prototype.hasOwnProperty
 * @method
 * This is a conditional patch that affects some versions of Opera.
 * It is perfectly safe to do this and does not affect enumeration.
 */
    Object.prototype.hasOwnProperty = function(p) {
        if(this === window) return (p in this) && (O[p] !== this[p]);
        return hasOwnProperty.call(this, p);
    };
}
})();/**
 * @fileoverview
 * EventPublisher
 *
 * Released under Academic Free Licence 3.0.
 * @author Garrett Smith
 * @class
 * <code>APE.EventPublisher</code> can be used for native browser events or custom events.
 *
 * <p> For native browser events, use <code>APE.EventPublisher</code>
 * steals the event handler off native elements and creates a callStack.
 * that fires in its place.
 * </p>
 * <p>
 * There are two ways to create custom events.
 * </p>
 * <ol>
 * <li>Create a function on the object that fires the "event", then call that function
 * when the event fires (this happens automatically with native events).
 * </li>
 * <li>
 * Instantiate an <code>EventPublisher</code> using the constructor, then call <code>fire</code>
 * when the callbacks should be run.
 * </li>
 * </ol>
 * <p>
 * An <code>EventPublisher</code> itself publishes <code>beforeFire</code> and <code>afterFire</code>.
 * This makes it possible to add AOP before advice to the callStack.
 * </p><p>
 * adding before-before advice is possible, but will impair performance.
 * Instead, add multiple beforeAdvice with:
 * <code>publisher.addBefore(fp, thisArg).add(fp2, thisArg);</code>
 * </p><p>
 * There are no <code>beforeEach</code> and <code>afterEach</code> methods; to create advice
 * for each callback would require modification
 * to the registry (see comments below). I have not yet found a real need for this.
 * </p>
 */
/**
 * @constructor
 * @description creates an <code>EventPublisher</code> with methods <code>add()</code>,
 * <code>fire</code>, et c.
 */
APE.EventPublisher = function(src, type) {
    this.src = src;
    this._callStack = [];
    this.type = type;
};

APE.EventPublisher.prototype = {

/**
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this;
 */
    add : function(fp, thisArg) {
        this._callStack.push([fp, thisArg||this.src]);
        return this;
    },
/**  Adds beforeAdvice to the callStack. This fires before the callstack.
 *  @param {Function:boolean} fp the callback function that gets called when src[sEvent] is called.
 *  function's returnValue proceed false stops the callstack and returns false to the original call.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this;
 */
    addBefore : function(f, thisArg) {
        return APE.EventPublisher.add(this, "beforeFire", f, thisArg);
    },

/**  Adds afterAdvice to the callStack. This fires after the callstack.
 *  @param {Function:boolean} fp the callback function that gets called when src[sEvent] is called.
 *  function's returnValue of false returns false to the original call.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this;
 */
    addAfter : function(f, thisArg) {
        return APE.EventPublisher.add(this, "afterFire", f, thisArg);
    },

    /**
     * @param {String} "beforeFire", "afterFire" conveneince.
     * @return {EventPublisher} this;
     */
    getEvent : function(type) {
        return APE.EventPublisher.get(this, type);
    },

/**  Removes fp from callstack.
 *  @param {Function:boolean} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {Function} the function that was passed in, or null if not found;
 */
    remove : function(fp, thisArg) {
        var cs = this._callStack, i = 0, len, call;
        if(!thisArg) thisArg = this.src;
        for(len = cs.length; i < len; i++) {
            call = cs[i];
            if(call[0] === fp && call[1] === thisArg) {
                return cs.splice(i, 1);
            }
        }
        return null;
    },

/**  Removes fp from callstack's beforeFire.
 *  @param {Function:boolean} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {Function} the function that was passed in, or null if not found (uses remove());
 */
    removeBefore : function(fp, thisArg) {
        return this.getEvent("beforeFire").remove(fp, thisArg);
    },


/**  Removes fp from callstack's afterFire.
 *  @param {Function:boolean} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {Function} the function that was passed in, or null if not found (uses remove());
 */
    removeAfter : function(fp, thisArg) {
        return this.getEvent("afterFire").remove(fp, thisArg);
    },

/** Fires the event. */
    fire : function(payload) {
        return APE.EventPublisher.fire(this)(payload);
    },

/** helpful debugging info */
    toString : function() {
        return  "APE.EventPublisher: {src=" + this.src + ", type=" + this.type +
             ", length="+this._callStack.length+"}";
    }
};

/**
 *  @static
 *  @param {Object} src the object which calls the function
 *  @param {String} sEvent the function that gets called.
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  @param {Object} thisArg the context that the function executes in.
 */
APE.EventPublisher.add = function(src, sEvent, fp, thisArg) {
    return APE.EventPublisher.get(src, sEvent).add(fp, thisArg);
};

/**
 * @static
 * @private
 * @memberOf {APE.EventPublisher}
 * @return {boolean} false if any one of callStack's methods return false.
 */
APE.EventPublisher.fire = function(publisher) {

    return fireEvent;
    function fireEvent(e) {
        var preventDefault = false,
            i = 0, len,
            cs = publisher._callStack, csi;

        if(typeof publisher.beforeFire == "function") {
            try {
                if(publisher.beforeFire(e) == false)
                    preventDefault = true;
            } catch(ex){APE.deferError(ex);}
        }

        for(len = cs.length; i < len; i++) {
            csi = cs[i];
            try {
                if(csi[0].call(csi[1], e || window.event) == false)
                    preventDefault = true; // continue main callstack and return false afterwards.
            }
            catch(ex) {
                APE.deferError(ex);
            }
        }
        if(typeof publisher.afterFire == "function") {
            if(publisher.afterFire(e) == false)
                preventDefault = true;
        }
        return !preventDefault;
    }
};

/**
 * @static
 * @param {Object} src the object which calls the function
 * @param {String} sEvent the function that gets called.
 * @memberOf {APE.EventPublisher}
 * Looks for an APE.EventPublisher in the Registry.
 * If none found, creates and adds one to the Registry.
 */
APE.EventPublisher.get = function(src, sEvent) {

    var publisherList = this.Registry.hasOwnProperty(sEvent) && this.Registry[sEvent] ||
        (this.Registry[sEvent] = []),
        i = 0, len = publisherList.length,
        publisher;

    for(; i < len; i++)
        if(publisherList[i].src === src)
            return publisherList[i];

    publisher = new APE.EventPublisher(src, sEvent);
    if(src[sEvent])
        publisher.add(src[sEvent], src);
    src[sEvent] = this.fire(publisher);
    publisherList[publisherList.length] = publisher;
    return publisher;
};

/**
 * Map of [APE.EventPublisher], keyed by type.
 * @private
 * @static
 * @memberOf {APE.EventPublisher}
 */
APE.EventPublisher.Registry = {};

/**
 * @static
 * @memberOf {APE.EventPublisher}
 * called onunload, automatically onunload.
 * This is only called for if window.CollectGarbage is
 * supported. IE has memory leak problems; other browsers have fast forward/back,
 * but that won't work if there's an onunload handler.
 */
APE.EventPublisher.cleanUp = function() {
    var type, publisherList, publisher, i, len;
    for(type in this.Registry) {
        publisherList = this.Registry[type];
        for(i = 0, len = publisherList.length; i < len; i++) {
            publisher = publisherList[i];
            publisher.src[publisher.type] = null;
        }
    }
};
if(window.CollectGarbage)
    APE.EventPublisher.get( window, "onunload" ).addAfter( APE.EventPublisher.cleanUp, APE.EventPublisher );/**dom.js rollup: constants.js, viewport-f.js, position-f.js, classname-f.js,  traversal-f.js, Event.js, Event-coords.js, style-f.js, gebi-f.js */
APE.namespace("APE.dom" );
(function(){
	var dom = APE.dom,
	docEl = document.documentElement,
	textContent = "textContent",
	view = document.defaultView;

    dom.IS_COMPUTED_STYLE = (typeof view != "undefined" && "getComputedStyle" in view);
	dom.textContent = textContent in docEl ? textContent : "innerText";
})();/**
 * @author Garret Smith
 */


(function() {

    APE.mixin(APE.dom, {
        getScrollOffsets : getScrollOffsets,
        getViewportDimensions : getViewportDimensions
    });


    var documentElement = "documentElement",
        docEl = document[documentElement],
        IS_BODY_ACTING_ROOT = docEl && docEl.clientWidth === 0;
    docEl = null;

    /** @memberOf APE.dom
     * @name getScrollOffsets
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     * This will exhibit a bug in Mozilla, which is often 5-7 pixels off.
     */
    function getScrollOffsets(win) {
        win = win || window;
        var f, d = win.document, node = d[documentElement];
        if("pageXOffset"in win)
            f = function() {
                return{ left:win.pageXOffset, top: win.pageYOffset};
            };
        else {
            if(IS_BODY_ACTING_ROOT) node = d.body;
            f = function() {
              return{ left : node.scrollLeft, top : node.scrollTop };
            };
        }
        d = null;
        this.getScrollOffsets = f;
        return f();
    }

    /** @memberOf APE.dom
     * @name getViewportDimensions
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     */
    function getViewportDimensions(win) {
        win = win || window;
        var node = win.document, d = node, propPrefix = "client",
            wName, hName;

        if(typeof d.clientWidth == "number");

        else if(IS_BODY_ACTING_ROOT || isDocumentElementHeightOff(win)) {
            node = d.body;

        } else if(d[documentElement].clientHeight > 0){
            node = d[documentElement];

        } else if(typeof innerHeight == "number") {
            node = win;
            propPrefix = "inner";
        }
        wName = propPrefix + "Width";
        hName = propPrefix + "Height";

        return (this.getViewportDimensions = function() {
            return{width: node[wName], height: node[hName]};
        })();

        function isDocumentElementHeightOff(win){
            var d = win.document,
                div = d.createElement('div');
            div.style.height = "2500px";
            d.body.insertBefore(div, d.body.firstChild);
            var r = d[documentElement].clientHeight > 2400;
            d.body.removeChild(div);
            return r;
        }
    }
})();/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */

(function() {
    APE.mixin(
        APE.dom,
            /** @scope APE.dom */ {
            getOffsetCoords : getOffsetCoords,
            isAboveElement : isAboveElement,
            isBelowElement : isBelowElement,
            isInsideElement: isInsideElement
    });

    var doc = this.document,
        inited,
        documentElement = doc.documentElement,
        round = Math.round, max = Math.max,

        IS_BODY_ACTING_ROOT = documentElement && documentElement.clientWidth === 0,

        IS_CLIENT_TOP_SUPPORTED = 'clientTop'in documentElement,

        TABLE = /^h/.test(documentElement.tagName) ? "table" : "TABLE",

        IS_CURRENT_STYLE_SUPPORTED = 'currentStyle'in documentElement,

        IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET,


        IS_BODY_MARGIN_INHERITED,
        IS_BODY_TOP_INHERITED,
        IS_BODY_OFFSET_EXCLUDING_MARGIN,

        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET,
        IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH,

        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED,

        IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING,
        IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD,
        IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD,
        IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN,


        IS_COMPUTED_STYLE_SUPPORTED = doc.defaultView
            && typeof doc.defaultView.getComputedStyle != "undefined",
        getBoundingClientRect = "getBoundingClientRect",
        relative = "relative",
        borderTopWidth = "borderTopWidth",
        borderLeftWidth = "borderLeftWidth",
        positionedExp = /^(?:r|a)/,
        absoluteExp = /^(?:a|f)/;

    /**
     * @memberOf APE.dom
     * @param {HTMLElement} el you want coords of.
     * @param {HTMLElement} positionedContainer container to look up to. The container must have
     * position: (relative|absolute|fixed);
     *
     * @param {x:Number, y:Number} coords object to pass in.
     * @return {x:Number, y:Number} coords of el from container.
     *
     * Passing in a container will improve performance in browsers that don't support
     * getBoundingClientRect, but those that do will have a recursive call. Test accordingly.
     * <p>
     * Container is sometimes irrelevant. Container is irrelevant when comparing positions
     * of objects who do not share a common ancestor. In this case, pass in document.
     * </p>
     *<p>
     * Passing in re-used coords can improve performance in all browsers.
     * There is a side effect to passing in coords:
     * For drag drop operations, reuse coords:
     *</p>
     * <pre>
     * // Update our coords:
     * dom.getOffsetCoords(el, container, this.coords);
     * </pre>
     * Where <code>this.coords = {};</code>
     */
    function getOffsetCoords(el, container, coords) {

        var doc = el.ownerDocument,
            documentElement = doc.documentElement,
            body = doc.body;

        if(!container)
            container = doc;

        if(!coords)
            coords = {x:0, y:0};

        if(el === container) {
            coords.x = coords.y = 0;
            return coords;
        }
        if(getBoundingClientRect in el) {

            var rootBorderEl = IS_BODY_ACTING_ROOT ? body : documentElement,
                box = el[getBoundingClientRect](),
                x = box.left + max( documentElement.scrollLeft, body.scrollLeft ),
                y = box.top + max( documentElement.scrollTop, body.scrollTop ),
                bodyCurrentStyle,
                borderTop = rootBorderEl.clientTop,
                borderLeft = rootBorderEl.clientLeft;

            if(IS_CLIENT_TOP_SUPPORTED) {
                x -= borderLeft;
                y -= borderTop;
            }
            if(container !== doc) {
                box = getOffsetCoords(container, null);
                x -= box.x;
                y -= box.y;
                if(IS_BODY_ACTING_ROOT && container === body && IS_CLIENT_TOP_SUPPORTED) {
                    x -= borderLeft;
                    y -= borderTop;
                }
            }

            if(IS_BODY_ACTING_ROOT && IS_CURRENT_STYLE_SUPPORTED
                && container != doc && container !== body) {
                bodyCurrentStyle = body.currentStyle;
                x += parseFloat(bodyCurrentStyle.marginLeft)||0 +
                    parseFloat(bodyCurrentStyle.left)||0;
                y += parseFloat(bodyCurrentStyle.marginTop)||0 +
                     parseFloat(bodyCurrentStyle.top)||0;
            }
            coords.x = x;
            coords.y = y;

            return coords;
        }

        else if(IS_COMPUTED_STYLE_SUPPORTED) {
            if(!inited) init();

            var offsetLeft = el.offsetLeft,
                offsetTop = el.offsetTop,
                defaultView = doc.defaultView,
                cs = defaultView.getComputedStyle(el, '');
            if(cs.position == "fixed") {
                coords.x = offsetLeft + documentElement.scrollLeft;
                coords.y = offsetTop + documentElement.scrollTop;
                return coords;
            }
            var bcs = defaultView.getComputedStyle(body,''),
                isBodyStatic = !positionedExp.test(bcs.position),
                lastOffsetParent = el,
                parent = el.parentNode,
                offsetParent = el.offsetParent;

            for( ; parent && parent !== container; parent = parent.parentNode) {
                if(parent !== body && parent !== documentElement) {
                    offsetLeft -= parent.scrollLeft;
                    offsetTop -= parent.scrollTop;
                }
                if(parent === offsetParent) {
                    if(parent === body && isBodyStatic);
                    else {

                        if( !IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET &&
                            ! (parent.tagName === TABLE && IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET)) {
                                var pcs = defaultView.getComputedStyle(parent, "");
                                offsetLeft += parseFloat(pcs[borderLeftWidth])||0;
                                offsetTop += parseFloat(pcs[borderTopWidth])||0;
                        }
                        if(parent !== body) {
                            offsetLeft += offsetParent.offsetLeft;
                            offsetTop += offsetParent.offsetTop;
                            lastOffsetParent = offsetParent;
                            offsetParent = parent.offsetParent; // next marker to check for offsetParent.
                        }
                    }
                }
            }



            var bodyOffsetLeft = 0,
                bodyOffsetTop = 0,
                isLastElementAbsolute,
                isLastOffsetElementPositioned,
                isContainerDocOrDocEl = container === doc || container === documentElement,
                dcs,
                lastOffsetPosition;

            if(lastOffsetParent != doc) {
                lastOffsetPosition = defaultView.getComputedStyle(lastOffsetParent,'').position;
                isLastElementAbsolute = absoluteExp.test(lastOffsetPosition);
                isLastOffsetElementPositioned = isLastElementAbsolute ||
                    positionedExp.test(lastOffsetPosition);
            }

            if(
                (lastOffsetParent === el && el.offsetParent === body && !IS_BODY_MARGIN_INHERITED
                && container !== body && !(isBodyStatic && IS_BODY_OFFSET_EXCLUDING_MARGIN))
                || (IS_BODY_MARGIN_INHERITED && lastOffsetParent === el && !isLastOffsetElementPositioned)
                || !isBodyStatic
                && isLastOffsetElementPositioned
                && IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED
                && isContainerDocOrDocEl) {
                    bodyOffsetTop += parseFloat(bcs.marginTop)||0;
                    bodyOffsetLeft += parseFloat(bcs.marginLeft)||0;
            }

            if(container === body) {
                dcs = defaultView.getComputedStyle(documentElement,'');
                if(
                    (!isBodyStatic &&
                        ((IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD && !isLastElementAbsolute)
                        ||
                        (IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD && isLastElementAbsolute))
                    )
                    || isBodyStatic && IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING
                    ) {
                    bodyOffsetTop -= parseFloat(dcs.paddingTop)||0;
                    bodyOffsetLeft -= parseFloat(dcs.paddingLeft)||0;
                }

                if(IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN){
                    if(!isLastOffsetElementPositioned
                        || isLastOffsetElementPositioned && !isBodyStatic)
                    bodyOffsetTop -= parseFloat(dcs.marginTop)||0;
                    bodyOffsetLeft -= parseFloat(dcs.marginLeft)||0;
                }
            }
            if(isBodyStatic) {
                if(IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH
                    || (!isLastElementAbsolute && !IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET
                        && isContainerDocOrDocEl)) {
                           bodyOffsetTop += parseFloat(bcs[borderTopWidth]);
                           bodyOffsetLeft += parseFloat(bcs[borderLeftWidth]);
                }
            }

            else if(IS_BODY_OFFSET_EXCLUDING_MARGIN) {
                if(isContainerDocOrDocEl) {
                    if(!IS_BODY_TOP_INHERITED) {

                         bodyOffsetTop += parseFloat(bcs.top)||0;
                         bodyOffsetLeft += parseFloat(bcs.left)||0;

                        if(isLastElementAbsolute && IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET) {
                            bodyOffsetTop += parseFloat(bcs[borderTopWidth]);
                            bodyOffsetLeft += parseFloat(bcs[borderLeftWidth]);
                        }
                    }

                    if(container === doc && !isBodyStatic
                        && !IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD) {
                        if(!dcs) dcs = defaultView.getComputedStyle(documentElement,'');
                        bodyOffsetTop += parseFloat(dcs.paddingTop)||0;
                        bodyOffsetLeft += parseFloat(dcs.paddingLeft)||0;
                    }
                }
                else if(IS_BODY_TOP_INHERITED) {
                    bodyOffsetTop -= parseFloat(bcs.top);
                    bodyOffsetLeft -= parseFloat(bcs.left);
                }
                if(IS_BODY_MARGIN_INHERITED && (!isLastOffsetElementPositioned || container === body)) {
                    bodyOffsetTop -= parseFloat(bcs.marginTop)||0;
                    bodyOffsetLeft -= parseFloat(bcs.marginLeft)||0;
                }
            }
            coords.x = round(offsetLeft + bodyOffsetLeft);
            coords.y = round(offsetTop + bodyOffsetTop);

            return coords;
        }
    }

    function init() {
		inited = true;
        var body = doc.body;
        if(!body) return;
        var marginTop = "marginTop", position = "position", padding = "padding",
            stat = "static",
            border = "border", s = body.style,
            bCssText = s.cssText,
            bv = '1px solid transparent',
            z = "0",
            one = "1px",
            offsetTop = "offsetTop",
            ds = documentElement.style,
            dCssText = ds.cssText,
            x = doc.createElement('div'),
            xs = x.style,
            table = doc.createElement(TABLE);

        s[padding] = s[marginTop] = s.top = z;
        ds.position = stat;

        s[border] = bv;

        xs.margin = z;
        xs[position] = stat;

        x = body.insertBefore(x, body.firstChild);
        IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET = (x[offsetTop] === 1);

        s[border] = z;

        table.innerHTML = "<tbody><tr><td>x</td></tr></tbody>";
        table.style[border] = "7px solid";
        table.cellSpacing = table.cellPadding = z;

        body.insertBefore(table, body.firstChild);
        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET = table.getElementsByTagName("td")[0].offsetLeft === 7;

        body.removeChild(table);

        s[marginTop] = one;
        s[position] = relative;
        IS_BODY_MARGIN_INHERITED = (x[offsetTop] === 1);


        IS_BODY_OFFSET_EXCLUDING_MARGIN = body[offsetTop] === 0;
        s[marginTop] = z;
        s.top = one;
        IS_BODY_TOP_INHERITED = x[offsetTop] === 1;

        s.top = z;
        s[marginTop] = one;
        s[position] = xs[position] = relative;
        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED = x[offsetTop] === 0;

        xs[position] = "absolute";
        s[position] = stat;
         if(x.offsetParent === body) {
            s[border] = bv;
            xs.top = "2px";
            IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH = x[offsetTop] === 1;
            s[border] = z;

            xs[position] = relative;
            ds[padding] = one;
            s[marginTop] = z;

            IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING = x[offsetTop] === 3;

            s[position] = relative;
            IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD = x[offsetTop] === 3;

            xs[position] = "absolute";
            IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD = x[offsetTop] === 3;

            ds[padding] = z;
            ds[marginTop] = one;

            IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN = x[offsetTop] === 3;
        }


        body.removeChild(x);
        s.cssText = bCssText||"";
        ds.cssText = dCssText||"";
    }

    /**
     * @memberOf APE.dom
     * @return {boolean} true if a is vertically within b's content area (and does not overlap,
     * top nor bottom).
     */
    function isInsideElement(a, b) {
        var aTop = getOffsetCoords(a).y,
            bTop = getOffsetCoords(b).y;
        return aTop + a.offsetHeight <= bTop + b.offsetHeight && aTop >= bTop;
    }

    /**
     * @memberOf APE.dom
     * @return {boolean} true if a overlaps the top of b's content area.
     */
    function isAboveElement(a, b) {
        return (getOffsetCoords(a).y <= getOffsetCoords(b).y);
    }

    /**
     * @memberOf APE.dom
     * @return {boolean} true if a overlaps the bottom of b's content area.
     */
    function isBelowElement(a, b) {
        return (getOffsetCoords(a).y + a.offsetHeight >= getOffsetCoords(b).y + b.offsetHeight);
    }

    isInsideElement = isAboveElement = isBelowElement = null;
})();
/**
 * @fileoverview dom ClassName Functions.
 * @namespace APE.dom
 * @author Garrett Smith
 * <p>
 * ClassName functions are added to APE.dom.
 * </p>
 */


(function() {
    APE.mixin(APE.dom,
        {
        hasToken : hasToken,
        removeClass : removeClass,
        addClass : addClass,
        hasClass: hasClass,
        getElementsByClassName : getElementsByClassName,
        findAncestorWithClass : findAncestorWithClass
    });

    var className = "className";

    /** @param {String} s string to search
     * @param {String} token white-space delimited token the delimiter of the token.
     * This is generally used with element className:
     * @example if(dom.hasToken(el.className, "menu")) // element has class "menu".
     */
    function hasToken (s, token) {
        return getTokenizedExp(token,"").test(s);
    }

    /** @param {HTMLElement} el
     * @param {String} klass className token(s) to be removed.
     * @description removes all occurances of <code>klass</code> from element's className.
     */
    function removeClass(el, klass) {
        var cn = el[className];
        if(!cn) return;
        if(cn === klass) {
            el[className] = "";
            return;
        }

        el[className] = normalizeString(cn.replace(getTokenizedExp(klass, "g")," "));
    }
    /** @param {HTMLElement} el
     * @param {String} klass className token(s) to be added.
     * @description adds <code>klass</code> to the element's class attribute, if it does not
     * exist.
     */
    function addClass(el, klass) {
        if(!el[className]) el[className] = klass;
        if(!getTokenizedExp(klass).test(el[className])) el[className] += " " + klass;
    }

    /** @param {HTMLElement} el
     * @param {String} klass value to be tested against
     * @description Checks whether an element has <code>klass</code> as part of its <code>className</code>
     */
    function hasClass(el, klass) {
      if (!el[className]) return false;
      return hasToken(el[className], klass);
    }

    var Exps = { };
    function getTokenizedExp(token, flag){
        var p = token + "$" + flag;
        return (Exps[p] || (Exps[p] = RegExp("(?:^|\\s)"+token+"(?:$|\\s)", flag)));
    }

    /** @param {HTMLElement} el
     * @param {String} tagName tagName to be searched. Use "*" for any tag.
     * @param {String} klass className token(s) to be added.
     * @return {Array|NodeList} Elements with the specified tagName and className.
     * Searches will generally be faster with a smaller HTMLCollection
     * and shorter tree.
     */
    function getElementsByClassName(el, tagName, klass){
        if(!klass) return [];
        tagName = tagName||"*";
        if(el.getElementsByClassName && (tagName === "*")) {
            return el.getElementsByClassName(klass);
        }
        var exp = getTokenizedExp(klass,""),
            collection = el.getElementsByTagName(tagName),
            len = collection.length,
            counter = 0,
            i,
            ret = Array(len);
        for(i = 0; i < len; i++){
            if(exp.test(collection[i][className]))
                ret[counter++] = collection[i];
        }
        ret.length = counter; // trim array.
        return ret;
    }

   /** Finds an ancestor with specified className
    * @param {Element|Document} [container] where to stop traversing up (optional).
    */
    function findAncestorWithClass(el, klass, container) {
        if(el == null || el === container)
            return null;
        var exp = getTokenizedExp(klass,""), parent;
        for(parent = el.parentNode;parent != container;){
            if( exp.test(parent[className]) )
                return parent;
            parent = parent.parentNode;
        }
        return null;
    }

var STRING_TRIM_EXP = /^\s+|\s+$/g,
    WS_MULT_EXP = /\s\s+/g;
function normalizeString(s) { return s.replace(STRING_TRIM_EXP,'').replace(WS_MULT_EXP, " "); }
})();
(function(){

    var docEl = document.documentElement,
        nodeType = "nodeType",
        tagName = "tagName",
        parentNode = "parentNode",
        compareDocumentPosition = "compareDocumentPosition",
        caseTransform = /^H/.test(docEl[tagName]) ? 'toUpperCase' : 'toLowerCase',
        tagExp = /^[A-Z]/;

    APE.mixin(
      APE.dom, {
        contains :                    getContains(),
        findAncestorWithAttribute :   findAncestorWithAttribute,
        findAncestorWithTagName :     findAncestorWithTagName,
        findNextSiblingElement :      findNextSiblingElement,
        findPreviousSiblingElement :  findPreviousSiblingElement,
        getChildElements :            getChildElements,
        isTagName:                    isTagName
    });

    /**
     * @memberOf APE.dom
     * @return {boolean} true if a contains b.
     * Internet Explorer's native contains() is different. It will return true for:
     * code body.contains(body);
     * Whereas APE.dom.contains will return false.
     */

    function getContains(){
        if(compareDocumentPosition in docEl)
            return function(el, b) {
                return (el[compareDocumentPosition](b) & 16) !== 0;
        };
        else if('contains'in docEl)
            return function(el, b) {
                return el !== b && el.contains(b);
        };
        return function(el, b) {
            if(el === b) return false;
            while(el != b && (b = b[parentNode]) !== null);
            return el === b;
        };
    }


    /**
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to start from.
     * @param {String} attName the name of the attribute.
     * @param {String} [value] the value of the attribute. If omitted, then only the
     * presence of attribute is checked and the value is anything.
     * @return {HTMLElement} closest ancestor with <code>attName</code> matching value.
     * Returns null if not found.
     */
    function findAncestorWithAttribute(el, attName, value) {
        for(var map, parent = el[parentNode];parent !== null;){
            map = parent.attributes;
            if(!map) return null;
            var att = map[attName];
            if(att && att.specified)
                if(att.value === value || (value === undefined))
                    return parent;
            parent = parent[parentNode];
        }
        return null;
    }

    function findAncestorWithTagName(el, tag) {
        tag = tag[caseTransform]();
        for(var parent = el[parentNode];parent !== null; ){
            if( parent[tagName] === tag )
                return parent;
            parent = parent[parentNode];
        }
        return null;
    }

    /** Filter out text nodes and, in IE, comment nodes. */
    function findNextSiblingElement(el) {
        for(var ns = el.nextSibling; ns !== null; ns = ns.nextSibling)
            if(ns[nodeType] === 1)
                return ns;
        return null;
    }

    function findPreviousSiblingElement(el) {
        for(var ps = el.previousSibling; ps !== null; ps = ps.previousSibling) {
            if(ps[nodeType] === 1)
                return ps;
        }
        return null;
    }

    function getChildElements(el) {
        var i = 0, ret = [], len, tag,
            cn = el.children || el.childNodes, c;

        for(len = cn.length; i < len; i++) {
            c = cn[i];
            if(c[nodeType] !== 1) continue;
            ret[ret.length] = c;
        }
        return ret;
    }

    /**
     * @memberOf APE.dom
     * @param {HTMLElement} el element whose <code>tagName</code> is to be tested
     * @param {String} tagName value to test against
     * @return {boolean} true if element's <code>tagName</code> matches given one
     */
    function isTagName(el, tagName) {
      return el.tagName == tagName[caseTransform]();
    }
})();/**
 * @requires APE.dom.Viewport
 */
/** @namespace APE.dom */


(function() {

    var hasEventTarget = "addEventListener"in this,
        eventTarget = hasEventTarget ? "target" : "srcElement";

    APE.mixin(
        APE.dom.Event = {}, {
            eventTarget : eventTarget,
            getTarget : getTarget,
            addCallback : addCallback,
            removeCallback : removeCallback,
            preventDefault : preventDefault,
            stopPropagation: stopPropagation
    });

    /**
     * @param {Event}
     */
    function stopPropagation(e) {
      e = e || window.event;
      var f;
      if (typeof e.stopPropagation == 'function') {
        f = function(e) {
          e.stopPropagation();
        }
      }
      else if ('cancelBubble' in e) {
        f = function(e) {
          e = e || window.event;
          e.cancelBubble = true;
        }
      }
      (APE.dom.Event.stopPropagation = f)(e);
    }

    function getTarget(e) {
        return (e || event)[eventTarget];
    }

    /**
     * If EventTarget is supported, cb (input param) is returned.
     * Otherwise, a closure is used to wrap a call to the callback
     * in context of o.
     * @param {Object} o the desired would-be EventTarget
     * @param {Function} cb the callback.
     */
    function getBoundCallback(o, cb) {
        return hasEventTarget ? cb : function(ev) {
            cb.call(o, ev);
        };
    }

    /**
     * addEventListener/attachEvent for DOM objects.
     * @param {Object} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {Function} cb If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function addCallback(o, type, cb) {
        if (hasEventTarget) {
            o.addEventListener(type, cb, false);
        } else {
            var bound = getBoundCallback(o, cb);
            o.attachEvent("on" + type, bound);
        }
        return bound||cb;
    }

    /**
     * removeEventListener/detachEvent for DOM objects.
     * @param {EventTarget} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {Function} bound If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function removeCallback(o, type, bound) {
        if (hasEventTarget) {
            o.removeEventListener(type, bound, false);
        } else {
            o.detachEvent("on" + type, bound);
        }
        return bound;
    }

    /**
     * @param {Event}
     */
    function preventDefault(ev) {
        ev = ev || event;
        if(typeof ev.preventDefault == "function") {
            ev.preventDefault();
        } else if('returnValue' in ev) {
            ev.returnValue = false;
        }
    }
})();/**
 * @requires viewport-f.js (for scrollOffsets in IE).
 */
APE.namespace("APE.dom.Event");
(function() {
    var dom = APE.dom,
        Event = dom.Event;
    Event.getCoords = getCoords;
    function getCoords(e) {
        var f;
        if ("pageX" in e) {
            f = function(e) {
                return {
                    x : e.pageX,
                    y : e.pageY
                };
            };
        } else {
            f = function(e) {
                var scrollOffsets = dom.getScrollOffsets();
                e = e || window.event;
                return {
                    x : e.clientX + scrollOffsets.left,
                    y : e.clientY + scrollOffsets.top
                }
            };
        }
        return (Event.getCoords = f)(e);
    }
})();/** @fileoverview
 * Getting computed styles, opacity functions.
 *
 * @author Garrett Smith
 */

/**@name APE.dom
 * @namespace*/

(function(){

    var multiLengthPropExp = /^(?:margin|(border)(Width)|padding)$/,
        borderRadiusExp = /^[a-zA-Z]*[bB]orderRadius$/,
        dom = APE.dom;

    APE.mixin(dom, /** @scope APE.dom */{
        /** @function */ getStyle : getStyle,
        setOpacity : setOpacity,
        getFilterOpacity : getFilterOpacity,

        multiLengthPropExp : /^(?:margin|(border)(Width)|padding)$/,
        borderRadiusExp : /^[a-zA-Z]*[bB]orderRadius$/,
        tryGetShorthandValues : tryGetShorthandValues,
        getCurrentStyleValueFromAuto : getCurrentStyleValueFromAuto,
        getCurrentStyleClipValues : getCurrentStyleClipValues,
        convertNonPixelToPixel : convertNonPixelToPixel
    });

    var view = document.defaultView,
        getCS = "getComputedStyle",
        IS_COMPUTED_STYLE = dom.IS_COMPUTED_STYLE,
        currentStyle = "currentStyle",
        style = "style";
    view = null;

    /**
     * Special method for a browser that supports el.filters and not style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to find opacity on.
     * @return {ufloat} [0-1] amount of opacity.
     * calling this method on a browser that does not support filters
     * results in 1 being returned.  Use dom.getStyle or dom.getCascadedStyle instead
     */
     function getFilterOpacity(el) {
        var filters = el.filters;
        if(!filters) return"";
        try { // Will throw error if no DXImageTransform.
            return filters['DXImageTransform.Microsoft.Alpha'].opacity/100;

        } catch(e) {
            try {
                return filters('alpha').opacity/100;
            } catch(e) {
                return 1;
            }
        }
    }

    /**
     * Cross-browser adapter method for style.filters vs style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to set opacity on.
     * @param {ufloat} i [0-1] the amount of opacity.
     * @return {ufloat} [0-1] amount of opacity.
     */
     function setOpacity(el, i) {
        var s = el[style], cs;
        if("opacity"in s) {
            s.opacity = i;
        }
        else if("filter"in s) {
            cs = el[currentStyle];
            s.filter = 'alpha(opacity=' + (i * 100) + ')';
            if(cs && ("hasLayout"in cs) && !cs.hasLayout) {
                style.zoom = 1;
            }
        }
    }

    /**
     * @memberOf APE.dom
     * @name getStyle
     *
     * @function
     * @description returns the computed style of property <code>p</code> of <code>el</code>.
     * Returns different results in IE, so user beware! If your
     * styleSheet has units like "em" or "in", this method does
     * not attempt to convert those to px.
     *
     * Use "cssFloat" for getting an element's float and special
     * "filters" treatment for "opacity".
     *
     * @param {HTMLElement} el the element to set opacity on.
     * @param {String} p the property to retrieve.
     * @return {String} the computed style value or the empty string if no value was found.
     */
    function getStyle(el, p) {
        var value = "", cs, matches, splitVal, i, len, doc = el.ownerDocument,
            defaultView = doc.defaultView;
        if(IS_COMPUTED_STYLE) {
            cs = defaultView[getCS](el, "");
            if(p == "borderRadius" && !("borderRadius"in cs)) {
                p = "MozBorderRadius"in cs ? "MozBorderRadius" :
                    "WebkitBorderRadius"in cs ? "WebkitBorderRadius" : "";
            }

            if(!(p in cs)) return "";
            value = cs[p];
            if(value === "") {
                value = (tryGetShorthandValues(cs, p)).join(" ");
            }
        }
        else {
            cs = el[currentStyle];
            if(p == "opacity" && !("opacity"in el[currentStyle]))
                value = getFilterOpacity(el);
            else {
                if(p == "cssFloat")
                    p = "styleFloat";
                value = cs[p];

                if(p == "clip" && !value && ("clipTop"in cs)) {
                    value = getCurrentStyleClipValues(el, cs);
                }
                else if(value == "auto")
                    value = getCurrentStyleValueFromAuto(el, p);
                else if(!(p in cs)) return "";
            }
            matches = nonPixelExp.exec(value);
            if(matches) {
                splitVal = value.split(" ");
                splitVal[0] = convertNonPixelToPixel( el, matches);
                for(i = 1, len = splitVal.length; i < len; i++) {
                    matches = nonPixelExp.exec(splitVal[i]);
                    splitVal[i] = convertNonPixelToPixel( el, matches);
                }
                value = splitVal.join(" ");
            }
        }
        return value;
    }

    function getCurrentStyleClipValues(el, cs) {
        var values = [], i = 0, prop;
        for( ;i < 4; i++){
            prop = props[i];
            clipValue = cs['clip'+prop];
            if(clipValue == "auto") {
                clipValue = (prop == "Left" || prop == "Top" ? "0px" : prop == "Right" ?
                    el.offsetWidth + px : el.offsetHeight + px);
            }
            values.push(clipValue);
        }
        return {
            top:values[0], right:values[1], bottom:values[2], left:values[3],
            toString : function() {return 'rect(' + values.join(' ')+')';}
        };
    }

    var sty = document.documentElement[style],
        floatProp = 'cssFloat'in sty ? 'cssFloat': 'styleFloat',
        props = ["Top", "Right", "Bottom", "Left"],
        cornerProps = ["Topright", "Bottomright", "Bottomleft", "Topleft"];
        sty = null;

    function getCurrentStyleValueFromAuto(el, p) {

        var s = el[style], v, borderWidth, doc = el.ownerDocument;
        if("pixelWidth"in s && pixelDimensionExp.test(p)) {
            var pp = "pixel" + (p.charAt(0).toUpperCase()) + p.substring(1);
            v = s[pp];
            if(v === 0) {
                if(p == "width") {
                    borderWidth = parseFloat(getStyle(el, "borderRightWidth"))||0;
                    paddingWidth = parseFloat(getStyle(el, "paddingLeft"))||0
                        + parseFloat(getStyle(el, "paddingRight"))||0;

                    return el.offsetWidth - el.clientLeft - borderWidth - paddingWidth + px;
                }
                else if(p == "height") {
                    borderWidth = parseFloat(getStyle(el, "borderBottomWidth"))||0;
                    paddingWidth = parseFloat(getStyle(el, "paddingTop"))||0
                        + parseFloat(getStyle(el, "paddingBottom"))||0;
                    return el.offsetHeight - el.clientTop - borderWidth + px;
                }
            }
            return s[pp] + px;
        }
        if(p == "margin" && el[currentStyle].position != "absolute" &&
          doc.compatMode != "BackCompat") {
            v = parseFloat(getStyle(el.parentNode, 'width')) - el.offsetWidth;
            if(v == 0) return "0px";
            v = "0px " + v;
            return v + " " + v;
        }

    }

    /**
     * Tries to get a shorthand value for margin|padding|borderWidth.
     * @return  {[string]} Either 4 values or, if all four values are equal,
     * then one collapsed value (in an array).
     */
    function tryGetShorthandValues(cs, p) {
        var multiMatch = multiLengthPropExp.exec(p),
            prefix, suffix,
            prevValue, nextValue,
            values,
            allEqual = true,
            propertyList,
            i = 1;

        if(multiMatch && multiMatch[0]) {
            propertyList = props;
            prefix = multiMatch[1]||multiMatch[0];
            suffix = multiMatch[2] || ""; // ["borderWidth", "border", "Width"]
        }
        else if(borderRadiusExp.test(p)) {
           propertyList = cornerProps;
            prefix = borderRadiusExp.exec(p)[0];
            suffix = "";
        }
        else return [""];

        prevValue = cs[prefix + propertyList[0] + suffix ];
        values = [prevValue];

        while(i < 4) {
            nextValue = cs[prefix + propertyList[i] + suffix];
            allEqual = allEqual && nextValue == prevValue;
            prevValue = nextValue;
            values[i++] = nextValue;
        }
        if(allEqual)
            return [prevValue];
        return values;
    }

    var nonPixelExp = /(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/,
        pixelDimensionExp = /width|height|top|left/,
        px = "px";

    /**
     * @requires nonPixelExp
     * @param {HTMLElement} el
     * @param {Array} String[] of matches from nonPixelExp.exec( val ).
     */
    function convertNonPixelToPixel(el, matches) {

        if(el.runtimeStyle) {


            var val = matches[0]; // grab the -1.2em or whatever.
            if(parseFloat(val) == 0) {
                return "0px";
            }

            var s = el[style],
                sLeft = s.left,
                rs = el.runtimeStyle,
                rsLeft = rs.left;

            rs.left = el[currentStyle].left;
            s.left = (val || 0);

            val = s.pixelLeft + px;
            s.left = sLeft;
            rs.left = rsLeft;
            return val;
        }
    }
})();/**
 * XXX: IE Fix for getElementById returning elements by name.
 */
(function(){
    var d = document, x = d.body, c,
        g = 'getElementById',
        orig = document[g];

    if(!x) return setTimeout(arguments.callee,50);

    try {
        c = d.createElement("<A NAME=0>");
        x.insertBefore(c, x.firstChild);
        if(d[g]('0')){
            x.removeChild(c);
            d[g] = getElementById;
        }
    } catch(x){}
    function getElementById(id) {
        var el = Function.prototype.call.call(orig, this, id), els, i;

        if(el && el.id == id) return el;
        els = this.getElementsByName(id);

        for(i = 0; i < els.length; i++)
            if(els[i].id === id) return els[i];
        return null;
    };
})();

(function(){

  APE.mixin(APE.dom, {
    selectOptionByValue: selectOptionByValue
  });

  /**
   * @method selectOptionByValue
   * @param {HTMLElement} element
   * @param {String} value
   */
  function selectOptionByValue(element, value) {
    for (var i=0, l=element.options.length; i<l; i++) {
      if (element.options[i].value === value) {
        element.selectedIndex = i;
        return;
      }
    }
  }
})();

(function(){

  var doc = this.document;

  APE.EventPublisher.remove = function(src, sEvent, fp, thisArg) {
    return APE.EventPublisher.get(src, sEvent).remove(fp, thisArg);
  };

  APE.getElement = function(id) {
    return typeof id === 'string' ? doc.getElementById(id) : id;
  };

})();

(function(){

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.util) {
    console.warn('Canvas.util is already defined');
    return;
  }

  /**
   * @static
   * Removes value from an array.
   * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
   * @param {Array} array
   * @param {Any} value
   * @return {Array} original array
   */
  function removeFromArray(array, value) {
    var idx = array.indexOf(value);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
    return array;
  };

  /**
   * @static
   * @method getRandomInt
   * @param {Number} min lower limit
   * @param {Number} max upper limit
   * @return {Number} random value (between min and max)
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @static
   * Transforms degrees to radians
   * @param {Number} degrees value in degrees
   * @return {Number} value in radians
   */
  var PiBy180 = Math.PI / 180;
  function degreesToRadians(degrees) {
    return degrees * PiBy180;
  }

  /**
   * A wrapper around Number#toFixed,
   * which contrary to native method returns number, not string
   * @param {Number | String} number number to operate on
   * @param {Number} fractionDigits number of fraction digits to "leave"
   * @return {Number}
   */
   function toFixed(number, fractionDigits) {
     return parseFloat(Number(number).toFixed(fractionDigits));
   }

  Canvas.util = {
    removeFromArray:        removeFromArray,
    degreesToRadians:       degreesToRadians,
    toFixed:                toFixed,
    getRandomInt:           getRandomInt
  };
})();
(function(){

  var Canvas = this.Canvas || (this.Canvas = { });

  var attributesMap = {
    'cx':             'left',
    'x':              'left',
    'cy':             'top',
    'y':              'top',
    'r':              'radius',
    'fill-opacity':   'opacity',
    'fill-rule':      'fillRule',
    'stroke-width':   'strokeWidth',
    'transform':      'transformMatrix'
  };

  /**
   * Returns an object of attributes' name/value, given element and an array of attribute names
   * Parses parent "g" nodes recursively upwards
   * @param {DOMElement} element Element to parse
   * @param {Array} attributes Array of attributes to parse
   * @return {Object} object containing parsed attributes' names/values
   */
  function parseAttributes(element, attributes) {

    if (!element) {
      return;
    }

    var value,
        parsed,
        parentAttributes = { };

    if (element.parentNode && /^g$/i.test(element.parentNode.nodeName)) {
      parentAttributes = Canvas.parseAttributes(element.parentNode, attributes);
    }

    var ownAttributes = attributes.inject({}, function(memo, attr) {
      value = element.getAttribute(attr);
      parsed = parseFloat(value);
      if (value) {
        if ((attr === 'fill' || attr === 'stroke') && value === 'none') {
          value = '';
        }
        if (attr === 'fill-rule') {
          value = (value === 'evenodd') ? 'destination-over' : value;
        }
        if (attr === 'transform') {
          value = Canvas.parseTransformAttribute(value);
        }
        if (attr in attributesMap) {
          attr = attributesMap[attr];
        }
        memo[attr] = isNaN(parsed) ? value : parsed;
      }
      return memo;
    });

    ownAttributes = Object.extend(Canvas.parseStyleAttribute(element), ownAttributes);
    return Object.extend(parentAttributes, ownAttributes);
  };

  /**
   * @static
   * @method Canvas.parseTransformAttribute
   * @param attributeValue {String} string containing attribute value
   * @return {Array} array of 6 elements representing transformation matrix
   */
  Canvas.parseTransformAttribute = (function(){
    function rotateMatrix(matrix, args) {
      var angle = args[0];

      matrix[0] = Math.cos(angle);
      matrix[1] = Math.sin(angle);
      matrix[2] = -Math.sin(angle);
      matrix[3] = Math.cos(angle);
    }

    function scaleMatrix(matrix, args) {
      var multiplierX = args[0],
          multiplierY = (args.length === 2) ? args[1] : args[0];

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

    var iMatrix = [
          1, // a
          0, // b
          0, // c
          1, // d
          0, // e
          0  // f
        ],

        number = '(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)',
        comma_wsp = '(?:\\s+,?\\s*|,\\s*)',

        skewX = '(?:(skewX)\\s*\\(\\s*(' + number + ')\\s*\\))',
        skewY = '(?:(skewY)\\s*\\(\\s*(' + number + ')\\s*\\))',
        rotate = '(?:(rotate)\\s*\\(\\s*(' + number + ')(?:' + comma_wsp + '(' + number + ')' + comma_wsp + '(' + number + '))?\\s*\\))',
        scale = '(?:(scale)\\s*\\(\\s*(' + number + ')(?:' + comma_wsp + '(' + number + '))?\\s*\\))',
        translate = '(?:(translate)\\s*\\(\\s*(' + number + ')(?:' + comma_wsp + '(' + number + '))?\\s*\\))',

        matrix = '(?:(matrix)\\s*\\(\\s*' +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' +
                  '\\s*\\))',

        transform = '(?:' +
                    matrix + '|' +
                    translate + '|' +
                    scale + '|' +
                    rotate + '|' +
                    skewX + '|' +
                    skewY +
                    ')',

        transforms = '(?:' + transform + '(?:' + comma_wsp + transform + ')*' + ')',

        transform_list = '^\\s*(?:' + transforms + '?)\\s*$',

        reTransformList = new RegExp(transform_list),

        reTransform = new RegExp(transform);

    return function(attributeValue) {

      var matrix = iMatrix.clone();

      if (!attributeValue || (attributeValue && !reTransformList.test(attributeValue))) {
        return matrix;
      }

      attributeValue.replace(reTransform, function(match) {

        var m = new RegExp(transform).exec(match).reject(function (match) {
              return (match == '' || match == null);
            }),
            operation = m[1],
            args = m.slice(2).map(parseFloat);

        switch(operation) {
          case 'translate':
            translateMatrix(matrix, args);
            break;
          case 'rotate':
            rotateMatrix(matrix, args);
            break;
          case 'scale':
            scaleMatrix(matrix, args);
            break;
          case 'skewX':
            skewXMatrix(matrix, args);
            break;
          case 'skewY':
            skewYMatrix(matrix, args);
            break;
          case 'matrix':
            matrix = args;
            break;
        }
      })
      return matrix;
    }
  })();

  /**
   * @static
   * @method Canvas.parsePointsAttribute
   * @param points {String} points attribute string
   * @return {Array} array of points
   */
  function parsePointsAttribute(points) {
    if (!points) return null;
    points = points.strip().split(/\s+/);
    var parsedPoints = points.inject([], function(memo, pair) {
      pair = pair.split(',');
      memo.push({ x: parseFloat(pair[0]), y: parseFloat(pair[1]) });
      return memo;
    });
    if (parsedPoints.length % 2 !== 0) {
    }
    return parsedPoints;
  };

  /**
   * @static
   * @method Canvas.parseStyleAttribute
   * @param element {SVGElement} element to parse
   * @return {Object} objects with values parsed from style attribute of an element
   */
  function parseStyleAttribute(element) {
    var oStyle = { },
        style = element.getAttribute('style');
    if (style) {
      if (typeof style == 'string') {
        style = style.split(';');
        style.pop();
        oStyle = style.inject({ }, function(memo, current) {
          var attr = current.split(':'),
              key = attr[0].strip(),
              value = attr[1].strip();
          memo[key] = value;
          return memo;
        });
      }
      else {
        for (var prop in style) {
          if (typeof style[prop] !== 'undefined') {
            oStyle[prop] = style[prop];
          }
        }
      }
    }
    return oStyle;
  };

  /**
   * @static
   * @method Canvas.parseElements
   * @param elements {Array} array of elements to parse
   * @param options {Object} options object
   * @return {Array} array of corresponding instances (transformed from SVG elements)
   */
   function parseElements(elements, options) {
    var _elements = elements.map(function(el) {
      var klass = Canvas[el.tagName.capitalize()];
      if (klass && klass.fromElement) {
        try {
          return klass.fromElement(el, options);
        }
        catch(e) {
          console.log(e.message || e);
        }
      }
    });
    return _elements.compact();
  };

  /**
   * @static
   * @method Canvas.parseSVGDocument
   * @param doc {SVGDocument} SVG document to parse
   * @param callback {Function} callback to call when parsing is finished.
   * Callback is being passed array of elements (parsed from a document)
   */
  Canvas.parseSVGDocument = (function(){

    var reAllowedSVGTagNames = /^(path|circle|polygon|polyline|ellipse|rect|line)$/;


    var reNum = '(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)';

    var reViewBoxAttrValue = new RegExp(
      '^' +
      '\\s*(' + reNum + '+)\\s*,?' +
      '\\s*(' + reNum + '+)\\s*,?' +
      '\\s*(' + reNum + '+)\\s*,?' +
      '\\s*(' + reNum + '+)\\s*' +
      '$'
    );

    function hasParentWithNodeName(element, parentNodeName) {
      while (element && (element = element.parentNode)) {
        if (element.nodeName === parentNodeName) {
          return true;
        }
      }
      return false;
    }

    return function(doc, callback) {
      if (!doc) return;
      var descendants = $A(doc.getElementsByTagName('*'));

      var elements = descendants.findAll(function(el) {
        return reAllowedSVGTagNames.test(el.tagName) &&
          !hasParentWithNodeName(el, 'pattern');
      });

      if (!elements || (elements && !elements.length)) return;

      var viewBoxAttr = doc.getAttribute('viewBox'),
          widthAttr = doc.getAttribute('width'),
          heightAttr = doc.getAttribute('height'),
          width = null,
          height = null,
          minX,
          minY;

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

      var elements = Canvas.parseElements(elements, Object.clone(options));
      if (!elements || (elements && !elements.length)) return;

      if (callback) {
        callback(elements, options);
      }
    };
  })();

  Object.extend(Canvas, {
    parseAttributes:        parseAttributes,
    parseElements:          parseElements,
    parseStyleAttribute:    parseStyleAttribute,
    parsePointsAttribute:   parsePointsAttribute
  });

})();

(function() {

  /* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.Point) {
    console.warn('Canvas.Point is already defined');
    return;
  }

  function Point(x, y) {
    if (arguments.length > 0) {
      this.init(x, y);
    }
  }

  Point.prototype = {
    constructor: Point,
    init: function (x, y) {
      this.x = x;
      this.y = y;
    },
    add: function (that) {
      return new Point(this.x + that.x, this.y + that.y);
    },
    addEquals: function (that) {
      this.x += that.x;
      this.y += that.y;
      return this;
    },
    scalarAdd: function (scalar) {
      return new Point(this.x + scalar, this.y + scalar);
    },
    scalarAddEquals: function (scalar) {
      this.x += scalar;
      this.y += scalar;
      return this;
    },
    subtract: function (that) {
      return new Point(this.x - that.x, this.y - that.y);
    },
    subtractEquals: function (that) {
      this.x -= that.x;
      this.y -= that.y;
      return this;
    },
    scalarSubtract: function (scalar) {
      return new Point(this.x - scalar, this.y - scalar);
    },
    scalarSubtractEquals: function (scalar) {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },
    multiply: function (scalar) {
      return new Point(this.x * scalar, this.y * scalar);
    },
    multiplyEquals: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },
    divide: function (scalar) {
      return new Point(this.x / scalar, this.y / scalar);
    },
    divideEquals: function (scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },
    eq: function (that) {
      return (this.x == that.x && this.y == that.y);
    },
    lt: function (that) {
      return (this.x < that.x && this.y < that.y);
    },
    lte: function (that) {
      return (this.x <= that.x && this.y <= that.y);
    },
    gt: function (that) {
      return (this.x > that.x && this.y > that.y);
    },
    gte: function (that) {
      return (this.x >= that.x && this.y >= that.y);
    },
    lerp: function (that, t) {
      return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    },
    distanceFrom: function (that) {
      var dx = this.x - that.x,
          dy = this.y - that.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    min: function (that) {
      return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
    },
    max: function (that) {
      return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
    },
    toString: function () {
      return this.x + "," + this.y;
    },
    setXY: function (x, y) {
      this.x = x;
      this.y = y;
    },
    setFromPoint: function (that) {
      this.x = that.x;
      this.y = that.y;
    },
    swap: function (that) {
      var x = this.x,
          y = this.y;
      this.x = that.x;
      this.y = that.y;
      that.x = x;
      that.y = y;
    }
  };

  Canvas.Point = Point;

})();

(function() {

  /* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

  var global = this;
  var Canvas = global.Canvas || (global.Canvas = { });

  if (Canvas.Intersection) {
    console.warn('Canvas.Intersection is already defined');
    return;
  }

  function Intersection(status) {
    if (arguments.length > 0) {
      this.init(status);
    }
  }

  Intersection.prototype.init = function (status) {
    this.status = status;
    this.points = [];
  };
  Intersection.prototype.appendPoint = function (point) {
    this.points.push(point);
  };
  Intersection.prototype.appendPoints = function (points) {
    this.points = this.points.concat(points);
  };

  Intersection.intersectLineLine = function (a1, a2, b1, b2) {
    var result,
        ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
        ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
        u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (u_b != 0) {
      var ua = ua_t / u_b,
          ub = ub_t / u_b;
      if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        result = new Intersection("Intersection");
        result.points.push(new Canvas.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
      }
      else {
        result = new Intersection("No Intersection");
      }
    }
    else {
      if (ua_t == 0 || ub_t == 0) {
        result = new Intersection("Coincident");
      }
      else {
        result = new Intersection("Parallel");
      }
    }
    return result;
  };

  Intersection.intersectLinePolygon = function(a1,a2,points){
    var result = new Intersection("No Intersection"),
        length = points.length;

    for (var i = 0; i < length; i++) {
      var b1 = points[i],
          b2 = points[(i+1) % length],
          inter = Intersection.intersectLineLine(a1, a2, b1, b2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = "Intersection";
    }
    return result;
  };

  Intersection.intersectPolygonPolygon = function (points1, points2) {
    var result = new Intersection("No Intersection"),
        length = points1.length;

    for (var i = 0; i < length; i++) {
      var a1 = points1[i],
          a2 = points1[(i+1) % length],
          inter = Intersection.intersectLinePolygon(a1, a2, points2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = "Intersection";
    }
    return result;
  };

  Intersection.intersectPolygonRectangle = function (points, r1, r2) {
    var min = r1.min(r2),
        max = r1.max(r2),
        topRight = new Canvas.Point(max.x, min.y),
        bottomLeft = new Canvas.Point(min.x, max.y),
        inter1 = Intersection.intersectLinePolygon(min, topRight, points),
        inter2 = Intersection.intersectLinePolygon(topRight, max, points),
        inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points),
        inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points),
        result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    if (result.points.length > 0) {
      result.status="Intersection";
    }
    return result;
  };

  Canvas.Intersection = Intersection;

})();

(function() {

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.Color) {
    console.warn('Canvas.Color is already defined.');
    return;
  }

  Canvas.Color = Color;

  /**
   * @constructor
   * @param {String} color (optional) in hex or rgb(a) format
   */
  function Color(color) {
    if (!color) {
      this.setSource([0, 0, 0, 1]);
    }
    else {
      this._tryParsingColor(color);
    }
  }

  /**
   * @private
   * @method _tryParsingColor
   */
  Color.prototype._tryParsingColor = function(color) {
    var source = Color.sourceFromHex(color);
    if (!source) {
      source = Color.sourceFromRgb(color);
    }
    if (source) {
      this.setSource(source);
    }
  }

  /**
   * @method getSource
   * @return {Array}
   */
  Color.prototype.getSource = function() {
    return this._source;
  };

  /**
   * @method setSource
   * @param {Array} source
   */
  Color.prototype.setSource = function(source) {
    this._source = source;
  };

  /**
   * @method toRgb
   * @return {String} ex: rgb(0-255,0-255,0-255)
   */
  Color.prototype.toRgb = function() {
    var source = this.getSource();
    return 'rgb(' + source[0] + ',' + source[1] + ',' + source[2] + ')';
  };

  /**
   * @method toRgba
   * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
   */
  Color.prototype.toRgba = function() {
    var source = this.getSource();
    return 'rgba(' + source[0] + ',' + source[1] + ',' + source[2] + ',' + source[3] + ')';
  };

  /**
   * @method toHex
   * @return {String} ex: FF5555
   */
  Color.prototype.toHex = function() {
    var source = this.getSource();

    var r = source[0].toString(16);
    r = (r.length == 1) ? ('0' + r) : r;

    var g = source[1].toString(16);
    g = (g.length == 1) ? ('0' + g) : g;

    var b = source[2].toString(16);
    b = (b.length == 1) ? ('0' + b) : b;

    return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
  };

  /**
   * @method getAlpha
   * @return {Number} 0-1
   */
  Color.prototype.getAlpha = function() {
    return this.getSource()[3];
  };

  /**
   * @method setAlpha
   * @param {Number} 0-1
   * @return {Color} thisArg
   */
  Color.prototype.setAlpha = function(alpha) {
    var source = this.getSource();
    source[3] = alpha;
    this.setSource(source);
    return this;
  };

  /**
   * Transforms color to its grayscale representation
   * @method toGrayscale
   * @return {Color} thisArg
   */
  Color.prototype.toGrayscale = function() {
    var source = this.getSource(),
        average = parseInt((source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), 10),
        currentAlpha = source[3];
    this.setSource([average, average, average, currentAlpha]);
    return this;
  };

  /**
   * Transforms color to its black and white representation
   * @method toGrayscale
   * @return {Color} thisArg
   */
  Color.prototype.toBlackWhite = function(threshold) {
    var source = this.getSource(),
        average = (source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0),
        currentAlpha = source[3],
        threshold = threshold || 127;

    average = (Number(average) < Number(threshold)) ? 0 : 255;
    this.setSource([average, average, average, currentAlpha]);
    return this;
  };

  /**
   * Overlays color with another color
   * @method overlayWith
   * @param {Color} otherColor
   * @return {Color} thisArg
   */
  Color.prototype.overlayWith = function(otherColor) {
    otherColor = new Color(otherColor);

    var result = [],
        alpha = this.getAlpha(),
        otherAlpha = 0.5,
        source = this.getSource(),
        otherSource = otherColor.getSource();

    for (var i = 0; i < 3; i++) {
      result.push(Math.round((source[i] * (1 - otherAlpha)) + (otherSource[i] * otherAlpha)));
    }

    result[4] = alpha;
    this.setSource(result);
    return this;
  };

  /**
   * @static
   * @field reRGBa
   */
  Color.reRGBa = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d+(?:\.\d+)?))?\)$/;

  /**
   * @static
   * @field reHex
   */
  Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

  /**
   * @method fromRgb
   * @param {String} color ex: rgb(0-255,0-255,0-255)
   * @return {Color}
   */
  Color.fromRgb = function(color) {
    return Color.fromSource(Color.sourceFromRgb(color));
  };

  /**
   * @method sourceFromRgb
   * @param {String} color ex: rgb(0-255,0-255,0-255)
   * @return {Array} source
   */
  Color.sourceFromRgb = function(color) {
    var match = color.match(Color.reRGBa);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        match[4] ? parseFloat(match[4]) : 1
      ];
    }
  };

  /**
   * @static
   * @method fromRgba
   * @return {Color}
   */
  Color.fromRgba = Color.fromRgb;

  /**
   * @static
   * @method fromHex
   * @return {Color}
   */
  Color.fromHex = function(color) {
    return Color.fromSource(Color.sourceFromHex(color));
  };

  /**
   * @static
   * @method sourceFromHex
   * @param {String} ex: FF5555
   * @return {Array} source
   */
  Color.sourceFromHex = function(color) {
    if (color.match(Color.reHex)) {
      var value = color.slice(color.indexOf('#') + 1),
          isShortNotation = (value.length === 3),
          r = isShortNotation ? (value.charAt(0) + value.charAt(0)) : value.substring(0, 2),
          g = isShortNotation ? (value.charAt(1) + value.charAt(1)) : value.substring(2, 4),
          b = isShortNotation ? (value.charAt(2) + value.charAt(2)) : value.substring(4, 6);

      return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16),
        1
      ];
    }
  };

  /**
   * @static
   * @method fromSource
   * @return {Color}
   */
  Color.fromSource = function(source) {
    var oColor = new Color();
    oColor.setSource(source);
    return oColor;
  };
})();

(function () {

  var global = this,
      window = global.window,
      document = window.document,

      Canvas = global.Canvas || (global.Canvas = { });

  if (Canvas.Element) {
    console.warn('Canvas.Element is already defined.');
    return;
  }

  var CANVAS_INIT_ERROR = new Error('Could not initialize `canvas` element'),
      FX_DURATION = 500,
      STROKE_OFFSET = 0.5,
      FX_TRANSITION = 'decel',

      getCoords = APE.dom.Event.getCoords,

      cursorMap = {
        'tr': 'ne-resize',
        'br': 'se-resize',
        'bl': 'sw-resize',
        'tl': 'nw-resize',
        'ml': 'w-resize',
        'mt': 'n-resize',
        'mr': 'e-resize',
        'mb': 's-resize'
      };

  var fastestClearingMethod = (function () {
    var el = document.createElement('canvas'),
        t, t1, t2, i,
        numIterations = 200,
        canvasLength = 300;

    el.width = el.height = canvasLength;

    if (!el.getContext) {
      return;
    }

    var ctx = el.getContext('2d');
    if (!ctx) {
      return;
    }

    t = new Date();
    for (i = numIterations; i--; ) {
      ctx.clearRect(0, 0, canvasLength, canvasLength);
    }
    t1 = new Date() - t;

    t = new Date();
    for (i = numIterations; i--; ) {
      el.width = el.height;
    }
    t2 = new Date() - t;

    if (t2 < t1) {
      return 'width';
    }
  })();

  function clearContext(ctx) {
    ctx.clearRect(0, 0, this._oConfig.width, this._oConfig.height);
    return this;
  }

  /*
  if (fastestClearingMethod === 'width') {
    clearContext = function (ctx) {
      ctx.canvas.width = ctx.canvas.width;
      return this;
    }
  }
  */

  var CAN_SET_TRANSPARENT_FILL = (function () {


    var canvasEl = document.createElement('canvas');
    if (!canvasEl || !canvasEl.getContext) {
      return;
    }

    var context = canvasEl.getContext('2d');
    if (!context) {
      return;
    }

    try {
      context.fillStyle = 'transparent';
      return true;
    }
    catch(err) { }

    return false;
  })();

  /**
   * @class Canvas.Element
   * @constructor
   * @param {HTMLElement | String} el Container element for the canvas.
   */
  Canvas.Element = function (el, oConfig) {

    /**
     * The object literal containing mouse position if clicked in an empty area (no image)
     * @property _groupSelector
     * @type object
     */
    this._groupSelector = null;

    /**
     * The array literal containing all objects on canvas
     * @property _aObjects
     * @type array
     */
    this._aObjects = [];

    /**
     * The element that references the canvas interface implementation
     * @property _oContext
     * @type object
     */
    this._oContext = null;

    /**
     * The main element that contains the canvas
     * @property _oElement
     * @type object
     */
    this._oElement = null;

    /**
     * The object literal containing the current x,y params of the transformation
     * @property _currentTransform
     * @type object
     */
    this._currentTransform = null;

    /**
     * References instance of Canvas.Group - when multiple objects are selected
     * @property _activeGroup
     * @type object
     */
    this._activeGroup = null;

     /**
      * An object containing config parameters
      * @property _oConfig
      * @type object
      */
    this._oConfig = {
      width: 300,
      height: 150
    };

    oConfig = oConfig || { };

    this._initElement(el);
    this._initConfig(oConfig);

    if (oConfig.overlayImage) {
      this.setOverlayImage(oConfig.overlayImage);
    }

    if (oConfig.afterRender) {
      this.afterRender = oConfig.afterRender;
    }

    this._createCanvasBackground();
    this._createCanvasContainer();
    this._initEvents();
    this.calcOffset();
  };

  Object.extend(Canvas.Element.prototype, {

    selectionColor:         'rgba(100,100,255,0.3)', // blue
    selectionBorderColor:   'rgba(255,255,255,0.3)', // white
    selectionLineWidth:     1,
    backgroundColor:        'rgba(255,255,255,1)', // white
    includeDefaultValues:   true,

    shouldCacheImages:      false,

    CANVAS_WIDTH:           600,
    CANVAS_HEIGHT:          600,

    CANVAS_PRINT_WIDTH:     3000,
    CANVAS_PRINT_HEIGHT:    3000,

    onBeforeScaleRotate: function () {
      /* NOOP */
    },

    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     * @method calcOffset
     * @return {Canvas.Element} instance
     * @chainable
     */
    calcOffset: function () {
      this._offset = Element.cumulativeOffset(this.getElement());
      return this;
    },

    /**
     * @method setOverlayImage
     * @param {String} url url of an image to set background to
     * @param {Function} callback callback to invoke when image is loaded and set as an overlay one
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    setOverlayImage: function (url, callback) {
      if (url) {
        var _this = this, img = new Image();
        img.onload = function () {
          _this.overlayImage = img;
          if (callback) {
            callback();
          }
          img = img.onload = null;
        };
        img.src = url;
      }
      return this;
    },

    /**
     * canvas class's initialization method. This method is automatically
     * called by constructor, and sets up all DOM references for
     * pre-existing markup, and creates required markup if it is not
     * already present.
     * @method _initElement
     * @param canvasEl {HTMLElement|String} canvasEl canvas element
     *
     */
    _initElement: function (canvasEl) {
      if ($(canvasEl)) {
        this._oElement = $(canvasEl);
      }
      else {
        this._oElement = new Element('canvas');
      }
      if (typeof this._oElement.getContext === 'undefined') {
        G_vmlCanvasManager.initElement(this._oElement);
      }
      if (typeof this._oElement.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
      if (!(this._oContextTop = this._oElement.getContext('2d'))) {
        throw CANVAS_INIT_ERROR;
      }

      var width = this._oElement.width || 0,
          height = this._oElement.height || 0;

      this._initWrapperElement(width, height);
      this._setElementStyle(width, height);
    },

    /**
     * @private
     * @method _initWrapperElement
     */
    _initWrapperElement: function (width, height) {
      var wrapper = Element.wrap(this.getElement(), 'div', { className: 'canvas_container' });
      wrapper.setStyle({
        width: width + 'px',
        height: height + 'px'
      });
      Element.makeUnselectable(wrapper);
      this.wrapper = wrapper;
    },

    /**
     * @private
     * @method _setElementStyle
     */
    _setElementStyle: function (width, height) {
      this.getElement().setStyle({
        position: 'absolute',
        width: width + 'px',
        height: height + 'px',
        left: 0,
        top: 0
      });
    },

    /**
       * For now we use an object literal without methods to store the config params
       * @method _initConfig
       * @param oConfig {Object} userConfig The configuration Object literal
       * containing the configuration that should be set for this module.
       * See configuration documentation for more details.
       */
    _initConfig: function (oConfig) {
      Object.extend(this._oConfig, oConfig || { });

      this._oConfig.width = parseInt(this._oElement.width, 10) || 0;
      this._oConfig.height = parseInt(this._oElement.height, 10) || 0;

      this._oElement.style.width = this._oConfig.width + 'px';
      this._oElement.style.height = this._oConfig.height + 'px';
    },

    /**
     * Adds main mouse listeners to the whole canvas
     * @method _initEvents
     * @private
     * See configuration documentation for more details.
     */
    _initEvents: function () {

      var _this = this;

      this._onMouseDown = function (e){ _this.__onMouseDown(e); };
      this._onMouseUp = function (e){ _this.__onMouseUp(e); };
      this._onMouseMove = function (e){ _this.__onMouseMove(e); };
      this._onResize = function (e) { _this.calcOffset() };

      Event.observe(this._oElement, 'mousedown', this._onMouseDown);
      Event.observe(document, 'mousemove', this._onMouseMove);
      Event.observe(document, 'mouseup', this._onMouseUp);
      Event.observe(window, 'resize', this._onResize);
    },

    /**
     * Creates canvas elements
     * @method _createCanvasElement
     * @private
     */
    _createCanvasElement: function (className) {

      var element = document.createElement('canvas');
      if (!element) {
        return;
      }

      element.className = className;
      var oContainer = this._oElement.parentNode.insertBefore(element, this._oElement);

      oContainer.width = this.getWidth();
      oContainer.height = this.getHeight();
      oContainer.style.width = this.getWidth() + 'px';
      oContainer.style.height = this.getHeight() + 'px';
      oContainer.style.position = 'absolute';
      oContainer.style.left = 0;
      oContainer.style.top = 0;

      if (typeof element.getContext === 'undefined') {
        G_vmlCanvasManager.initElement(element);
      }
      if (typeof element.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
      Element.makeUnselectable(oContainer);
      return oContainer;
    },

    /**
     * Creates a secondary canvas to contain all the images are not being translated/rotated/scaled
     * @method _createCanvasContainer
     */
    _createCanvasContainer: function () {
      var canvas = this._createCanvasElement('canvas-container');
      this._oContextContainerEl = canvas;
      this._oContextContainer = canvas.getContext('2d');
    },

    /**
     * Creates a "background" canvas
     * @method _createCanvasBackground
     */
    _createCanvasBackground: function () {
      var canvas = this._createCanvasElement('canvas-container');
      this._oContextBackgroundEl = canvas;
      this._oContextBackground = canvas.getContext('2d');
    },

    /**
     * Returns canvas width
     * @method getWidth
     * @return {Number}
     */
    getWidth: function () {
      return this._oConfig.width;
    },

    /**
     * Returns canvas height
     * @method getHeight
     * @return {Number}
     */
    getHeight: function () {
      return this._oConfig.height;
    },

    /**
     * @method setWidth
     * @param {Number} width value to set width to
     * @return {Canvas.Element} instance
     * @chainable true
     */
    setWidth: function (value) {
      return this._setDimension('width', value);
    },

    /**
     * @method setHeight
     * @param {Number} height value to set height to
     * @return {Canvas.Element} instance
     * @chainable true
     */
    setHeight: function (value) {
      return this._setDimension('height', value);
    },

    /**
     * private helper for setting width/height
     * @method _setDimensions
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @return {Canvas.Element} instance
     * @chainable true
     */
    _setDimension: function (prop, value) {
      this._oContextContainerEl[prop] = value;
      this._oContextContainerEl.style[prop] = value + 'px';

      this._oContextBackgroundEl[prop] = value;
      this._oContextBackgroundEl.style[prop] = value + 'px';

      this._oElement[prop] = value;
      this._oElement.style[prop] = value + 'px';

      this._oElement.parentNode.style[prop] = value + 'px';

      this._oConfig[prop] = value;
      this.calcOffset();
      this.renderAll();

      return this;
    },

    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @method __onMouseUp
     * @param {Event} e Event object fired on mouseup
     *
     */
    __onMouseUp: function (e) {
      if (this._currentTransform) {

        var transform = this._currentTransform,
            target = transform.target;

        if (target.__scaling) {
          document.fire('object:scaled', { target: target });
          target.__scaling = false;
        }

        for (var i=0, l=this._aObjects.length; i<l; ++i) {
          this._aObjects[i].setCoords();
        }

        if (target.hasStateChanged()) {
          target.isMoving = false;
          document.fire('object:modified', { target: target });
        }
      }

      this._currentTransform = null;

      if (this._groupSelector) {
        this._findSelectedObjects(e);
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (activeGroup.hasStateChanged() &&
            activeGroup.containsPoint(this.getPointer(e))) {
          document.fire('group:modified', { target: activeGroup });
        }
        activeGroup.setObjectsCoords();
        activeGroup.set('isMoving', false);
        this._setCursor('default');
      }

      this._groupSelector = null;
      this.renderAll();

      this._setCursorFromEvent(e, target);
      this._setCursor('');

      var _this = this;
      setTimeout(function () {
        _this._setCursorFromEvent(e, target);
      }, 50);
    },

    shouldClearSelection: function (e) {
      var target = this.findTarget(e),
          activeGroup = this.getActiveGroup();
      return (
        !target || (
          target &&
          activeGroup &&
          !activeGroup.contains(target) &&
          activeGroup !== target &&
          !e.shiftKey
        )
      );
    },

    /**
     * Method that defines the actions when mouse is clic ked on canvas.
     * The method inits the currentTransform parameters and renders all the
     * canvas so the current image can be placed on the top canvas and the rest
     * in on the container one.
     * @method __onMouseDown
     * @param e {Event} Event object fired on mousedown
     *
     */
    __onMouseDown: function (e) {

      if (this._currentTransform) return;

      var target = this.findTarget(e),
          pointer = this.getPointer(e),
          activeGroup = this.getActiveGroup(),
          corner;

      if (this.shouldClearSelection(e)) {

        this._groupSelector = {
          ex: pointer.x,
          ey: pointer.y,
          top: 0,
          left: 0
        };

        this.deactivateAllWithDispatch();
      }
      else {
        target.saveState();

        if (corner = target._findTargetCorner(e, this._offset)) {
          this.onBeforeScaleRotate(target);
        }

        this._setupCurrentTransform(e, target);

        var shouldHandleGroupLogic = e.shiftKey && (activeGroup || this.getActiveObject());
        if (shouldHandleGroupLogic) {
          this._handleGroupLogic(e, target);
        }
        else {
          if (target !== this.getActiveGroup()) {
            this.deactivateAll();
          }
          this.setActiveObject(target);
        }
      }
      this.renderAll();
    },

    /**
     * @method getElement
     * @return {HTMLCanvasElement}
     */
    getElement: function () {
      return this._oElement;
    },

    /**
     * Deactivates all objects and dispatches appropriate events
     * @method deactivateAllWithDispatch
     * @return {Canvas.Element} thisArg
     */
    deactivateAllWithDispatch: function () {
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        document.fire('before:group:destroyed', {
          target: activeGroup
        });
      }
      this.deactivateAll();
      if (activeGroup) {
        document.fire('after:group:destroyed');
      }
      document.fire('selection:cleared');
      return this;
    },

    /**
     * @private
     * @method _setupCurrentTransform
     */
    _setupCurrentTransform: function (e, target) {
      var action = 'drag',
          corner,
          pointer = getCoords(e);

      if (corner = target._findTargetCorner(e, this._offset)) {
        action = /ml|mr/.test(corner)
          ? 'scaleX'
          : /mt|mb/.test(corner)
            ? 'scaleY'
            : 'rotate';
      }

      this._currentTransform = {
        target: target,
        action: action,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        ex: pointer.x,
        ey: pointer.y,
        left: target.left,
        top: target.top,
        theta: target.theta,
        width: target.width * target.scaleX
      };

      this._currentTransform.original = {
        left: target.left,
        top: target.top
      };
    },

    _handleGroupLogic: function (e, target) {
      if (target.isType('group')) {
        target = this.findTarget(e, true);
        if (!target || target.isType('group')) {
          return;
        }
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (activeGroup.contains(target)) {
          activeGroup.remove(target);
          target.setActive(false);
          if (activeGroup.size() === 1) {
            this.removeActiveGroup();
          }
        }
        else {
          activeGroup.add(target);
        }
        document.fire('group:selected', { target: activeGroup });
        activeGroup.setActive(true);
      }
      else {
        if (this._activeObject) {
          if (target !== this._activeObject) {
            var group = new Canvas.Group([ this._activeObject,target ]);
            this.setActiveGroup(group);
            activeGroup = this.getActiveGroup();
          }
        }
        target.setActive(true);
      }

      if (activeGroup) {
        activeGroup.saveCoords();
      }
    },

   /**
    * Method that defines the actions when mouse is hovering the canvas.
    * The currentTransform parameter will definde whether the user is rotating/scaling/translating
    * an image or neither of them (only hovering). A group selection is also possible and would cancel
    * all any other type of action.
    * In case of an image transformation only the top canvas will be rendered.
    * @method __onMouseMove
    * @param e {Event} Event object fired on mousemove
    *
    */
    __onMouseMove: function (e) {

      if (this._groupSelector !== null) {
        var pointer = getCoords(e);
        this._groupSelector.left = pointer.x - this._offset.left - this._groupSelector.ex;
        this._groupSelector.top = pointer.y - this._offset.top - this._groupSelector.ey;
        this.renderTop();
      }
      else if (!this._currentTransform) {

        var style = this._oElement.style;

        var target = this.findTarget(e);

        if (!target) {
          for (var i = this._aObjects.length; i--; ) {
            if (!this._aObjects[i].active) {
              this._aObjects[i].setActive(false);
            }
          }
          style.cursor = 'default';
        }
        else {
          this._setCursorFromEvent(e, target);
          if (target.isActive()) {
            target.setCornersVisibility && target.setCornersVisibility(true);
          }
        }
      }
      else {
        var pointer = getCoords(e),
            x = pointer.x,
            y = pointer.y;

        this._currentTransform.target.isMoving = true;

        if (this._currentTransform.action === 'rotate') {

          if (!e.shiftKey) {
            this._rotateObject(x, y);
          }
          this._scaleObject(x, y);
        }
        else if (this._currentTransform.action === 'scaleX') {
          this._scaleObject(x, y, 'x');
        }
        else if (this._currentTransform.action === 'scaleY') {
          this._scaleObject(x, y, 'y');
        }
        else {
          this._translateObject(x, y);
        }
        this.renderAll();
      }
    },

    /**
     * Translates object by "setting" its left/top
     * @method _translateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */
    _translateObject: function (x, y) {
      var target = this._currentTransform.target;
      target.set('left', x - this._currentTransform.offsetX);
      target.set('top', y - this._currentTransform.offsetY);
    },

    /**
     * Scales object by invoking its scaleX/scaleY methods
     * @method _scaleObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     * @param by {String} Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
     *                    When not provided, an object is scaled by both dimensions equally
     */
    _scaleObject: function (x, y, by) {
      var lastLen = Math.sqrt(Math.pow(this._currentTransform.ey - this._currentTransform.top - this._offset[1], 2) +
        Math.pow(this._currentTransform.ex - this._currentTransform.left - this._offset[0], 2));

      var curLen = Math.sqrt(Math.pow(y - this._currentTransform.top - this._offset[1], 2) +
        Math.pow(x - this._currentTransform.left - this._offset[0], 2));

      var target = this._currentTransform.target;
      target.__scaling = true;

      if (!by) {
        target.set('scaleX', this._currentTransform.scaleX * curLen/lastLen);
        target.set('scaleY', this._currentTransform.scaleY * curLen/lastLen);
      }
      else if (by === 'x') {
        target.set('scaleX', this._currentTransform.scaleX * curLen/lastLen);
      }
      else if (by === 'y') {
        target.set('scaleY', this._currentTransform.scaleY * curLen/lastLen);
      }
    },

    /**
     * Rotates object by invoking its rotate method
     * @method _rotateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */
    _rotateObject: function (x, y) {
      var lastAngle = Math.atan2(this._currentTransform.ey - this._currentTransform.top - this._offset[1],
        this._currentTransform.ex - this._currentTransform.left - this._offset[0]);
      var curAngle = Math.atan2(y - this._currentTransform.top - this._offset[1],
        x - this._currentTransform.left - this._offset[0]);
      this._currentTransform.target.set('theta', (curAngle - lastAngle) + this._currentTransform.theta);
    },

    /**
     * @method _setCursor
     */
    _setCursor: function (value) {
      this._oElement.style.cursor = value;
    },

    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @method _setCursorFromEvent
     * @param e {Event} Event object
     * @param target {Object} Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent: function (e, target) {
      var s = this._oElement.style;
      if (!target) {
        s.cursor = 'default';
        return false;
      }
      else {
        var activeGroup = this.getActiveGroup();
        var corner = !!target._findTargetCorner
                      && (!activeGroup || !activeGroup.contains(target))
                      && target._findTargetCorner(e, this._offset);

        if (!corner) {
          s.cursor = 'move';
        }
        else {
          if (corner in cursorMap) {
            s.cursor = cursorMap[corner];
          }
          else {
            s.cursor = 'default';
            return false;
          }
        }
      }
      return true;
    },

    /**
     * Given a context, renders an object on that context
     * @param ctx {Object} context to render object on
     * @param object {Object} object to render
     * @private
     */
    _draw: function (ctx, object) {
      object && object.render(ctx);
    },

    /**
     * @method _drawSelection
     * @private
     */
    _drawSelection: function () {
      var left = this._groupSelector.left,
          top = this._groupSelector.top,
          aleft = Math.abs(left),
          atop = Math.abs(top);

      this._oContextTop.fillStyle = this.selectionColor;

      this._oContextTop.fillRect(
        this._groupSelector.ex - ((left > 0) ? 0 : -left),
        this._groupSelector.ey - ((top > 0) ? 0 : -top),
        aleft,
        atop
      );

      this._oContextTop.lineWidth = this.selectionLineWidth;
      this._oContextTop.strokeStyle = this.selectionBorderColor;

      this._oContextTop.strokeRect(
        this._groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0 : aleft),
        this._groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0 : atop),
        aleft,
        atop
      );
    },

    _findSelectedObjects: function (e) {

      var pointer = getCoords(e),
          target,
          targetRegion,
          group = [],
          x1 = this._groupSelector.ex,
          y1 = this._groupSelector.ey,
          x2 = x1 + this._groupSelector.left,
          y2 = y1 + this._groupSelector.top,
          currentObject;

      var selectionX1Y1 = new Canvas.Point(Math.min(x1, x2), Math.min(y1, y2)),
          selectionX2Y2 = new Canvas.Point(Math.max(x1, x2), Math.max(y1, y2));

      for (var i=0, l=this._aObjects.length; i<l; ++i) {
        currentObject = this._aObjects[i];

        if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) ||
            currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2)) {

          currentObject.setActive(true);
          group.push(currentObject);
        }
      }
      if (group.length === 1) {
        this.setActiveObject(group[0]);
        document.fire('object:selected', {
          target: group[0]
        });
      }
      else if (group.length > 1) {
        var group = new Canvas.Group(group);
        this.setActiveGroup(group);
        group.saveCoords();
        document.fire('group:selected', { target: group });
      }
      this.renderAll();
    },

    /**
     * Adds an object to canvas and renders canvas
     * An object should be an instance of (or inherit from) Canvas.Object
     * @method add
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    add: function () {
      this._aObjects.push.apply(this._aObjects, arguments);
      this.renderAll();
      return this;
    },

    /**
     * Inserts an object to canvas at specified index and renders canvas.
     * An object should be an instance of (or inherit from) Canvas.Object
     * @method insertAt
     * @param object {Object} Object to insert
     * @param index {Number} index to insert object at
     * @return {Canvas.Element} instance
     */
    insertAt: function (object, index) {
      this._aObjects.splice(index, 0, object);
      this.renderAll();
      return this;
    },

    /**
     * Returns an array of objects this instance has
     * @method getObjects
     * @return {Array}
     */
    getObjects: function () {
      return this._aObjects;
    },

    /**
     * Returns topmost canvas context
     * @method getContext
     * @return {CanvasRenderingContext2D}
     */
    getContext: function () {
      return this._oContextTop;
    },

    /**
     * Clears specified context of canvas element
     * @method clearContext
     * @param context {Object} ctx context to clear
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    clearContext: clearContext,

    /**
     * Clears all contexts of canvas element
     * @method clear
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    clear: function () {
      this._aObjects.length = 0;
      this.clearContext(this._oContextTop);
      this.clearContext(this._oContextContainer);
      this.renderAll();
      return this;
    },

    /**
     * Renders both the top canvas and the secondary container canvas.
     * @method renderAll
     * @param allOnTop {Boolean} optional Whether we want to force all images to be rendered on the top canvas
     * @return {Canvas.Element} instance
     * @chainable
     */
    renderAll: function (allOnTop) {

      var w = this._oConfig.width,
          h = this._oConfig.height;

      var containerCanvas = allOnTop ? this._oContextTop : this._oContextContainer;

      this.clearContext(this._oContextTop);

      if (containerCanvas !== this._oContextTop) {
        this.clearContext(containerCanvas);
      }

      if (allOnTop) {
        if (!CAN_SET_TRANSPARENT_FILL && this.backgroundColor === 'transparent') {
          var skip = true;
        }
        if (!skip) {
          containerCanvas.fillStyle = this.backgroundColor;
        }
        containerCanvas.fillRect(0, 0, w, h);
      }

      var length = this._aObjects.length,
          activeGroup = this.getActiveGroup();

      if (length) {
        for (var i=0; i<length; ++i) {

          if (!activeGroup ||
              (activeGroup &&
              !activeGroup.contains(this._aObjects[i]))) {
            this._draw(containerCanvas, this._aObjects[i]);
          }
        }
      }

      if (activeGroup) {
        this._draw(this._oContextTop, activeGroup);
      }

      if (this.overlayImage) {
        this._oContextTop.drawImage(this.overlayImage, 0, 0);
      }

      if (this.afterRender) {
        this.afterRender();
      }

      return this;
    },

    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @method renderTop
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    renderTop: function () {

      this.clearContext(this._oContextTop);
      if (this.overlayImage) {
        this._oContextTop.drawImage(this.overlayImage, 0, 0);
      }

      if (this._groupSelector) {
        this._drawSelection();
      }

      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        activeGroup.render(this._oContextTop);
      }

      if (this.afterRender) {
        this.afterRender();
      }

      return this;
    },

    /**
     * Applies one implementation of 'point inside polygon' algorithm
     * @method containsPoint
     * @param e { Event } event object
     * @param target { Canvas.Object } object to test against
     * @return {Boolean} true if point contains within area of given object
     */
    containsPoint: function (e, target) {
      var pointer = this.getPointer(e),
          xy = this._normalizePointer(target, pointer),
          x = xy.x,
          y = xy.y;


      var iLines = target._getImageLines(target.oCoords),
          xpoints = target._findCrossPoints(x, y, iLines);

      if ((xpoints && xpoints % 2 === 1) || target._findTargetCorner(e, this._offset)) {
        return true;
      }
      return false;
    },

    /**
     * @private
     * @method _normalizePointer
     */
    _normalizePointer: function (object, pointer) {

      var activeGroup = this.getActiveGroup(),
          x = pointer.x,
          y = pointer.y;

      var isObjectInGroup = (
        activeGroup &&
        object.type !== 'group' &&
        activeGroup.contains(object)
      );

      if (isObjectInGroup) {
        x -= activeGroup.left;
        y -= activeGroup.top;
      }
      return { x: x, y: y };
    },

    /**
     * Method that determines what object we are clicking on
     * @method findTarget
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, group is skipped and only objects are traversed through
     */
    findTarget: function (e, skipGroup) {
      var target,
          pointer = this.getPointer(e);

      var activeGroup = this.getActiveGroup();

      if (activeGroup && !skipGroup && this.containsPoint(e, activeGroup)) {
        target = activeGroup;
        return target;
      }

      for (var i = this._aObjects.length; i--; ) {
        if (this.containsPoint(e, this._aObjects[i])) {
          target = this._aObjects[i];
          this.relatedTarget = target;
          break;
        }
      }
      return target;
    },

    /**
     * Exports canvas element to a dataurl image.
     * @method toDataURL
     * @param {String} format the format of the output image. Either "jpeg" or "png".
     * @return {String}
     */
    toDataURL: function (format) {
      var data;
      if (!format) {
        format = 'png';
      }
      if (format === 'jpeg' || format === 'png') {
        this.renderAll(true);
        data = this.getElement().toDataURL('image/' + format);
      }
      return data;
    },

    /**
     * @method toDataURLWithMultiplier
     * @param {String} format (png|jpeg)
     * @param {Number} multiplier
     * @return {String}
     */
    toDataURLWithMultiplier: function (format, multiplier) {

      var origWidth = this.getWidth(),
          origHeight = this.getHeight(),
          scaledWidth = origWidth * multiplier,
          scaledHeight = origHeight * multiplier,
          activeObject = this.getActiveObject();

      this.setWidth(scaledWidth).setHeight(scaledHeight);
      this._oContextTop.scale(multiplier, multiplier);

      if (activeObject) {
        this.deactivateAll().renderAll();
      }
      var dataURL = this.toDataURL(format);

      this._oContextTop.scale( 1 / multiplier,  1 / multiplier);
      this.setWidth(origWidth).setHeight(origHeight);

      if (activeObject) {
        this.setActiveObject(activeObject);
      }
      this.renderAll();

      return dataURL;
    },

    /**
     * @method getPointer
     * @return {Object} object with "x" and "y" number values
     */
    getPointer: function (e) {
      var p = getCoords(e);
      return {
        x: p.x - this._offset.left,
        y: p.y - this._offset.top
      };
    },

    /**
     * Returns coordinates of a center of canvas.
     * Returned value is an object with top and left properties
     * @method getCenter
     * @return {Object} object with "top" and "left" number values
     */
    getCenter: function () {
      return {
        top: this.getHeight() / 2,
        left: this.getWidth() / 2
      };
    },

    /**
     * Centers object horizontally
     * @method centerObjectH
     * @param {Canvas.Object} object Object to center
     * @return {Canvas.Element} thisArg
     */
    centerObjectH: function (object) {
      object.set('left', this.getCenter().left);
      this.renderAll();
      return this;
    },

    /**
     * Centers object horizontally with animation
     * @method fxCenterObjectH
     * @param {Canvas.Object} object
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    fxCenterObjectH: function (object) {
      var _this = this,
          fx = new APE.anim.Animation(),
          startValue = object.get('left'),
          endValue = _this.getCenter().left,
          step = endValue - startValue;

      fx.run = function (percent) {
        object.set('left', startValue + step * percent);
        _this.renderAll();
      };

      fx.onend = function () {
        object.setCoords();
      };

      fx.duration = FX_DURATION;
      fx.transition = APE.anim.Transitions[FX_TRANSITION];
      fx.start();

      return this;
    },

    /**
     * Centers object vertically
     * @method centerObjectH
     * @param object {Canvas.Object} Object to center
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    centerObjectV: function (object) {
      object.set('top', this.getCenter().top);
      this.renderAll();
      return this;
    },

    /**
     * Centers object vertically with animation
     * @method fxCenterObjectV
     * @param {Canvas.Object} object
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    fxCenterObjectV: function (object) {
      var _this = this,
          fx = new APE.anim.Animation(),
          startValue = object.get('top'),
          endValue = _this.getCenter().top,
          step = endValue - startValue;

      fx.run = function (percent) {
        object.set('top', startValue + step * percent).setCoords();
        _this.renderAll();
      };

      fx.onend = function () {
        object.setCoords();
      };

      fx.duration = FX_DURATION;
      fx.transition = APE.anim.Transitions[FX_TRANSITION];

      fx.start();
    },

    /**
     * @method straightenObject
     * @param {Canvas.Object} object Object to straighten
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    straightenObject: function (object) {
      object.straighten();
      this.renderAll();
      return this;
    },

    /**
     * @method fxStraightenObject
     * @param {Canvas.Object} object Object to straighten
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    fxStraightenObject: function (object) {
      object.fxStraighten({
        onChange: this.renderAll.bind(this)
      });
      return this;
    },

    /**
     * Returs JSON representation of canvas
     * @method toJSON
     * @return {String} json string
     */
    toJSON: function () {
      return Object.toJSON(this.toObject());
    },

    /**
     * Returs dataless JSON representation of canvas
     * @method toDatalessJSON
     * @return {String} json string
     */
    toDatalessJSON: function () {
      return Object.toJSON(this.toDatalessObject());
    },

    /**
     * Returns object representation of canvas
     * @method toObject
     * @return {Object}
     */
    toObject: function () {
      return this._toObjectMethod('toObject');
    },

    /**
     * Returns dataless object representation of canvas
     * @method toDatalessObject
     * @return {Object}
     */
    toDatalessObject: function () {
      return this._toObjectMethod('toDatalessObject');
    },

    /**
     * @private
     * @method _toObjectMethod
     */
    _toObjectMethod: function (methodName) {
      return {
        objects: this._aObjects.map(function (instance){
          if (!this.includeDefaultValues) {
            var originalValue = instance.includeDefaultValues;
            instance.includeDefaultValues = false;
          }
          var object = instance[methodName]();
          if (!this.includeDefaultValues) {
            instance.includeDefaultValues = originalValue;
          }
          return object;
        }, this),
        background: this.backgroundColor
      }
    },

    /**
     * Returns true if canvas contains no objects
     * @method isEmpty
     * @return {Boolean} true if canvas is empty
     */
    isEmpty: function () {
      return this._aObjects.length === 0;
    },

    /**
     * Populates canvas with data from the specified JSON
     * JSON format must conform to the one of Canvas.Element#toJSON
     * @method loadFromJSON
     * @param json {String} json string
     * @param callback {Function} callback, invoked when json is parsed
     *                            and corresponding objects (e.g. Canvas.Image)
     *                            are initialized
     * @return {Canvas.Element} instance
     * @chainable
     */
    loadFromJSON: function (json, callback) {
      if (!json) return;

      var serialized = json.evalJSON();
      if (!serialized || (serialized && !serialized.objects)) return;

      this.clear();
      this._enlivenObjects(serialized.objects, function () {
        this.backgroundColor = serialized.background;
        if (callback) {
          callback();
        }
      }.bind(this));

      return this;
    },

    _enlivenObjects: function (objects, callback) {
      var numLoadedImages = 0,
          numTotalImages = objects.findAll(function (o){
            return o.type === 'image';
          }).length;

      var _this = this;

      objects.each(function (o) {
        if (!o.type) {
          return;
        }
        switch (o.type) {
          case 'image':
          case 'font':
            Canvas[o.type.capitalize()].fromObject(o, function (o) {
              _this.add(o);
              if (++numLoadedImages === numTotalImages) {
                if (callback) callback();
              }
            });
            break;
          default:
            var klass = Canvas[o.type.capitalize().camelize()];
            if (klass && klass.fromObject) {
              _this.add(klass.fromObject(o));
            }
            break;
        }
      });

      if (numTotalImages === 0 && callback) {
        callback();
      }
    },

    loadFromDatalessJSON: function (json, callback) {

      if (!json) {
        return;
      }

      var serialized = (typeof json === 'string')
        ? json.evalJSON()
        : json;

      if (!serialized || (serialized && !serialized.objects)) return;

      this.clear();

      this._enlivenDatalessObjects(serialized.objects, callback);
    },

    _enlivenDatalessObjects: function (objects, callback) {

      function onObjectLoaded(object, index) {
        _this.insertAt(object, index);
				object.setCoords();
        if (++numLoadedObjects === numTotalObjects) {
          callback && callback();
        }
      }

      var _this = this,
          numLoadedObjects = 0,
          numTotalObjects = objects.length;

      try {
        objects.each(function (obj, index) {

          var pathProp = obj.paths ? 'paths' : 'path';
          var path = obj[pathProp];

          delete obj[pathProp];

          if (typeof path !== 'string') {
            switch (obj.type) {
              case 'image':
              case 'text':
                Canvas[obj.type.capitalize()].fromObject(obj, function (o) {
                  onObjectLoaded(o);
                });
                break;
              default:
                var klass = Canvas[obj.type.capitalize().camelize()];
                if (klass && klass.fromObject) {
                  onObjectLoaded(klass.fromObject(obj));
                }
                break;
            }
          }
          else {
            if (obj.type === 'image') {
              _this.loadImageFromURL(path, function (image) {
                image.setSourcePath(path);

                Object.extend(image, obj);
                image.setAngle(obj.angle);

                onObjectLoaded(image, index);
              });
            }
            else if (obj.type === 'text') {

              obj.path = path;
              var object = Canvas.Text.fromObject(obj);
              window.__context = _this;
              var onscriptload = function () {
                if (Prototype.Browser.Opera) {
                  setTimeout(function () {
                    onObjectLoaded(object, index);
                  }, 500);
                }
                else {
                  onObjectLoaded(object, index);
                }
              }

              Prototype.getScript(path, onscriptload);
            }
            else {
              _this.loadSVGFromURL(path, function (elements, options) {
                if (elements.length > 1) {
                  var object = new Canvas.PathGroup(elements, obj);
                }
                else {
                  var object = elements[0];
                }
                object.setSourcePath(path);

                if (!(object instanceof Canvas.PathGroup)) {
                  Object.extend(object, obj);
                  if (typeof obj.angle !== 'undefined') {
                    object.setAngle(obj.angle);
                  }
                }

                onObjectLoaded(object, index);
              });
            }
          }
        }, this);
      }
      catch(e) {
        console.log(e.message);
      }
    },

    /**
     * Loads an image from URL
     * @method loadImageFromURL
     * @param url {String} url of image to load
     * @param callback {Function} calback, invoked when image is loaded
     */
    loadImageFromURL: (function () {
      var imgCache = { };

      return function (url, callback) {

        var _this = this;

        function checkIfLoaded() {
          var imgEl = document.getElementById(imgCache[url]);
          if (imgEl.width && imgEl.height) {
            callback(new Canvas.Image(imgEl));
          }
          else {
            setTimeout(checkIfLoaded, 50);
          }
        }

        if (imgCache[url]) {
          checkIfLoaded();
        }
        else {
          var imgEl = new Image();
          imgEl.onload = function () {
            imgEl.onload = null;

            _this._resizeImageToFit(imgEl);

            var oImg = new Canvas.Image(imgEl);
            callback(oImg);
          };

          imgEl.className = 'canvas-img-clone';
          imgEl.src = url;

          if (this.shouldCacheImages) {
            imgCache[url] = Element.identify(imgEl);
          }
          document.body.appendChild(imgEl);
        }
      }
    })(),

    loadSVGFromURL: function (url, callback) {

      var _this = this;

      url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').strip();

      this.cache.has(url, function (hasUrl) {
        if (hasUrl) {
          _this.cache.get(url, function (value) {
            var enlivedRecord = _this._enlivenCachedObject(value);
            callback(enlivedRecord.objects, enlivedRecord.options);
          });
        }
        else {
          new Ajax.Request(url, {
            method: 'get',
            onComplete: onComplete,
            onFailure: onFailure
          });
        }
      });

      function onComplete(r) {

        var xml = r.responseXML;
        if (!xml) return;

        var doc = xml.documentElement;
        if (!doc) return;

        Canvas.parseSVGDocument(doc, function (results, options) {
          _this.cache.set(url, {
            objects: results.invoke('toObject'),
            options: options
          });
          callback(results, options);
        });
      }

      function onFailure() {
        console.log('ERROR!');
      }
    },

    _enlivenCachedObject: function (cachedObject) {

      var objects = cachedObject.objects;
      var options = cachedObject.options;

      objects = objects.map(function (o) {
        return Canvas[o.type.capitalize()].fromObject(o);
      });

      return ({ objects: objects, options: options });
    },

    /**
     * Removes an object from canvas and returns it
     * @method remove
     * @param object {Object} Object to remove
     * @return {Object} removed object
     */
    remove: function (object) {
      Canvas.util.removeFromArray(this._aObjects, object);
      this.renderAll();
      return object;
    },

    /**
     * Same as `remove` but animated
     * @method fxRemove
     * @param {Canvas.Object} object Object to remove
     * @param {Function} callback callback, invoked on effect completion
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    fxRemove: function (object, callback) {
      var _this = this;
      object.fxRemove({
        onChange: this.renderAll.bind(this),
        onComplete: function () {
          _this.remove(object);
          if (typeof callback === 'function') {
            callback();
          }
        }
      });
      return this;
    },

    /**
     * Moves an object to the bottom of the stack
     * @method sendToBack
     * @param object {Canvas.Object} Object to send to back
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    sendToBack: function (object) {
      Canvas.util.removeFromArray(this._aObjects, object);
      this._aObjects.unshift(object);
      return this.renderAll();
    },

    /**
     * Moves an object to the top of the stack
     * @method bringToFront
     * @param object {Canvas.Object} Object to send
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    bringToFront: function (object) {
      Canvas.util.removeFromArray(this._aObjects, object);
      this._aObjects.push(object);
      return this.renderAll();
    },

    /**
     * Moves an object one level down in stack
     * @method sendBackwards
     * @param object {Canvas.Object} Object to send
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    sendBackwards: function (object) {
      var idx = this._aObjects.indexOf(object),
          nextIntersectingIdx = idx;

      if (idx !== 0) {

        for (var i=idx-1; i>=0; --i) {
          if (object.intersectsWithObject(this._aObjects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        Canvas.util.removeFromArray(this._aObjects, object);
        this._aObjects.splice(nextIntersectingIdx, 0, object);
      }
      return this.renderAll();
    },

    /**
     * Moves an object one level up in stack
     * @method sendForward
     * @param object {Canvas.Object} Object to send
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    bringForward: function (object) {
      var objects = this.getObjects(),
          idx = objects.indexOf(object),
          nextIntersectingIdx = idx;


      if (idx !== objects.length-1) {

        for (var i=idx+1, l=this._aObjects.length; i<l; ++i) {
          if (object.intersectsWithObject(objects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        Canvas.util.removeFromArray(objects, object);
        objects.splice(nextIntersectingIdx, 0, object);
      }
      this.renderAll();
    },

    /**
     * Sets given object as active
     * @method setActiveObject
     * @param object {Canvas.Object} Object to set as an active one
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    setActiveObject: function (object) {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = object;
      object.setActive(true);

      this.renderAll();

      document.fire('object:selected', { target: object });
      return this;
    },

    /**
     * Returns currently active object
     * @method getActiveObject
     * @return {Canvas.Object} active object
     */
    getActiveObject: function () {
      return this._activeObject;
    },

    /**
     * Removes an active object
     * @method removeActiveObject
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    removeActiveObject: function () {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = null;
      return this;
    },

    /**
     * Sets current group to a speicified one
     * @method setActiveGroup
     * @param group {Canvas.Group} group to set as a current one
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    setActiveGroup: function (group) {
      this._activeGroup = group;
      return this;
    },

    /**
     * Returns current group
     * @method getActiveGroup
     * @return {Canvas.Group} Current group
     */
    getActiveGroup: function () {
      return this._activeGroup;
    },

    /**
     * Removes current group
     * @method removeActiveGroup
     * @return {Canvas.Element} thisArg
     */
    removeActiveGroup: function () {
      var g = this.getActiveGroup();
      if (g) {
        g.destroy();
      }
      return this.setActiveGroup(null);
    },

    /**
     * @method item
     * @param {Number} index
     * @return {Canvas.Object}
     */
    item: function (index) {
      return this.getObjects()[index];
    },

    /**
     * Deactivates all objects by calling their setActive(false)
     * @method deactivateAll
     * @return {Canvas.Element} thisArg
     */
    deactivateAll: function () {
      var allObjects = this.getObjects(),
          i = 0,
          len = allObjects.length;
      for ( ; i < len; i++) {
        allObjects[i].setActive(false);
      }
      this.removeActiveGroup();
      this.removeActiveObject();
      return this;
    },

    /**
     * Returns number representation of an instance complexity
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function () {
      return this.getObjects().inject(0, function (memo, current) {
        memo += current.complexity ? current.complexity() : 0;
        return memo;
      });
    },

    /**
     * Clears a canvas element and removes all event handlers.
     * @method dispose
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    dispose: function () {
      this.clear();
      Event.stopObserving(this.getElement(), 'mousedown', this._onMouseDown);
      Event.stopObserving(document, 'mouseup', this._onMouseUp);
      Event.stopObserving(document, 'mousemove', this._onMouseMove);
      Event.stopObserving(window, 'resize', this._onResize);
      return this;
    },

    /**
     * @method clone
     * @param {Object} callback OPTIONAL expects `onBeforeClone` and `onAfterClone` functions
     * @return {Canvas.Element} instance clone
     */
    clone: function (callback) {
      var el = document.createElement('canvas');
      el.width = this.getWidth();
      el.height = this.getHeight();

      var clone = this.__clone || (this.__clone = new Canvas.Element(el));

      return clone.loadFromJSON(this.toJSON(), function () {
        if (callback) {
          callback(clone);
        }
      });
    },

    _toDataURL: function (format, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURL(format));
      });
    },

    _toDataURLWithMultiplier: function (format, multiplier, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURLWithMultiplier(format, multiplier));
      });
    },

    _resizeImageToFit: function (imgEl) {

      var widthScaleFactor = 1, //this.CANVAS_WIDTH / this.CANVAS_PRINT_WIDTH,
          heightScaleFactor = 1, //this.CANVAS_HEIGHT / this.CANVAS_PRINT_HEIGHT,
          imageWidth = imgEl.width || imgEl.offsetWidth,
          imageHeight = imgEl.height || imgEl.offsetHeight;


      if (imageWidth && imageHeight) {
        imgEl.width = imageWidth * widthScaleFactor;
        imgEl.height = imageHeight * heightScaleFactor;
      }
    },

    /* stubs */
    cache: {
      has: function (name, callback){ callback(false) },
      get: function () { },
      set: function () { }
    }
  });

  /**
   * Returns a string representation of an instance
   * @method toString
   * @return {String} string representation of an instance
   */
  Canvas.Element.prototype.toString = function () {
    return '#<Canvas.Element (' + this.complexity() + '): '+
           '{ objects: ' + this.getObjects().length + ' }>';
  };

  Object.extend(Canvas.Element, {

    /**
     * @property EMPTY_JSON
     */
    EMPTY_JSON: '{"objects": [], "background": "white"}',

    /**
     * @static
     * @method toGrayscale
     * @param {HTMLCanvasElement} canvasEl
     */
    toGrayscale: function (canvasEl) {
       var context = canvasEl.getContext('2d'),
           imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
           data = imageData.data,
           iLen = imageData.width,
           jLen = imageData.height,
           index, average;

       for (i = 0; i < iLen; i++) {
         for (j = 0; j < jLen; j++) {

           index = (i * 4) * jLen + (j * 4);
           average = (data[index] + data[index + 1] + data[index + 2]) / 3;

           data[index]     = average;
           data[index + 1] = average;
           data[index + 2] = average;
         }
       }

       context.putImageData(imageData, 0, 0);
     },

    /**
     * Provides a way to check support of some of the canvas methods
     * (either those of HTMLCanvasElement itself, or rendering context)
     * @method supports
     * @param methodName {String} method to check support for
     * @return {Boolean | null} `true` if method is supported (or at least exists),
     * `null` if canvas element or context can not be initialized
     */
    supports: function (methodName) {
      var el = document.createElement('canvas');
      if (!el || !el.getContext) {
        return null;
      }

      var ctx = el.getContext('2d');
      if (!ctx) {
        return null;
      }

      switch (methodName) {

        case 'getImageData':
          return typeof ctx.getImageData !== 'undefined';

        case 'toDataURL':
          return typeof el.toDataURL !== 'undefined';

        default:
          return null;
      }
    }

  });
})();

(function(){

  var global = this;
  /**
   * @name Canvas
   * @namespace
   */
  var Canvas = global.Canvas || (global.Canvas = { });
  if (Canvas.Object) {
    return;
  }

  var _slice = Array.prototype.slice;

  /**
   * @class Object
   * @memberOf Canvas
   */
  Canvas.Object = Class.create( /** @lends Canvas.Object.prototype */ {

    type: 'object',

    includeDefaultValues: true,

    /**
     * @constant
     */
    NUM_FRACTION_DIGITS:        2,

    /**
     * @constant
     */
    FX_DURATION:                500,

    /**
     * @constant
     */
    FX_TRANSITION:              'decel',

    /**
     * @constant
     */
    MIN_SCALE_LIMIT:            0.1,

    /**
     * @field
     */
    stateProperties:  ('top left width height scaleX scaleY flipX flipY ' +
                      'theta angle opacity cornersize fill overlayFill stroke ' +
                      'strokeWidth fillRule borderScaleFactor transformMatrix').split(' '),

    /**
     * @field
     */
    options: {
      top:                      0,
      left:                     0,
      width:                    100,
      height:                   100,
      scaleX:                   1,
      scaleY:                   1,
      flipX:                    false,
      flipY:                    false,
      theta:                    0,
      opacity:                  1,
      angle:                    0,
      cornersize:               10,
      padding:                  0,
      borderColor:              'rgba(102,153,255,0.75)',
      cornerColor:              'rgba(102,153,255,0.5)',
      fill:                     'rgb(0,0,0)',
      overlayFill:              null,
      stroke:                   null,
      strokeWidth:              1,
      fillRule:                 'source-over',
      borderOpacityWhenMoving:  0.4,
      borderScaleFactor:        1,
      transformMatrix:          null
    },

    callSuper: function(methodName) {
      var fn = this.constructor.superclass.prototype[methodName];
      return (arguments.length > 1)
        ? fn.apply(this, _slice.call(arguments, 1))
        : fn.call(this);
    },

    /**
     * @constructs
     * @param options {Object} options
     */
    initialize: function(options) {
      this.setOptions(options);
      this._importProperties();
      this.originalState = { };
      this.setCoords();
      this.saveState();
    },

    setOptions: function(options) {
      this.options = Object.extend(this._getOptions(), options);
    },

    /**
     * @private
     * @method _getOptions
     */
    _getOptions: function() {
      return Object.extend(Object.clone(this._getSuperOptions()), this.options);
    },

    /**
     * @private
     * @method _getSuperOptions
     */
    _getSuperOptions: function() {
      var c = this.constructor;
      if (c) {
        var s = c.superclass;
        if (s) {
          var p = s.prototype;
          if (p && typeof p._getOptions == 'function') {
            return p._getOptions();
          }
        }
      }
      return { };
    },

    /**
     * @private
     * @method _importProperties
     */
    _importProperties: function() {
      this.stateProperties.each(function(prop) {
        (prop === 'angle')
          ? this.setAngle(this.options[prop])
          : (this[prop] = this.options[prop]);
      }, this);
    },

    /**
     * @method transform
     * @param {CanvasRenderingContext2D} ctx Context
     */
    transform: function(ctx) {
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.left, this.top);
      ctx.rotate(this.theta);
      ctx.scale(
        this.scaleX * (this.flipX ? -1 : 1),
        this.scaleY * (this.flipY ? -1 : 1)
      );
    },

    /**
     * Returns a JSON representation of an instance
     * @method toJSON
     * @return {String} json
     */
    toJSON: function() {
      return Object.toJSON(this.toObject());
    },

    /**
     * Returns an object representation of an instance
     * @method toObject
     * @return {Object}
     */
    toObject: function() {
      var toFixed = Canvas.util.toFixed;
      var object = {
        type: this.type,
        left: toFixed(this.left, this.NUM_FRACTION_DIGITS),
        top: toFixed(this.top, this.NUM_FRACTION_DIGITS),
        width: toFixed(this.width, this.NUM_FRACTION_DIGITS),
        height: toFixed(this.height, this.NUM_FRACTION_DIGITS),
        fill: this.fill,
        overlayFill: this.overlayFill,
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        scaleX: toFixed(this.scaleX, this.NUM_FRACTION_DIGITS),
        scaleY: toFixed(this.scaleY, this.NUM_FRACTION_DIGITS),
        angle: toFixed(this.getAngle(), this.NUM_FRACTION_DIGITS),
        flipX: this.flipX,
        flipY: this.flipY,
        opacity: toFixed(this.opacity, this.NUM_FRACTION_DIGITS)
      };

      if (!this.includeDefaultValues) {
        object = this._removeDefaultValues(object);
      }
      return object;
    },

    /**
     * @method toDatalessObject
     */
    toDatalessObject: function() {
      return this.toObject();
    },

    /**
     * @private
     * @method _removeDefaultValues
     */
    _removeDefaultValues: function(object) {
      var defaultOptions = Canvas.Object.prototype.options;
      this.stateProperties.each(function(prop) {
        if (object[prop] === defaultOptions[prop]) {
          delete object[prop];
        }
      });
      return object;
    },

    /**
     * Returns true if an object is in its active state
     * @return {Boolean} true if an object is in its active state
     */
    isActive: function() {
      return !!this.active;
    },

    /**
     * Sets state of an object - `true` makes it active, `false` - inactive
     * @param {Boolean} active
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    setActive: function(active) {
      this.active = !!active;
      return this;
    },

    /**
     * Returns a string representation of an instance
     * @return {String}
     */
    toString: function() {
      return "#<Canvas." + this.type.capitalize() + ">";
    },

    /**
     * Basic setter
     * @param {Any} property
     * @param {Any} value
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    set: function(property, value) {
      var shouldConstrainValue = (property === 'scaleX' || property === 'scaleY') && value < this.MIN_SCALE_LIMIT;
      if (shouldConstrainValue) {
        value = this.MIN_SCALE_LIMIT;
      }
      if (property === 'angle') {
        this.setAngle(value);
      }
      else {
        if (property === 'fill' && this.overlayFill) {
          this.overlayFill = value;
        }
        else {
          this[property] = value;
        }
      }
      return this;
    },

    /**
     * Toggles specified property from `true` to `false` or from `false` to `true`
     * @method toggle
     * @param {String} property property to toggle
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    toggle: function(property) {
      var value = this.get(property);
      if (typeof value === 'boolean') {
        this.set(property, !value);
      }
      return this;
    },

    /**
     * @method setSourcePath
     * @param {String} value
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    setSourcePath: function(value) {
      this.sourcePath = value;
      return this;
    },

    /**
     * Basic getter
     * @method get
     * @param {Any} property
     * @return {Any} value of a property
     */
    get: function(property) {
      return (property === 'angle')
        ? this.getAngle()
        : this[property];
    },

    /**
     * @method render
     * @param {CanvasRenderingContext2D} ctx context to render on
     * @param {Boolean} noTransform
     */
    render: function(ctx, noTransform) {

      if (this.width === 0 || this.height === 0) return;

      ctx.save();

      var m = this.transformMatrix;
      if (m) {
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }

      if (!noTransform) {
        this.transform(ctx);
      }

      if (this.stroke) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.stroke;
      }

      if (this.overlayFill) {
        ctx.fillStyle = this.overlayFill;
      }
      else if (this.fill) {
        ctx.fillStyle = this.fill;
      }

      this._render(ctx);

      if (this.active && !noTransform) {
        this.drawBorders(ctx);
        this.drawCorners(ctx);
      }
      ctx.restore();
    },

    /**
     * Returns width of an object
     * @method getWidth
     * @return {Number} width value
     */
    getWidth: function() {
      return this.width * this.scaleX;
    },

    /**
     * Returns height of an object
     * @method getHeight
     * @return {Number} height value
     */
    getHeight: function() {
      return this.height * this.scaleY;
    },

    /**
     * Scales an object (equally by x and y)
     * @method scale
     * @param value {Number} scale factor
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    scale: function(value) {
      this.scaleX = value;
      this.scaleY = value;
      return this;
    },

    /**
     * Scales an object to a given width (scaling by x/y equally)
     * @method scaleToWidth
     * @param value {Number} new width value
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    scaleToWidth: function(value) {
      return this.scale(value / this.width);
    },

    /**
     * Scales an object to a given height (scaling by x/y equally)
     * @method scaleToHeight
     * @param value {Number} new height value
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    scaleToHeight: function(value) {
      return this.scale(value / this.height);
    },

    /**
     * Sets object opacity
     * @method setOpacity
     * @param value {Number} value 0-1
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    setOpacity: function(value) {
      this.set('opacity', value);
      return this;
    },

    /**
     * Returns object's angle value
     * @method getAngle
     * @return {Number} angle value
     */
    getAngle: function() {
      return this.theta * 180 / Math.PI;
    },

    /**
     * Sets object's angle
     * @method setAngle
     * @param value {Number} angle value
     * @return {Object} thisArg
     */
    setAngle: function(value) {
      this.theta = value / 180 * Math.PI;
      this.angle = value;
      return this;
    },

    /**
     * Sets corner position coordinates based on current angle, width and height.
     * @method setCoords
     * return {Canvas.Object} thisArg
     * @chainable
     */
    setCoords: function() {

      this.currentWidth = this.width * this.scaleX;
      this.currentHeight = this.height * this.scaleY;

      this._hypotenuse = Math.sqrt(
        Math.pow(this.currentWidth / 2, 2) +
        Math.pow(this.currentHeight / 2, 2));

      this._angle = Math.atan(this.currentHeight / this.currentWidth);

      var offsetX = Math.cos(this._angle + this.theta) * this._hypotenuse,
          offsetY = Math.sin(this._angle + this.theta) * this._hypotenuse,
          theta = this.theta,
          sinTh = Math.sin(theta),
          cosTh = Math.cos(theta);

      var tl = {
        x: this.left - offsetX,
        y: this.top - offsetY
      };
      var tr = {
        x: tl.x + (this.currentWidth * cosTh),
        y: tl.y + (this.currentWidth * sinTh)
      };
      var br = {
        x: tr.x - (this.currentHeight * sinTh),
        y: tr.y + (this.currentHeight * cosTh)
      };
      var bl = {
        x: tl.x - (this.currentHeight * sinTh),
        y: tl.y + (this.currentHeight * cosTh)
      };
      var ml = {
        x: tl.x - (this.currentHeight/2 * sinTh),
        y: tl.y + (this.currentHeight/2 * cosTh)
      };
      var mt = {
        x: tl.x + (this.currentWidth/2 * cosTh),
        y: tl.y + (this.currentWidth/2 * sinTh)
      };
      var mr = {
        x: tr.x - (this.currentHeight/2 * sinTh),
        y: tr.y + (this.currentHeight/2 * cosTh)
      }
      var mb = {
        x: bl.x + (this.currentWidth/2 * cosTh),
        y: bl.y + (this.currentWidth/2 * sinTh)
      }

      this.oCoords = { tl: tl, tr: tr, br: br, bl: bl, ml: ml, mt: mt, mr: mr, mb: mb };

      this._setCornerCoords();

      return this;
    },

    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @method drawBorders
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    drawBorders: function(ctx) {
      var o = this.options,
          padding = o.padding,
          padding2 = padding * 2;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? o.borderOpacityWhenMoving : 1;
      ctx.strokeStyle = o.borderColor;

      var scaleX = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX);
      var scaleY = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);

      ctx.lineWidth = 1 / this.borderScaleFactor;

      ctx.scale(scaleX, scaleY);

      var w = this.getWidth(),
          h = this.getHeight();

      ctx.strokeRect(
        Math.floor(-(w / 2) - padding) + 0.5, // offset needed to make lines look sharper
        Math.floor(-(h / 2) - padding) + 0.5,
        Math.floor(w + padding2),
        Math.floor(h + padding2)
      );

      ctx.restore();
      return this;
    },

    /**
     * Draws corners of an object's bounding box.
     * Requires public properties: width, height, scaleX, scaleY
     * Requires public options: cornersize, padding
     * @method drawCorners
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    drawCorners: function(ctx) {
      var size = this.options.cornersize,
          size2 = size / 2,
          padding = this.options.padding,
          left = -(this.width / 2),
          top = -(this.height / 2),
          _left,
          _top,
          sizeX = size / this.scaleX,
          sizeY = size / this.scaleY,
          scaleOffsetY = (padding + size2) / this.scaleY,
          scaleOffsetX = (padding + size2) / this.scaleX,
          scaleOffsetSizeX = (padding + size2 - size) / this.scaleX,
          scaleOffsetSizeY = (padding + size2 - size) / this.scaleY;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? this.options.borderOpacityWhenMoving : 1;
      ctx.fillStyle = this.options.cornerColor;

      _left = left - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left - scaleOffsetX;
      _top = top + this.height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width + scaleOffsetSizeX;
      _top = top + this.height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width/2 - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width/2 - scaleOffsetX;
      _top = top + this.height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width + scaleOffsetSizeX;
      _top = top + this.height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left - scaleOffsetX;
      _top = top + this.height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      ctx.restore();

      return this;
    },

    /**
     * Clones an instance
     * @method clone
     * @param {Object} options object
     * @return {Canvas.Object} clone of an instance
     */
    clone: function(options) {
      if (this.constructor.fromObject) {
        return this.constructor.fromObject(this.toObject(), options);
      }
      return new Canvas.Object(this.toObject());
    },

    /**
     * Creates an instance of Canvas.Image out of an object
     * @method cloneAsImage
     * @param callback {Function} callback, invoked with an instance as a first argument
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    cloneAsImage: function(callback) {
      if (Canvas.Image) {
        var i = new Image();
        i.onload = function() {
          if (callback) {
            callback(new Canvas.Image(i), orig);
          }
          i = i.onload = null;
        }
        var orig = {
          angle: this.get('angle'),
          flipX: this.get('flipX'),
          flipY: this.get('flipY')
        }

        this.set('angle', 0).set('flipX', false).set('flipY', false);
        i.src = this.toDataURL();
      }
      return this;
    },

    /**
     * Converts an object into a data-url-like string
     * @method toDataURL
     * @return {String} string of data
     */
    toDataURL: function() {
      var el = document.createElement('canvas');

      el.width = this.getWidth();
      el.height = this.getHeight();

      Element.wrap(el, 'div');

      var canvas = new Canvas.Element(el);
      canvas.backgroundColor = 'transparent';
      canvas.renderAll();

      var clone = this.clone();
      clone.left = el.width / 2;
      clone.top = el.height / 2;

      clone.setActive(false);

      canvas.add(clone);
      var data = canvas.toDataURL('png');

      canvas.dispose();
      canvas = clone = null;
      return data;
    },

    /**
     * @method hasStateChanged
     * @return {Boolean} true if instance' state has changed
     */
    hasStateChanged: function() {
      return this.stateProperties.any(function(prop) {
        return this[prop] !== this.originalState[prop];
      }, this);
    },

    /**
     * @method saveState
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    saveState: function() {
      this.stateProperties.each(function(prop) {
        this.originalState[prop] = this.get(prop);
      }, this);
      return this;
    },

    /**
     * Returns true if object intersects with an area formed by 2 points
     * @method intersectsWithRect
     * @param {Object} selectionTL
     * @param {Object} selectionBR
     * @return {Boolean}
     */
    intersectsWithRect: function(selectionTL, selectionBR) {
      var oCoords = this.oCoords,
          tl = new Canvas.Point(oCoords.tl.x, oCoords.tl.y),
          tr = new Canvas.Point(oCoords.tr.x, oCoords.tr.y),
          bl = new Canvas.Point(oCoords.bl.x, oCoords.bl.y),
          br = new Canvas.Point(oCoords.br.x, oCoords.br.y);

      var intersection = Canvas.Intersection.intersectPolygonRectangle(
        [tl, tr, br, bl],
        selectionTL,
        selectionBR
      );
      return (intersection.status === 'Intersection');
    },

    /**
     * Returns true if object intersects with another object
     * @method intersectsWithObject
     * @param {Object} other Object to test
     * @return {Boolean}
     */
    intersectsWithObject: function(other) {
      function getCoords(oCoords) {
        return {
          tl: new Canvas.Point(oCoords.tl.x, oCoords.tl.y),
          tr: new Canvas.Point(oCoords.tr.x, oCoords.tr.y),
          bl: new Canvas.Point(oCoords.bl.x, oCoords.bl.y),
          br: new Canvas.Point(oCoords.br.x, oCoords.br.y)
        }
      }
      var thisCoords = getCoords(this.oCoords),
          otherCoords = getCoords(other.oCoords);
      var intersection = Canvas.Intersection.intersectPolygonPolygon(
        [thisCoords.tl, thisCoords.tr, thisCoords.br, thisCoords.bl],
        [otherCoords.tl, otherCoords.tr, otherCoords.br, otherCoords.bl]
      );

      return (intersection.status === 'Intersection');
    },

    /**
     * Returns true if object is fully contained within area formed by 2 points
     * @method isContainedWithinRect
     * @param {Object} selectionTL
     * @param {Object} selectionBR
     * @return {Boolean}
     */
    isContainedWithinRect: function(selectionTL, selectionBR) {
      var oCoords = this.oCoords,
          tl = new Canvas.Point(oCoords.tl.x, oCoords.tl.y),
          tr = new Canvas.Point(oCoords.tr.x, oCoords.tr.y),
          bl = new Canvas.Point(oCoords.bl.x, oCoords.bl.y),
          br = new Canvas.Point(oCoords.br.x, oCoords.br.y);
      return tl.x > selectionTL.x
        && tr.x < selectionBR.x
        && tl.y > selectionTL.y
        && bl.y < selectionBR.y;
    },

    /**
     * @method isType
     * @param type {String} type to check against
     * @return {Boolean} true if specified type is identical to the type of instance
     */
    isType: function(type) {
      return this.type === type;
    },

    /**
     * Determines which one of the four corners has been clicked
     * @method _findTargetCorner
     * @private
     * @param e {Event} event object
     * @param offset {Object} canvas offset
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner: function(e, offset) {
      var pointer = Event.pointer(e),
          ex = pointer.x - offset.left,
          ey = pointer.y - offset.top,
          xpoints,
          lines;

      for (var i in this.oCoords) {
        lines = this._getImageLines(this.oCoords[i].corner, i);
        xpoints = this._findCrossPoints(ex, ey, lines);
        if (xpoints % 2 == 1 && xpoints != 0) {
          this.__corner = i;
          return i;
        }
      }
      return false;
    },

    /**
     * Helper method to determine how many cross points are between the 4 image edges
     * and the horizontal line determined by the position of our mouse when clicked on canvas
     * @method _findCrossPoints
     * @private
     * @param ex {Number} x coordinate of the mouse
     * @param ey {Number} y coordinate of the mouse
     * @param oCoords {Object} Coordinates of the image being evaluated
     */
    _findCrossPoints: function(ex, ey, oCoords) {
      var b1, b2, a1, a2, xi, yi,
          xcount = 0,
          iLine;

      for (var lineKey in oCoords) {
        iLine = oCoords[lineKey];
        if ((iLine.o.y < ey) && (iLine.d.y < ey)) {
          continue;
        }
        if ((iLine.o.y >= ey) && (iLine.d.y >= ey)) {
          continue;
        }
        if ((iLine.o.x == iLine.d.x) && (iLine.o.x >= ex)) {
          xi = iLine.o.x;
          yi = ey;
        }
        else {
          b1 = 0;
          b2 = (iLine.d.y-iLine.o.y)/(iLine.d.x-iLine.o.x);
          a1 = ey-b1*ex;
          a2 = iLine.o.y-b2*iLine.o.x;

          xi = - (a1-a2)/(b1-b2);
          yi = a1+b1*xi;
        }
        if (xi >= ex) {
          xcount += 1;
        }
        if (xcount == 2) {
          break;
        }
      }
      return xcount;
    },

    /**
     * Method that returns an object with the image lines in it given the coordinates of the corners
     * @method _getImageLines
     * @private
     * @param oCoords {Object} coordinates of the image corners
     */
    _getImageLines: function(oCoords, i) {
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
      }
    },

    /**
     * Sets the coordinates of the draggable boxes in the corners of
     * the image used to scale/rotate it.
     * @method _setCornerCoords
     * @private
     */
    _setCornerCoords: function() {
      var coords = this.oCoords,
          theta = this.theta,
          cosOffset = this.cornersize * /*this.scaleX * */ Math.cos(theta),
          sinOffset = this.cornersize * /*this.scaleY * */ Math.sin(theta),
          size2 = this.cornersize / 2,
          size2x = size2 - sinOffset,
          size2y = size2,
          corner;

      coords.tl.x -= size2x;
      coords.tl.y -= size2y;

      coords.tl.corner = {
        tl: {
          x: coords.tl.x,
          y: coords.tl.y
        },
        tr: {
          x: coords.tl.x + cosOffset,
          y: coords.tl.y + sinOffset
        },
        bl: {
          x: coords.tl.x - sinOffset,
          y: coords.tl.y + cosOffset
        }
      };
      coords.tl.corner.br = {
        x: coords.tl.corner.tr.x - sinOffset,
        y: coords.tl.corner.tr.y + cosOffset
      };

      coords.tl.x += size2x;
      coords.tl.y += size2y;

      coords.tr.x += size2;
      coords.tr.y -= size2;
      coords.tr.corner = {
        tl: {
          x: coords.tr.x - cosOffset,
          y: coords.tr.y - sinOffset
        },
        tr: {
          x: coords.tr.x,
          y: coords.tr.y
        },
        br: {
          x: coords.tr.x - sinOffset,
          y: coords.tr.y + cosOffset
        }
      };
      coords.tr.corner.bl = {
        x: coords.tr.corner.tl.x - sinOffset,
        y: coords.tr.corner.tl.y + cosOffset
      };
      coords.tr.x -= size2;
      coords.tr.y += size2;

      coords.bl.x -= size2;
      coords.bl.y += size2;
      coords.bl.corner = {
        tl: {
          x: coords.bl.x + sinOffset,
          y: coords.bl.y - cosOffset
        },
        bl: {
          x: coords.bl.x,
          y: coords.bl.y
        },
        br: {
          x: coords.bl.x + cosOffset,
          y: coords.bl.y + sinOffset
        }
      };
      coords.bl.corner.tr = {
        x: coords.bl.corner.br.x + sinOffset,
        y: coords.bl.corner.br.y - cosOffset
      };
      coords.bl.x += size2;
      coords.bl.y -= size2;

      coords.br.x += size2;
      coords.br.y += size2;
      coords.br.corner = {
        tr: {
          x: coords.br.x + sinOffset,
          y: coords.br.y - cosOffset
        },
        bl: {
          x: coords.br.x - cosOffset,
          y: coords.br.y - sinOffset
        },
        br: {
          x: coords.br.x,
          y: coords.br.y
        }
      };
      coords.br.corner.tl = {
        x: coords.br.corner.bl.x + sinOffset,
        y: coords.br.corner.bl.y - cosOffset
      };
      coords.br.x -= size2;
      coords.br.y -= size2;


      coords.ml.x -= size2;
      coords.ml.y -= size2;
      coords.ml.corner = {
        tl: {
          x: coords.ml.x,
          y: coords.ml.y
        },
        tr: {
          x: coords.ml.x + cosOffset,
          y: coords.ml.y + sinOffset
        },
        bl: {
          x: coords.ml.x - sinOffset,
          y: coords.ml.y + cosOffset
        }
      };
      coords.ml.corner.br = {
        x: coords.ml.corner.tr.x - sinOffset,
        y: coords.ml.corner.tr.y + cosOffset
      };
      coords.ml.x += size2;
      coords.ml.y += size2;

      coords.mt.x -= size2;
      coords.mt.y -= size2;
      coords.mt.corner = {
        tl: {
          x: coords.mt.x,
          y: coords.mt.y
        },
        tr: {
          x: coords.mt.x + cosOffset,
          y: coords.mt.y + sinOffset
        },
        bl: {
          x: coords.mt.x - sinOffset,
          y: coords.mt.y + cosOffset
        }
      };
      coords.mt.corner.br = {
        x: coords.mt.corner.tr.x - sinOffset,
        y: coords.mt.corner.tr.y + cosOffset
      };
      coords.mt.x += size2;
      coords.mt.y += size2;

      coords.mr.x -= size2;
      coords.mr.y -= size2;
      coords.mr.corner = {
        tl: {
          x: coords.mr.x,
          y: coords.mr.y
        },
        tr: {
          x: coords.mr.x + cosOffset,
          y: coords.mr.y + sinOffset
        },
        bl: {
          x: coords.mr.x - sinOffset,
          y: coords.mr.y + cosOffset
        }
      };
      coords.mr.corner.br = {
        x: coords.mr.corner.tr.x - sinOffset,
        y: coords.mr.corner.tr.y + cosOffset
      };
      coords.mr.x += size2;
      coords.mr.y += size2;

      coords.mb.x -= size2;
      coords.mb.y -= size2;
      coords.mb.corner = {
        tl: {
          x: coords.mb.x,
          y: coords.mb.y
        },
        tr: {
          x: coords.mb.x + cosOffset,
          y: coords.mb.y + sinOffset
        },
        bl: {
          x: coords.mb.x - sinOffset,
          y: coords.mb.y + cosOffset
        }
      };
      coords.mb.corner.br = {
        x: coords.mb.corner.tr.x - sinOffset,
        y: coords.mb.corner.tr.y + cosOffset
      };

      coords.mb.x += size2;
      coords.mb.y += size2;

      corner = coords.mb.corner;

      corner.tl.x -= size2;
      corner.tl.y -= size2;
      corner.tr.x -= size2;
      corner.tr.y -= size2;
      corner.br.x -= size2;
      corner.br.y -= size2;
      corner.bl.x -= size2;
      corner.bl.y -= size2;
    },

    /**
     * Makes object's color grayscale
     * @method toGrayscale
     * @return {Canvas.Object} thisArg
     */
    toGrayscale: function() {
      var fillValue = this.get('fill');
      if (fillValue) {
        this.set('overlayFill', new Canvas.Color(fillValue).toGrayscale().toRgb());
      }
      return this;
    },

    /**
     * @method complexity
     * @return {Number}
     */
    complexity: function() {
      return 0;
    },

    /**
     * @method getCenter
     * @return {Object} object with `x`, `y` properties corresponding to path center coordinates
     */
    getCenter: function() {
      return {
        x: this.get('left') + this.width / 2,
        y: this.get('top') + this.height / 2
      };
    },

    /**
     * @method straighten
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    straighten: function() {
      var angle = this._getAngleValueForStraighten();
      this.setAngle(angle);
      return this;
    },

    /**
     * @method fxStraighten
     * @param {Object} callbacks
     *                  - onComplete: invoked on completion
     *                  - onChange: invoked on every step of animation
     *
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    fxStraighten: function(callbacks) {
      callbacks = callbacks || { };

      callbacks.onComplete = callbacks.onComplete || Prototype.emptyFunction;
      callbacks.onChange = callbacks.onChange || Prototype.emptyFunction;

      var _this           = this,
          fx              = new APE.anim.Animation(),
          startAngleValue = this.get('angle'),
          endAngleValue   = this._getAngleValueForStraighten(),
          step            = endAngleValue - startAngleValue;

      fx.run = function(percent) {
        _this.setAngle(startAngleValue + step * percent);
        callbacks.onChange();
      };
      fx.onend = function() {
        _this.setCoords();
        callbacks.onComplete();
      };

      fx.duration = this.FX_DURATION;
      fx.transition = APE.anim.Transitions[this.FX_TRANSITION];

      fx.start();
      return this;
    },

    /**
     * @method fxRemove
     * @param {Object} callbacks
     * @return {Canvas.Object} thisArg
     * @chainable
     */
    fxRemove: function(callbacks) {
      callbacks = callbacks || { };

      callbacks.onComplete = callbacks.onComplete || Prototype.emptyFunction;
      callbacks.onChange = callbacks.onChange || Prototype.emptyFunction;

      var _this = this,
          fx = new APE.anim.Animation(),
          startValue = this.get('opacity'),
          endValue = 0,
          step = endValue - startValue;

      fx.run = function(percent) {
        _this.set('opacity', startValue + step * percent);
        callbacks.onChange();
      };
      fx.onend = function() {
        callbacks.onComplete();
      };
      fx.onstart = function() {
        _this.setActive(false);
      };

      fx.duration = this.FX_DURATION;
      fx.transition = APE.anim.Transitions[this.FX_TRANSITION];
      fx.start();

      return this;
    },

    /**
     * @method _getAngleValueForStraighten
     * @return {Number} angle value
     * @private
     */
    _getAngleValueForStraighten: function() {
      var angle = this.get('angle');


      if      (angle > -225 && angle <= -135) { return -180;  }
      else if (angle > -135 && angle <= -45)  { return  -90;  }
      else if (angle > -45  && angle <= 45)   { return    0;  }
      else if (angle > 45   && angle <= 135)  { return   90;  }
      else if (angle > 135  && angle <= 225 ) { return  180;  }
      else if (angle > 225  && angle <= 315)  { return  270;  }
      else if (angle > 315)                   { return  360;  }

      return 0;
    }
  });

  /**
   * @alias rotate -> setAngle
   */
  Canvas.Object.prototype.rotate = Canvas.Object.prototype.setAngle;
})();

(function(){

  var Canvas = this.Canvas || (this.Canvas = { });
  if (Canvas.Line) {
    return;
  }

  Canvas.Line = Class.create(Canvas.Object, {

    type: 'line',

    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(points, options) {
      if (!points) {
        points = [0, 0, 0, 0];
      }

      this.callSuper('initialize', options);

      this.set('x1', points[0]);
      this.set('y1', points[1]);
      this.set('x2', points[2]);
      this.set('y2', points[3]);

      this.set('width', this.x2 - this.x1);
      this.set('height', this.y2 - this.y1);
      this.set('left', this.x1 + this.width / 2);
      this.set('top', this.y1 + this.height / 2);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      ctx.moveTo(-this.width / 2, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);
      ctx.stroke();
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    },

    /**
     * @methd toObject
     * @return {Object}
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        x1: this.get('x1'),
        y1: this.get('y1'),
        x2: this.get('x2'),
        y2: this.get('y2')
      });
    }
  });

  Canvas.Element.ATTRIBUTE_NAMES = 'x1 y1 x2 y2 stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method Canvas.Line.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of Canvas.Line
   */
  Canvas.Line.fromElement = function(element, options) {
    var parsedAttributes = Canvas.parseAttributes(element, Canvas.Element.ATTRIBUTE_NAMES);
    var points = [
      parsedAttributes.x1 || 0,
      parsedAttributes.y1 || 0,
      parsedAttributes.x2 || 0,
      parsedAttributes.y2 || 0
    ];
    return new Canvas.Line(points, Object.extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method Canvas.Line.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Line
   */
  Canvas.Line.fromObject = function(object) {
    var points = [object.x1, object.y1, object.x2, object.y2];
    return new Canvas.Line(points, object);
  };
})();

(function() {

  var global  = this,
      Canvas  = global.Canvas || (global.Canvas = { }),
      piBy2   = Math.PI * 2;

  if (Canvas.Circle) {
    console.warn('Canvas.Circle is already defined.');
    return;
  }

  Canvas.Circle = Class.create(Canvas.Object, /** @lends Canvas.Circle.prototype */ {

    /**
     * @field
     */
    type: 'circle',

    /**
     * @constructs
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.set('radius', options.radius || 0);
      this.callSuper('initialize', options);

      var radiusBy2ByScale = this.get('radius') * 2 * this.get('scaleX');
      this.set('width', radiusBy2ByScale).set('height', radiusBy2ByScale);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        radius: this.get('radius')
      });
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, piBy2, false);
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 1;
    }
  });

  /**
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */
  Canvas.Circle.ATTRIBUTE_NAMES = 'cx cy r fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method Canvas.Circle.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @throws {Error} If value of `r` attribute is missing or invalid
   * @return {Object} instance of Canvas.Circle
   */
  Canvas.Circle.fromElement = function(element, options) {
    var parsedAttributes = Canvas.parseAttributes(element, Canvas.Circle.ATTRIBUTE_NAMES);
    if (!isValidRadius(parsedAttributes)) {
      throw Error('value of `r` attribute is required and can not be negative');
    }
    return new Canvas.Circle(Object.extend(parsedAttributes, options));
  };

  /**
   * @private
   */
  function isValidRadius(attributes) {
    return (('radius' in attributes) && (attributes.radius > 0));
  }

  /**
   * @static
   * @method Canvas.Circle.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Circle
   */
  Canvas.Circle.fromObject = function(object) {
    return new Canvas.Circle(object);
  }
})();

(function(){

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.Ellipse) {
    console.warn('Canvas.Ellipse is already defined.');
    return;
  }

  Canvas.Ellipse = Class.create(Canvas.Object, {

    type: 'ellipse',

    /**
     * @constructor
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.callSuper('initialize', options);

      this.set('rx', options.rx || 0);
      this.set('ry', options.ry || 0);

      this.set('width', this.get('rx') * 2);
      this.set('height', this.get('ry') * 2);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        rx: this.get('rx'),
        ry: this.get('ry')
      })
    },

    /**
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render on
     * @param noTransform {Boolean} context is not transformed when set to true
     */
    render: function(ctx, noTransform) {
      if (this.rx === 0 || this.ry === 0) return;
      return this.callSuper('render', ctx, noTransform);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      ctx.save();
      ctx.transform(1, 0, 0, this.ry/this.rx, 0, 0);
      ctx.arc(0, 0, this.rx, 0, Math.PI * 2, false);
      ctx.restore();
      if (this.stroke) {
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fill();
      }
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  Canvas.Ellipse.ATTRIBUTE_NAMES = 'cx cy rx ry fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method Canvas.Ellipse.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of Canvas.Ellipse
   */
  Canvas.Ellipse.fromElement = function(element, options) {
    var parsedAttributes = Canvas.parseAttributes(element, Canvas.Ellipse.ATTRIBUTE_NAMES);
    return new Canvas.Ellipse(Object.extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method Canvas.Ellipse.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Ellipse
   */
  Canvas.Ellipse.fromObject = function(object) {
    return new Canvas.Ellipse(object);
  }
})();

(function(){

  var Canvas = this.Canvas || (this.Canvas = { });
  if (Canvas.Rect) {
    return;
  }

  /**
   * @class Rect
   * @extends Canvas.Object
   */
  Canvas.Rect = Class.create(Canvas.Object, /** @lends Canvas.Rect.prototype */ {

    type: 'rect',

    options: {
      rx: 0,
      ry: 0
    },

    /**
     * @constructs
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      this.callSuper('initialize', options);
      this._initRxRy();
    },

    /**
     * @private
     * @method _initRxRy
     */
    _initRxRy: function() {
      if (this.options.rx && !this.options.ry) {
        this.options.ry = this.options.rx;
      }
      else if (this.options.ry && !this.options.rx) {
        this.options.rx = this.options.ry;
      }
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var rx = this.options.rx || 0,
          ry = this.options.ry || 0,
          x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;

      ctx.beginPath();
      ctx.moveTo(x+rx, y);
      ctx.lineTo(x+w-rx, y);
      ctx.bezierCurveTo(x+w, y, x+w, y+ry, x+w, y+ry);
      ctx.lineTo(x+w, y+h-ry);
      ctx.bezierCurveTo(x+w,y+h,x+w-rx,y+h,x+w-rx,y+h);
      ctx.lineTo(x+rx,y+h);
      ctx.bezierCurveTo(x,y+h,x,y+h-ry,x,y+h-ry);
      ctx.lineTo(x,y+ry);
      ctx.bezierCurveTo(x,y,x+rx,y,x+rx,y);
      ctx.closePath();

      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },

    _normalizeLeftTopProperties: function(parsedAttributes) {
      if (parsedAttributes.left) {
        this.set('left', parsedAttributes.left + this.getWidth() / 2);
      }
      if (parsedAttributes.top) {
        this.set('top', parsedAttributes.top + this.getHeight() / 2);
      }
      return this;
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  Canvas.Rect.ATTRIBUTE_NAMES = 'x y width height rx ry fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @private
   */
  function _setDefaultLeftTopValues(attributes) {
    attributes.left = attributes.left || 0;
    attributes.top  = attributes.top  || 0;
    return attributes;
  }

  /**
   * @static
   * @method Canvas.Rect.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of Canvas.Rect
   */
  Canvas.Rect.fromElement = function(element, options) {
    if (!element) {
      return null;
    }

    var parsedAttributes = Canvas.parseAttributes(element, Canvas.Rect.ATTRIBUTE_NAMES);
    parsedAttributes = _setDefaultLeftTopValues(parsedAttributes);

    var rect = new Canvas.Rect(Object.extend(options || { }, parsedAttributes));
    rect._normalizeLeftTopProperties(parsedAttributes);

    return rect;
  };

  /**
   * @static
   * @method Canvas.Rect.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Rect
   */
  Canvas.Rect.fromObject = function(object) {
    return new Canvas.Rect(object);
  };
})();

(function(){

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.Polyline) {
    console.warn('Canvas.Polyline is already defined');
    return;
  }

  Canvas.Polyline = Class.create(Canvas.Object, {

    type: 'polyline',

    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(points, options) {
      options = options || { };
      this.set('points', points);
      this.callSuper('initialize', options);
      this._calcDimensions();
    },

    /**
     * @private
     * @method _calcDimensions
     */
    _calcDimensions: function() {
      return Canvas.Polygon.prototype._calcDimensions.call(this);
    },

    /**
     * @private
     * @method _toOrigin
     */
    _toOrigin: function() {
      return Canvas.Polygon.prototype._toOrigin.call(this);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Canvas.Polygon.prototype.toObject.call(this);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.get('points').length;
    }
  });

  var ATTRIBUTE_NAMES = 'fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method Canvas.Polyline.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of Canvas.Polyline
   */
  Canvas.Polyline.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    var points = Canvas.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = Canvas.parseAttributes(element, ATTRIBUTE_NAMES);

    return new Canvas.Polyline(points, Object.extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method Canvas.Polyline.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Polyline
   */
  Canvas.Polyline.fromObject = function(object) {
    var points = object.points;
    return new Canvas.Polyline(points, object);
  }
})();

(function(){

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.Polygon) {
    console.warn('Canvas.Polygon is already defined');
    return;
  }

  function byX(p) { return p.x; }
  function byY(p) { return p.y; }

  Canvas.Polygon = Class.create(Canvas.Object, {

    type: 'polygon',

    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return thisArg
     */
    initialize: function(points, options) {
      options = options || { };
      this.points = points;
      this.callSuper('initialize', options);
      this._calcDimensions();
    },

    /**
     * @private
     * @method _calcDimensions
     */
    _calcDimensions: function() {

      var points = this.points,
          minX = points.min(byX),
          minY = points.min(byY),
          maxX = points.max(byX),
          maxY = points.max(byY);

      this.width = maxX - minX;
      this.height = maxY - minY;
      this.minX = minX;
      this.minY = minY;
    },

    /**
     * @private
     * @method _toOrigin
     */
    _toOrigin: function() {
      this.points = this.points.map(function(point) {
        return {
          x: point.x - this.minX,
          y: point.y - this.minY
        };
      }, this);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        points: this.points.clone()
      });
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.closePath();
        ctx.stroke();
      }
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.points.length;
    }
  });

  Canvas.Polygon.ATTRIBUTE_NAMES = 'fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method Canvas.Polygon.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of Canvas.Polygon
   */
  Canvas.Polygon.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    var points = Canvas.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = Canvas.parseAttributes(element, Canvas.Polygon.ATTRIBUTE_NAMES);

    return new Canvas.Polygon(points, Object.extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method Canvas.Polygon.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Polygon
   */
  Canvas.Polygon.fromObject = function(object) {
    return new Canvas.Polygon(object.points, object);
  }
})();


(function(){

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.Path) {
    console.warn('Canvas.Path is already defined');
    return;
  }
  if (!Canvas.Object) {
    console.warn('Canvas.Path requires Canvas.Object');
    return;
  }

  Canvas.Path = Class.create(Canvas.Object, Canvas.IStub, {

    type: 'path',

    /**
     * @constructor
     * @param path {Array | String} path data
     * (i.e. sequence of coordinates and corresponding "command" tokens)
     * @param options {Object} options object
     */
    initialize: function(path, options) {
      options = options || { };

      this.setOptions(options);
      this._importProperties();

      this.originalState = { };

      if (!path) {
        throw Error('`path` argument is required');
      }

      var fromArray = Object.isArray(path);
      this.path = fromArray
        ? path
        : path.match && path.match(/[a-zA-Z][^a-zA-Z]*/g);

      if (!this.path) return;

      if (!fromArray) {
        this._initializeFromArray(options);
      };

      this.setCoords();

      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },

    _initializeFromArray: function(options) {
      var isWidthSet = 'width' in options,
          isHeightSet = 'height' in options;

      this.path = this._parsePath();

      if (!isWidthSet || !isHeightSet) {
        Object.extend(this, this._parseDimensions());
        if (isWidthSet) {
          this.width = this.options.width;
        }
        if (isHeightSet) {
          this.height = this.options.height;
        }
      }
    },

    _render: function(ctx) {
      var current, // current instruction
          x = 0, // current x
          y = 0, // current y
          controlX = 0, // current control point x
          controlY = 0, // current control point y
          tempX,
          tempY,
          l = -(this.width / 2),
          t = -(this.height / 2);

      for (var i=0, len=this.path.length; i<len; ++i) {

        current = this.path[i];

        switch (current[0]) { // first letter

          case 'l': // lineto, relative
            x += current[1];
            y += current[2];
            ctx.lineTo(x + l, y + t);
            break;

          case 'L': // lineto, absolute
            x = current[1];
            y = current[2];
            ctx.lineTo(x + l, y + t);
            break;

          case 'h': // horizontal lineto, relative
            x += current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'H': // horizontal lineto, absolute
            x = current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'v': // vertical lineto, relative
            y += current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'V': // verical lineto, absolute
            y = current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'm': // moveTo, relative
            x += current[1];
            y += current[2];
            ctx.moveTo(x + l, y + t);
            break;

          case 'M': // moveTo, absolute
            x = current[1];
            y = current[2];
            ctx.moveTo(x + l, y + t);
            break;

          case 'c': // bezierCurveTo, relative
            tempX = x + current[5];
            tempY = y + current[6];
            controlX = x + current[3];
            controlY = y + current[4];
            ctx.bezierCurveTo(
              x + current[1] + l, // x1
              y + current[2] + t, // y1
              controlX + l, // x2
              controlY + t, // y2
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'C': // bezierCurveTo, absolute
            x = current[5];
            y = current[6];
            controlX = current[3];
            controlY = current[4];
            ctx.bezierCurveTo(
              current[1] + l,
              current[2] + t,
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;

          case 's': // shorthand cubic bezierCurveTo, relative
            tempX = x + current[3];
            tempY = y + current[4];
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              x + current[1] + l,
              y + current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'S': // shorthand cubic bezierCurveTo, absolute
            tempX = current[3];
            tempY = current[4];
            controlX = 2*x - controlX;
            controlY = 2*y - controlY;
            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              current[1] + l,
              current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'q': // quadraticCurveTo, relative
            x += current[3];
            y += current[4];
            ctx.quadraticCurveTo(
              current[1] + l,
              current[2] + t,
              x + l,
              y + t
            );
            break;

          case 'Q': // quadraticCurveTo, absolute
            x = current[3];
            y = current[4];
            controlX = current[1];
            controlY = current[2];
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;

          case 'T':
            tempX = x;
            tempY = y;
            x = current[1];
            y = current[2];
            controlX = -controlX + 2 * tempX;
            controlY = -controlY + 2 * tempY;
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;

          case 'a':
            break;

          case 'A':
            break;

          case 'z':
          case 'Z':
            ctx.closePath();
            break;
        }
      }
    },

    render: function(ctx, noTransform) {
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
      }
      else if (this.fill) {
        ctx.fillStyle = this.fill;
      }

      if (this.stroke) {
        ctx.strokeStyle = this.stroke;
      }
      ctx.beginPath();

      if (this.stub) {
        this.stub._render(ctx);
      }
      else {
        this._render(ctx);
      }

      if (this.fill) {
        ctx.fill();
      }
      if (this.options.stroke) {
        ctx.strokeStyle = this.options.stroke;
        ctx.lineWidth = this.options.strokeWidth;
        ctx.stroke();
      }
      if (!noTransform && this.active) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },

    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} string representation of an instance
     */
    toString: function() {
      return '#<Canvas.Path ('+ this.complexity() +'): ' +
        Object.toJSON({ top: this.top, left: this.left }) +'>';
    },

    /**
     * @method toObject
     * @return {Object}
     */
    toObject: function() {
      var o = Object.extend(this.callSuper('toObject'), {
        path: this.path,
        sourcePath: this.sourcePath
      });
      if (this.transformMatrix) {
        o.transformMatrix = this.transformMatrix;
      }
      return o;
    },

    /**
     * @method toDatalessObject
     * @return {Object}
     */
    toDatalessObject: function() {
      var o = this.toObject();
      if (this.sourcePath) {
        o.path = this.sourcePath;
      }
      delete o.sourcePath;
      return o;
    },

    complexity: function() {
      return this.path.length;
    },

    set: function(prop, value) {
      if (this.stub) {
        this.stub.set(prop, value)
      }
      return this.callSuper('set', prop, value);
    },

    _parsePath: function() {

      var result = [],
          currentPath,
          chunks;

      for (var i = 0, len = this.path.length; i < len; i++) {
        currentPath = this.path[i];
        chunks = currentPath.slice(1).strip().replace(/(\d)-/g, '$1###-').split(/\s|,|###/);
        result.push([currentPath.charAt(0)].concat(chunks.map(parseFloat)));
      }
      return result;
    },

    _parseDimensions: function() {
      var aX = [],
          aY = [],
          previousX,
          previousY,
          isLowerCase = false,
          x,
          y;
      function getX(item) {
        if (item[0] === 'H') {
          return item[1];
        }
        return item[item.length - 2];
      }
      function getY(item) {
        if (item[0] === 'V') {
          return item[1];
        }
        return item[item.length - 1];
      }
      this.path.each(function(item, i) {
        if (item[0] !== 'H') {
          previousX = (i === 0) ? getX(item) : getX(this.path[i-1]);
        }
        if (item[0] !== 'V') {
          previousY = (i === 0) ? getY(item) : getY(this.path[i-1]);
        }

        if (item[0] === item[0].toLowerCase()) {
          isLowerCase = true;
        }



        x = isLowerCase
          ? previousX + getX(item)
          : item[0] === 'V'
            ? previousX
            : getX(item);

        y = isLowerCase
          ? previousY + getY(item)
          : item[0] === 'H'
            ? previousY
            : getY(item);

        aX.push(x);
        aY.push(y);

      }, this);

      var minX = aX.min(),
          minY = aY.min(),
          deltaX = deltaY = 0;

      var o = {
        top: minY - deltaY,
        left: minX - deltaX,
        bottom: aY.max() - deltaY,
        right: aX.max() - deltaX
      }

      o.width = o.right - o.left;
      o.height = o.bottom - o.top;

      return o;
    }
  });

  /**
   * Creates an instance of Canvas.Path from an object
   * @static
   * @method Canvas.Path.fromObject
   * @return {Canvas.Path} Instance of Canvas.Path
   */
  Canvas.Path.fromObject = function(object) {
    return new Canvas.Path(object.path, object);
  };

  var ATTRIBUTE_NAMES = Canvas.Path.ATTRIBUTE_NAMES = 'd fill fill-opacity fill-rule stroke stroke-width transform'.split(' ');
  /**
   * Creates an instance of Canvas.Path from an SVG <PATH> element
   * @static
   * @method Canvas.Path.fromElement
   * @param {SVGElement} element to parse
   * @param {Object} options object
   * @return {Canvas.Path} Instance of Canvas.Path
   */
  Canvas.Path.fromElement = function(element, options) {
    var parsedAttributes = Canvas.parseAttributes(element, ATTRIBUTE_NAMES),
        path = parsedAttributes.d;
    delete parsedAttributes.d;
    return new Canvas.Path(path, Object.extend(parsedAttributes, options));
  }
})();

(function(){

  var Canvas = this.Canvas || (this.Canvas = { });
  if (Canvas.PathGroup) {
    console.warn('Canvas.PathGroup is already defined');
    return;
  }

  Canvas.PathGroup = Class.create(Canvas.Path, Canvas.IStub, Enumerable, {

    type: 'path-group',
    forceFillOverwrite: false,

    initialize: function(paths, options) {

      options = options || { };

      this.originalState = { };
      this.paths = paths;

      this.setOptions(options);
      this.initProperties();

      this.setCoords();

      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },

    initProperties: function() {
      this.stateProperties.each(function(prop) {
        if (prop === 'fill') {
          this.set(prop, this.options[prop]);
        }
        else if (prop === 'angle') {
          this.setAngle(this.options[prop]);
        }
        else {
          this[prop] = this.options[prop];
        }
      }, this);
    },

    render: function(ctx) {
      if (this.stub) {
        ctx.save();

        this.transform(ctx);
        this.stub.render(ctx, false /* no transform */);
        if (this.active) {
          this.drawBorders(ctx);
          this.drawCorners(ctx);
        }
        ctx.restore();
      }
      else {
        ctx.save();

        var m = this.transformMatrix;
        if (m) {
          ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }

        this.transform(ctx);
        for (var i = 0, l = this.paths.length; i < l; ++i) {
          this.paths[i].render(ctx, true);
        }
        if (this.active) {
          this.drawBorders(ctx);
          this.hideCorners || this.drawCorners(ctx);
        }
        ctx.restore();
      }
    },

    /**
     * @method set
     * @param {String} prop
     * @param {Any} value
     * @return {Canvas.PathGroup} thisArg
     */
    set: function(prop, value) {
      if ((prop === 'fill' || prop === 'overlayFill') && this.isSameColor()) {
        this[prop] = value;
        var i = this.paths.length;
        while (i--) {
          this.paths[i].set(prop, value);
        }
      }
      else {
        Canvas.Object.prototype.set.call(this, prop, value);
      }
      return this;
    },

    /**
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      var _super = Canvas.Object.prototype.toObject;
      return Object.extend(_super.call(this), {
        paths: this.getObjects().invoke('clone'),
        sourcePath: this.sourcePath
      });
    },

    /**
     * @method toDatalessObject
     * @return {Object} dataless object representation of an instance
     */
    toDatalessObject: function() {
      var o = this.toObject();
      if (this.sourcePath) {
        o.paths = this.sourcePath;
      }
      return o;
    },

     /**
      * Returns a string representation of an object
      * @method toString
      * @return {String} string representation of an object
      */
    toString: function() {
      return '#<Canvas.PathGroup (' + this.complexity() +
        '): { top: ' + this.top + ', left: ' + this.left + ' }>';
    },

    /**
     * @method isSameColor
     * @return {Boolean} true if all paths are of the same color (`fill`)
     */
    isSameColor: function() {
      var firstPathFill = this.getObjects()[0].get('fill');
      return this.all(function(path) {
        return path.get('fill') === firstPathFill;
      });
    },

    /**
      * Returns number representation of object's complexity
      * @method complexity
      * @return {Number} complexity
      */
    complexity: function() {
      return this.paths.inject(0, function(total, path) {
        return total + ((path && path.complexity) ? path.complexity() : 0);
      });
    },

    /**
      * Makes path group grayscale
      * @method toGrayscale
      * @return {Canvas.PathGroup} thisArg
      */
    toGrayscale: function() {
      var i = this.paths.length;
      while (i--) {
        this.paths[i].toGrayscale();
      }
      return this;
    },

    /**
     * @method getObjects
     * @return {Array} array of path objects included in this path group
     */
    getObjects: function() {
      return this.paths;
    },

    _each: function(iterator) {
      return this.getObjects()._each(iterator);
    }
  });

  /**
   * @private
   * @method instantiatePaths
   */
  function instantiatePaths(paths) {
    for (var i = 0, len = paths.length; i < len; i++) {
      if (!(paths[i] instanceof Canvas.Object)) {
        var klassName = paths[i].type.camelize().capitalize();
        paths[i] = Canvas[klassName].fromObject(paths[i]);
      }
    }
    return paths;
  }

  /**
   * @static
   * @method Canvas.PathGroup.fromObject
   * @param {Object}
   * @return {Canvas.PathGroup}
   */
  Canvas.PathGroup.fromObject = function(object) {
    var paths = instantiatePaths(object.paths);
    return new Canvas.PathGroup(paths, object);
  }
})();


(function(){

  var Canvas = this.Canvas || (this.Canvas = { });
  if (Canvas.Group) {
    return;
  }

  Canvas.Group = Class.create(Canvas.Object, {

    /**
     * @property type
     */
    type: 'group',

    /**
     * @constructor
     * @param {Object} objects Group objects
     * @return {Object} thisArg
     */
    initialize: function(objects, options) {
      this.objects = objects || [];
      this.originalState = { };

      this.callSuper('initialize');

      this._calcBounds();
      this._updateObjectsCoords();

      if (options) {
        Object.extend(this, options);
      }
      this._setOpacityIfSame();

      this.setCoords(true);
      this.saveCoords();

      this.activateAllObjects();
    },

    /**
     * @private
     * @method _updateObjectsCoords
     */
    _updateObjectsCoords: function() {
      var groupDeltaX = this.left,
          groupDeltaY = this.top;

      this.forEachObject(function(object) {

        var objectLeft = object.get('left'),
            objectTop = object.get('top');

        object.set('originalLeft', objectLeft);
        object.set('originalTop', objectTop);

        object.set('left', objectLeft - groupDeltaX);
        object.set('top', objectTop - groupDeltaY);

        object.setCoords();

        object.hideCorners = true;
      }, this);
    },

    /**
     * @method toString
     * @return {String}
     */
    toString: function() {
      return '#<Canvas.Group: (' + this.complexity() + ')>';
    },

    /**
     * @method getObjects
     * @return {Array} group objects
     */
    getObjects: function() {
      return this.objects;
    },

    /**
     * Adds an object to a group. Recalculates group's dimension, position.
     * @method add
     * @param {Object} object
     * @return {Object} thisArg
     * @chainable
     */
    add: function(object) {
      this._restoreObjectsState();
      this.objects.push(object);
      object.setActive(true);
      this._calcBounds();
      this._updateObjectsCoords();
      return this;
    },

    /**
     * Removes an object from a group. Recalculates group's dimension, position.
     * @param {Object} object
     * @return {Object} thisArg
     * @chainable
     */
    remove: function(object) {
      this._restoreObjectsState();
      Canvas.util.removeFromArray(this.objects, object);
      object.setActive(false);
      this._calcBounds();
      this._updateObjectsCoords();
      return this;
    },

    /**
     * Returns a size of a group (i.e. length of an array containing its objects)
     * @return {Number} Group size
     */
    size: function() {
      return this.getObjects().length;
    },

    /**
     * Sets property to a given value
     * @method set
     * @param {String} name
     * @param {Object | Function} value
     * @return {Object} thisArg
     * @chainable
     */
    set: function(name, value) {
      if (typeof value == 'function') {
        this.set(name, value(this[name]));
      }
      else {
        if (name === 'fill' || name === 'opacity') {
          var i = this.objects.length;
          this[name] = value;
          while (i--) {
            this.objects[i].set(name, value);
          }
        }
        else {
          this[name] = value;
        }
      }
      return this;
    },

    /**
     * Returns true if a group contains an object
     * @method contains
     * @param {Object} object Object to check against
     * @return {Boolean} true if group contains an object
     */
    contains: function(object) {
      return this.objects.include(object);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        objects: this.objects.invoke('clone')
      });
    },

    /**
     * Renders instance on a given context
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render instance on
     */
    render: function(ctx) {
      ctx.save();
      this.transform(ctx);

      var groupScaleFactor = Math.max(this.scaleX, this.scaleY);

      for (var i = 0, len = this.objects.length; i < len; i++) {
        var originalScaleFactor = this.objects[i].borderScaleFactor;
        this.objects[i].borderScaleFactor = groupScaleFactor;
        this.objects[i].render(ctx);
        this.objects[i].borderScaleFactor = originalScaleFactor;
      }
      this.hideBorders || this.drawBorders(ctx);
      this.hideCorners || this.drawCorners(ctx);
      ctx.restore();
      this.setCoords();
    },

    /**
     * @method item
     * @param index {Number} index of item to get
     * @return {Canvas.Object}
     */
    item: function(index) {
      return this.getObjects()[index];
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.getObjects().inject(0, function(total, object) {
        total += (typeof object.complexity == 'function') ? object.complexity() : 0;
        return total;
      });
    },

    /**
     * Retores original state of each of group objects
     * @private
     * @method _restoreObjectsState
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    _restoreObjectsState: function() {
      this.objects.each(this._restoreObjectState, this);
      return this;
    },

    /**
     * @private
     * @method _restoreObjectState
     * @param {Canvas.Object} object
     */
    _restoreObjectState: function(object) {

      var groupLeft = this.get('left'),
          groupTop = this.get('top'),
          groupAngle = this.getAngle() * (Math.PI / 180),
          objectLeft = object.get('originalLeft'),
          objectTop = object.get('originalTop'),
          rotatedTop = Math.cos(groupAngle) * object.get('top') + Math.sin(groupAngle) * object.get('left'),
          rotatedLeft = -Math.sin(groupAngle) * object.get('top') + Math.cos(groupAngle) * object.get('left');

      object.setAngle(object.getAngle() + this.getAngle());

      object.set('left', groupLeft + rotatedLeft * this.get('scaleX'));
      object.set('top', groupTop + rotatedTop * this.get('scaleY'));

      object.set('scaleX', object.get('scaleX') * this.get('scaleX'));
      object.set('scaleY', object.get('scaleY') * this.get('scaleY'));

      object.setCoords();
      object.hideCorners = false;
      object.setActive(false);
      object.setCoords();

      return this;
    },

    /**
     * @method destroy
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    destroy: function() {
      return this._restoreObjectsState();
    },

    /**
     * @saveCoords
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    saveCoords: function() {
      this._originalLeft = this.get('left');
      this._originalTop = this.get('top');
      return this;
    },

    hasMoved: function() {
      return this._originalLeft !== this.get('left') ||
             this._originalTop !== this.get('top');
    },

    /**
     * Sets coordinates of all group objects
     * @method setObjectsCoords
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    setObjectsCoords: function() {
      this.forEachObject(function(object) {
        object.setCoords();
      });
      return this;
    },

    /**
     * Activates (makes active) all group objects
     * @method activateAllObjects
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    activateAllObjects: function() {
      return this.setActive(true);
    },

    /**
     * @method setActive
     * @param {Boolean} value `true` to activate object, `false` otherwise
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    setActive: function(value) {
      this.forEachObject(function(object) {
        object.setActive(value);
      });
      return this;
    },

    /**
     * @method forEachObject
     * @param {Function} callback
     *                   Callback invoked with current object as first argument,
     *                   index - as second and an array of all objects - as third.
     *                   Iteration happens in reverse order (for performance reasons).
     *                   Callback is invoked in a context of Global Object (e.g. `window`)
     *                   when no `context` argument is given
     *
     * @param {Object} context a.k.a. thisObject
     *
     * @return {Canvas.Group}
     * @chainable
     */
    forEachObject: function(callback, context) {
      var objects = this.getObjects(),
          i = objects.length;
      while (i--) {
        callback.call(context, objects[i], i, objects);
      }
      return this;
    },

    /**
     * @private
     * @method _setOpacityIfSame
     */
    _setOpacityIfSame: function() {
      var objects = this.getObjects(),
          firstValue = objects[0] ? objects[0].get('opacity') : 1;

      var isSameOpacity = objects.all(function(o) {
        return o.get('opacity') === firstValue;
      });

      if (isSameOpacity) {
        this.opacity = firstValue;
      }
    },

    /**
     * @private
     * @method _calcBounds
     */
    _calcBounds: function() {
      var aX = [],
          aY = [],
          minX, minY, maxX, maxY, o, width, height,
          i = 0,
          len = this.objects.length;

      for (; i < len; ++i) {
        o = this.objects[i];
        o.setCoords();
        for (var prop in o.oCoords) {
          aX.push(o.oCoords[prop].x);
          aY.push(o.oCoords[prop].y);
        }
      };

      minX = aX.min();
      maxX = aX.max();
      minY = aY.min();
      maxY = aY.max();

      width = maxX - minX;
      height = maxY - minY;

      this.width = width;
      this.height = height;

      this.left = minX + width / 2;
      this.top = minY + height / 2;
    },

    /**
     * @method containsPoint
     * @param {Object} point point with `x` and `y` properties
     * @return {Boolean} true if point is contained within group
     */
    containsPoint: function(point) {

      var halfWidth = this.get('width') / 2,
          halfHeight = this.get('height') / 2,
          centerX = this.get('left'),
          centerY = this.get('top');

      return  centerX - halfWidth < point.x &&
              centerX + halfWidth > point.x &&
              centerY - halfHeight < point.y &&
              centerY + halfHeight > point.y;
    },

    toGrayscale: function() {
      var i = this.objects.length;
      while (i--) {
        this.objects[i].toGrayscale();
      }
    }
  });

  /**
   * @static
   * @method Canvas.Group.fromObject
   * @param object {Object} object to create a group from
   * @param options {Object} options object
   * @return {Canvas.Group} an instance of Canvas.Group
   */
  Canvas.Group.fromObject = function(object) {
    return new Canvas.Group(object.objects, object);
  }
})();


(function(){

  var Canvas = this.Canvas || (this.Canvas = { });

  if (Canvas.Text) {
    console.warn('Canvas.Text is already defined');
    return;
  }
  if (!Canvas.Object) {
    console.warn('Canvas.Text requires Canvas.Object');
    return;
  }

  Canvas.Text = Class.create(Canvas.Object, {

    options: {
      top:         10,
      left:        10,
      fontsize:    20,
      fontweight:  100,
      fontfamily:  'Modernist_One_400',
      path:        null
    },

    type: 'text',

    initialize: function(text, options) {
      this.originalState = { };
      this.initStateProperties();
      this.text = text;
      this.setOptions(options);
      Object.extend(this, this.options);
      this.theta = this.angle * (Math.PI/180);
      this.width = this.getWidth();
      this.setCoords();
    },

    initStateProperties: function() {
      var o;
      if ((o = this.constructor) &&
          (o = o.superclass) &&
          (o = o.prototype) &&
          (o = o.stateProperties) &&
          o.clone) {
        this.stateProperties = o.clone();
        this.stateProperties.push('fontfamily', 'fontweight', 'path');
      }
    },

    toString: function() {
      return '#<Canvas.Text ('+ this.complexity() +'): ' +
        Object.toJSON({ text: this.text, fontfamily: this.fontfamily }) +'>';
    },

    _render: function(context) {
      var o = Cufon.textOptions || (Cufon.textOptions = { });

      o.left = this.left;
      o.top = this.top;
      o.context = context;
      o.color = this.fill;

      var el = this._initDummyElement();

      this.transform(context);

      Cufon.replaceElement(el, {
        separate: 'none',
        fontFamily: this.fontfamily
      });

      this.width = o.width;
      this.height = o.height;
    },

    _initDummyElement: function() {
      var el = document.createElement('div');
      el.innerHTML = this.text;

      el.style.fontSize = '40px';
      el.style.fontWeight = '400';
      el.style.fontStyle = 'normal';
      el.style.letterSpacing = 'normal';
      el.style.color = '#000000';
      el.style.fontWeight = '600';
      el.style.fontFamily = 'Verdana';

      return el;
    },

    render: function(context) {
      context.save();
      this._render(context);
      if (this.active) {
        this.drawBorders(context);
        this.drawCorners(context);
      }
      context.restore();
    },

  	/**
  	 * @method toObject
  	 * @return {Object} object representation of an instance
  	 */
  	toObject: function() {
  	  return Object.extend(this.callSuper('toObject'), {
  	    text:         this.text,
  	    fontsize:     this.fontsize,
  	    fontweight:   this.fontweight,
  	    fontfamily:   this.fontfamily,
  	    path:         this.path
  	  });
  	},

  	/**
  	 * @method setColor
  	 * @param {String} value
  	 * @return {Canvas.Text} thisArg
  	 * @chainable
  	 */
  	setColor: function(value) {
  	  this.set('fill', value);
  	  return this;
  	},

  	/**
  	 * @method setFontsize
  	 * @param {Number} value
  	 * @return {Canvas.Text} thisArg
  	 * @chainable
  	 */
  	setFontsize: function(value) {
  	  this.set('fontsize', value);
  	  this.setCoords();
  	  return this;
  	},

  	/**
  	 * @method getText
  	 * @return {String}
  	 */
  	getText: function() {
  	  return this.text;
  	},

  	/**
  	 * @method setText
  	 * @param {String} value
  	 * @return {Canvas.Text} thisArg
  	 */
  	setText: function(value) {
  	  this.set('text', value);
  	  this.setCoords();
  	  return this;
  	},

  	set: function(name, value) {
  	  this[name] = value;
  	  if (name === 'fontfamily') {
  	    this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
  	  }
  	  return this;
  	}
  });

	/**
   * @static
   * @method fromObject
   * @param {Object} object to create an instance from
   * @return {Canvas.Text} an instance
   */
	Canvas.Text.fromObject = function(object) {
	  return new Canvas.Text(object.text, Object.clone(object));
	};

	/**
   * @static
   * @method Canvas.Text.fromElement
   * @return {Canvas.Text} an instance
   */
	Canvas.Text.fromElement = function(element) {
	};
})();
