import { describe, expect, it } from 'vitest';
import { getFabricWindow } from '../env';
import { selectorMatches } from './selectorMatches';

function getElement(svg: string) {
  const parser = new (getFabricWindow().DOMParser)();
  const doc = parser.parseFromString(svg.trim(), 'text/xml');
  return doc.documentElement.getElementsByTagName('*')[0];
}

describe('selectorMatches', () => {
  it('matches a class selector', () => {
    const element = getElement(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect class="st1" /></svg>',
    );
    expect(selectorMatches(element, '.st1')).toBe(true);
  });

  it('does not treat a class as a prefix of a longer class ending in a digit', () => {
    // element only has class `st1`, so it must NOT match the `.st12` selector
    const element = getElement(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect class="st1" /></svg>',
    );
    expect(selectorMatches(element, '.st12')).toBe(false);
  });

  it('matches a class whose name is a numeric-suffixed superset of another class', () => {
    // regression for #8838: `.st12` was lost because `.st1` matched inside it
    const element = getElement(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect class="st12 st1" /></svg>',
    );
    expect(selectorMatches(element, '.st12')).toBe(true);
    expect(selectorMatches(element, '.st1')).toBe(true);
  });

  it('matches an id selector without treating it as a prefix', () => {
    const element = getElement(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect id="a1" /></svg>',
    );
    expect(selectorMatches(element, '#a1')).toBe(true);
    expect(selectorMatches(element, '#a12')).toBe(false);
  });
});
