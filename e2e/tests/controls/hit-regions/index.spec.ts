import { expect, test } from '@playwright/test';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';
setup();

for (const vpt of [
  undefined,
  { angle: -30 },
  { scaleX: 2, scaleY: 0.5, width: 500 },
] as const) {
  test(`Control hit regions with viewport of ${JSON.stringify(
    vpt,
    null,
    2
  )}`, async ({ page }) => {
    const canvasUtil = new CanvasUtil(page);
    await canvasUtil.executeInBrowser((canvas, vpt) => {
      const rect = canvas.getActiveObject();
      const center = rect.getCenterPoint();
      vpt &&
        canvas.setViewportTransform(
          fabric.util.multiplyTransformMatrixArray([
            fabric.util.createTranslateMatrix(center.x, center.y),
            fabric.util.composeMatrix(vpt),
            fabric.util.createTranslateMatrix(-center.x, -center.y),
          ])
        );
      vpt?.width && canvas.setDimensions({ width: vpt.width });
      canvas.viewportCenterObject(rect);
      const render = ({ x, y }: fabric.Point, fill: string) => {
        const ctx = canvas.getTopContext();
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      };
      for (let y = 0; y <= canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const point = new fabric.Point(x, y);
          rect._findTargetCorner(point, true) && render(point, 'indigo');
          rect._findTargetCorner(point) && render(point, 'magenta');
        }
      }
    }, vpt);
    expect(await new CanvasUtil(page).screenshot()).toMatchSnapshot();
  });
}
