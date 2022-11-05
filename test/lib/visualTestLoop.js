(function (exports) {

  /**
   * @deprecated use QUnit.assert.visualEqual instead
   * @param {*} QUnit 
   * @returns 
   */
  exports.visualTestLoop = function(QUnit) {

    return function testCallback({
      disabled,
      action = 'test',
      test: testName,
      code,
      percentage,
      golden,
      newModule,
      beforeEachHandler,
      /**
       * do not generate a golden
       */
      testOnly,
      fabricClass = 'StaticCanvas',
      width,
      height
    }) {
      if (disabled) {
        return;
      }
      if (newModule) {
        QUnit.module(newModule, {
          beforeEach: beforeEachHandler,
        });
      }
      QUnit[action](testName, function (assert) {
        assert.visualEqual(code, golden, {
          fabricClass,
          width,
          height,
          percentageThreshold: percentage,
          testOnly,
        });
      });
    }
  }

})(typeof window === 'undefined' ? exports : this);
