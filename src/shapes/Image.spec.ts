import { FabricImage } from './Image';
import { Shadow } from '../Shadow';
import { Brightness } from '../filters/Brightness';
import { loadSVGFromString } from '../parser/loadSVGFromString';

const mockImage = new Image(100, 100);

jest.mock('../util/misc/objectEnlive', () => {
  const all = jest.requireActual('../util/misc/objectEnlive');
  return {
    ...all,
    loadImage: jest.fn(async (src) => {
      const img = mockImage;
      img.src = src;
      return img;
    }),
  };
});

const mockApplyFilter = jest.fn();

jest.mock('../filters/FilterBackend', () => ({
  getFilterBackend: () => ({
    applyFilters: mockApplyFilter,
  }),
}));

describe('FabricImage', () => {
  describe('Svg export', () => {
    test('It exports an svg with styles for an image with stroke', () => {
      const imgElement = new Image(200, 200);
      const img = new FabricImage(imgElement, {
        left: 3,
        top: 3,
        cropX: 10,
        cropY: 10,
        width: 150,
        height: 150,
        stroke: 'red',
        strokeWidth: 11,
        shadow: new Shadow({
          color: 'rgba(0, 0, 0, 0.5)',
          blur: 24,
          offsetX: 0,
          offsetY: 14,
        }),
      });
      expect(img.toSVG()).toMatchSnapshot();
    });
  });
  describe('ApplyFilter use cacheKey', () => {
    const imgElement = new Image(200, 200);
    const img = new FabricImage(imgElement);
    img.filters = [new Brightness({ brightness: 0.2 })];
    img.applyFilters();
    expect(mockApplyFilter).toHaveBeenCalledWith(
      img.filters,
      img._originalElement,
      200,
      200,
      img.getElement(),
      'texture0',
    );
  });
  describe('SVG import', () => {
    it('can import images when xlink:href attribute is set', async () => {
      const { objects } =
        await loadSVGFromString(`<svg viewBox="0 0 745 1040" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  xml:space="preserve">
  <image zaparoo-no-print="true" xlink:href="https://design.zaparoo.org/ZapTradingCard.png" width="745" height="1040">
  </image>
</svg>`);
      const image = objects[0] as FabricImage;
      expect(image instanceof FabricImage).toBe(true);
      expect((image._originalElement as HTMLImageElement).src).toBe(
        'https://design.zaparoo.org/ZapTradingCard.png',
      );
    });
    it('can import images when href attribute has no xlink', async () => {
      const { objects } =
        await loadSVGFromString(`<svg viewBox="0 0 745 1040" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  xml:space="preserve">
  <image zaparoo-no-print="true" href="https://design.zaparoo.org/ZapTradingCard.png" width="745" height="1040">
  </image>
</svg>`);
      const image = objects[0] as FabricImage;
      expect(image instanceof FabricImage).toBe(true);
      expect((image._originalElement as HTMLImageElement).src).toBe(
        'https://design.zaparoo.org/ZapTradingCard.png',
      );
    });
  });
});
