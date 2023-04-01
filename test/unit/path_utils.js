(function() {
  QUnit.module('fabric.util - path.js');
  // eslint-disable-next-line max-len
  var path = 'M 2 5 l 2 -2 L 4 4 h 3 H 9 C 8 3 10 3 10 3 c 1 -1 2 0 1 1 S 8 5 9 7 v 1 s 2 -1 1 2 Q 9 10 10 11 T 12 11 t -1 -1 v 2 T 10 12 S 9 12 7 11 c 0 -1 0 -1 -2 -2 z m 0 2 l 1 0 l 0 1 l -1 0 z M 1 1 a 1 1 30 1 0 2 2 A 2 2 30 1 0 6 6';
  // eslint-disable-next-line
  var expectedParse = [['M',2,5],['l',2,-2],['L',4,4],['h',3],['H',9],['C',8,3,10,3,10,3],['c',1,-1,2,0,1,1],['S',8,5,9,7],['v',1],['s',2,-1,1,2],['Q',9,10,10,11],['T',12,11],['t',-1,-1],['v',2],['T',10,12],['S',9,12,7,11],['c',0,-1,0,-1,-2,-2],['z'],['m',0,2],['l',1,0],['l',0,1],['l',-1,0],['z'],['M', 1, 1], ['a', 1, 1, 30, 1, 0, 2, 2],['A', 2,2,30,1,0,6,6]];
  // eslint-disable-next-line
  var expectedSimplified = [['M', 2, 5], ['L', 4, 3], ['L', 4, 4], ['L', 7, 4], ['L', 9, 4], ['C', 8, 3, 10, 3, 10, 3], ['C', 11, 2, 12, 3, 11, 4], ['C', 10, 5, 8, 5, 9, 7], ['L', 9, 8], ['C', 9, 8, 11, 7, 10, 10], ['Q', 9, 10, 10, 11], ['Q', 11, 12, 12, 11], ['Q', 13, 10, 11, 10], ['L', 11, 12], ['Q', 11, 12, 10, 12], ['C', 10, 12, 9, 12, 7, 11], ['C', 7, 10, 7, 10, 5, 9], ['Z'], ['M', 2, 7], ['L', 3, 7], ['L', 3, 8], ['L', 2, 8], ['Z'], ['M', 1, 1], ['C', 1.5522847498307932, 0.4477152501692063, 2.4477152501692068, 0.44771525016920666, 3, 1], ['C', 3.5522847498307932, 1.5522847498307937, 3.5522847498307932, 2.4477152501692063, 3, 3], ['C', 3.82842712474619, 2.1715728752538093, 5.17157287525381, 2.1715728752538097, 6, 3], ['C', 6.82842712474619, 3.82842712474619, 6.828427124746191, 5.17157287525381, 6, 6]];
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
  QUnit.test('fabric.util.parsePath can parse arcs correctly when no spaces between flags', function(assert) {
    // eslint-disable-next-line max-len
    var pathWithWeirdArc = 'a10.56 10.56 0 00-1.484-.133';
    var expected = ['a', 10.56, 10.56, 0, 0, 0, -1.484, -0.133];
    var parsed = fabric.util.parsePath(pathWithWeirdArc);
    var command = parsed[0];
    assert.deepEqual(command, expected, 'Arc should be parsed correctly.');
  });
  QUnit.test('fabric.util.getPathSegmentsInfo', function(assert) {
    assert.ok(typeof fabric.util.getPathSegmentsInfo === 'function');
    var parsed = fabric.util.makePathSimpler(fabric.util.parsePath(path));
    var infos = fabric.util.getPathSegmentsInfo(parsed);
    assert.equal(infos[0].length, 0, 'the command 0 a M has a length 0');
    assert.equal(infos[1].length.toFixed(5), 2.82843, 'the command 1 a L has a length 2.828');
    assert.equal(infos[2].length, 1, 'the command 2 a L with one step on Y has a length 1');
    assert.equal(infos[3].length, 3, 'the command 3 a L with 3 step on X has a length 3');
    assert.equal(infos[4].length, 2, 'the command 4 a L with 2 step on X has a length 0');
    assert.equal(infos[5].length.toFixed(5), 2.06242, 'the command 5 a C has a approximated length of 2.062');
    assert.equal(infos[6].length.toFixed(5), 2.82832, 'the command 6 a C has a approximated length of 2.828');
    assert.equal(infos[7].length.toFixed(5), 4.18970, 'the command 7 a C has a approximated length of 4.189');
    assert.equal(infos[8].length, 1, 'the command 8 a L with 1 step on the Y has an exact length of 1');
    assert.equal(infos[9].length.toFixed(5), 3.22727, 'the command 9 a C has a approximated length of 3.227');
    assert.equal(infos[10].length.toFixed(5), 1.54026, 'the command 10 a Q has a approximated length of 1.540');
    assert.equal(infos[11].length.toFixed(5), 2.29556, 'the command 11 a Q has a approximated length of 2.295');
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

  QUnit.test('fabric.util.getRegularPolygonPath', function (assert) {

    const roundDecimals = (commands) => commands.map(([cmd, x, y]) => {
      if (cmd !== 'Z') {
        return [cmd, x.toFixed(4), y.toFixed(4)];
      }
      return ['Z'];
    })

    assert.ok(typeof fabric.util.getRegularPolygonPath === 'function');
    var penta = fabric.util.getRegularPolygonPath(5, 50);
    var hexa = fabric.util.getRegularPolygonPath(6, 50);

    var expetedPenta = [
      ["M", 3.061616997868383e-15, -50],
      ["L", 47.552825814757675, -15.450849718747369],
      ["L", 29.389262614623657, 40.45084971874737],
      ["L", -29.38926261462365, 40.45084971874737],
      ["L", -47.55282581475768, -15.450849718747364],
      ["Z"]
    ];

    var expetedHexa = [
      ["M", 24.999999999999993, -43.30127018922194],
      ["L", 50, -1.1102230246251565e-14],
      ["L", 25.000000000000018, 43.301270189221924],
      ["L", -24.99999999999999, 43.30127018922194],
      ["L", -50, 2.8327694488239898e-14],
      ["L", -25.00000000000006, -43.301270189221896],
      ["Z"]
    ];

    assert.deepEqual(roundDecimals(penta), roundDecimals(expetedPenta), 'regular pentagon should match');
    assert.deepEqual(roundDecimals(hexa), roundDecimals(expetedHexa), 'regular hexagon should match');
  });

  QUnit.test('fabric.util.joinPath', function (assert) {
    const pathData = [
      ["M", 3.12345678, 2.12345678],
      ["L", 1.00001111, 2.40001111],
      ["Z"],
    ];
    const digit = 2;
    const expected = "M 3.12 2.12 L 1 2.4 Z";
    const result = fabric.util.joinPath(pathData, digit);
    assert.equal(result, expected, 'path data should have the specified number or less of fraction digits.');
  });
  
  QUnit.test('fabric.util.joinPath without rounding', function (assert) {
    const pathData = [
      ["M", 3.12345678, 2.12345678],
      ["L", 1.00001111, 2.40001111],
      ["Z"],
    ];
    const expected = "M 3.12345678 2.12345678 L 1.00001111 2.40001111 Z";
    const result = fabric.util.joinPath(pathData);
    assert.equal(result, expected, 'path data should have the specified number or less of fraction digits.');
  });
})();
