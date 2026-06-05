import { expect, test } from '../../../fixtures/base';
import type { Circle } from 'fabric';
import { ObjectUtil } from '../../../utils/ObjectUtil';

test('Activeselection across interactive groups', async ({
  page,
  canvasUtil,
}) => {
  const circle1Util = new ObjectUtil<Circle>(page, 'circle1');
  const circle2Util = new ObjectUtil<Circle>(page, 'circle2');
  const circle3Util = new ObjectUtil<Circle>(page, 'circle3');
  const circle4Util = new ObjectUtil<Circle>(page, 'circle4');
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'initial-layout.png',
  });
  await canvasUtil.makeActiveSelectionWith([
    circle1Util,
    circle2Util,
    circle3Util,
    circle4Util,
  ]);
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'initial-layout-with-activeSelection.png',
  });
  const { x, y } = await circle1Util.getObjectCenter();
  await canvasUtil.clickAndDrag({ x, y }, { x: 30, y: y + 100 }, 80);
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'after-moving-objects.png',
  });
});
