import { describe, it, expect } from 'vitest';
import type { Gradient } from '../gradient';
import { loadSVGFromString, getFabricDocument, Path } from '../../fabric';
import { Rect } from '../shapes/Rect';
import { cos, sin } from '../util';
import { parseAttributes } from './parseAttributes';
import { parseStyleAttribute } from './parseStyleAttribute';
import { parseFontDeclaration } from './parseFontDeclaration';
import { parsePointsAttribute } from './parsePointsAttribute';
import { parseTransformAttribute } from './parseTransformAttribute';
import { getCSSRules } from './getCSSRules';

function makeElement() {
  const element = getFabricDocument().createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  const attributes = {
    cx: 101,
    x: 102,
    cy: 103,
    y: 104,
    r: 105,
    opacity: 0.45,
    'fill-rule': 'foo',
    'stroke-width': 4,
  };
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

describe('fabric.Parser', () => {
  it('parseAttributes', () => {
    expect(parseAttributes).toBeDefined();

    const element = makeElement();
    const attributeNames =
      'cx cy x y r opacity fill-rule stroke-width transform fill fill-rule'.split(
        ' ',
      );
    const parsedAttributes = parseAttributes(element, attributeNames);

    expect(parsedAttributes).toEqual({
      left: 102,
      top: 104,
      radius: 105,
      opacity: 0.45,
      fillRule: 'foo',
      strokeWidth: 4,
    });
  });

  it('parseAttributesNoneValues', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    element.setAttributeNS(namespace, 'fill', 'none');
    element.setAttributeNS(namespace, 'stroke', 'none');

    expect(parseAttributes(element, 'fill stroke'.split(' '))).toEqual({
      fill: '',
      stroke: '',
    });
  });

  it('parseAttributesFillRule', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    element.setAttributeNS(namespace, 'fill-rule', 'evenodd');

    expect(parseAttributes(element, ['fill-rule'])).toEqual({
      fillRule: 'evenodd',
    });
  });

  it('parseAttributesFillRuleWithoutTransformation', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    element.setAttributeNS(namespace, 'fill-rule', 'inherit');

    expect(parseAttributes(element, ['fill-rule'])).toEqual({
      fillRule: 'inherit',
    });
  });

  it('parseAttributesTransform', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    element.setAttributeNS(namespace, 'transform', 'translate(5, 10)');
    expect(parseAttributes(element, ['transform'])).toEqual({
      transformMatrix: [1, 0, 0, 1, 5, 10],
    });
  });

  it('parseAttributesWithParent', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    const parent = getFabricDocument().createElementNS(namespace, 'g');
    const grandParent = getFabricDocument().createElementNS(namespace, 'g');

    parent.appendChild(element);
    grandParent.appendChild(parent);

    element.setAttributeNS(namespace, 'x', '100');
    parent.setAttributeNS(namespace, 'y', '200');
    grandParent.setAttributeNS(namespace, 'fill', 'red');

    expect(parseAttributes(element, 'x y fill'.split(' '))).toEqual({
      fill: 'red',
      left: 100,
      top: 200,
    });
  });

  it('parseAttributesWithGrandParentSvg', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    const parent = getFabricDocument().createElementNS(namespace, 'g');
    const grandParent = getFabricDocument().createElementNS(namespace, 'svg');

    parent.appendChild(element);
    grandParent.appendChild(parent);

    element.setAttributeNS(namespace, 'x', '100');
    parent.setAttributeNS(namespace, 'y', '200');
    grandParent.setAttributeNS(namespace, 'width', '600');
    grandParent.setAttributeNS(namespace, 'height', '600');

    expect(parseAttributes(element, 'x y width height'.split(' '))).toEqual({
      left: 100,
      top: 200,
      width: 600,
      height: 600,
    });
  });

  it('parseAttributeFontValueStartWithFontSize', () => {
    const element = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    element.setAttribute('style', 'font: 15px arial, sans-serif;');
    const styleObj = parseAttributes(element, ['font']);
    const expectedObject = {
      font: '15px arial, sans-serif',
      fontSize: 15,
      fontFamily: 'arial, sans-serif',
    };
    expect(styleObj).toEqual(expectedObject);
  });

  it('parseStyleAttribute', () => {
    const element = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    element.setAttribute(
      'style',
      'left:10px;top:22.3em;width:103.45pt;height:20%;',
    );
    const styleObj = parseStyleAttribute(element);
    // TODO: looks like this still fails with % values
    const expectedObject = {
      left: '10px',
      top: '22.3em',
      width: '103.45pt',
      height: '20%',
    };
    expect(styleObj).toEqual(expectedObject);
  });

  it('parseStyleAttribute with one pair', () => {
    const element = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    element.setAttribute('style', 'left:10px');

    const expectedObject = {
      left: '10px',
    };
    expect(parseStyleAttribute(element)).toEqual(expectedObject);
  });

  it('parseStyleAttribute with trailing spaces', () => {
    const element = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    element.setAttribute('style', 'left:10px;  top:5px;  ');

    const expectedObject = {
      left: '10px',
      top: '5px',
    };
    expect(parseStyleAttribute(element)).toEqual(expectedObject);
  });

  it('parseStyleAttribute with value normalization', () => {
    const element = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    element.setAttribute('style', 'fill:none;  stroke-dasharray: 2 0.4;');

    const expectedObject = {
      fill: 'none',
      'stroke-dasharray': '2 0.4',
    };
    expect(parseStyleAttribute(element)).toEqual(expectedObject);
  });

  it('parseStyleAttribute with short font declaration', () => {
    const element = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    element.setAttribute(
      'style',
      'font: italic 12px Arial,Helvetica,sans-serif',
    );
    const styleObj = parseStyleAttribute(element);
    if (styleObj.font) {
      parseFontDeclaration(styleObj.font, styleObj);
    }
    const expectedObject = {
      font: 'italic 12px Arial,Helvetica,sans-serif',
      fontSize: 12,
      fontStyle: 'italic',
      fontFamily: 'Arial,Helvetica,sans-serif',
    };

    expect(styleObj).toEqual(expectedObject);

    //testing different unit
    element.setAttribute(
      'style',
      'font: italic 1.5em Arial,Helvetica,sans-serif',
    );
    const styleObj2 = parseStyleAttribute(element);
    if (styleObj2.font) {
      parseFontDeclaration(styleObj2.font, styleObj2);
    }
    const expectedObject2 = {
      font: 'italic 1.5em Arial,Helvetica,sans-serif',
      fontSize: 24,
      fontStyle: 'italic',
      fontFamily: 'Arial,Helvetica,sans-serif',
    };

    expect(styleObj2).toEqual(expectedObject2);
  });

  it('parseAttributes (style to have higher priority than attribute)', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    element.setAttribute('style', 'fill:red');
    element.setAttributeNS(namespace, 'fill', 'green');

    const expectedObject = {
      fill: 'red',
    };
    expect(parseAttributes(element, Path.ATTRIBUTE_NAMES)).toEqual(
      expectedObject,
    );
  });

  it('parseAttributes stroke-opacity and fill-opacity', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    element.setAttributeNS(
      namespace,
      'style',
      'fill:rgb(100,200,50);fill-opacity:0.2;',
    );
    element.setAttributeNS(namespace, 'stroke', 'green');
    element.setAttributeNS(namespace, 'stroke-opacity', '0.5');
    element.setAttributeNS(namespace, 'fill', 'green');

    const expectedObject = {
      fill: 'rgba(100,200,50,0.2)',
      stroke: 'rgba(0,128,0,0.5)',
      fillOpacity: 0.2,
      strokeOpacity: 0.5,
    };
    expect(parseAttributes(element, Path.ATTRIBUTE_NAMES)).toEqual(
      expectedObject,
    );
  });

  it('parse 0 attribute', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    element.setAttributeNS(namespace, 'opacity', String(0));

    const expectedObject = {
      opacity: 0,
    };
    expect(parseAttributes(element, Path.ATTRIBUTE_NAMES)).toEqual(
      expectedObject,
    );
  });

  it('parsePointsAttribute', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'polygon');
    element.setAttributeNS(
      namespace,
      'points',
      '10,  12           20 ,22,  -0.52,0.001 2.3e2,2.3E-2, 10,-1     ',
    );

    const actualPoints = parsePointsAttribute(element.getAttribute('points'));

    expect(actualPoints[0].x).toBe(10);
    expect(actualPoints[0].y).toBe(12);

    expect(actualPoints[1].x).toBe(20);
    expect(actualPoints[1].y).toBe(22);

    expect(actualPoints[2].x).toBe(-0.52);
    expect(actualPoints[2].y).toBe(0.001);

    expect(actualPoints[3].x).toBe(2.3e2);
    expect(actualPoints[3].y).toBe(2.3e-2);

    expect(actualPoints[4].x).toBe(10);
    expect(actualPoints[4].y).toBe(-1);
  });

  it('parseTransformAttribute', () => {
    let parsedValue;

    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');

    //'translate(-10,-20) scale(2) rotate(45) translate(5,10)'

    element.setAttributeNS(namespace, 'transform', 'translate(5,10)');
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([1, 0, 0, 1, 5, 10]);

    element.setAttributeNS(namespace, 'transform', 'translate(-10,-20)');
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([1, 0, 0, 1, -10, -20]);

    const ANGLE_DEG = 90;
    const ANGLE = (ANGLE_DEG * Math.PI) / 180;
    element.setAttributeNS(namespace, 'transform', 'rotate(' + ANGLE_DEG + ')');
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([
      cos(ANGLE),
      sin(ANGLE),
      -sin(ANGLE),
      cos(ANGLE),
      0,
      0,
    ]);

    element.setAttributeNS(namespace, 'transform', 'scale(3.5)');
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([3.5, 0, 0, 3.5, 0, 0]);

    element.setAttributeNS(namespace, 'transform', 'scale(2 13)');
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([2, 0, 0, 13, 0, 0]);

    element.setAttributeNS(namespace, 'transform', 'skewX(2)');
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([1, 0, 0.03492076949174773, 1, 0, 0]);

    element.setAttributeNS(namespace, 'transform', 'skewY(234.111)');
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([1, 1.3820043381762832, 0, 1, 0, 0]);

    element.setAttributeNS(
      namespace,
      'transform',
      'matrix(1,2,3.3,-4,5E1,6e-1)',
    );
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([1, 2, 3.3, -4, 50, 0.6]);

    element.setAttributeNS(
      namespace,
      'transform',
      'translate(21,31) translate(11,22)',
    );
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([1, 0, 0, 1, 32, 53]);

    element.setAttributeNS(
      namespace,
      'transform',
      'scale(2 13) translate(5,15) skewX(11.22)',
    );
    parsedValue = parseTransformAttribute(element.getAttribute('transform')!);
    expect(parsedValue).toEqual([2, 0, 0.3967362169237356, 13, 10, 195]);
  });

  it('parseNestedTransformAttribute', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(namespace, 'path');
    const parent = getFabricDocument().createElementNS(namespace, 'g');
    parent.appendChild(element);

    parent.setAttributeNS(namespace, 'transform', 'translate(50)');
    element.setAttributeNS(namespace, 'transform', 'translate(10 10)');

    const parsedAttributes = parseAttributes(element, ['transform']);
    expect(parsedAttributes.transformMatrix).toEqual([1, 0, 0, 1, 60, 10]);
  });

  it('parseSVGFromString id polyfill', async () => {
    const string =
      '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<defs><rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></defs>' +
      '<use xlink:href="#myrect" x="50" y="50" ></use>' +
      '</svg>';

    expect(loadSVGFromString).toBeDefined();

    const { objects } = await loadSVGFromString(string);
    const rect = objects[0];
    expect(rect!.constructor).toHaveProperty('type', 'Rect');
  });

  it('parseSVGFromString with gradient and fill url with quotes', async () => {
    const string =
      '<?xml version="1.0" encoding="utf-8"?>' +
      '<svg viewBox="0 0 1400 980" xmlns="http://www.w3.org/2000/svg" width="1400px" height="980px" version="1.1" >' +
      '<linearGradient id="SVGID_11_" gradientUnits="userSpaceOnUse" x1="702.4817" y1="66.4817" x2="825.5183" y2="189.5183">' +
      '<stop offset="0" style="stop-color:#FBB03B"/>' +
      '<stop offset="0.2209" style="stop-color:#FBAC3A"/>' +
      '<stop offset="0.4348" style="stop-color:#F9A037"/>' +
      '<stop offset="0.6458" style="stop-color:#F78D32"/>' +
      '<stop offset="0.8538" style="stop-color:#F4722A"/>' +
      '<stop offset="1" style="stop-color:#F15A24"/>' +
      '</linearGradient>' +
      '<path d="M 851 128 A 87 87 0 0 1 764 215 A 87 87 0 0 1 677 128 A 87 87 0 0 1 764 41 A 87 87 0 0 1 851 128 Z" class="st13" style="fill: url(\'#SVGID_11_\');"/>' +
      '<path d="M 851 128 A 87 87 0 0 1 764 215 A 87 87 0 0 1 677 128 A 87 87 0 0 1 764 41 A 87 87 0 0 1 851 128 Z" class="st13" style="fill: url(#SVGID_11_);"/>' +
      '<path d="M 851 128 A 87 87 0 0 1 764 215 A 87 87 0 0 1 677 128 A 87 87 0 0 1 764 41 A 87 87 0 0 1 851 128 Z" class="st13" style=\'fill: url("#SVGID_11_");\'/>' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect(objects[0]!.fill).toHaveProperty('type', 'linear');
    expect(objects[1]!.fill).toHaveProperty('type', 'linear');
    expect(objects[2]!.fill).toHaveProperty('type', 'linear');
  });

  it('parseSVGFromString with xlink:href', async () => {
    const string =
      '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<defs><rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></defs>' +
      '<use xlink:href="#myrect" x="50" y="50" ></use>' +
      '</svg>';

    expect(loadSVGFromString).toBeDefined();

    const { objects } = await loadSVGFromString(string);
    const rect = objects[0];
    expect(rect!.constructor).toHaveProperty('type', 'Rect');
  });

  it('parseSVGFromString with href', async () => {
    const string =
      '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<defs><rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></defs>' +
      '<use href="#myrect" x="50" y="50" ></use>' +
      '</svg>';

    expect(loadSVGFromString).toBeDefined();

    const { objects } = await loadSVGFromString(string);
    const rect = objects[0]!;
    expect(rect.constructor).toHaveProperty('type', 'Rect');
  });

  it('parseSVGFromString nested opacity', async () => {
    const string =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<svg version="1.2" baseProfile="tiny" xml:id="svg-root" width="300" height="400" ' +
      'viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" ' +
      'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xe="http://www.w3.org/2001/xml-events">' +
      '<defs>' +
      '<style>' +
      '.cls-3{opacity:0.5;}' +
      '.cls-4{opacity:0.5;}' +
      '</style>' +
      '</defs>' +
      '<g fill="red" stroke="#000000" fill-opacity="0.5">' +
      '<circle cx="50" cy="50" r="50" fill-opacity="1" fill="rgba(255,0,0,0.3)" />' +
      '<circle cx="150" cy="50" r="50" fill="rgba(0,255,0,0.5)" />' +
      '<circle cx="50" cy="150" r="50" />' +
      '<circle cx="150" cy="150" r="50" fill-opacity="0.5" fill="rgb(0,0,255)" />' +
      '<circle cx="250" cy="50" r="50" fill-opacity="0.5" fill="rgba(0,0,255,0.5)" />' +
      '<circle cx="250" cy="150" r="50" fill-opacity="1" fill="rgb(0,0,255)" />' +
      '</g>' +
      '<g class="cls-3" transform="translate(0,200)">' +
      '<circle cx="50" cy="50" r="50" class="cls-4" fill="red" />' +
      '<circle cx="150" cy="50" r="50" fill="red" />' +
      '</g>' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect(objects[0]).toHaveProperty('fill', 'rgba(255,0,0,0.3)');
    expect(objects[0]).toHaveProperty('fillOpacity', 1);
    expect(objects[1]).toHaveProperty('fill', 'rgba(0,255,0,0.25)');
    expect(objects[1]).toHaveProperty('fillOpacity', 0.5);
    expect(objects[2]).toHaveProperty('fill', 'rgba(255,0,0,0.5)');
    expect(objects[2]).toHaveProperty('fillOpacity', 0.5);
    expect(objects[3]).toHaveProperty('fill', 'rgba(0,0,255,0.5)');
    expect(objects[3]).toHaveProperty('fillOpacity', 0.5);
    expect(objects[4]).toHaveProperty('fill', 'rgba(0,0,255,0.25)');
    expect(objects[4]).toHaveProperty('fillOpacity', 0.5);
    expect(objects[5]).toHaveProperty('fill', 'rgba(0,0,255,1)');
    expect(objects[5]).toHaveProperty('fillOpacity', 1);
    expect(objects[6]).toHaveProperty('opacity', 0.25);
    expect(objects[7]).toHaveProperty('opacity', 0.5);
  });

  it('parseSVGFromString path fill-opacity with gradient', async () => {
    const string =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<svg version="1.2" baseProfile="tiny" xml:id="svg-root" width="300" height="400" ' +
      'viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" ' +
      'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xe="http://www.w3.org/2001/xml-events">' +
      '<linearGradient id="red-to-red">' +
      '<stop offset="0%" stop-color="#00ff00" stop-opacity="0.5"/>' +
      '<stop offset="100%" stop-color="#ff0000"/>' +
      '</linearGradient>' +
      '<path d="M 0 0 l 100 0 l 0 100 l -100 0 z" fill="url(#red-to-red)" fill-opacity="0.5"/>' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect((objects[0]!.fill as Gradient<unknown>).colorStops[0].color).toBe(
      'rgba(255,0,0,0.5)',
    );
    expect((objects[0]!.fill as Gradient<unknown>).colorStops[1].color).toBe(
      'rgba(0,255,0,0.25)',
    );
  });

  it('parseSVGFromString with svg:namespace', async () => {
    const string =
      '<?xml version="1.0" standalone="no"?><svg width="100%" height="100%" version="1.1" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<svg:defs><svg:rect id="myrect" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/></svg:defs>' +
      '<svg:use xlink:href="#myrect" x="50" y="50" ></svg:use>' +
      '</svg>';

    expect(loadSVGFromString).toBeDefined();

    const { objects } = await loadSVGFromString(string);
    const rect = objects[0]!;
    expect(rect.constructor).toHaveProperty('type', 'Rect');
  });

  it('opacity attribute', async () => {
    const tagNames = [
      'Rect',
      'Path',
      'Circle',
      'Ellipse',
      'Polygon',
      'Polyline',
      'Text',
    ] as const;
    const namespace = 'http://www.w3.org/2000/svg';

    const tests = tagNames.map(async (tagName) => {
      const el = getFabricDocument().createElementNS(
        namespace,
        tagName.toLowerCase(),
      );
      const opacityValue = Math.random().toFixed(2);
      el.setAttributeNS(namespace, 'opacity', opacityValue);

      const module = await import('../../fabric');
      const fabricClass = module[tagName];

      // @ts-expect-error -- TODO: not all elements fromElement accept SVGElement as a type, but should it? currently it accepts only HTMLElement
      const obj = await fabricClass.fromElement(el, {});
      expect(obj.opacity).toBe(parseFloat(opacityValue));
    });

    await Promise.all(tests);
  });

  it('fill-opacity attribute with fill attribute', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const el = getFabricDocument().createElementNS(namespace, 'rect');
    const opacityValue = Math.random().toFixed(2);

    el.setAttributeNS(namespace, 'fill-opacity', opacityValue);
    el.setAttributeNS(namespace, 'fill', '#FF0000');

    const obj = await Rect.fromElement(el);

    expect(obj.fill).toBe(`rgba(255,0,0,${parseFloat(opacityValue)})`);
  });

  it('fill-opacity attribute without fill attribute', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const el = getFabricDocument().createElementNS(namespace, 'rect');
    const opacityValue = Math.random().toFixed(2);

    el.setAttributeNS(namespace, 'fill-opacity', opacityValue);

    const obj = await Rect.fromElement(el);

    expect(obj.fill).toBe(`rgba(0,0,0,${parseFloat(opacityValue)})`);
  });

  it('fill-opacity attribute with fill none', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const el = getFabricDocument().createElementNS(namespace, 'rect');
    const opacityValue = Math.random().toFixed(2);

    el.setAttributeNS(namespace, 'fill-opacity', opacityValue);
    el.setAttributeNS(namespace, 'fill', 'none');

    const obj = await Rect.fromElement(el);

    expect(obj.fill).toBe('');
  });

  it('stroke-opacity attribute with stroke attribute', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const el = getFabricDocument().createElementNS(namespace, 'rect');
    const opacityValue = Math.random().toFixed(2);

    el.setAttributeNS(namespace, 'stroke-opacity', opacityValue);
    el.setAttributeNS(namespace, 'stroke', '#FF0000');

    const obj = await Rect.fromElement(el);

    expect(obj.stroke).toBe(`rgba(255,0,0,${parseFloat(opacityValue)})`);
  });

  it('stroke-opacity attribute without stroke attribute', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const el = getFabricDocument().createElementNS(namespace, 'rect');
    const opacityValue = Math.random().toFixed(2);

    el.setAttributeNS(namespace, 'stroke-opacity', opacityValue);

    const obj = await Rect.fromElement(el);

    expect(obj.stroke).toBeNull();
  });

  it('stroke-opacity attribute with stroke none', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const el = getFabricDocument().createElementNS(namespace, 'rect');
    const opacityValue = Math.random().toFixed(2);

    el.setAttributeNS(namespace, 'stroke-opacity', opacityValue);
    el.setAttributeNS(namespace, 'stroke', 'none');

    const obj = await Rect.fromElement(el);

    expect(obj.stroke).toBe('');
  });

  it('getCssRule', () => {
    const rules: Record<PropertyKey, any> = {};
    // NOTE: We need to use a new fresh document here because vitest in browser mode already adds some stylesheets which pollutes the test
    const doc = globalThis.document.implementation.createHTMLDocument('');
    const svgUid = 'uniqueId';
    const styleElement = doc.createElement('style');

    styleElement.textContent =
      'g polygon.cls, rect {fill:#FF0000; stroke:#000000;stroke-width:0.25px;}\
    polygon.cls {fill:none;stroke:#0000FF;}';

    doc.body.appendChild(styleElement);

    const expectedObject = {
      'g polygon.cls': {
        fill: '#FF0000',
        stroke: '#000000',
        'stroke-width': '0.25px',
      },
      rect: {
        fill: '#FF0000',
        stroke: '#000000',
        'stroke-width': '0.25px',
      },
      'polygon.cls': {
        fill: 'none',
        stroke: '#0000FF',
      },
    };

    rules[svgUid] = getCSSRules(doc);
    expect(rules[svgUid]).toEqual(expectedObject);

    const namespace = 'http://www.w3.org/2000/svg';
    const elPolygon = getFabricDocument().createElementNS(namespace, 'polygon');

    elPolygon.setAttributeNS(namespace, 'points', '10,12 20,22');
    elPolygon.setAttributeNS(namespace, 'class', 'cls');
    elPolygon.setAttributeNS(namespace, 'svgUid', svgUid);

    const style = parseAttributes(elPolygon, ['fill', 'stroke']);
    expect(style).toEqual({});

    styleElement.textContent = '\t\n';
    const reparse = getCSSRules(doc);
    expect(reparse).toEqual({});
  });

  it('getCssRule with same selectors', () => {
    expect(getCSSRules).toBeDefined();
    const rules: Record<PropertyKey, unknown> = {};
    // NOTE: We need to use a new fresh document here because vitest in browser mode already adds some stylesheets which pollutes the test
    const doc = globalThis.document.implementation.createHTMLDocument('');
    const svgUid = 'uniqueId';
    const styleElement = doc.createElement('style');

    styleElement.textContent =
      '.cls1,.cls2 { fill: #FF0000;} .cls1 { stroke: #00FF00;} .cls3,.cls1 { stroke-width: 3;}';

    doc.body.appendChild(styleElement);

    const expectedObject = {
      '.cls1': {
        fill: '#FF0000',
        stroke: '#00FF00',
        'stroke-width': '3',
      },
      '.cls2': {
        fill: '#FF0000',
      },
      '.cls3': {
        'stroke-width': '3',
      },
    };

    rules[svgUid] = getCSSRules(doc);
    expect(rules[svgUid]).toEqual(expectedObject);
  });

  it('parseSVGFromString with nested clippath', async () => {
    const string =
      '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<clipPath id="b">' +
      '<rect id="c" transform="matrix(-1 -4.4884e-11 4.4884e-11 -1 128 55.312)" x="44" y="4" width="40" height="47.31"/>' +
      '</clipPath>' +
      '<g clip-path="url(#b)">' +
      '<clipPath id="i">' +
      '<polygon id="j" points="50.87 3.55 45.67 12.48 44.86 23.39 47.16 24.88 48.47 21.35 69.12 11.86 78.16 18.16 80.86 24.69 83.14 22.03 82.25 3.55"/>' +
      '</clipPath>' +
      '<g clip-path="url(#i)">' +
      '<path d="m59.09 7.55c-5.22 1.85-5.74-1.42-5.74-1.42-2.83 1.41-0.97 4.45-0.97 4.45s-2.87-0.21-4.1 2.27c-1.29 2.6-0.15 4.59-0.15 4.59s-2.76 1.75-1.68 4.95c0.72 2.12 2.87 2.97 2.87 2.97-0.26 4.57 1.18 6.79 1.18 6.79s1.79-7.85 1.62-9.05c0 0 3.3-0.66 7.05-2.8 2.53-1.45 4.26-3.15 7.11-3.79 4.33-0.98 5.3 2.16 5.3 2.16s4.01-0.77 5.22 4.8c0.5 2.29 0.71 6.12 0.98 8.45-0.02-0.2 1.49-2.72 1.75-5.28 0.1-0.95 1.54-3.26 1.97-4.99 0.94-3.75-0.29-6.7-0.88-7.58-1.07-1.61-3.61-3.83-5.52-3.51 0.1-2.04-1.51-3.94-3.45-4.59-5.29-1.8-11 1.02-12.56 1.58z" fill="none" stroke="#402720" stroke-miterlimit="10" stroke-width="2"/>' +
      '</g>' +
      '</g>' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect(objects[0]!.clipPath!.constructor).toHaveProperty('type', 'Polygon');
    expect(objects[0]!.clipPath!.clipPath!.constructor).toHaveProperty(
      'type',
      'Rect',
    );
  });

  it('parseSVGFromString with missing clippath', async () => {
    const string =
      '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<g clip-path="url(#i)">' +
      '<path d="m59.09 7.55c-5.22 1.85-5.74-1.42-5.74-1.42-2.83 1.41-0.97 4.45-0.97 4.45s-2.87-0.21-4.1 2.27c-1.29 2.6-0.15 4.59-0.15 4.59s-2.76 1.75-1.68 4.95c0.72 2.12 2.87 2.97 2.87 2.97-0.26 4.57 1.18 6.79 1.18 6.79s1.79-7.85 1.62-9.05c0 0 3.3-0.66 7.05-2.8 2.53-1.45 4.26-3.15 7.11-3.79 4.33-0.98 5.3 2.16 5.3 2.16s4.01-0.77 5.22 4.8c0.5 2.29 0.71 6.12 0.98 8.45-0.02-0.2 1.49-2.72 1.75-5.28 0.1-0.95 1.54-3.26 1.97-4.99 0.94-3.75-0.29-6.7-0.88-7.58-1.07-1.61-3.61-3.83-5.52-3.51 0.1-2.04-1.51-3.94-3.45-4.59-5.29-1.8-11 1.02-12.56 1.58z" fill="none" stroke="#402720" stroke-miterlimit="10" stroke-width="2"/>' +
      '</g>' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect(objects[0]!.clipPath).toBeUndefined();
  });

  it('parseSVGFromString with empty <style/>', async () => {
    const string =
      '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '  <style/>' +
      '  <rect width="10" height="10" />' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect(objects[0]!.constructor).toHaveProperty('type', 'Rect');
  });

  it('parseSVGFromString with empty <use/>', async () => {
    const string =
      '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<use/>' +
      '<rect width="10" height="10" />' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect(objects[0]!.constructor).toHaveProperty('type', 'Rect');
  });

  it('parseSVGFromString with <use/> having base64 image href', async () => {
    const string =
      '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<defs>' +
      '<image id="image" x="0" y="0" width="4346.7" height="4346.7" xlink:href="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>' +
      '</defs>' +
      '<use xlink:href="#image"/>' +
      '<rect width="10" height="10" />' +
      '</svg>';

    const { objects } = await loadSVGFromString(string);
    expect(objects[0]!.constructor).toHaveProperty('type', 'Image');
  });
});
