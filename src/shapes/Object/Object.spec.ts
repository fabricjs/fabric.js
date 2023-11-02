import { Shadow } from '../../Shadow';
import { Rect } from '../Rect';
import { FabricObject } from './Object';

describe('Object', () => {
  it('rotate with centered rotation', () => {
    const fObj = new FabricObject({
      centeredRotation: true,
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // test that top changed because of centered rotation
    expect(fObj.top).toBe(10);
    // test that left changed because of centered rotation
    expect(fObj.left).toBe(10);
  });
  it('rotate with origin rotation', () => {
    const fObj = new FabricObject({
      centeredRotation: false,
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // top and left are still 0, 0
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
  });
  it('rotate with centered rotation but origin set to center', () => {
    const fObj = new FabricObject({
      centeredRotation: true,
      originX: 'center',
      originY: 'center',
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // test that left is unchanged because of origin being center
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
  });
  describe('needsItsOwnCache', () => {
    it('returns false for default values', () => {
      const rect = new Rect({ width: 100, height: 100 });
      expect(rect.needsItsOwnCache()).toBe(false);
    });
    it('returns true when a clipPath is present', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.clipPath = new Rect({ width: 50, height: 50 });
      expect(rect.needsItsOwnCache()).toBe(true);
    });
    it('returns true when paintFirst is stroke and there is a shadow', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = 'black';
      rect.shadow = new Shadow({ color: 'green' });
      expect(rect.needsItsOwnCache()).toBe(true);
    });
    it('returns false when paintFirst is stroke and there is no shadow', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = 'black';
      rect.shadow = null;
      expect(rect.needsItsOwnCache()).toBe(false);
    });
    it('returns false when paintFirst is stroke but no stroke', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = '';
      rect.shadow = new Shadow({ color: 'green' });
      expect(rect.needsItsOwnCache()).toBe(false);
    });
    it('returns false when paintFirst is stroke but no fill', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = 'black';
      rect.fill = '';
      rect.shadow = new Shadow({ color: 'green' });
      expect(rect.needsItsOwnCache()).toBe(false);
    });
  });
});
