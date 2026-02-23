import * as fabric from 'fabric';
import * as extensions from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 900, height: 700 });
  canvas.backgroundColor = '#f5f5f5';

  const edgeControls = extensions.createImageEdgeResizeControls();

  const image = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );
  image.once('mousedblclick', extensions.enterCropMode);
  Object.assign(image.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });
  image.set({
    left: 220,
    top: 200,
    scaleX: 0.4,
    scaleY: 0.4,
    angle: 10,
    cropX: 80,
    cropY: 80,
    width: 400,
    height: 400,
    cornerStrokeColor: 'blue',
    cornerColor: 'white',
    borderColor: 'blue',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
  });

  const flippedImage = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );
  flippedImage.once('mousedblclick', extensions.enterCropMode);
  Object.assign(flippedImage.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });
  flippedImage.set({
    left: 620,
    top: 200,
    scaleX: 0.4,
    scaleY: 0.4,
    angle: 10,
    flipX: true,
    cropX: 80,
    cropY: 80,
    width: 400,
    height: 400,
    cornerStrokeColor: 'red',
    cornerColor: 'white',
    borderColor: 'red',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
  });

  // Cropped image inside a rotated Group
  const groupedImage = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );
  groupedImage.once('mousedblclick', extensions.enterCropMode);
  Object.assign(groupedImage.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });
  groupedImage.set({
    cropX: 100,
    cropY: 60,
    width: 350,
    height: 350,
    flipX: true,
    cornerStrokeColor: 'green',
    cornerColor: 'white',
    borderColor: 'green',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
  });

  const group = new fabric.Group([groupedImage], {
    left: 420,
    top: 500,
    angle: 25,
    scaleX: 0.35,
    scaleY: 0.35,
    subTargetCheck: true,
    interactive: true,
    borderColor: 'green',
  });

  // Cropped image inside a flipped + rotated Group (hardest case)
  const groupedImage2 = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );
  groupedImage2.once('mousedblclick', extensions.enterCropMode);
  Object.assign(groupedImage2.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });
  groupedImage2.set({
    cropX: 80,
    cropY: 80,
    width: 400,
    height: 400,
    cornerStrokeColor: 'purple',
    cornerColor: 'white',
    borderColor: 'purple',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
  });

  const flippedGroup = new fabric.Group([groupedImage2], {
    left: 750,
    top: 500,
    angle: -15,
    flipX: true,
    scaleX: 0.3,
    scaleY: 0.3,
    subTargetCheck: true,
    interactive: true,
    borderColor: 'purple',
  });

  canvas.add(image, flippedImage, group, flippedGroup);

  // Labels
  const labels = [
    { text: 'Rotated + Cropped', left: 220, top: 60 },
    { text: 'Rotated + FlipX + Cropped', left: 620, top: 60 },
    { text: 'FlipX + Cropped in Rotated Group', left: 420, top: 380 },
    { text: 'Cropped in Flipped + Rotated Group', left: 750, top: 380 },
  ];
  labels.forEach(({ text, left, top }) => {
    canvas.add(
      new fabric.FabricText(text, {
        left,
        top,
        fontSize: 14,
        fontFamily: 'sans-serif',
        fill: '#666',
        originX: 'center',
        selectable: false,
        evented: false,
      }),
    );
  });
}
