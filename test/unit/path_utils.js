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
  QUnit.test('fabric.util.parsePath test special arcs', function(assert) {
    assert.ok(typeof fabric.util.parsePath === 'function');
    assert.ok(typeof fabric.util.makePathSimpler === 'function');
	// eslint-disable-next-line max-len
	var pathWithWeirdArc = 'p m19.801 17.771h1.457v-1.84c0-1.918.247-3.442.73-4.57.49-1.134 1.313-1.954 2.474-2.473 1.16-.512 2.75-.774 4.773-.774 3.578 0 5.367.875 5.367 2.629 0 .566-.187 1.055-.562 1.457-.371.406-.817.61-1.325.61-.238 0-.652-.047-1.234-.137a10.56 10.56 0 00-1.484-.133c-1.11 0-1.82.324-2.133.976-.316.653-.473 1.583-.473 2.797v1.457h1.504c2.336 0 3.504.707 3.504 2.114 0 1.004-.309 1.64-.93 1.91-.62.27-1.48.402-2.574.402h-1.504v16.238c0 1.215-.289 2.141-.863 2.778-.578.633-1.324.953-2.234.953-.871 0-1.594-.32-2.168-.953-.578-.637-.868-1.563-.868-2.778v-16.238h-1.683c-.914 0-1.617-.207-2.11-.613-.496-.414-.742-.95-.742-1.61 0-1.468 1.024-2.203 3.078-2.203'
    var parsed = fabric.util.parsePath(pathWithWeirdArc);
	var atLeastOneArc = false;
    parsed.forEach(function(command, index) {
      if (command.length > 1 && (command[0] === 'a' || command[0] === 'A')) {
        assert.deepEqual(command.length, 8, 'Arc in SVG should always have size 8 but had less. Did not parse correctly.');
		atLeastOneArc = true;
	  }
    });
	assert.ok(atLeastOneArc, 'No arcs found from SVG but at least one should have been parsed.');
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
    assert.deepEqual(infos[5].length, 2.061820497903685, 'the command 5 a C has a approximated lenght of 2.061');
    assert.deepEqual(infos[6].length, 2.786311794934689, 'the command 6 a C has a approximated lenght of 2.786');
    assert.deepEqual(infos[7].length, 4.123555017527272, 'the command 7 a C has a approximated lenght of 4.123');
    assert.deepEqual(infos[8].length, 1, 'the command 8 a L with 1 step on the Y has an exact lenght of 1');
    assert.deepEqual(infos[9].length, 3.1338167707969693, 'the command 9 a C has a approximated lenght of 3.183');
    assert.deepEqual(infos[10].length, 1.512191042774622, 'the command 10 a Q has a approximated lenght of 1.512');
    assert.deepEqual(infos[11].length, 2.2674203737413428, 'the command 11 a Q has a approximated lenght of 2.267');
  });

  QUnit.test('fabric.util.getPathSegmentsInfo test Z command', function(assert) {
    assert.ok(typeof fabric.util.getPathSegmentsInfo === 'function');
    var parsed = fabric.util.makePathSimpler(fabric.util.parsePath('M 0 0 h 20, v 20 L 0, 20 Z'));
    var infos = fabric.util.getPathSegmentsInfo(parsed);
    assert.deepEqual(infos[0].length, 0, 'the command 0 a M has a length 0');
    assert.deepEqual(infos[1].length, 20, 'the command 1 a L has length 20');
    assert.deepEqual(infos[2].length, 20, 'the command 2 a L has length 20');
    assert.deepEqual(infos[3].length, 20, 'the command 3 a L has length 20');
    assert.deepEqual(infos[4].length, 20, 'the command 4 a Z has length 20');
  });
})();
