import { expect, test } from '../../../fixtures/base';
import { ObjectUtil } from '../../../utils/ObjectUtil';
import type { Circle } from 'fabric';

test('Activeselection with mouse drag with origin non defaults', async ({
  page,
  canvasUtil,
}) => {
  const rect1Util = new ObjectUtil<Circle>(page, 'rect1');
  const rect2Util = new ObjectUtil<Circle>(page, 'rect2');
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'initial-layout.png',
  });
  await canvasUtil.makeActiveSelectionByDragging([rect1Util, rect2Util]);
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'after-multiselection.png',
  });
});
