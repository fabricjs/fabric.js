import { toBlob, createCanvasElement } from './dom';

describe('DOM utils', () => {
  it('toBlob without format', async () => {
    const canvas = createCanvasElement();
    const blob = await toBlob(canvas);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toEqual('image/png');
  });
  it('toBlob png', async () => {
    const canvas = createCanvasElement();
    const blob = await toBlob(canvas, 'png');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toEqual('image/png');
  });
  it('toBlob jpeg', async () => {
    const canvas = createCanvasElement();
    const blob = await toBlob(canvas, 'jpeg');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toEqual('image/jpeg');
  });
});
