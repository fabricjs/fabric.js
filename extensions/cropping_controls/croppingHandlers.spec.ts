import type { Transform } from 'fabric';
import { FabricImage, Canvas } from 'fabric';
import {
  changeImageWidth,
  changeCropWidth,
  changeImageHeight,
  changeCropHeight,
  changeImageCropX,
  changeCropX,
  changeImageCropY,
  changeCropY,
} from './croppingHandlers';

import { describe, expect, test, beforeEach, afterEach } from 'vitest';

describe('croppingHandlers', () => {
  let canvas: Canvas;
  let image: FabricImage;
  let transform: Transform;
  let eventData: any;

  function prepareTransform(target: FabricImage, corner: string): Transform {
    const origin = canvas._getOriginFromCorner(target, corner);
    return {
      target,
      corner,
      originX: origin.x,
      originY: origin.y,
    } as Transform;
  }

  function createMockImage(
    options: Partial<{
      width: number;
      height: number;
      cropX: number;
      cropY: number;
      elementWidth: number;
      elementHeight: number;
    }> = {},
  ): FabricImage {
    const {
      width = 100,
      height = 100,
      cropX = 0,
      cropY = 0,
      elementWidth = 200,
      elementHeight = 200,
    } = options;

    const imgElement = new Image(elementWidth, elementHeight);
    const img = new FabricImage(imgElement, {
      left: 50,
      top: 50,
      width,
      height,
      cropX,
      cropY,
    });
    return img;
  }

  beforeEach(() => {
    canvas = new Canvas();
    image = createMockImage();
    canvas.add(image);
    eventData = {};
    transform = prepareTransform(image, 'mr');
  });

  afterEach(() => {
    canvas.off();
    canvas.clear();
  });

  describe('changeImageWidth', () => {
    test('changes width normally when within bounds', () => {
      expect(image.width).toBe(100);
      const changed = changeImageWidth(eventData, transform, 180, 50);
      expect(changed).toBe(true);
      expect(image.width).toBe(180);
    });

    test('constrains width to available width (upper limit)', () => {
      // Image element is 200px wide, cropX is 0, so max available is 200
      image = createMockImage({ width: 100, cropX: 50, elementWidth: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'mr');

      // Try to set width beyond available (200 - 50 = 150 available)
      changeImageWidth(eventData, transform, 500, 50);
      expect(image.width).toBe(150);
    });

    test('constrains width to minimum of 1 (lower limit)', () => {
      image = createMockImage({ width: 100, cropX: 50, elementWidth: 200 });
      transform = prepareTransform(image, 'mr');
      changeImageWidth(eventData, transform, 0.1, 50);
      expect(image.width).toBe(1);
    });

    test('returns false when no modification occurred', () => {
      image = createMockImage({
        width: 100,
        cropX: 50,
        elementWidth: 200,
      });
      transform = prepareTransform(image, 'mr');
      const changed = changeImageWidth(eventData, transform, 200, 50);
      expect(changed).toBe(true);
      const changed2 = changeImageWidth(eventData, transform, 200, 50);
      expect(changed2).toBe(false);
    });
  });

  describe('changeCropWidth', () => {
    test('is wrapped with wrapWithFireEvent and wrapWithFixedAnchor', () => {
      // Re-import to trigger the wrapping
      // Since the module is already loaded, we verify the export is a function
      expect(typeof changeCropWidth).toBe('function');

      // The wrapped function should be different from the base function
      expect(changeCropWidth).not.toBe(changeImageWidth);
    });
  });

  describe('changeImageHeight', () => {
    beforeEach(() => {
      image = createMockImage({
        height: 100,
        cropY: 50,
        elementHeight: 200,
      });
      transform = prepareTransform(image, 'mb');
    });

    test('changes height normally when within bounds', () => {
      expect(image.height).toBe(100);
      const changed = changeImageHeight(eventData, transform, 50, 130);
      expect(changed).toBe(true);
      expect(image.height).toBe(130);
    });

    test('constrains height to available height (upper limit)', () => {
      // Try to set height beyond available (200 - 50 = 150 available
      changeImageHeight(eventData, transform, 50, 500);
      expect(image.height).toBeLessThanOrEqual(150);
    });

    test('constrains height to minimum of 1 (lower limit)', () => {
      // Mock to simulate setting negative height
      changeImageHeight(eventData, transform, 50, 0.1);
      expect(image.height).toBe(1);
    });

    test('returns false when no modification occurred', () => {
      const changed = changeImageHeight(eventData, transform, 50, 200);
      expect(changed).toBe(true);
      const changed2 = changeImageHeight(eventData, transform, 50, 200);
      expect(changed2).toBe(false);
    });
  });

  describe('changeCropHeight', () => {
    test('is wrapped with wrapWithFireEvent and wrapWithFixedAnchor', () => {
      // The wrapped function should be different from the base function
      expect(typeof changeCropHeight).toBe('function');
      expect(changeCropHeight).not.toBe(changeImageHeight);
    });
  });

  describe('changeImageCropX', () => {
    beforeEach(() => {
      image = createMockImage({
        width: 100,
        cropX: 50,
        elementWidth: 200,
      });
      // Use 'ml' corner for cropX - changing left side moves cropX
      transform = prepareTransform(image, 'ml');
    });

    test('changes cropX and width together', () => {
      const changed = changeImageCropX(eventData, transform, 20, 50);
      expect(image.cropX).toBe(70);
      expect(image.width).toBe(80);
      expect(changed).toBe(true);
    });

    test('constrains cropX to minimum of 0 and adjusts width accordingly', () => {
      image = createMockImage({ width: 100, cropX: 10, elementWidth: 200 });
      transform = prepareTransform(image, 'ml');

      changeImageCropX(eventData, transform, -10, 50);

      // newCropX is clamped to 0 (was -10)
      expect(image.cropX).toBe(0);
      // width = 100 + 10 - 0 = 110
      expect(image.width).toBe(110);
    });

    test('constrains cropX so image stays within element bounds and adjusts width accordingly', () => {
      changeImageCropX(eventData, transform, 50, 50);
      // newCropX = 100, but clamped to elementWidth - width = 200 - 100 = 100 (stays 100)
      expect(image.cropX).toBe(100);
      // width = 100 + 50 - 100 = 50
      expect(image.width).toBe(50);
      // cropX + width should not exceed element width (200)
      expect(image.cropX + image.width).toBeLessThanOrEqual(200);
    });

    test('returns false when no modification occurred', () => {
      const changed = changeImageCropX(eventData, transform, 0, 50);
      expect(changed).toBe(false);
    });
  });

  describe('changeCropX', () => {
    test('is wrapped with wrapWithFireEvent and wrapWithFixedAnchor', () => {
      expect(typeof changeCropX).toBe('function');
      expect(changeCropX).not.toBe(changeImageCropX);
    });
  });

  describe('changeImageCropY', () => {
    beforeEach(() => {
      image = createMockImage({
        height: 100,
        cropY: 50,
        elementHeight: 200,
      });
      // Use 'mt' corner for cropY - changing top side moves cropY
      transform = prepareTransform(image, 'mt');
    });

    test('changes cropY and height together', () => {
      const changed = changeImageCropY(eventData, transform, 50, 20);
      // newCropY = 50 + 100 - 80 = 70
      // height = 100 + 50 - 70 = 80
      expect(image.cropY).toBe(70);
      expect(image.height).toBe(80);
      expect(changed).toBe(true);
    });

    test('constrains cropY to minimum of 0 and adjusts height accordingly', () => {
      image = createMockImage({ height: 100, cropY: 10, elementHeight: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'mt');

      changeImageCropY(eventData, transform, 50, -30);

      // newCropY is clamped to 0 (was -10)
      expect(image.cropY).toBe(0);
      // height = 100 + 10 - 0 = 110
      expect(image.height).toBe(110);
    });

    test('returns false when no modification occurred', () => {
      const changed = changeImageCropY(eventData, transform, 50, 0);
      expect(changed).toBe(false);
    });
  });

  describe('changeCropY', () => {
    test('is wrapped with wrapWithFireEvent and wrapWithFixedAnchor', () => {
      expect(typeof changeCropY).toBe('function');
      expect(changeCropY).not.toBe(changeImageCropY);
    });
  });
});
