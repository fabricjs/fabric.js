import { describe, expect, it } from 'vitest';
import {
  calcDimensionsMatrix,
  composeMatrix,
  createRotateMatrix,
  invertTransform,
  isIdentityMatrix,
  multiplyTransformMatrices,
  multiplyTransformMatrixArray,
  qrDecompose,
  transformPoint,
} from './matrix';
import type { TMat2D } from '../../typedefs';
import { iMatrix, Point } from '../../../fabric';
import { toFixed } from './toFixed';

describe('matrix', () => {
  describe('calcDimensionsMatrix', () => {
    it('calculates dimension matrices correctly', () => {
      expect(
        typeof calcDimensionsMatrix === 'function',
        'calcDimensionsMatrix should exist',
      ).toBeTruthy();

      const matrix = calcDimensionsMatrix({
        scaleX: 2,
        scaleY: 3,
        skewY: 10,
        skewX: 5,
      });

      const expected = [
        2.03085322377149, 0.5289809421253949, 0.17497732705184801, 3, 0, 0,
      ];

      expect(matrix, 'dimensions matrix is equal').toEqual(expected);

      const matrixFlipped = calcDimensionsMatrix({
        scaleX: 2,
        scaleY: 3,
        skewY: 10,
        skewX: 5,
        flipX: true,
        flipY: true,
      });

      const expectedFlipped = [
        -2.03085322377149, -0.5289809421253949, -0.17497732705184801, -3, 0, 0,
      ];

      expect(matrixFlipped, 'dimensions matrix flipped is equal').toEqual(
        expectedFlipped,
      );
    });
  });

  describe('composeMatrix', () => {
    it('composes matrix with transformation values correctly', () => {
      expect(typeof composeMatrix === 'function').toBeTruthy();

      const matrix = composeMatrix({
        scaleX: 2,
        scaleY: 3,
        skewX: 28,
        angle: 11,
        translateX: 100,
        translateY: 200,
      }).map(function (val) {
        return toFixed(val, 2);
      });

      expect(matrix, 'matrix is composed correctly').toEqual([
        1.96, 0.38, 0.47, 3.15, 100, 200,
      ]);
    });

    it('returns identity matrix with empty options', () => {
      expect(typeof composeMatrix === 'function').toBeTruthy();

      const matrix = composeMatrix({});

      expect(matrix, 'default is identity matrix').toEqual(iMatrix);
    });
  });

  describe('qrDecompose', () => {
    it('correctly decomposes identity matrix', () => {
      expect(typeof qrDecompose === 'function').toBeTruthy();

      const options = qrDecompose(iMatrix);

      expect(options.scaleX, 'imatrix has scale 1').toBe(1);
      expect(options.scaleY, 'imatrix has scale 1').toBe(1);
      expect(options.skewX, 'imatrix has skewX 0').toBe(0);
      expect(options.skewY, 'imatrix has skewY 0').toBe(0);
      expect(options.angle, 'imatrix has angle 0').toBe(0);
      expect(options.translateX, 'imatrix has translateX 0').toBe(0);
      expect(options.translateY, 'imatrix has translateY 0').toBe(0);
    });

    it('correctly decomposes transformation matrix', () => {
      expect(typeof qrDecompose === 'function').toBeTruthy();

      const options = qrDecompose([2, 0.4, 0.5, 3, 100, 200]);

      expect(Math.round(options.scaleX), 'matrix has expected scaleX').toBe(2);
      expect(Math.round(options.scaleY), 'matrix has expected scaleY').toBe(3);
      expect(Math.round(options.skewX), 'matrix has expected skewX').toBe(28);
      expect(options.skewY, 'matrix has skewY 0').toBe(0);
      expect(Math.round(options.angle), 'matrix has expected angle').toBe(11);
      expect(options.translateX, 'matrix has translateX 100').toBe(100);
      expect(options.translateY, 'matrix has translateY 200').toBe(200);
    });
  });

  describe('transformPoint', () => {
    it('transforms a point using a transformation matrix', () => {
      const point = new Point(2, 2);
      const matrix = [3, 0, 0, 2, 10, 4] as TMat2D;
      const tp = transformPoint(point, matrix);

      expect(Math.round(tp.x)).toBe(16);
      expect(Math.round(tp.y)).toBe(8);
    });
  });

  describe('invertTransform', () => {
    it('correctly inverts transform', () => {
      expect(invertTransform).toBeTypeOf('function');
      const m1 = [1, 2, 3, 4, 5, 6] as TMat2D;
      const m3 = invertTransform(m1);
      expect(m3).toEqual([-2, 1, 1.5, -0.5, 1, -2]);
    });
  });

  describe('identityMatrix', () => {
    it('correctly checks identity matrix', () => {
      // Test identity matrix
      expect(isIdentityMatrix([1, 0, 0, 1, 0, 0])).toBe(true);
      // Test non-identity matrix
      expect(isIdentityMatrix([1, 2, 3, 4, 5, 6])).toBe(false);
    });
  });

  describe('multiplyTransformMatrixArray', () => {
    it('multiplies arrays of transform matrices correctly', () => {
      const m1 = [1, 2, 3, 4, 10, 20] as TMat2D;
      const m2 = [5, 6, 7, 8, 30, 40] as TMat2D;

      expect(multiplyTransformMatrixArray([m1, m2])).toEqual([
        23, 34, 31, 46, 160, 240,
      ]);

      expect(multiplyTransformMatrixArray([m1, m2], true)).toEqual([
        23, 34, 31, 46, 0, 0,
      ]);

      expect(multiplyTransformMatrixArray([m1, m2])).toEqual(
        multiplyTransformMatrices(m1, m2),
      );

      expect(multiplyTransformMatrixArray([m1, m2], true)).toEqual(
        multiplyTransformMatrices(m1, m2, true),
      );
    });
  });

  describe('multiplyTransformMatrices', () => {
    it('multiplies transformation matrices correctly', () => {
      const m1 = [1, 1, 1, 1, 1, 1] as TMat2D;
      const m2 = [1, 1, 1, 1, 1, 1] as TMat2D;

      const m3 = multiplyTransformMatrices(m1, m2);
      expect(m3).toEqual([2, 2, 2, 2, 3, 3]);

      const m3WithZeroTranslation = multiplyTransformMatrices(m1, m2, true);
      expect(m3WithZeroTranslation).toEqual([2, 2, 2, 2, 0, 0]);
    });
  });

  describe('createRotateMatrix', () => {
    it('creates correct rotation matrix for basic angle', () => {
      const matrix = createRotateMatrix({ angle: 90 });
      const expected = [0, 1, -1, 0, 0, 0];

      expect(matrix).toEqual(expected);
    });

    it('creates correct rotation matrix with origin point', () => {
      const matrix = createRotateMatrix({ angle: 90 }, { x: 100, y: 200 });
      const expected = [0, 1, -1, 0, 300, 100];

      expect(matrix).toEqual(expected);
      expect(new Point().rotate(Math.PI / 2, new Point(100, 200))).toEqual(
        new Point(300, 100),
      );
    });
  });
});
