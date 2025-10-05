/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import * as fabric from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  canvas.setDimensions({ width: 300, height: 325 });
  const controls = fabric.controlsUtils.createObjectDefaultControls();
  Object.values(controls).forEach((control) => {
    control.sizeX = 20;
    control.sizeY = 25;
    control.touchSizeX = 30;
    control.touchSizeY = 35;
  });
  const rect = new fabric.Rect({
    left: 25,
    top: 60,
    width: 75,
    height: 100,
    controls,
    scaleY: 2,
    fill: 'blue',
    padding: 10,
  });
  rect.setPositionByOrigin(new fabric.Point(25, 60), 'left', 'top');
  const group = new fabric.Group([rect], {
    angle: 30,
    scaleX: 2,
    interactive: true,
    subTargetCheck: true,
  });
  canvas.add(group);
  canvas.centerObject(group);
  group.setCoords();
  canvas.setActiveObject(rect);
  canvas.renderAll();
  return { rect, group };
});
