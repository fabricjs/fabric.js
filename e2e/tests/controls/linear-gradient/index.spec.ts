import { expect, test } from '../../../fixtures/base';
import type { Rect } from 'fabric';
import { ObjectUtil } from '../../../utils/ObjectUtil';

test(`linear gradient controls offer a gradient manipulation ux`, async ({
  page,
  canvasUtil,
}) => {
  const rectUtil = new ObjectUtil<Rect>(page, 'rect');
  const rect2Util = new ObjectUtil<Rect>(page, 'rect2');

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: '00_initial.png',
  });

  await test.step(`rect - drag the lgp_1 control`, async () => {
    const contol = await rectUtil.getObjectControlPoint('lgp_1');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x + 10, contol.y - 75, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `01_moved_control_lgp_1.png`,
    });
  });

  await test.step(`rect - drag the lgp_2 control`, async () => {
    const contol = await rectUtil.getObjectControlPoint('lgp_2');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x - 10, contol.y + 75, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `02_moved_control_lgp_2.png`,
    });
  });

  await test.step(`rect - drag the lgo_2 control`, async () => {
    const contol = await rectUtil.getObjectControlPoint('lgo_2');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x + 60, contol.y, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `03_moved_control_lgo_2.png`,
    });
  });

  await test.step(`select rect 2`, async () => {
    const center = await rect2Util.getObjectCenter();
    await page.mouse.move(center.x, center.y);
    await page.mouse.down();
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `04_selected_rect_2.png`,
    });
  });

  await test.step(`rect2 - drag the lgp_1 control`, async () => {
    const contol = await rect2Util.getObjectControlPoint('lgp_1');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x + 10, contol.y - 75, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `05_moved_control_lgp_1.png`,
    });
  });

  await test.step(`rect2 - drag the lgp_2 control`, async () => {
    const contol = await rect2Util.getObjectControlPoint('lgp_2');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x - 10, contol.y + 75, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `06_moved_control_lgp_2.png`,
    });
  });

  await test.step(`drag the lgo_2 control`, async () => {
    const contol = await rect2Util.getObjectControlPoint('lgo_2');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x + 60, contol.y, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `07_moved_control_lgo_2.png`,
    });
  });
});
