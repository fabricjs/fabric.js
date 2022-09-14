import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';
import * as fs from 'fs';
import moment from 'moment';

const lockFile = 'build.lock';

const logToLockFile = (...logs) =>
  fs.appendFileSync(
    lockFile,
    `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${logs.join('\n')}\n`
  );

const lockFilePlugin = {
  name: 'rollup-lock-file',
  buildStart() {
    logToLockFile('build start');
  },
  buildEnd(error) {
    error && logToLockFile('build error', error);
  },
  renderError(error) {
    logToLockFile('build error', error);
  },
  writeBundle() {
    try {
      fs.unlinkSync(lockFile);
    } catch (error) {}
  },
};

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
