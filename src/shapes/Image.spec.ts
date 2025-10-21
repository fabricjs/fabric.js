import type { SerializedImageProps } from './Image';
import { FabricImage } from './Image';
import { Shadow } from '../Shadow';
import { Brightness } from '../filters/Brightness';
import { loadSVGFromString } from '../parser/loadSVGFromString';

import { describe, expect, it, test, vi } from 'vitest';
import { Group } from './Group';
import { Contrast } from '../filters/Contrast';
import { Resize } from '../filters/Resize';
import {
  FabricObject,
  getFabricDocument,
  getFilterBackend,
  Rect,
  version,
  WebGLFilterBackend,
} from '../../fabric';
import { removeTransformMatrixForSvgParsing } from '../util';
import * as FilterBackend from '../filters/FilterBackend';
import { FabricError } from '../util/internals/console';
import TestImageGif from '../../test/fixtures/test_image.gif';
import { isJSDOM } from '../../vitest.extend';

const IMG_SRC = isJSDOM() ? 'test_image.gif' : TestImageGif;
const imgSrcUrl = new URL(IMG_SRC, import.meta.url).pathname;

const IMG_WIDTH = 276;
const IMG_HEIGHT = 110;
const IMG_URL_NON_EXISTING = 'http://www.google.com/non-existing';

const REFERENCE_IMG_OBJECT = {
  version: version,
  type: 'Image',
  originX: 'center' as const,
  originY: 'center' as const,
  left: 0,
  top: 0,
  width: IMG_WIDTH,
  height: IMG_HEIGHT,
  fill: 'rgb(0,0,0)',
  stroke: null,
  strokeWidth: 0,
  strokeDashArray: null,
  strokeLineCap: 'butt' as const,
  strokeDashOffset: 0,
  strokeLineJoin: 'miter' as const,
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  src: IMG_SRC,
  shadow: null,
  visible: true,
  backgroundColor: '',
  filters: [],
  fillRule: 'nonzero' as const,
  paintFirst: 'fill' as const,
  globalCompositeOperation: 'source-over' as const,
  skewX: 0,
  skewY: 0,
  crossOrigin: null,
  cropX: 0,
  cropY: 0,
  strokeUniform: false,
};

describe('FabricImage', () => {
  describe('Svg export', () => {
    test('It exports an svg with styles for an image with stroke', () => {
      const imgElement = new Image(200, 200);
      const img = new FabricImage(imgElement, {
        left: 83.5,
        top: 83.5,
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

  test('ApplyFilter use cacheKey', () => {
    const backend = FilterBackend.getFilterBackend();
    const mockApply = vi
      .spyOn(backend, 'applyFilters')
      .mockImplementation(vi.fn());

    try {
      const img = new FabricImage(new Image(200, 200));
      img.filters = [new Brightness({ brightness: 0.2 })];
      img.applyFilters();
      expect(mockApply).toHaveBeenCalledWith(
        img.filters,
        img._originalElement,
        200,
        200,
        img.getElement(),
        'texture3',
      );
    } finally {
      mockApply.mockRestore();
    }
  });
  describe('SVG import', () => {
    test('can import images when xlink:href attribute is set', async () => {
      const { objects } =
        await loadSVGFromString(`<svg viewBox="0 0 745 1040" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  xml:space="preserve">
  <image zaparoo-no-print="true" xlink:href="https://design.zaparoo.org/ZapTradingCard.png" width="745" height="1040">
  </image>
</svg>`);
      const image = objects[0] as FabricImage;
      expect(image).toBeInstanceOf(FabricImage);
      expect((image._originalElement as HTMLImageElement).src).toBe(
        'https://design.zaparoo.org/ZapTradingCard.png',
      );
    });
    test('can import images when href attribute has no xlink', async () => {
      const { objects } =
        await loadSVGFromString(`<svg viewBox="0 0 745 1040" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  xml:space="preserve">
  <image zaparoo-no-print="true" href="https://design.zaparoo.org/ZapTradingCard.png" width="745" height="1040">
  </image>
</svg>`);
      const image = objects[0] as FabricImage;
      expect(image).toBeInstanceOf(FabricImage);
      expect((image._originalElement as HTMLImageElement).src).toBe(
        'https://design.zaparoo.org/ZapTradingCard.png',
      );
    });
  });

  it('constructor', async () => {
    expect(Image, 'Image should exist').toBeTruthy();

    const image = await createImage();

    expect(image, 'image should be an instance of FabricImage').toBeInstanceOf(
      FabricImage,
    );
    expect(image, 'image should be an instance of FabricObject').toBeInstanceOf(
      FabricObject,
    );
    expect(
      image.constructor,
      'constructor type should be Image',
    ).toHaveProperty('type', 'Image');
  });

  it('toObject', async () => {
    const image = await createImage();
    image.left = 0;
    image.top = 0;

    const toObject = image.toObject();

    // workaround for node-canvas sometimes producing images with width/height and sometimes not
    if (toObject.width === 0) {
      toObject.width = IMG_WIDTH;
    }

    if (toObject.height === 0) {
      toObject.height = IMG_HEIGHT;
    }

    expect(
      toObject,
      'toObject should match reference object',
    ).toSameImageObject(REFERENCE_IMG_OBJECT);
  });

  it('setSrc', async () => {
    const image = await createImage();

    image.width = 100;
    image.height = 100;

    image.left = 0;
    image.top = 0;

    expect(image.setSrc, 'setSrc should be a function').toBeTypeOf('function');
    expect(image.width, 'width should be 100').toBe(100);
    expect(image.height, 'height should be 100').toBe(100);

    await image.setSrc(IMG_SRC);

    expect(image.width, 'width should be updated to IMG_WIDTH').toBe(IMG_WIDTH);
    expect(image.height, 'height should be updated to IMG_HEIGHT').toBe(
      IMG_HEIGHT,
    );
  });

  it('setSrc with crossOrigin', async () => {
    const image = await createImage();

    image.width = 100;
    image.height = 100;

    expect(image.setSrc, 'setSrc should be a function').toBeTypeOf('function');
    expect(image.width, 'width should be 100').toBe(100);
    expect(image.height, 'height should be 100').toBe(100);

    await image.setSrc(IMG_SRC, { crossOrigin: 'anonymous' });

    expect(image.width, 'width should be updated to IMG_WIDTH').toBe(IMG_WIDTH);
    expect(image.height, 'height should be updated to IMG_HEIGHT').toBe(
      IMG_HEIGHT,
    );
    expect(image.getCrossOrigin(), 'setSrc will respect crossOrigin').toBe(
      'anonymous',
    );
  });

  it('toObject with no element', async () => {
    const image = await createImage();
    image.left = 0;
    image.top = 0;

    expect(image.toObject, 'toObject should be a function').toBeTypeOf(
      'function',
    );

    const toObject = image.toObject();

    // workaround for node-canvas sometimes producing images with width/height and sometimes not
    if (toObject.width === 0) {
      toObject.width = IMG_WIDTH;
    }

    if (toObject.height === 0) {
      toObject.height = IMG_HEIGHT;
    }

    expect(
      toObject,
      'toObject should match reference object',
    ).toSameImageObject(REFERENCE_IMG_OBJECT);
  });

  it('toObject with resize filter', async () => {
    const image = await createImage();
    image.left = 0;
    image.top = 0;

    expect(image.toObject, 'toObject should be a function').toBeTypeOf(
      'function',
    );

    const filter = new Resize({
      resizeType: 'bilinear',
      scaleX: 0.3,
      scaleY: 0.3,
    });

    image.resizeFilter = filter;

    expect(
      image.resizeFilter,
      'should inherit from filters.Resize',
    ).toBeInstanceOf(Resize);

    const toObject = image.toObject();

    expect(toObject.resizeFilter, 'the filter is in object form now').toEqual(
      filter.toObject(),
    );

    const imageFromObject = await FabricImage.fromObject(toObject);
    const filterFromObj = imageFromObject.resizeFilter;

    expect(filterFromObj, 'should inherit from filters.Resize').toBeInstanceOf(
      Resize,
    );
    expect(filterFromObj, 'the filter has been restored').toEqual(filter);
    expect(filterFromObj.scaleX, 'scaleX should be 0.3').toBe(0.3);
    expect(filterFromObj.scaleY, 'scaleY should be 0.3').toBe(0.3);
    expect(filterFromObj.resizeType, 'resizeType should be bilinear').toBe(
      'bilinear',
    );
  });

  it('toObject with normal filter and resize filter', async () => {
    const image = await createImage();

    const filter = new Resize({ resizeType: 'bilinear' });

    image.resizeFilter = filter;

    const filterBg = new Brightness({ brightness: 0.8 });

    image.filters = [filterBg];
    image.scaleX = 0.3;
    image.scaleY = 0.3;

    const toObject = image.toObject();

    expect(toObject.resizeFilter, 'the filter is in object form now').toEqual(
      filter.toObject(),
    );
    expect(
      toObject.filters[0],
      'the filter is in object form now brightness',
    ).toEqual(filterBg.toObject());

    const imageFromObject = await FabricImage.fromObject(toObject);
    const filterFromObj = imageFromObject.resizeFilter;
    const brightnessFromObj = imageFromObject.filters[0];

    expect(filterFromObj, 'should inherit from filters.Resize').toBeInstanceOf(
      Resize,
    );
    expect(
      brightnessFromObj,
      'should inherit from filters.Brightness',
    ).toBeInstanceOf(Brightness);
  });

  it('toObject with applied resize filter', async () => {
    const image = await createImage();

    expect(image.toObject, 'toObject should be a function').toBeTypeOf(
      'function',
    );

    const filter = new Resize({
      resizeType: 'bilinear',
      scaleX: 0.2,
      scaleY: 0.2,
    });

    image.filters.push(filter);

    const width = image.width;
    const height = image.height;

    expect(
      image.filters[0],
      'should inherit from filters.Resize',
    ).toBeInstanceOf(Resize);

    image.applyFilters();

    expect(image.width, 'width is not changed').toBe(Math.floor(width));
    expect(image.height, 'height is not changed').toBe(Math.floor(height));
    await expect
      .poll(
        () =>
          // @ts-expect-error -- protected prop
          parseFloat(image._filterScalingX.toFixed(1)),
        { timeout: 2_000 },
      )
      .toBe(0.2);
    await expect
      .poll(
        () =>
          // @ts-expect-error -- protected prop
          parseFloat(image._filterScalingY.toFixed(1)),
        { timeout: 2_000 },
      )
      .toBe(0.2);

    const toObject = image.toObject();

    expect(toObject.filters[0], 'filter should be in object form').toEqual(
      filter.toObject(),
    );
    expect(toObject.width, 'width is stored as before filters').toBe(width);
    expect(toObject.height, 'height is stored as before filters').toBe(height);

    const imageFromObject = await FabricImage.fromObject(toObject);
    const filterFromObj = imageFromObject.filters[0];

    expect(filterFromObj, 'should inherit from filters.Resize').toBeInstanceOf(
      Resize,
    );
    expect(filterFromObj, 'scaleY should be 0.2').toHaveProperty('scaleY', 0.2);
    expect(filterFromObj, 'scaleX should be 0.2').toHaveProperty('scaleX', 0.2);
  });

  it('toString', async () => {
    const image = await createImage();

    expect(image.toString, 'toString should be a function').toBeTypeOf(
      'function',
    );
    expect(image.toString(), 'toString should return correct string').toBe(
      '#<Image: { src: "' + image.getSrc() + '" }>',
    );
  });

  it('toSVG with crop', async () => {
    const image = await createImage();

    image.cropX = 1;
    image.cropY = 1;
    image.width -= 2;
    image.height -= 2;

    const expectedSVG = `<g transform="matrix(1 0 0 1 138 55)"  >
<clipPath id="imageCrop_1">
\t<rect x="-137" y="-54" width="274" height="108" />
</clipPath>
\t<image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="${imgSrcUrl}" x="-138" y="-55" width="276" height="110" clip-path="url(#imageCrop_1)" ></image>
</g>
`;

    expect(image.toSVG(), 'SVG should match expected output').toEqualSVG(
      expectedSVG,
    );
  });

  it('hasCrop', async () => {
    const image = await createImage();

    expect(image.hasCrop, 'hasCrop should be a function').toBeTypeOf(
      'function',
    );
    expect(image.hasCrop(), 'standard image has no crop').toBe(false);

    image.cropX = 1;

    expect(image.hasCrop(), 'cropX !== 0 gives crop true').toBe(true);

    image.cropX = 0;
    image.cropY = 1;

    expect(image.hasCrop(), 'cropY !== 0 gives crop true').toBe(true);

    image.width -= 1;

    expect(image.hasCrop(), 'width < element.width gives crop true').toBe(true);

    image.width += 1;
    image.height -= 1;

    expect(image.hasCrop(), 'height < element.height gives crop true').toBe(
      true,
    );
  });

  it('toSVG', async () => {
    const image = await createImage();

    expect(image.toSVG, 'toSVG should be a function').toBeTypeOf('function');

    const expectedSVG = `<g transform="matrix(1 0 0 1 138 55)"  >
\t<image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="${imgSrcUrl}" x="-138" y="-55" width="276" height="110"></image>
</g>
`;

    expect(image.toSVG(), 'SVG should match expected output').toEqualSVG(
      expectedSVG,
    );
  });

  it('toSVG with imageSmoothing false', async () => {
    const image = await createImage();

    image.imageSmoothing = false;

    expect(image.toSVG, 'toSVG should be a function').toBeTypeOf('function');

    const expectedSVG = `<g transform="matrix(1 0 0 1 138 55)"  >
\t<image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="${imgSrcUrl}" x="-138" y="-55" width="276" height="110" image-rendering="optimizeSpeed"></image>
</g>
`;

    expect(image.toSVG(), 'SVG should match expected output').toEqualSVG(
      expectedSVG,
    );
  });

  it('toSVG with missing element', async () => {
    const image = await createImage();

    // @ts-expect-error -- not optional but intentional
    delete image._element;

    expect(image.toSVG, 'toSVG should be a function').toBeTypeOf('function');

    const expectedSVG = '<g transform="matrix(1 0 0 1 138 55)"  >\n</g>\n';

    expect(image.toSVG(), 'SVG should match expected output').toEqualSVG(
      expectedSVG,
    );
  });

  it('getSrc', async () => {
    const image = await createImage();

    expect(image.getSrc, 'getSrc should be a function').toBeTypeOf('function');
    expect(
      basename(image.getSrc()),
      'getSrc should return correct basename',
    ).toBe(basename(IMG_SRC));
  });

  it('getSrc with srcFromAttribute', async () => {
    const image = await createImage({
      src: IMG_SRC,
      extra: {
        srcFromAttribute: true,
      },
    });

    expect(image.getSrc(), 'getSrc should return IMG_SRC_REL').toBe(IMG_SRC);
  });

  it('getElement', () => {
    const elImage = new Image();
    const image = new FabricImage(elImage);

    expect(image.getElement, 'getElement should be a function').toBeTypeOf(
      'function',
    );
    expect(image.getElement(), 'getElement should return element').toBe(
      elImage,
    );
  });

  it('setElement', async () => {
    const image = await createImage();

    expect(image.setElement, 'setElement should be a function').toBeTypeOf(
      'function',
    );

    const elImage = new Image();

    expect(
      image.getElement(),
      'element should not be the same initially',
    ).not.toBe(elImage);

    image.setElement(elImage);

    expect(image.getElement(), 'element should be updated').toBe(elImage);
    expect(image._originalElement, '_originalElement should be updated').toBe(
      elImage,
    );
  });

  it('setElement calls `removeTexture`', async () => {
    const keys: string[] = [];

    const image = await createImage();

    image.cacheKey = 'TEST';

    // use sinon replace or something one day
    image.removeTexture = (key) => keys.push(key);

    image.setElement(new Image());

    expect(keys, 'should try to remove caches').toEqual([
      'TEST',
      'TEST_filtered',
    ]);
  });

  it('setElement resets the webgl cache', { retry: 2 }, async (ctx) => {
    const backend = getFilterBackend();

    if (!(backend instanceof WebGLFilterBackend)) {
      ctx.skip(true, 'Skip test if WebGL backend is not available');
      return;
    }

    const image = await createImage();

    backend.textureCache[image.cacheKey] = backend.createTexture(
      backend.gl,
      50,
      50,
    );

    expect(
      backend.textureCache[image.cacheKey],
      'cache should exist',
    ).toBeTruthy();

    image.setElement(new Image());

    expect(
      backend.textureCache[image.cacheKey],
      'cache should be cleared',
    ).toBeUndefined();
  });

  it('fromObject', async () => {
    expect(
      FabricImage.fromObject,
      'fromObject should be a function',
    ).toBeTypeOf('function');

    const instance = await FabricImage.fromObject({
      ...REFERENCE_IMG_OBJECT,
      src: IMG_SRC,
    });

    expect(instance, 'instance should be a FabricImage').toBeInstanceOf(
      FabricImage,
    );
  });

  it('fromObject with clipPath and filters', async () => {
    const obj = {
      ...REFERENCE_IMG_OBJECT,
      src: IMG_SRC,
      clipPath: new Rect({ width: 100, height: 100 }).toObject(),
      filters: [
        {
          type: 'Brightness',
          brightness: 0.1,
        },
      ],
      resizeFilter: {
        type: 'Resize',
      } as Resize,
    } as SerializedImageProps;

    const instance = await FabricImage.fromObject(obj);

    expect(instance, 'instance should be a FabricImage').toBeInstanceOf(
      FabricImage,
    );
    expect(instance.clipPath, 'clipPath should be a Rect').toBeInstanceOf(Rect);
    expect(Array.isArray(instance.filters), 'should enliven filters').toBe(
      true,
    );
    expect(instance.filters.length, 'should enliven filters').toBe(1);
    expect(instance.filters[0], 'should enliven filters').toBeInstanceOf(
      Brightness,
    );
    expect(instance.resizeFilter, 'should enliven resizeFilter').toBeInstanceOf(
      Resize,
    );
  });

  it('fromURL', async () => {
    expect(FabricImage.fromURL, 'fromURL should be a function').toBeTypeOf(
      'function',
    );

    const instance = await FabricImage.fromURL(IMG_SRC);

    expect(instance, 'instance should be a FabricImage').toBeInstanceOf(
      FabricImage,
    );
    expect(
      instance.toObject(),
      'instance object should match reference',
    ).toSameImageObject(REFERENCE_IMG_OBJECT);
  });

  it('fromURL error', async () => {
    expect(FabricImage.fromURL, 'fromURL should be a function').toBeTypeOf(
      'function',
    );

    try {
      await FabricImage.fromURL(IMG_URL_NON_EXISTING);
      expect(false, 'Should have thrown an error but did not').toBe(true);
    } catch (e) {
      expect(e, 'Should be an Error instance').toBeInstanceOf(Error);
    }
  });

  it('apply filters run isNeutralState implementation of filters', async () => {
    const image = await createImage();

    let run = false;

    image.dirty = false;

    const filter = new Brightness();

    image.filters = [filter];

    filter.isNeutralState = function () {
      run = true;
      return false;
    };

    expect(run, 'isNeutralState did not run yet').toBe(false);

    image.applyFilters();

    expect(run, 'isNeutralState did run').toBe(true);
  });

  it('apply filters set the image dirty', async () => {
    const image = await createImage();

    image.dirty = false;

    expect(image.dirty, 'false apply filter dirty is false').toBe(false);

    image.applyFilters();

    expect(image.dirty, 'After apply filter dirty is true').toBe(true);
  });

  it('apply filters reset _element and _filteredEl', async () => {
    const image = await createImage();

    const contrast = new Contrast({ contrast: 0.5 });

    image.applyFilters();

    const element = image._element;
    const filtered = image._filteredEl;

    image.filters = [contrast];

    image.applyFilters();

    expect(image._element, 'image element has changed').not.toBe(element);
    expect(image._filteredEl, 'image _filteredEl element has changed').not.toBe(
      filtered,
    );
    expect(image._element, 'after filtering elements are the same').toBe(
      image._filteredEl,
    );
  });

  it('apply filters and resize filter', async () => {
    const image = await createImage();

    const contrast = new Contrast({ contrast: 0.5 });
    const resizeFilter = new Resize();

    image.filters = [contrast];
    image.resizeFilter = resizeFilter;

    const element = image._element;
    const filtered = image._filteredEl;

    image.scaleX = 0.4;
    image.scaleY = 0.4;

    image.applyFilters();

    expect(image._element, 'image element has changed').not.toBe(element);
    expect(image._filteredEl, 'image _filteredEl element has changed').not.toBe(
      filtered,
    );
    expect(image._element, 'after filtering elements are the same').toBe(
      image._filteredEl,
    );

    image.applyResizeFilters();

    expect(image._element, 'after resizing the 2 elements differ').not.toBe(
      image._filteredEl,
    );
    expect(
      // @ts-expect-error -- protected prop
      parseFloat(image._lastScaleX.toFixed(2)),
      'after resizing we know how much we scaled',
    ).toBe(image.scaleX);
    expect(
      // @ts-expect-error -- protected prop
      parseFloat(image._lastScaleY.toFixed(2)),
      'after resizing we know how much we scaled',
    ).toBe(image.scaleY);

    image.applyFilters();

    expect(image._element, 'after filters again the elements changed').toBe(
      image._filteredEl,
    );
    // @ts-expect-error -- protected prop
    expect(image._lastScaleX, 'lastScale X is reset').toBe(1);
    // @ts-expect-error -- protected prop
    expect(image._lastScaleY, 'lastScale Y is reset').toBe(1);
    expect(image._needsResize(), 'resizing is needed again').toBe(true);
  });

  it('apply filters set the image dirty and also the group', async () => {
    const image = await createImage();

    const group = new Group([image]);

    image.dirty = false;
    group.dirty = false;

    expect(image.dirty, 'false apply filter dirty is false').toBe(false);
    expect(group.dirty, 'false apply filter dirty is false').toBe(false);

    image.applyFilters();

    expect(image.dirty, 'After apply filter dirty is true').toBe(true);
    expect(group.dirty, 'After apply filter dirty is true').toBe(true);
  });

  it('_renderFill respects source boundaries crop < 0 and width > elWidth', () => {
    FabricImage.prototype._renderFill.call(
      {
        cropX: -1,
        cropY: -1,
        _filterScalingX: 1,
        _filterScalingY: 1,
        width: 300,
        height: 300,
        _element: {
          naturalWidth: 200,
          height: 200,
        },
      },
      {
        drawImage: (...args: any[]) => {
          const [, sx, sy, sw, sh] = args as number[];
          expect(sx, 'sX should be positive').toBeGreaterThanOrEqual(0);
          expect(sy, 'sY should be positive').toBeGreaterThanOrEqual(0);
          expect(
            sw,
            'sW should not be larger than image width',
          ).toBeLessThanOrEqual(200);
          expect(
            sh,
            'sH should not be larger than image height',
          ).toBeLessThanOrEqual(200);
        },
      } as any,
    );
  });

  it('_renderFill respects source boundaries with crop and scaling', () => {
    FabricImage.prototype._renderFill.call(
      {
        cropX: 30,
        cropY: 30,
        _filterScalingX: 0.5,
        _filterScalingY: 0.5,
        width: 210,
        height: 210,
        _element: {
          naturalWidth: 200,
          height: 200,
        },
      },
      {
        drawImage: (...args: any[]) => {
          const [, sx, sy, sw, sh] = args as number[];
          expect(sx, 'sX should be cropX * filterScalingX').toBe(15);
          expect(sy, 'sY should be cropY * filterScalingY').toBe(15);
          expect(
            sw,
            'sW will be width * filterScalingX if is < of element width',
          ).toBe(105);
          expect(
            sh,
            'sH will be height * filterScalingY if is < of element height',
          ).toBe(105);
        },
      } as any,
    );
  });

  it('crossOrigin propagation', async () => {
    const el = new Image();
    el.crossOrigin = 'anonymous';

    const img = new FabricImage(el);
    expect(img.getCrossOrigin()).toBe('anonymous');

    const objRepr = img.toObject();
    expect(objRepr.crossOrigin).toBe('anonymous');

    const el2 = new Image();
    el2.crossOrigin = 'use-credentials';
    img.setElement(el2);
    expect(el2.crossOrigin).toBe('use-credentials');
  });

  it('clone keeps equality', async () => {
    const src = await createImage();
    const clone = await src.clone();
    expect(clone).toBeInstanceOf(FabricImage);
    expect(clone.toObject()).toEqual(src.toObject());
  });

  it('clone keeps width / height of the element', async () => {
    const half = await createImage({ w: IMG_WIDTH / 2, h: IMG_HEIGHT / 2 });
    const clone = await half.clone();
    expect(clone.width).toBe(IMG_WIDTH / 2);
    expect(clone.height).toBe(IMG_HEIGHT / 2);
  });

  /* 4 ­‑‑ fromObject must not mutate the source -------------------- */
  it('fromObject does not mutate input', async () => {
    const brightness = { type: 'Brightness', brightness: 0.1 } as const;
    const contrast = { type: 'Contrast', contrast: 0.1 } as const;

    const obj: any = {
      ...REFERENCE_IMG_OBJECT,
      src: IMG_SRC,
      filters: [brightness],
      resizeFilter: contrast,
    };

    const original = structuredClone(obj);

    await FabricImage.fromObject(obj);

    expect(obj).toEqual(original);
    expect(obj.filters[0]).toBe(brightness);
    expect(obj.resizeFilter).toBe(contrast);
  });

  it('fromURL with non‑default options', async () => {
    const img = await FabricImage.fromURL(IMG_SRC, {
      crossOrigin: 'use-credentials',
    });
    expect(img.toObject().crossOrigin).toBe('use-credentials');
  });

  it('consecutive toDataURL calls give identical result', async () => {
    const img = await createImage();
    const d1 = img.toDataURL();
    const d2 = img.toDataURL();
    const d3 = img.toDataURL();
    expect(d1).toBe(d2);
    expect(d1).toBe(d3);
  });

  const IMAGE_DATA_URL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

  it('fromElement → imageSmoothing = false', async () => {
    const el = makeImageElement({
      width: '14',
      height: '17',
      'image-rendering': 'optimizeSpeed',
      'xlink:href': IMAGE_DATA_URL,
    });

    const img = (await FabricImage.fromElement(el))!;
    expect(img.get('imageSmoothing')).toBe(false);
  });

  it('fromElement with preserveAspectRatio (larger box)', async () => {
    const el = makeImageElement({
      width: '140',
      height: '170',
      'xlink:href': IMAGE_DATA_URL,
    });
    const img = (await FabricImage.fromElement(el))!;
    removeTransformMatrixForSvgParsing(
      img,
      img.parsePreserveAspectRatioAttribute(),
    );
    expect(img.width).toBe(14);
    expect(img.height).toBe(17);
    expect(img.scaleX).toBe(10);
    expect(img.scaleY).toBe(10);
  });

  const paCases = [
    ['xMidYMid meet', 35, 85, 70, 170],
    ['xMidYMax meet', 35, 127.5, 70, 170],
    ['xMidYMin meet', 35, 42.5, 70, 170],
    ['xMinYMin meet', 35, 42.5, 140, 85], // vertical bbox
    ['xMidYMin meet', 70, 42.5, 140, 85],
    ['xMaxYMin meet', 105, 42.5, 140, 85],
  ] as const;

  paCases.forEach(([pr, expLeft, expTop, w, h]) => {
    it(`fromElement preserveAspectRatio ${pr}`, async () => {
      const el = makeImageElement({
        x: '0',
        y: '0',
        width: String(w),
        height: String(h),
        preserveAspectRatio: pr,
        'xlink:href': IMAGE_DATA_URL,
      });
      const img = (await FabricImage.fromElement(el))!;
      removeTransformMatrixForSvgParsing(
        img,
        img.parsePreserveAspectRatioAttribute(),
      );
      expect(img.left).toBe(expLeft);
      expect(img.top).toBe(expTop);
      expect(img.scaleX).toBe(5);
      expect(img.scaleY).toBe(5);
    });
  });
});

export function newImg(src = IMG_SRC): HTMLImageElement {
  const img = getFabricDocument().createElement('img');
  img.src = src;
  return img;
}

export async function createImage(
  opts: {
    w?: number;
    h?: number;
    src?: string;
    extra?: Record<string, any>;
  } = {},
): Promise<FabricImage> {
  const { w, h, src = IMG_SRC, extra = {} } = opts;

  const el = newImg(src);

  await new Promise<void>((resolve) => {
    if (el.complete) return resolve();
    el.onload = () => resolve();
    el.onerror = () =>
      resolve(
        Promise.reject(new FabricError(`failed to load test image: ${src}`)),
      );
  });

  return new FabricImage(el, {
    top: h ? h / 2 : IMG_HEIGHT / 2,
    left: w ? w / 2 : IMG_WIDTH / 2,
    width: w ?? IMG_WIDTH,
    height: h ?? IMG_HEIGHT,
    ...extra,
  });
}

export function makeImageElement(
  attrs: Record<string, string>,
): HTMLImageElement {
  const el = getFabricDocument().createElement('image');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el as HTMLImageElement;
}

export const basename = (path: string) =>
  path.slice(Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/')) + 1);
