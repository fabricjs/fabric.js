import { expect, test } from '@playwright/test';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import { ObjectUtil } from '../../../utils/ObjectUtil';
import type { Circle } from 'fabric';

setup();

test('Activeselection with mouse drag with origin non defaults', async ({
  page,
}) => {
  const canvasUtil = new CanvasUtil(page);
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
