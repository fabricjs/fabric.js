const canvas = new fabric.Canvas(canvasEl);
const demoImg = 'https://fabricjs.github.io/assets/pug.jpg';

let radius = 300;

fabric.Image.fromURL(demoImg).then((img) => {
  img.set({
    dirty: true,
    scaleX: 0.5,
    scaleY: 0.5,
    left: 100,
    top: 100,
    angle: -15,
    clipPath: new fabric.Circle({
      objectCaching: false,
      radius: radius,
      originX: 'center',
      originY: 'center',
    }),
  });

  function animate() {
    fabric.util.animate({
      startValue: Math.round(radius) === 50 ? 50 : 300,
      endValue: Math.round(radius) === 50 ? 300 : 50,
      duration: 1000,
      onChange: (value) => {
        radius = value;
        img.clipPath.set('radius', value);
        // set dirty to true, since clipPath force caching on.
        img.set('dirty', true);
        canvas.renderAll();
      },
      onComplete: animate,
    });
  }
  animate();

  canvas.add(img);
  canvas.setActiveObject(img);
});

