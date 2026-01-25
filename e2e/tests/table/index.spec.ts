import { expect, test } from '../../fixtures/base';
import type { Table } from 'fabric/extensions';
import { ObjectUtil } from '../../utils/ObjectUtil';

test('Table renders correctly', async ({ page, canvasUtil }) => {
  const tableUtil = new ObjectUtil<Table>(page, 'table');

  await test.step('initial render', async () => {
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '00_initial.png',
    });
  });

  await test.step('resize right edge', async () => {
    const control = await tableUtil.getObjectControlPoint('mr');
    await page.mouse.move(control.x, control.y);
    await page.mouse.down();
    await page.mouse.move(control.x + 50, control.y, { steps: 10 });
    await page.mouse.up();
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '01_resize_right.png',
    });
  });

  await test.step('resize bottom edge', async () => {
    const control = await tableUtil.getObjectControlPoint('mb');
    await page.mouse.move(control.x, control.y);
    await page.mouse.down();
    await page.mouse.move(control.x, control.y + 30, { steps: 10 });
    await page.mouse.up();
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: '02_resize_bottom.png',
    });
  });
});
