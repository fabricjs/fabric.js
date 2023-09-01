import { CanvasUtil } from '../../../utils/CanvasUtil';
import { expect, test } from '@playwright/test';
import '../../../setup';

const splitByGrapheme = true;

test(`adding new lines and copy paste - splitByGrapheme: ${splitByGrapheme}`, async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const canvasUtil = new CanvasUtil(page);

  await expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: `1-initial-splitByGrapheme-${splitByGrapheme}.png`,
  });
  await canvasUtil.click({
    position: {
      x: 156,
      y: 65,
    },
    delay: 200,
  });
  await canvasUtil.click({
    position: {
      x: 176,
      y: 152,
    },
    delay: 200,
  });
  await page.mouse.down();
  await page.mouse.move(60, 66, { steps: 40 });
  await page.mouse.up();
  await canvasUtil.ctrlC();
  await canvasUtil.click({
    position: {
      x: 176,
      y: 152,
    },
    delay: 200,
  });
  await canvasUtil.press('Enter');
  await canvasUtil.press('Enter');
  await canvasUtil.press('a');
  await canvasUtil.press('b');
  await canvasUtil.press('c');
  await canvasUtil.press('Enter');
  await canvasUtil.press('Enter');
  await expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: `2-before-pasting-splitByGrapheme-${splitByGrapheme}.png`,
  });
  await canvasUtil.ctrlV();
  await expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: `3-after-pasting-splitByGrapheme-${splitByGrapheme}.png`,
  });
  // NOTE: Here is clear that there style bug of #9028 is visible
  await canvasUtil.click({
    position: {
      x: 176,
      y: 152,
    },
    delay: 200,
  });
  await canvasUtil.press('Enter');
  await canvasUtil.press('Enter');
  await expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: `4-after-adding-more-lines-splitByGrapheme-${splitByGrapheme}.png`,
  });
});
