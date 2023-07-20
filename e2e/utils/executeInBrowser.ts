import type { Page } from '@playwright/test';
import type { Canvas, Object as FabricObject } from 'fabric';

export function executeInBrowser<C, R>(
  page: Page,
  runInBrowser: (
    context: C,
    testContext: {
      getCanvas: (selector?: string) => Canvas;
      getObject: (key: string) => FabricObject;
    }
  ) => R,
  context?: C
): Promise<R> {
  return page.evaluate(
    ([runInBrowser, context]) => {
      return eval(runInBrowser)(context, {
        getCanvas: (selector = '#canvas') =>
          canvasMap.get(document.querySelector(selector)),
        getObject: (key) => objectMap.get(key),
      });
    },
    [runInBrowser.toString(), context] as const
  );
}
