(function() {
  QUnit.module('fabric header.js');

  QUnit.test('default values', function(assert) {
    assert.ok(typeof fabric.document !== 'undefined', 'document is set');
    assert.ok(typeof fabric.window !== 'undefined', 'window is set');
    assert.ok(typeof fabric.isTouchSupported !== 'undefined', 'isTouchSupported is set');
    assert.ok(typeof fabric.isLikelyNode !== 'undefined', 'isLikelyNode is set');
    assert.equal(fabric.SHARED_ATTRIBUTES.length, 19, 'SHARED_ATTRIBUTES is set');
  });

})();
