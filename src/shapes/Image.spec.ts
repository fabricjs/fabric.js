import { FabricImage } from './Image';
import { Shadow } from '../Shadow';
import { Brightness } from '../filters/Brightness';

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
});
