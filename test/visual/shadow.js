  
function createClippedNestedShadowedTextTest(a, b, c) {
    return (canvas, callback) => {
      const text = new fabric.Text("Clipped Text\nShadow Test", {
        fontSize: 48,
        fontWeight: 'bold',
        top: 24,
        textAlign: 'center',
        shadow: new fabric.Shadow({
          color: "red",
          blur: 5,
          offsetX: 20,
          offsetY: 20
        })
      });
      const group = new fabric.Group(
        [
          new fabric.Rect({ width: 300, height: 200, fill: "yellow" }),
          new fabric.Rect({ width: 150, height: 100, fill: "green" }),
          new fabric.Rect({ width: 150, height: 100, left: 150, fill: "blue" }),
          new fabric.Rect({ width: 150, height: 100, left: 150, top: 100, fill: "magenta" }),
          text,

        ],
        {
          clipPath: new fabric.Circle({
            radius: 125,
            originX: 'center',
            originY: 'center',
          }),
        }
      );
      const top = new fabric.Group([group]);
      canvas.add(top);
      text.rotate(c);
      group.rotate(b);
      top.rotate(a);
      top.center();
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
    }
  }

  const step = 45;
  const angles = [];
  for (let deg = -180; deg <= 180; deg = deg + step) {
    angles.push(deg);
}
  
QUnit.module('Shadow Casting', hooks => {
    const runner = visualTestLoop(QUnit);
    angles.forEach(a => {
        angles.forEach(b => {
            angles.forEach(c => {
                let containerDeg = a + b + 360 * -Math.sign(a + b) * Number(Math.abs(a + b) > 180);
                runner({
                    test: `clipped group ${b}° with nested shadow ${c}° rotated by ${a}°`,
                    code: createClippedNestedShadowedTextTest(a, b, c),
                    golden: `clipping/nested-shadow/${containerDeg},${c}.png`,
                    percentage: 0.06,
                    width: 250,
                    height: 200,
                });
            });
        });
    });
});
