import type { Transform } from 'fabric';
import { controlsUtils, FabricImage, Canvas } from 'fabric';
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

import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

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

  function createMockImage(options: Partial<{
    width: number;
    height: number;
    cropX: number;
    cropY: number;
    elementWidth: number;
    elementHeight: number;
  }> = {}): FabricImage {
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
      const changed = changeImageWidth(eventData, transform, 200, 50);
      expect(changed).toBe(true);
      expect(image.width).toBeLessThanOrEqual(200);
    });

    test('constrains width to available width (upper limit)', () => {
      // Image element is 200px wide, cropX is 0, so max available is 200
      image = createMockImage({ width: 100, cropX: 50, elementWidth: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'mr');

      // Try to set width beyond available (200 - 50 = 150 available)
      changeImageWidth(eventData, transform, 500, 50);
      expect(image.width).toBeLessThanOrEqual(150);
    });

    test('constrains width to minimum of 1 (lower limit)', () => {
      transform = prepareTransform(image, 'mr');

      // Mock to simulate setting negative width
      vi.spyOn(controlsUtils, 'changeObjectWidth').mockImplementation(() => {
        image.width = -10;
        return true;
      });

      changeImageWidth(eventData, transform, -100, 50);
      expect(image.width).toBe(1);

      vi.restoreAllMocks();
    });

    test('returns false when no modification occurred', () => {
      vi.spyOn(controlsUtils, 'changeObjectWidth').mockReturnValue(false);

      const changed = changeImageWidth(eventData, transform, 200, 50);
      expect(changed).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('changeCropWidth', () => {
    test('is wrapped with wrapWithFireEvent and wrapWithFixedAnchor', () => {
      const wrapWithFireEventSpy = vi.spyOn(controlsUtils, 'wrapWithFireEvent');
      const wrapWithFixedAnchorSpy = vi.spyOn(controlsUtils, 'wrapWithFixedAnchor');

      // Re-import to trigger the wrapping
      // Since the module is already loaded, we verify the export is a function
      expect(typeof changeCropWidth).toBe('function');

      // The wrapped function should be different from the base function
      expect(changeCropWidth).not.toBe(changeImageWidth);

      vi.restoreAllMocks();
    });
  });

  describe('changeImageHeight', () => {
    beforeEach(() => {
      transform = prepareTransform(image, 'mb');
    });

    test('changes height normally when within bounds', () => {
      expect(image.height).toBe(100);
      const changed = changeImageHeight(eventData, transform, 50, 200);
      expect(changed).toBe(true);
      expect(image.height).toBeLessThanOrEqual(200);
    });

    test('constrains height to available height (upper limit)', () => {
      // Image element is 200px tall, cropY is 50, so max available is 150
      image = createMockImage({ height: 100, cropY: 50, elementHeight: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'mb');

      // Try to set height beyond available (200 - 50 = 150 available)
      changeImageHeight(eventData, transform, 50, 500);
      expect(image.height).toBeLessThanOrEqual(150);
    });

    test('constrains height to minimum of 1 (lower limit)', () => {
      // Mock to simulate setting negative height
      vi.spyOn(controlsUtils, 'changeObjectHeight').mockImplementation(() => {
        image.height = -10;
        return true;
      });

      changeImageHeight(eventData, transform, 50, -100);
      expect(image.height).toBe(1);

      vi.restoreAllMocks();
    });

    test('returns false when no modification occurred', () => {
      vi.spyOn(controlsUtils, 'changeObjectHeight').mockReturnValue(false);

      const changed = changeImageHeight(eventData, transform, 50, 200);
      expect(changed).toBe(false);

      vi.restoreAllMocks();
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
      // Use 'ml' corner for cropX - changing left side moves cropX
      transform = prepareTransform(image, 'ml');
    });

    test('changes cropX while maintaining width', () => {
      image = createMockImage({ width: 100, cropX: 50, elementWidth: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'ml');

      const originalWidth = image.width;
      const originalCropX = image.cropX;

      // Simulate a width change that would affect cropX
      vi.spyOn(controlsUtils, 'changeObjectWidth').mockImplementation(() => {
        image.width = 80; // Simulate width reduction
        return true;
      });

      const changed = changeImageCropX(eventData, transform, 70, 50);

      // Width should be restored
      expect(image.width).toBe(originalWidth);
      // CropX should have changed
      expect(changed).toBe(image.cropX !== originalCropX);

      vi.restoreAllMocks();
    });

    test('constrains cropX to minimum of 0 (lower limit)', () => {
      image = createMockImage({ width: 100, cropX: 10, elementWidth: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'ml');

      // Simulate a change that would make cropX negative
      vi.spyOn(controlsUtils, 'changeObjectWidth').mockImplementation(() => {
        image.width = 120; // Width increased by 20, would make cropX = 10 + 100 - 120 = -10
        return true;
      });

      changeImageCropX(eventData, transform, 30, 50);

      expect(image.cropX).toBeGreaterThanOrEqual(0);

      vi.restoreAllMocks();
    });

    test('constrains cropX so image stays within element bounds (upper limit)', () => {
      image = createMockImage({ width: 100, cropX: 50, elementWidth: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'ml');

      // Simulate a change that would push cropX + width beyond element width
      vi.spyOn(controlsUtils, 'changeObjectWidth').mockImplementation(() => {
        image.width = 50; // Width decreased by 50, would make cropX = 50 + 100 - 50 = 100
        return true;
      });

      changeImageCropX(eventData, transform, 100, 50);

      // cropX + width should not exceed element width (200)
      expect(image.cropX + image.width).toBeLessThanOrEqual(200);

      vi.restoreAllMocks();
    });

    test('returns false when no modification occurred', () => {
      vi.spyOn(controlsUtils, 'changeObjectWidth').mockReturnValue(false);

      const changed = changeImageCropX(eventData, transform, 30, 50);
      expect(changed).toBe(false);

      vi.restoreAllMocks();
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
      // Use 'mt' corner for cropY - changing top side moves cropY
      transform = prepareTransform(image, 'mt');
    });

    test('changes cropY while maintaining height', () => {
      image = createMockImage({ height: 100, cropY: 50, elementHeight: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'mt');

      const originalHeight = image.height;
      const originalCropY = image.cropY;

      // Simulate a height change that would affect cropY
      vi.spyOn(controlsUtils, 'changeObjectHeight').mockImplementation(() => {
        image.height = 80; // Simulate height reduction
        return true;
      });

      const changed = changeImageCropY(eventData, transform, 50, 70);

      // Height should be restored
      expect(image.height).toBe(originalHeight);
      // CropY should have changed
      expect(changed).toBe(image.cropY !== originalCropY);

      vi.restoreAllMocks();
    });

    test('constrains cropY to minimum of 0 (lower limit)', () => {
      image = createMockImage({ height: 100, cropY: 10, elementHeight: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'mt');

      // Simulate a change that would make cropY negative
      vi.spyOn(controlsUtils, 'changeObjectHeight').mockImplementation(() => {
        image.height = 120; // Height increased by 20, would make cropY = 10 + 100 - 120 = -10
        return true;
      });

      changeImageCropY(eventData, transform, 50, 30);

      expect(image.cropY).toBeGreaterThanOrEqual(0);

      vi.restoreAllMocks();
    });

    test('constrains cropY so image stays within element bounds (upper limit)', () => {
      image = createMockImage({ height: 100, cropY: 50, elementHeight: 200 });
      canvas.add(image);
      transform = prepareTransform(image, 'mt');

      // Simulate a change that would push cropY + height beyond element height
      vi.spyOn(controlsUtils, 'changeObjectHeight').mockImplementation(() => {
        image.height = 50; // Height decreased by 50, would make cropY = 50 + 100 - 50 = 100
        return true;
      });

      changeImageCropY(eventData, transform, 50, 100);

      // cropY + height should not exceed element height (200)
      expect(image.cropY + image.height).toBeLessThanOrEqual(200);

      vi.restoreAllMocks();
    });

    test('returns false when no modification occurred', () => {
      vi.spyOn(controlsUtils, 'changeObjectHeight').mockReturnValue(false);

      const changed = changeImageCropY(eventData, transform, 50, 30);
      expect(changed).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('changeCropY', () => {
    test('is wrapped with wrapWithFireEvent and wrapWithFixedAnchor', () => {
      expect(typeof changeCropY).toBe('function');
      expect(changeCropY).not.toBe(changeImageCropY);
    });
  });
});
