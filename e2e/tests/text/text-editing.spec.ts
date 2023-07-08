import { expect, test } from '@playwright/test';
import { TestUtil } from '../../utils/objects';

test('text typing itext vs textbox', async ({ page }) => {
  const util = new TestUtil(page);
  await page.goto('http://127.0.0.1:8080/e2e/site');
  const textboxID = await util.addTextbox('initial text', {
    width: 200,
    left: 50,
  });
  const textCenter = await util.getObjectCenter(textboxID);

  expect(await page.screenshot()).toMatchSnapshot({ name: 'initial.png' });

  await util.clickCanvas({
    position: textCenter,
    clickCount: 2,
    delay: 200,
  });

  expect(await page.screenshot()).toMatchSnapshot({ name: 'start.png' });

  await page
    .locator('textarea')
    .type(
      'insert text in a textbox from the keyboard will wrap text on current textbox width',
      {
        delay: 160,
      }
    );

  expect(await page.screenshot()).toMatchSnapshot({ name: 'typed.png' });

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
  expect(await page.screenshot()).toMatchSnapshot({ name: 'exit_editing.png' });

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
  expect(await page.screenshot()).toMatchSnapshot({
    name: 'increase_width_mr.png',
  });
  // drag in the opposite direction
  await page.mouse.move(mrControlPoint.x - 300, mrControlPoint.y, {
    steps: 60,
  });
  await page.mouse.up();
  expect(await page.screenshot()).toMatchSnapshot({
    name: 'decrease_width_mr.png',
  });

  // drag the ml control
  const mlControlPoint = await util.getObjectControlPoint(textboxID, 'ml');
  await page.mouse.move(mlControlPoint.x, mlControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(mlControlPoint.x - 300, mlControlPoint.y, {
    steps: 40,
  });
  expect(await page.screenshot()).toMatchSnapshot({
    name: 'increase_width_ml.png',
  });
  // drag in the opposite direction
  await page.mouse.move(mlControlPoint.x + 300, mlControlPoint.y, {
    steps: 60,
  });
  await page.mouse.up();
  expect(await page.screenshot()).toMatchSnapshot({
    name: 'decrease_width_ml.png',
  });
});
