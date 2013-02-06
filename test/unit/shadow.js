(function() {

  QUnit.module('fabric.Shadow');

  test('constructor', function() {
    ok(fabric.Shadow);

    var shadow = new fabric.Shadow();
    ok(shadow instanceof fabric.Shadow, 'should inherit from fabric.Shadow');
  });

  test('properties', function() {
    var shadow = new fabric.Shadow();

    equal(shadow.blur, 0);
    equal(shadow.color, 'rgb(0,0,0)');
    equal(shadow.offsetX, 0);
    equal(shadow.offsetY, 0);
  });

  test('toObject', function() {
    var shadow = new fabric.Shadow();
    ok(typeof shadow.toObject == 'function');

    var object = shadow.toObject();
    equal(JSON.stringify(object), '{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0}');
  });

  // TODO: implement and test this
  // test('toSVG', function() {
  //
  // });

})();