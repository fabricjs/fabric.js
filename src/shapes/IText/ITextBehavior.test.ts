import { IText } from './IText';

function matchTextStateSnapshot(text: IText) {
  const {
    styleManager,
    _text: t,
    _textLines: lines,
    __charBounds: charBounds,
  } = text;

  expect({
    styles: styleManager.slice(),
    text: t,
    lines,
    charBounds,
  }).toMatchSnapshot();
  expect(styleManager.slice()).toHaveLength(t.length);
  text.includeDefaultValues = false;
  expect(text.toObject()).toMatchSnapshot();
}

describe('text imperative changes', () => {
  it('removeChars', () => {
    const iText = new IText('test', {
      fontSize: 25,
      styles: [
        { fill: 'red' },
        { fill: 'yellow' },
        { fill: 'blue' },
        { fill: 'green' },
      ],
    });
    iText.removeChars(1, 3);
    expect(iText.text).toBe('tt');
    matchTextStateSnapshot(iText);
  });

  it('insertChars', () => {
    const iText = new IText('test', {
      fontSize: 25,
      styles: [
        { fill: 'red' },
        { fill: 'yellow' },
        { fill: 'blue' },
        { fill: 'green' },
      ],
    });
    iText.insertChars('ab', undefined, 1);
    expect(iText.text).toBe('tabest');
    matchTextStateSnapshot(iText);
  });

  it('insertChars and removes chars', () => {
    const iText = new IText('test', {
      fontSize: 25,
      styles: [
        { fill: 'red' },
        { fill: 'yellow' },
        { fill: 'blue' },
        { fill: 'green' },
      ],
    });
    iText.insertChars('ab', undefined, 1, 2);
    expect(iText.text).toBe('tabst');
    matchTextStateSnapshot(iText);
  });

  it('insertChars and removes chars', () => {
    const iText = new IText('test', {
      fontSize: 25,
      styles: [
        { fill: 'red' },
        { fill: 'yellow' },
        { fill: 'blue' },
        { fill: 'green' },
      ],
    });
    iText.insertChars('ab', undefined, 1, 4);
    expect(iText.text).toBe('tab');
    matchTextStateSnapshot(iText);
  });

  it('insertChars handles new lines correctly', () => {
    const iText = new IText('test', {
      fontSize: 25,
      styles: [
        { fill: 'red' },
        { fill: 'yellow' },
        { fill: 'blue' },
        { fill: 'green' },
      ],
    });
    iText.insertChars('ab\n\n', undefined, 1);
    matchTextStateSnapshot(iText);
  });

  it('insertChars can accept some style for the new text', () => {
    const iText = new IText('test', {
      fontSize: 25,
      styles: [
        { fill: 'red' },
        { fill: 'yellow' },
        { fill: 'blue' },
        { fill: 'green' },
      ],
    });
    iText.insertChars(
      'ab\n\na',
      [
        { fill: 'col1' },
        { fill: 'col2' },
        { fill: 'col3' },
        { fill: 'col4' },
        { fill: 'col5' },
      ],
      1
    );
    matchTextStateSnapshot(iText);
  });

  it('missingNewlineOffset', () => {
    const iText = new IText(
      '由石墨\n分裂的石墨分\n裂\n由石墨分裂由石墨分裂的石\n墨分裂'
    );

    expect(iText.missingNewlineOffset(0)).toBe(1);
  });
});
