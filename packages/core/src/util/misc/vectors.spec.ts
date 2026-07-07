import { describe, it, expect } from 'vitest';
import { isBetweenVectors, rotateVector } from './vectors';
import { Point } from '../../Point';

describe('vectors', () => {
  describe('rotateVector', () => {
    it('exists as a function', () => {
      expect(typeof rotateVector === 'function').toBeTruthy();
    });
  });

  describe('isBetweenVectors', () => {
    it('exists as a function', () => {
      expect(
        typeof isBetweenVectors === 'function',
        'isBetweenVectors is a function',
      ).toBeTruthy();
    });

    describe('right angle tests', () => {
      const initialVector = new Point(1, 0);
      const finalVector = new Point(0, 1);

      it('correctly identifies vectors between two perpendicular vectors', () => {
        expect(
          isBetweenVectors(new Point(0.5, 0.5), initialVector, finalVector),
          'isBetweenVectors right angle #1',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(0.5, -0.5), initialVector, finalVector),
          'isBetweenVectors right angle #2',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(-0.5, 0.5), initialVector, finalVector),
          'isBetweenVectors right angle #3',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(-0.5, -0.5), initialVector, finalVector),
          'isBetweenVectors right angle #4',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(1, 0.99), initialVector, finalVector),
          'isBetweenVectors right angle #5',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(0, -0.01), initialVector, finalVector),
          'isBetweenVectors right angle #6',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(1, 0), initialVector, finalVector),
          'isBetweenVectors right angle #7',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(0, 1), initialVector, finalVector),
          'isBetweenVectors right angle #8',
        ).toBe(true);
      });
    });

    describe('acute angle tests', () => {
      const initialVector = new Point(1, 0);
      const finalVector = new Point(1, 0.5);

      it('correctly identifies vectors between two vectors forming an acute angle', () => {
        expect(
          isBetweenVectors(new Point(1, 0.25), initialVector, finalVector),
          'isBetweenVectors acute angle #1',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(-0.5, 0.5), initialVector, finalVector),
          'isBetweenVectors acute angle #2',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(-0.5, -0.5), initialVector, finalVector),
          'isBetweenVectors acute angle #3',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(0.5, -0.5), initialVector, finalVector),
          'isBetweenVectors acute angle #4',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(1, 0.2), initialVector, finalVector),
          'isBetweenVectors acute angle #5',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(1, 0.6), initialVector, finalVector),
          'isBetweenVectors acute angle #6',
        ).toBe(false);
      });
    });

    describe('obtuse angle tests', () => {
      const initialVector = new Point(1, 0.5);
      const finalVector = new Point(1, 0);

      it('correctly identifies vectors between two vectors forming an obtuse angle', () => {
        expect(
          isBetweenVectors(new Point(1, 0.25), initialVector, finalVector),
          'isBetweenVectors obtuse angle #1',
        ).toBe(false);

        expect(
          isBetweenVectors(new Point(-0.5, 0.5), initialVector, finalVector),
          'isBetweenVectors obtuse angle #2',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(-0.5, -0.5), initialVector, finalVector),
          'isBetweenVectors obtuse angle #3',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(0.5, -0.5), initialVector, finalVector),
          'isBetweenVectors obtuse angle #4',
        ).toBe(true);

        expect(
          isBetweenVectors(new Point(1, -0.2), initialVector, finalVector),
          'isBetweenVectors obtuse angle #5',
        ).toBe(true);
      });
    });
  });
});
