import { Color } from './Color';

describe('Color regex and conversion tests', () => {
  it('Converts a hsl color to rgba', () => {
    const color1 = new Color('hsl(120, 100%, 50%)');
    expect(color1.getSource().toString()).toBe([0, 255, 0, 1].toString());
  });

  it('Converts a hsl color with minuses and decimals to rgba', () => {
    const color1 = new Color('hsl(-20, 50.5%, 50%)');
    expect(color1.getSource().toString()).toBe([192, 63, 106, 1].toString());
  });

  it('Converts a hsla color with minuses and decimals to rgba', () => {
    const color1 = new Color('hsla(-20, 50.5%, 50%, 0.4)');
    expect(color1.getSource().toString()).toBe([192, 63, 106, 0.4].toString());
  });

  it('Converts a hsla color with minuses and decimals and a % alpha to rgba', () => {
    const color1 = new Color('hsla(-20, 50.5%, 50%, 25%)');
    expect(color1.getSource().toString()).toBe([192, 63, 106, 0.25].toString());
  });

  it('Converts a hsla color with angle deg to rgba', () => {
    const color1 = new Color('hsl(120deg,100%,50%)');
    expect(color1.getSource().toString()).toBe([0, 255, 0, 1].toString());
  });

  it('Converts a hsla color with angle rad to rgba', () => {
    const color1 = new Color('hsl(2.0rad, 60%, 60%)');
    expect(color1.getSource().toString()).toBe([103, 214, 92, 1].toString());
  });

  it('Converts a hsla color with angle turn to rgba', () => {
    const color1 = new Color('hsl(0.5turn , 100%, 50%)');
    expect(color1.getSource().toString()).toBe([0, 255, 255, 1].toString());
  });

  it('Creates a color from rgba with decimals', () => {
    const color1 = new Color('rgba(120.1, 60.2, 30.3, 0.5)');
    expect(color1.getSource().toString()).toBe(
      [120.1, 60.2, 30.3, 0.5].toString(),
    );
  });

  it('Creates a color from rgb with decimals', () => {
    const color1 = new Color('rgb(120.1, 60.2, 30.3)');
    expect(color1.getSource().toString()).toBe(
      [120.1, 60.2, 30.3, 1].toString(),
    );
  });

  it('Create an unrecognised color', () => {
    const color1 = new Color('not a color');
    expect(color1.isUnrecognised).toBe(true);
    expect(color1.getSource().toString()).toBe([0, 0, 0, 1].toString());
  });
});
