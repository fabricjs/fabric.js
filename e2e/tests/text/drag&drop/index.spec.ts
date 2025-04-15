import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import type { IText } from '../../../..';
import setup from '../../../setup';
import { TextUtil } from '../../../utils/TextUtil';
import { binaryToBuffer } from '../../../utils/binaryToBuffer';
import { CanvasUtil } from '../../../utils/CanvasUtil';

setup();

const dragA = 'fabric';
const dragB = 'em ipsum\ndolor\nsit Amet2\nconsectge';

const selectFabricInA = (page: Page) => {
  const canvas = page.locator('canvas').nth(1);
  return test.step(`select "${dragA}" in A`, async () => {
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
};

const readEventStream = async (page: Page) => {
  const data = await new CanvasUtil(page).executeInBrowser((canvas) =>
    canvas.readEventStream(),
  );
  return JSON.stringify(data, null, 2);
};

test('Drag & Drop', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);
  const textarea = page.locator('#textarea');
  const a = new TextUtil(page, 'a');
  const b = new TextUtil(page, 'b');

  await selectFabricInA(page);

  await test.step('click sets the cursor', async () => {
    await page.mouse.move(130, 50);
    await page.mouse.down();
    expect(
      await a.executeInBrowser((text) => [
        text['draggableTextDelegate'].isActive(),
        text.shouldStartDragging(),
      ]),
    ).toEqual([true, true]);
    expect(await a.isCursorActive()).toBeFalsy();
    await page.mouse.up();
    expect(
      await a.executeInBrowser((text) => [
        text['draggableTextDelegate'].isActive(),
        text.shouldStartDragging(),
      ]),
    ).toEqual([false, false]);
    await a.expectObjectToMatch({
      selectionStart: 3,
      selectionEnd: 3,
    });
    expect(await a.isCursorActive()).toBeTruthy();
  });

  await selectFabricInA(page);

  // clean the stream
  await readEventStream(page);

  await test.step('drag A & drop on self at end', async () => {
    await page.mouse.down();
    await page.mouse.move(0, 140, { steps: 10 });
    await page.mouse.move(435, 55, { steps: 10 });
    expect(
      await canvas.screenshot(),
      `1. drag "${dragA}" over "lor|em" (A => B)`,
    ).toMatchSnapshot({
      name: '1.drag-fabric-over-lor|em.png',
    });
    await page.mouse.move(400, 70, { steps: 10 });
    await page.mouse.move(250, 130, { steps: 10 });
    await page.mouse.move(240, 140, { steps: 10 });
    expect(
      await canvas.screenshot(),
      `2. before dropping "${dragA}" => "sandbox|" (A => A)`,
    ).toMatchSnapshot({
      name: '2.before-drop-fabric-after-sandbox.png',
    });
    await page.mouse.up();
    expect(
      await canvas.screenshot(),
      `3. drop "${dragA}" => "sandbox|${dragA}" (A => A)`,
    ).toMatchSnapshot({
      name: '3.drop-fabric-after-sandbox.png',
    });
    expect(await readEventStream(page)).toMatchSnapshot({
      name: '3.events.json',
    });
  });

  await test.step(`drag & drop to B(3) = "lor|${dragA}|em"`, async () => {
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
    // expect(await page.evaluate(() => document.activeElement)).toBe(
    //   await b.executeInBrowser((text) => text.hiddenTextarea),
    // );
    expect(
      await canvas.screenshot(),
      `4. drag & drop "${dragA}" => "lor|${dragA}|em" (A => B(3))`,
    ).toMatchSnapshot({
      name: '4.drop--lor|fabric|em.png',
    });
    expect(await readEventStream(page)).toMatchSnapshot({
      name: '4.events.json',
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
    await readEventStream(page);
  });

  await test.step(`drag & drop to A(4) = ".js |${dragB}|sandbox"`, async () => {
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
    // expect(await page.evaluate(() => document.activeElement)).toBe(
    //   await a.executeInBrowser((text) => text.hiddenTextarea),
    // );
    expect(
      await canvas.screenshot(),
      `5. drag & drop "${dragB}" => ".js |${dragB}|sandbox" (B => A(4))`,
    ).toMatchSnapshot({
      name: '5..js |em ips.png',
    });
    expect(await readEventStream(page)).toMatchSnapshot({
      name: '5.events.json',
    });
  });

  await test.step(`drag & drop to textarea = ".js |${dragB}|sandbox"`, async () => {
    await canvas.dragTo(textarea, {
      sourcePosition: {
        x: 120,
        y: 55,
      },
    });
    // expect(await page.evaluate(() => document.activeElement)).toBe(
    //   await textarea.elementHandle()
    // );
    expect(
      await page.screenshot(),
      `6. drag & drop ".js |${dragB}|sandbox" to textarea (A => textarea)`,
    ).toMatchSnapshot({
      name: '6.drop-textarea.png',
    });
    expect(await readEventStream(page)).toMatchSnapshot({
      name: '6.events.json',
    });
  });

  await test.step(`drag & drop "dolor" from textarea to B = "lor|dolor|fabrictur"`, async () => {
    await page.mouse.move(25, 527);
    await page.mouse.dblclick(25, 527);
    await page.mouse.down();
    await page.mouse.move(25, 527);
    await page.mouse.move(25, 550, { steps: 10 });
    await page.mouse.move(435, 55, { steps: 10 });
    await canvas.hover({ position: { x: 435, y: 55 } });
    await page.mouse.up();
    // expect(await page.evaluate(() => document.activeElement)).toBe(
    //   await b.executeInBrowser((text) => text.hiddenTextarea),
    // );
    expect(
      await page.screenshot(),
      `7. drag & drop "dolor" to B = "lor|dolor|fabrictur" (textarea => B)`,
    ).toMatchSnapshot({
      name: '7.drop-textarea-to-B-lor|dolor|fabrictur.png',
    });
    expect(await readEventStream(page)).toMatchSnapshot({
      name: '7.events.json',
    });
  });
});

for (const options of [
  {
    disabled: 'onDragStart',
    exec: (text: IText) => (text.onDragStart = () => false),
    expected: {
      text: 'fabric.js sandbox',
      selectionStart: 0,
      selectionEnd: 6,
    },
  },
  {
    disabled: 'draggableTextDelegate#start',
    exec: (text: IText) => (text['draggableTextDelegate'].start = () => false),
    expected: {
      text: 'fabric.js sandbox',
      selectionStart: 3,
      selectionEnd: 17,
    },
  },
  {
    disabled: 'draggableTextDelegate#isActive',
    exec: (text: IText) =>
      (text['draggableTextDelegate'].isActive = () => false),
    expected: {
      text: 'fabric.js sandbox',
      selectionStart: 0,
      selectionEnd: 6,
    },
  },
] as const) {
  test(`Disabling Drag & Drop by disabling ${options.disabled}`, async ({
    page,
  }) => {
    const a = new TextUtil(page, 'a');
    await test.step('disable dragging', () => a.executeInBrowser(options.exec));
    await selectFabricInA(page);
    await readEventStream(page);

    await test.step('drag to end of text', async () => {
      await page.mouse.down();
      await page.mouse.move(240, 140, { steps: 40 });
      a.expectObjectToMatch(options.expected);
      expect(await readEventStream(page)).toMatchSnapshot({
        name: `disabling-drag-${options.disabled}.events.json`,
      });
    });
  });
}

test('Disabling Drop', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);
  const a = new TextUtil(page, 'a');
  const b = new TextUtil(page, 'b');
  await test.step('disable dropping', () => {
    a.executeInBrowser((text) => (text.canDrop = () => false));
    b.executeInBrowser((text) => (text.canDrop = () => false));
  });

  await test.step('drop A on self', async () => {
    await selectFabricInA(page);
    await readEventStream(page);
    await canvas.dragTo(canvas, {
      sourcePosition: {
        x: 130,
        y: 40,
      },
      targetPosition: {
        x: 240,
        y: 140,
      },
    });
    await a.expectObjectToMatch({ text: 'fabric.js sandbox' });
    expect(await readEventStream(page)).toMatchSnapshot({
      name: 'disabling-drop-A.events.json',
    });
  });

  await test.step('drop A on B', async () => {
    await selectFabricInA(page);
    await readEventStream(page);
    await canvas.dragTo(canvas, {
      sourcePosition: {
        x: 130,
        y: 40,
      },
      targetPosition: {
        x: 435,
        y: 55,
      },
    });
    await a.expectObjectToMatch({ text: 'fabric.js sandbox' });
    await b.expectObjectToMatch({
      text: 'lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
    });
    expect(await readEventStream(page)).toMatchSnapshot({
      name: 'disabling-drop-B.events.json',
    });
  });
});

async function waitForDataTransfer(
  page: Page,
  canvas: Locator,
  { x, y }: { x: number; y: number },
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
      Object.defineProperties(new DataTransfer(), {
        __data: {
          value: {},
        },
        setDragImage: {
          value(image, x, y) {
            window.dispatchEvent(
              new CustomEvent('drag:data', {
                detail: { image, x, y, data: this.__data },
              }),
            );
          },
        },
        setData: {
          value(type, value) {
            let out = value;
            try {
              out = JSON.parse(value);
            } catch (error) {}
            this.__data[type] = out;
          },
        },
      }),
    );
    return [
      { dataTransfer },
      page
        .evaluate(
          () =>
            new Promise<{
              image: string;
              x: number;
              y: number;
              data: Record<string, any>;
            }>((resolve) =>
              window.addEventListener(
                'drag:data',
                ({ detail: { image, ...rest } }) =>
                  resolve({
                    image: image.toDataURL(`image/png`, 1),
                    ...rest,
                  }),
                { once: true },
              ),
            ),
        )
        .then(({ x, y, image, ...data }) => {
          return [binaryToBuffer(image), { x, y }, data] as const;
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
    const [dragEvent, trigger] = await waitForDataTransfer(page, canvas, {
      x: 130,
      y: 40,
    });
    await canvas.dispatchEvent('dragstart', dragEvent);
    const [image, position, data] = await trigger;
    expect(image, `drag image A: "${dragA}"`).toMatchSnapshot({
      name: 'drag-image-fabric.png',
      maxDiffPixelRatio: 0.03,
    });
    expect(
      JSON.stringify({ position, ...data }, null, 2),
      `drag image A position: "${dragA}"`,
    ).toMatchSnapshot({
      name: 'drag-image-fabric.json',
      maxDiffPixelRatio: 0.03,
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
    const [dragEvent, trigger] = await waitForDataTransfer(page, canvas, {
      x: 500,
      y: 280,
    });
    await canvas.dispatchEvent('dragstart', dragEvent);
    const [image, position, data] = await trigger;
    expect(image, `drag image B: "${dragB}"`).toMatchSnapshot({
      name: 'drag-image-em---tge.png',
    });
    expect(
      JSON.stringify({ position, ...data }, null, 2),
      `drag image B position: "${dragB}"`,
    ).toMatchSnapshot({
      name: 'drag-image-em---tge.json',
    });
  });
});
