import { expect, test } from '../../../fixtures/base';

test('controls follow the object under a rotated viewport transform', async ({
  canvasUtil,
}) => {
  await canvasUtil.executeInBrowser(async (canvas) => {
    /* Rotate the viewport 45 degrees around the origin without triggering
    the rAF re-render queued by setViewportTransform — that re-render fires
    after the executeInBrowser callback resolves and would erase the
    controls drawn below before playwright takes the screenshot */
    const cos = Math.SQRT1_2;
    const sin = Math.SQRT1_2;
    canvas.viewportTransform = [cos, sin, -sin, cos, 200, 0];
    canvas.calcViewportBoundaries();
    canvas.renderAll();

    /* Recompute oCoords against the rotated viewport, then render the
    selection borders and corner handles on top of the lower canvas */
    const [rect] = canvas.getObjects();
    rect.setCoords();
    rect._renderControls(canvas.contextContainer, {
      borderColor: 'rgb(255, 0, 0)',
      cornerColor: 'rgb(255, 0, 0)',
    });
  });

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'viewport-rotation-controls.png',
  });
});
