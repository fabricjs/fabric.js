import { roundSnapshotOptions } from '../../../jest.extend';
import { IText } from './IText';

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

  it('insertChars', async () => {
    const iText = await create();
    iText.insertChars('ab', undefined, 1);
    expect(iText.text).toBe('tabest');
    matchTextStateSnapshot(iText);
  });

  it('insertChars and removes chars', async () => {
    const iText = await create();
    iText.insertChars('ab', undefined, 1, 2);
    expect(iText.text).toBe('tabst');
    matchTextStateSnapshot(iText);
  });

  it('insertChars and removes chars', async () => {
    const iText = await create();
    iText.insertChars('ab', undefined, 1, 4);
    expect(iText.text).toBe('tab');
    matchTextStateSnapshot(iText);
  });

  it('insertChars handles new lines correctly', async () => {
    const iText = await create();
    iText.insertChars('ab\n\n', undefined, 1);
    matchTextStateSnapshot(iText);
  });

  it('insertChars can accept some style for the new text', async () => {
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
