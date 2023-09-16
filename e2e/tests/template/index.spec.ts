import { test } from '@playwright/test';
import setup from '../../setup';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { ObjectUtil } from '../../utils/ObjectUtil';

setup();

test('TEST NAME', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  // note that `textbox` correlates to the returned key in `index.ts` => `beforeAll`
  const textboxUtil = new ObjectUtil(page, 'textbox');
  // write the test
});

/**
 * ## Codegen
 *
 * This test supports code generation of tests
 *
 * ### Usage
 *
 * - Start the template
 *   `npm run test:e2e -- e2e/tests/template/index.spec.ts`
 * - Execute in chrome devtools:
 *   `startRecording()`
 * - Play with the canvas
 * - Press the play button in playwright devtools  to execute the test
 * - The generated code will be logged to the console and attached to the test results
 *
 * To edit an existing test simply add `await page.pause();` where you want to start recording.
 */
!process.env.CI &&
  test.only('Codegen', async ({ page, browser }) => {
    // unfortunately move events are not captured by codegen so it is not very useful for testing fabric
    // see https://github.com/microsoft/playwright/issues/21504
    // this is why we shall use our own recorder

    // opens playwright codegen devtools
    await page.pause();
  });
