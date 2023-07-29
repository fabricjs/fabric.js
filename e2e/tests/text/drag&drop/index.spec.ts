import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { binaryToBuffer } from '../../../utils/binaryToBuffer';

import '../../../setup';

test('Drag & Drop', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);
  await test.step('select "fabric" in A', async () => {
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
  });
  await test.step('drag & drop to end', async () => {
    await page.mouse.down();
    await page.mouse.move(0, 140, { steps: 40 });
    await page.mouse.move(435, 55, { steps: 40 });
    expect(await canvas.screenshot()).toMatchSnapshot({
      name: '1.drag-fabric-over-lor|em.png',
    });
    await page.mouse.move(240, 140, { steps: 40 });
    expect(await canvas.screenshot()).toMatchSnapshot({
      name: '2.before-drop-fabric-after-sandbox.png',
    });
    await page.mouse.up();
    expect(await canvas.screenshot()).toMatchSnapshot({
      name: '3.drop-fabric-after-sandbox.png',
    });
  });

  await test.step('drag & drop to B(3) = "lor|fabric|em"', async () => {
    await canvas.dragTo(canvas, {
      sourcePosition: {
        x: 230,
        y: 140,
      },
      targetPosition: {
        x: 435,
        y: 55,
      },
    });
    expect(await canvas.screenshot()).toMatchSnapshot({
      name: '4.drop--lor|fabric|em.png',
    });
  });

  await test.step('select B', async () => {
    await canvas.click({
      position: {
        x: 598,
        y: 59,
      },
    });
    await page.mouse.down();
    await page.mouse.move(580, 300, { steps: 40 });
    await page.mouse.up();
  });

  await test.step('drag & drop to A(4) = ".js |em ip"', async () => {
    await canvas.dragTo(canvas, {
      sourcePosition: {
        x: 580,
        y: 280,
      },
      targetPosition: {
        x: 120,
        y: 55,
      },
    });
    expect(await canvas.screenshot()).toMatchSnapshot({
      name: '5..js |em ips.png',
    });
  });
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

test('Drag Image A', async ({ page }) => {
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

  await test.step('start dragging', async () => {
    const [dragEvent, trigger] = await waitForDragImage(page, canvas, {
      x: 130,
      y: 40,
    });
    await canvas.dispatchEvent('dragstart', dragEvent);
    const [image, position] = await trigger;
    expect(image).toMatchSnapshot({
      name: 'drag-image-fabric.png',
    });
    expect(JSON.stringify(position, null, 2)).toMatchSnapshot({
      name: 'drag-image-fabric.json',
    });
  });
});

test('Drag Image B', async ({ page }) => {
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

  await test.step('start dragging', async () => {
    const [dragEvent, trigger] = await waitForDragImage(page, canvas, {
      x: 500,
      y: 280,
    });
    await canvas.dispatchEvent('dragstart', dragEvent);
    const [image, position] = await trigger;
    expect(image).toMatchSnapshot({
      name: 'drag-image-em---tge.png',
    });
    expect(JSON.stringify(position, null, 2)).toMatchSnapshot({
      name: 'drag-image-em---tge.json',
    });
  });
});
