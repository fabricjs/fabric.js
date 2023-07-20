import { expect, test } from '@playwright/test';

import '../../../setup';

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

test.only('Drag Image', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);
  const trigger = page.evaluate(
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
  );
  const dataTransfer = await page.evaluateHandle(() =>
    Object.defineProperty(new DataTransfer(), 'setDragImage', {
      value: (image, x, y) =>
        window.dispatchEvent(
          new CustomEvent('drag:image', { detail: { image, x, y } })
        ),
    })
  );

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
  await canvas.dispatchEvent('dragstart', { dataTransfer });
  const { x, y, image } = await trigger;
  expect(image).toMatchImageSnapshot({
    name: 'drag_image.png',
  });
  expect({ x, y }).toMatchDataSnapshot({
    name: 'drag_image.json',
  });
});
