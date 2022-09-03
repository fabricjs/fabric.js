(function() {
  const perfLimit = fabric.config.perfLimitSizeTotal;
  QUnit.module('Cache', {
    beforeEach: function() {
      fabric.config.perfLimitSizeTotal = 10000;
    },
    afterEach: function() {
      fabric.config.perfLimitSizeTotal = perfLimit;
    }
  });

  QUnit.test('Cache.limitDimsByArea', function(assert) {
    assert.ok(typeof fabric.cache.limitDimsByArea === 'function');
    var [x, y] = fabric.cache.limitDimsByArea(1);
    assert.equal(x, 100);
    assert.equal(y, 100);
  });

  QUnit.test('Cache.limitDimsByArea ar > 1', function(assert) {
    var [x , y] = fabric.cache.limitDimsByArea(3);
    assert.equal(x, 173);
    assert.equal(y, 57);
  });

  QUnit.test('Cache.limitDimsByArea ar < 1', function(assert) {
    var [x, y] = fabric.cache.limitDimsByArea(1 / 3);
    assert.equal(x, 57);
    assert.equal(y, 173);
  });
})();
