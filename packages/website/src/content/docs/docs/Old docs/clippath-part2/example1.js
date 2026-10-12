import * as fabric from 'fabric';

export default function (id) {
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