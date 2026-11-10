import { expect, test } from '../../../fixtures/base';

test('SprayBrush dots stay in place on mouse up (#7056)', async ({
  page,
  canvasUtil,
}) => {
  await page.evaluate(() => {
    // Keep the spray deterministic for the visual snapshot.
    let seed = 7056;
    Math.random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  });

  const box = (await canvasUtil.upperCanvas.boundingBox())!;
  await page.mouse.move(box.x + 60, box.y + 150);
  await page.mouse.down();
  for (const [x, y] of [
    [90, 110],
    [120, 100],
    [150, 130],
    [180, 170],
    [210, 190],
    [240, 150],
  ]) {
    await page.mouse.move(box.x + x, box.y + y);
  }
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'spray-large-dots.png',
  });

  await page.mouse.up();
  await canvasUtil.renderAll();
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'spray-large-dots.png',
    maxDiffPixelRatio: 0.005,
  });
});
