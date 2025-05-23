import { roundSnapshotOptions } from '../../../vitest.extend';
import { IText } from './IText';
import { describe, expect, it, beforeEach, afterEach, test, vi } from 'vitest';

import { ValueAnimation } from '../../util/animation/ValueAnimation';

export function matchTextStateSnapshot(text: IText) {
  const {
    styles,
    _text: t,
    _textLines: lines,
    __charBounds: charBounds,
  } = text;

  expect({
    styles,
    text: t,
    lines,
    charBounds,
  }).toMatchSnapshot(roundSnapshotOptions);
  expect(text).toMatchObjectSnapshot({ includeDefaultValues: false });
}

function create() {
  return IText.fromObject<any, IText>({
    text: 'test',
    fontSize: 25,
    styles: [
      { fill: 'red' },
      { fill: 'yellow' },
      { fill: 'blue' },
      { fill: 'green' },
    ].map((style, index) => ({ style, start: index, end: index + 1 })),
  });
}

describe('text imperative changes', () => {
  it('removeChars', async () => {
    const iText = await create();
    iText.removeChars(1, 3);
    expect(iText.text).toBe('tt');
    matchTextStateSnapshot(iText);
  });

  it('insertChars', async (context) => {
    context.skip(
      !!context.task.file.projectName?.includes('firefox'),
      'Firefox delivers different snapshot',
    );

    const iText = await create();
    iText.insertChars('ab', undefined, 1);
    expect(iText.text).toBe('tabest');
    matchTextStateSnapshot(iText);
  });

  it('insertChars and removes chars', async (context) => {
    context.skip(
      !!context.task.file.projectName?.includes('firefox'),
      'Firefox delivers different snapshot',
    );

    const iText = await create();
    iText.insertChars('ab', undefined, 1, 2);
    expect(iText.text).toBe('tabst');
    matchTextStateSnapshot(iText);
  });

  it('insertChars and removes chars', async (context) => {
    context.skip(
      !!context.task.file.projectName?.includes('firefox'),
      'Firefox delivers different snapshot',
    );

    const iText = await create();
    iText.insertChars('ab', undefined, 1, 4);
    expect(iText.text).toBe('tab');
    matchTextStateSnapshot(iText);
  });

  it('insertChars handles new lines correctly', async (context) => {
    context.skip(
      !!context.task.file.projectName?.includes('firefox'),
      'Firefox delivers different snapshot',
    );

    const iText = await create();
    iText.insertChars('ab\n\n', undefined, 1);
    matchTextStateSnapshot(iText);
  });

  it('insertChars can accept some style for the new text', async (context) => {
    context.skip(
      !!context.task.file.projectName?.includes('firefox'),
      'Firefox delivers different snapshot',
    );

    const iText = await create();
    iText.insertChars(
      'ab\n\na',
      [
        { fill: 'col1' },
        { fill: 'col2' },
        { fill: 'col3' },
        { fill: 'col4' },
        { fill: 'col5' },
      ],
      1,
    );
    matchTextStateSnapshot(iText);
  });

  it('missingNewlineOffset', () => {
    const iText = new IText(
      '由石墨\n分裂的石墨分\n裂\n由石墨分裂由石墨分裂的石\n墨分裂',
    );

    expect(iText.missingNewlineOffset(0)).toBe(1);
  });
});

describe('IText cursor animation snapshot', () => {
  let currentAnimation: string[] = [];
  const origCalculate = ValueAnimation.prototype.calculate;

  beforeEach(() => {
    vi.spyOn(ValueAnimation.prototype, 'calculate').mockImplementation(
      function (timeElapsed: number) {
        const value = origCalculate.call(this, timeElapsed);
        currentAnimation.push(value.value.toFixed(3));
        return value;
      },
    );
    vi.useFakeTimers();
    vi.runAllTimers();
    currentAnimation = [];
  });

  afterEach(() => {
    ValueAnimation.prototype.calculate = origCalculate;
    vi.resetAllMocks();
    vi.useRealTimers();
  });
  test('initDelayedCursor false - with delay', () => {
    const iText = new IText('', { canvas: {} });
    iText.initDelayedCursor();
    vi.advanceTimersByTime(2000);
    expect(currentAnimation).toMatchSnapshot();
    iText.abortCursorAnimation();
  });
  test('initDelayedCursor true - with NO delay', () => {
    const iText = new IText('', { canvas: {} });
    iText.initDelayedCursor(true);
    vi.advanceTimersByTime(2000);
    expect(currentAnimation).toMatchSnapshot();
    iText.abortCursorAnimation();
  });
  test('selectionStart/selection end will abort animation', () => {
    const iText = new IText('asd', { canvas: {} });
    iText.initDelayedCursor(true);
    vi.advanceTimersByTime(160);
    iText.selectionStart = 0;
    iText.selectionEnd = 3;
    vi.advanceTimersByTime(2000);
    expect(currentAnimation).toMatchSnapshot();
    iText.abortCursorAnimation();
  });
  test('exiting from a canvas will abort animation', () => {
    const iText = new IText('asd', { canvas: {} });
    iText.initDelayedCursor(true);
    vi.advanceTimersByTime(160);
    iText.canvas = undefined;
    vi.advanceTimersByTime(2000);
    expect(currentAnimation).toMatchSnapshot();
    iText.abortCursorAnimation();
  });
  test('Animation is configurable - fast cursor with delay', () => {
    const iText = new IText('', { canvas: {} });
    iText.cursorDelay = 200;
    iText.cursorDuration = 80;
    iText.initDelayedCursor();
    vi.advanceTimersByTime(1000);
    expect(currentAnimation).toMatchSnapshot();
    iText.abortCursorAnimation();
  });
  test('Animation is configurable - fast cursor with no delay', () => {
    const iText = new IText('', { canvas: {} });
    iText.cursorDelay = 200;
    iText.cursorDuration = 80;
    iText.initDelayedCursor(true);
    vi.advanceTimersByTime(1000);
    expect(currentAnimation).toMatchSnapshot();
    iText.abortCursorAnimation();
  });
});

describe('IText _tick', () => {
  const _tickMock = vi.fn();
  beforeEach(() => {
    _tickMock.mockClear();
  });
  test('enter Editing will call _tick', () => {
    const iText = new IText('hello\nhello');
    vi.spyOn(iText, '_tick').mockImplementation(_tickMock);
    iText.enterEditing();
    expect(_tickMock).toHaveBeenCalledWith();
  });
  test('mouse up will fire an animation restart with 0 delay if is a click', () => {
    const iText = new IText('hello\nhello');
    vi.spyOn(iText, '_tick').mockImplementation(_tickMock);
    iText.enterEditing();
    expect(_tickMock).toHaveBeenCalledWith();
    _tickMock.mockClear();
    iText.selected = true;
    iText.mouseUpHandler({
      e: {
        button: 0,
      },
    });
    expect(_tickMock).toHaveBeenCalledWith(0);
  });
});

describe('Itext enterEditing and exitEditing', () => {
  const enterMock = vi.fn();
  const exitMock = vi.fn();

  afterEach(() => {
    enterMock.mockClear();
    exitMock.mockClear();
  });

  test('Entering and leaving edit triggers the listener', () => {
    const iText = new IText('some word');
    iText.on('editing:entered', enterMock);
    iText.on('editing:exited', exitMock);
    iText.enterEditing();
    expect(enterMock).toHaveBeenCalledTimes(1);
    iText.exitEditing();
    expect(exitMock).toHaveBeenCalledTimes(1);
  });
  test('Entering and leaving edit does not trigger the listener', () => {
    const iText = new IText('some word');
    iText.on('editing:entered', enterMock);
    iText.on('editing:exited', exitMock);
    iText.enterEditingImpl();
    expect(enterMock).toHaveBeenCalledTimes(0);
    iText.exitEditingImpl();
    expect(exitMock).toHaveBeenCalledTimes(0);
  });
});
