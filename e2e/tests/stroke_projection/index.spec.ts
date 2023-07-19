import { expect, test } from '@playwright/test';
import common from './spec/common';
import miterLimit from './spec/miterLimit';
import singlePoint from './spec/singlePoint';
import { toGroupKey, toKey, toTestName } from './spec/util';
import { executeInBrowser } from '../../utils/executeInBrowser';

import '../../setup';
import { CanvasUtil } from '../../utils/CanvasUtil';

type Pixel = [number, number, number, number];

const blankPixel = [0, 0, 0, 0] as Pixel;

const distanceFromEdge = 2;

test.describe('Stroke Projection', () => {
  test('BBox is correct', async ({ page }, testInfo) => {
    test.setTimeout(120 * 1000);
    [...common, ...miterLimit, ...singlePoint].forEach((spec) => {
      const name = toTestName(spec);
      const key = spec.group ? toGroupKey(spec) : toKey(spec);
      test.step(name, async () => {
        const { width, height, ...borders } = await executeInBrowser(
          page,
          ({ key, distanceFromEdge: d }, { getCanvas, getObject }) => {
            const canvas = getCanvas();
            canvas.clear();
            const target = getObject(key);
            target.controls = {};
            canvas.add(target);
            canvas.setActiveObject(target);
            canvas.viewportCenterObject(target);
            target.setCoords();
            canvas.renderAll();
            const { tl: _tl, br: _br } = target.aCoords;
            const tl = _tl.min(_br);
            const br = _tl.max(_br);
            const w = Math.ceil(br.x - tl.x) + d * 2;
            const h = Math.ceil(br.y - tl.y) + d * 2;
            const ctx = canvas
              .getElement()
              .getContext('2d', { willReadFrequently: true });
            const left = ctx.getImageData(tl.x - d, tl.y - d, 1, h);
            const top = ctx.getImageData(tl.x - d, tl.y - d, w, 1);
            const right = ctx.getImageData(br.x + d, tl.y - d, 1, h);
            const bottom = ctx.getImageData(tl.x - d, br.y + d, w, 1);
            return {
              left: Array.from(left.data),
              top: Array.from(top.data),
              right: Array.from(right.data),
              bottom: Array.from(bottom.data),
              width: w,
              height: h,
            };
          },
          { key, distanceFromEdge }
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
          {} as Record<keyof typeof borders, Pixel>
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
    });
  });
});
