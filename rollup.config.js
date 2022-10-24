import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import noEmit from 'rollup-plugin-no-emit';

const input = process.env.BUILD_INPUT?.split(',') || ['./index.js'];
const outputType = input.length > 1 ? 'dir' : 'file';

// https://rollupjs.org/guide/en/#configuration-files
export default {
  input,
  output: [
    {
      [outputType]: process.env.BUILD_OUTPUT || './dist/fabric.js',
      name: 'fabric',
      format: 'cjs',
      sourcemap: true,
    },
    Number(process.env.MINIFY) && outputType === 'file'
      ? {
          file: process.env.BUILD_MIN_OUTPUT || './dist/fabric.min.js',
          name: 'fabric',
          format: 'cjs',
          plugins: [terser()],
        }
      : null,
  ],
  plugins: [
    json(),
    ts({
      /* Plugin options */
    }),
    noEmit({ emit: !Number(process.env.NO_EMIT) }),
  ],
};
