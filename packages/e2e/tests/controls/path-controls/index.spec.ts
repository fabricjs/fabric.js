import { expect, test } from '../../../fixtures/base';
import type { Path } from 'fabric';
import { ObjectUtil } from '../../../utils/ObjectUtil';

test(`path controls can modify path`, async ({ page, canvasUtil }) => {
  const pathUtil = new ObjectUtil<Path>(page, 'testPath');

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'initial.png',
  });

  for (const contolKey of [
    'c_0_M',
    'c_1_L',
    'c_2_C',
    'c_2_C_CP_1',
    'c_2_C_CP_2',
    'c_3_Q',
    'c_3_Q_CP_1',
  ]) {
    await test.step(`drag the point control ${contolKey}`, async () => {
      const contol = await pathUtil.getObjectControlPoint(contolKey);
      await page.mouse.move(contol.x, contol.y);
      await page.mouse.down();
      await page.mouse.move(contol.x + 40, contol.y + 20, {
        steps: 20,
      });
      await page.mouse.up();
      await expect(await canvasUtil.screenshot()).toMatchSnapshot({
        name: `moved_control_${contolKey}_br.png`,
      });
    });

    await test.step(`drag the point control ${contolKey} in the opposite direction`, async () => {
      const contol = await pathUtil.getObjectControlPoint(contolKey);
      await page.mouse.move(contol.x, contol.y);
      await page.mouse.down();
      await page.mouse.move(contol.x + 73, contol.y - 60, {
        steps: 20,
      });
      await page.mouse.up();
      await expect(await canvasUtil.screenshot()).toMatchSnapshot({
        name: `moved_control_${contolKey}_tl.png`,
      });
    });
  }
});
