(function () {
  const classRegistry = new fabric.util.classRegistry.constructor();
  QUnit.module('fabric.util.classRegistry');
  QUnit.test('getJSONClass throw when no class is registered', function (assert) {
    assert.ok(fabric.util.classRegistry, 'classRegistry is available');
    assert.throws(() => classRegistry.getJSONClass('rect'), new Error(`No class registered for rect`), 'initially Rect is undefined');
  });
  QUnit.test('getJSONClass will return specific class from the prototype type', function (assert) {
    class TestClass {

    }
    TestClass.prototype.type = 'anyType';
    classRegistry.setJSONClass(TestClass);
    const resolved = classRegistry.getJSONClass('anyType');
    assert.equal(resolved, TestClass, 'resolves class correctly');
  });
  QUnit.test('getJSONClass will return specific class from custom type', function (assert) {
    class TestClass2 {

    }
    TestClass2.prototype.type = 'anyType';
    classRegistry.setJSONClass(TestClass2, 'myCustomType');
    const resolved = classRegistry.getJSONClass('myCustomType');
    assert.equal(resolved, TestClass2, 'resolves class correctly with custom type');
  });
  QUnit.test('can resolve different class for SVG and JSON', function (assert) {
    class TestClass3 {

    }
    TestClass3.prototype.type = 'anyType';
    class TestClass4 {

    }
    TestClass4.prototype.type = 'typeC';
    classRegistry.setJSONClass(TestClass3, 'myCustomType');
    classRegistry.setSVGClass(TestClass4, 'myCustomType');
    const resolved = classRegistry.getJSONClass('myCustomType');
    const resolvedSvg = classRegistry.getSVGClass('myCustomType');
    assert.notEqual(resolved, resolvedSvg, 'resolved different classes');
  });
  QUnit.test('can set both SVG and JSON', function (assert) {
    class JSONClass {
      static fromObject() {
        return new JSONClass();
      }
    }
    JSONClass.prototype.type = 'json';
    class SVGClass {
      static fromElement() {
        return new SVGClass();
      }
    }
    SVGClass.prototype.type = 'svg';
    class ExportableClass {
      static fromObject() {
        return new ExportableClass();
      }
      static fromElement() {
        return new ExportableClass();
      }
    }
    ExportableClass.prototype.type = 'X';
    classRegistry.setClass(JSONClass);
    classRegistry.setClass(SVGClass);
    classRegistry.setClass(ExportableClass, 'Y');
    assert.equal(classRegistry.getJSONClass('json'), JSONClass, 'resolved class');
    assert.throws(() => classRegistry.getSVGClass('json'), 'should not have registered class');
    assert.equal(classRegistry.getSVGClass('svg'), SVGClass, 'resolved class');
    assert.throws(() => classRegistry.getJSONClass('svg'), 'should not have registered class');
    assert.equal(classRegistry.getJSONClass('Y'), ExportableClass, 'resolved class');
    assert.equal(classRegistry.getSVGClass('Y'), ExportableClass, 'resolved class');
    assert.throws(() => classRegistry.getJSONClass('X'), 'should not have registered class');
    assert.throws(() => classRegistry.getSVGClass('X'), 'should not have registered class');
  });
})()
