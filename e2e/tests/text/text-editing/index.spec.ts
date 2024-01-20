import { expect, test } from '@playwright/test';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import { ObjectUtil } from '../../../utils/ObjectUtil';

setup();

test('textbox typing and resizing', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  const textboxUtil = new ObjectUtil(page, 'textbox');
  const textCenter = await textboxUtil.getObjectCenter();

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'initial.png',
  });

  await canvasUtil.click({
    position: textCenter,
    clickCount: 2,
    delay: 200,
  });

  expect(await canvasUtil.screenshot()).toMatchSnapshot({ name: 'start.png' });

  await page
    .locator('textarea')
    .type(
      'insert text in a textbox from the keyboard will wrap text on current textbox width',
      {
        // delay: 160,
      }
    );

  expect(await canvasUtil.screenshot()).toMatchSnapshot({ name: 'typed.png' });

  const mrControlPoint = await textboxUtil.getObjectControlPoint('mr');

  // click outside to stop editing
  await canvasUtil.click({
    position: {
      x: mrControlPoint.x + 20,
      y: mrControlPoint.y,
    },
    clickCount: 1,
    delay: 200,
  });
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'exit_editing.png',
  });

  // click the object to select it
  await canvasUtil.click({
    position: textCenter,
  });

  // drag the mr control
  await page.mouse.move(mrControlPoint.x, mrControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(mrControlPoint.x + 300, mrControlPoint.y, {
    steps: 40,
  });
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'increase_width_mr.png',
  });
  // drag in the opposite direction
  await page.mouse.move(mrControlPoint.x - 300, mrControlPoint.y, {
    steps: 60,
  });
  await page.mouse.up();
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'decrease_width_mr.png',
  });

  // drag the ml control
  const mlControlPoint = await textboxUtil.getObjectControlPoint('ml');
  await page.mouse.move(mlControlPoint.x, mlControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(mlControlPoint.x - 300, mlControlPoint.y, {
    steps: 40,
  });
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'increase_width_ml.png',
  });
  // drag in the opposite direction
  await page.mouse.move(mlControlPoint.x + 300, mlControlPoint.y, {
    steps: 60,
  });
  await page.mouse.up();
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'decrease_width_ml.png',
  });
});
