import cp from 'child_process';
import process from 'node:process';
import { wd } from './dirname.mjs';

/**
 * Runs tsc to generate declaration files (.d.ts)
 */
function buildTypes() {
  console.log('\nGenerating type declarations...');
  try {
    // Generate declarations using the build-specific tsconfig
    cp.execSync('tsc -p ./tsconfig.build.json', {
      stdio: 'inherit',
      shell: true,
      cwd: wd,
    });
    // Also build extensions types
    cp.execSync('tsc -p ./tsconfig-extensions.json', {
      stdio: 'inherit',
      shell: true,
      cwd: wd,
    });
    console.log('Type declarations generated.\n');
  } catch (error) {
    console.error('Failed to generate type declarations:', error.message);
    process.exit(1);
  }
}

/**
 * Handles rolldown build
 *
 * Hooks to build events to create `cli_output/build-lock.json`
 * @param {*} options
 */
export function build({ watch, fast, input, output, stats = false } = {}) {
  const cmd = [
    'rolldown',
    '-c',
    watch ? '--watch' : '',
  ].join(' ');
  const processOptions = {
    stdio: 'inherit',
    shell: true,
    cwd: wd,
    env: {
      ...process.env,
      MINIFY: Number(!fast),
      BUILD_INPUT: Array.isArray(input) ? input.join(' ') : input,
      BUILD_OUTPUT: output,
      BUILD_STATS: Number(stats),
    },
  };
  if (watch) {
    cp.spawn(cmd, processOptions);
  } else {
    try {
      cp.execSync(cmd, processOptions);
      // Generate .d.ts files after successful rollup build
      buildTypes();
    } catch (error) {
      // minimal logging, no need for stack trace
      console.error(error.message);
      // inform ci
      process.exit(1);
    }
  }
}
