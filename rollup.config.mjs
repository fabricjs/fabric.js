import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';
import { lockFilePlugin, logToLockFile } from './scripts/buildLock.mjs';

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
          plugins: [terser()],
        }
      : null,
  ],
  plugins: [
    lockFilePlugin,
    json(),
    ts({
      /* Plugin options */
      hook: {
        diagnostics(diagnostics) {
          logToLockFile('ts error');
          return diagnostics;
        },
      },
    }),
  ],
};
