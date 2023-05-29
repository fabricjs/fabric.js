// for JEST, add back this specific test
// QUnit.test('fabric.util.makeElementUnselectable', function (assert) {
//   var makeElementUnselectable = fabric.util.makeElementUnselectable;

//   assert.ok(typeof makeElementUnselectable === 'function');

//   var el = fabric.getFabricDocument().createElement('p');
//   el.appendChild(fabric.getFabricDocument().createTextNode('foo'));

//   assert.equal(el, makeElementUnselectable(el), 'should be "chainable"');

//   if (typeof el.onselectstart !== 'undefined') {
//     assert.equal(el.onselectstart.toString(), (() => false).toString());
//   }

//   // not sure if it's a good idea to test implementation details here
//   // functional test would probably make more sense
//   if (typeof el.unselectable === 'string') {
//     assert.equal('on', el.unselectable);
//   } else if (typeof el.userSelect !== 'undefined') {
//     assert.equal('none', el.userSelect);
//   }
// });
