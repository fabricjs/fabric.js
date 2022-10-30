import json from '@rollup/plugin-json';
import { writeFileSync } from 'fs';
import analyze from 'rollup-plugin-analyzer';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';

const runStats = Number(process.env.BUILD_STATS);
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
      file: process.env.BUILD_OUTPUT || './dist/fabric.js',
      name: 'fabric',
      format: 'cjs',
      sourcemap: true,
    },
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
  ],
};
