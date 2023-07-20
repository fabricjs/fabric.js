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
  const trigger = page
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
      const [type, content] = image
        .replace(/^data:image\/([^;]+);([^,]+),(.+)/, '$2 $3')
        .split(' ') as [BufferEncoding, string];
      const data = new Uint8Array(Buffer.from(content, type).buffer);
      return [data, { x, y }] as const;
    });
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
  const [image, position] = await trigger;
  expect(image).toMatchSnapshot({
    name: 'drag_image.png',
  });
  expect(position).toMatchDataSnapshot({
    name: 'drag_image.json',
  });
});
