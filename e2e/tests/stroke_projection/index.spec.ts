import { expect, test } from '@playwright/test';
import common from './spec/common';
import { toKeyName, toTestName } from './spec/util';
import { executeInBrowser } from '../../utils/executeInBrowser';

import '../../setup';

type Pixel = [number, number, number, number];

const blankPixel = [0, 0, 0, 0] as Pixel;

test.describe('Stroke Projection', () => {
  test('BBox is correct', async ({ page }) => {
    test.setTimeout(60 * 1000);
    common.forEach((spec) => {
      test.step(toTestName(spec), async () => {
        const { width, height, ...borders } = await executeInBrowser(
          page,
          ({ key }, { getCanvas, getObject }) => {
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
            const d = 2;
            const tl = _tl.min(_br);
            const br = _tl.max(_br);
            const w = Math.ceil(br.x - tl.x) + d * 2;
            const h = Math.ceil(br.y - tl.y) + d * 2;
            const left = canvas
              .getContext()
              .getImageData(tl.x - d, tl.y - d, 1, h);
            const top = canvas
              .getContext()
              .getImageData(tl.x - d, tl.y - d, w, 1);
            const right = canvas
              .getContext()
              .getImageData(br.x + d, tl.y - d, 1, h);
            const bottom = canvas
              .getContext()
              .getImageData(tl.x - d, br.y + d, w, 1);

            return {
              left: Array.from(left.data),
              top: Array.from(top.data),
              right: Array.from(right.data),
              bottom: Array.from(bottom.data),
              width: w,
              height: h,
            };
          },
          { key: toKeyName(spec) }
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

        expect(pixels).toMatchObject({
          left: new Array(height).fill(blankPixel),
          top: new Array(width).fill(blankPixel),
          right: new Array(height).fill(blankPixel),
          bottom: new Array(width).fill(blankPixel),
        });
      });
    });
  });
});
