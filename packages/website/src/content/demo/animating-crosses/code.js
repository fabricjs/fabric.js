const canvas = new fabric.Canvas(canvasEl);

class Cross extends fabric.Object {
  constructor(options = {}) {
    super(options);
    this.transparentCorners = false;
    this.objectCaching = false;
    this.animDirection = 'up';

    this.width = 100;
    this.height = 100;

    this.w1 = this.h2 = 100;
    this.h1 = this.w2 = 30;
  }

  animateWidthHeight() {
    const interval = 2;

    if (this.h2 >= 30 && this.h2 <= 100) {
      const actualInterval =
        this.animDirection === 'up' ? interval : -interval;
      this.h2 += actualInterval;
      this.w1 += actualInterval;
    }

    if (this.h2 >= 100) {
      this.animDirection = 'down';
      this.h2 -= interval;
      this.w1 -= interval;
    }
    if (this.h2 <= 30) {
      this.animDirection = 'up';
      this.h2 += interval;
      this.w1 += interval;
    }
  }

  _render(ctx) {
    ctx.fillRect(-this.w1 / 2, -this.h1 / 2, this.w1, this.h1);
    ctx.fillRect(-this.w2 / 2, -this.h2 / 2, this.w2, this.h2);
  }
}

canvas.add(
  new Cross({
    top: 100,
    left: 100,
  }),
  new Cross({
    top: 140,
    left: 230,
  }),
  new Cross({
    top: 300,
    left: 210,
  }),
  new Cross({
    top: 40,
    left: 400,
  }),
  new Cross({
    top: 450,
    left: 400,
  })
);

requestAnimationFrame(function animate() {
  canvas.forEachObject((obj) => obj.animateWidthHeight());
  canvas.requestRenderAll();
  requestAnimationFrame(animate);
});

