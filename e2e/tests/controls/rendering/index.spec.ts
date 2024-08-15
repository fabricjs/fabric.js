import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import { promiseSequence } from '../../../utils/promiseSequence';
import data from './data.json';
import data2 from './data2.json';
import setup from '../../../setup';

setup();

test('control box rendering', async ({ page }) => {
  const cases = [
    { data, title: 'skewY, flipX' },
    { data: data2, title: 'skewY' },
  ]
    .map(({ data, title }) =>
      [0, 10].map((padding) =>
        [0, 10, 20, 30].map((objectPadding) => ({
          data,
          title,
          padding,
          objectPadding,
          name: `${title}, padding of ${padding} and object padding of ${objectPadding}`,
        })),
      ),
    )
    .flat(Infinity) as {
    data: typeof data;
    title: string;
    padding: number;
    objectPadding: number;
    name: string;
  }[];

  await promiseSequence(
    cases.map(
      ({ data, padding, objectPadding, name }) =>
        async () =>
          test.step(name, async () => {
            const canvasUtil = new CanvasUtil(page);
            await canvasUtil.executeInBrowser(
              async (canvas, [data, padding, objectPadding]) => {
                await canvas.loadFromJSON(data);
                canvas.renderAll();
                canvas.getObjects().forEach((object) => {
                  object.padding = padding;
                  object.borderScaleFactor = 3;
                  object.transparentCorners = false;
                  const color = object.fill;
                  object._renderControls(canvas.contextContainer, {
                    borderColor: color,
                    cornerColor: color,
                  });
                  object.getObjects?.().forEach((subTarget) => {
                    subTarget.padding = objectPadding;
                    subTarget.borderScaleFactor = 3;
                    subTarget.transparentCorners = false;
                    const color = subTarget.fill;
                    subTarget.setCoords();
                    subTarget._renderControls(canvas.contextContainer, {
                      borderColor: color,
                      cornerColor: color,
                    });
                  });
                });
              },
              [data, padding, objectPadding] as const,
            );
            expect(await canvasUtil.screenshot()).toMatchSnapshot({
              name: `${name}.png`,
            });
          }),
    ),
  );
});
