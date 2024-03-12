import { cleanupSvgAttribute } from './cleanupSvgAttribute';

describe('cleanupSvgAttribute', () => {
  it('add space around a single number', () => {
    const cleaned = cleanupSvgAttribute('1');
    expect(cleaned).toBe(' 1 ');
  });
  it('replace multiple spaces with a single one', () => {
    const cleaned = cleanupSvgAttribute('     1    ');
    expect(cleaned).toBe(' 1 ');
  });
  it('replace commas with spaces or commas and multiple spaces with a single space', () => {
    const cleaned = cleanupSvgAttribute('1,2 , 4');
    expect(cleaned).toBe(' 1 2 4 ');
  });
});
