(function(){
  var canvas = fabric.document.createElement('canvas'),
      ctx = canvas.getContext('2d');

  test('event selection:changed firing', function() {
    var iText = new fabric.IText('test need some word\nsecond line'),
        selection = 0;
    iText.ctx = ctx;
    function countSelectionChange() {
      selection++;
    }

    iText.on('selection:changed', countSelectionChange);

    iText.enterEditing();
    equal(selection, 0, 'should not fire on enter edit');

    iText.selectAll();
    equal(selection, 1, 'should fire once on selectAll');
    equal(iText.selectionStart, 0, 'should start from 0');
    equal(iText.selectionEnd, 31, 'should end at end of text');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectWord();
    equal(selection, 1, 'should fire once on selectWord');
    equal(iText.selectionStart, 0, 'should start at word start');
    equal(iText.selectionEnd, 4, 'should end at word end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectLine();
    equal(selection, 1, 'should fire once on selectLine');
    equal(iText.selectionStart, 0, 'should start at line start');
    equal(iText.selectionEnd, 19, 'should end at line end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorLeft({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorLeft');
    equal(iText.selectionStart, 1, 'should be 1 less than 2');
    equal(iText.selectionEnd, 1, 'should be 1 less than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorRight({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorRight');
    equal(iText.selectionStart, 3, 'should be 1 more than 2');
    equal(iText.selectionEnd, 3, 'should be 1 more than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorDown({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorDown');
    equal(iText.selectionStart, 22, 'should be on second line');
    equal(iText.selectionEnd, 22, 'should be on second line');
    iText.moveCursorDown({ shiftKey: false});
    equal(selection, 2, 'should fire once on moveCursorDown');
    equal(iText.selectionStart, 31, 'should be at end of text');
    equal(iText.selectionEnd, 31, 'should be at end of text');
    selection = 0;

    iText.selectionStart = 22;
    iText.selectionEnd = 22;
    iText.moveCursorUp({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorUp');
    equal(iText.selectionStart, 2, 'should be back to first line');
    equal(iText.selectionEnd, 2, 'should be back on first line');
    iText.moveCursorUp({ shiftKey: false});
    equal(selection, 2, 'should fire once on moveCursorUp');
    equal(iText.selectionStart, 0, 'should be back to first line');
    equal(iText.selectionEnd, 0, 'should be back on first line');
    selection = 0;

    iText.selectionStart = 0;
    iText.selectionEnd = 0;
    iText.moveCursorLeft({ shiftKey: false});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 0, 'should not move');
    equal(iText.selectionEnd, 0, 'should not move');
    iText.moveCursorUp({ shiftKey: false});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 0, 'should not move');
    equal(iText.selectionEnd, 0, 'should not move');
    selection = 0;

    iText.selectionStart = 31;
    iText.selectionEnd = 31;
    iText.moveCursorRight({ shiftKey: false});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 31, 'should not move');
    equal(iText.selectionEnd, 31, 'should not move');
    iText.moveCursorDown({ shiftKey: false});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 31, 'should not move');
    equal(iText.selectionEnd, 31, 'should not move');
    selection = 0;

    iText.selectionStart = 28;
    iText.selectionEnd = 31;
    iText.moveCursorUp({ shiftKey: false});
    equal(selection, 1, 'should fire');
    equal(iText.selectionStart, 9, 'should move to upper line');
    equal(iText.selectionEnd, 9, 'should move to upper line');
    selection = 0;

    iText.selectionStart = 1;
    iText.selectionEnd = 4;
    iText.moveCursorDown({ shiftKey: false});
    equal(selection, 1, 'should fire');
    equal(iText.selectionStart, 24, 'should move to down line');
    equal(iText.selectionEnd, 24, 'should move to down line');
    selection = 0;

    iText.selectionStart = 28;
    iText.selectionEnd = 31;
    iText.moveCursorLeft({ shiftKey: false});
    equal(selection, 1, 'should fire');
    equal(iText.selectionStart, 28, 'should move to selection Start');
    equal(iText.selectionEnd, 28, 'should move to selection Start');
    selection = 0;

    iText.selectionStart = 0;
    iText.selectionEnd = 0;
    iText.insertChars('hello');
    equal(selection, 1, 'should fire once on insert multiple chars');
    equal(iText.selectionStart, 5, 'should be at end of text inserted');
    equal(iText.selectionEnd, 5, 'should be at end of text inserted');
  });

  test('moving cursor with shift', function() {
    var iText = new fabric.IText('test need some word\nsecond line'),
        selection = 0;
    iText.ctx = ctx;
    function countSelectionChange() {
      selection++;
    }

    iText.on('selection:changed', countSelectionChange);

    iText.enterEditing();
    equal(selection, 0, 'should not fire on enter edit');

    iText.selectAll();
    equal(selection, 1, 'should fire once on selectAll');
    equal(iText.selectionStart, 0, 'should start from 0');
    equal(iText.selectionEnd, 31, 'should end at end of text');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectWord();
    equal(selection, 1, 'should fire once on selectWord');
    equal(iText.selectionStart, 0, 'should start at word start');
    equal(iText.selectionEnd, 4, 'should end at word end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.selectLine();
    equal(selection, 1, 'should fire once on selectLine');
    equal(iText.selectionStart, 0, 'should start at line start');
    equal(iText.selectionEnd, 19, 'should end at line end');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorLeft({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorLeft');
    equal(iText.selectionStart, 1, 'should be 1 less than 2');
    equal(iText.selectionEnd, 1, 'should be 1 less than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorRight({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorRight');
    equal(iText.selectionStart, 3, 'should be 1 more than 2');
    equal(iText.selectionEnd, 3, 'should be 1 more than 2');
    selection = 0;

    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.moveCursorDown({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorDown');
    equal(iText.selectionStart, 22, 'should be on second line');
    equal(iText.selectionEnd, 22, 'should be on second line');
    iText.moveCursorDown({ shiftKey: false});
    equal(selection, 2, 'should fire once on moveCursorDown');
    equal(iText.selectionStart, 31, 'should be at end of text');
    equal(iText.selectionEnd, 31, 'should be at end of text');
    selection = 0;

    iText.selectionStart = 22;
    iText.selectionEnd = 22;
    iText.moveCursorUp({ shiftKey: false});
    equal(selection, 1, 'should fire once on moveCursorUp');
    equal(iText.selectionStart, 2, 'should be back to first line');
    equal(iText.selectionEnd, 2, 'should be back on first line');
    iText.moveCursorUp({ shiftKey: false});
    equal(selection, 2, 'should fire once on moveCursorUp');
    equal(iText.selectionStart, 0, 'should be back to first line');
    equal(iText.selectionEnd, 0, 'should be back on first line');
    selection = 0;

    iText.selectionStart = 0;
    iText.selectionEnd = 1;
    iText._selectionDirection = 'left';
    iText.moveCursorLeft({ shiftKey: true});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 0, 'should not move');
    equal(iText.selectionEnd, 1, 'should not move');
    iText.moveCursorUp({ shiftKey: true});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 0, 'should not move');
    equal(iText.selectionEnd, 1, 'should not move');
    selection = 0;


    iText.selectionStart = 30;
    iText.selectionEnd = 31;
    iText._selectionDirection = 'right';
    iText.moveCursorRight({ shiftKey: true});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 30, 'should not move');
    equal(iText.selectionEnd, 31, 'should not move');
    iText.moveCursorDown({ shiftKey: true});
    equal(selection, 0, 'should not fire with no change');
    equal(iText.selectionStart, 30, 'should not move');
    equal(iText.selectionEnd, 31, 'should not move');
    selection = 0;
  });

})();
