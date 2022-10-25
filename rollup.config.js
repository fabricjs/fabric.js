import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import analyze from 'rollup-plugin-analyzer';
import { execSync } from 'child_process';

const CI = process.env.CI;

// https://rollupjs.org/guide/en/#configuration-files
export default {
  input: process.env.BUILD_INPUT?.split(',') || ['./index.js'],
  output: [
    {
      file: process.env.BUILD_OUTPUT || './dist/fabric.js',
      name: 'fabric',
      format: 'cjs',
      sourcemap: true,
    },
    Number(process.env.MINIFY)
      ? {
          file: process.env.BUILD_MIN_OUTPUT || './dist/fabric.min.js',
          name: 'fabric',
          format: 'cjs',
          plugins: [
            terser(),
            CI && sizeSnapshot(),
            CI &&
              analyze({
                filter: execSync(
                  'git diff --name-only origin/master HEAD'
                ).split('\n'),
              }),
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
  ],
};
