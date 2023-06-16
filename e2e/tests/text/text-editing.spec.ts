import { test } from '@playwright/test';
import {
  addTextbox,
  getObjectCenter,
  clickCanvas,
  getObjectControlPoint,
} from '../../utils/objects';
test('text typing itext vs textbox', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/e2e/site');
  const textboxID = 'text1';
  await addTextbox(page, textboxID, 'initial text', {
    width: 200,
    left: 50,
  });
  const textCenter = await getObjectCenter(page, textboxID);
  await clickCanvas(page, {
    position: textCenter,
    clickCount: 2,
    delay: 200,
  });

  await page
    .locator('textarea')
    .type(
      'insert text in a textbox from the keyboard will wrap text on current textbox width',
      {
        delay: 160,
      }
    );

  const controlPoint = await getObjectControlPoint(page, textboxID, 'mr');

  // click outside to stop editing
  await clickCanvas(page, {
    position: {
      x: controlPoint.x + 20,
      y: controlPoint.y,
    },
    clickCount: 1,
    delay: 200,
  });

  // click the object to select it
  await clickCanvas(page, {
    position: textCenter,
  });

  // drag the control
  await page.mouse.move(controlPoint.x, controlPoint.y);
  await page.mouse.down();
  await page.mouse.move(controlPoint.x + 300, controlPoint.y, { steps: 40 });
  await page.mouse.up();
});
