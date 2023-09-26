import {
  Object as FabricObject,
  Point,
  util,
  halfPI,
} from '../../dist/index.mjs';

// Swapping of calcCornerCoords in #9377

// OLD CODE FOR REFERENCE AND IMPLEMENTATION TEST

function calcCornerCoords(
  objectAngle,
  angle,
  objectCornerSize,
  centerX,
  centerY,
  isTouch
) {
  let cosHalfOffset, sinHalfOffset, cosHalfOffsetComp, sinHalfOffsetComp;
  const xSize = isTouch ? this.touchSizeX : this.sizeX,
    ySize = isTouch ? this.touchSizeY : this.sizeY;
  if (xSize && ySize && xSize !== ySize) {
    // handle rectangular corners
    const controlTriangleAngle = Math.atan2(ySize, xSize);
    const cornerHypotenuse = Math.sqrt(xSize * xSize + ySize * ySize) / 2;
    const newTheta = controlTriangleAngle - util.degreesToRadians(objectAngle);
    const newThetaComp =
      halfPI - controlTriangleAngle - util.degreesToRadians(objectAngle);
    cosHalfOffset = cornerHypotenuse * util.cos(newTheta);
    sinHalfOffset = cornerHypotenuse * util.sin(newTheta);
    // use complementary angle for two corners
    cosHalfOffsetComp = cornerHypotenuse * util.cos(newThetaComp);
    sinHalfOffsetComp = cornerHypotenuse * util.sin(newThetaComp);
  } else {
    // handle square corners
    // use default object corner size unless size is defined
    const cornerSize = xSize && ySize ? xSize : objectCornerSize;
    const cornerHypotenuse = cornerSize * Math.SQRT1_2;
    // complementary angles are equal since they're both 45 degrees
    const newTheta = util.degreesToRadians(45 - objectAngle);
    cosHalfOffset = cosHalfOffsetComp = cornerHypotenuse * util.cos(newTheta);
    sinHalfOffset = sinHalfOffsetComp = cornerHypotenuse * util.sin(newTheta);
  }

  return {
    tl: new Point(centerX - sinHalfOffsetComp, centerY - cosHalfOffsetComp),
    tr: new Point(centerX + cosHalfOffset, centerY - sinHalfOffset),
    bl: new Point(centerX - cosHalfOffset, centerY + sinHalfOffset),
    br: new Point(centerX + sinHalfOffsetComp, centerY + cosHalfOffsetComp),
  };
}

class OldObject extends FabricObject {
  _calcCornerCoords(control, position) {
    const corner = control.calcCornerCoords(
      this.angle,
      this.cornerSize,
      position.x,
      position.y,
      false
    );
    const touchCorner = control.calcCornerCoords(
      this.angle,
      this.touchCornerSize,
      position.x,
      position.y,
      true
    );
    return { corner, touchCorner };
  }
}
