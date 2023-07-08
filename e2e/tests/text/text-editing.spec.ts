import { test, expect } from '@playwright/test';
import {
  addTextbox,
  getObjectCenter,
  clickCanvas,
  getObjectControlPoint,
  expectObjectToMatch,
} from '../../utils/objects';

test('text typing itext vs textbox', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/e2e/site');
  const textboxID = 'text1';
  await addTextbox(page, textboxID, 'initial text', {
    width: 200,
    left: 50,
  });
  const textCenter = await getObjectCenter(page, textboxID);
  const state = {
    isEditing: false,
    text: 'initial text',
    width: 200,
  };

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

  await expectObjectToMatch(page, textboxID, {
    isEditing: true,
    width: 200,
    text: 'initial insert text in a textbox from the keyboard will wrap text on current textbox width',
  });
  expect(page).toMatchSnapshot();

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
  await expectObjectToMatch(page, textboxID, {
    isEditing: false,
    width: 200,
    text: 'initial insert text in a textbox from the keyboard will wrap text on current textbox width',
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
