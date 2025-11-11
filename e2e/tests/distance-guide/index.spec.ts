import { expect, test } from '../../fixtures/base';
import { ObjectUtil } from '../../utils/ObjectUtil';
import type { Rect } from 'fabric';

test('Distance guide', async ({ page, canvasUtil }) => {
  const rectUtil = new ObjectUtil<Rect>(page, 'rect3');

  await test.step('press Alt to show distance', async () => {
    const rect2Pos = await new ObjectUtil<Rect>(
      page,
      'rect2',
    ).getObjectCenter();
    page.mouse.click(rect2Pos.x, rect2Pos.y);

    const rectPos = await rectUtil.getObjectCenter();
    await page.mouse.move(rectPos.x, rectPos.y);
    await page.keyboard.down('Alt');
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'distance.png',
    });
    await page.keyboard.up('Alt');
  });

  await test.step('drag the rect3', async () => {
    const rectPos = await rectUtil.getObjectCenter();
    await page.mouse.move(rectPos.x, rectPos.y);
    await page.mouse.down();
    // 410, make +3
    await page.mouse.move(rectPos.x + 413, rectPos.y + 40, {
      steps: 40,
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'to-the-right.png',
    });
    // 215, make -2
    await page.mouse.move(rectPos.x + 213, rectPos.y + 40, {
      steps: 40,
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'to-the-center.png',
    });
    // 20, make 0
    await page.mouse.move(rectPos.x + 20, rectPos.y + 40, {
      steps: 40,
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'to-the-left.png',
    });
  });
});
