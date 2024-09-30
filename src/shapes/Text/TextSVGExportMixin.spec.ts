import { FabricText } from './Text';

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
});
