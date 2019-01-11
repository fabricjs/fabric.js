(function(){

  function makeElement() {
    var element = fabric.document.createElement('path');
    var attributes = {
      'cx':           101,
      'x':            102,
      'cy':           103,
      'y':            104,
      'r':            105,
      'opacity':      0.45,
      'fill-rule':    'foo',
      'stroke-width': 4
    };
    for (var prop in attributes) {
      element.setAttribute(prop, attributes[prop]);
    }
    return element;
  }

  // var EXPECTED_PATH_JSON = "{\"type\":\"path\",\"left\":0,\"top\":0,\"width\":93,\"height\":137,\"fill\":\"#99CCFF\",\"stroke\":null,\"strokeWidth\":1,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"selectable\":true,\"hasControls\":true,\"hasBorders\":true,\"hasRotatingPoint\":false,\"path\":[[\"M\",62.022,30.848],[\"c\",4.251,0.038,9.565,-2.206,13.424,-3.924],[\"c\",3.131,-1.396,4.47,-1.299,7.833,0.263],[\"c\",2.18,1.012,3.883,-1.551,5.824,-2.048],[\"c\",0.243,-0.062,0.537,0.464,0.374,0.652],[\"c\",-0.553,0.639,-2.932,1.753,-2.679,2.821],[\"c\",0.184,0.779,4.081,0.817,5.226,1.347],[\"c\",1.008,0.653,-3.22,0.665,-3.17,1.028],[\"c\",1.038,0.191,2.175,0.279,3.03,0.703],[\"c\",0.482,0.238,-0.707,0.815,-1.245,0.731],[\"c\",0.194,0.103,0.711,0.257,0.583,0.436],[\"c\",-0.144,0.891,-3.265,0.128,-4.132,-0.003],[\"c\",-0.688,-0.104,-3.754,-0.843,-3.892,0.039],[\"c\",-0.092,0.586,0.47,1.079,0.133,2.617],[\"c\",-0.314,1.438,-1.942,1.633,-1.831,1.024],[\"c\",0.273,-1.496,1.201,-1.914,-0.4,-3.564],[\"c\",-0.979,-1.01,-1.908,-2.344,-2.138,-3.425],[\"c\",-7.581,1.092,-9.456,6.321,-17.365,7.858],[\"c\",-2.787,0.541,-5.233,-1.016,-7.887,-2.27],[\"c\",0.168,0.259,0.457,0.272,0.169,1.184],[\"c\",-0.29,0.918,-0.479,2.081,-0.225,3.104],[\"c\",0.539,2.169,1.73,4.464,2.5,6.755],[\"c\",1.481,4.415,0.996,11.273,0.42,15.21],[\"c\",-0.105,0.715,0.497,1.432,0.129,2.608],[\"c\",-0.128,0.413,0.384,1.027,0.347,1.458],[\"c\",-0.195,2.236,1.106,2.01,3.446,4.502],[\"c\",-0.21,0.252,-0.926,0.504,-1.136,0.756],[\"c\",4.353,5.205,8.404,10.612,11.622,16.651],[\"c\",0.805,1.512,1.511,3.199,1.511,4.913],[\"c\",0,1.955,-1.154,2.843,-2.057,4.577],[\"c\",-0.741,1.423,-2.081,2.305,-3.121,3.526],[\"c\",-5.631,6.614,-9.57,11.287,-15.186,17.936],[\"c\",-0.976,3.091,1.141,4.783,1.093,6.394],[\"c\",-0.011,0.372,-0.267,0.74,-0.555,1.119],[\"c\",-0.452,0.595,-2.752,-1.225,-4.01,-2.617],[\"c\",-1.657,8.48,5.22,10.332,8.284,12.274],[\"c\",0.37,0.234,0.076,1.004,-0.05,1.424],[\"c\",-4.442,0.217,-7.603,0.246,-11.857,-1.172],[\"c\",-0.783,-0.963,-2.958,-5.188,-4.535,-3.406],[\"c\",-0.735,0.831,-1.092,1.932,-1.637,2.897],[\"c\",-0.462,0,-0.76,-0.247,-1.222,-0.247],[\"c\",-0.042,-1.553,0.19,-2.878,-0.044,-4.413],[\"c\",-0.633,-4.152,-1.551,-4.467,2.037,-7.866],[\"c\",1.782,-1.689,2.374,-2.065,4.045,-3.916],[\"c\",-0.552,-1.562,0.385,-2.303,-1.192,-3],[\"c\",-0.936,-0.041,-3.255,1.205,-3.535,2.152],[\"c\",-0.378,-0.042,-1.001,-0.701,-1.379,-0.742],[\"c\",0.896,-1.794,1.155,-1.791,0.926,-2.913],[\"c\",-0.796,-3.892,1.304,-4.478,3.593,-5.779],[\"c\",3.523,-3.523,6.666,-10.464,10.145,-14.605],[\"c\",1.05,-1.25,2.885,-2.043,4.019,-3.219],[\"c\",-1.26,-1.175,-2.805,-2.106,-3.779,-3.526],[\"c\",-2.437,-3.554,-6.445,-7.633,-9.421,-8.945],[\"c\",-0.756,0.168,-1.513,0.336,-2.269,0.504],[\"c\",-3.89,-2.843,-8.766,-8.817,-6.814,-16.892],[\"c\",1.413,-5.846,8.545,-7.913,2.791,-13.009],[\"c\",-1.299,-1.15,-7.22,-6.915,-8.904,-6.021],[\"c\",-1.257,0.667,-3.774,2.431,-3.966,4.015],[\"c\",-0.299,2.472,-4.275,17.925,-7.829,14.167],[\"C\",9.169,53.682,7.55,47.517,6.059,43.276],[\"c\",-0.873,-2.481,-4.009,-2.109,-5.077,-5],[\"c\",-0.368,-0.997,-1.229,-2.067,-0.914,-3.082],[\"c\",0.169,-0.545,0.63,-0.336,1.175,-0.504],[\"c\",0.535,-2.002,0.199,-1.216,1.704,-1.318],[\"c\",0,-1.215,0.604,-0.978,1.498,-0.978],[\"c\",0.987,-1.624,1.841,-0.106,4.696,1.74],[\"c\",1.461,0.945,1.292,2.708,0.987,4.319],[\"c\",-0.281,1.483,-0.582,2.403,-0.018,3.626],[\"c\",1.14,2.472,4.709,6.794,6.412,9.063],[\"c\",2.12,-2.974,1.531,-6.198,1.788,-10.647],[\"c\",0.1,-1.729,0.84,-3.361,1.26,-5.041],[\"c\",-1.504,-0.111,-2.596,-0.532,-3.277,-1.261],[\"c\",0.336,-0.588,0.672,-1.177,1.008,-1.765],[\"c\",-1.64,-1.64,-1.834,-2.188,-2.325,-4.48],[\"c\",3.162,0,2.708,-1.862,4.342,-4.09],[\"c\",-0.84,-0.504,-1.681,-1.008,-2.521,-1.512],[\"c\",3.833,-2.869,3.828,-2.76,2.539,-8.066],[\"c\",-0.877,-3.608,-0.278,-6.225,2.058,-9.733],[\"C\",25.57,-1.726,27.022,0.327,31.783,0.3],[\"c\",3.464,-0.021,6.667,0.022,8.97,5.944],[\"c\",-0.462,-0.248,-1.416,-0.428,-1.878,-0.126],[\"c\",0.126,0.588,0.825,2.984,0.5,3.49],[\"c\",-0.673,1.049,-0.867,0.977,-0.087,2.224],[\"c\",0.345,0.552,-0.111,2.569,-0.915,4.108],[\"c\",-0.366,0.807,-0.308,2.539,-1.714,2.186],[\"c\",-0.534,0.42,-0.248,1.744,0.203,2.164],[\"c\",2.527,0,5.04,-0.988,7.921,-0.666],[\"C\",47.872,19.969,54.917,30.783,62.022,30.848],[\"L\",62.022,30.848],[\"z\"]]}";

  QUnit.module('fabric.Parser');

  QUnit.test('parseAttributes', function(assert) {
    assert.ok(fabric.parseAttributes);

    var element = makeElement();
    var attributeNames = 'cx cy x y r opacity fill-rule stroke-width transform fill fill-rule'.split(' ');
    var parsedAttributes = fabric.parseAttributes(element, attributeNames);

    assert.deepEqual(parsedAttributes, {
      left:         102,
      top:          104,
      radius:       105,
      opacity:      0.45,
      fillRule:     'foo',
      strokeWidth:  4
    });
  });

  QUnit.test('parseAttributesNoneValues', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('fill', 'none');
    element.setAttribute('stroke', 'none');

    assert.deepEqual(fabric.parseAttributes(element, 'fill stroke'.split(' ')), { fill: '', stroke: '' });
  });

  QUnit.test('parseAttributesFillRule', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('fill-rule', 'evenodd');

    assert.deepEqual(fabric.parseAttributes(element, ['fill-rule']), { fillRule: 'evenodd' });
  });

  QUnit.test('parseAttributesFillRuleWithoutTransformation', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('fill-rule', 'inherit');

    assert.deepEqual(fabric.parseAttributes(element, ['fill-rule']), { fillRule: 'inherit' });
  });

  QUnit.test('parseAttributesTransform', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('transform', 'translate(5, 10)');
    assert.deepEqual(fabric.parseAttributes(element, ['transform']), { transformMatrix: [1, 0, 0, 1, 5, 10] });
  });

  QUnit.test('parseAttributesWithParent', function(assert) {
    var element = fabric.document.createElement('path');
    var parent = fabric.document.createElement('g');
    var grandParent = fabric.document.createElement('g');

    parent.appendChild(element);
    grandParent.appendChild(parent);

    element.setAttribute('x', '100');
    parent.setAttribute('y', '200');
    grandParent.setAttribute('fill', 'red');

    assert.deepEqual(fabric.parseAttributes(element, 'x y fill'.split(' ')),
      { fill: 'red', left: 100, top: 200 });
  });

  QUnit.test('parseAttributesWithGrandParentSvg', function(assert) {
    var element = fabric.document.createElement('path'),
        parent = fabric.document.createElement('g'),
        grandParent = fabric.document.createElement('svg');

    parent.appendChild(element);
    grandParent.appendChild(parent);

    element.setAttribute('x', '100');
    parent.setAttribute('y', '200');
    grandParent.setAttribute('width', '600');
    grandParent.setAttribute('height', '600');

    assert.deepEqual(fabric.parseAttributes(element, 'x y width height'.split(' ')),
      { left: 100, top: 200, width: 600, height: 600 });
  });

  QUnit.test('parseElements', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.parseElements === 'function');

    function getOptions(options) {
      return fabric.util.object.extend(fabric.util.object.clone({
        left: 10, top: 20, width: 30, height: 40
      }), options || { });
    }

    var elements = [
      fabric.util.makeElement('rect', getOptions()),
      fabric.util.makeElement('circle', getOptions({ r: 14 })),
      fabric.util.makeElement('path', getOptions({ d: 'M 100 100 L 300 100 L 200 300 z' })),
      fabric.util.makeElement('inexistent', getOptions())
    ];
    fabric.parseElements(elements, function(parsedElements) {
      assert.ok(parsedElements[0] instanceof fabric.Rect);
      assert.ok(parsedElements[1] instanceof fabric.Circle);
      assert.ok(parsedElements[2] instanceof fabric.Path);
      setTimeout(done, 1000);
    });

  });

  QUnit.test('parseStyleAttribute', function(assert) {
    assert.ok(fabric.parseStyleAttribute);

    var element = fabric.document.createElement('path');
    element.setAttribute('style', 'left:10px;top:22.3em;width:103.45pt;height:20%;');
    var styleObj = fabric.parseStyleAttribute(element);
    // TODO: looks like this still fails with % values
    var expectedObject = {
      left:   '10px',
      top:    '22.3em',
      width:  '103.45pt',
      height: '20%'
    };
    assert.deepEqual(styleObj, expectedObject);
  });

  QUnit.test('parseStyleAttribute with one pair', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('style', 'left:10px');

    var expectedObject = {
      left: '10px'
    };
    assert.deepEqual(fabric.parseStyleAttribute(element), expectedObject);
  });

  QUnit.test('parseStyleAttribute with trailing spaces', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('style', 'left:10px;  top:5px;  ');

    var expectedObject = {
      left: '10px',
      top: '5px'
    };
    assert.deepEqual(fabric.parseStyleAttribute(element), expectedObject);
  });

  QUnit.test('parseStyleAttribute with value normalization', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('style', 'fill:none;  stroke-dasharray: 2 0.4;');

    var expectedObject = {
      fill: 'none',
      'stroke-dasharray': '2 0.4'
    };
    assert.deepEqual(fabric.parseStyleAttribute(element), expectedObject);
  });

  QUnit.test('parseStyleAttribute with short font declaration', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('style', 'font: italic 12px Arial,Helvetica,sans-serif');
    var styleObj = fabric.parseStyleAttribute(element);
    if (styleObj.font) {
      fabric.parseFontDeclaration(styleObj.font, styleObj);
    }
    var expectedObject = {
      'font': 'italic 12px Arial,Helvetica,sans-serif',
      'fontSize': 12,
      'fontStyle': 'italic',
      'fontFamily': 'Arial,Helvetica,sans-serif'
    };

    assert.deepEqual(styleObj, expectedObject);

    //testing different unit
    element.setAttribute('style', 'font: italic 1.5em Arial,Helvetica,sans-serif');
    styleObj = fabric.parseStyleAttribute(element);
    if (styleObj.font) {
      fabric.parseFontDeclaration(styleObj.font, styleObj);
    }
    expectedObject = {
      'font': 'italic 1.5em Arial,Helvetica,sans-serif',
      'fontSize': 24,
      'fontStyle': 'italic',
      'fontFamily': 'Arial,Helvetica,sans-serif'
    };

    assert.deepEqual(styleObj, expectedObject);
  });

  QUnit.test('parseAttributes (style to have higher priority than attribute)', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('style', 'fill:red');
    element.setAttribute('fill', 'green');

    var expectedObject = {
      'fill': 'red'
    };
    assert.deepEqual(fabric.parseAttributes(element, fabric.Path.ATTRIBUTE_NAMES), expectedObject);
  });

  QUnit.test('parseAttributes stroke-opacity and fill-opacity', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('style', 'fill:rgb(100,200,50);fill-opacity:0.2;');
    element.setAttribute('stroke', 'green');
    element.setAttribute('stroke-opacity', '0.5');
    element.setAttribute('fill', 'green');

    var expectedObject = {
      'fill': 'rgba(100,200,50,0.2)',
      'stroke': 'rgba(0,128,0,0.5)',
      'fillOpacity': 0.2,
      'strokeOpacity': 0.5
    };
    assert.deepEqual(fabric.parseAttributes(element, fabric.Path.ATTRIBUTE_NAMES), expectedObject);
  });

  QUnit.test('parse 0 attribute', function(assert) {
    var element = fabric.document.createElement('path');
    element.setAttribute('opacity', 0);

    var expectedObject = {
      opacity: 0,
    };
    assert.deepEqual(fabric.parseAttributes(element, fabric.Path.ATTRIBUTE_NAMES), expectedObject);
  });

  QUnit.test('parsePointsAttribute', function(assert) {
    assert.ok(fabric.parsePointsAttribute);

    var element = fabric.document.createElement('polygon');
    element.setAttribute('points', '10,  12           20 ,22,  -0.52,0.001 2.3e2,2.3e-2, 10,-1     ');

    var actualPoints = fabric.parsePointsAttribute(element.getAttribute('points'));

    assert.equal(actualPoints[0].x, 10);
    assert.equal(actualPoints[0].y, 12);

    assert.equal(actualPoints[1].x, 20);
    assert.equal(actualPoints[1].y, 22);

    assert.equal(actualPoints[2].x, -0.52);
    assert.equal(actualPoints[2].y, 0.001);

    assert.equal(actualPoints[3].x, 2.3e2);
    assert.equal(actualPoints[3].y, 2.3e-2);

    assert.equal(actualPoints[4].x, 10);
    assert.equal(actualPoints[4].y, -1);
  });

  QUnit.test('parseTransformAttribute', function(assert) {
    var parsedValue;

    assert.ok(fabric.parseTransformAttribute);
    var element = fabric.document.createElement('path');

    //'translate(-10,-20) scale(2) rotate(45) translate(5,10)'

    element.setAttribute('transform', 'translate(5,10)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [1,0,0,1,5,10]);

    element.setAttribute('transform', 'translate(-10,-20)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [1,0,0,1,-10,-20]);

    var ANGLE_DEG = 90;
    var ANGLE = ANGLE_DEG * Math.PI / 180;
    element.setAttribute('transform', 'rotate(' + ANGLE_DEG + ')');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [fabric.util.cos(ANGLE), fabric.util.sin(ANGLE), -fabric.util.sin(ANGLE), fabric.util.cos(ANGLE), 0, 0]);

    element.setAttribute('transform', 'scale(3.5)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [3.5,0,0,3.5,0,0]);

    element.setAttribute('transform', 'scale(2 13)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [2,0,0,13,0,0]);

    element.setAttribute('transform', 'skewX(2)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [1,0,0.03492076949174773,1,0,0]);

    element.setAttribute('transform', 'skewY(234.111)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [1,1.3820043381762832,0,1,0,0]);

    element.setAttribute('transform', 'matrix(1,2,3,4,5,6)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [1,2,3,4,5,6]);

    element.setAttribute('transform', 'translate(21,31) translate(11,22)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [1,0,0,1,32,53]);

    element.setAttribute('transform', 'scale(2 13) translate(5,15) skewX(11.22)');
    parsedValue = fabric.parseTransformAttribute(element.getAttribute('transform'));
    assert.deepEqual(parsedValue, [2,0,0.3967362169237356,13,10,195]);

  });

  QUnit.test('parseNestedTransformAttribute', function(assert) {
    var element = fabric.document.createElement('path');
    var parent = fabric.document.createElement('g');
    parent.appendChild(element);

    parent.setAttribute('transform', 'translate(50)');
    element.setAttribute('transform', 'translate(10 10)');

    var parsedAttributes = fabric.parseAttributes(element, ['transform']);
    assert.deepEqual(parsedAttributes.transformMatrix, [1, 0, 0, 1, 60, 10]);
  });

  QUnit.test('parseSVGFromString id polyfill', function(assert) {
    var done = assert.async();
    var string = '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                 '<defs><rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></defs>' +
                 '<use xlink:href="#myrect" x="50" y="50" ></use>' +
                 '</svg>',
        rect;

    assert.ok(fabric.loadSVGFromString);

    fabric.loadSVGFromString(string, function(objects) {
      rect = objects[0];
      assert.ok(rect instanceof fabric.Rect);
      done();
    });
  });

  QUnit.test('parseSVGFromString with gradient and fill url with quotes', function(assert) {
    var done = assert.async();
    var string = '<?xml version="1.0" encoding="utf-8"?>' +
    '<svg viewBox="0 0 1400 980" xmlns="http://www.w3.org/2000/svg" width="1400px" height="980px" version="1.1" >' +
    '<linearGradient id="SVGID_11_" gradientUnits="userSpaceOnUse" x1="702.4817" y1="66.4817" x2="825.5183" y2="189.5183">' +
    '<stop offset="0" style="stop-color:#FBB03B"/>' +
    '<stop offset="0.2209" style="stop-color:#FBAC3A"/>' +
    '<stop offset="0.4348" style="stop-color:#F9A037"/>' +
    '<stop offset="0.6458" style="stop-color:#F78D32"/>' +
    '<stop offset="0.8538" style="stop-color:#F4722A"/>' +
    '<stop offset="1" style="stop-color:#F15A24"/>' +
    '</linearGradient>' +
    '<path d="M 851 128 A 87 87 0 0 1 764 215 A 87 87 0 0 1 677 128 A 87 87 0 0 1 764 41 A 87 87 0 0 1 851 128 Z" class="st13" style="fill: url(\'#SVGID_11_\');"/>' +
    '<path d="M 851 128 A 87 87 0 0 1 764 215 A 87 87 0 0 1 677 128 A 87 87 0 0 1 764 41 A 87 87 0 0 1 851 128 Z" class="st13" style="fill: url(#SVGID_11_);"/>' +
    '<path d="M 851 128 A 87 87 0 0 1 764 215 A 87 87 0 0 1 677 128 A 87 87 0 0 1 764 41 A 87 87 0 0 1 851 128 Z" class="st13" style=\'fill: url("#SVGID_11_");\'/>' +
    '</svg>';

    fabric.loadSVGFromString(string, function(objects) {
      assert.equal(objects[0].fill.type, 'linear', 'first path has gradient');
      assert.equal(objects[1].fill.type, 'linear', 'second path has gradient');
      assert.equal(objects[2].fill.type, 'linear', 'second path has gradient');
      done();
    });
  });

  QUnit.test('parseSVGFromString with xlink:href', function(assert) {
    var done = assert.async();
    var string = '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                 '<defs><rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></defs>' +
                 '<use xlink:href="#myrect" x="50" y="50" ></use>' +
                 '</svg>',
        rect;

    assert.ok(fabric.loadSVGFromString);

    fabric.loadSVGFromString(string, function(objects) {
      rect = objects[0];
      assert.ok(rect instanceof fabric.Rect);
      done();
    });
  });

  QUnit.test('parseSVGFromString with href', function(assert) {
    var done = assert.async();
    var string = '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                 '<defs><rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></defs>' +
                 '<use href="#myrect" x="50" y="50" ></use>' +
                 '</svg>',
        rect;

    assert.ok(fabric.loadSVGFromString);

    fabric.loadSVGFromString(string, function(objects) {
      rect = objects[0];
      assert.ok(rect instanceof fabric.Rect);
      done();
    });
  });

  QUnit.test('parseSVGFromString nested opacity', function(assert) {
    var done = assert.async();
    var string = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg version="1.2" baseProfile="tiny" xml:id="svg-root" width="300" height="400" ' +
      'viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" ' +
      'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xe="http://www.w3.org/2001/xml-events">' +
      '<defs>' +
      '<style>' +
      '.cls-3{opacity:0.5;}' +
      '.cls-4{opacity:0.5;}' +
      '</style>' +
      '</defs>' +
        '<g fill="red" stroke="#000000" fill-opacity="0.5">' +
          '<circle cx="50" cy="50" r="50" fill-opacity="1" fill="rgba(255,0,0,0.3)" />' +
          '<circle cx="150" cy="50" r="50" fill="rgba(0,255,0,0.5)" />' +
          '<circle cx="50" cy="150" r="50" />' +
          '<circle cx="150" cy="150" r="50" fill-opacity="0.5" fill="rgb(0,0,255)" />' +
          '<circle cx="250" cy="50" r="50" fill-opacity="0.5" fill="rgba(0,0,255,0.5)" />' +
          '<circle cx="250" cy="150" r="50" fill-opacity="1" fill="rgb(0,0,255)" />' +
        '</g>' +
        '<g class="cls-3" transform="translate(0,200)">' +
          '<circle cx="50" cy="50" r="50" class="cls-4" fill="red" />' +
          '<circle cx="150" cy="50" r="50" fill="red" />' +
        '</g>' +
    '</svg>';

    fabric.loadSVGFromString(string, function(objects) {
      assert.equal(objects[0].fill, 'rgba(255,0,0,0.3)', 'first circle has opacity 0.3 from rgba');
      assert.equal(objects[0].fillOpacity, 1,'first circle has fill-opacity 1');
      assert.equal(objects[1].fill, 'rgba(0,255,0,0.25)', 'first circle has opacity 0.5 from rgba and 0.5 from gtoup fill opacity');
      assert.equal(objects[1].fillOpacity, 0.5,'first circle has fill-opacity 0.5');
      assert.equal(objects[2].fill, 'rgba(255,0,0,0.5)', 'first circle has opacity 0.5 from group fill opacity');
      assert.equal(objects[2].fillOpacity, 0.5,'first circle has fill-opacity 0.5');
      assert.equal(objects[3].fill, 'rgba(0,0,255,0.5)', 'first circle has opacity 0.5 from fill opacity');
      assert.equal(objects[3].fillOpacity, 0.5,'first circle has fill-opacity 1');
      assert.equal(objects[4].fill, 'rgba(0,0,255,0.25)', 'first circle has opacity 0.5 from rgba and 0.5 from fill opacity');
      assert.equal(objects[4].fillOpacity, 0.5,'first circle has fill-opacity 0.5');
      assert.equal(objects[5].fill, 'rgba(0,0,255,1)', 'first circle has opacity 1 from rgba');
      assert.equal(objects[5].fillOpacity, 1,'first circle has fill-opacity 1');
      assert.equal(objects[6].opacity, 0.25, 'opacity is 0.25 for cls-3 * cls-4');
      assert.equal(objects[7].opacity, 0.5,'opacity is 0.5 from cls-3');
      done();
    });
  });

  QUnit.test('parseSVGFromString with svg:namespace', function(assert) {
    var done = assert.async();
    var string = '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                 '<svg:defs><svg:rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></svg:defs>' +
                 '<svg:use xlink:href="#myrect" x="50" y="50" ></svg:use>' +
                 '</svg>',
        rect;

    assert.ok(fabric.loadSVGFromString);

    fabric.loadSVGFromString(string, function(objects) {
      rect = objects[0];
      assert.ok(rect instanceof fabric.Rect);
      done();
    });
  });

  // QUnit.test('parseSVGDocument', function(assert) {
  //   var done = assert.async();
  //   assert.ok(fabric.parseSVGDocument);
  //
  //   var data;
  //   fabric.util.request('../fixtures/path.svg', {
  //     method: 'get',
  //     onComplete: function(resp) {
  //       var doc = resp.responseXML;
  //       if (!doc || !doc.documentElement) {
  //           //IE can't parse XML with a DOCTYPE...
  //           doc = new ActiveXObject('Microsoft.XMLDOM');
  //           doc.async = 'false';
  //          //IE chokes on DOCTYPE
  //          doc.loadXML(resp.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,''));
  //       }
  //       fabric.parseSVGDocument(doc.documentElement, function() {
  //         data = arguments[0];
  //       });
  //     }
  //   });
  //
  //   setTimeout(function() {
  //     assert.equal(typeof data, 'object');
  //
  //     if (data) {
  //       assert.equal(data.length, 1);
  //
  //       var path = data[0];
  //
  //       assert.ok(path instanceof fabric.Path);
  //       assert.equal(JSON.stringify(path), EXPECTED_PATH_JSON);
  //     }
  //     done();
  //   }, 1500);
  // });

  // https://github.com/kangax/fabric.js/issues/25
  // QUnit.test('parsing one element should not "leak" its "fill" value onto parsing of following element', function(assert) {
  //   var done = assert.async();
  //   var objects;
  //   fabric.util.request('../fixtures/svg_with_rect.svg', {
  //     method: 'get',
  //     onComplete: function(resp) {
  //       var doc = resp.responseXML;
  //       if (!doc || !doc.documentElement) return;
  //       fabric.parseSVGDocument(doc.documentElement, function() {
  //         objects = arguments[0];
  //       });
  //     }
  //   });
  //
  //   setTimeout(function() {
  //     if (objects) {
  //       assert.equal(objects[1].fill, 'green');
  //     }
  //
  //     done();
  //   }, 1500);
  // });

  QUnit.test('opacity attribute', function(assert) {
    var tagNames = ['rect', 'path', 'circle', 'ellipse', 'polygon'];

    for (var i = tagNames.length; i--; ) {
      var el = fabric.document.createElement(tagNames[i]);
      var opacityValue = Math.random().toFixed(2);

      el.setAttribute('opacity', opacityValue);
      // eslint-disable-next-line
      fabric.Rect.fromElement(el, function(obj) {
        assert.equal(obj.opacity, parseFloat(opacityValue),
          'opacity should be parsed correctly from "opacity" attribute of ' + tagNames[i] + ' element');
      });
    }
  });

  QUnit.test('fill-opacity attribute with fill attribute', function(assert) {
    var el = fabric.document.createElement('rect');
    var opacityValue = Math.random().toFixed(2);

    el.setAttribute('fill-opacity', opacityValue);
    el.setAttribute('fill', '#FF0000');
    fabric.Rect.fromElement(el, function(obj) {
      assert.equal(obj.fill, 'rgba(255,0,0,' + parseFloat(opacityValue) + ')',
        'opacity should be parsed correctly from "opacity" attribute of rect element');
    });
  });

  QUnit.test('fill-opacity attribute without fill attribute', function(assert) {
    var el = fabric.document.createElement('rect');
    var opacityValue = Math.random().toFixed(2);

    el.setAttribute('fill-opacity', opacityValue);
    fabric.Rect.fromElement(el, function(obj) {
      assert.equal(obj.fill, 'rgba(0,0,0,' + parseFloat(opacityValue) + ')',
        'opacity should be parsed correctly from "opacity" attribute of rect element');
    });
  });

  QUnit.test('fill-opacity attribute with fill none', function(assert) {
    var el = fabric.document.createElement('rect');
    var opacityValue = Math.random().toFixed(2);

    el.setAttribute('fill-opacity', opacityValue);
    el.setAttribute('fill', 'none');
    fabric.Rect.fromElement(el, function(obj) {
      assert.equal(obj.fill, '', 'fill should stay empty');
    });
  });

  QUnit.test('stroke-opacity attribute with stroke attribute', function(assert) {
    var el = fabric.document.createElement('rect');
    var opacityValue = Math.random().toFixed(2);

    el.setAttribute('stroke-opacity', opacityValue);
    el.setAttribute('stroke', '#FF0000');
    fabric.Rect.fromElement(el, function(obj) {
      assert.equal(obj.stroke, 'rgba(255,0,0,' + parseFloat(opacityValue) + ')',
        'opacity should be parsed correctly from "opacity" attribute of rect element');
    });
  });

  QUnit.test('stroke-opacity attribute without stroke attribute', function(assert) {
    var el = fabric.document.createElement('rect');
    var opacityValue = Math.random().toFixed(2);

    el.setAttribute('stroke-opacity', opacityValue);
    fabric.Rect.fromElement(el, function(obj) {
      assert.equal(obj.stroke, null, 'Default stroke is null');
    });
  });

  QUnit.test('stroke-opacity attribute with stroke none', function(assert) {
    var el = fabric.document.createElement('rect');
    var opacityValue = Math.random().toFixed(2);

    el.setAttribute('stroke-opacity', opacityValue);
    el.setAttribute('stroke', 'none');
    fabric.Rect.fromElement(el, function(obj) {
      assert.equal(obj.stroke, '', 'stroke should stay empty');
    });
  });

  QUnit.test('getCssRule', function(assert) {

    assert.ok(fabric.getCSSRules);

    var doc = fabric.document,
        svgUid = 'uniqueId',
        styleElement = doc.createElement('style');

    styleElement.textContent = 'g polygon.cls, rect {fill:#FF0000; stroke:#000000;stroke-width:0.25px;}\
    polygon.cls {fill:none;stroke:#0000FF;}';

    doc.body.appendChild(styleElement);

    var expectedObject = {
      'g polygon.cls': {
        'fill': '#FF0000',
        'stroke': '#000000',
        'stroke-width': '0.25px'
      },
      'rect': {
        'fill': '#FF0000',
        'stroke': '#000000',
        'stroke-width': '0.25px'
      },
      'polygon.cls': {
        'fill': 'none',
        'stroke': '#0000FF'
      }
    };

    fabric.cssRules[svgUid] = fabric.getCSSRules(doc);
    assert.deepEqual(fabric.cssRules[svgUid], expectedObject);

    var elPolygon = fabric.document.createElement('polygon'),
        expectedStyle = {
          'fill': '',
          'stroke': '#0000FF'
        };

    elPolygon.setAttribute('points', '10,12 20,22');
    elPolygon.setAttribute('class', 'cls');
    elPolygon.setAttribute('svgUid', svgUid);

    var style = fabric.parseAttributes(elPolygon, []);
    assert.deepEqual(style, expectedStyle);

    styleElement.textContent = '\t\n';
    expectedStyle = { };
    svgUid =  'uniqueId2';
    fabric.cssRules[svgUid] = fabric.getCSSRules(doc);
    assert.deepEqual(fabric.cssRules[svgUid], expectedStyle);
  });

  QUnit.test('getCssRule with same selectors', function(assert) {

    assert.ok(fabric.getCSSRules);

    var doc = fabric.document,
        svgUid = 'uniqueId',
        styleElement = doc.createElement('style');

    styleElement.textContent = '.cls1,.cls2 { fill: #FF0000;} .cls1 { stroke: #00FF00;} .cls3,.cls1 { stroke-width: 3;}';

    doc.body.appendChild(styleElement);

    var expectedObject = {
      '.cls1': {
        'fill': '#FF0000',
        'stroke': '#00FF00',
        'stroke-width': '3'
      },
      '.cls2': {
        'fill': '#FF0000'
      },
      '.cls3': {
        'stroke-width': '3'
      }
    };

    fabric.cssRules[svgUid] = fabric.getCSSRules(doc);
    assert.deepEqual(fabric.cssRules[svgUid], expectedObject);
  });

})();
