import { expect, test } from '@playwright/test';
import type { Textbox } from 'fabric';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import { TextUtil } from '../../../utils/TextUtil';

setup();

test.describe.configure({ mode: 'serial' });

for (const splitByGrapheme of [true, false]) {
  test(`adding new lines and copy paste - splitByGrapheme: ${splitByGrapheme}`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const canvasUtil = new CanvasUtil(page);
    const textBoxutil = new TextUtil<Textbox>(page, 'text');

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

    const clickPoint = await textBoxutil.getCanvasCursorPositionAt(20);

    await canvasUtil.click({
      position: clickPoint,
      delay: 200,
    });
    await canvasUtil.click({
      position: clickPoint,
      delay: 200,
    });

    await page.mouse.down();
    await page.mouse.move(clickPoint.x + 100, clickPoint.y, { steps: 15 });
    await page.mouse.up();
    await canvasUtil.ctrlC();
    await canvasUtil.click({
      position: clickPoint,
      delay: 200,
    });
    await canvasUtil.press('Enter');
    await canvasUtil.press('Enter');
    await canvasUtil.press('Enter');
    await canvasUtil.press('Enter');
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `2-before-deleting-${splitByGrapheme}.png`,
    });
    await canvasUtil.press('Backspace');
    await canvasUtil.press('Backspace');
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `3-after-deleting-${splitByGrapheme}.png`,
    });
    await canvasUtil.press('a');
    await canvasUtil.press('b');
    await canvasUtil.press('c');
    await canvasUtil.press('Enter');
    await canvasUtil.press('Enter');
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `4-before-pasting-splitByGrapheme-${splitByGrapheme}.png`,
    });
    const pastePoint = await textBoxutil.getCanvasCursorPositionAt(36);
    await canvasUtil.click({
      position: pastePoint,
      delay: 200,
    });
    await canvasUtil.ctrlV();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `5-after-pasting-splitByGrapheme-${splitByGrapheme}.png`,
      maxDiffPixelRatio: 0.03,
    });
  });
}
