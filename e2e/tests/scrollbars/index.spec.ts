import { expect, test } from '../../fixtures/base';

test('Scrollbars', async ({ page, canvasUtil }) => {
  await test.step('zoom canvas', async () => {
    await canvasUtil.executeInBrowser((canvas) => {
      canvas.setZoom(2);
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'zoom-double.png',
    });
    await canvasUtil.executeInBrowser((canvas) => {
      canvas.setZoom(0.5);
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'zoom-half.png',
    });
  });

  await test.step('pan canvas', async () => {
    await canvasUtil.executeInBrowser((canvas) => {
      canvas.setZoom(1);
      canvas.absolutePan(new window.fabric.Point(100, 100));
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'pan100.png',
    });
  });
});
