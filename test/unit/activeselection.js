test('canvas property propagation', function() {
  var g1 = makeGroupWith4Objects(),
      g2 = makeGroupWith4Objects(),
      rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      group1 = new fabric.Group([g1]);

  group1.add(g2);
  group1.insertAt(rect1, 0);
  g2.insertAt(rect2, 0);

  canvas.add(group1);
  equal(g2.canvas, canvas);
  equal(g2._objects[3].canvas, canvas);
  equal(g1.canvas, canvas);
  equal(g1._objects[3].canvas, canvas);
  equal(rect2.canvas, canvas);
  equal(rect1.canvas, canvas);
});
