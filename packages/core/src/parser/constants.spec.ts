// Yes a file for testing contansts
import { describe, test, expect } from 'vitest';
import { reViewBoxAttrValue } from './constants';

describe('reViewBoxAttrValue', () => {
  test('can detect valid viewbox', () => {
    expect(reViewBoxAttrValue.test('0 0 408 1')).toBe(true);
    const parsed = '0 0 408 1'.match(reViewBoxAttrValue)!;
    expect(parsed[1]).toEqual('0');
    expect(parsed[2]).toEqual('0');
    expect(parsed[3]).toEqual('408');
    expect(parsed[4]).toEqual('1');
  });
  test('can detect valid viewbox', () => {
    expect(reViewBoxAttrValue.test('0.2 -0.0 -408.3 1')).toBe(true);
    const parsed = '0.2 -0.0 -408.3 1'.match(reViewBoxAttrValue)!;
    expect(parsed[1]).toEqual('0.2');
    expect(parsed[2]).toEqual('-0.0');
    expect(parsed[3]).toEqual('-408.3');
    expect(parsed[4]).toEqual('1');
  });
  test('can detect invalid viewbox missing one number', () => {
    expect(reViewBoxAttrValue.test('0 0 408')).toBe(false);
  });
  test('can detect invalid viewbox with extra numbers', () => {
    expect(reViewBoxAttrValue.test('0 0 408 1 1')).toBe(false);
  });
  test('viewbox with mixed separator', () => {
    expect(reViewBoxAttrValue.test('0,0 100,50')).toBe(true);
    const parsed = '0,0 100,50'.match(reViewBoxAttrValue)!;
    expect(parsed[1]).toEqual('0');
    expect(parsed[2]).toEqual('0');
    expect(parsed[3]).toEqual('100');
    expect(parsed[4]).toEqual('50');
  });
});
