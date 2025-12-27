import { type FabricImage } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
/**
 * Coordinates the change to image to enter crop mode and returns
 * a function to exit crop mode
 */
export const enterCropMode = (fabricImage: FabricImage) => {
  const { lockMovementX, lockMovementY, controls } = fabricImage;
  fabricImage.controls = createImageCroppingControls();
  fabricImage.lockMovementX = true;
  fabricImage.lockMovementY = true;
  fabricImage.on('moving', (opt) => {
    // missing pan handling
  });
  return () => {
    fabricImage.controls = controls;
    fabricImage.lockMovementX = lockMovementX;
    fabricImage.lockMovementY = lockMovementY;
  };
};
