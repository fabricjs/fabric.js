import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';
import * as fs from 'fs';
import moment from 'moment';
import psList from 'ps-list';

const lockFile = 'build.lock';

const logToLockFile = (...logs) =>
  fs.appendFileSync(
    lockFile,
    `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${logs.join('\n')}\n`
  );

const unlock = async () => {
  const lockPID = Number(
    /<pid>(.*)<\/pid>/gm.exec(fs.readFileSync(lockFile).toString())[1]
  );
  // the process that locked last is allowed to unlock for concurrency reasons
  const hasPermissionToUnlock =
    process.pid === lockPID ||
    !(await psList()).find(({ pid }) => pid === lockPID);
  try {
    hasPermissionToUnlock && fs.unlinkSync(lockFile);
  } catch (error) {}
};

const lockFilePlugin = {
  name: 'rollup-lock-file',
  buildStart() {
    logToLockFile(`build start <pid>${process.pid}</pid>`);
  },
  buildEnd(error) {
    error && logToLockFile('build error', error);
  },
  renderError(error) {
    logToLockFile('build error', error);
  },
  writeBundle() {
    return unlock();
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
