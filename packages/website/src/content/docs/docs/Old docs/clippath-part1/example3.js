import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id);
    var clipPath = new fabric.Group([
        new fabric.Circle({ radius: 70, top: -70, left: -70 }),
        new fabric.Circle({ radius: 40, left: -95, top: -95 }),
        new fabric.Circle({ radius: 40, left: 15, top: 15 }),
    ], { left: -95, top: -95 }); 
    var group = new fabric.Group([ 
        new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
        new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
        new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }), 
        new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]); 
    group.clipPath = clipPath;
    canvas.add(group);
}