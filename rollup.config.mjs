import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import ts from '@rollup/plugin-typescript';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const runStats = Number(process.env.BUILD_STATS);

const splitter = /\n|\s|,/g;

// https://rollupjs.org/guide/en/#configuration-files
export default {
  input: process.env.BUILD_INPUT?.split(splitter) || ['./src/index.ts'],
  output: [
    {
      file: process.env.BUILD_OUTPUT || './dist/fabric.js',
      name: 'fabric',
      format: 'umd',
      sourcemap: true,
      exports: 'named',
    },
    Number(process.env.MINIFY)
      ? {
          file: process.env.BUILD_MIN_OUTPUT || './dist/fabric.min.js',
          name: 'fabric',
          format: 'umd',
          exports: 'named',
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
  plugins: [json(), ts({ tsconfig: './tsconfig.json' })],
};
