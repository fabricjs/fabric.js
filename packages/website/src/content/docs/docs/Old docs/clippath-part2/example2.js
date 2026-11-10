import * as fabric from 'fabric';

export default function (id) {
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