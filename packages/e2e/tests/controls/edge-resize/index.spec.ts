import { expect, test } from '../../../fixtures/base';
import type { FabricImage } from 'fabric';
import { ObjectUtil } from '../../../utils/ObjectUtil';

test('edge resize controls render and function correctly', async ({
  page,
  canvasUtil,
}) => {
  const imageUtil = new ObjectUtil<FabricImage>(page, 'image');

  await test.step('initial state with edge controls', async () => {
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '00_initial.png',
    });
  });

  await test.step('drag right edge inward (resize within crop bounds)', async () => {
    const control = await imageUtil.getObjectControlPoint('mr');
    await page.mouse.move(control.x, control.y);
    await page.mouse.down();
    await page.mouse.move(control.x - 30, control.y, { steps: 10 });
    await page.mouse.up();
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '01_resize_right_inward.png',
    });
  });

  await test.step('drag left edge inward (resize within crop bounds)', async () => {
    const control = await imageUtil.getObjectControlPoint('ml');
    await page.mouse.move(control.x, control.y);
    await page.mouse.down();
    await page.mouse.move(control.x + 30, control.y, { steps: 10 });
    await page.mouse.up();
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '02_resize_left_inward.png',
    });
  });

  await test.step('drag top edge inward (resize within crop bounds)', async () => {
    const control = await imageUtil.getObjectControlPoint('mt');
    await page.mouse.move(control.x, control.y);
    await page.mouse.down();
    await page.mouse.move(control.x, control.y + 30, { steps: 10 });
    await page.mouse.up();
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '03_resize_top_inward.png',
    });
  });

  await test.step('drag bottom edge inward (resize within crop bounds)', async () => {
    const control = await imageUtil.getObjectControlPoint('mb');
    await page.mouse.move(control.x, control.y);
    await page.mouse.down();
    await page.mouse.move(control.x, control.y - 30, { steps: 10 });
    await page.mouse.up();
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '04_resize_bottom_inward.png',
    });
  });

  await test.step('drag right edge outward (uniform scale when crop exhausted)', async () => {
    const control = await imageUtil.getObjectControlPoint('mr');
    await page.mouse.move(control.x, control.y);
    await page.mouse.down();
    await page.mouse.move(control.x + 80, control.y, { steps: 10 });
    await page.mouse.up();
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '05_scale_right_outward.png',
    });
  });
});
