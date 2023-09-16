import type { JSHandle } from '@playwright/test';
import { test } from '@playwright/test';

type EventData = { x: number; y: number } & Partial<
  Pick<MouseEvent, 'shiftKey' | 'ctrlKey' | 'altKey'>
>;

/**
 * Codegen:
 * record events in dev mode to make writing tests is easier
 *
 * Usage:
 * - exec `startRecording()` in the devtools console
 * - interact with the canvas
 * - hit the play button in the playwright devtools
 */
export default () => {
  if (process.env.CI) {
    return;
  }
  let handle: JSHandle<[string, EventData?][]>;
  test.beforeEach(async ({ page }) => {
    handle = await page.evaluateHandle(() => {
      const events: [string, EventData?][] = [];

      const subscribe = <K extends keyof DocumentEventMap>(
        type: K,
        callback: (ev: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
      ) => {
        document.addEventListener(type, callback, options);
        return () => document.removeEventListener(type, callback, options);
      };

      const consumeEvent = ({
        type,
        clientX: x,
        clientY: y,
        shiftKey,
        ctrlKey,
        altKey,
      }: MouseEvent) => {
        console.log(type, x, y, { shiftKey, ctrlKey, altKey });
        return [
          type,
          {
            x,
            y,
            ...Object.entries({ shiftKey, ctrlKey, altKey }).reduce(
              (acc, [key, value]) => {
                value && (acc[key] = true);
                return acc;
              },
              {}
            ),
          },
        ] as [string, EventData];
      };

      window.startRecording = () => {
        let downFired = false;
        let moveFired = false;
        let disposers: VoidFunction[];
        disposers = [
          subscribe('mousedown', (e) => {
            downFired = true;
            moveFired = false;
            events.push(consumeEvent(e));
          }),
          subscribe('mousemove', () => {
            moveFired = true;
          }),
          subscribe('mouseup', (e) => {
            downFired && moveFired && events.push(['mousemove']);
            events.push(consumeEvent(e));
            downFired = false;
          }),
        ];
      };

      window.stopRecording = () => {
        disposers.forEach((d) => d());
        disposers = [];
      };

      return events;
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    const data = await handle.jsonValue();
    const codegen = [`const selector = 'canvas_top=#canvas';`]
      .concat(
        ...data
          .map(([type, ev], index, array) => {
            if (type !== 'mouseup') {
              return [];
            } else if (array[index - 1][0] === 'mousedown') {
              return [
                `await page.click(selector, ${JSON.stringify({
                  position: { x: ev.x, y: ev.y },
                })});`,
              ];
            } else if (array[index - 1][0] === 'mousemove') {
              const down = array[index - 2][1];
              return [
                `await test.step('STEP', async () => {`,
                ...[
                  `await page.hover(selector, ${JSON.stringify({
                    position: { x: down.x, y: down.y },
                  })});`,
                  `await page.mouse.down();`,
                  `await page.mouse.move(${ev.x}, ${ev.y}, { steps: 10 });`,
                  `await page.mouse.up();`,
                ].map((val) => `  ${val}`),
                `});`,
              ];
            }
          })
          .flat(Infinity)
      )
      .join('\n');
    if (data.length) {
      console.log(
        `Recorded Events for "${testInfo.title}"`,
        data,
        '\n\n',
        codegen
      );
      testInfo.attach('codegen', {
        body: codegen,
      });
    }
  });
};
