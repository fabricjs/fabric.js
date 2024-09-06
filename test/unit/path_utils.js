(function() {


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
