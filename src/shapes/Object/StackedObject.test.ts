import { Canvas } from '../../canvas/Canvas';
import { ActiveSelection } from '../ActiveSelection';
import { Group } from '../Group';
import { FabricObject } from './FabricObject';

describe('StackedObject', () => {
  test('isDescendantOf', function () {
    const canvas = new Canvas();
    const object = new FabricObject();
    const parent = new Group([]);
    expect(typeof object.isDescendantOf === 'function').toBe(true);
    parent.canvas = canvas;
    object.parent = parent;
    expect(object.isDescendantOf(parent)).toBe(true);
    object.parent = new Group();
    object.parent.parent = parent;
    expect(object.isDescendantOf(parent)).toBe(true);
    expect(object.isDescendantOf(canvas)).toBe(true);
    object.parent = undefined;
    expect(object.isDescendantOf(parent) === false).toBe(true);
    expect(object.isDescendantOf(canvas) === false).toBe(true);
    object.canvas = canvas;
    expect(object.isDescendantOf(canvas)).toBe(true);
    expect(object.isDescendantOf(object) === false).toBe(true);
    object.parent = parent;
    const activeSelection = new ActiveSelection([object], { canvas });
    expect(object.group).toEqual(activeSelection);
    expect(object.parent).toEqual(parent);
    expect(object.canvas).toEqual(canvas);
    expect(object.isDescendantOf(parent));
    expect(object.isDescendantOf(activeSelection)).toBe(true);
    expect(object.isDescendantOf(canvas));
    delete object.parent;
    expect(!object.isDescendantOf(parent));
    expect(object.isDescendantOf(activeSelection)).toBe(true);
    expect(object.isDescendantOf(canvas)).toBe(true);
  });

  test('getAncestors', () => {
    const canvas = new Canvas();
    const object = new FabricObject();
    const parent = new Group([]);
    const other = new Group();

    expect(object.getAncestors()).toEqual([]);
    object.parent = parent;
    expect(object.getAncestors()).toEqual([parent]);
    expect<Group[]>(object.getAncestors(true)).toEqual([parent]);
    parent.canvas = canvas;
    expect(object.getAncestors()).toEqual([parent, canvas]);
    parent.parent = other;
    expect(object.getAncestors()).toEqual([parent, other]);
    other.canvas = canvas;
    expect(object.getAncestors()).toEqual([parent, other, canvas]);
    delete object.parent;
    expect(object.getAncestors()).toEqual([]);
  });
});
