import type { renderTestType } from '../../../types';

const imageAlphaBlurFilterTest = (): renderTestType[] => {
  return [true, false].map((configValue) => ({
    title: `Image blur with transparency webgl ${configValue ? 'enabled' : 'disabled'}`,
    golden: `blur-with-alpha-webgl-${configValue ? 'enabled' : 'disabled'}.png`,
    percentage: 0.01,
    size: [1000, 1000],
    snapshotSuffix: 'color-filters',
    async renderFunction(canvas, fabric) {
      fabric.config.configure({
        enableGLFiltering: configValue,
      });
      const img = await globalThis.getImage(fabric, 'shirt-with-alpha.png');
      const image = new fabric.Image(img);
      image.filters = [new fabric.filters.Blur({ blur: 0.6 })];
      image.applyFilters();
      canvas.backgroundColor = 'cyan';
      canvas.add(image);
      canvas.renderAll();
    },
  }));
};

const imageBlurFilterTest = (): renderTestType[] => {
  return [true, false].map((configValue) => ({
    title: `Image blur webgl ${configValue ? 'enabled' : 'disabled'}`,
    golden: `dog_image-webgl-${configValue ? 'enabled' : 'disabled'}.png`,
    percentage: 0.01,
    size: [1024, 683],
    snapshotSuffix: 'color-filters',
    async renderFunction(canvas, fabric) {
      fabric.config.configure({
        enableGLFiltering: configValue,
      });
      const img = await globalThis.getImage(fabric, 'dog_image.jpg');
      const image = new fabric.Image(img);
      image.filters = [new fabric.filters.Blur({ blur: 0.6 })];
      image.applyFilters();
      canvas.backgroundColor = 'cyan';
      canvas.add(image);
      canvas.renderAll();
    },
  }));
};

export const colorFilteringTests: renderTestType[] = [
  ...imageAlphaBlurFilterTest(),
  ...imageBlurFilterTest(),
];
