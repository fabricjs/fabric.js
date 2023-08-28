import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import { ObjectUtil } from '../../../utils/ObjectUtil';

import '../../../setup';

test('polygon controls can modify polygon - exact false', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  const starUtil = new ObjectUtil(page, 'star');
  const starCenter = await starUtil.getObjectCenter();

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'initial.png',
  });

  const p2ControlPoint = await starUtil.getObjectControlPoint('p2');

  // drag the p2 control
  await page.mouse.move(p2ControlPoint.x, p2ControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(p2ControlPoint.x + 300, p2ControlPoint.y, {
    steps: 40,
  });
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'moved_controls_p2.png',
  });
  // // drag in the opposite direction
  // await page.mouse.move(mrControlPoint.x - 300, mrControlPoint.y, {
  //   steps: 60,
  // });
  // await page.mouse.up();
  // expect(await canvasUtil.screenshot()).toMatchSnapshot({
  //   name: 'decrease_width_mr.png',
  // });

  // // drag the ml control
  // const mlControlPoint = await textboxUtil.getObjectControlPoint('ml');
  // await page.mouse.move(mlControlPoint.x, mlControlPoint.y);
  // await page.mouse.down();
  // await page.mouse.move(mlControlPoint.x - 300, mlControlPoint.y, {
  //   steps: 40,
  // });
  // expect(await canvasUtil.screenshot()).toMatchSnapshot({
  //   name: 'increase_width_ml.png',
  // });
  // // drag in the opposite direction
  // await page.mouse.move(mlControlPoint.x + 300, mlControlPoint.y, {
  //   steps: 60,
  // });
  // await page.mouse.up();
  // expect(await canvasUtil.screenshot()).toMatchSnapshot({
  //   name: 'decrease_width_ml.png',
  // });
});
