import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../util/class_registry';

/**
 * Noise filter class
 * @example
 * const filter = new Noise({
 *   noise: 700
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class Noise extends BaseFilter {
  /**
   * Noise value, from
   * @param {Number} noise
   * @default
   */
  noise: number;

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    if (this.noise === 0) {
      return;
    }
    const noise = this.noise;
    for (let i = 0; i < data.length; i += 4) {
      const rand = (0.5 - Math.random()) * noise;
      data[i] += rand;
      data[i + 1] += rand;
      data[i + 2] += rand;
    }
  }

  /**
   * Return WebGL uniform locations for this filter's shader.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {WebGLShaderProgram} program This filter's compiled shader program.
   */
  getUniformLocations(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): TWebGLUniformLocationMap {
    return {
      uNoise: gl.getUniformLocation(program, 'uNoise'),
      uSeed: gl.getUniformLocation(program, 'uSeed'),
    };
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap
  ) {
    gl.uniform1f(uniformLocations.uNoise, this.noise / 255);
    gl.uniform1f(uniformLocations.uSeed, Math.random());
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return { ...super.toObject(), noise: this.noise };
  }

  static async fromObject(object: any) {
    return new Noise(object);
  }
}

export const noiseDefaultValues: Partial<TClassProperties<Noise>> = {
  type: 'Noise',
  fragmentSource: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uStepH;
    uniform float uNoise;
    uniform float uSeed;
    varying vec2 vTexCoord;
    float rand(vec2 co, float seed, float vScale) {
      return fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);
    }
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      color.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;
      gl_FragColor = color;
    }
    `,
  mainParameter: 'noise',
  noise: 0,
};

Object.assign(Noise.prototype, noiseDefaultValues);
classRegistry.setClass(Noise);
