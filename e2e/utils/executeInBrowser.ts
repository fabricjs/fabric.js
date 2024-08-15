import type { Page } from '@playwright/test';
import type { Canvas, Object as FabricObject } from 'fabric';

export async function executeInBrowser<C, R>(
  page: Page,
  runInBrowser: (
    testContext: {
      getCanvas: (selector?: string) => Canvas;
      getObject: (key: string) => FabricObject;
    },
    context: C,
  ) => R,
  context?: C,
): Promise<R> {
  return (
    await page.evaluateHandle(() => ({
      getCanvas: (selector = '#canvas') =>
        canvasMap.get(document.querySelector(selector)),
      getObject: (key) => objectMap.get(key),
    }))
  ).evaluate(runInBrowser, context);
}
