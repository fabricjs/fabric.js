import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';
import * as fs from 'fs';
import moment from 'moment';

const lockFile = 'build.lock';
function log(...logs) {
  return `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${logs.join('\n')}\n`;
}

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
    {
      name: 'rollup-lock-file',
      buildStart() {
        fs.writeFileSync(lockFile, log('build start'));
      },
      buildEnd(error) {
        error && fs.appendFileSync(lockFile, log('build error', error));
      },
      renderError(error) {
        fs.appendFileSync(lockFile, log('build error', error));
      },
      writeBundle() {
        try {
          fs.unlinkSync(lockFile);
        } catch (error) {}
      },
    },
    json(),
    ts({
      /* Plugin options */
      hook: {
        diagnostics(diagnostics) {
          fs.appendFileSync(lockFile, log('ts error'));
          return diagnostics;
        },
      },
    }),
  ],
};
