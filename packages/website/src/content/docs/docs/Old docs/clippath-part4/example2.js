import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id, { width: 500, height: 300 });
    var clipPath = new fabric.Circle({ radius: 100, top: -200, left: -200 });
    var clipPath2 = new fabric.Circle({ radius: 100, top: 0, left: 0 });
    var clipPath3 = new fabric.Circle({ radius: 100, top: 0, left: -200 });
    var clipPath4 = new fabric.Circle({ radius: 100, top: -200, left: 0 });
    var g = new fabric.Group([clipPath, clipPath2, clipPath3, clipPath4]);
    g.inverted = true;
    fabric.FabricImage.fromURL('/assets/dragon.jpg').then((img) => {
      img.clipPath = g;
      img.scaleToWidth(500);
      canvas.add(img);
    });
}