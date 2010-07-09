(function(){
  
  var fabric = this.fabric || (this.fabric = { });
  
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

    // if there's a parent container (`g` node), parse its attributes recursively upwards
    if (element.parentNode && /^g$/i.test(element.parentNode.nodeName)) {
      parentAttributes = fabric.parseAttributes(element.parentNode, attributes);
    }
    
    var ownAttributes = attributes.reduce(function(memo, attr) {
      value = element.getAttribute(attr);
      parsed = parseFloat(value);
      if (value) {        
        // "normalize" attribute values
        if ((attr === 'fill' || attr === 'stroke') && value === 'none') {
          value = '';
        }
        if (attr === 'fill-rule') {
          value = (value === 'evenodd') ? 'destination-over' : value;
        }
        if (attr === 'transform') {
          value = fabric.parseTransformAttribute(value);
        }
        // transform attribute names
        if (attr in attributesMap) {
          attr = attributesMap[attr];
        }
        memo[attr] = isNaN(parsed) ? value : parsed;
      }
      return memo;
    }, { });
    
    // add values parsed from style
    // TODO (kangax): check the presedence of values from the style attribute
    ownAttributes = fabric.base.object.extend(fabric.parseStyleAttribute(element), ownAttributes);
    return fabric.base.object.extend(parentAttributes, ownAttributes);
  };
  
  /**
   * @static
   * @method fabric.parseTransformAttribute
   * @param attributeValue {String} string containing attribute value
   * @return {Array} array of 6 elements representing transformation matrix
   */
  fabric.parseTransformAttribute = (function() {
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
    
    // identity matrix
    var iMatrix = [
          1, // a
          0, // b
          0, // c
          1, // d
          0, // e
          0  // f
        ],
    
        // == begin transform regexp
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
    
        // http://www.w3.org/TR/SVG/coords.html#TransformAttribute
        reTransformList = new RegExp(transform_list),
        // == end transform regexp
        
        reTransform = new RegExp(transform);
    
    return function(attributeValue) {
      
      // start with identity matrix
      var matrix = iMatrix.concat();
      
      // return if no argument was given or 
      // an argument does not match transform attribute regexp
      if (!attributeValue || (attributeValue && !reTransformList.test(attributeValue))) {
        return matrix;
      }
      
      attributeValue.replace(reTransform, function(match) {
          
        var m = new RegExp(transform).exec(match).filter(function (match) {
              return (match !== '' && match != null);
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
   * @method fabric.parsePointsAttribute
   * @param points {String} points attribute string
   * @return {Array} array of points
   */
  function parsePointsAttribute(points) {
    // points attribute is required and must not be empty
    if (!points) return null;
    points = points.trim().split(/\s+/);
    var parsedPoints = points.reduce(function(memo, pair) {
      pair = pair.split(',');
      memo.push({ x: parseFloat(pair[0]), y: parseFloat(pair[1]) });
      return memo;
    }, [ ]);
    // odd number of points is an error
    if (parsedPoints.length % 2 !== 0) {
      // return null;
    }
    return parsedPoints;
  };

  /**
   * @static
   * @method fabric.parseStyleAttribute
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
        oStyle = style.reduce(function(memo, current) {
          var attr = current.split(':'),
              key = attr[0].trim(),
              value = attr[1].trim();
          memo[key] = value;
          return memo;
        }, { });
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
   * @method fabric.parseElements
   * @param elements {Array} array of elements to parse
   * @param options {Object} options object
   * @return {Array} array of corresponding instances (transformed from SVG elements)
   */
   function parseElements(elements, options) {
    // transform svg elements to fabric.Path elements
    var _elements = elements.map(function(el) {
      var klass = fabric[fabric.base.string.capitalize(el.tagName)];
      if (klass && klass.fromElement) {
        try {
          return klass.fromElement(el, options);
        }
        catch(e) {
          console.log(e.message || e);
        }
      }
    });
    _elements = _elements.filter(function(el) {
      return el != null;
    });
    return _elements;
  };
  
  /**
   * @static
   * @method fabric.parseSVGDocument
   * @param doc {SVGDocument} SVG document to parse
   * @param callback {Function} callback to call when parsing is finished. 
   * Callback is being passed array of elements (parsed from a document)
   */
  fabric.parseSVGDocument = (function(){

    var reAllowedSVGTagNames = /^(path|circle|polygon|polyline|ellipse|rect|line)$/;

    // http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
    // \d doesn't quite cut it (as we need to match an actual float number)

    // matches, e.g.: +14.56e-12, etc.
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
      var descendants = fabric.base.toArray(doc.getElementsByTagName('*'));
      
      var elements = descendants.filter(function(el) {
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

      // values of width/height attributes overwrite those extracted from viewbox attribute
      width = widthAttr ? parseFloat(widthAttr) : width;
      height = heightAttr ? parseFloat(heightAttr) : height;

      var options = { 
        width: width, 
        height: height
      };

      var elements = fabric.parseElements(elements, fabric.base.object.clone(options));
      if (!elements || (elements && !elements.length)) return;

      if (callback) {
        callback(elements, options);
      }
    };
  })();
  
  fabric.base.object.extend(fabric, {
    parseAttributes:        parseAttributes,
    parseElements:          parseElements,
    parseStyleAttribute:    parseStyleAttribute,
    parsePointsAttribute:   parsePointsAttribute
  });
  
})();