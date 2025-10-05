import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { scalingXOrSkewingY, scalingYOrSkewingX } from './scaleSkew';
import { Point } from '../Point';
import type {
  FabricObject,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../../fabric';
import { Canvas, controlsUtils, Rect } from '../../fabric';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
import { wrapWithFireEvent } from './wrapWithFireEvent';

describe('fabric.controlsUtils', () => {
  let eventData: TPointerEvent;
  let transform: Transform & {
    signX: number;
    signY: number;
    [key: string]: any;
  };
  let target: Rect;

  const canvas = new Canvas(undefined);

  function prepareTransform(
    target: FabricObject,
    corner: string,
  ): Transform & { signX: number; signY: number } {
    // TODO: this method is deprecated and jsdoc says that it should have disappeared before fabric 4?
    const origin = canvas._getOriginFromCorner(target, corner);
    return {
      target,
      corner,
      originX: origin.x,
      originY: origin.y,
      signX: 1,
      signY: 1,
      skewX: 0,
      skewY: 0,
      scaleX: 1,
      scaleY: 1,
    } as Transform & { signX: number; signY: number };
  }

  beforeEach(() => {
    target = new Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      strokeWidth: 0,
    });
    canvas.add(target);
    eventData = {} as TPointerEvent;
  });

  afterEach(() => {
    canvas.off();
    canvas.clear();
  });

  it('scalingXOrSkewingY changes scaleX', () => {
    transform = prepareTransform(target, 'mr');
    scalingXOrSkewingY(eventData, transform, 200, 300);
    expect(Math.round(transform.target.scaleX)).toBe(2);
  });

  it('scalingXOrSkewingY changes scaleX to flip', () => {
    transform = prepareTransform(target, 'mr');
    const returned = scalingXOrSkewingY(eventData, transform, -50, 300);
    expect(transform.target.scaleX).toBe(0.5);
    expect(transform.target.flipX, 'the object flipped X').toBe(true);
    expect(returned, 'action was permitted').toBe(true);
  });

  it('scalingXOrSkewingY blocks scaleX to flip', () => {
    transform = prepareTransform(target, 'mr');
    transform.target.lockScalingFlip = true;
    const returned = scalingXOrSkewingY(eventData, transform, -50, 300);
    expect(transform.target.scaleX).toBe(1);
    expect(transform.target.flipX, 'the object did not flip X').toBe(false);
    expect(returned, 'action was not permitted X').toBe(false);
  });

  it('scalingYOrSkewingX changes scaleY', () => {
    transform = prepareTransform(target, 'mb');
    scalingYOrSkewingX(eventData, transform, 200, 300);
    expect(Math.round(transform.target.scaleY)).toBe(3);
  });

  it('scalingYOrSkewingX changes scaleY to flip', () => {
    transform = prepareTransform(target, 'mb');
    const returned = scalingYOrSkewingX(eventData, transform, 200, -80);
    expect(transform.target.scaleY).toBe(0.8);
    expect(transform.target.flipY, 'the object flipped Y').toBe(true);
    expect(returned, 'action was permitted Y').toBe(true);
  });

  it('scalingYOrSkewingX blocks scaleY to flip', () => {
    transform = prepareTransform(target, 'mb');
    transform.target.lockScalingFlip = true;
    const returned = scalingYOrSkewingX(eventData, transform, 200, -80);
    expect(transform.target.scaleY).toBe(1);
    expect(transform.target.flipY, 'the object did not flip Y').toBe(false);
    expect(returned, 'action was not permitted Y').toBe(false);
  });

  it('scalingXOrSkewingY changes skewY if shift pressed', () => {
    transform = prepareTransform(target, 'mr');
    // @ts-expect-error -- readonly
    eventData.shiftKey = true;
    scalingXOrSkewingY(eventData, transform, 200, 300);
    expect(Math.round(transform.target.skewY)).toBe(81);
    expect(Math.round(transform.target.scaleX)).toBe(1);
  });

  it('scalingYOrSkewingX changes skewX if shift pressed', () => {
    transform = prepareTransform(target, 'mb');
    // @ts-expect-error -- readonly
    eventData.shiftKey = true;
    scalingYOrSkewingX(eventData, transform, 200, 300);
    expect(Math.round(transform.target.skewX)).toBe(76);
    expect(Math.round(transform.target.scaleY)).toBe(1);
  });

  it('skewing Y with existing skewing', () => {
    transform = prepareTransform(target, 'mr');
    transform.target.skewY = 30;
    transform.target.skewY = 45;
    transform.skewX = 45;
    transform.skewY = 15;
    // @ts-expect-error -- readonly
    eventData.shiftKey = true;
    scalingXOrSkewingY(eventData, transform, 200, 300);
    expect(Math.round(transform.target.skewY)).toBe(81);
    expect(Math.round(transform.target.scaleX)).toBe(1);
  });

  it('skewing X with existing skewing', () => {
    transform = prepareTransform(target, 'mb');
    transform.target.skewX = 30;
    transform.target.skewY = 45;

    transform.skewX = 45;
    transform.skewY = 15;
    // @ts-expect-error -- readonly
    eventData.shiftKey = true;
    scalingYOrSkewingX(eventData, transform, 200, 300);
    expect(Math.round(transform.target.skewX)).toBe(72);
    expect(Math.round(transform.target.scaleY)).toBe(1);
  });

  it('scalingXOrSkewingY will fire events on canvas and target', () => {
    transform = prepareTransform(target, 'mr');
    return new Promise<void>((done) => {
      transform.target.scaleX = 1;
      transform.target.canvas!.on('object:scaling', (options) => {
        expect(options.target).toBe(transform.target);
      });
      transform.target.on('scaling', (options) => {
        expect(options).toEqual({
          e: eventData,
          transform: transform,
          pointer: new Point(200, 300),
        });
        done();
      });
      scalingXOrSkewingY(eventData, transform, 200, 300);
    });
  });

  it('wrapWithFireEvent dont trigger event when actionHandler doesnt change anything', () => {
    transform = prepareTransform(target, 'mr');
    transform.target.canvas!.on('object:scaling', () => {
      expect.fail('Should not trigger event');
    });
    const testEventData = { some: 'data' } as unknown as TPointerEvent;
    const x = 15;
    const y = 25;
    const actionHandler: TransformActionHandler<any> = (
      eventDataIn,
      transformIn,
      xIn,
      yIn,
    ) => {
      expect(eventDataIn).toBe(testEventData);
      expect(transformIn).toBe(transform);
      expect(xIn).toBe(x);
      expect(yIn).toBe(y);
      return false;
    };
    const wrapped = wrapWithFireEvent(
      'scaling',
      wrapWithFixedAnchor(actionHandler),
    );
    wrapped(testEventData, transform, x, y);
  });

  const controlKeys = ['ml', 'mt', 'mr', 'mb'] as const;

  controlKeys.forEach((controlKey) => {
    const axis = {
      ml: 'x',
      mt: 'y',
      mr: 'x',
      mb: 'y',
    }[controlKey];

    const AXIS = axis.toUpperCase();
    const signKey = `sign${AXIS}`;
    const scaleKey = `scale${AXIS}`;
    const flipKey = `flip${AXIS}`;
    const isX = axis === 'x';

    it(`scaling ${AXIS} from ${controlKey} keeps the same sign when scale = 0`, () => {
      transform = prepareTransform(target, controlKey);
      const size = transform.target._getTransformedDimensions()[
        axis as keyof Point
      ] as number;
      const factor = 0.5;
      const fn = controlsUtils[
        `scaling${AXIS}` as keyof typeof controlsUtils
      ] as (...args: any[]) => any;
      const exec = (point: Point) => {
        const { target } = transform;
        const origin = target.translateToGivenOrigin(
          target.getRelativeCenterPoint(),
          'center',
          'center',
          transform.originX,
          transform.originY,
        );
        const pointer = point.add(origin);
        fn(eventData, transform, pointer.x, pointer.y);
      };
      const deltaFromControl = new Point(
        Number(isX),
        Number(!isX),
      ).scalarMultiply(size * factor);

      exec(new Point());
      expect(transform[signKey], `${signKey} value after scaling`).toBe(1);
      expect(transform.target, `${flipKey} value after scaling`).toHaveProperty(
        flipKey,
        false,
      );
      expect(
        transform.target[scaleKey as keyof FabricObject],
        `${scaleKey} value after scaling back to origin`,
      ).toBeLessThanOrEqual(0.001);

      exec(deltaFromControl);
      expect(transform[signKey], `${signKey} value after scaling`).toBe(1);
      expect(transform.target, `${flipKey} value after scaling`).toHaveProperty(
        flipKey,
        false,
      );
      expect(
        transform.target,
        `${scaleKey} value after scaling`,
      ).toHaveProperty(scaleKey, factor);

      exec(new Point());
      expect(transform[signKey], `${signKey} value after scaling`).toBe(1);
      expect(transform.target, `${flipKey} value after scaling`).toHaveProperty(
        flipKey,
        false,
      );
      expect(
        transform.target[scaleKey as keyof FabricObject],
        `${scaleKey} value after scaling back to origin`,
      ).toBeLessThanOrEqual(0.001);

      exec(deltaFromControl.scalarMultiply(-1));
      expect(transform[signKey], `${signKey} value after scaling`).toBe(-1);
      expect(transform.target, `${flipKey} value after scaling`).toHaveProperty(
        flipKey,
        true,
      );
      expect(
        transform.target,
        `${scaleKey} value after scaling`,
      ).toHaveProperty(scaleKey, factor);

      exec(new Point());
      expect(transform[signKey], `${signKey} value after scaling`).toBe(-1);
      expect(transform.target, `${flipKey} value after scaling`).toHaveProperty(
        flipKey,
        true,
      );
      expect(
        transform.target[scaleKey as keyof FabricObject],
        `${scaleKey} value after scaling back to origin`,
      ).toBeLessThanOrEqual(0.001);
    });
  });
});
