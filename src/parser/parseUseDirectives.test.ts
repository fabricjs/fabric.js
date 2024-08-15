import { getFabricWindow } from '../env';
import { parseUseDirectives } from './parseUseDirectives';

describe('parseUseDirectives', () => {
  it('returns successful parse where use tag uses fill style prioritizing path tag when both tags have a style', async () => {
    const str = `<svg id="svg" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z"
        style="stroke:#000000;fill:#ff0000" />
      <use x="100" y="0" xlink:href="#heart" style="stroke-width:5.0;fill:#0000ff" />
      </svg>`;

    const parser = new (getFabricWindow().DOMParser)();
    const doc = parser.parseFromString(str.trim(), 'text/xml');
    parseUseDirectives(doc);

    const elements = Array.from(doc.documentElement.getElementsByTagName('*'));
    expect(elements[0]).not.toBeNull();
    if (elements[0] !== null) {
      const style0 = elements[0].getAttribute('style');
      expect(style0).toContain('fill:#ff0000');
    }
    expect(elements[1]).not.toBeNull();
    if (elements[1] !== null) {
      const style1 = elements[1].getAttribute('style');
      expect(style1).toContain('fill:#ff0000');
      // also contains extra style that path tag does not have
      expect(style1).toContain('stroke-width:5.0');
    }
  });
  it('returns successful parse where use tag uses fill style from itself when path tag empty', async () => {
    const str = `<svg id="svg" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
      <use x="100" y="0" xlink:href="#heart" style="stroke-width:5.0;fill:#0000ff" />
      </svg>`;

    const parser = new (getFabricWindow().DOMParser)();
    const doc = parser.parseFromString(str.trim(), 'text/xml');
    parseUseDirectives(doc);

    const elements = Array.from(doc.documentElement.getElementsByTagName('*'));
    expect(elements[0]).not.toBeNull();
    if (elements[0] !== null) {
      const style0 = elements[0].getAttribute('style');
      expect(style0).toBeNull();
    }
    expect(elements[1]).not.toBeNull();
    if (elements[1] !== null) {
      const style1 = elements[1].getAttribute('style');
      expect(style1).toContain('fill:#0000ff');
      // also contains extra style that path tag does not have
      expect(style1).toContain('stroke-width:5.0');
    }
  });
  it('returns successful parse where use tag uses fill style from path when its style tag is empty', async () => {
    const str = `<svg id="svg" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" 
        style="stroke:#000000;fill:#ff0000" />
      <use x="100" y="0" xlink:href="#heart" />
      </svg>`;

    const parser = new (getFabricWindow().DOMParser)();
    const doc = parser.parseFromString(str.trim(), 'text/xml');
    parseUseDirectives(doc);

    const elements = Array.from(doc.documentElement.getElementsByTagName('*'));
    expect(elements[0]).not.toBeNull();
    if (elements[0] !== null) {
      const style0 = elements[0].getAttribute('style');
      expect(style0).toContain('fill:#ff0000');
    }
    expect(elements[1]).not.toBeNull();
    if (elements[1] !== null) {
      const style1 = elements[1].getAttribute('style');
      expect(style1).toContain('fill:#ff0000');
    }
  });
  it('correctly merge styles tags considering attributes', async () => {
    const str = `<svg id="svg" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path fill="red" id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
      <use x="100" y="0" xlink:href="#heart" style="stroke:#000000;fill:green" />
      </svg>`;

    const parser = new (getFabricWindow().DOMParser)();
    const doc = parser.parseFromString(str.trim(), 'text/xml');
    parseUseDirectives(doc);

    const elements = Array.from(doc.documentElement.getElementsByTagName('*'));
    expect(elements[0]).not.toBeNull();
    expect(elements[1]).not.toBeNull();
    if (elements[1] !== null) {
      const style1 = elements[1].getAttribute('style');
      expect(style1).toContain('fill:red');
    }
  });
  it('Will not override existing attributes', async () => {
    const str = `<svg id="svg" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path fill="yellow" id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
      <use x="100" y="0" xlink:href="#heart" fill="blue" />
      </svg>`;

    const parser = new (getFabricWindow().DOMParser)();
    const doc = parser.parseFromString(str.trim(), 'text/xml');
    parseUseDirectives(doc);

    const elements = Array.from(doc.documentElement.getElementsByTagName('*'));
    expect(elements[0]).not.toBeNull();
    expect(elements[1]).not.toBeNull();
    if (elements[1] !== null) {
      const style1 = elements[1].getAttribute('fill');
      expect(style1).toBe('yellow');
    }
  });
});
