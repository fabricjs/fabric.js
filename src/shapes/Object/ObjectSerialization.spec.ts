import { FabricObject } from './FabricObject';
import { Rect } from '../Rect';
import { FabricObject as BaseFabricObject } from './Object';

describe('FabricObject toObject', () => {
  test('without custom properties', () => {
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj.name).toBe('test1');
    expect(obj.key2).toBe('value2');
    const serialized = obj.toObject();
    expect(serialized.name).toBe(undefined);
    expect(serialized.key2).toBe(undefined);
  });
  test('with custom properties', () => {
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj.name).toBe('test1');
    expect(obj.key2).toBe('value2');
    const serialized = obj.toObject(['name']);
    expect(serialized.name).toBe('test1');
    expect(serialized.key2).toBe(undefined);
  });
  test('with default custom properties', () => {
    FabricObject.customProperties = ['key2'];
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj.name).toBe('test1');
    expect(obj.key2).toBe('value2');
    const serialized = obj.toObject();
    expect(serialized.name).toBe(undefined);
    expect(serialized.key2).toBe('value2');
  });
  test('with both custom properties', () => {
    FabricObject.customProperties = ['key2'];
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj.name).toBe('test1');
    expect(obj.key2).toBe('value2');
    const serialized = obj.toObject(['name']);
    expect(serialized.name).toBe('test1');
    expect(serialized.key2).toBe('value2');
  });
  test('customProperties gets cloned', async () => {
    FabricObject.customProperties = ['key2', 'name'];
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj.name).toBe('test1');
    expect(obj.key2).toBe('value2');
    const clone = await obj.clone();
    expect(clone.name).toBe('test1');
    expect(clone.key2).toBe('value2');
  });
  test('with both custom properties', () => {
    BaseFabricObject.customProperties = ['key2', 'name'];
    Rect.customProperties = ['key1'];
    const obj = new Rect({ name: 'test1', key2: 'value2', key1: 'value1' });
    expect(obj.name).toBe('test1');
    expect(obj.key2).toBe('value2');
    expect(obj.key1).toBe('value1');
    const serialized = obj.toObject();
    expect(serialized.name).toBe('test1');
    expect(serialized.key2).toBe('value2');
    expect(serialized.key1).toBe('value1');
  });
});
