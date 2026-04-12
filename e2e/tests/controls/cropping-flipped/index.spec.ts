import { expect, test } from '../../../fixtures/base';
import type { FabricImage } from 'fabric';
import { ObjectUtil } from '../../../utils/ObjectUtil';

test(`cropping controls offer a full cropping ux for flipped images`, async ({
  page,
  canvasUtil,
}) => {
  const imageUtil = new ObjectUtil<FabricImage>(page, 'image');

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: '00_initial.png',
  });

  const center = await imageUtil.getObjectCenter();

  await page.mouse.dblclick(center.x, center.y);

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: '01_cropping-controls-loaded.png',
  });

  await test.step(`drag the tlc control `, async () => {
    const contol = await imageUtil.getObjectControlPoint('tlc');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x + 40, contol.y + 20, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `02_moved_control_tlc.png`,
    });
  });

  await test.step(`drag the brc control `, async () => {
    const contol = await imageUtil.getObjectControlPoint('brc');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x - 40, contol.y - 30, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `03_moved_control_brc.png`,
    });
  });

  await test.step(`drag the bls control `, async () => {
    const contol = await imageUtil.getObjectControlPoint('bls');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x - 200, contol.y - 200, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `04_moved_control_bls.png`,
    });
  });

  await test.step(`drag the tls control `, async () => {
    const contol = await imageUtil.getObjectControlPoint('tls');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x + 200, contol.y - 100, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `05_moved_control_tls.png`,
    });
  });

  await test.step(`drag the bls control `, async () => {
    const contol = await imageUtil.getObjectControlPoint('bls');
    await page.mouse.move(contol.x, contol.y);
    await page.mouse.down();
    await page.mouse.move(contol.x + 200, contol.y - 30, {
      steps: 20,
    });
    await page.mouse.up();
    await expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: `05_moved_control_bls.png`,
    });
  });
});
