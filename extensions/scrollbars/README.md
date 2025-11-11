# Scrollbars

Add scrollbars to the infinite canvas. The scrollbars will be hidden when all graphics fit within the visible area.

## How to use it

```ts
import { Scrollbars, makeMouseWheel } from 'fabric/extensions';

const config = {
  /** Scrollbar fill color */
  fill = 'rgba(0,0,0,.3)';
  /** Scrollbar stroke color */
  stroke = 'rgba(255,255,255,.3)';
  /** Scrollbar line width */
  lineWidth = 1;
  /** Hide horizontal scrollbar */
  hideX = false;
  /** Hide vertical scrollbar */
  hideY = false;
  /** Scrollbar minimum width */
  scrollbarMinWidth = 40;
  /** Scrollbar size */
  scrollbarSize = 5;
  /** Scrollbar distance from the boundary */
  scrollSpace = 4;
  /** Scrollbar expansion size, the distance from which the user can effectively slide the scrollbar */
  padding = 4;
};

// You have the option to implement custom canvas zooming or use the plugin's built-in solution.
const mousewheel = makeMouseWheel(canvas);
canvas.on("mouse:wheel", mousewheel);
// canvas.off("mouse:wheel", mousewheel);

const scrollbars = new Scrollbars(myCanvas, options);

// in order to disable scrollbars later:

scrollbars.dispose();

```
