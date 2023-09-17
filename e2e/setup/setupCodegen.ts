import type { JSHandle } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

type EventModifiers = Pick<
  MouseEvent,
  'shiftKey' | 'ctrlKey' | 'altKey' | 'metaKey'
>;

type MouseEventData = { x: number; y: number } & Partial<EventModifiers>;
type KeyboardEventData = { key: string } & Partial<EventModifiers>;
type ScreenshotEventData = { name?: string; selector?: string };
type StepEventData = { type: 'start'; name: string } | { type: 'end' };
type EventData =
  | MouseEventData
  | KeyboardEventData
  | ScreenshotEventData
  | StepEventData;

const getCodegenKey = ({
  key,
  altKey,
  ctrlKey,
  metaKey,
  shiftKey,
}: KeyboardEventData) => {
  return [
    ...Object.entries({ altKey, ctrlKey, metaKey, shiftKey })
      .map(([key, value]) => {
        if (!value) {
          return '';
        }
        const [upper, ...rest] = key.replace('Key', '');
        return `${upper.toUpperCase()}${rest}`;
      })
      .filter((val) => !!val && val !== key),
    key,
  ].join('+');
};

/**
 * ## Codegen
 *
 * Code generation of tests
 *
 * Records events in dev mode to make writing tests is easier
 *
 * Unfortunately move events are not captured by playwright's codegen so it is not very useful for testing fabric
 * {@see https://github.com/microsoft/playwright/issues/21504}
 * This is why we shall use our own recorder
 *
 * ### Usage
 *
 * - Start the template
 *   `npm run test:e2e -- e2e/tests/template/index.spec.ts`
 * - Execute in chrome devtools:
 *   `startRecording()`
 * - Play with the canvas
 * - Capture screenshots:
 *   `captureScreenshots()`
 * - Press the play button in playwright devtools when done
 * - The generated code will be logged to the console and attached to the test results with the screenshots
 *
 * To edit an existing test add `await page.pause();` where you want to start recording.
 */
export default () => {
  if (process.env.CI) {
    return;
  }
  let handle: JSHandle<(readonly [keyof DocumentEventMap, EventData?])[]>;
  test.beforeEach(async ({ page }, testInfo) => {
    handle = await page.evaluateHandle(() => {
      const events: (readonly [keyof DocumentEventMap, EventData?])[] = [];

      const subscribe = <K extends keyof DocumentEventMap>(
        type: K,
        callback: (ev: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
      ) => {
        document.addEventListener(type, callback, options);
        return () => document.removeEventListener(type, callback, options);
      };

      const consumeEventModifiers = ({
        shiftKey,
        ctrlKey,
        altKey,
        metaKey,
      }: EventModifiers) => {
        return Object.entries({ shiftKey, ctrlKey, altKey, metaKey }).reduce(
          (acc, [key, value]) => {
            value && (acc[key] = true);
            return acc;
          },
          {}
        );
      };

      const consumeMouseEvent = ({
        type,
        clientX: x,
        clientY: y,
        target,
        ...e
      }: MouseEvent) => {
        const modifiers = consumeEventModifiers(e);
        console.log(type, x, y, modifiers);
        return [
          type as keyof DocumentEventMap,
          {
            x,
            y,
            target,
          },
        ] as const;
      };

      const consumeKeyboardEvent = ({ type, key, ...e }: KeyboardEvent) =>
        [
          type as keyof DocumentEventMap,
          {
            ...consumeEventModifiers(e),
            key,
          },
        ] as const;

      let disposers: VoidFunction[] = [];
      window.startRecording = () => {
        let downFired = false;
        let move: { x: number; y: number } | undefined = undefined;
        let key: string | undefined = undefined;

        disposers = [
          subscribe('mousedown', (e) => {
            downFired = true;
            move = undefined;
            events.push(consumeMouseEvent(e));
          }),
          subscribe('mousemove', ({ clientX: x, clientY: y }) => {
            if (downFired) {
              move = { x, y };
            }
          }),
          subscribe('mouseup', (e) => {
            move && events.push(['mousemove', move]);
            events.push(consumeMouseEvent(e));
            downFired = false;
            move = undefined;
          }),
          subscribe('dblclick', (e) => {
            events.push(consumeMouseEvent(e));
          }),
          subscribe('keydown', (e) => {
            if (key !== e.key) {
              key = e.key;
              move && events.push(['mousemove', move]);
              events.push(consumeKeyboardEvent(e));
            }
          }),
          subscribe('keyup', (e) => {
            move &&
              events[events.length - 1][0] !== 'keydown' &&
              events.push(['mousemove', move]);
            events.push(consumeKeyboardEvent(e));
            key = undefined;
          }),
        ];
      };

      window.captureScreenshot = (name?: string, selector?: string) => {
        disposers.length && events.push(['screenshot', { name, selector }]);
        window.dispatchEvent(
          new CustomEvent('screenshot', { detail: { name, selector } })
        );
      };

      let step = false;
      window.step = (name: string) => {
        if (disposers.length) {
          step && events.push(['step', { type: 'end' }]);
          events.push(['step', { type: 'start', name }]);
          step = true;
        }
      };
      window.endStep = () => {
        if (step) {
          events.push(['step', { type: 'end' }]);
          step = false;
        }
      };

      window.stopRecording = () => {
        disposers.forEach((d) => d());
        disposers = [];
      };

      return events;
    });

    let counter = 0;
    const screenshotListener = async () => {
      counter++;
      try {
        // closing the test will cause this to fail because it keeps listening to the page
        const { name, selector = 'canvas_wrapper=#canvas' } =
          await page.evaluate(
            () =>
              new Promise<{ name?: string; selector?: string }>((resolve) =>
                window.addEventListener(
                  'screenshot',
                  ({ detail }: CustomEvent) => resolve(detail),
                  { once: true }
                )
              )
          );
        const screenshot = await page.locator(selector).screenshot();
        testInfo.attach(name || `screenshot${counter}.png`, {
          body: screenshot,
        });
        const { updateSnapshots } = testInfo.config;
        testInfo.config.updateSnapshots = 'all';
        expect(screenshot).toMatchSnapshot({
          name,
        });
        testInfo.config.updateSnapshots = updateSnapshots;
        return screenshotListener();
      } catch (error) {}
    };
    screenshotListener();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const data = await handle.jsonValue();
    const codegen = [`const selector = 'canvas_top=#canvas';`]
      .concat(
        ...data
          .map(([type, ev], index, array) => {
            switch (type) {
              case 'keydown': {
                {
                  if (array[index + 1][0] !== 'keyup') {
                    const key = getCodegenKey(ev as KeyboardEventData);
                    return [`await page.keyboard.down('${key}')`];
                  }
                  return [];
                }
              }
              case 'keyup': {
                {
                  const key = getCodegenKey(ev as KeyboardEventData);
                  if (array[index - 1][0] === 'keydown') {
                    return [`await page.keyboard.press('${key}')`];
                  }
                  return [`await page.keyboard.up('${key}')`];
                }
              }

              case 'mousedown': {
                if (array[index + 1][0] !== 'mouseup') {
                  const { x, y } = ev as MouseEventData;
                  return [
                    `await test.step('Interaction Sequence', async () => {`,
                    `await page.hover(selector, ${JSON.stringify({
                      position: { x, y },
                    })});`,
                    `await page.mouse.down();`,
                  ];
                }
                return [];
              }
              case 'mousemove': {
                const { x, y } = ev as MouseEventData;
                return [`await page.mouse.move(${x}, ${y}, { steps: 10 });`];
              }
              case 'mouseup': {
                if (array[index - 1][0] === 'mousedown') {
                  const { x, y } = ev as MouseEventData;
                  return [
                    `await page.click(selector, ${JSON.stringify({
                      position: { x, y },
                    })});`,
                  ];
                }
                return [`await page.mouse.up();`, `});`];
              }

              case 'dblclick': {
                const { x, y } = ev as MouseEventData;
                return [`await page.mouse.dblclick(${x}, ${y})`];
              }

              case 'screenshot': {
                const { name, selector } = ev as ScreenshotEventData;
                return [
                  `expect(await page.locator(${
                    selector ? `'${selector}'` : 'selector'
                  }).screenshot()).toMatchSnapshot(${
                    name ? JSON.stringify({ name }) : ''
                  });`,
                ];
              }

              case 'step': {
                const { name, type } = ev as StepEventData;
                return type === 'start'
                  ? [`await test.step('${name}', async () => {`]
                  : [`});`];
              }

              default:
                return [];
            }
          })
          .flat(Infinity)
      )
      .join('\n');
    if (data.length) {
      testInfo.attach('recorded events', {
        body: JSON.stringify(data, null, 2),
      });
      const pathToFile = path.resolve(testInfo.outputDir, 'codegen.ts');
      writeFileSync(pathToFile, codegen);
      execSync(`prettier --write --ignore-path '' ${pathToFile}`);
      testInfo.attach('codegen.ts', {
        path: pathToFile,
      });
      const body = readFileSync(pathToFile).toString();
      testInfo.attach('codegen', {
        body,
      });
      console.log(
        `\n\nCodegen has successfully generated output for the test "${testInfo.title}" available in attachments\n\n`,
        body
      );
    }
  });
};
