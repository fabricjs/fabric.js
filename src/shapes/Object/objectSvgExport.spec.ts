import { describe, expect, it } from 'vitest';
import { Circle } from '../Circle';
import { Ellipse } from '../Ellipse';
import { Rect } from '../Rect';
import { FabricText } from '../Text/Text';
import { FabricImage } from '../Image';
import { Shadow } from '../../Shadow';

const MALICIOUS = 'x" /><script>alert(1)</script>';
const MALICIOUS2 = `x" onclick="alert('svg animatetransform onbegin')"`;
const ONCLICK_PAYLOAD = `onclick="alert('svg animatetransform onbegin')"`;

describe.each([MALICIOUS, MALICIOUS2])(
  'Object SVG export sanitization (%s)',
  (payload) => {
    it('sanitizes object id attributes', () => {
      const rect = new Rect({
        id: payload,
        width: 10,
        height: 10,
      });

      const svg = rect.toSVG();
      expect(svg).not.toContain('<script>');
      expect(svg).not.toContain(ONCLICK_PAYLOAD);
    });

    it('sanitizes object style attributes', () => {
      const rect = new Rect({
        width: 10,
        height: 10,
        fillRule: payload as unknown as 'nonzero',
        strokeLineCap: payload as unknown as 'round',
        strokeLineJoin: payload as unknown as 'round',
        strokeDashArray: [payload as unknown as number],
        paintFirst: payload as unknown as 'stroke',
        shadow: new Shadow({
          color: 'rgba(0, 0, 0, 0.5)',
          blur: 0,
          offsetX: 0,
          offsetY: 0,
        }),
      });
      rect.shadow.id = payload as unknown as number;

      const svg = rect.toSVG();
      expect(svg).not.toContain('<script>');
      expect(svg).not.toContain(ONCLICK_PAYLOAD);
    });

    it('sanitizes circle radius output', () => {
      const circle = new Circle({
        radius: payload as unknown as number,
      });

      const svg = circle.toSVG();
      expect(svg).not.toContain('<script>');
      expect(svg).not.toContain(ONCLICK_PAYLOAD);
    });

    it('sanitizes ellipse radii output', () => {
      const ellipse = new Ellipse({
        rx: payload as unknown as number,
        ry: payload as unknown as number,
      });

      const svg = ellipse.toSVG();
      expect(svg).not.toContain('<script>');
      expect(svg).not.toContain(ONCLICK_PAYLOAD);
    });

    it('sanitizes text content and font attributes', () => {
      const text = new FabricText('<script>alert(1)</script>', {
        fontFamily: `Times New Roman ${payload}`,
      });

      const svg = text.toSVG();
      expect(svg).not.toContain('<script>');
      expect(svg).not.toContain(ONCLICK_PAYLOAD);
    });

    it('sanitizes text style overrides', () => {
      const text = new FabricText('x', {
        styles: {
          0: {
            0: {
              fill: `red ${payload}`,
              fontFamily: `Times ${payload}`,
              fontWeight: `bold ${payload}`,
              fontStyle: `italic ${payload}`,
              fontSize: payload as unknown as number,
            },
          },
        },
      });

      const svg = text.toSVG();
      expect(svg).not.toContain('<script>');
      expect(svg).not.toContain(ONCLICK_PAYLOAD);
    });

    it('sanitizes image src output', () => {
      const element = new Image(10, 10);
      element.src = `data:image/svg+xml,<svg>${payload}</svg>`;
      const image = new FabricImage(element, { width: 10, height: 10 });

      const svg = image.toSVG();
      expect(svg).not.toContain('<script>');
      expect(svg).not.toContain(ONCLICK_PAYLOAD);
    });
  },
);

describe('Object SVG style declaration sanitization', () => {
  it('drops unsafe inline style values from object svg styles', () => {
    const rect = new Rect({
      width: 10,
      height: 10,
      fillRule: 'evenodd; filter:url(javascript:alert(1))' as never,
      strokeLineCap: 'round; opacity:0' as never,
      strokeLineJoin: 'bevel; fill:url(#x)' as never,
      strokeDashArray: ['4', '2; fill:url(#x)'] as never,
      strokeDashOffset: '1; opacity:0' as never,
      strokeMiterLimit: '4; opacity:0' as never,
      opacity: '1; visibility:hidden' as never,
    });

    const svgStyles = rect.getSvgStyles();
    expect(svgStyles).not.toContain('fill-rule:');
    expect(svgStyles).not.toContain('stroke-linecap:');
    expect(svgStyles).not.toContain('stroke-linejoin:');
    expect(svgStyles).not.toContain('stroke-dasharray:');
    expect(svgStyles).not.toContain('stroke-dashoffset:');
    expect(svgStyles).not.toContain('stroke-miterlimit:');
    expect(svgStyles).not.toContain('opacity:');
    expect(svgStyles).not.toContain('javascript:');
    expect(svgStyles).not.toContain('filter:url');
  });
});
