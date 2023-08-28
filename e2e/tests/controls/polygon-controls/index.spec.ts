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
  await page.mouse.move(p2ControlPoint.x + 300, p2ControlPoint.y + 100, {
    steps: 40,
  });
  await page.mouse.up();
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'moved_controls_p2.png',
  });

  // drag in the opposite direction
  const p4ControlPoint = await starUtil.getObjectControlPoint('p4');
  await page.mouse.move(p4ControlPoint.x, p4ControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(p4ControlPoint.x - 300, p4ControlPoint.y - 100, {
    steps: 40,
  });
  await page.mouse.up();
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'moved_controls_p4.png',
  });
});
