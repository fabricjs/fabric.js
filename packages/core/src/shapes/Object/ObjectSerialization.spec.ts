import { FabricObject } from './FabricObject';
import { Rect } from '../Rect';
import { FabricObject as BaseFabricObject } from './Object';

import { describe, expect, test } from 'vitest';

describe('FabricObject toObject', () => {
  test('without custom properties', () => {
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj).toMatchObject({ name: 'test1', key2: 'value2' });
    const serialized = obj.toObject();
    expect(serialized).not.toHaveProperty('name');
    expect(serialized).not.toHaveProperty('key2');
  });
  test('with custom properties', () => {
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj).toMatchObject({ name: 'test1', key2: 'value2' });
    const serialized = obj.toObject(['name']);
    expect(serialized.name).toBe('test1');
    expect(serialized).not.toHaveProperty('key2');
  });
  test('with default custom properties', () => {
    FabricObject.customProperties = ['key2'];
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj).toMatchObject({ name: 'test1', key2: 'value2' });
    const serialized = obj.toObject();
    expect(serialized).not.toHaveProperty('name');
    expect(serialized).toHaveProperty('key2', 'value2');
  });
  test('with both custom properties', () => {
    FabricObject.customProperties = ['key2'];
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj).toMatchObject({ name: 'test1', key2: 'value2' });
    const serialized = obj.toObject(['name']);
    expect(serialized.name).toBe('test1');
    expect(serialized).toHaveProperty('key2', 'value2');
  });
  test('customProperties gets cloned', async () => {
    FabricObject.customProperties = ['key2', 'name'];
    const obj = new FabricObject({ name: 'test1', key2: 'value2' });
    expect(obj).toMatchObject({ name: 'test1', key2: 'value2' });
    const clone = await obj.clone();
    expect(clone).toMatchObject({ name: 'test1', key2: 'value2' });
  });
  test('with both custom properties', () => {
    BaseFabricObject.customProperties = ['key2', 'name'];
    Rect.customProperties = ['key1'];
    const obj = new Rect({ name: 'test1', key2: 'value2', key1: 'value1' });
    expect(obj).toMatchObject({
      name: 'test1',
      key2: 'value2',
      key1: 'value1',
    });
    const serialized = obj.toObject();
    expect(serialized).toMatchObject({
      name: 'test1',
      key2: 'value2',
      key1: 'value1',
    });
  });
});
