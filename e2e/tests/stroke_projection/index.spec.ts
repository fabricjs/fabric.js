import type { Page, TestInfo } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { promiseSequence } from '../../utils/promiseSequence';
import common from './spec/common';
import miterLimit from './spec/miterLimit';
import singlePoint from './spec/singlePoint';
import type { TestSpec } from './spec/util';
import { toGroupKey, toKey, toTestName } from './spec/util';

import '../../setup';

type Pixel = [number, number, number, number];

const blankPixel = [0, 0, 0, 0] as Pixel;

const distanceFromEdge = 2;

type SampledBorders = {
  left: number[];
  top: number[];
  right: number[];
  bottom: number[];
  width: number;
  height: number;
};

function runStep(page: Page, testInfo: TestInfo, spec: TestSpec) {
  return test.step(toTestName(spec), async () => {
    const key = spec.group ? toGroupKey(spec) : toKey(spec);
    const {
      inner: { width: w, height: h, ...inner },
      outer: { width, height, ...outer },
    } = await page.evaluate(
      (spec) =>
        testProjection(spec) as {
          outer: SampledBorders;
          inner: SampledBorders;
        },
      { ...spec, distanceFromEdge }
    );

    const innerBorders = Object.entries(inner).reduce(
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

    const outerBorders = Object.entries(outer).reduce(
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
      expect(outerBorders).toMatchObject({
        left: new Array(height).fill(blankPixel),
        top: new Array(width).fill(blankPixel),
        right: new Array(height).fill(blankPixel),
        bottom: new Array(width).fill(blankPixel),
      });

      expect(innerBorders).not.toEqual({
        left: new Array(h).fill(blankPixel),
        top: new Array(w).fill(blankPixel),
        right: new Array(h).fill(blankPixel),
        bottom: new Array(w).fill(blankPixel),
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
  test('BBox is correct', async ({ page }, testInfo) => {
    testInfo.setTimeout(120 * 1000);
    await promiseSequence(
      [...common, ...miterLimit, ...singlePoint].map(
        (spec) => () => runStep(page, testInfo, spec)
      )
    );
  });
  test.fixme('BBox is correct for group', async ({ page }, testInfo) => {
    testInfo.setTimeout(120 * 1000);
    await promiseSequence(
      [...common, ...miterLimit, ...singlePoint].map(
        (spec) => () => runStep(page, testInfo, { ...spec, group: true })
      )
    );
  });
});
