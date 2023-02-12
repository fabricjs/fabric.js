import type { TClassProperties } from '../typedefs';
import { AbstractBaseFilter } from './base_filter.class';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../util/class_registry';

/**
 * Adapted from <a href="http://www.html5rocks.com/en/tutorials/canvas/imagefilters/">html5rocks article</a>
 * @example <caption>Sharpen filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 0, -1,  0,
 *            -1,  5, -1,
 *             0, -1,  0 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Blur filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 1/9, 1/9, 1/9,
 *             1/9, 1/9, 1/9,
 *             1/9, 1/9, 1/9 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Emboss filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 1,   1,  1,
 *             1, 0.7, -1,
 *            -1,  -1, -1 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Emboss filter with opaqueness</caption>
 * const filter = new Convolute({
 *   opaque: true,
 *   matrix: [ 1,   1,  1,
 *             1, 0.7, -1,
 *            -1,  -1, -1 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class Convolute extends AbstractBaseFilter<Record<string, string>> {
  /*
   * Opaque value (true/false)
   */
  opaque: boolean;

  /*
   * matrix for the filter, max 9x9
   */
  matrix: number[];

  getCacheKey() {
    return `${this.type}_${Math.sqrt(this.matrix.length)}_${
      this.opaque ? 1 : 0
    }`;
  }

  getFragmentSource() {
    return this.fragmentSource[this.getCacheKey()];
  }

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(options: T2DPipelineState) {
    const imageData = options.imageData,
      data = imageData.data,
      weights = this.matrix,
      side = Math.round(Math.sqrt(weights.length)),
      halfSide = Math.floor(side / 2),
      sw = imageData.width,
      sh = imageData.height,
      output = options.ctx.createImageData(sw, sh),
      dst = output.data,
      // go through the destination image pixels
      alphaFac = this.opaque ? 1 : 0;
    let r, g, b, a, dstOff, scx, scy, srcOff, wt, x, y, cx, cy;

    for (y = 0; y < sh; y++) {
      for (x = 0; x < sw; x++) {
        dstOff = (y * sw + x) * 4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        r = 0;
        g = 0;
        b = 0;
        a = 0;

        for (cy = 0; cy < side; cy++) {
          for (cx = 0; cx < side; cx++) {
            scy = y + cy - halfSide;
            scx = x + cx - halfSide;

            // eslint-disable-next-line max-depth
            if (scy < 0 || scy >= sh || scx < 0 || scx >= sw) {
              continue;
            }

            srcOff = (scy * sw + scx) * 4;
            wt = weights[cy * side + cx];

            r += data[srcOff] * wt;
            g += data[srcOff + 1] * wt;
            b += data[srcOff + 2] * wt;
            // eslint-disable-next-line max-depth
            if (!alphaFac) {
              a += data[srcOff + 3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        if (!alphaFac) {
          dst[dstOff + 3] = a;
        } else {
          dst[dstOff + 3] = data[dstOff + 3];
        }
      }
    }
    options.imageData = output;
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
      uMatrix: gl.getUniformLocation(program, 'uMatrix'),
      uOpaque: gl.getUniformLocation(program, 'uOpaque'),
      uHalfSize: gl.getUniformLocation(program, 'uHalfSize'),
      uSize: gl.getUniformLocation(program, 'uSize'),
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
    gl.uniform1fv(uniformLocations.uMatrix, this.matrix);
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      ...super.toObject(),
      opaque: this.opaque,
      matrix: [...this.matrix],
    };
  }

  static async fromObject(object: any) {
    return new Convolute(object);
  }
}

export const convoluteDefaultValues: Partial<TClassProperties<Convolute>> = {
  type: 'Convolute',
  opaque: false,
  matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  fragmentSource: {
    Convolute_3_1: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[9];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 0);
        for (float h = 0.0; h < 3.0; h+=1.0) {
          for (float w = 0.0; w < 3.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));
            color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];
          }
        }
        gl_FragColor = color;
      }
      `,
    Convolute_3_0: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[9];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 1);
        for (float h = 0.0; h < 3.0; h+=1.0) {
          for (float w = 0.0; w < 3.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));
            color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];
          }
        }
        float alpha = texture2D(uTexture, vTexCoord).a;
        gl_FragColor = color;
        gl_FragColor.a = alpha;
      }
      `,
    Convolute_5_1: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[25];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 0);
        for (float h = 0.0; h < 5.0; h+=1.0) {
          for (float w = 0.0; w < 5.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));
            color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];
          }
        }
        gl_FragColor = color;
      }
      `,
    Convolute_5_0: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[25];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 1);
        for (float h = 0.0; h < 5.0; h+=1.0) {
          for (float w = 0.0; w < 5.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));
            color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];
          }
        }
        float alpha = texture2D(uTexture, vTexCoord).a;
        gl_FragColor = color;
        gl_FragColor.a = alpha;
      }
      `,
    Convolute_7_1: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[49];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 0);
        for (float h = 0.0; h < 7.0; h+=1.0) {
          for (float w = 0.0; w < 7.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));
            color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];
          }
        }
        gl_FragColor = color;
      }
      `,
    Convolute_7_0: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[49];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 1);
        for (float h = 0.0; h < 7.0; h+=1.0) {
          for (float w = 0.0; w < 7.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));
            color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];
          }
        }
        float alpha = texture2D(uTexture, vTexCoord).a;
        gl_FragColor = color;
        gl_FragColor.a = alpha;
      }
      `,
    Convolute_9_1: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[81];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 0);
        for (float h = 0.0; h < 9.0; h+=1.0) {
          for (float w = 0.0; w < 9.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));
            color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];
          }
        }
        gl_FragColor = color;
      }
      `,
    Convolute_9_0: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uMatrix[81];
      uniform float uStepW;
      uniform float uStepH;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vec4(0, 0, 0, 1);
        for (float h = 0.0; h < 9.0; h+=1.0) {
          for (float w = 0.0; w < 9.0; w+=1.0) {
            vec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));
            color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];
          }
        }
        float alpha = texture2D(uTexture, vTexCoord).a;
        gl_FragColor = color;
        gl_FragColor.a = alpha;
      }
      `,
  },
};

Object.assign(Convolute.prototype, convoluteDefaultValues);
classRegistry.setClass(Convolute);
