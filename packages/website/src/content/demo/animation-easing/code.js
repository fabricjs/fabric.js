const canvas = new fabric.Canvas(canvasEl);

const rect = new fabric.Rect({
  width: 50,
  height: 50,
  left: 100,
  top: 100,
  stroke: '#aaf',
  strokeWidth: 5,
  fill: '#faa',
  selectable: false,
});
canvas.add(rect);

const animateBtn = document.getElementById('animate');
animateBtn.onclick = function () {
  animateBtn.disabled = true;
  rect.animate(
    { left: rect.left === 100 ? 400 : 100 },
    {
      duration: 1000,
      onChange: () => canvas.requestRenderAll(),
      onComplete: function () {
        animateBtn.disabled = false;
      },
      easing: fabric.util.ease[document.getElementById('easing').value],
    }
  );
};

