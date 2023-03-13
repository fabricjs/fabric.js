import {test} from '@playwright/test';

test('text typing works', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/e2e/site');
  await page.evaluate(() => {
    const textbox = new fabric.Textbox('HELLO');
    fabricCanvas.add(textbox);
  });

  await page.click('canvas.upper-canvas', {
    position: { x: 15, y: 15 },
    clickCount: 2,
    delay: 200
  });

  await page.locator('textarea').type('test typing', { delay: 100 })

});

