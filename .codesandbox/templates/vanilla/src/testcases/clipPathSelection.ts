import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  fabric.FabricObject.ownDefaults.originX = 'center';
  fabric.FabricObject.ownDefaults.originY = 'center';

  const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sem massa, suscipit non elit vel, viverra luctus quam. Suspendisse aliquet pellentesque ligula, vel mattis risus sagittis ut. Cras lacinia odio sed neque aliquam, id faucibus nisi volutpat. Aenean vel risus eget eros sodales vestibulum. Vivamus et elit convallis, auctor ipsum sit amet, accumsan ante. Vivamus scelerisque nisi sed nisi faucibus accumsan at ac est. Vivamus vel scelerisque orci, sit amet vulputate nulla. Praesent tempus mauris ut metus congue, quis aliquam lacus congue. Maecenas ut accumsan felis, et varius justo. Donec at purus eget mauris elementum rutrum a vitae diam. Nulla commodo eros vel urna ornare, in convallis eros egestas. Proin aliquet tincidunt dui sed auctor. Nulla facilisi. Fusce a gravida metus, in efficitur diam.`;

  const textbox = new fabric.Textbox(sampleText, {
    width: 300,
    editable: true,
    evented: true,
    fontFamily: 'Sans-serif',
    fontSize: 16,
    fontWeight: 'normal',
    hasBorders: false,
    hasControls: false,
    hoverCursor: 'text',
    interactive: true,
    lockMovementX: true,
    lockMovementY: true,
    noScaleCache: false,
    objectCaching: false,
  });

  const rect = new fabric.Rect({
    fill: '#ccc',
    objectCaching: false,
    height: 200,
    width: textbox.width,
    noScaleCache: false,
  });

  const circle = new fabric.Circle({
    fill: '#ccc',
    objectCaching: false,
    radius: 150,
  });

  textbox.clipPath = circle;

  const rect2 = new fabric.Rect({
    fill: '#ccc',
    objectCaching: false,
    height: 200,
    width: textbox.width,
    noScaleCache: false,
  });

  const progenitor = new fabric.Group([rect, textbox], {
    backgroundColor: '#f5d55f',
    interactive: true,
    left: 0,
    objectCaching: false,
    subTargetCheck: true,
    top: 0,
    clipPath: rect2,
    noScaleCache: false,
    layoutManager: new fabric.LayoutManager(new fabric.ClipPathLayout()),
  });

  canvas.centerObject(progenitor);

  canvas.add(progenitor);

  canvas.setActiveObject(textbox);
  textbox.enterEditing();
  textbox.selectAll();
  textbox.renderCursorOrSelection();
}
