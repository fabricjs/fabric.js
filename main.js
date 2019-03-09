var fs = require('fs'),
    fabric = require('fabric').fabric; // or import { fabric } from 'fabric';

fabric.nodeCanvas.registerFont(__dirname + '/test/fixtures/Ubuntu-Regular.ttf', {
  family: 'Ubuntu', weight: 'regular', style: 'normal'
});
fabric.nodeCanvas.registerFont(__dirname + '/test/fixtures/Ubuntu-Bold.ttf', {
  family: 'Ubuntu', weight: 'bold', style: 'normal'
});
fabric.nodeCanvas.registerFont(__dirname + '/test/fixtures/Ubuntu-Italic.ttf', {
  family: 'Ubuntu', weight: 'regular', style: 'italic'
});
fabric.nodeCanvas.registerFont(__dirname + '/test/fixtures/Ubuntu-BoldItalic.ttf', {
  family: 'Ubuntu', weight: 'bold', style: 'italic'
});

var canvas = new fabric.StaticCanvas(null, { width: 300, height: 250 });

var text = new fabric.Text('regular', {
    left: 0,
    top: 50,
    fontFamily: 'Ubuntu'
});
canvas.add(text);

text = new fabric.Text('bold', {
    left: 0,
    top: 100,
    fontFamily: 'Ubuntu',
    fontWeight: 'bold'
});
canvas.add(text);

text = new fabric.Text('italic', {
    left: 0,
    top: 150,
    fontFamily: 'Ubuntu',
    fontStyle: 'italic'
});
canvas.add(text);

text = new fabric.Text('bold italic', {
    left: 0,
    top: 200,
    fontFamily: 'Ubuntu',
    fontWeight: 'bold',
    fontStyle: 'italic'
});
canvas.add(text);
canvas.renderAll();
var out = fs.createWriteStream(__dirname + '/customfont.png');
var stream = canvas.createPNGStream();
stream.on('data', function(chunk) {
    out.write(chunk);
});
