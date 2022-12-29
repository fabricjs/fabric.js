(function () {
  const classRegistry = new fabric.util.classRegistry.constructor();
  QUnit.module('fabric.util.classRegistry');
  QUnit.test('getClass throw when no class is registered', function (assert) {
    assert.ok(fabric.util.classRegistry, 'classRegistry is available');
    assert.throws(() => classRegistry.getClass('rect'), new Error(`No class registered for rect`), 'initially Rect is undefined');
  });
  QUnit.test('getClass will return specific class from the prototype type', function (assert) {
    class TestClass {

    }
    TestClass.prototype.type = 'anyType';
    classRegistry.setClass(TestClass);
    const resolved = classRegistry.getClass('anyType');
    assert.equal(resolved, TestClass, 'resolves class correctly');
  });
  QUnit.test('getClass will return specific class from custom type', function (assert) {
    class TestClass2 {

    }
    TestClass2.prototype.type = 'anyType';
    classRegistry.setClass(TestClass2, 'myCustomType');
    const resolved = classRegistry.getClass('myCustomType');
    assert.equal(resolved, TestClass2, 'resolves class correctly with custom type');
  });
  QUnit.test('can resolve different class for SVG and JSON', function (assert) {
    class TestClass3 {

    }
    TestClass3.prototype.type = 'anyType';
    class TestClass4 {

    }
    TestClass4.prototype.type = 'typeC';
    classRegistry.setClass(TestClass3, 'myCustomType');
    classRegistry.setSVGClass(TestClass4, 'myCustomType');
    const resolved = classRegistry.getClass('myCustomType');
    const resolvedSvg = classRegistry.getSVGClass('myCustomType');
    assert.notEqual(resolved, resolvedSvg, 'resolved different classes');
  });
})()
