import type { Canvas, Object as FabricObject } from 'fabric';

export function executeInBrowser<C, R>(
  runInBrowser: (
    context: C,
    testContext: {
      getCanvas: (selector: string) => Canvas;
      getObject: (key: string) => FabricObject;
    }
  ) => R,
  context: C
): Promise<R> {
  return this.page.evaluate(
    ([runInBrowser, context]) => {
      return eval(runInBrowser)(context, {
        getCanvas: (selector) =>
          canvasMap.get(document.querySelector(selector)),
        getObject: (key) => objectMap.get(key),
      });
    },
    [runInBrowser.toString(), context] as const
  );
}
