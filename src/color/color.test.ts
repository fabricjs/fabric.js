import { Color } from './Color';

import { describe, expect, it, test } from 'vitest';

describe('Color regex and conversion tests', () => {
  it('test color constructor', () => {
    const color1 = new Color();
    const color2 = new Color(color1);
    const color3 = new Color('ff5555');
    const color4 = new Color('rgb(100,100,100)');
    const color5 = new Color('rgba(100,100,100, 0.5)');
    const color6 = new Color('hsl(262,80%,12%)');
    // empty args
    const color7 = new Color();
    // toHexa rounds
    const color8 = new Color([211.23213213, 0, 128.1233123131]);
    // transparent
    const color9 = new Color('transparent');

    expect(color1.getSource().toString()).toBe([0, 0, 0, 1].toString());
    expect(color2.getSource().toString()).toBe([0, 0, 0, 1].toString());

    expect(color3.toHex()).toBe('FF5555');
    expect(color3 instanceof Color).toBe(true);

    expect(color4.toRgb()).toBe('rgb(100,100,100)');
    expect(color4 instanceof Color).toBe(true);

    expect(color5.toRgba()).toBe('rgba(100,100,100,0.5)');
    expect(color5 instanceof Color).toBe(true);

    expect(color6.toHsl()).toBe('hsl(262,80%,12%)');
    expect(color6 instanceof Color).toBe(true);

    expect(color7.toHex()).toBe('000000');
    expect(color7 instanceof Color).toBe(true);

    expect(color8.toHexa()).toBe('D30080FF');

    expect(color9.getSource()).toEqual([255, 255, 255, 0]);
  });

  it('test getSource & setSource for color', () => {
    const color = new Color('ffffff');
    expect(typeof color.getSource).toBe('function');
    expect(color.getSource()).toEqual([255, 255, 255, 1]);

    expect(typeof color.setSource).toBe('function');
    color.setSource([0, 0, 0, 1]);
    expect(color.getSource()).toEqual([0, 0, 0, 1]);
  });

  it('test sourceFromRgb for color', () => {
    expect(typeof Color.sourceFromRgb).toBe('function');
    expect(Color.sourceFromRgb('rgb(255,255,255)')).toEqual([255, 255, 255, 1]);
    expect(Color.sourceFromRgb('rgb(100,150,200)')).toEqual([100, 150, 200, 1]);
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

  it('test toGrayscale for colors', () => {
    const color1 = new Color('red');
    const color2 = new Color('ff5555');
    expect(color1.getSource().toString()).toBe([255, 0, 0, 1].toString());
    color1.toGrayscale();
    expect(color1.getSource().toString()).toBe([77, 77, 77, 1].toString());
    color2.toGrayscale();
    expect(color2.toHex()).toBe('888888');
  });

  it('test setAlpha & getAlpha  for colors', () => {
    const color1 = new Color('red');
    expect(color1.getAlpha()).toBe(1);
    color1.setAlpha(0.5);
    expect(color1.getAlpha()).toBe(0.5);

    const color2 = new Color('ffffffcc');
    expect(color2.getAlpha()).toBe(0.8);
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
    const color2 = new Color('333333');
    expect(color1.getSource().toString()).toBe([255, 0, 0, 1].toString());
    color1.toBlackWhite(1);
    expect(color1.getSource().toString()).toBe([255, 255, 255, 1].toString());
    // @ts-expect-error
    color1.toBlackWhite();
    expect(color1.getSource().toString()).toBe([255, 255, 255, 1].toString());
    // @ts-expect-error
    color2.toBlackWhite();
    expect(color2.toHex()).toBe('000000');
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

describe('test Color.fromHsla for color', () => {
  test.each([
    {
      name: 'fromHsl',
      stringToParse: 'hsl(262,80%,12%)',
      expectedSource: [24, 6, 55, 1],
    },
    {
      name: 'fromHsl (with whitespaces)',
      stringToParse: 'hsl( 262 , 80% , 12% )',
      expectedSource: [24, 6, 55, 1],
    },
    {
      name: 'fromHsla',
      stringToParse: 'hsla(108,50%,50%,0.7)',
      expectedSource: [89, 191, 64, 0.7],
    },
    {
      name: 'fromHsla (with whitespaces)',
      stringToParse: 'hsla(  108  ,50%  , 50%    ,.2)',
      expectedSource: [89, 191, 64, 0.2],
    },
    {
      name: 'fromHsla no commas(with whitespaces)',
      stringToParse: 'hsl( 108  50%   50%  / .5)',
      expectedSource: [89, 191, 64, 0.5],
    },
    {
      name: 'fromHsla with very counterClockwise value)',
      stringToParse: 'hsl( -450,  50%,   50%, .5)',
      expectedSource: [127, 64, 191, 0.5],
    },
    {
      name: 'fromHsla with Saturation 0',
      stringToParse: 'hsla(0, 0%, 50%, 1)',
      expectedSource: [128, 128, 128, 1],
    },
  ])('$name', ({ stringToParse, expectedSource }) => {
    const color = Color.fromHsla(stringToParse);
    expect(color).toBeTruthy();
    expect(color).toBeInstanceOf(Color);
    expect(color.getSource()).toEqual(expectedSource);

    const colorUppercase = Color.fromHsla(stringToParse.toUpperCase());
    expect(colorUppercase).toBeTruthy();
    expect(colorUppercase).toBeInstanceOf(Color);
    expect(colorUppercase.getSource()).toEqual(expectedSource);
  });
});

describe('parsing colors for color', () => {
  test.each([
    {
      name: 'fromRgb',
      stringToParse: 'rgb(255,255,255)',
      expectedSource: [255, 255, 255, 1],
    },
    {
      name: 'fromRgb no commas',
      stringToParse: 'rgb(255 0 255)',
      expectedSource: [255, 0, 255, 1],
    },
    {
      name: 'fromRgb (with whitespaces)',
      stringToParse: 'rgb( 255 , 128 , 64 )',
      expectedSource: [255, 128, 64, 1],
    },
    {
      name: 'fromRgb no commas (with whitespaces)',
      stringToParse: 'rgb( 255    128 64 )',
      expectedSource: [255, 128, 64, 1],
    },
    {
      name: 'fromRgb (percentage values)',
      stringToParse: 'rgb(100%,50%,25%)',
      expectedSource: [255, 127, 64, 1],
    },
    {
      name: 'fromRgb (percentage values with whitespaces)',
      stringToParse: 'rgb(100% ,   50% ,  25%)',
      expectedSource: [255, 127, 64, 1],
    },
    {
      name: 'fromRgba',
      stringToParse: 'rgba(255,12,10,0.5)',
      expectedSource: [255, 12, 10, 0.5],
    },
    {
      name: 'fromRgba without commas',
      stringToParse: 'rgba(255 12 10 / 0.5)',
      expectedSource: [255, 12, 10, 0.5],
    },
    {
      name: 'fromRgba (with spaces and missing 0)',
      stringToParse: 'rgba( 255 , 12 , 10 , .3 )',
      expectedSource: [255, 12, 10, 0.3],
    },
    {
      name: 'fromRgba (with whitespaces)',
      stringToParse: 'rgba( 255 , 33 , 44 , 0.6 )',
      expectedSource: [255, 33, 44, 0.6],
    },
    {
      name: 'fromRgba (percentage values)',
      stringToParse: 'rgba(100%,50%,25%,33%)',
      expectedSource: [255, 127, 64, 0.33],
    },
    {
      name: 'fromRgba (percentage values)',
      stringToParse: 'rgba(  100.00%  ,50.40%,   25.1%   ,  33%  )',
      expectedSource: [255, 129, 64, 0.33],
    },
    {
      name: 'fromRgba (percentage values with whitespaces)',
      stringToParse: 'rgba(  100.00%  ,50.80%,   25.1%   ,  33%  )',
      expectedSource: [255, 130, 64, 0.33],
    },
    {
      name: 'fromRgba (percentage values with whitespaces no zeroes)',
      stringToParse: 'rgba(  .99%  ,50.40%,   25.1%   ,  .33  )',
      expectedSource: [3, 129, 64, 0.33],
    },
  ])('$name', ({ stringToParse, expectedSource }) => {
    const color = Color.fromRgba(stringToParse);
    expect(color).toBeTruthy();
    expect(color).toBeInstanceOf(Color);
    expect(color.getSource()).toEqual(expectedSource);

    const colorUppercase = Color.fromRgb(stringToParse.toUpperCase());
    expect(colorUppercase).toBeTruthy();
    expect(colorUppercase).toBeInstanceOf(Color);
    expect(colorUppercase.getSource()).toEqual(expectedSource);
  });
});
