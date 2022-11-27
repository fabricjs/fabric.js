import json from '@rollup/plugin-json';
import noEmit from 'rollup-plugin-no-emit';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';

const splitter = /\n|\s|,/g;
const input = process.env.BUILD_INPUT?.split(splitter) || ['./index.js'];
const outputType = input.length > 1 ? 'dir' : 'file';
const runStats = Number(process.env.BUILD_STATS);

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
        plugins: [
          runStats &&
          sizeSnapshot({
            snapshotPath: 'cli_output/build_size.json',
          }),
          terser(),
        ],
      }
      : null,
  ],
  // see list of plugins (not comprehensive): https://github.com/rollup/awesome
  plugins: [
    json(),
    ts({
      /* Plugin options */
    }),
    noEmit({ emit: !Number(process.env.NO_EMIT) }),
  ],
};
