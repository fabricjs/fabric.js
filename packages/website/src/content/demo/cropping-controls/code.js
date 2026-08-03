const canvas = new fabric.Canvas(canvasEl, {
  backgroundColor: '#f5f5f5',
});

// Both factories come from `fabric/extensions`:
//
//   import {
//     createImageCroppingControls,
//     createImageResizeControlsWithScaleToCover,
//   } from 'fabric/extensions';
//
// In this editor they are pre-imported for you as `extensions`.
const { createImageCroppingControls, createImageResizeControlsWithScaleToCover } =
  extensions;

const shared = {
  scaleX: 0.45,
  scaleY: 0.45,
  cropX: 80,
  cropY: 80,
  width: 400,
  height: 400,
  cornerColor: '#ffffff',
  borderScaleFactor: 2,
  transparentCorners: false,
  padding: 0,
};

const label = (text, left, top, fill) =>
  new fabric.FabricText(text, {
    left,
    top,
    fontSize: 14,
    fontFamily: 'sans-serif',
    fill,
    originX: 'center',
    selectable: false,
    evented: false,
  });

const imageUrl = '/assets/dragon.jpg';

Promise.all([
  fabric.FabricImage.fromURL(imageUrl),
  fabric.FabricImage.fromURL(imageUrl),
]).then(([cropped, resized]) => {
  // Replace the whole control set: every handle now moves the crop window
  // instead of scaling the object.
  cropped.controls = createImageCroppingControls();
  cropped.set({
    ...shared,
    left: 210,
    top: 250,
    cornerStyle: 'circle',
    cornerStrokeColor: '#7c3aed',
    borderColor: '#7c3aed',
  });

  // Keep the default controls and swap in only the four side handles.
  const edge = createImageResizeControlsWithScaleToCover();
  Object.assign(resized.controls, {
    ml: edge.mle,
    mr: edge.mre,
    mt: edge.mte,
    mb: edge.mbe,
  });
  resized.set({
    ...shared,
    left: 590,
    top: 250,
    cornerStrokeColor: '#0284c7',
    borderColor: '#0284c7',
  });

  canvas.add(
    cropped,
    resized,
    label('createImageCroppingControls()', 210, 380, '#7c3aed'),
    label('drag any handle to move the crop window', 210, 404, '#64748b'),
    label('createImageResizeControlsWithScaleToCover()', 590, 380, '#0284c7'),
    label('drag a side handle to resize, corners still scale', 590, 404, '#64748b'),
  );
  canvas.setActiveObject(cropped);
});
