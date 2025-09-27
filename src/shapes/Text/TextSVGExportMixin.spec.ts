import { config } from '../../config';
import { FabricText } from './Text';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Rect } from '../Rect';

describe('TextSvgExport', () => {
  it('exports text background color correctly', () => {
    const myText = new FabricText('text', {
      backgroundColor: 'rgba(100, 0, 100)',
    });
    const svgString = myText.toSVG();
    expect(svgString.includes('fill="rgb(100,0,100)"')).toBe(true);
    expect(svgString.includes('fill-opacity="1"')).toBe(false);
  });

  it('exports text background color opacity correctly', () => {
    const myText = new FabricText('text', {
      backgroundColor: 'rgba(100, 0, 100, 0.5)',
    });
    const svgString = myText.toSVG();
    expect(svgString.includes('fill-opacity="0.5"')).toBe(true);
  });

  it('exports text svg styles correctly', () => {
    const myText = new FabricText('text', { fill: 'rgba(100, 0, 100, 0.5)' });
    const svgStyles = myText.getSvgStyles();
    expect(svgStyles.includes('fill: rgb(100,0,100); fill-opacity: 0.5;')).toBe(
      true,
    );
    expect(svgStyles.includes('stroke="none"')).toBe(false);
  });

  describe('toSVG', () => {
    beforeEach(() => {
      config.configure({ NUM_FRACTION_DIGITS: 2 });
    });

    afterEach(() => {
      config.restoreDefaults();
    });

    it('toSVG', () => {
      const text = new FabricText('x', { left: 10.5, top: 23.1 });
      expect(text.toSVG()).toMatchSVGSnapshot();
      text.set('fontFamily', 'Arial');
      expect(text.toSVG()).toMatchSVGSnapshot();
    });

    it('toSVG justified', () => {
      const text = new FabricText('xxxxxx\nx y', {
        textAlign: 'justify',
        left: 60.5,
        top: 49.32,
      });

      expect(text.toSVG()).toMatchSVGSnapshot();
    });

    it('toSVG with multiple spaces', () => {
      const text = new FabricText('x                 y', {
        left: 105.5,
        top: 23.1,
      });
      expect(text.toSVG()).toMatchSVGSnapshot();
    });

    it('toSVG with deltaY', () => {
      config.configure({ NUM_FRACTION_DIGITS: 0 });
      const text = new FabricText('xx', {
        left: 17,
        top: 23,
        styles: {
          0: {
            1: {
              deltaY: -14,
              fontSize: 24,
            },
          },
        },
      });
      expect(text.toSVG()).toMatchSVGSnapshot();
      config.configure({ NUM_FRACTION_DIGITS: 2 });
    });

    it('toSVG with font', () => {
      const text = new FabricText('xxxxxx\nx y', {
        textAlign: 'justify',
        left: 60.5,
        top: 49.32,
        styles: {
          0: {
            0: { fontFamily: 'Times New Roman' },
            1: { fontFamily: 'Times New Roman' },
            2: { fontFamily: 'Times New Roman' },
            3: { fontFamily: 'Times New Roman' },
            4: { fontFamily: 'Times New Roman' },
            5: { fontFamily: 'Times New Roman' },
          },
        },
      });
      expect(text.toSVG()).toMatchSVGSnapshot();
    });

    it('toSVG with font and origins', () => {
      const text = new FabricText('xxxxxx\nx y', {
        textAlign: 'justify',
        originX: 'left',
        originY: 'top',
        left: 60.5,
        top: 49.32,
        styles: {
          0: {
            0: { fontFamily: 'Times New Roman' },
            1: { fontFamily: 'Times New Roman' },
            2: { fontFamily: 'Times New Roman' },
            3: { fontFamily: 'Times New Roman' },
            4: { fontFamily: 'Times New Roman' },
            5: { fontFamily: 'Times New Roman' },
          },
        },
      });
      expect(text.toSVG()).toMatchSVGSnapshot();
    });

    it('toSVG with text as a clipPath', () => {
      config.configure({ NUM_FRACTION_DIGITS: 0 });
      const clipPath = new FabricText('text as clipPath');
      const rect = new Rect({ width: 200, height: 100, left: 100, top: 50 });
      rect.clipPath = clipPath;
      expect(rect.toSVG()).toMatchSVGSnapshot();
    });
  });
});
