import { test } from '@playwright/test';
import { TestUtil } from '../../utils/objects';

test('text typing itext vs textbox', async ({ page }) => {
  const util = new TestUtil(page);
  await page.goto('http://127.0.0.1:8080/e2e/site');
  const textboxID = await util.addTextbox('initial text', {
    width: 200,
    left: 50,
  });
  const textCenter = await util.getObjectCenter(textboxID);

  const state = {
    isEditing: false,
    text: 'initial text',
    width: 200,
  };
  await util.expectObjectToMatch(textboxID, state);

  await util.clickCanvas({
    position: textCenter,
    clickCount: 2,
    delay: 200,
  });
  state.isEditing = true;
  await util.expectObjectToMatch(textboxID, state);

  await page
    .locator('textarea')
    .type(
      'insert text in a textbox from the keyboard will wrap text on current textbox width',
      {
        delay: 160,
      }
    );
  state.text =
    'initial insert text in a textbox from the keyboard will wrap text on current textbox width';
  await util.expectObjectToMatch(textboxID, state);

  const mrControlPoint = await util.getObjectControlPoint(textboxID, 'mr');

  // click outside to stop editing
  await util.clickCanvas({
    position: {
      x: mrControlPoint.x + 20,
      y: mrControlPoint.y,
    },
    clickCount: 1,
    delay: 200,
  });
  state.isEditing = false;
  await util.expectObjectToMatch(textboxID, state);

  // click the object to select it
  await util.clickCanvas({
    position: textCenter,
  });

  // drag the mr control
  await page.mouse.move(mrControlPoint.x, mrControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(mrControlPoint.x + 300, mrControlPoint.y, {
    steps: 40,
  });
  state.width = 500;
  await util.expectObjectToMatch(textboxID, state);
  // drag in the opposite direction
  await page.mouse.move(mrControlPoint.x - 300, mrControlPoint.y, {
    steps: 60,
  });
  state.width = 148.828125;
  await util.expectObjectToMatch(textboxID, state);
  await page.mouse.up();

  // drag the ml control
  const mlControlPoint = await util.getObjectControlPoint(textboxID, 'ml');
  await page.mouse.move(mlControlPoint.x, mlControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(mlControlPoint.x - 300, mlControlPoint.y, {
    steps: 40,
  });
  state.width = 450;
  await util.expectObjectToMatch(textboxID, state);
  // drag in the opposite direction
  await page.mouse.move(mlControlPoint.x + 300, mlControlPoint.y, {
    steps: 60,
  });
  state.width = 148.828125;
  await util.expectObjectToMatch(textboxID, state);
  await page.mouse.up();
});
