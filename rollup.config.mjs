import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import ts from '@rollup/plugin-typescript';

const splitter = /\n|\s|,/g;

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: process.env.BUILD_INPUT?.split(splitter) || ['./src/index.ts'],
  output: [
    {
      file: process.env.BUILD_OUTPUT || './bundle/fabric.js',
      name: 'fabric',
      format: 'cjs',
      sourcemap: true,
    },
    Number(process.env.MINIFY)
      ? {
          file: process.env.BUILD_MIN_OUTPUT || './bundle/fabric.min.js',
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
      /* Plugin options */
    }),
  ],
};
