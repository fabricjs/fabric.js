import { Shadow } from '../../Shadow';
import { Rect } from '../Rect';
import { FabricObject } from './Object';
import { Group } from '../Group';

describe('Object', () => {
  it('tests constructor & properties', () => {
    expect(typeof FabricObject).toBe('function');
    const cObj = new FabricObject();
    expect(cObj).toBeDefined();
    expect(cObj instanceof FabricObject).toBe(true);
    expect(cObj.constructor).toBe(FabricObject);

    expect((cObj.constructor as typeof FabricObject).type).toBe('FabricObject');
    expect(cObj.includeDefaultValues).toBe(true);

    //TODO: Add message 'object caching default value'
    expect(cObj.objectCaching).toBe(true);
  });
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
  describe('set method and dirty flag bubbling', () => {
    it('when dirty is true it bubbles', () => {
      const rect = new Rect({ width: 100, height: 100 });
      const group = new Group([rect]);
      group.dirty = false;
      expect(group.dirty).toBe(false);
      rect.set('dirty', true);
      expect(group.dirty).toBe(true);
    });
    it('when dirty is false it does not bubble', () => {
      const rect = new Rect({ width: 100, height: 100 });
      const group = new Group([rect]);
      group.dirty = true;
      expect(group.dirty).toBe(true);
      rect.set('dirty', false);
      expect(group.dirty).toBe(true);
    });
    it('when dirty is true it bubbles to the parent', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.group = new Group();
      rect.parent = new Group();
      rect.group.dirty = false;
      rect.parent.dirty = false;
      rect.dirty = false;
      rect.set('dirty', true);
      expect(rect.group.dirty).toBe(false);
      expect(rect.parent.dirty).toBe(true);
    });
  });
});
