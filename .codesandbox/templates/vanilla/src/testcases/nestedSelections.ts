import * as fabric from 'fabric';

export function testCase(canvas) {
  canvas.preserveObjectStacking = true;
  const circle = new fabric.Circle({ left: 100, top: 50, radius: 50 });
  const text = new fabric.FabricText('', { evented: false });
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
      //objectCaching: false
    }
  );
  canvas.add(text, g);
  g.clone().then((clone) => {
    clone.item(2).set({ text: 'Edit me\nclip path layout' });
    clone.set({
      backgroundColor: 'magenta',
      clipPath: new fabric.Circle({
        radius: 110,
        group: clone,
        //left: -50, top: -50,
        // scaleX:0.6
      }),
      layoutManager: 'clip-path',
    });
    // canvas.add(clone);
  });
  g.clone().then((clone) => {
    clone.item(2).set({ text: 'Edit me\nclip path layout' });
    clone.set({
      backgroundColor: 'yellow',
      clipPath: new fabric.Circle({
        radius: 110,
        //left: -50, top: -50,
        originX: 'center',
        originY: 'center',
        group: clone,
      }),
    });
    clone.layoutManager.strategy = new fabric.ClipPathLayout();
    clone.triggerLayout();
    canvas.add(clone);
    setInterval(() => {
      clone._set('dirty', true);
    }, 0);
  });
  g.clone().then((clone) => {
    clone
      .item(2)
      .set({ text: 'Edit me\nabsolute positioned\nclip path layout' });
    clone.set({
      backgroundColor: '#0dcaf0',
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
    canvas.insertAt(clone, 0);
  });
  canvas.on('after:render', () => {
    text.set('text', `circle is on screen? ${circle.isOnScreen()}`);
    text.dirty && canvas.requestRenderAll();
  });
}
