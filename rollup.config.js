import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import analyze from 'rollup-plugin-analyzer';
import { execSync } from 'child_process';
import _ from 'lodash';

const runAnalysis = true;
let analysisIterations = 0;

// https://rollupjs.org/guide/en/#configuration-files
export default {
  input: process.env.BUILD_INPUT?.split(',') || ['./index.js'],
  output: [
    Number(process.env.MINIFY)
      ? {
          file: process.env.BUILD_MIN_OUTPUT || './dist/fabric.min.js',
          name: 'fabric',
          format: 'cjs',
          plugins: [
            runAnalysis &&
              sizeSnapshot({ snapshotPath: 'cli_output/.size_snapshot.json' }),
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
    runAnalysis &&
      analyze({
        filter: _.compact(
          execSync('git diff --name-only origin/master HEAD')
            .toString()
            .split(/\n/g)
        ),
        hideDeps: true,
        onAnalysis() {
          if (analysisIterations > 0) {
            // We only want reports on the minified output
            throw '';
          }
          analysisIterations++;
        },
      }),
  ],
};
