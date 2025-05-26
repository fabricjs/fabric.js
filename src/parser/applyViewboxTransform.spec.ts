import { describe, test, expect } from 'vitest';
import { applyViewboxTransform } from './applyViewboxTransform';
import { getFabricDocument } from '../env';

const document = getFabricDocument();

describe('applyViewboxTransform()', () => {
  test('return empty object for non-viewBox elements', () => {
    const element = document.createElement('rect');
    const result = applyViewboxTransform(element);
    expect(result).toEqual({});
  });

  test('return empty object for unsupported elements', () => {
    const element = document.createElement('circle');
    const result = applyViewboxTransform(element);
    expect(result).toEqual({});
  });

  test('handle missing viewBox with valid dimensions', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('width', '100');
    element.setAttribute('height', '200');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 100,
      height: 200,
    });
  });

  test('handle missing viewBox and missing dimensions', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 0,
      height: 0,
    });
  });

  test('handle missing viewBox with percentage dimensions', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('width', '100%');
    element.setAttribute('height', '100%');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 0,
      height: 0,
    });
  });

  test('handle x/y translation for missing viewBox', () => {
    const parent = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'symbol',
    );
    parent.appendChild(element);

    element.setAttribute('x', '10');
    element.setAttribute('y', '20');
    element.setAttribute('width', '100');
    element.setAttribute('height', '200');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 100,
      height: 200,
    });
    expect(element.getAttribute('transform')).toContain('translate(10 20)');
    expect(element.hasAttribute('x')).toBe(false);
    expect(element.hasAttribute('y')).toBe(false);
  });

  test('handles invalid viewBox with 3 values', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '0 0 408');
    element.setAttribute('width', '100');
    element.setAttribute('height', '200');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 100,
      height: 200,
    });
  });

  test('handle invalid viewBox with malformed values', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', 'invalid values here');
    element.setAttribute('width', '100');
    element.setAttribute('height', '200');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 100,
      height: 200,
    });
  });

  test('handle empty viewBox', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '');
    element.setAttribute('width', '100');
    element.setAttribute('height', '200');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 100,
      height: 200,
    });
  });

  test('parse valid viewBox with dimensions', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '0 0 100 50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 200,
      height: 100,
      minX: -0,
      minY: -0,
      viewBoxWidth: 100,
      viewBoxHeight: 50,
    });
  });

  test('parse valid viewBox without dimensions', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '10 20 100 50');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 100,
      height: 50,
      minX: -10,
      minY: -20,
      viewBoxWidth: 100,
      viewBoxHeight: 50,
    });
  });

  test('handle negative viewBox values', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '-10 -20 100 50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 200,
      height: 100,
      minX: 10,
      minY: 20,
      viewBoxWidth: 100,
      viewBoxHeight: 50,
    });
  });

  test('handle decimal viewBox values', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '0.5 1.5 100.5 50.5');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 200,
      height: 100,
      minX: -0.5,
      minY: -1.5,
      viewBoxWidth: 100.5,
      viewBoxHeight: 50.5,
    });
  });

  test('not generate transform for identity case', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '0 0 100 50');
    element.setAttribute('width', '100');
    element.setAttribute('height', '50');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 100,
      height: 50,
      minX: -0,
      minY: -0,
      viewBoxWidth: 100,
      viewBoxHeight: 50,
    });
    expect(element.getAttribute('transform')).toBeFalsy();
  });

  test('generate transform matrix for scaling', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '0 0 100 50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    applyViewboxTransform(element);

    const gElement = element.querySelector('g');
    expect(gElement).toBeTruthy();
    expect(gElement?.getAttribute('transform')).toContain(
      'matrix(2 0 0 2 0 0)',
    );
  });

  test('generate transform matrix with translation', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '10 20 100 50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    applyViewboxTransform(element);

    const gElement = element.querySelector('g');
    expect(gElement?.getAttribute('transform')).toContain(
      'matrix(2 0 0 2 -20 -40)',
    );
  });

  test('handle x/y attributes with viewBox', () => {
    const parent = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'symbol',
    );
    parent.appendChild(element);

    element.setAttribute('viewBox', '0 0 100 50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');
    element.setAttribute('x', '5');
    element.setAttribute('y', '10');

    applyViewboxTransform(element);

    expect(element.getAttribute('transform')).toContain('translate(5 10)');
    expect(element.getAttribute('transform')).toContain('matrix(2 0 0 2 0 0)');
  });

  test('create g wrapper for svg elements', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '0 0 100 50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    const child = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    element.appendChild(child);

    applyViewboxTransform(element);

    const gElement = element.querySelector('g');
    expect(gElement).toBeTruthy();
    expect(gElement?.contains(child)).toBe(true);
    expect(element.children.length).toBe(1);
    expect(element.children[0]).toBe(gElement);
  });

  test('apply transform directly to non-svg elements', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'symbol',
    );
    element.setAttribute('viewBox', '0 0 100 50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');
    element.setAttribute('transform', 'rotate(45)');

    applyViewboxTransform(element);

    expect(element.getAttribute('transform')).toContain('rotate(45)');
    expect(element.getAttribute('transform')).toContain('matrix(2 0 0 2 0 0)');
    expect(element.querySelector('g')).toBeFalsy();
  });

  test('handle scientific notation in viewBox', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '1e-2 2e-3 1e2 5e1');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    const result = applyViewboxTransform(element);

    expect(result).toEqual({
      width: 200,
      height: 100,
      minX: -0.01,
      minY: -0.002,
      viewBoxWidth: 100,
      viewBoxHeight: 50,
    });
  });

  test('viewBox with mixed separators', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '0,0 100,50');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    const result = applyViewboxTransform(element);

    expect(result.viewBoxWidth).toBe(100);
    expect(result.viewBoxHeight).toBe(50);
  });

  test('handle whitespace in viewBox', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    element.setAttribute('viewBox', '  0   0   100   50  ');
    element.setAttribute('width', '200');
    element.setAttribute('height', '100');

    const result = applyViewboxTransform(element);

    expect(result.viewBoxWidth).toBe(100);
    expect(result.viewBoxHeight).toBe(50);
  });
});
