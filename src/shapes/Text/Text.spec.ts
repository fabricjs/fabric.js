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
});
