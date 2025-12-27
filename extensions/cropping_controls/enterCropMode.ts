import { type FabricImage, Point, util } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
/**
 * Coordinates the change to image to enter crop mode and returns
 * a function to exit crop mode
 */
export const enterCropMode = (fabricImage: FabricImage) => {
  const { lockMovementX, lockMovementY, controls } = fabricImage;
  fabricImage.controls = createImageCroppingControls();
  // fabricImage.lockMovementX = true;
  // fabricImage.lockMovementY = true;
  fabricImage.on('moving', ({ transform }) => {
    const { target, original } = transform;
    const p = new Point(target.left - original.left, target.top - original.top);
    p.transform(util.invertTransform(target.calcTransformMatrix()));
    fabricImage.cropX = original.cropX! - p.x;
    fabricImage.cropY = original.cropY! - p.y;
    fabricImage.left = original.left;
    fabricImage.top = original.top;
  });
  fabricImage.setCoords();
  return () => {
    fabricImage.controls = controls;
    fabricImage.lockMovementX = lockMovementX;
    fabricImage.lockMovementY = lockMovementY;
  };
};
