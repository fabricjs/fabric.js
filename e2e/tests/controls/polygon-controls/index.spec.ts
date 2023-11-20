import { expect, test } from '@playwright/test';
import type { Polygon } from 'fabric';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import { ObjectUtil } from '../../../utils/ObjectUtil';

setup();

const toSnapshotName = (name: string, exact: boolean) =>
  `${name}${exact ? '-exact' : ''}.png`;

for (const exact of [true, false]) {
  test(`polygon controls can modify polygon - exactBoundingBox ${exact}`, async ({
    page,
  }) => {
    const canvasUtil = new CanvasUtil(page);
    const starUtil = new ObjectUtil<Polygon>(page, 'star');

    exact &&
      (await starUtil.executeInBrowser((object) => {
        object.strokeLineJoin = 'miter';
        object.strokeWidth = 30;
        object.exactBoundingBox = true;
        object.setDimensions();
        object.set('dirty', true);
        object.canvas.renderAll();
      }));

    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: toSnapshotName('initial', exact),
    });

    const modifyPoly = (
      title: string,
      controlName: string,
      delta: { x: number; y: number }
    ) =>
      test.step(title, async () => {
        const eventStreamHandle =
          await test.step('subscribe to poly events', () =>
            starUtil.evaluateHandle((object) => {
              const events: { action: string; corner: string }[] = [];
              const disposer = object.on(
                'modifyPoly',
                ({ transform: { action, corner } }) =>
                  events.push({ action, corner })
              );
              object.once('modified', ({ transform: { action, corner } }) => {
                disposer();
                events.push({ action, corner });
              });
              return events;
            }));

        const controlPoint = await starUtil.getObjectControlPoint(controlName);
        await page.mouse.move(controlPoint.x, controlPoint.y);
        await page.mouse.down();
        await page.mouse.move(
          controlPoint.x + delta.x,
          controlPoint.y + delta.y,
          {
            steps: 40,
          }
        );
        await page.mouse.up();

        expect(await canvasUtil.screenshot()).toMatchSnapshot({
          name: toSnapshotName(`moved_controls_${controlName}`, exact),
        });

        const events = await eventStreamHandle.jsonValue();
        expect(events.length).toBeGreaterThan(0);
        expect(events).toMatchObject(
          new Array(events.length).fill({
            action: 'modifyPoly',
            corner: controlName,
          })
        );
      });

    await modifyPoly('drag the p2 control', 'p2', { x: 300, y: 100 });
    await modifyPoly('drag in the p4 control in the opposite direction', 'p4', {
      x: -300,
      y: -100,
    });
  });
}
