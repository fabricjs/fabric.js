(function() {

  QUnit.module('fabric.Shadow');

  var REFERENCE_SHADOW_OBJECT = {
    'color':   'rgb(0,255,0)',
    'blur':    10,
    'offsetX': 20,
    'offsetY': 5
  };

  test('constructor', function() {
    ok(fabric.Shadow);

    var shadow = new fabric.Shadow();
    ok(shadow instanceof fabric.Shadow, 'should inherit from fabric.Shadow');
  });


  test('initializing with object', function() {
    ok(fabric.Shadow);

    var shadow = new fabric.Shadow(REFERENCE_SHADOW_OBJECT);
    equal(shadow.color, 'rgb(0,255,0)');
    equal(shadow.offsetX, 20);
    equal(shadow.offsetY, 5);
    equal(shadow.blur, 10);
  });

  test('initializing with string', function() {
    ok(fabric.Shadow);

    // old text-shadow definition - color offsetX offsetY blur
    var shadow1 = new fabric.Shadow('rgba(0,0,255,0.5) 10px 20px 5px');

    equal(shadow1.color, 'rgba(0,0,255,0.5)');
    equal(shadow1.offsetX, 10);
    equal(shadow1.offsetY, 20);
    equal(shadow1.blur, 5);

    var shadow2 = new fabric.Shadow('rgb(0,0,255) 10px 20px ');

    equal(shadow2.color, 'rgb(0,0,255)');
    equal(shadow2.offsetX, 10);
    equal(shadow2.offsetY, 20);
    equal(shadow2.blur, 0);

    var shadow3 = new fabric.Shadow('#00FF00 30 10 ');

    equal(shadow3.color, '#00FF00');
    equal(shadow3.offsetX, 30);
    equal(shadow3.offsetY, 10);
    equal(shadow3.blur, 0);

    var shadow4 = new fabric.Shadow(' #FF0000 10px');

    equal(shadow4.color, '#FF0000');
    equal(shadow4.offsetX, 10);
    equal(shadow4.offsetY, 0);
    equal(shadow4.blur, 0);

    var shadow5 = new fabric.Shadow('#000000');

    equal(shadow5.color, '#000000');
    equal(shadow5.offsetX, 0);
    equal(shadow5.offsetY, 0);
    equal(shadow5.blur, 0);


    // new text-shadow definition - offsetX offsetY blur color
    var shadow6 = new fabric.Shadow('10px 20px 5px rgba(0,0,255,0.5)');

    equal(shadow6.color, 'rgba(0,0,255,0.5)');
    equal(shadow6.offsetX, 10);
    equal(shadow6.offsetY, 20);
    equal(shadow6.blur, 5);

    var shadow7 = new fabric.Shadow('10 20 5px #00FF00');

    equal(shadow7.color, '#00FF00');
    equal(shadow7.offsetX, 10);
    equal(shadow7.offsetY, 20);
    equal(shadow7.blur, 5);

    var shadow8 = new fabric.Shadow('10px 20px rgb(0,0,255)');

    equal(shadow8.color, 'rgb(0,0,255)');
    equal(shadow8.offsetX, 10);
    equal(shadow8.offsetY, 20);
    equal(shadow8.blur, 0);

    var shadow9 = new fabric.Shadow(' 10px #FF0000 ');

    equal(shadow9.color, '#FF0000');
    equal(shadow9.offsetX, 10);
    equal(shadow9.offsetY, 0);
    equal(shadow9.blur, 0);

    var shadow10 = new fabric.Shadow('  #FF0000 ');

    equal(shadow10.color, '#FF0000');
    equal(shadow10.offsetX, 0);
    equal(shadow10.offsetY, 0);
    equal(shadow10.blur, 0);

    var shadow11 = new fabric.Shadow('');

    equal(shadow11.color, 'rgb(0,0,0)');
    equal(shadow11.offsetX, 0);
    equal(shadow11.offsetY, 0);
    equal(shadow11.blur, 0);
  });

  test('properties', function() {
    var shadow = new fabric.Shadow();

    equal(shadow.blur, 0);
    equal(shadow.color, 'rgb(0,0,0)');
    equal(shadow.offsetX, 0);
    equal(shadow.offsetY, 0);
  });

  test('toString', function() {
    var shadow = new fabric.Shadow();
    ok(typeof shadow.toString == 'function');

    equal(shadow.toString(), '0px 0px 0px rgb(0,0,0)');
  });

  test('toObject', function() {
    var shadow = new fabric.Shadow();
    ok(typeof shadow.toObject == 'function');

    var object = shadow.toObject();
    equal(JSON.stringify(object), '{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0,"affectStroke":false}');
  });

  test('clone with affectStroke', function() {
    var shadow = new fabric.Shadow({affectStroke: true, blur: 5});
    ok(typeof shadow.toObject == 'function');
    var object = shadow.toObject(),
        shadow2 = new fabric.Shadow(object),
        object2 = shadow2.toObject();
    equal(shadow.affectStroke, shadow2.affectStroke);
    deepEqual(object, object2);
  });

  test('toObject without default value', function() {
    var shadow = new fabric.Shadow();
    shadow.includeDefaultValues = false;

    equal(JSON.stringify(shadow.toObject()), '{}');

    shadow.color = 'red';
    equal(JSON.stringify(shadow.toObject()), '{"color":"red"}');

    shadow.offsetX = 15;
    equal(JSON.stringify(shadow.toObject()), '{"color":"red","offsetX":15}');
  });

  test('toSVG', function() {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: -10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000'});

    equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="#FF0000"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');

    shadow.color = '#000000';
    equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="#000000"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');
  });

  test('toSVG with flipped object', function() {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: -10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000', flipX: true, flipY: true});

    equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="-10" dy="10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="#FF0000"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');

  });
  
  test('toSVG with rotated object', function() {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: 10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000', angle: 45});

    equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="14.14" dy="0" result="oBlur" ></feOffset>\n\t<feFlood flood-color="#FF0000"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');
  });
  
  test('toSVG with rotated flipped object', function() {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: 10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000', angle: 45, flipX: true});

    equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="-14.14" dy="0" result="oBlur" ></feOffset>\n\t<feFlood flood-color="#FF0000"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');
  });

})();
