import { expect, test } from '@playwright/test';
import setup from '../../setup';

setup();

test('codegen', async ({ page }, testInfo) => {
  await test.step('generate test', async () => {
    await test.step('startRecording()', async () => {
      await page.evaluate(() => startRecording());
      await page.hover('canvas_top=#canvas', {
        position: { x: 443, y: 43 },
      });
      await page.mouse.down();
      await page.mouse.move(300, 206, { steps: 10 });
      await page.mouse.up();
    });

    await test.step(`step('1')`, async () => {
      await page.evaluate(() => step('1'));
      await page.hover('canvas_top=#canvas', {
        position: { x: 268, y: 203 },
      });
      await page.mouse.down();
      await page.mouse.move(144, 48, { steps: 10 });
      await page.mouse.up();
    });

    await test.step(`step(), endStep('2')`, async () => {
      await page.evaluate(() => step());
      await page.hover('canvas_top=#canvas', {
        position: { x: 133, y: 72 },
      });
      await page.mouse.down();
      await page.mouse.move(135, 557, { steps: 10 });
      await page.mouse.up();
      await page.evaluate(() => endStep('2'));
    });

    await page.hover('canvas_top=#canvas', {
      position: { x: 228, y: 294 },
    });
    await page.mouse.down();
    await page.mouse.move(475, 292, { steps: 10 });
    await page.mouse.up();

    await test.step('captureScreenshot()', async () => {
      await page.evaluate(() => step('screenshots'));
      await page.evaluate(() => captureScreenshot());
      await page.evaluate(() => captureScreenshot({ name: 'a.png' }));
      await page.evaluate(() => captureScreenshot({ selector: '#canvas' }));
      await page.evaluate(() =>
        captureScreenshot({ name: 'b.png', selector: '#canvas' })
      );
    });

    await test.step('modifier keys', async () => {
      await page.evaluate(() => step('modifier keys'));
      await page.hover('canvas_top=#canvas', {
        position: { x: 475, y: 555 },
      });
      await page.mouse.down();
      await page.keyboard.down('Shift');
      await page.mouse.move(805, 600, { steps: 10 });
      await page.keyboard.press('Alt');
      await page.mouse.move(700, 572, { steps: 10 });
      await page.keyboard.press('Control');
      await page.mouse.move(455, 515, { steps: 10 });
      await page.keyboard.up('Shift');
      await page.mouse.move(469, 417, { steps: 10 });
      await page.mouse.up();
    });

    await test.step('typing', async () => {
      await page.evaluate(() => step('typing'));
      await page.click('canvas_top=#canvas', {
        position: { x: 58, y: 292 },
      });
      await page.keyboard.press('1');
      await page.keyboard.press('2');
      await page.keyboard.press('3');
      await page.keyboard.down('Shift');
      await page.keyboard.press('!');
      await page.keyboard.press('@');
      await page.keyboard.press('#');
      await page.keyboard.up('Shift');
      await page.keyboard.down('Alt');
      await page.keyboard.press('1');
      await page.keyboard.press('2');
      await page.keyboard.press('3');
      await page.keyboard.up('Alt');
      await page.keyboard.down('Control');
      await page.keyboard.press('1');
      await page.keyboard.press('1');
      await page.keyboard.press('2');
      await page.keyboard.press('3');
      await page.keyboard.down('Alt');
      await page.keyboard.press('1');
      await page.keyboard.press('2');
      await page.keyboard.press('3');
      await page.keyboard.up('Alt');
      await page.keyboard.up('Control');
      await page.hover('canvas_top=#canvas', {
        position: { x: 219, y: 256 },
      });
      await page.mouse.down();
      await page.mouse.move(64, 250, { steps: 10 });
      await page.mouse.up();
      await page.keyboard.press('Delete');
      await page.click('canvas_top=#canvas', {
        position: { x: 113, y: 272 },
      });
      await page.click('canvas_top=#canvas', {
        position: { x: 113, y: 272 },
      });
      await page.mouse.dblclick(113, 272);
      await page.keyboard.down('Meta');
      await page.keyboard.press('S');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Meta');
    });
  });
});

test.afterEach(async ({ page }, testInfo) => {
  await test.step('test output', async () => {
    expect(testInfo.attachments).toHaveLength(3);
    expect(testInfo.attachments.map(({ name }) => name)).toMatchObject([
      'codegen_screenshot1.png',
      'recorded events',
      'codegen',
    ]);
    expect(testInfo.attachments[1].body).toMatchSnapshot();
    expect(testInfo.attachments[2].body).toMatchSnapshot();
  });
});
