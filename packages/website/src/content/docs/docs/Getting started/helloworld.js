const { StaticCanvas, FabricText } = fabric;
const canvas = new StaticCanvas();
const helloWorld = new FabricText('Hello world!');
canvas.add(helloWorld);
canvas.centerObject(helloWorld);
const imageSrc = canvas.toDataURL();
// some download code down here
const a = document.createElement('a');
a.href = imageSrc;
a.download = 'image.png';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
