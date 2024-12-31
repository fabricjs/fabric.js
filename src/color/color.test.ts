import { Color } from './Color';

describe('Color regex and conversion tests', () => {
  it('test color constructor', () => {
    const color1 = new Color();
    const color2 = new Color(color1);
    expect(color1.getSource().toString()).toBe([0, 0, 0, 1].toString());
    expect(color2.getSource().toString()).toBe([0, 0, 0, 1].toString());
  });

  it('test static functions for Color class', () => {
    expect(Color.fromRgb('rgb(255,0,0)').getSource().toString()).toBe(
      [255, 0, 0, 1].toString(),
    );
    expect(Color.fromHsl('hsl(-20, 50.5%, 50%)').getSource().toString()).toBe(
      '192,63,106,1',
    );
    expect(Color.fromHex('FF0000').getSource().toString()).toBe('255,0,0,1');
  });

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

  it('test setAlpha & getAlpha for colors', () => {
    const color1 = new Color('red');
    expect(color1.getSource().toString()).toBe([255, 0, 0, 1].toString());
    color1.toGrayscale();
    expect(color1.getSource().toString()).toBe([77, 77, 77, 1].toString());
  });

  it('test toGrayscale for colors', () => {
    const color1 = new Color('red');
    expect(color1.getAlpha()).toBe(1);
    color1.setAlpha(0.5);
    expect(color1.getAlpha()).toBe(0.5);
  });

  it('test overlayWith for colors', () => {
    const color1 = new Color('red');
    expect(color1.getSource().toString()).toBe([255, 0, 0, 1].toString());
    expect(color1.overlayWith(color1).getSource().toString()).toBe(
      [255, 0, 0, 1].toString(),
    );
    expect(color1.overlayWith('green').getSource().toString()).toBe(
      '128,64,0,1',
    );
  });

  it('test toBlackWhite for colors', () => {
    const color1 = new Color('red');
    expect(color1.getSource().toString()).toBe([255, 0, 0, 1].toString());
    color1.toBlackWhite(1);
    expect(color1.getSource().toString()).toBe([255, 255, 255, 1].toString());
    // @ts-expect-error
    color1.toBlackWhite();
    expect(color1.getSource().toString()).toBe([255, 255, 255, 1].toString());
  });

  it('Create colors through keywords', () => {
    const color1 = new Color('red');
    const color2 = new Color('RED');
    const red = 'rgb(255,0,0)';
    const RgbaRed = 'rgba(255,0,0,1)';
    const hslRed = 'hsl(0,100%,50%)';
    const hslaRed = 'hsla(0,100%,50%,1)';
    const hexRed = 'FF0000';
    const hexaRed = 'FF0000FF';

    expect(color1.toRgb()).toBe(red);
    expect(color2.toRgb()).toBe(red);
    expect(color2.toRgba()).toBe(RgbaRed);
    expect(color1.toRgba()).toBe(RgbaRed);
    expect(color2.toHsl()).toBe(hslRed);
    expect(color1.toHsl()).toBe(hslRed);
    expect(color2.toHsla()).toBe(hslaRed);
    expect(color1.toHsla()).toBe(hslaRed);
    expect(color2.toHex()).toBe(hexRed);
    expect(color1.toHex()).toBe(hexRed);
    expect(color2.toHexa()).toBe(hexaRed);
    expect(color1.toHexa()).toBe(hexaRed);
    expect(color2.getAlpha()).toBe(1);
    expect(color1.getAlpha()).toBe(1);
  });
});
