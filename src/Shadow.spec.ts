import '../jest.extend';
import { Shadow } from './Shadow';

describe('Shadow', () => {
  it('fromObject', async () => {
    const shadow = await Shadow.fromObject({ color: 'red', offsetX: 10 });
    expect(shadow).toMatchObjectSnapshot();
    expect(shadow).toMatchObjectSnapshot({ includeDefaultValues: false });
  });

  it('fromObject is a promise', async () => {
    const promise = Shadow.fromObject({});
    expect(promise.then).toBeDefined();
  });
});
