import type { Transform } from 'fabric';
import { FabricImage, Canvas, Control, Point } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
import {
  changeImageWidth,
  changeImageHeight,
  changeImageCropX,
  changeImageCropY,
  cropPanMoveHandler,
  ghostScalePositionHandler,
  scaleEquallyCropGenerator,
  renderGhostImage,
  changeImageEdgeWidth,
  changeImageEdgeHeight,
} from './croppingHandlers';

import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';

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
    } as unknown as Transform;
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
    img.controls = createImageCroppingControls();

    return img;
  }

  beforeEach(() => {
    canvas = new Canvas();
    image = createMockImage();
    canvas.add(image);
    eventData = {};
    transform = prepareTransform(image, 'mrc');
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
      transform = prepareTransform(image, 'mrc');

      // Try to set width beyond available (200 - 50 = 150 available)
      changeImageWidth(eventData, transform, 500, 50);
      expect(image.width).toBe(150);
    });

    test('constrains width to minimum of 1 (lower limit)', () => {
      image = createMockImage({ width: 100, cropX: 50, elementWidth: 200 });
      transform = prepareTransform(image, 'mrc');
      changeImageWidth(eventData, transform, 0.1, 50);
      expect(image.width).toBe(1);
    });

    test('returns false when no modification occurred', () => {
      image = createMockImage({
        width: 100,
        cropX: 50,
        elementWidth: 200,
      });
      transform = prepareTransform(image, 'mrc');
      const changed = changeImageWidth(eventData, transform, 200, 50);
      expect(changed).toBe(true);
      const changed2 = changeImageWidth(eventData, transform, 200, 50);
      expect(changed2).toBe(false);
    });
  });

  describe('changeImageHeight', () => {
    beforeEach(() => {
      image = createMockImage({
        height: 100,
        cropY: 50,
        elementHeight: 200,
      });
      transform = prepareTransform(image, 'mbc');
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

  describe('changeImageCropX', () => {
    beforeEach(() => {
      image = createMockImage({
        width: 100,
        cropX: 50,
        elementWidth: 200,
      });
      // Use 'ml' corner for cropX - changing left side moves cropX
      transform = prepareTransform(image, 'mlc');
    });

    test('changes cropX and width together', () => {
      const changed = changeImageCropX(eventData, transform, 20, 50);
      expect(image.cropX).toBe(70);
      expect(image.width).toBe(80);
      expect(changed).toBe(true);
    });

    test('constrains cropX to minimum of 0 and adjusts width accordingly', () => {
      image = createMockImage({ width: 100, cropX: 10, elementWidth: 200 });
      transform = prepareTransform(image, 'mlc');

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

  describe('changeImageCropY', () => {
    beforeEach(() => {
      image = createMockImage({
        height: 100,
        cropY: 50,
        elementHeight: 200,
      });
      // Use 'mt' corner for cropY - changing top side moves cropY
      transform = prepareTransform(image, 'mtc');
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
      transform = prepareTransform(image, 'mtc');

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

  describe('cropPanMoveHandler', () => {
    beforeEach(() => {
      image = createMockImage({
        width: 100,
        height: 100,
        cropX: 50,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
    });

    test('pans the image by adjusting cropX and cropY', () => {
      const original = {
        left: image.left,
        top: image.top,
        cropX: image.cropX,
        cropY: image.cropY,
      };

      // Simulate moving the image 10px to the right and 10px down
      image.left = original.left + 10;
      image.top = original.top + 10;

      const moveEvent = {
        transform: {
          target: image,
          original,
        } as unknown as Transform,
      };

      cropPanMoveHandler(moveEvent as any);

      // cropX should decrease (panning right means showing more of the left side)
      expect(image.cropX).toBeLessThan(original.cropX);
      // cropY should decrease (panning down means showing more of the top)
      expect(image.cropY).toBeLessThan(original.cropY);
      // Position should be restored to original
      expect(image.left).toBe(original.left);
      expect(image.top).toBe(original.top);
    });

    test('constrains cropX to minimum of 0', () => {
      const original = {
        left: image.left,
        top: image.top,
        cropX: 10,
        cropY: 50,
      };
      image.cropX = 10;

      // Move far right to try to get negative cropX
      image.left = original.left + 100;
      image.top = original.top;

      const moveEvent = {
        transform: {
          target: image,
          original,
        } as unknown as Transform,
      };

      cropPanMoveHandler(moveEvent as any);

      expect(image.cropX).toBeGreaterThanOrEqual(0);
    });

    test('constrains cropY to minimum of 0', () => {
      const original = {
        left: image.left,
        top: image.top,
        cropX: 50,
        cropY: 10,
      };
      image.cropY = 10;

      // Move far down to try to get negative cropY
      image.left = original.left;
      image.top = original.top + 100;

      const moveEvent = {
        transform: {
          target: image,
          original,
        } as unknown as Transform,
      };

      cropPanMoveHandler(moveEvent as any);

      expect(image.cropY).toBeGreaterThanOrEqual(0);
    });

    test('constrains cropX so crop area stays within element bounds', () => {
      const original = {
        left: image.left,
        top: image.top,
        cropX: 150, // Near the right edge (element is 300px wide)
        cropY: 50,
      };
      image.cropX = 150;

      // Move far left to try to exceed element width
      image.left = original.left - 200;
      image.top = original.top;

      const moveEvent = {
        transform: {
          target: image,
          original,
        } as unknown as Transform,
      };

      cropPanMoveHandler(moveEvent as any);

      // cropX + width should not exceed element width
      expect(image.cropX + image.width).toBeLessThanOrEqual(300);
    });

    test('constrains cropY so crop area stays within element bounds', () => {
      const original = {
        left: image.left,
        top: image.top,
        cropX: 50,
        cropY: 150, // Near the bottom edge (element is 300px tall)
      };
      image.cropY = 150;

      // Move far up to try to exceed element height
      image.left = original.left;
      image.top = original.top - 200;

      const moveEvent = {
        transform: {
          target: image,
          original,
        } as unknown as Transform,
      };

      cropPanMoveHandler(moveEvent as any);

      // cropY + height should not exceed element height
      expect(image.cropY + image.height).toBeLessThanOrEqual(300);
    });
  });

  describe('ghostScalePositionHandler', () => {
    beforeEach(() => {
      image = createMockImage({
        width: 100,
        height: 100,
        cropX: 50,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
    });

    test('positions top-left corner control correctly', () => {
      const control = new Control({ x: -0.5, y: -0.5 });
      const result = ghostScalePositionHandler.call(
        control,
        new Point(100, 100),
        [1, 2, 3, 4, 5, 6], // this matrix is not used
        image,
      );

      expect(result).toEqual({ x: -50, y: -50 });
    });

    test('positions bottom-right corner control correctly', () => {
      const control = new Control({ x: 0.5, y: 0.5 });
      const result = ghostScalePositionHandler.call(
        control,
        new Point(100, 100),
        [1, 2, 3, 4, 5, 6], // this matrix is not used
        image,
      );

      expect(result).toEqual({ x: 250, y: 250 });
    });

    test('positions top-right corner control correctly', () => {
      const control = new Control({ x: 0.5, y: -0.5 });
      const result = ghostScalePositionHandler.call(
        control,
        new Point(100, 100),
        [1, 2, 3, 4, 5, 6], // this matrix is not used
        image,
      );

      expect(result).toEqual({ x: 250, y: -50 });
    });

    test('positions bottom-left corner control correctly', () => {
      const control = new Control({ x: -0.5, y: 0.5 });
      const result = ghostScalePositionHandler.call(
        control,
        new Point(100, 100),
        [1, 2, 3, 4, 5, 6], // this matrix is not used
        image,
      );

      expect(result).toEqual({ x: -50, y: 250 });
    });
  });

  describe('scaleEquallyCropGenerator', () => {
    beforeEach(() => {
      image = createMockImage({
        width: 100,
        height: 100,
        cropX: 50,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
    });

    test('returns a TransformActionHandler function', () => {
      const handler = scaleEquallyCropGenerator(-0.5, -0.5);
      expect(typeof handler).toBe('function');
    });

    test('scales image uniformly from top-left corner', () => {
      const handler = scaleEquallyCropGenerator(-0.5, -0.5);
      transform = prepareTransform(image, 'tls');
      expect(image.scaleX).toBe(1);
      // Simulate dragging to scale up
      const result = handler(eventData, transform, -400, -400);

      // The handler should return a boolean
      expect(result).toBe(true);
      expect(image.scaleX.toFixed(2)).toBe('2.17');
      expect(image.scaleX).toBe(image.scaleY);
    });

    test('scales image uniformly from bottom-right corner', () => {
      const handler = scaleEquallyCropGenerator(0.5, 0.5);
      transform = prepareTransform(image, 'brs');
      expect(image.scaleX).toBe(1);
      const result = handler(eventData, transform, 400, 400);
      expect(result).toBe(true);
      expect(image.scaleX).toBe(1.5);
      expect(image.scaleX).toBe(image.scaleY);
    });

    test('returns false when scaling would exceed element bounds', () => {
      // Set up image near the edge of element
      image = createMockImage({
        width: 250,
        height: 250,
        cropX: 25,
        cropY: 25,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);

      const handler = scaleEquallyCropGenerator(-0.5, -0.5);
      transform = prepareTransform(image, 'tls');

      // Try to scale down significantly which might push bounds
      const result = handler(eventData, transform, 10, 10);

      expect(result).toBe(false);
    });

    test('adjusts cropX and cropY when scaling from negative corner', () => {
      image = createMockImage({
        width: 90,
        height: 90,
        cropX: 25,
        cropY: 25,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      const handler = scaleEquallyCropGenerator(-0.5, -0.5);
      transform = prepareTransform(image, 'tls');
      expect(image.cropX).toBe(25);
      expect(image.cropY).toBe(25);
      const result = handler(eventData, transform, 5, 5);
      expect(result).toBe(true);
      // When scaling from top-left, cropX and cropY should be recalculated
      expect(image.cropX).toBe(0);
      expect(image.cropY).toBe(0);
    });
  });

  describe('renderGhostImage', () => {
    beforeEach(() => {
      image = createMockImage({
        width: 100,
        height: 100,
        cropX: 50,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
    });

    test('draws image at correct position based on crop values', () => {
      const mockCtx = {
        globalAlpha: 1,
        drawImage: vi.fn(),
      } as unknown as CanvasRenderingContext2D;

      renderGhostImage.call(image, { ctx: mockCtx });

      // Should draw at (-width/2 - cropX, -height/2 - cropY)
      // = (-50 - 50, -50 - 50) = (-100, -100)
      expect(mockCtx.drawImage).toHaveBeenCalledWith(
        image._element,
        -100,
        -100,
      );
    });

    test('temporarily reduces globalAlpha by 50%', () => {
      let alphaWhenDrawing: number | undefined;
      const mockCtx = {
        globalAlpha: 0.8,
        drawImage: vi.fn(() => {
          alphaWhenDrawing = mockCtx.globalAlpha;
        }),
      } as unknown as CanvasRenderingContext2D;

      renderGhostImage.call(image, { ctx: mockCtx });

      // During draw, alpha should be 0.8 * 0.5 = 0.4
      expect(alphaWhenDrawing).toBe(0.4);
      // After render, alpha should be restored
      expect(mockCtx.globalAlpha).toBe(0.8);
    });
  });

  describe('changeImageEdgeWidth', () => {
    function prepareEdgeTransform(
      target: FabricImage,
      originX: 'left' | 'center' | 'right',
      originY: 'top' | 'center' | 'bottom',
      corner = 'mr',
    ): Transform {
      target.controls[corner] = new Control({
        x: originX === 'left' ? 0.5 : originX === 'right' ? -0.5 : 0,
        y: originY === 'top' ? 0.5 : originY === 'bottom' ? -0.5 : 0,
      });
      return {
        target,
        corner,
        originX,
        originY,
        width: target.width,
        height: target.height,
        original: {
          cropX: target.cropX,
          cropY: target.cropY,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
        },
      } as unknown as Transform;
    }

    test('increases width within available space (right edge)', () => {
      // 100px wide, cropX=50, element=300 -> 150px available on right
      image = createMockImage({
        width: 100,
        height: 100,
        cropX: 50,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'left', 'center');

      const changed = changeImageEdgeWidth(eventData, transform, 180, 50);
      expect(changed).toBe(true);
      expect(image.width).toBeGreaterThan(100);
      expect(image.scaleX).toBe(1);
    });

    test('constrains width to element boundary (right edge)', () => {
      image = createMockImage({
        width: 100,
        cropX: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'left', 'center');

      changeImageEdgeWidth(eventData, transform, 500, 50);
      expect(image.width).toBeLessThanOrEqual(250); // 300 - 50
    });

    test('triggers cover scale when beyond element bounds', () => {
      // Already at max width, no crop space left
      image = createMockImage({
        width: 300,
        height: 200,
        cropX: 0,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'left', 'center');

      changeImageEdgeWidth(eventData, transform, 500, 100);
      expect(image.scaleX).toBeGreaterThan(1);
      expect(image.scaleX).toBe(image.scaleY); // uniform
      expect(image.width).toBe(300);
    });

    test('expands into cropX space (left edge)', () => {
      image = createMockImage({
        width: 100,
        cropX: 100,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'right', 'center');

      changeImageEdgeWidth(eventData, transform, -250, 50);
      expect(image.cropX).toBe(0);
      expect(image.width).toBe(200); // original 100 + cropX 100
    });

    test('triggers cover scale from left edge when cropX exhausted', () => {
      image = createMockImage({
        width: 200,
        height: 200,
        cropX: 0,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'right', 'center');

      changeImageEdgeWidth(eventData, transform, -400, 100);
      expect(image.scaleX).toBeGreaterThan(1);
      expect(image.cropX).toBe(0);
    });
  });

  describe('changeImageEdgeHeight', () => {
    function prepareEdgeTransform(
      target: FabricImage,
      originX: 'left' | 'center' | 'right',
      originY: 'top' | 'center' | 'bottom',
      corner = 'mb',
    ): Transform {
      target.controls[corner] = new Control({
        x: originX === 'left' ? 0.5 : originX === 'right' ? -0.5 : 0,
        y: originY === 'top' ? 0.5 : originY === 'bottom' ? -0.5 : 0,
      });
      return {
        target,
        corner,
        originX,
        originY,
        width: target.width,
        height: target.height,
        original: {
          cropX: target.cropX,
          cropY: target.cropY,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
        },
      } as unknown as Transform;
    }

    test('increases height within available space (bottom edge)', () => {
      image = createMockImage({
        width: 100,
        height: 100,
        cropX: 50,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'center', 'top');

      changeImageEdgeHeight(eventData, transform, 50, 180);
      expect(image.height).toBeGreaterThan(100);
      expect(image.scaleY).toBe(1);
    });

    test('constrains height to element boundary (bottom edge)', () => {
      image = createMockImage({
        height: 100,
        cropY: 50,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'center', 'top');

      changeImageEdgeHeight(eventData, transform, 50, 500);
      expect(image.height).toBeLessThanOrEqual(250); // 300 - 50
    });

    test('triggers cover scale when beyond element bounds', () => {
      image = createMockImage({
        width: 200,
        height: 300,
        cropX: 50,
        cropY: 0,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'center', 'top');

      changeImageEdgeHeight(eventData, transform, 100, 500);
      expect(image.scaleY).toBeGreaterThan(1);
      expect(image.scaleX).toBe(image.scaleY); // uniform
      expect(image.height).toBe(300);
    });

    test('expands into cropY space (top edge)', () => {
      image = createMockImage({
        height: 100,
        cropY: 100,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'center', 'bottom');

      changeImageEdgeHeight(eventData, transform, 50, -250);
      expect(image.cropY).toBe(0);
      expect(image.height).toBe(200); // original 100 + cropY 100
    });

    test('triggers cover scale from top edge when cropY exhausted', () => {
      image = createMockImage({
        width: 200,
        height: 200,
        cropX: 50,
        cropY: 0,
        elementWidth: 300,
        elementHeight: 300,
      });
      canvas.add(image);
      transform = prepareEdgeTransform(image, 'center', 'bottom');

      changeImageEdgeHeight(eventData, transform, 100, -400);
      expect(image.scaleY).toBeGreaterThan(1);
      expect(image.cropY).toBe(0);
    });
  });
});
