import http from 'http';
import * as fabric from 'fabric/node';

const port = Number(process.argv[2]);

http
  .createServer((req, res) => {
    const canvas = new fabric.StaticCanvas(null, { width: 100, height: 100 });
    const rect = new fabric.Rect({ width: 20, height: 50, fill: '#ff0000' });
    const text = new fabric.Text('fabric.js', { fill: 'blue', fontSize: 24 });
    canvas.add(rect, text);
    canvas.renderAll();
    if (req.url === '/download') {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="fabric.png"');
      canvas.createPNGStream().pipe(res);
    } else if (req.url === '/view') {
      canvas.createPNGStream().pipe(res);
    } else {
      const imageData = canvas.toDataURL();
      res.writeHead(200, '', { 'Content-Type': 'text/html' });
      res.write(`<img src="${imageData}" />`);
      res.end();
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Ready on http://localhost:${port}, http://localhost:${port}/view, http://localhost:${port}/download`
    );
  });
