(function(){
  
  module('fabric.util');
  
  test('toFixed', function(){
    ok(typeof fabric.util.toFixed == 'function');
    
    function test(what) {
      equals(fabric.util.toFixed(what, 2), 166.67, 'should leave 2 fractional digits');
      equals(fabric.util.toFixed(what, 5), 166.66667, 'should leave 5 fractional digits');
      equals(fabric.util.toFixed(what, 0), 167, 'should leave 0 fractional digits');
      
      var fractionless = (typeof what == 'number') 
        ? parseInt(what) 
        : what.substring(0, what.indexOf('.'));
        
      equals(fabric.util.toFixed(fractionless, 2), 166, 'should leave fractionless number as is');
    }
    
    test.call(this, '166.66666666666666666666'); // string
    test.call(this, 166.66666666666666666666); // number
  });
  
  test('removeFromArray', function() {
    var testArray = [1,2,3,4,5];
    
    ok(typeof fabric.util.removeFromArray == 'function');
    
    fabric.util.removeFromArray(testArray, 2);
    same([1,3,4,5], testArray);
    equals(fabric.util.removeFromArray(testArray, 1), testArray, 'should return reference to original array');
    
    testArray = [1,2,3,1];
    fabric.util.removeFromArray(testArray, 1);
    same([2,3,1], testArray, 'only first occurance of value should be deleted');
    
    testArray = [1,2,3];
    fabric.util.removeFromArray(testArray, 12);
    same([1,2,3], testArray, 'deleting unexistent value should not affect array');
    
    testArray = [];
    fabric.util.removeFromArray(testArray, 1);
    same([], testArray, 'deleting any value from empty array should not affect it');
    
    testArray = ['0'];
    fabric.util.removeFromArray(testArray, 0);
    same(['0'], testArray, 'should use (strict) identity comparison, rather than equality one');
  });
  
  test('degreesToRadians', function(){
    ok(typeof fabric.util.degreesToRadians == 'function');
    equals(fabric.util.degreesToRadians(0), 0);
    equals(fabric.util.degreesToRadians(90), Math.PI / 2);
    equals(fabric.util.degreesToRadians(180), Math.PI);
    
    same(fabric.util.degreesToRadians(), NaN);
  });
  
  test('getRandomInt', function() {
    ok(typeof fabric.util.getRandomInt == 'function');
    
    var randomInts = [];
    for (var i = 100; i--; ) {
      var randomInt = fabric.util.getRandomInt(100, 200); 
      randomInts.push(randomInt);
      ok(randomInt >= 100 && randomInt <= 200);
    }
    
    var areAllTheSame = randomInts.every(function(value){ 
      return value === randomInts[0];
    });
    
    ok(!areAllTheSame);
  });
  
  test('falseFunction', function() {
    ok(typeof fabric.util.falseFunction == 'function');
    equals(fabric.util.falseFunction(), false);
  });
  
  test('String.prototype.trim', function() {
    ok(typeof String.prototype.trim == 'function');
    equals('\t\n   foo bar \n    \xA0  '.trim(), 'foo bar');
  });
  
  test('camelize', function() {
    var camelize = fabric.util.string.camelize;
    
    ok(typeof camelize == 'function');
    
    equals(camelize('foo'), 'foo');
    equals(camelize('foo-bar'), 'fooBar');
    equals(camelize('Foo-bar-Baz'), 'FooBarBaz');
    equals(camelize('FooBarBaz'), 'FooBarBaz');
    equals(camelize('-bar'), 'Bar');
    equals(camelize(''), '');
    equals(camelize('and_something_with_underscores'), 'and_something_with_underscores');
    equals(camelize('underscores_and-dashes'), 'underscores_andDashes');
    equals(camelize('--double'), 'Double');
  });
  
  test('capitalize', function() {
    var capitalize = fabric.util.string.capitalize;
    
    ok(typeof capitalize == 'function');
    
    equals(capitalize('foo'), 'Foo');
    equals(capitalize(''), '');
    equals(capitalize('Foo'), 'Foo');
    equals(capitalize('foo-bar-baz'), 'Foo-bar-baz');
    equals(capitalize('FOO'), 'Foo');
    equals(capitalize('FoobaR'), 'Foobar');
    equals(capitalize('2foo'), '2foo');
  });
})();