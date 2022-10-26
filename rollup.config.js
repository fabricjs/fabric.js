import json from '@rollup/plugin-json';
import { writeFileSync } from 'fs';
import analyze from 'rollup-plugin-analyzer';
import noEmit from 'rollup-plugin-no-emit';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';

const input = process.env.BUILD_INPUT?.split(',') || ['./index.js'];
const outputType = input.length > 1 ? 'dir' : 'file';

const runStats = process.env.BUILD_STATS;
let analyzed = false;

const splitter = /\n|\s|,/g;

// https://rollupjs.org/guide/en/#configuration-files
export default {
  input: process.env.BUILD_INPUT?.split(splitter) || ['./index.js'],
  output: [
    Number(process.env.MINIFY)
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
  // see list of plugins (not comprehensive): https://github.com/rollup/awesome
  plugins: [
    json(),
    ts({
      /* Plugin options */
    }),
    runStats &&
      analyze({
        onAnalysis(analysis) {
          if (analyzed) {
            // We only want reports on the minified output
            throw '';
          }
          writeFileSync(
            'cli_output/build_stats.json',
            JSON.stringify(analysis, null, 2)
          );
          analyzed = true;
        },
      }),
    noEmit({ emit: !Number(process.env.NO_EMIT) }),
  ],
};
