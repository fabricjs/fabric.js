import type { Page, TestInfo } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';
import common from './spec/common';
import miterLimit from './spec/miterLimit';
import singlePoint from './spec/singlePoint';
import type { TestSpec } from './spec/util';
import { toGroupKey, toKey, toTestName } from './spec/util';

import '../../setup';

type Pixel = [number, number, number, number];

const blankPixel = [0, 0, 0, 0] as Pixel;

const distanceFromEdge = 2;

function runStep(page: Page, testInfo: TestInfo, spec: TestSpec) {
  return test.step(toTestName(spec), async () => {
    const key = spec.group ? toGroupKey(spec) : toKey(spec);
    const { width, height, ...borders } = await page.evaluate(
      (spec) =>
        testProjection(spec) as {
          left: number[];
          top: number[];
          right: number[];
          bottom: number[];
          width: number;
          height: number;
        },
      { ...spec, distanceFromEdge }
    );
    const pixels = Object.entries(borders).reduce(
      (bordersOut, [key, imageData]) => {
        const pixels = [];
        for (let index = 0; index < imageData.length; index += 4) {
          pixels.push(imageData.slice(index, index + 4));
        }
        bordersOut[key] = pixels;
        return bordersOut;
      },
      {} as Record<'left' | 'top' | 'right' | 'bottom', Pixel>
    );

    try {
      expect(pixels).toMatchObject({
        left: new Array(height).fill(blankPixel),
        top: new Array(width).fill(blankPixel),
        right: new Array(height).fill(blankPixel),
        bottom: new Array(width).fill(blankPixel),
      });
    } catch (error) {
      await testInfo.attach(key, {
        body: await new CanvasUtil(page).screenshot(),
        contentType: 'image/png',
      });
      throw error;
    }
  });
}

test.describe('Stroke Projection', () => {
  common.forEach(({ type, tests }) => {
    test(`${type} BBox is correct`, async ({ page }, testInfo) => {
      testInfo.setTimeout(60 * 1000);
      await Promise.all(tests.map((spec) => runStep(page, testInfo, spec)));
    });
    test(`${type} BBox is correct in group`, async ({ page }, testInfo) => {
      testInfo.setTimeout(60 * 1000);
      await Promise.all(
        tests.map((spec) => runStep(page, testInfo, { ...spec, group: true }))
      );
    });
  });

  test('miter limit BBox is correct', async ({ page }, testInfo) => {
    await Promise.all(miterLimit.map((spec) => runStep(page, testInfo, spec)));
  });

  test('single point BBox is correct', async ({ page }, testInfo) => {
    await Promise.all(singlePoint.map((spec) => runStep(page, testInfo, spec)));
  });
});
