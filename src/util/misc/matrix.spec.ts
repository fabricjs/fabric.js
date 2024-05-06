import { hasMatrixDimensionProps } from './matrix';

describe('matrix', () => {
  it('hasMatrixDimensionProps', () => {
    expect(hasMatrixDimensionProps({})).toBeFalsy();
    expect(hasMatrixDimensionProps({ scaleX: 0 })).toBeTruthy();
    expect(hasMatrixDimensionProps({ scaleY: 0 })).toBeTruthy();
    expect(hasMatrixDimensionProps({ scaleX: 1 })).toBeFalsy();
    expect(hasMatrixDimensionProps({ scaleY: 1 })).toBeFalsy();
    expect(hasMatrixDimensionProps({ skewX: 0 })).toBeFalsy();
    expect(hasMatrixDimensionProps({ skewY: 0 })).toBeFalsy();
    expect(hasMatrixDimensionProps({ flipX: true })).toBeTruthy();
    expect(hasMatrixDimensionProps({ flipY: true })).toBeTruthy();
    expect(hasMatrixDimensionProps({ flipX: false })).toBeFalsy();
    expect(hasMatrixDimensionProps({ flipY: false })).toBeFalsy();
    expect(hasMatrixDimensionProps({ flipY: false, scaleX: 0 })).toBeTruthy();
    expect(hasMatrixDimensionProps({ scaleY: 1, skewX: 1 })).toBeTruthy();
  });
});
