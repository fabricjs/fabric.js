import { describe, expect, it } from 'vitest';
import { pick } from './pick';

describe('pick', () => {
  describe('pick', () => {
    it('correctly picks properties from objects', () => {
      const source = {
        foo: 'bar',
        baz: 123,
        qux: function () {},
      };

      let destination = pick(source);
      expect(destination.foo).toBeUndefined();
      expect(destination.baz).toBeUndefined();
      expect(destination.qux).toBeUndefined();

      destination = pick(source, ['foo']);
      expect(destination.foo).toBe('bar');
      expect(destination.baz).toBeUndefined();
      expect(destination.qux).toBeUndefined();

      // @ts-expect-error -- 'ffffffffff' is not part of source
      destination = pick(source, ['foo', 'baz', 'ffffffffff']);
      expect(destination.foo).toBe('bar');
      expect(destination.baz).toBe(123);
      expect(destination.qux).toBeUndefined();
      // @ts-expect-error -- 'ffffffffff' is not part of source
      expect(destination.ffffffffff).toBeUndefined();
    });
  });
});
