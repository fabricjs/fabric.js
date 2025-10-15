import { afterEach, describe, expect, it } from 'vitest';
import { config } from '../config';
import { initFilterBackend } from './FilterBackend';
import { WebGLFilterBackend } from './WebGLFilterBackend';
import { Canvas2dFilterBackend } from './Canvas2dFilterBackend';
import { isJSDOM } from '../../vitest.extend';

describe('WebGL', () => {
  afterEach(() => {
    config.restoreDefaults();
  });

  it('initFilterBackend exists', () => {
    expect(initFilterBackend, 'initFilterBackend is a function').toBeTypeOf(
      'function',
    );
  });

  it('initFilterBackend node', (context) => {
    context.skip(!isJSDOM());

    expect(
      initFilterBackend(),
      'should init 2d backend on node',
    ).toBeInstanceOf(Canvas2dFilterBackend);
  });

  it('initFilterBackend browser', (context) => {
    context.skip(isJSDOM());

    expect(
      config.enableGLFiltering,
      'enableGLFiltering should be enabled by default',
    ).toBeTruthy();
    expect(
      initFilterBackend(),
      'should init webGL backend on browser',
    ).toBeInstanceOf(WebGLFilterBackend);
    config.configure({ textureSize: Infinity });
    expect(
      initFilterBackend(),
      'should fallback to 2d backend if textureSize is too big',
    ).toBeInstanceOf(Canvas2dFilterBackend);
    config.configure({ enableGLFiltering: false });
    expect(
      initFilterBackend(),
      'should init 2d backend if enableGLFiltering is false',
    ).toBeInstanceOf(Canvas2dFilterBackend);
  });
});
