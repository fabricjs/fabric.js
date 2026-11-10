import { describe, expect, expectTypeOf, it } from 'vitest';
import { pick } from './pick';

describe('pick', () => {
  describe('pick', () => {
    it('infers selected readonly keys and skips missing properties', () => {
      const source: { foo: string; bar?: number; baz: boolean } = {
        foo: 'bar',
        baz: true,
      };
      const destination = pick(source, ['foo', 'bar'] as const);

      expectTypeOf(destination).toEqualTypeOf<{
        foo?: string;
        bar?: number;
      }>();
      expect(destination).toEqual({ foo: 'bar' });
    });

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
