import { cache } from '../../cache';
import { Text } from './Text';

describe('Text', () => {
  it('toObject', async () => {
    expect(new Text('text').toObject()).toMatchSnapshot();
  });
  it('fromObject', async () => {
    expect((await Text.fromObject({ text: 'text' })).toObject()).toEqual(
      new Text('text').toObject()
    );
  });

  describe('measuring', () => {
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
  });
});
