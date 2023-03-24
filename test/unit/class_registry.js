(function () {
  const classRegistry = new fabric.classRegistry.constructor();
  QUnit.module('classRegistry');
  QUnit.test('getJSONClass throw when no class is registered', function (assert) {
    assert.ok(fabric.classRegistry, 'classRegistry is available');
    assert.throws(() => classRegistry.getJSONClass('rect'), new Error(`No class registered for rect`), 'initially Rect is undefined');
  });
  QUnit.test('getJSONClass will return specific class matched by name', function (assert) {
    class TestClass {

    }
    classRegistry.setJSONClass(TestClass);
    assert.equal(classRegistry.getJSONClass('TestClass'), TestClass, 'resolves class correctly');
    assert.equal(classRegistry.getJSONClass('testclass'), TestClass, 'resolves class correctly to lower case');
  });
  QUnit.test('getJSONClass will return specific class from custom type', function (assert) {
    class TestClass2 {

    }
    classRegistry.setJSONClass(TestClass2, 'myCustomType');
    const resolved = classRegistry.getJSONClass('myCustomType');
    assert.equal(resolved, TestClass2, 'resolves class correctly with custom type');
  });
  QUnit.test('can resolve different class for SVG and JSON', function (assert) {
    class TestClass3 {

    }
    class TestClass4 {

    }
    classRegistry.setJSONClass(TestClass3, 'myCustomType');
    classRegistry.setSVGClass(TestClass4, 'myCustomType');
    const resolved = classRegistry.getJSONClass('myCustomType');
    const resolvedSvg = classRegistry.getSVGClass('myCustomType');
    assert.notEqual(resolved, resolvedSvg, 'resolved different classes');
  });
  QUnit.test('legacy resolution', function (assert) {
    assert.equal(fabric.classRegistry.getJSONClass('rect'), fabric.Rect, 'resolves class correctly');
    assert.equal(fabric.classRegistry.getJSONClass('i-text'), fabric.IText, 'resolves class correctly');
    assert.equal(fabric.classRegistry.getJSONClass('activeSelection'), fabric.ActiveSelection, 'resolves class correctly');
    assert.equal(fabric.classRegistry.getJSONClass('object'), fabric.Object, 'resolves class correctly');
    assert.equal(fabric.classRegistry.getJSONClass({
      blur: 1,
      offsetY: 2
    }), fabric.Shadow, 'found shadow');
    assert.equal(fabric.classRegistry.getJSONClass({
      colorStops: []
    }), fabric.Gradient, 'found gradient');
  });
  QUnit.test('can register both SVG and JSON', function (assert) {
    class JSONClass {
      static fromObject() {
        return new this();
      }
    }
    class SVGClass {
      static fromElement() {
        return new this();
      }
    }
    class ExportableClass {
      static fromObject() {
        return new this();
      }
      static fromElement() {
        return new this();
      }
    }
    classRegistry.setClass(JSONClass);
    classRegistry.setClass(SVGClass);
    classRegistry.setClass(ExportableClass, 'Y');
    assert.equal(classRegistry.getJSONClass(JSONClass.name), JSONClass, 'resolved class');
    assert.throws(() => classRegistry.getSVGClass(JSONClass.name.toLowerCase()), 'should not have registered class');
    assert.equal(classRegistry.getSVGClass(SVGClass.name.toLowerCase()), SVGClass, 'resolved class');
    assert.throws(() => classRegistry.getJSONClass(SVGClass.name), 'should not have registered class');
    assert.equal(classRegistry.getJSONClass('Y'), ExportableClass, 'resolved class');
    assert.equal(classRegistry.getSVGClass('Y'), ExportableClass, 'resolved class');
    assert.throws(() => classRegistry.getJSONClass('X'), 'should not have registered class');
    assert.throws(() => classRegistry.getSVGClass('X'), 'should not have registered class');
    assert.throws(() => classRegistry.getSVGClass('x'), 'should not have registered class');
  });
})()
