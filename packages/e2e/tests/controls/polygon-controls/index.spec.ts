import { expect, test } from '../../../fixtures/base';
import type { Polygon } from 'fabric';
import { ObjectUtil } from '../../../utils/ObjectUtil';

const toSnapshotName = (name: string, exact: boolean) =>
  `${name}${exact ? '-exact' : ''}.png`;

for (const exact of [true, false]) {
  test(`polygon controls can modify polygon - exactBoundingBox ${exact}`, async ({
    page,
    canvasUtil,
  }) => {
    const starUtil = new ObjectUtil<Polygon>(page, 'star');

    exact &&
      (await starUtil.executeInBrowser((object) => {
        object.strokeLineJoin = 'miter';
        object.strokeWidth = 30;
        object.exactBoundingBox = true;
        object.setDimensions();
        object.set('dirty', true);
        object.canvas!.renderAll();
      }, null));

    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: toSnapshotName('initial', exact),
    });

    await test.step('drag the p2 control', async () => {
      const p2ControlPoint = await starUtil.getObjectControlPoint('p2');
      await page.mouse.move(p2ControlPoint.x, p2ControlPoint.y);
      await page.mouse.down();
      await page.mouse.move(p2ControlPoint.x + 300, p2ControlPoint.y + 100, {
        steps: 40,
      });
      await page.mouse.up();
      expect(await canvasUtil.screenshot()).toMatchSnapshot({
        name: toSnapshotName('moved_controls_p2', exact),
      });
    });

    await test.step('drag in the opposite direction', async () => {
      const p4ControlPoint = await starUtil.getObjectControlPoint('p4');
      await page.mouse.move(p4ControlPoint.x, p4ControlPoint.y);
      await page.mouse.down();
      await page.mouse.move(p4ControlPoint.x - 300, p4ControlPoint.y - 100, {
        steps: 40,
      });
      await page.mouse.up();
      expect(await canvasUtil.screenshot()).toMatchSnapshot({
        name: toSnapshotName('moved_controls_p4', exact),
      });
    });
  });
}
