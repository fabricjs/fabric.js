import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';

type MyFilterOwnProps = {
  myParameter: number;
};

export const myFilterDefaultValues: MyFilterOwnProps = {
  myParameter: 0,
};

/**
 * MyFilter filter class
 * @example
 * const filter = new MyFilter({
 *   add here an example of how to use your filter
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class MyFilter extends BaseFilter<'MyFilter', MyFilterOwnProps> {
  /**
   * MyFilter value, from -1 to 1.
   * translated to -255 to 255 for 2d
   * 0.0039215686 is the part of 1 that get translated to 1 in 2d
   * @param {Number} myParameter
   * @default
   */
  declare myParameter: MyFilterOwnProps['myParameter'];

  static type = 'MyFilter';

  static defaults = myFilterDefaultValues;

  static uniformLocations = ['uMyParameter'];

  getFragmentSource() {
    return `
      precision highp float;
        uniform sampler2D uTexture;
        uniform float uMyParameter;
        varying vec2 vTexCoord;
        void main() {
          vec4 color = texture2D(uTexture, vTexCoord);
          // add your gl code here
          gl_FragColor = color;
        }
      `;
  }
  /**
   * Apply the MyFilter operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(options: T2DPipelineState) {
    if (this.myParameter === 0) {
      // early return if the parameter value has a neutral value
      return;
    }

    for (let i = 0; i < options.imageData.data.length; i += 4) {
      // insert here your code to modify data[i]
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap,
  ) {
    gl.uniform1f(uniformLocations.uMyParameter, this.myParameter);
  }

  static async fromObject(object: any): Promise<MyFilter> {
    // or overide with custom logic if your filter needs to
    // deserialize something that is not a plain value
    return new this(object);
  }
}
