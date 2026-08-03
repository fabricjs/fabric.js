import * as fabric from 'fabric';

export default function (id) {
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