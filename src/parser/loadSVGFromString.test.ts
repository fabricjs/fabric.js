import { Path } from '../shapes/Path';
import { loadSVGFromString } from './loadSVGFromString';

describe('loadSVGFromString', () => {
  it('returns successful parse of svg with use tag containing bad reference', async () => {
    // in this case, ignore bad use but still load rest of svg
    const str = `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="10" height="10" />
      <use href="#missing" x="50" y="50" ></use>
      </svg>`;

    const parsedSvg = await loadSVGFromString(str);
    expect(parsedSvg.objects[0]).not.toBeNull();
    if (parsedSvg.objects[0] !== null) {
      expect(parsedSvg.objects[0].isType('Rect')).toBe(true);
    }
  });

  it('returns successful parse of svg with use tag containing bad clip-path', async () => {
    // in this case, load svg but ignore clip-path attribute in <use>
    const str = `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
      <path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
      </defs>
      <use clip-path="url(#myClip)" href="#heart" fill="red" />
      </svg>`;
    // need to load Path here for it to populate in class registry; loadSvgFromString does not
    // import Path so we'd fail the test without this.
    const unused = Path.name;

    const parsedSvg = await loadSVGFromString(str);
    if (parsedSvg.objects[0] !== null) {
      expect(parsedSvg.objects[0].isType('Path')).toBe(true);
    }
  });
});
