import * as fabric from 'fabric';
import { generateExample } from '../../../../../utils/generateExample';

const Example1Code = function (id) {
    var canvas = new fabric.Canvas(id, {
        width: 300,
        height: 200,
    });
    var clipPath = new fabric.Circle({ radius: 70, top: -50, left: -50 });
    var innerClipPath = new fabric.Circle({ radius: 70, top: -90, left: -90 });
    clipPath.clipPath = innerClipPath;
    var group = new fabric.Group([
      new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    group.clipPath = clipPath;
    canvas.add(group);
}

const Example2Code = function (id) {
    var canvas = new fabric.Canvas(id, { width: 300, height: 200 });
    var clipPath = new fabric.Circle({ radius: 100, top: -100, left: -100 });
    var small = new fabric.Circle({ radius: 50, top: -50, left: -50 });
    var group = new fabric.Group([
    new fabric.Rect({ width: 100, height: 100, fill: 'red', clipPath: small }),
    new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
    new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
    new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    group.clipPath = clipPath;
    canvas.add(group);
}

const Example3Code = function (id) {
    var canvas = new fabric.Canvas(id, { width: 300, height: 200 });
    var clipPath = new fabric.FabricText(
      'Hi I\'m the \nnew ClipPath!\nI hope we\'ll\nbe friends',
      { top: -100, left: -100 });
    var group = new fabric.Group([
      new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    group.clipPath = clipPath;
    canvas.add(group);
}
export const Example1 = generateExample(Example1Code, 'example1');
export const Example2 = generateExample(Example2Code, 'example2');
export const Example3 = generateExample(Example3Code, 'example3');
