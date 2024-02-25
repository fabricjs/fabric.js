import { Canvas } from 'canvas';
import * as fabric from 'fabric/node';
import http from 'http';

const port = Number(process.argv[2]);

fabric.FabricObject.ownDefaults.objectCaching = false;

http
  .createServer((req, res) => {
    const canvas = new fabric.StaticCanvas(null, { width: 1000, height: 1000 });
    const rect = new fabric.Rect({ width: 50, height: 50, fill: 'red' });
    const path = fabric.util.getSmoothPathFromPoints([
      new fabric.Point(50, 50),
      new fabric.Point(100, 100),
      new fabric.Point(50, 200),
      new fabric.Point(400, 150),
      new fabric.Point(500, 500),
    ]);
    const text = new fabric.FabricText(
      new Array(9).fill('fabric.js').join(' '),
      {
        fill: 'blue',
        fontSize: 24,
        path: new fabric.Path(path),
      }
    );
    canvas.add(rect, text);
    canvas.renderAll();
    const pdf = canvas.toCanvasElement(
      1,
      {
        width: 460,
        height: 450,
      },
      new Canvas(0, 0, 'pdf').getContext('2d')
    );
    const svg = canvas.toCanvasElement(
      1,
      {
        width: 460,
        height: 450,
      },
      new Canvas(0, 0, 'svg').getContext('2d')
    );
    const svg2 = text.toCanvasElement({
      canvasElement: new Canvas(1000, 1000, 'svg').getContext('2d'),
    });
    if (req.url === '/download') {
      res.setHeader('Content-Disposition', 'attachment; filename="fabric.pdf"');
      pdf.createPDFStream().pipe(res);
    } else if (req.url === '/view') {
      pdf.createPDFStream().pipe(res);
    } else {
      res.writeHead(200, '', { 'Content-Type': 'application/pdf' });
      res.write(pdf.toBuffer());
      res.end();
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Ready on http://localhost:${port}, http://localhost:${port}/view, http://localhost:${port}/download`
    );
  });
