import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id, { width: 300, height: 200 });
    canvas.controlsAboveOverlay = true;
    var clipPath = new fabric.Circle({ radius: 100, top: 0, left: 50 });
    var group = new fabric.Group([
        new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
        new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
        new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
        new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    canvas.clipPath = clipPath;
    canvas.add(group);
}