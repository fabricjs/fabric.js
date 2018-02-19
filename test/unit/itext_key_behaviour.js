(function(){
  var canvas = fabric.document.createElement('canvas'),
      ctx = canvas.getContext('2d');

  QUnit.test('event selection:changed firing', function(assert) {
    var iText = new fabric.IText('test neei some word\nsecond line'),
        selection = 0;
    iText.ctx = ctx;
    function countSelectionChange() {
      selection++;
    }

    iText.on('selection:changed', countSelectionChange);

    iText.enterEditing();
    assert.equal(selection, 1, 'will fire on enter edit since the cursor is changing for the first time');
    selection = 0;

    iText.selectAll();
    assert.equal(selection, 1, 'should fire once on selectAll');
    assert.equal(iText.selectionStart, 0, 'should start from 0');
    assert.equal(iText.selectionEnd, 31, 'should end at end of text');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectWord();
    assert.equal(selection, 1, 'should fire once on selectWord');
    assert.equal(iText.selectionStart, 0, 'should start at word start');
    assert.equal(iText.selectionEnd, 4, 'should end at word end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectLine();
    assert.equal(selection, 1, 'should fire once on selectLine');
    assert.equal(iText.selectionStart, 0, 'should start at line start');
    assert.equal(iText.selectionEnd, 19, 'should end at line end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorLeft({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorLeft');
    assert.equal(iText.selectionStart, 1, 'should be 1 less than 2');
    assert.equal(iText.selectionEnd, 1, 'should be 1 less than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorRight({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorRight');
    assert.equal(iText.selectionStart, 3, 'should be 1 more than 2');
    assert.equal(iText.selectionEnd, 3, 'should be 1 more than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorDown({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorDown');
    assert.equal(iText.selectionStart, 22, 'should be on second line');
    assert.equal(iText.selectionEnd, 22, 'should be on second line');
    iText.moveCursorDown({ shiftKey: false});
    assert.equal(selection, 2, 'should fire once on moveCursorDown');
    assert.equal(iText.selectionStart, 31, 'should be at end of text');
    assert.equal(iText.selectionEnd, 31, 'should be at end of text');
    selection = 0;

    iText.selectionStart = 22;
    iText.selectionEnd = 22;
    iText.moveCursorUp({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorUp');
    assert.equal(iText.selectionStart, 2, 'should be back to first line');
    assert.equal(iText.selectionEnd, 2, 'should be back on first line');
    iText.moveCursorUp({ shiftKey: false});
    assert.equal(selection, 2, 'should fire once on moveCursorUp');
    assert.equal(iText.selectionStart, 0, 'should be back to first line');
    assert.equal(iText.selectionEnd, 0, 'should be back on first line');
    selection = 0;

    iText.selectionStart = 0;
    iText.selectionEnd = 0;
    iText.moveCursorLeft({ shiftKey: false});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 0, 'should not move');
    assert.equal(iText.selectionEnd, 0, 'should not move');
    iText.moveCursorUp({ shiftKey: false});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 0, 'should not move');
    assert.equal(iText.selectionEnd, 0, 'should not move');
    selection = 0;

    iText.selectionStart = 31;
    iText.selectionEnd = 31;
    iText.moveCursorRight({ shiftKey: false});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 31, 'should not move');
    assert.equal(iText.selectionEnd, 31, 'should not move');
    iText.moveCursorDown({ shiftKey: false});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 31, 'should not move');
    assert.equal(iText.selectionEnd, 31, 'should not move');
    selection = 0;

    iText.selectionStart = 28;
    iText.selectionEnd = 31;
    iText.moveCursorUp({ shiftKey: false });
    assert.equal(selection, 1, 'should fire');
    assert.equal(iText.selectionStart, 9, 'should move to upper line start');
    assert.equal(iText.selectionEnd, 9, 'should move to upper line end');
    selection = 0;

    iText.selectionStart = 1;
    iText.selectionEnd = 4;
    iText.moveCursorDown({ shiftKey: false });
    assert.equal(selection, 1, 'should fire');
    assert.equal(iText.selectionStart, 24, 'should move to down line');
    assert.equal(iText.selectionEnd, 24, 'should move to down line');
    selection = 0;

    iText.selectionStart = 28;
    iText.selectionEnd = 31;
    iText.moveCursorLeft({ shiftKey: false });
    assert.equal(selection, 1, 'should fire');
    assert.equal(iText.selectionStart, 28, 'should move to selection Start');
    assert.equal(iText.selectionEnd, 28, 'should move to selection Start');
    selection = 0;
    // needed or test hangs
    iText.abortCursorAnimation();
    // TODO verify and dp
    // iText.selectionStart = 0;
    // iText.selectionEnd = 0;
    // iText.insertChars('hello');
    // assert.equal(selection, 1, 'should fire once on insert multiple chars');
    // assert.equal(iText.selectionStart, 5, 'should be at end of text inserted');
    // assert.equal(iText.selectionEnd, 5, 'should be at end of text inserted');
  });

  QUnit.test('moving cursor with shift', function(assert) {
    var iText = new fabric.IText('test need some word\nsecond line'),
        selection = 0;
    iText.ctx = ctx;
    function countSelectionChange() {
      selection++;
    }

    iText.on('selection:changed', countSelectionChange);

    iText.enterEditing();
    assert.equal(selection, 1, 'should fire on enter edit');
    selection = 0;

    iText.selectAll();
    assert.equal(selection, 1, 'should fire once on selectAll');
    assert.equal(iText.selectionStart, 0, 'should start from 0');
    assert.equal(iText.selectionEnd, 31, 'should end at end of text');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectWord();
    assert.equal(selection, 1, 'should fire once on selectWord');
    assert.equal(iText.selectionStart, 0, 'should start at word start');
    assert.equal(iText.selectionEnd, 4, 'should end at word end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectLine();
    assert.equal(selection, 1, 'should fire once on selectLine');
    assert.equal(iText.selectionStart, 0, 'should start at line start');
    assert.equal(iText.selectionEnd, 19, 'should end at line end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorLeft({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorLeft');
    assert.equal(iText.selectionStart, 1, 'should be 1 less than 2');
    assert.equal(iText.selectionEnd, 1, 'should be 1 less than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorRight({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorRight');
    assert.equal(iText.selectionStart, 3, 'should be 1 more than 2');
    assert.equal(iText.selectionEnd, 3, 'should be 1 more than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorDown({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorDown');
    assert.equal(iText.selectionStart, 22, 'should be on second line');
    assert.equal(iText.selectionEnd, 22, 'should be on second line');
    iText.moveCursorDown({ shiftKey: false});
    assert.equal(selection, 2, 'should fire once on moveCursorDown');
    assert.equal(iText.selectionStart, 31, 'should be at end of text');
    assert.equal(iText.selectionEnd, 31, 'should be at end of text');
    selection = 0;

    iText.selectionStart = 22;
    iText.selectionEnd = 22;
    iText.moveCursorUp({ shiftKey: false});
    assert.equal(selection, 1, 'should fire once on moveCursorUp');
    assert.equal(iText.selectionStart, 2, 'should be back to first line');
    assert.equal(iText.selectionEnd, 2, 'should be back on first line');
    iText.moveCursorUp({ shiftKey: false});
    assert.equal(selection, 2, 'should fire once on moveCursorUp');
    assert.equal(iText.selectionStart, 0, 'should be back to first line');
    assert.equal(iText.selectionEnd, 0, 'should be back on first line');
    selection = 0;

    iText.selectionStart = 0;
    iText.selectionEnd = 1;
    iText._selectionDirection = 'left';
    iText.moveCursorLeft({ shiftKey: true});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 0, 'should not move');
    assert.equal(iText.selectionEnd, 1, 'should not move');
    iText.moveCursorUp({ shiftKey: true});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 0, 'should not move');
    assert.equal(iText.selectionEnd, 1, 'should not move');
    selection = 0;


    iText.selectionStart = 30;
    iText.selectionEnd = 31;
    iText._selectionDirection = 'right';
    iText.moveCursorRight({ shiftKey: true});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 30, 'should not move');
    assert.equal(iText.selectionEnd, 31, 'should not move');
    iText.moveCursorDown({ shiftKey: true});
    assert.equal(selection, 0, 'should not fire with no change');
    assert.equal(iText.selectionStart, 30, 'should not move');
    assert.equal(iText.selectionEnd, 31, 'should not move');
    selection = 0;
    // needed or test hangs
    iText.abortCursorAnimation();
  });
  // QUnit.test('copy and paste', function(assert) {
  //   var event = { stopPropagation: function(){}, preventDefault: function(){} };
  //   var iText = new fabric.IText('test', { styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
  //   iText.enterEditing();
  //   iText.selectionStart = 0;
  //   iText.selectionEnd = 2;
  //   iText.hiddenTextarea.selectionStart = 0
  //   iText.hiddenTextarea.selectionEnd = 2
  //   iText.copy(event);
  //   assert.equal(fabric.copiedText, 'te', 'it copied first 2 characters');
  //   assert.equal(fabric.copiedTextStyle[0], iText.styles[0][0], 'style is referenced');
  //   assert.equal(fabric.copiedTextStyle[1], iText.styles[0][1], 'style is referenced');
  //   iText.selectionStart = 2;
  //   iText.selectionEnd = 2;
  //   iText.hiddenTextarea.value = 'tetest';
  //   iText.paste(event);
  //   assert.equal(iText.text, 'tetest', 'text has been copied');
  //   assert.notEqual(iText.styles[0][0], iText.styles[0][2], 'style is not referenced');
  //   assert.notEqual(iText.styles[0][1], iText.styles[0][3], 'style is not referenced');
  //   assert.deepEqual(iText.styles[0][0], iText.styles[0][2], 'style is copied');
  //   assert.deepEqual(iText.styles[0][1], iText.styles[0][3], 'style is copied');
  // });
  QUnit.test('copy', function(assert) {
    var event = { stopPropagation: function(){}, preventDefault: function(){} };
    var iText = new fabric.IText('test', { fontSize: 25, styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
    iText.selectionStart = 0;
    iText.selectionEnd = 2;
    iText.copy(event);
    assert.equal(fabric.copiedText, 'te', 'it copied first 2 characters');
    assert.equal(fabric.copiedTextStyle[0].fill, iText.styles[0][0].fill, 'style is cloned');
    assert.equal(fabric.copiedTextStyle[1].fill, iText.styles[0][1].fill, 'style is referenced');
    assert.equal(iText.styles[0][1].fontSize, undefined, 'style had not fontSize');
    assert.equal(fabric.copiedTextStyle[1].fontSize, 25, 'style took fontSize from text element');
  });

  QUnit.test('removeChars', function(assert) {
    var iText = new fabric.IText('test', { fontSize: 25, styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
    assert.ok(typeof iText.removeChars === 'function');
    iText.removeChars(1,3);
    assert.equal(iText.text, 'tt', 'text has been remoed');
    assert.deepEqual(iText._text, ['t','t'], 'text has been remoed');
    assert.equal(iText.styles[0][1], undefined, 'style has been removed');
  });

  QUnit.test('insertChars', function(assert) {
    var iText = new fabric.IText('test');
    assert.ok(typeof iText.insertChars === 'function');
    iText.insertChars('ab', null, 1);
    assert.equal(iText.text, 'tabest', 'text has been added');
    assert.deepEqual(iText._text.join(''), 'tabest', '_text has been updated');
  });

  QUnit.test('insertChars can remove chars', function(assert) {
    var iText = new fabric.IText('test');
    iText.insertChars('ab', null, 1, 2);
    assert.equal(iText.text, 'tabst', 'text has added');
    assert.deepEqual(iText._text.join(''), 'tabst', '_text has been updated');
    var iText = new fabric.IText('test');
    iText.insertChars('ab', null, 1, 4);
    assert.equal(iText.text, 'tab', 'text has added');
    assert.deepEqual(iText._text.join(''), 'tab', '_text has been updated');
  });

  QUnit.test('insertChars pick up the style of the character behind and replicates it', function(assert) {
    var iText = new fabric.IText('test', { fontSize: 25, styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
    iText.insertChars('ab', null, 1);
    assert.equal(iText.styles[0][0].fill, 'red', 'style 0 0 did not change');
    assert.equal(iText.styles[0][1].fill, 'red', 'style 0 1 has been inserted red');
    assert.equal(iText.styles[0][2].fill, 'red', 'style 0 2 has been inserted red');
    assert.equal(iText.styles[0][3].fill, 'blue', 'style 0 3 was the old blue moved 2 char later');
  });

  QUnit.test('insertChars removes style from the removed text', function(assert) {
    var iText = new fabric.IText('test', { fontSize: 25, styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
    iText.insertChars('ab', null, 1, 2);
    assert.equal(iText.styles[0][0].fill, 'red', 'style 0 0 did not change');
    assert.equal(iText.styles[0][1].fill, 'red', 'style 0 1 has been inserted red');
    assert.equal(iText.styles[0][2].fill, 'red', 'style 0 2 has been inserted red');
    assert.equal(iText.styles[0][3], undefined, 'style 0 3 has been removed');
  });

  QUnit.test('insertChars handles new lines correctly', function(assert) {
    var iText = new fabric.IText('test', { fontSize: 25, styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
    iText.insertChars('ab\n\n', null, 1);
    assert.equal(iText.styles[0][0].fill, 'red', 'style 0 0 did not change');
    assert.equal(iText.styles[0][1].fill, 'red', 'style 0 1 has been inserted red');
    assert.equal(iText.styles[0][2].fill, 'red', 'style 0 2 has been inserted red');
    assert.equal(iText.styles[2][0].fill, 'blue', 'blue has been moved down');
  });

  QUnit.test('insertChars can accept some style for the new text', function(assert) {
    var iText = new fabric.IText('test', { fontSize: 25, styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
    iText.insertChars('ab\n\na', [{ fill: 'col1'},{ fill: 'col2'},{ fill: 'col3'},{ fill: 'col4'},{ fill: 'col5'}], 1);
    assert.equal(iText.styles[0][0].fill, 'red', 'style 0 0 did not change');
    assert.equal(iText.styles[0][1].fill, 'col1', 'style 0 1 has been inserted col1');
    assert.equal(iText.styles[0][2].fill, 'col2', 'style 0 2 has been inserted col2');
    assert.equal(iText.styles[1][0].fill, 'col4', 'style 1 0 has been inserted col4');
    assert.equal(iText.styles[2][0].fill, 'col5', 'style 2 0 has been inserted col5');
    assert.equal(iText.styles[2][1].fill, 'blue', 'style 2 1 has been inserted blue');
  });
})();
