# Distance Guide

When the coordinates of shape A are (0, 0) and the coordinates of shape B are (a, 0), dragging a shape to (2a, 0) will display a distance guide line.
When the coordinates of shape A are (0, 0) and the coordinates of shape B are (2a, 0), dragging a shape to (a, 0) will display a distance guide line.
When the coordinates of shape A are (0, 0) and the coordinates of shape B are (a, 0), dragging a shape to (-a, 0) will display a distance guide line.
When shape A is selected, moving the mouse over shape B while holding the Alt key will display a distance guide line between A and B.

## How to use it

```ts
import { DistanceGuide } from 'fabric/extensions';

const config = {
  /** The color of the guide line */
  color = 'rgba(255,0,0,0.9)';
  /** The fill color of the text */
  fillStyle = 'rgba(255,255,255,1)';
  /** The width of the guide line */
  lineWidth = 1;
  /** The style of the dashed line */
  lineDash = [6, 2];
  /** The offset of the dashed line */
  lineDashOffset = 3;
  /** The size of the text */
  fontSize = 11;
  /** The fontFamily of the text */
  fontFamily = 'sans-serif';
  /** The spacing of the text within the rectangle */
  padding = 4;
  /** The distance between the text and the guide line */
  space = 5;
  /** The detection distance when moving the graphic */
  margin = 8;
};

const distanceGuide = new DistanceGuide(myCanvas, options);

// in order to disable distance Guide later:

distanceGuide.dispose();
```
