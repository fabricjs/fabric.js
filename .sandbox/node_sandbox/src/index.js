const http = require('http');
const { fabric } = require('fabric');

http
  .createServer((req, res) => {
    const canvas = new fabric.Canvas(null, { width: 100, height: 100 });
    const rect = new fabric.Rect({ width: 20, height: 50, fill: '#ff0000' });
    canvas.add(rect);
    canvas.renderAll();
    const imageData = canvas.toDataURL();
    res.writeHead(200, '', { 'Content-Type': 'text/html' });
    res.write(`<img src="${imageData}" />`); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
