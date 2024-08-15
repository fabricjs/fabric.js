import { Point } from '../../Point';
import { iMatrix } from '../../constants';
import { Group } from '../../shapes/Group';
import { FabricObject } from '../../shapes/Object/FabricObject';
import type { TMat2D } from '../../typedefs';
import {
  createRotateMatrix,
  invertTransform,
  multiplyTransformMatrices,
} from './matrix';
import { applyTransformToObject } from './objectTransforms';
import {
  calcPlaneChangeMatrix,
  sendObjectToPlane,
  sendPointToPlane,
  sendVectorToPlane,
} from './planeChange';

describe('Plane Change', () => {
  test('calcPlaneChangeMatrix', () => {
    const m1: TMat2D = [1, 2, 3, 4, 5, 6];
    const s: TMat2D = [2, 0, 0, 0.5, 0, 0];
    expect(calcPlaneChangeMatrix()).toEqual(iMatrix);
    expect(calcPlaneChangeMatrix(undefined, m1)).toEqual(invertTransform(m1));
    expect(calcPlaneChangeMatrix(iMatrix, m1)).toEqual(invertTransform(m1));
    expect(calcPlaneChangeMatrix(m1, undefined)).toEqual(m1);
    expect(calcPlaneChangeMatrix(m1, iMatrix)).toEqual(m1);
    expect(calcPlaneChangeMatrix(m1, m1)).toEqual(iMatrix);
    expect(calcPlaneChangeMatrix(m1, s)).toEqual(
      multiplyTransformMatrices(invertTransform(s), m1),
    );
  });

  test('sendPointToPlane', () => {
    const s: TMat2D = [2, 0, 0, 0.5, 50, 50];
    const point = new Point(1, 1);
    expect(sendPointToPlane(point, s)).toEqual({ x: 52, y: 50.5 });
    expect(sendPointToPlane(point, undefined, s)).toEqual({ x: -24.5, y: -98 });
    expect(
      sendPointToPlane(point, createRotateMatrix({ angle: 90 }), s),
    ).toEqual({ x: -25.5, y: -98 });
    expect(sendPointToPlane(point, s, s)).toEqual(point);
    expect(sendPointToPlane(point)).toEqual(point);
  });

  test('sendVectorToPlane', () => {
    const s: TMat2D = [2, 0, 0, 0.5, 50, 50];
    const point = new Point(1, 1);
    expect(sendVectorToPlane(point, s)).toEqual({ x: 2, y: 0.5 });
    expect(sendVectorToPlane(point, undefined, s)).toEqual({ x: 0.5, y: 2 });
    expect(
      sendVectorToPlane(point, createRotateMatrix({ angle: 90 }), s),
    ).toEqual({ x: -0.5, y: 2 });
    expect(sendVectorToPlane(point, s, s)).toEqual(point);
    expect(sendVectorToPlane(point)).toEqual(point);
  });

  test('sendObjectToPlane', () => {
    const m: TMat2D = [6, Math.SQRT1_2, 0, 3, 2, 1];
    const m1: TMat2D = [3, 0, 0, 2, 10, 4];
    const m2: TMat2D = [1, Math.SQRT1_2, Math.SQRT1_2, 4, 5, 6];
    const group = new Group();
    const group2 = new Group();
    const obj = new FabricObject();

    jest.spyOn(group, 'isOnACache').mockReturnValue(false);

    applyTransformToObject(obj, m);
    applyTransformToObject(group, m1);
    applyTransformToObject(group2, m2);

    obj.group = group;
    const actual = sendObjectToPlane(
      obj,
      group.calcTransformMatrix(),
      group2.calcTransformMatrix(),
    );
    expect(actual).toEqualRoundedMatrix(
      multiplyTransformMatrices(
        invertTransform(group2.calcTransformMatrix()),
        group.calcTransformMatrix(),
      ),
    );
    expect(obj.calcOwnMatrix()).toEqualRoundedMatrix(
      multiplyTransformMatrices(actual, m),
    );

    obj.group = group2;
    expect(obj.calcTransformMatrix()).toEqualRoundedMatrix(
      multiplyTransformMatrices(
        multiplyTransformMatrices(group2.calcTransformMatrix(), actual),
        m,
      ),
    );

    //   sending to nowhere, no transform was applied
    expect(sendObjectToPlane(group2)).toEqualRoundedMatrix(iMatrix);
    expect(group2.calcOwnMatrix()).toEqualRoundedMatrix(m2);
  });
});
