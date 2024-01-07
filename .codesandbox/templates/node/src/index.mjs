import * as commander from 'commander';
import * as fabric from 'fabric/node';
import http from 'http';

const program = new commander.Command()
  .allowUnknownOption(false)
  .allowExcessArguments(false)
  .option('-p, --port <port>', 'the port to use', 8080)
  .parse();

const port = Number(program.opts().port);

http
  .createServer((req, res) => {
    const canvas = new fabric.StaticCanvas(null, { width: 100, height: 100 });
    const rect = new fabric.Rect({ width: 20, height: 50, fill: '#ff0000' });
    const text = new fabric.FabricText('fabric.js', {
      fill: 'blue',
      fontSize: 24,
    });
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
