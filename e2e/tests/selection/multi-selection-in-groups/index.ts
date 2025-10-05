/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect, Circle, Group, ClipPathLayout } from 'fabric';
import { beforeAll } from '../../test';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 450, height: 450 });

  canvas.preserveObjectStacking = true;
  const circle1 = new Circle({ left: 150, top: 100, radius: 50 });
  const g = new Group(
    [
      new Rect({
        left: 25,
        top: 225,
        width: 50,
        height: 50,
        fill: 'red',
        opacity: 0.3,
      }),
      circle1,
    ],
    {
      backgroundColor: 'blue',
      subTargetCheck: true,
      interactive: true,
    },
  );
  canvas.add(g);
  const clone1 = await g.clone();
  clone1.set({
    top: clone1.top + 200,
    left: clone1.left + 200,
    backgroundColor: 'red',
  });
  const circle2 = clone1.item(1);
  canvas.add(clone1);
  const clone3 = await g.clone();
  clone3.set({
    top: clone3.top + 200,
    backgroundColor: 'yellow',
    clipPath: new Circle({
      radius: 110,
      originX: 'center',
      originY: 'center',
      group: clone3,
    }),
  });
  clone3.layoutManager.strategy = new ClipPathLayout();
  clone3.triggerLayout();
  const circle3 = clone3.item(1);
  canvas.add(clone3);

  const clone4 = await g.clone();
  clone4.set({
    left: clone4.left + 200,
    backgroundColor: 'cyan',
    clipPath: new Circle({
      radius: 110,
      originX: 'center',
      originY: 'center',
      absolutePositioned: true,
      left: 250,
      top: 150,
      skewX: 20,
    }),
  });
  clone4.layoutManager.strategy = new ClipPathLayout();
  clone4.triggerLayout();
  const circle4 = clone4.item(1);
  canvas.insertAt(0, clone4);

  return { circle1, circle2, circle3, circle4 };
});
