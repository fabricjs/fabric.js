const http = require('http');
const { fabric } = require('fabric');

http
  .createServer((req, res) => {
    const canvas = new fabric.Canvas(null, { width: 100, height: 100 });
    const rect = new fabric.Rect({ width: 20, height: 50, fill: "#ff0000" });
    const text = new fabric.Text("fabric.js", { fill: "blue", fontSize: 24 });
    canvas.add(rect, text);
    canvas.renderAll();
    canvas.createPNGStream().pipe(res);

    // or send HTML markup
    
    // const imageData = canvas.toDataURL();
    // res.writeHead(200, '', { 'Content-Type': 'text/html' });
    // res.write(`<img src="${imageData}" />`); //write a response to the client
    // res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
