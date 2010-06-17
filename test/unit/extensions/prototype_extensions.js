function init() {
  
  var global = (function(){ return this; })();
  
  new Test.Unit.Runner({
    testFalseFunction: function() {
      this.assertRespondsTo('falseFunction', Prototype);
      this.assertIdentical(false, Prototype.falseFunction());
    },
    testGetScript: function() {
      this.assert(Prototype.getScript);
      this.assertUndefined(global.foo);
      
      var callbackFired = false;
      
      Prototype.getScript('../../fixtures/test_script.js', function(){
        callbackFired = true;
      });
      
      this.wait(500, function(){
        this.assertIdentical('bar', global.foo);
        this.assert(callbackFired);
      });
    },
    
    testButtonEnableDisable: function(){
      var buttonEl = document.createElement('button');
      
      this.assertRespondsTo('enable', buttonEl);
      this.assertRespondsTo('disable', buttonEl);
      
      buttonEl.disabled = true;
      
      buttonEl.enable();
      this.assert(!buttonEl.disabled);
      
      buttonEl.disable();
      this.assert(buttonEl.disabled);
    },
    
    testMakeUnselectable: function() {
      var el = document.createElement('div');
      
      this.assertRespondsTo('makeUnselectable', el);
      
      el.makeUnselectable();
      this.assertIdentical(false, el.onselectstart(), 'onselectstart should be a function that returns `false`');
    },
    
    testAssertEnumEqualUnordered: function() {
      this.assertRespondsTo('assertEnumEqualUnordered', this);
      
      this.assert(Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], [1,2,3]));
      this.assert(Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], [1,3,2]));
      this.assert(Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], [2,1,3]));
      this.assert(Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], [2,3,1]));
      this.assert(Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], [3,1,2]));
      this.assert(Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], [3,2,1]));
      
      this.assert(!Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], [1,1,1]));
      this.assert(!Test.Unit.Assertions._isEnumEqualUnordered([4,5,6], [1,2,3]));
      
      this.assert(!Test.Unit.Assertions._isEnumEqualUnordered([1,2,3], ['1',2,3]));
    },
    
    testAssertObjectIdentical: function() {
      this.assertRespondsTo('assertObjectIdentical', this);
      
      // Array objects
      this.assert(Test.Unit.Assertions._isIdenticalRecursive([1,2,3], [1,2,3]));
      this.assert(!Test.Unit.Assertions._isIdenticalRecursive([1,2,3], [3,2,1]));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive([], []));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(
        [false, false, true, false, true], 
        [false, false, true, false, true]
      ));
      
      // Object objects
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(
        { x: 1, y: 2 }, 
        { x: 1, y: 2 }
      ));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(
        { foo: true, bar: 12, baz: [12, 13, 14], qux: { x: null, y: 'boo' } },
        { foo: true, bar: 12, baz: [12, 13, 14], qux: { x: null, y: 'boo' } }
      ));
      
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(function(){}, function(){}));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(
        { x: undefined, y: null, z: NaN },
        { x: undefined, y: null, z: NaN }
      ));
      
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(
        { level1: { level2: { level3: { level4: { level5: 'boo' } }}, x: 1.1234 }},
        { level1: { level2: { level3: { level4: { level5: 'boo' } }}, x: 1.1234 }}
      ));
      
      this.assert(!Test.Unit.Assertions._isIdenticalRecursive({ x: 1 }, { }));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive({ }, { }));
      
      // primitives 
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(5, 5));
      this.assert(!Test.Unit.Assertions._isIdenticalRecursive(5, '5'));
      
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(NaN, NaN));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive('x', 'x'));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(false, false));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(null, null));
      this.assert(Test.Unit.Assertions._isIdenticalRecursive(undefined, undefined));
      
    }
  });
}