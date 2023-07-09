import { cache } from '../../cache';
import { config } from '../../config';
import { Text } from './Text';

afterEach(() => {
  config.restoreDefaults();
});

describe('Text', () => {
  it('toObject', async () => {
    expect(new Text('text').toObject()).toMatchSnapshot();
  });
  it('fromObject', async () => {
    expect((await Text.fromObject({ text: 'text' })).toObject()).toEqual(
      new Text('text').toObject()
    );
  });

  describe('measuring, splitting', () => {
    it('measuring', () => {
      cache.clearFontCache();
      const zwc = '\u200b';
      const text = new Text('');
      const style = text.styleManager.get({ offset: 0, complete: true });
      expect(text._measureChar('a', style, zwc, style)).toMatchSnapshot();
      expect(text._measureChar('a', style, zwc, style)).toEqual(
        text._measureChar('a', style, zwc, style)
      );
    });

    it('splits into lines', () => {
      const text = new Text('test foo bar-baz\nqux');
      expect(text._splitTextIntoLines(text.text)).toMatchSnapshot();
    });
  });

  it('toSVG with NUM_FRACTION_DIGITS', () => {
    const text = new Text('test foo bar-baz', {
      styles: [
        {
          fill: 'red',
        },
        {
          fill: 'blue',
        },
        {
          fill: 'green',
        },
        {
          fill: 'yellow',
        },
        {
          fill: 'pink',
        },
      ],
    });
    config.configure({ NUM_FRACTION_DIGITS: 1 });
    expect(text.toSVG()).toMatchSnapshot();
    config.configure({ NUM_FRACTION_DIGITS: 3 });
    expect(text.toSVG()).toMatchSnapshot();
  });

  it('subscript/superscript', () => {
    const text = new Text('xxxxxx', {
      styles: [
        { stroke: 'black', fill: 'blue' },
        { fill: 'blue' },
        { fontSize: 4, deltaY: 20 },
        { stroke: 'black', fill: 'blue' },
        { fill: 'blue' },
        { fontSize: 4, deltaY: 20 },
      ],
    });
    text.setSuperscript(1, 2);
    text.setSuperscript(2, 3);
    text.setSubscript(3, 4);
    text.setSubscript(4, 5);
    expect(text.toObject().styles).toMatchSnapshot();
  });
});
