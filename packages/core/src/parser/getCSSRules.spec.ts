import { describe, expect, test } from 'vitest';
import { loadSVGFromString } from './loadSVGFromString';
// Add `Circle` to the class registry, making it available during SVG parsing.
import '../shapes/Circle';

describe('getCSSRules', () => {
  test('can load svgs with style tags with import statement', async () => {
    const loaded =
      await loadSVGFromString(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 4439.1 3733" xml:space="preserve"><style>
  @import url("https://fonts.googleapis.com/css2?family=Black+Ops+One%7Cfamily=Catamaran:wght@400,700%7Cfamily=Caveat+Brush%7Cfamily=Comfortaa:wght@400,500%7Cfamily=Henny+Penny%7Cfamily=Montserrat:wght@400,500,700%7Cfamily=Mulish:wght@400,500%7Cfamily=Oswald:wght@400,500%7Cfamily=PT+Sans%7Cfamily=Poppins:wght@300,500%7Cfamily=Prompt%7Cfamily=Roboto+Slab:wght@400,500%7Cfamily=Roboto:wght@300,400,700%7Cfamily=Rubik:wght@400,500%7Cfamily=Varela%7Cfamily=Viga%7Cfamily=Work+Sans:wght@300,400%7Cfamily=Yesteryear%7Cdisplay");

  </style><defs/><rect x="0" y="0" width="100%" height="100%" fill="transparent"/><g transform="matrix(1 0 0 1 1643 1651.95)" id="COLORZONE-5" fill="#FFC900" style="fill: rgb(255, 201, 0);"><rect style="stroke: rgb(0, 0, 0); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 10; fill: rgb(255, 201, 0); fill-rule: nonzero; opacity: 1;" x="-481.9" y="-141.75" rx="0" ry="0" width="963.8" height="283.5" fill="#FFC900"/></g></svg>`);
    expect(loaded.objects).toHaveLength(2);
  });

  test('can load svgs with style tags with nested at-rules', async () => {
    const loaded = await loadSVGFromString(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <style>
          circle { fill: black; }
          @media (prefers-color-scheme: dark) { circle { fill: white; } }
          @supports (display: flex) {
            circle { color: blue; }
          }
          @scope (scope root) to (scope limit) {
            circle { color: green; }
          }
        </style>
        <circle r="10" cx="10" cy="10"/>
      </svg>
    `);
    expect(loaded.objects).toHaveLength(1);
  });

  test('can load svgs with multiple style tags', async () => {
    const loaded = await loadSVGFromString(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 20">
        <style>
          .blue { fill: blue; }
        </style>
        <style>
          .red { fill: red; }
        </style>
        <circle class="blue" r="9" cx="10" cy="10"></circle>
        <circle class="red" r="9" cx="30" cy="10"></circle>
      </svg>
    `);
    expect(loaded.objects[0]).toMatchObject({ fill: 'blue' });
    expect(loaded.objects[1]).toMatchObject({ fill: 'red' });
  });
});
