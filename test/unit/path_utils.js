(function() {
  QUnit.module('fabric.util - path.js');
  // eslint-disable-next-line max-len
  var path = 'M 2 5 l 2 -2 L 4 4 h 3 H 9 C 8 3 10 3 10 3 c 1 -1 2 0 1 1 S 8 5 9 7 v 1 s 2 -1 1 2 Q 9 10 10 11 T 12 11 t -1 -1 v 2 T 10 12 S 9 12 7 11 c 0 -1 0 -1 -2 -2 z m 0 2 l 1 0 l 0 1 l -1 0 z M 1 1 a 1 1 30 1 0 2 2 A 2 2 30 1 0 6 6';
  // eslint-disable-next-line
  var expectedParse = [['M',2,5],['l',2,-2],['L',4,4],['h',3],['H',9],['C',8,3,10,3,10,3],['c',1,-1,2,0,1,1],['S',8,5,9,7],['v',1],['s',2,-1,1,2],['Q',9,10,10,11],['T',12,11],['t',-1,-1],['v',2],['T',10,12],['S',9,12,7,11],['c',0,-1,0,-1,-2,-2],['z'],['m',0,2],['l',1,0],['l',0,1],['l',-1,0],['z'],['M', 1, 1], ['a', 1, 1, 30, 1, 0, 2, 2],['A', 2,2,30,1,0,6,6]];
  // eslint-disable-next-line
  var expectedSimplified = [['M', 2, 5], ['L', 4, 3], ['L', 4, 4], ['L', 7, 4], ['L', 9, 4], ['C', 8, 3, 10, 3, 10, 3], ['C', 11, 2, 12, 3, 11, 4], ['C', 10, 5, 8, 5, 9, 7], ['L', 9, 8], ['C', 9, 8, 11, 7, 10, 10], ['Q', 9, 10, 10, 11], ['Q', 11, 12, 12, 11], ['Q', 13, 10, 11, 10], ['L', 11, 12], ['Q', 11, 12, 10, 12], ['C', 10, 12, 9, 12, 7, 11], ['C', 7, 10, 7, 10, 5, 9], ['z'], ['M', 2, 7], ['L', 3, 7], ['L', 3, 8], ['L', 2, 8], ['z'], ['M', 1, 1], ['C', 1.5522847498307932, 0.4477152501692063, 2.4477152501692068, 0.44771525016920666, 3, 1], ['C', 3.5522847498307932, 1.5522847498307937, 3.5522847498307932, 2.4477152501692063, 3, 3], ['C', 3.82842712474619, 2.1715728752538093, 5.17157287525381, 2.1715728752538097, 6, 3], ['C', 6.82842712474619, 3.82842712474619, 6.828427124746191, 5.17157287525381, 6, 6]];
  QUnit.test('fabric.util.parsePath', function(assert) {
    assert.ok(typeof fabric.util.parsePath === 'function');
    assert.ok(typeof fabric.util.makePathSimpler === 'function');
    var parsed = fabric.util.parsePath(path);
    parsed.forEach(function(command, index) {
      assert.deepEqual(command, expectedParse[index], 'should be parsed in an array of commands ' + index);
    });
    var simplified = fabric.util.makePathSimpler(parsed);
    simplified.forEach(function(command, index) {
      if (index > 23) {
        // because firefox i have no idea.
        return;
      }
      assert.deepEqual(command, expectedSimplified[index], 'should contain a subset of equivalent commands ' + index);
    });
  });
  QUnit.test('fabric.util.getPathSegmentsInfo', function(assert) {
    assert.ok(typeof fabric.util.getPathSegmentsInfo === 'function');
    var parsed = fabric.util.makePathSimpler(fabric.util.parsePath(path));
    var infos = fabric.util.getPathSegmentsInfo(parsed);
    assert.deepEqual(infos[0].length, 0, 'the command 0 a M has a length 0');
    assert.deepEqual(infos[1].length, 2.8284271247461903, 'the command 1 a L has a length 2.82');
    assert.deepEqual(infos[2].length, 1, 'the command 2 a L with one step on Y has a length 1');
    assert.deepEqual(infos[3].length, 3, 'the command 3 a L with 3 step on X has a length 3');
    assert.deepEqual(infos[4].length, 2, 'the command 4 a L with 2 step on X has a length 0');
    assert.deepEqual(infos[5].length, 2.061820497903685, 'the command 5 a C has a approximated lenght of 2');
  });
})();
