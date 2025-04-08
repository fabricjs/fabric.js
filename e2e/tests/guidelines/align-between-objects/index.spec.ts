import { expect, test } from '../../../fixtures/base';
import { ObjectUtil } from '../../../utils/ObjectUtil';
import type { Rect } from 'fabric';

test('Snapping and guideline render', async ({ page, canvasUtil }) => {
  const rect1Util = new ObjectUtil<Rect>(page, 'rect1');

  await test.step('drag rect1 till snapping happen', async () => {
    const rect1Pos = await rect1Util.getObjectCenter();
    await page.mouse.move(rect1Pos.x, rect1Pos.y);
    await page.mouse.down();
    await page.mouse.move(rect1Pos.x + 70, rect1Pos.y, {
      steps: 40,
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'snapping happened.png',
    });
    await page.mouse.move(rect1Pos.x + 70, rect1Pos.y + 70, {
      steps: 40,
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'moved down but still snapping.png',
    });
    await page.mouse.move(rect1Pos.x + 290, rect1Pos.y + 70, {
      steps: 40,
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'snapping is finally free.png',
    });
  });
});
