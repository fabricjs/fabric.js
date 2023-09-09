import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import data from './data.json';

import '../../../setup';

test.describe('control boxes with skewY, flipX and padding', () => {
  [0, 10].forEach((padding) => {
    test(`with padding of ${padding}`, async ({ page }) => {
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
            object.subTargetCheck = true;
            object.setCoords();
            const color = object.fill;
            object._renderControls(canvas.contextContainer, {
              borderColor: color,
              cornerColor: color,
            });
            object.getObjects?.().forEach((subTarget) => {
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
