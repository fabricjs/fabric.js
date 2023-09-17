import { expect, test } from '@playwright/test';
import { existsSync, rmSync } from 'fs';
import setup, { setupCodegen } from '../../setup';

setup();
// run also in CI
setupCodegen();

// clear snapshots so we can test snapshot generation
test.beforeEach(async ({ page }, testInfo) => {
  ['a.png', 'b.png', 'codegen-1.png', 'codegen-2.png'].forEach((name) => {
    const pathToFile = testInfo.snapshotPath(name);
    existsSync(pathToFile) && rmSync(pathToFile);
    expect(existsSync(pathToFile)).toBeFalsy();
  });
});
// test codegen
test.afterEach(async ({ page }, testInfo) => {
  await test.step('test output', async () => {
    const [events, codegen] = testInfo.attachments.slice(-2);
    expect(events.body).toMatchSnapshot({ name: 'recorded_events.dat' });
    expect(codegen.body).toMatchSnapshot({ name: 'codegen.dat' });
    ['a.png', 'b.png', 'codegen-1.png', 'codegen-2.png'].forEach((name) => {
      const pathToFile = testInfo.snapshotPath(name);
      expect(existsSync(pathToFile)).toBeTruthy();
    });
  });
});

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

    await test.step(`step('screenshots')`, async () => {
      const timeout = 1000;
      await page.evaluate(() => step('screenshots'));
      await test.step(`captureScreenshot()`, async () => {
        await page.evaluate(() => captureScreenshot());
        await page.waitForTimeout(timeout);
      });
      await test.step(`captureScreenshot({ name: 'a.png' })`, async () => {
        await page.evaluate(() => captureScreenshot({ name: 'a.png' }));
        await page.waitForTimeout(timeout);
      });
      await test.step(`captureScreenshot({ selector: '#canvas' })`, async () => {
        await page.evaluate(() => captureScreenshot({ selector: '#canvas' }));
        await page.waitForTimeout(timeout);
      });
      await test.step(`captureScreenshot({ name: 'b.png', selector: '#canvas' })`, async () => {
        await page.evaluate(() =>
          captureScreenshot({ name: 'b.png', selector: '#canvas' })
        );
        await page.waitForTimeout(timeout);
      });
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
      await page.mouse.dblclick(113, 272);
      await page.keyboard.down('Meta');
      await page.keyboard.press('S');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Meta');
    });
  });
});
