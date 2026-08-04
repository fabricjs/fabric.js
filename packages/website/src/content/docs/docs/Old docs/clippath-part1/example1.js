import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id);
    var clipPath = new fabric.Circle({ radius: 40, top: -40, left: -40 });
    var rect = new fabric.Rect({ width: 200, height: 100, fill: 'red' });
    rect.clipPath = clipPath;
    canvas.add(rect);
}