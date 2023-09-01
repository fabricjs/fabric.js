import { CanvasUtil } from '../../../utils/CanvasUtil';
import { expect, test } from '@playwright/test';
import { ObjectUtil } from '../../../utils/ObjectUtil';
import type { Textbox } from 'fabric';
import '../../../setup';

[false, true].forEach((splitByGrapheme) => {
  test(`adding new lines and copy paste - splitByGrapheme: ${splitByGrapheme}`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const canvasUtil = new CanvasUtil(page);
    const textBoxutil = new ObjectUtil(page, 'text');

    await textBoxutil.executeInBrowser(
      (textbox: Textbox, context) => {
        textbox.splitByGrapheme = context.splitByGrapheme;
        textbox.set('dirty', true);
        textbox.initDimensions();
        textbox.canvas.renderAll();
      },
      { splitByGrapheme }
    );

    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `1-initial-splitByGrapheme-${splitByGrapheme}.png`,
    });
    await canvasUtil.click({
      position: {
        x: 50,
        y: 65,
      },
      delay: 200,
    });
    await canvasUtil.click({
      position: {
        x: 50,
        y: 65,
      },
      delay: 200,
    });
    await page.mouse.down();
    await page.mouse.move(65, 120, { steps: 15 });
    await page.mouse.up();
    await canvasUtil.ctrlC();
    await canvasUtil.click({
      position: {
        x: 176,
        y: 65,
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
    // NOTE: Here is clear that there style bug of #9028 is visible splitbygrapheme true only
    // to be triggered the copy paste has to happen across lines
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
});
