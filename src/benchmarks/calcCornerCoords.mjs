import {
  Object as FabricObject,
  Point,
  util,
  Control,
} from '../../dist/index.mjs';

// Swapping of calcCornerCoords in #9377

// OLD CODE FOR REFERENCE AND IMPLEMENTATION TEST

const halfPI = Math.PI / 2;

class OldControl extends Control {
  calcCornerCoords(
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
      const newTheta =
        controlTriangleAngle - util.degreesToRadians(objectAngle);
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

// END OF OLD CODE

const newObject = new FabricObject({ width: 100, height: 100 });

const oldObject = new OldObject({ width: 100, height: 100 });

newObject.controls = {
  tl: new Control({
    x: -0.5,
    y: -0.5,
  }),
};

oldObject.controls = {
  tl: new OldControl({
    x: -0.5,
    y: -0.5,
  }),
};

const benchmark = (callback) => {
  const start = Date.now();
  callback();
  return Date.now() - start;
};

const controlNew = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    newObject._calcCornerCoords(newObject.controls.tl, new Point(4.5, 4.5));
  }
});

const controlOld = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    oldObject._calcCornerCoords(oldObject.controls.tl, new Point(4.5, 4.5));
  }
});

console.log({ controlOld, controlNew });
