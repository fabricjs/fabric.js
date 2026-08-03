import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id, {
        width: 500,
        height: 500,
    });
    var clipPath = new fabric.Rect({ width: 500, height:250, top: 0, left: 0, absolutePositioned: true });
    var clipPath2 = new fabric.Rect({ width: 500, height:250, top: 250, left: 0, absolutePositioned: true });
    fabric.FabricImage.fromURL('/assets/dragon.jpg').then((img) => {
        img.clipPath = clipPath;
        img.scaleToWidth(500);
        canvas.add(img);
    });
    fabric.FabricImage.fromURL('/assets/dragon2.jpg').then((img) => {
        img.clipPath = clipPath2;
        img.scaleToWidth(500);
        img.top = 250;
        canvas.add(img);
    });
}
