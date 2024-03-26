import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas, objectCaching = true) {
  canvas.preserveObjectStacking = true;
  const circle = new fabric.Circle({ left: 100, top: 50, radius: 50 });
  const text = new fabric.FabricText('empty', { evented: false });
  const itext = new fabric.IText('Edit me\nfit-content layout', {
    left: 100,
    top: 150,
  });
  const g = new fabric.Group(
    [
      new fabric.Rect({
        top: 200,
        width: 50,
        height: 50,
        fill: 'red',
        opacity: 0.3,
      }),
      circle,
      itext,
    ],
    {
      backgroundColor: 'blue',
      subTargetCheck: true,
      interactive: true,
      objectCaching,
    }
  );
  canvas.add(text, g);
  g.clone().then((clone) => {
    clone.set({
      backgroundColor: 'red',
    });
    canvas.add(clone);
  });
  g.clone().then((clone) => {
    clone.item(2).set({ text: 'Edit me\nclip path layout' });
    clone.set({
      objectCaching,
      backgroundColor: 'magenta',
      clipPath: new fabric.Circle({
        radius: 110,
        group: clone,
        left: -50,
        top: -50,
        scaleX: 0.6,
      }),
    });
    clone.layoutManager.strategy = new fabric.ClipPathLayout();
    clone.triggerLayout();
    canvas.add(clone);
  });
  g.clone().then((clone) => {
    clone.item(2).set({ text: 'Edit me\nclip path layout' });
    clone.set({
      objectCaching,
      backgroundColor: 'yellow',
      clipPath: new fabric.Circle({
        radius: 110,
        originX: 'center',
        originY: 'center',
        group: clone,
      }),
    });
    clone.layoutManager.strategy = new fabric.ClipPathLayout();
    clone.triggerLayout();
    canvas.add(clone);
  });
  g.clone().then((clone) => {
    clone
      .item(2)
      .set({ text: 'Edit me\nabsolute positioned\nclip path layout' });
    clone.set({
      objectCaching,
      backgroundColor: 'cyan',
      clipPath: new fabric.Circle({
        radius: 110,
        originX: 'center',
        originY: 'center',
        absolutePositioned: true,
        left: 50,
        top: 150,
        skewX: 20,
      }),
    });
    clone.layoutManager.strategy = new fabric.ClipPathLayout();
    clone.triggerLayout();
    canvas.insertAt(0, clone);
  });
  canvas.on('after:render', () => {
    text.set('text', `circle is on screen? ${circle.isOnScreen()}`);
    text.dirty && canvas.requestRenderAll();
  });
}
