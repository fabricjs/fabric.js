import type { renderTestType } from '../../../types';

export const selectedTextWithClipPath: renderTestType = {
  size: [450, 450],
  percentage: 0.03,
  title: 'Selected text with clipping',
  golden: 'selectedClippedText.png',
  disabled: 'node',
  renderFunction: async function render(canvas, fabric) {
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sem massa, suscipit non elit vel, viverra luctus quam. Suspendisse aliquet pellentesque ligula, vel mattis risus sagittis ut. Cras lacinia odio sed neque aliquam, id faucibus nisi volutpat. Aenean vel risus eget eros sodales vestibulum. Vivamus et elit convallis, auctor ipsum sit amet, accumsan ante. Vivamus scelerisque nisi sed nisi faucibus accumsan at ac est. Vivamus vel scelerisque orci, sit amet vulputate nulla. Praesent tempus mauris ut metus congue, quis aliquam lacus congue. Maecenas ut accumsan felis, et varius justo. Donec at purus eget mauris elementum rutrum a vitae diam. Nulla commodo eros vel urna ornare, in convallis eros egestas. Proin aliquet tincidunt dui sed auctor. Nulla facilisi. Fusce a gravida metus, in efficitur diam.`;
    canvas.preserveObjectStacking = true;
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
      lockMovementX: true,
      lockMovementY: true,
      originX: 'center',
      originY: 'center',
    });

    const rect = new fabric.Rect({
      originX: 'center',
      originY: 'center',
      fill: '#ccc',
      height: 200,
      width: textbox.width,
    });

    const circle = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      radius: 150,
    });

    textbox.clipPath = circle;

    const rect2 = new fabric.Rect({
      originX: 'center',
      originY: 'center',
      height: 200,
      width: textbox.width,
    });

    const progenitor = new fabric.Group([rect, textbox], {
      originX: 'center',
      originY: 'center',
      backgroundColor: '#f5d55f',
      interactive: true,
      left: 0,
      subTargetCheck: true,
      top: 0,
      clipPath: rect2,
      layoutManager: new fabric.LayoutManager(new fabric.ClipPathLayout()),
    });

    canvas.centerObject(progenitor);

    canvas.add(progenitor);
    // canvas.setActiveObject(textbox);
    textbox.enterEditing();
    textbox.selectAll();
    textbox.renderCursorOrSelection();
    await new Promise((resolve) => {
      setTimeout(resolve, 32);
    });
    canvas.preserveObjectStacking = false;
  },
};
