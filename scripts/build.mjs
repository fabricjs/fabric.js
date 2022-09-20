import cp from 'child_process';
import path from 'node:path';
import process from 'node:process';
import { wd } from './dirname.mjs';

/**
 * Handles rollup build
 *
 * Hooks to build events to create `cli_output/build-lock.json`
 * @see https://rollupjs.org/guide/en/#--watchonstart-cmd---watchonbundlestart-cmd---watchonbundleend-cmd---watchonend-cmd---watchonerror-cmd
 * @param {*} options
 */
export function build({ watch, fast, input, output } = {}) {
  const cmd = [
    'rollup',
    '-c',
    watch ? '--watch' : '',
    '--no-watch.clearScreen',
    ...['onStart', 'onError', 'onEnd'].map(
      (type) =>
        `--watch.${type} "node ./scripts/buildReporter.mjs ${type
          .toLowerCase()
          .slice(2)}"`
    ),
  ].join(' ');
  const processOptions = {
    stdio: 'inherit',
    shell: true,
    cwd: wd,
    env: {
      ...process.env,
      MINIFY: Number(!fast),
      BUILD_INPUT: input,
      BUILD_OUTPUT: output,
      BUILD_MIN_OUTPUT:
        output && !fast
          ? path.resolve(
              path.dirname(output),
              `${path.basename(output, '.js')}.min.js`
            )
          : undefined,
    },
  };
  if (watch) {
    cp.spawn(cmd, processOptions);
  } else {
    try {
      cp.execSync(cmd, processOptions);
    } catch (error) {
      // minimal logging, no need for stack trace
      console.error(error.message);
      // inform ci
      process.exit(1);
    }
  }
}
