import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import data from './data.json';
import data2 from './data2.json';

import '../../../setup';

test.describe('control box rendering', () => {
  [
    { data, title: 'skewY, flipX' },
    { data: data2, title: 'skewY' },
  ].forEach(({ data, title }) => {
    [0, 10].forEach((padding) => {
      test(`${title} and padding of ${padding}`, async ({ page }) => {
        const canvasUtil = new CanvasUtil(page);
        await canvasUtil.executeInBrowser(
          async (canvas, [data, padding]) => {
            await canvas.loadFromJSON(data);
            canvas.skipOffscreen = false;
            canvas.renderAll();
            canvas.getObjects().forEach((object) => {
              object.padding = padding;
              object.borderScaleFactor = 3;
              object.transparentCorners = false;
              const color = object.fill;
              object._renderControls(canvas.contextContainer, {
                borderColor: color,
                cornerColor: color,
              });
              object.getObjects?.().forEach((subTarget) => {
                subTarget.padding = padding;
                subTarget.borderScaleFactor = 3;
                subTarget.transparentCorners = false;
                const color = subTarget.fill;
                subTarget._renderControls(canvas.contextContainer, {
                  borderColor: color,
                  cornerColor: color,
                });
              });
            });
          },
          [data, padding] as const
        );
        expect(await canvasUtil.screenshot()).toMatchSnapshot();
      });
    });
  });
});
