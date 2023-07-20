import { Locator, Page, expect, test } from '@playwright/test';

import '../../../setup';
import { binaryToBuffer } from '../../../utils/binaryToBuffer';

test('Drag & Drop', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);
  await canvas.click({
    position: {
      x: 130,
      y: 50,
    },
  });
  await page.mouse.dblclick(130, 50);
  await canvas.hover({
    position: {
      x: 130,
      y: 40,
    },
  });
  await page.mouse.down();
  await page.mouse.move(0, 140, { steps: 40 });
  await page.mouse.move(240, 140, { steps: 40 });
  expect(await canvas.screenshot()).toMatchSnapshot({
    name: 'drop:before.png',
  });
  await page.mouse.up();
  expect(await canvas.screenshot()).toMatchSnapshot({ name: 'drop.png' });
  await page.waitForTimeout(50000);
});

async function waitForDragImage(
  page: Page,
  canvas: Locator,
  { x, y }: { x: number; y: number }
) {
  return test.step('initialize drag start', async () => {
    await canvas.hover({
      position: {
        x,
        y,
      },
    });
    await page.mouse.down();
    const dataTransfer = await page.evaluateHandle(() =>
      Object.defineProperty(new DataTransfer(), 'setDragImage', {
        value: (image, x, y) =>
          window.dispatchEvent(
            new CustomEvent('drag:image', { detail: { image, x, y } })
          ),
      })
    );
    return [
      { dataTransfer },
      page
        .evaluate(
          () =>
            new Promise<{ image: string; x: number; y: number }>((resolve) =>
              window.addEventListener(
                'drag:image',
                ({ detail: { image, x, y } }) =>
                  resolve({
                    image: image.toDataURL(`image/png`, 1),
                    x,
                    y,
                  }),
                { once: true }
              )
            )
        )
        .then(({ x, y, image }) => {
          return [binaryToBuffer(image), { x, y }] as const;
        }),
    ] as const;
  });
}

test.only('Drag Image', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);
  await canvas.click({
    position: {
      x: 130,
      y: 50,
    },
  });

  await test.step('select word', () => page.mouse.dblclick(130, 50));

  await test.step('Drag Image A', async () => {
    const [dragEvent, trigger] = await waitForDragImage(page, canvas, {
      x: 130,
      y: 40,
    });
    await canvas.dispatchEvent('dragstart', dragEvent);
    const [image, position] = await trigger;
    expect(image).toMatchImageSnapshot({
      name: 'drag_image.png',
    });
    expect(JSON.stringify(position, null, 2)).toMatchSnapshot({
      name: 'drag_image.json',
    });
  });

  // await test.step('Drag Image B', async () => {
  //   await page.mouse.dblclick(130, 50);
  //   await canvas.hover({
  //     position: {
  //       x: 130,
  //       y: 40,
  //     },
  //   });
  //   await page.mouse.down();
  //   const [dragEvent, trigger] = await waitForDragImage(page);
  //   await canvas.dispatchEvent('dragstart', dragEvent);
  //   const { x, y, image } = await trigger;
  //   expect(image).toMatchImageSnapshot({
  //     name: 'drag_image.png',
  //   });
  //   expect({ x, y }).toMatchDataSnapshot({
  //     name: 'drag_image.json',
  //   });
  // });
});
