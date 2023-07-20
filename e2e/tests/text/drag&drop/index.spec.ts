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

test('Drag Image 1', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);

  await test.step('select word', async () => {
    await canvas.click({
      position: {
        x: 130,
        y: 50,
      },
    });
    await page.mouse.dblclick(130, 50);
  });

  await test.step('Drag Image', async () => {
    const [dragEvent, trigger] = await waitForDragImage(page, canvas, {
      x: 130,
      y: 40,
    });
    await canvas.dispatchEvent('dragstart', dragEvent);
    const [image, position] = await trigger;
    expect(image).toMatchSnapshot({
      name: 'drag_image1.png',
    });
    expect(JSON.stringify(position, null, 2)).toMatchSnapshot({
      name: 'drag_image1.json',
    });
  });
});

test('Drag Image 2', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);

  await test.step('select word', async () => {
    await page.mouse.dblclick(435, 55);
    await canvas.click({
      position: {
        x: 435,
        y: 55,
      },
    });
    await page.mouse.down();
    await page.mouse.move(580, 300, { steps: 40 });
    await page.mouse.up();
  });

  await test.step('Drag Image', async () => {
    const [dragEvent, trigger] = await waitForDragImage(page, canvas, {
      x: 500,
      y: 280,
    });
    await canvas.dispatchEvent('dragstart', dragEvent);
    const [image, position] = await trigger;
    expect(image).toMatchSnapshot({
      name: 'drag_image2.png',
    });
    expect(JSON.stringify(position, null, 2)).toMatchSnapshot({
      name: 'drag_image2.json',
    });
  });
});
