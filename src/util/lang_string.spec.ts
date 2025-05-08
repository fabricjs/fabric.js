import { describe, expect, it } from 'vitest';
import { capitalize, escapeXml, graphemeSplit } from './lang_string';

describe('lang_string', () => {
  describe('string.graphemeSplit', () => {
    it('correctly splits strings including emojis into graphemes', () => {
      expect(graphemeSplit('foo')).toEqual(['f', 'o', 'o']);
      expect(graphemeSplit('f🙂o')).toEqual(['f', '🙂', 'o']);
    });

    it('correctly splits strings including flag emojis into graphmes', () => {
      expect(graphemeSplit('f🇱🇹🇱🇹o')).toEqual(['f', '🇱🇹', '🇱🇹', 'o']);
    });

    it('correctly splits strings including new emojis into graphmes', () => {
      expect(graphemeSplit('f🧚🏿‍♂️o')).toEqual(['f', '🧚🏿‍♂️', 'o']);
    });
  });

  describe('string.escapeXml', () => {
    it('properly escapes XML special characters in strings', () => {
      // borrowed from Prototype.js
      expect(escapeXml('foo bar')).toBe('foo bar');
      expect(escapeXml('foo <span>bar</span>')).toBe(
        'foo &lt;span&gt;bar&lt;/span&gt;',
      );

      expect(
        escapeXml(
          'a<a href="blah">blub</a>b<span><div></div></span>cdef<strong>!!!!</strong>g',
        ),
      ).toBe(
        'a&lt;a href=&quot;blah&quot;&gt;blub&lt;/a&gt;b&lt;span&gt;&lt;div&gt;&lt;/div&gt;&lt;/span&gt;cdef&lt;strong&gt;!!!!&lt;/strong&gt;g',
      );

      expect(escapeXml('1\n2')).toBe('1\n2');
    });
  });

  describe('string.capitalize', () => {
    it('correctly capitalizes strings', () => {
      expect(capitalize('foo')).toBe('Foo');
      expect(capitalize('')).toBe('');
      expect(capitalize('Foo')).toBe('Foo');
      expect(capitalize('foo-bar-baz')).toBe('Foo-bar-baz');
      expect(capitalize('FOO')).toBe('Foo');
      expect(capitalize('FoobaR')).toBe('Foobar');
      expect(capitalize('2foo')).toBe('2foo');
    });
  });
});
