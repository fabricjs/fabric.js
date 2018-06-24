(function() {

  QUnit.module('fabric.Shadow');

  var REFERENCE_SHADOW_OBJECT = {
    'color':   'rgb(0,255,0)',
    'blur':    10,
    'offsetX': 20,
    'offsetY': 5
  };

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Shadow);

    var shadow = new fabric.Shadow();
    assert.ok(shadow instanceof fabric.Shadow, 'should inherit from fabric.Shadow');
  });


  QUnit.test('initializing with object', function(assert) {
    assert.ok(fabric.Shadow);

    var shadow = new fabric.Shadow(REFERENCE_SHADOW_OBJECT);
    assert.equal(shadow.color, 'rgb(0,255,0)');
    assert.equal(shadow.offsetX, 20);
    assert.equal(shadow.offsetY, 5);
    assert.equal(shadow.blur, 10);
  });

  QUnit.test('initializing with string', function(assert) {
    assert.ok(fabric.Shadow);

    // old text-shadow definition - color offsetX offsetY blur
    var shadow1 = new fabric.Shadow('rgba(0,0,255,0.5) 10px 20px 5px');

    assert.equal(shadow1.color, 'rgba(0,0,255,0.5)');
    assert.equal(shadow1.offsetX, 10);
    assert.equal(shadow1.offsetY, 20);
    assert.equal(shadow1.blur, 5);

    var shadow2 = new fabric.Shadow('rgb(0,0,255) 10px 20px ');

    assert.equal(shadow2.color, 'rgb(0,0,255)');
    assert.equal(shadow2.offsetX, 10);
    assert.equal(shadow2.offsetY, 20);
    assert.equal(shadow2.blur, 0);

    var shadow3 = new fabric.Shadow('#00FF00 30 10 ');

    assert.equal(shadow3.color, '#00FF00');
    assert.equal(shadow3.offsetX, 30);
    assert.equal(shadow3.offsetY, 10);
    assert.equal(shadow3.blur, 0);

    var shadow4 = new fabric.Shadow(' #FF0000 10px');

    assert.equal(shadow4.color, '#FF0000');
    assert.equal(shadow4.offsetX, 10);
    assert.equal(shadow4.offsetY, 0);
    assert.equal(shadow4.blur, 0);

    var shadow5 = new fabric.Shadow('#000000');

    assert.equal(shadow5.color, '#000000');
    assert.equal(shadow5.offsetX, 0);
    assert.equal(shadow5.offsetY, 0);
    assert.equal(shadow5.blur, 0);


    // new text-shadow definition - offsetX offsetY blur color
    var shadow6 = new fabric.Shadow('10px 20px 5px rgba(0,0,255,0.5)');

    assert.equal(shadow6.color, 'rgba(0,0,255,0.5)');
    assert.equal(shadow6.offsetX, 10);
    assert.equal(shadow6.offsetY, 20);
    assert.equal(shadow6.blur, 5);

    var shadow7 = new fabric.Shadow('10 20 5px #00FF00');

    assert.equal(shadow7.color, '#00FF00');
    assert.equal(shadow7.offsetX, 10);
    assert.equal(shadow7.offsetY, 20);
    assert.equal(shadow7.blur, 5);

    var shadow8 = new fabric.Shadow('10px 20px rgb(0,0,255)');

    assert.equal(shadow8.color, 'rgb(0,0,255)');
    assert.equal(shadow8.offsetX, 10);
    assert.equal(shadow8.offsetY, 20);
    assert.equal(shadow8.blur, 0);

    var shadow9 = new fabric.Shadow(' 10px #FF0000 ');

    assert.equal(shadow9.color, '#FF0000');
    assert.equal(shadow9.offsetX, 10);
    assert.equal(shadow9.offsetY, 0);
    assert.equal(shadow9.blur, 0);

    var shadow10 = new fabric.Shadow('  #FF0000 ');

    assert.equal(shadow10.color, '#FF0000');
    assert.equal(shadow10.offsetX, 0);
    assert.equal(shadow10.offsetY, 0);
    assert.equal(shadow10.blur, 0);

    var shadow11 = new fabric.Shadow('');

    assert.equal(shadow11.color, 'rgb(0,0,0)');
    assert.equal(shadow11.offsetX, 0);
    assert.equal(shadow11.offsetY, 0);
    assert.equal(shadow11.blur, 0);
  });

  QUnit.test('properties', function(assert) {
    var shadow = new fabric.Shadow();

    assert.equal(shadow.blur, 0);
    assert.equal(shadow.color, 'rgb(0,0,0)');
    assert.equal(shadow.offsetX, 0);
    assert.equal(shadow.offsetY, 0);
  });

  QUnit.test('toString', function(assert) {
    var shadow = new fabric.Shadow();
    assert.ok(typeof shadow.toString === 'function');

    assert.equal(shadow.toString(), '0px 0px 0px rgb(0,0,0)');
  });

  QUnit.test('toObject', function(assert) {
    var shadow = new fabric.Shadow();
    assert.ok(typeof shadow.toObject === 'function');

    var object = shadow.toObject();
    assert.equal(JSON.stringify(object), '{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0,"affectStroke":false}');
  });

  QUnit.test('clone with affectStroke', function(assert) {
    var shadow = new fabric.Shadow({affectStroke: true, blur: 5});
    assert.ok(typeof shadow.toObject === 'function');
    var object = shadow.toObject(),
        shadow2 = new fabric.Shadow(object),
        object2 = shadow2.toObject();
    assert.equal(shadow.affectStroke, shadow2.affectStroke);
    assert.deepEqual(object, object2);
  });

  QUnit.test('toObject without default value', function(assert) {
    var shadow = new fabric.Shadow();
    shadow.includeDefaultValues = false;

    assert.equal(JSON.stringify(shadow.toObject()), '{}');

    shadow.color = 'red';
    assert.equal(JSON.stringify(shadow.toObject()), '{"color":"red"}');

    shadow.offsetX = 15;
    assert.equal(JSON.stringify(shadow.toObject()), '{"color":"red","offsetX":15}');
  });

  QUnit.test('toSVG', function(assert) {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: -10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000'});

    assert.equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');

    shadow.color = 'rgba(255,0,0,0.5)';
    assert.equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="0.5"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');

    shadow.color = '#000000';
    assert.equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(0,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');
  });

  QUnit.test('toSVG with flipped object', function(assert) {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: -10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000', flipX: true, flipY: true});

    assert.equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="-10" dy="10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');

  });

  QUnit.test('toSVG with rotated object', function(assert) {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: 10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000', angle: 45});

    assert.equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="14.14" dy="0" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');
  });

  QUnit.test('toSVG with rotated flipped object', function(assert) {
    // reset uid
    fabric.Object.__uid = 0;

    var shadow = new fabric.Shadow({color: '#FF0000', offsetX: 10, offsetY: 10, blur: 2});
    var object = new fabric.Object({fill: '#FF0000', angle: 45, flipX: true});

    assert.equal(shadow.toSVG(object), '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="-14.14" dy="0" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n');
  });

})();
