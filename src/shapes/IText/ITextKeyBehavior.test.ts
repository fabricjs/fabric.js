/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getFabricWindow } from '../../env';
import { IText } from './IText';

const keybEventShiftFalse = { shiftKey: false } as KeyboardEvent;
const keybEventShiftTrue = { shiftKey: true } as KeyboardEvent;

describe('IText move cursor', () => {
  describe('selection changes', () => {
    let iText: IText, selection: number;
    const _tickMock = jest.fn();
    beforeEach(() => {
      _tickMock.mockClear();
      iText = new IText('test need some word\nsecond line');
      iText._tick = _tickMock;
      iText.on('selection:changed', () => selection++);
      selection = 0;
    });
    afterEach(() => {
      iText.dispose();
    });
    test('enterEditing', () => {
      iText.enterEditing();
      // enter editing will set the cursor and set selection to 1
      expect(selection).toEqual(1);
      expect(_tickMock).toBeCalledWith();
    });
    test('enterEditing and onInput', () => {
      iText.enterEditing();
      expect(iText.text.includes('__UNIQUE_TEXT_')).toBe(false);
      const event = new (getFabricWindow().InputEvent)('input', {
        inputType: 'insertText',
        data: '__UNIQUE_TEXT_',
        composed: true,
      });
      // manually crafted events have `isTrusted` as false so they won't interact with the html element
      iText.hiddenTextarea!.value = `__UNIQUE_TEXT_${
        iText.hiddenTextarea!.value
      }`;
      iText.hiddenTextarea!.dispatchEvent(event);
      expect(iText.text.includes('__UNIQUE_TEXT_')).toBe(true);
    });
    test('updateFromTextArea calls setDimensions', () => {
      iText.enterEditing();
      expect(iText.width).toBeLessThan(400); // 'iText is less than 400px'
      iText.hiddenTextarea!.value = `more more more more text ${
        iText.hiddenTextarea!.value
      }`;
      iText.updateFromTextArea();
      expect(iText.width).toBeGreaterThan(700); // 'iText is now more than 700px'
      expect(_tickMock).toBeCalledWith(); // restart curso animation
    });
    test('selectAll', () => {
      iText.selectAll();
      expect(selection).toEqual(1); // 'should fire once on selectAll';
      expect(iText.selectionStart).toEqual(0); // 'should start from 0';
      expect(iText.selectionEnd).toEqual(31); // 'should end at end of text';
      expect(_tickMock).not.toBeCalled(); // no cursor animation changes
    });
    test('selectWord', () => {
      iText.selectionStart = 2;
      iText.selectionEnd = 2;
      iText.selectWord();
      expect(selection).toEqual(1); // 'should fire once on selectWord
      expect(iText.selectionStart).toEqual(0); // ' 'should start at word start');
      expect(iText.selectionEnd).toEqual(4); // ' 'should end at word end');
      expect(_tickMock).not.toBeCalled(); // no cursor animation changes
    });
    test('selectLine', () => {
      iText.selectionStart = 2;
      iText.selectionEnd = 2;
      iText.selectLine();
      expect(selection).toEqual(1); // 'should fire once on selectLine');
      expect(iText.selectionStart).toEqual(0); // 'should start at line start');
      expect(iText.selectionEnd).toEqual(19); // 'should end at line end');
      expect(_tickMock).not.toBeCalled(); // no cursor animation changes
    });
    test('moveCursorLeft', () => {
      iText.selectionStart = 2;
      iText.selectionEnd = 2;
      iText.moveCursorLeft(keybEventShiftFalse);
      expect(selection).toEqual(1); //  'should fire once on moveCursorLeft');
      expect(iText.selectionStart).toEqual(1); //  'should be 1 less than 2');
      expect(iText.selectionEnd).toEqual(1); //  'should be 1 less than 2');
      expect(_tickMock).toBeCalledWith(1000); // moving cursor with keyboard restart cursor animation
    });
    test('moveCursorRight', () => {
      iText.selectionStart = 2;
      iText.selectionEnd = 2;
      iText.moveCursorRight(keybEventShiftFalse);
      expect(selection).toEqual(1); //  'should fire once on moveCursorLeft');
      expect(iText.selectionStart).toEqual(3); //  'should be 1 more than 2');
      expect(iText.selectionEnd).toEqual(3); //  'should be 1 more than 2');
      expect(_tickMock).toBeCalledWith(1000); // moving cursor with keyboard restart cursor animation
    });
    test('moveCursorDown', () => {
      iText.selectionStart = 2;
      iText.selectionEnd = 2;
      iText.moveCursorDown(keybEventShiftFalse);
      expect(selection).toEqual(1); // 'should fire once on moveCursorDown');
      expect(iText.selectionStart).toEqual(22); // 'should be on second line');
      expect(iText.selectionEnd).toEqual(22); // 'should be on second line');
      expect(_tickMock).toBeCalledWith(1000);
      _tickMock.mockClear();
      iText.moveCursorDown(keybEventShiftFalse);
      expect(selection).toEqual(2); // 'should fire once on moveCursorDown');
      expect(iText.selectionStart).toEqual(31); // 'should be at end of text');
      expect(iText.selectionEnd).toEqual(31); // 'should be at end of text');
      expect(_tickMock).toBeCalledWith(1000);
    });

    test('moveCursorUp', () => {
      iText.selectionStart = 22;
      iText.selectionEnd = 22;
      iText.moveCursorUp(keybEventShiftFalse);
      expect(selection).toEqual(1); // should fire once on moveCursorUp');
      expect(iText.selectionStart).toEqual(2); // should be back to first line');
      expect(iText.selectionEnd).toEqual(2); // should be back on first line');
      expect(_tickMock).toBeCalledWith(1000);
      _tickMock.mockClear();
      iText.moveCursorUp(keybEventShiftFalse);
      expect(selection).toEqual(2); // should fire once on moveCursorUp');
      expect(iText.selectionStart).toEqual(0); // should be back to first line');
      expect(iText.selectionEnd).toEqual(0); // should be back on first line');
      expect(_tickMock).toBeCalledWith(1000);
    });

    test('moveCursorLeft or up with no change', () => {
      iText.selectionStart = 0;
      iText.selectionEnd = 0;
      iText.moveCursorLeft(keybEventShiftFalse);
      expect(selection).toEqual(0); // should not fire with no change');
      expect(iText.selectionStart).toEqual(0); // should not move');
      expect(iText.selectionEnd).toEqual(0); // should not move');
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorUp(keybEventShiftFalse);
      expect(selection).toEqual(0); // should not fire with no change');
      expect(iText.selectionStart).toEqual(0); // should not move');
      expect(iText.selectionEnd).toEqual(0); // should not move');
      expect(_tickMock).not.toBeCalled();
    });

    test('moveCursorRight or down with not change', () => {
      iText.selectionStart = 31;
      iText.selectionEnd = 31;
      iText.moveCursorRight(keybEventShiftFalse);
      expect(selection).toEqual(0); // should not fire with no change');
      expect(iText.selectionStart).toEqual(31); // should not move');
      expect(iText.selectionEnd).toEqual(31); // should not move');
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorDown(keybEventShiftFalse);
      expect(selection).toEqual(0); // should not fire with no change');
      expect(iText.selectionStart).toEqual(31); // should not move');
      expect(iText.selectionEnd).toEqual(31); // should not move');
      expect(_tickMock).not.toBeCalled();
    });

    test('moveCursorUp from multi selection to cursor selection', () => {
      iText.selectionStart = 28;
      iText.selectionEnd = 31;
      iText.moveCursorUp(keybEventShiftFalse);
      expect(selection).toEqual(1); // should fire');
      expect(iText.selectionStart).toEqual(9); // should move to upper line start');
      expect(iText.selectionEnd).toEqual(9); // should move to upper line end');
      expect(_tickMock).toBeCalledWith(1000);
    });

    test('moveCursorDown from multi selection to cursor selection', () => {
      iText.selectionStart = 1;
      iText.selectionEnd = 4;
      iText.moveCursorDown(keybEventShiftFalse);
      expect(selection).toEqual(1); // should fire');
      expect(iText.selectionStart).toEqual(24); // should move to down line');
      expect(iText.selectionEnd).toEqual(24); // should move to down line');
      expect(_tickMock).toBeCalledWith(1000);
    });

    test('moveCursorRight from multi selection to cursor selection', () => {
      iText.selectionStart = 1;
      iText.selectionEnd = 4;
      iText.moveCursorRight(keybEventShiftFalse);
      expect(selection).toEqual(1); // should fire');
      expect(iText.selectionStart).toEqual(4); // should move to right by 1');
      expect(iText.selectionEnd).toEqual(4); // should move to right by 1');
      expect(_tickMock).toBeCalledWith(1000);
    });

    test('moveCursorLeft from multi selection to cursor selection', () => {
      iText.selectionStart = 28;
      iText.selectionEnd = 31;
      iText.moveCursorLeft(keybEventShiftFalse);
      expect(selection).toEqual(1); // should fire');
      expect(iText.selectionStart).toEqual(28); // should move to selection Start');
      expect(iText.selectionEnd).toEqual(28); // should move to selection Start');
      expect(_tickMock).toBeCalledWith(1000);
    });

    test('moveCursor at start with shift', () => {
      iText.selectionStart = 1;
      iText.selectionEnd = 1;
      iText.moveCursorLeft(keybEventShiftTrue);
      expect(selection).toEqual(1);
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorLeft(keybEventShiftTrue); // do it again
      expect(selection).toEqual(1); // should not fire with no change');
      expect(iText.selectionStart).toEqual(0); // should not move');
      expect(iText.selectionEnd).toEqual(1); // should not move');
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorUp(keybEventShiftTrue);
      expect(selection).toEqual(1); // should not fire with no change');
      expect(iText.selectionStart).toEqual(0); // should not move');
      expect(iText.selectionEnd).toEqual(1); // should not move');
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorRight(keybEventShiftTrue);
      expect(selection).toEqual(2); // this time it changes back to single selection;
      expect(iText.selectionStart).toEqual(1); // should not move');
      expect(iText.selectionEnd).toEqual(1); // should not move');
      expect(_tickMock).toBeCalledWith(1000);
    });

    test('moveCursor at end with shift', () => {
      iText.selectionStart = 30;
      iText.selectionEnd = 30;
      iText.moveCursorRight(keybEventShiftTrue);
      expect(selection).toEqual(1);
      expect(iText.selectionStart).toEqual(30); // multi selection now;
      expect(iText.selectionEnd).toEqual(31); // multi selection now;
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorRight(keybEventShiftTrue);
      expect(selection).toEqual(1); // should fire with no change
      expect(iText.selectionStart).toEqual(30); // should not move');
      expect(iText.selectionEnd).toEqual(31); // should not move');
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorDown(keybEventShiftTrue);
      expect(selection).toEqual(1); // should fire with no change
      expect(iText.selectionStart).toEqual(30); // should not move');
      expect(iText.selectionEnd).toEqual(31); // should not move');
      expect(_tickMock).not.toBeCalled();
      iText.moveCursorLeft(keybEventShiftTrue);
      expect(selection).toEqual(2); // now it changed back to 2
      expect(iText.selectionStart).toEqual(30); // should not move');
      expect(iText.selectionEnd).toEqual(30); // should not move');
      expect(_tickMock).toBeCalledWith(1000);
    });
  });
});

// // TODO verify and dp
// // iText.selectionStart = 0;
// // iText.selectionEnd = 0;
// // iText.insertChars('hello');
// // expect(selection, 1); // should fire once on insert multiple chars');
// // expect(iText.selectionStart, 5); // should be at end of text inserted');
// // expect(iText.selectionEnd, 5); // should be at end of text inserted');

// test('mousedown calls key maps', () => {
//   const event = {
//     stopPropagation: function () {},
//     stopImmediatePropagation: function () {},
//     preventDefault: function () {},
//     ctrlKey: false,
//     keyCode: 0,
//   };
//   class TestIText extends fabric.IText {}
//   ['default'); // rtl'); // ctrl'].forEach((x) => {
//     TestIText.prototype[`__test_${x}`] = () => fired.push(x);
//   });
//   const iText = new TestIText('test', {
//     fontSize: 25,
//     styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' } } },
//   });
//   iText.isEditing = true;
//   const fired = [];
//   iText.keysMap = { 0: `__test_default` };
//   iText.keysMapRtl = { 0: `__test_rtl` };
//   iText.ctrlKeysMapDown = { 1: `__test_ctrl` };
//   iText.onKeyDown(event);
//   assert.deepEqual(fired, ['default']);
//   iText.direction = 'rtl';
//   iText.onKeyDown(event);
//   assert.deepEqual(fired, ['default'); // rtl']);
//   iText.onKeyDown({ ...event, ctrlKey: true, keyCode: 1 });
//   assert.deepEqual(fired, ['default'); // rtl'); // ctrl']);
// });

// // test('copy and paste', function(assert) {
// //   var event = { stopPropagation: function(){}, preventDefault: function(){} };
// //   var iText = new fabric.IText('test', { styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' }}}});
// //   iText.enterEditing();
// //   iText.selectionStart = 0;
// //   iText.selectionEnd = 2;
// //   iText.hiddenTextarea.selectionStart = 0
// //   iText.hiddenTextarea.selectionEnd = 2
// //   iText.copy(event);
// //   expect(fabric.copiedText); // te'); // it copied first 2 characters');
// //   expect(fabric.copiedTextStyle[0], iText.styles[0][0]); // style is referenced');
// //   expect(fabric.copiedTextStyle[1], iText.styles[0][1]); // style is referenced');
// //   iText.selectionStart = 2;
// //   iText.selectionEnd = 2;
// //   iText.hiddenTextarea.value = 'tetest';
// //   iText.paste(event);
// //   expect(iText.text); // tetest'); // text has been copied');
// //   assert.notEqual(iText.styles[0][0], iText.styles[0][2]); // style is not referenced');
// //   assert.notEqual(iText.styles[0][1], iText.styles[0][3]); // style is not referenced');
// //   assert.deepEqual(iText.styles[0][0], iText.styles[0][2]); // style is copied');
// //   assert.deepEqual(iText.styles[0][1], iText.styles[0][3]); // style is copied');
// // });
// test('copy', () => {
//   var event = {
//     stopPropagation: function () {},
//     preventDefault: function () {},
//   };
//   const { copyPasteData } = fabric.getEnv();
//   var iText = new fabric.IText('test', {
//     fontSize: 25,
//     styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' } } },
//   });
//   iText.selectionStart = 0;
//   iText.selectionEnd = 2;
//   iText.copy(event);
//   expect(copyPasteData.copiedText); // te'); // it copied first 2 characters');
//   expect(
//     copyPasteData.copiedTextStyle[0].fill,
//     iText.styles[0][0].fill,
//     'style is cloned'
//   );
//   expect(
//     copyPasteData.copiedTextStyle[1].fill,
//     iText.styles[0][1].fill,
//     'style is referenced'
//   );
//   expect(
//     iText.styles[0][1].fontSize,
//     undefined,
//     'style had not fontSize'
//   );
//   expect(
//     copyPasteData.copiedTextStyle[1].fontSize,
//     25,
//     'style took fontSize from text element'
//   );
// });

// test('copy with fabric.config.disableStyleCopyPaste', () => {
//   var event = {
//     stopPropagation: function () {},
//     preventDefault: function () {},
//   };
//   const { copyPasteData } = fabric.getEnv();
//   var iText = new fabric.IText('test', {
//     fontSize: 25,
//     styles: { 0: { 0: { fill: 'red' }, 1: { fill: 'blue' } } },
//   });
//   iText.selectionStart = 0;
//   iText.selectionEnd = 2;
//   fabric.config.configure({ disableStyleCopyPaste: true });
//   iText.copy(event);
//   expect(copyPasteData.copiedText); // te'); // it copied first 2 characters');
//   expect(copyPasteData.copiedTextStyle, null); // style is not cloned');
//   fabric.config.configure({ disableStyleCopyPaste: false });
// });
