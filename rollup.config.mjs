import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import ts from 'rollup-plugin-ts';

const runStats = Number(process.env.BUILD_STATS);

const splitter = /\n|\s|,/g;

// https://rollupjs.org/guide/en/#configuration-files
export default {
  input: process.env.BUILD_INPUT?.split(splitter) || ['./index.js'],
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
          ],
        }
      : null,
  ],
  // see list of plugins (not comprehensive): https://github.com/rollup/awesome
  plugins: [
    json(),
    ts({
      tsconfig: './tsconfig.json',
    }),
  ],
};
