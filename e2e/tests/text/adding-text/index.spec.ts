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
    await test.step('initial render', async () => {
      await textBoxutil.executeInBrowser(
        (textbox: Textbox, context) => {
          textbox.splitByGrapheme = context.splitByGrapheme;
          textbox.set('dirty', true);
          textbox.initDimensions();
          textbox.canvas.renderAll();
        },
        { splitByGrapheme },
      );

      await expect(await canvasUtil.screenshot()).toMatchSnapshot({
        name: `1-initial-splitByGrapheme-${splitByGrapheme}.png`,
      });
    });
    await test.step('adding some lines with enterKey', async () => {
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
    });
    await test.step('deleting some of the added lines', async () => {
      // continuos line deletion are a part of the test,
      // an old bug was shifting style and then deleting it all at once
      await canvasUtil.press('Backspace');
      await canvasUtil.press('Backspace');
      await expect(await canvasUtil.screenshot()).toMatchSnapshot({
        name: `3-after-deleting-${splitByGrapheme}.png`,
      });
    });
    await test.step('typing in some text', async () => {
      await canvasUtil.press('a');
      await canvasUtil.press('b');
      await canvasUtil.press('c');
      await canvasUtil.press('Enter');
      await expect(await canvasUtil.screenshot()).toMatchSnapshot({
        name: `4-after-typing-${splitByGrapheme}.png`,
      });
    });
    await test.step('pasting some previously copied text', async () => {
      const pastePoint = await textBoxutil.getCanvasCursorPositionAt(35);
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
    await test.step('adding a new line when there is no style', async () => {
      // go back where we have 2 empty lines, after abc.
      const clickPointEnd = await textBoxutil.getCanvasCursorPositionAt(20);
      await canvasUtil.click({
        position: clickPointEnd,
        delay: 200,
      });
      await page.mouse.down();
      await page.mouse.move(1, clickPointEnd.y + 150, { steps: 15 });
      await page.mouse.up();
      // we remove them because space is finishing
      await canvasUtil.press('Backspace');
      // lets click where style end to show that we can add new line without carrying over
      const clickPointYellow = await textBoxutil.getCanvasCursorPositionAt(45);
      await canvasUtil.click({
        position: clickPointYellow,
        delay: 200,
      });
      await canvasUtil.press('Enter');
      // this part of test is valid if the new line is after a styled char,
      // and there is no style on the part of text that follows, but there is visible text.
      await expect(page).toHaveScreenshot(
        `6-after-adding-a-newline-splitByGrapheme-${splitByGrapheme}.png`,
        {
          clip: {
            x: 0,
            y: clickPointYellow.y - 20,
            width: 120,
            height: 120,
          },
          maxDiffPixelRatio: 0.029,
        },
      );
    });
  });
}
