import { IText } from '../IText/IText';
import { Canvas } from '../../canvas/Canvas';

import { ValueAnimation } from '../../util/animation/ValueAnimation';

const currentAnimation = [];

const origCalculate = ValueAnimation.prototype.calculate;
ValueAnimation.prototype.calculate = function (timeElapsed: number) {
  const value = origCalculate.call(this, timeElapsed);
  currentAnimation.push(value.value.toFixed(3));
  return value;
};

describe('IText click behaviour', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  test('cursor animation on editing', () => {
    const iText = new IText('test need some word\nsecond line');
    const canvas = new Canvas();
    canvas.add(iText);
    iText.enterEditing();
    jest.advanceTimersByTime(2000);
    expect(currentAnimation).toMatchSnapshot();
  });
});
