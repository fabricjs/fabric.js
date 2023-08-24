import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { cos } from '../../util/misc/cos';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { sin } from '../../util/misc/sin';

export const getObjectSizeVector = (object: FabricObject) => {
  const sizeVector = object._getTransformedDimensions().scalarDivide(2);
  if (object.angle) {
    const rad = degreesToRadians(object.angle),
      sine = Math.abs(sin(rad)),
      cosine = Math.abs(cos(rad)),
      rx = sizeVector.x * cosine + sizeVector.y * sine,
      ry = sizeVector.x * sine + sizeVector.y * cosine;
    return new Point(rx, ry);
  }
  return sizeVector;
};

export const getObjectBounds = (object: FabricObject) => {
  const objCenter = object.getRelativeCenterPoint();
  const sizeVector = getObjectSizeVector(object);
  return [objCenter.subtract(sizeVector), objCenter.add(sizeVector)];
};
