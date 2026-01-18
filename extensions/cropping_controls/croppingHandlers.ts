import type {
  TModificationEvents,
  Transform,
  TransformActionHandler,
  FabricImage,
  ObjectEvents,
  Control,
  TMat2D,
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
  let cropX =
    original.cropX! - (p.x / fabricImage.scaleX) * (fabricImage.flipX ? -1 : 1);
  let cropY =
    original.cropY! - (p.y / fabricImage.scaleY) * (fabricImage.flipY ? -1 : 1);
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

/**
 * This position handler works only for this specific use case.
 * It does not support padding nor offset, and it reduces all possible positions
 * to the main 4 corners only.
 * Any position that is < 0 is the extreme left/top, the rest are right/bottom
 */
export function ghostScalePositionHandler(
  this: Control,
  dim: Point, // currentDimension
  finalMatrix: TMat2D,
  fabricObject: FabricImage,
  // currentControl: Control,
) {
  const matrix = fabricObject.calcTransformMatrix();
  const vpt = fabricObject.getViewportTransform();
  const _finalMatrix = util.multiplyTransformMatrices(vpt, matrix);

  let x = 0;
  let y = 0;
  if (this.x < 0) {
    x = -fabricObject.width / 2 - fabricObject.cropX;
  } else {
    x =
      fabricObject.getElement().width -
      fabricObject.width / 2 -
      fabricObject.cropX;
  }

  if (this.y < 0) {
    y = -fabricObject.height / 2 - fabricObject.cropY;
  } else {
    y =
      fabricObject.getElement().height -
      fabricObject.height / 2 -
      fabricObject.cropY;
  }
  return new Point(x, y).transform(_finalMatrix);
}

const calcScale = (currentPoint: Point, height: number, width: number) =>
  Math.min(Math.abs(currentPoint.x / width), Math.abs(currentPoint.y / height));

/**
 * Action handler generator that handles scaling of an image in crop mode.
 * The goal is to keep the current bounding box steady.
 * So this action handler has its own calculations for a dynamic anchor point
 */
export const scaleEquallyCropGenerator =
  (cx: number, cy: number): TransformActionHandler =>
  (eventData, transform, x, y) => {
    const { target } = transform as unknown as { target: FabricImage };
    const { width: fullWidth, height: fullHeight } = target.getElement();
    const remainderX = fullWidth - target.width - target.cropX;
    const remainderY = fullHeight - target.height - target.cropY;
    const anchorOriginX =
      cx < 0 ? 1 + remainderX / target.width : -target.cropX / target.width;
    const anchorOriginY =
      cy < 0 ? 1 + remainderY / target.height : -target.cropY / target.height;
    const constraint = target.translateToOriginPoint(
      target.getCenterPoint(),
      anchorOriginX,
      anchorOriginY,
    );
    const newPoint = controlsUtils.getLocalPoint(
      transform,
      anchorOriginX,
      anchorOriginY,
      x,
      y,
    );
    const scale = calcScale(newPoint, fullHeight, fullWidth);
    const scaleChangeX = scale / target.scaleX;
    const scaleChangeY = scale / target.scaleY;
    const scaledRemainderX = remainderX / scaleChangeX;
    const scaledRemainderY = remainderY / scaleChangeY;
    const newWidth = target.width / scaleChangeX;
    const newHeight = target.height / scaleChangeY;
    const newCropX =
      cx < 0
        ? fullWidth - newWidth - scaledRemainderX
        : target.cropX / scaleChangeX;
    const newCropY =
      cy < 0
        ? fullHeight - newHeight - scaledRemainderY
        : target.cropY / scaleChangeY;

    if (
      (cx < 0 ? scaledRemainderX : newCropX) + newWidth > fullWidth ||
      (cy < 0 ? scaledRemainderY : newCropY) + newHeight > fullHeight
    ) {
      return false;
    }

    target.scaleX = scale;
    target.scaleY = scale;
    target.width = newWidth;
    target.height = newHeight;
    target.cropX = newCropX;
    target.cropY = newCropY;
    const newAnchorOriginX =
      cx < 0 ? 1 + scaledRemainderX / newWidth : -newCropX / newWidth;
    const newAnchorOriginY =
      cy < 0 ? 1 + scaledRemainderY / newHeight : -newCropY / newHeight;
    target.setPositionByOrigin(constraint, newAnchorOriginX, newAnchorOriginY);
    return true;
  };

export function renderGhostImage(
  this: FabricImage,
  { ctx }: { ctx: CanvasRenderingContext2D },
) {
  const alpha = ctx.globalAlpha;
  ctx.globalAlpha *= 0.5;
  ctx.drawImage(
    this._element,
    -this.width / 2 - this.cropX,
    -this.height / 2 - this.cropY,
  );
  ctx.globalAlpha = alpha;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Generator for edge resize handlers that support cover scale with bounce-back.
 * Similar pattern to scaleEquallyCropGenerator.
 */
const changeImageEdgeGenerator =
  (axis: 'x' | 'y'): TransformActionHandler =>
  (_eventData, transform, x, y) => {
    const image = transform.target as FabricImage;
    const original = transform.original as {
      cropX?: number;
      cropY?: number;
      scaleX: number;
      scaleY: number;
    };

    const isX = axis === 'x';
    const elementSize = isX ? image._element.width : image._element.height;
    const crossElementSize = isX ? image._element.height : image._element.width;
    const isNegativeEdge = isX
      ? transform.originX === 'right'
      : transform.originY === 'bottom';

    const initialSize = isX ? transform.width : transform.height;
    const initialCrossSize = isX ? transform.height : transform.width;
    const initialCrop = isX ? (original.cropX ?? 0) : (original.cropY ?? 0);
    const initialCrossCrop = isX
      ? (original.cropY ?? 0)
      : (original.cropX ?? 0);
    const initialScale = isX ? original.scaleX : original.scaleY;
    const initialCrossScale = isX ? original.scaleY : original.scaleX;

    const localPoint = controlsUtils.getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y,
    );

    const minSize = 10;
    const rawSize = isNegativeEdge
      ? -(isX ? localPoint.x : localPoint.y)
      : isX
        ? localPoint.x
        : localPoint.y;
    const requestedSize = Math.max(minSize, rawSize / initialScale);

    const availableSize = isNegativeEdge
      ? initialCrop + initialSize
      : elementSize - initialCrop;

    const setImageProps = (
      size: number,
      crossSize: number,
      scale: number,
      crop: number,
      crossCrop: number,
    ) => {
      if (isX) {
        image.width = size;
        image.height = crossSize;
        image.cropX = crop;
        image.cropY = crossCrop;
      } else {
        image.height = size;
        image.width = crossSize;
        image.cropY = crop;
        image.cropX = crossCrop;
      }
      image.scaleX = scale;
      image.scaleY = scale;
    };

    if (requestedSize <= availableSize) {
      const newCrop = isNegativeEdge
        ? Math.max(0, initialCrop + initialSize - requestedSize)
        : initialCrop;
      setImageProps(
        Math.max(1, requestedSize),
        initialCrossSize,
        initialScale,
        newCrop,
        initialCrossCrop,
      );
    } else {
      const targetScaledSize = requestedSize * initialScale;
      const newScale = targetScaledSize / availableSize;

      const scaledCrossSize = initialCrossSize * initialCrossScale;
      const crossNaturalInView = scaledCrossSize / newScale;
      const newCrossSize = Math.min(crossNaturalInView, crossElementSize);
      const crossCenter = initialCrossCrop + initialCrossSize / 2;
      const newCrossCrop = clamp(
        crossCenter - newCrossSize / 2,
        0,
        crossElementSize - newCrossSize,
      );

      setImageProps(
        availableSize,
        newCrossSize,
        newScale,
        isNegativeEdge ? 0 : initialCrop,
        newCrossCrop,
      );
    }

    return true;
  };

export const changeImageEdgeWidth = changeImageEdgeGenerator('x');
export const changeImageEdgeHeight = changeImageEdgeGenerator('y');

export const changeEdgeWidth = wrapWithFireEvent(
  'RESIZING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageEdgeWidth),
);

export const changeEdgeHeight = wrapWithFireEvent(
  'RESIZING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageEdgeHeight),
);
