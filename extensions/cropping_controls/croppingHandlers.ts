import type {
  TModificationEvents,
  Transform,
  TransformActionHandler,
  FabricImage,
  ObjectEvents,
} from 'fabric';
import { controlsUtils, Point, util } from 'fabric';

const { wrapWithFixedAnchor, wrapWithFireEvent } = controlsUtils;

/**
 * Wrap controlsUtils.changeObjectWidth with image constrains
 */
export const changeImageWidth: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const { width } = target;
  const image = target as FabricImage;
  const modified = controlsUtils.changeObjectWidth(eventData, transform, x, y);
  const availableWidth = image._element.width - image.cropX;
  if (modified) {
    if (image.width > availableWidth) {
      image.width = availableWidth;
    }
    if (image.width < 1) {
      image.width = 1;
    }
  }
  return width !== image.width;
};

export const changeCropWidth = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageWidth),
);

/**
 * Wrap controlsUtils.changeObjectHeight with image constrains
 */
export const changeImageHeight: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const { height } = target;
  const image = target as FabricImage;
  const modified = controlsUtils.changeObjectHeight(eventData, transform, x, y);
  const availableHeight = image._element.height - image.cropY;
  if (modified) {
    if (image.height > availableHeight) {
      image.height = availableHeight;
    }
    if (image.height < 1) {
      image.height = 1;
    }
  }
  return height !== image.height;
};

export const changeCropHeight = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageHeight),
);

export const changeImageCropX: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const image = target as FabricImage;
  const { width, cropX } = image;
  const modified = controlsUtils.changeObjectWidth(eventData, transform, x, y);
  let newCropX = cropX + width - image.width;
  image.width = width;
  if (modified) {
    if (newCropX < 0) {
      newCropX = 0;
    }
    image.cropX = newCropX;
    // calculate new width on the base of how much crop we have now
    image.width += cropX - newCropX;
  }
  return newCropX !== cropX;
};

export const changeImageCropY: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const image = target as FabricImage;
  const { height, cropY } = image;
  const modified = controlsUtils.changeObjectHeight(eventData, transform, x, y);
  let newCropY = cropY + height - image.height;
  image.height = height;
  if (modified) {
    if (newCropY < 0) {
      newCropY = 0;
    }
    image.cropY = newCropY;
    image.height += cropY - newCropY;
  }
  return newCropY !== cropY;
};

export const changeCropX = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageCropX),
);

export const changeCropY = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageCropY),
);

/**
 * A function to counter the move action and change cropX/cropY of an image
 * Keep the image steady, but moves it inside its own cropping rectangle
 */
export const cropPanMoveHandler = ({ transform }: ObjectEvents['moving']) => {
  // this makes the image pan too fast.
  const { target, original } = transform as Transform;
  const fabricImage = target as FabricImage;
  const p = new Point(
    target.left - original.left,
    target.top - original.top,
  ).transform(
    util.invertTransform(
      util.createRotateMatrix({ angle: fabricImage.getTotalAngle() }),
    ),
  );
  let cropX = original.cropX! - p.x / fabricImage.scaleX;
  let cropY = original.cropY! - p.y / fabricImage.scaleY;
  const { width, height, _element } = fabricImage;
  if (cropX < 0) {
    cropX = 0;
  }
  if (cropY < 0) {
    cropY = 0;
  }
  if (cropX + width > _element.width) {
    cropX = _element.width - width;
  }
  if (cropY + height > _element.height) {
    cropY = _element.height - height;
  }
  fabricImage.cropX = cropX;
  fabricImage.cropY = cropY;
  fabricImage.left = original.left;
  fabricImage.top = original.top;
};
