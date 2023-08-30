import { PlaywrightTestConfig } from '@playwright/test';
import { spawn } from 'child_process';

export default (config: PlaywrightTestConfig) => {
  const watch = process.argv.includes('--ui');
  return new Promise((resolve) => {
    const p = spawn(
      `babel --no-babelrc e2e/tests --extensions '.ts' --ignore '**/*.spec.ts' --out-dir e2e/dist --config-file ./e2e/.babelrc.mjs ${
        watch ? '-w' : ''
      }`,
      { shell: true, detached: false }
    );
    p.stdout.pipe(process.stdout);
    p.stdout.on('data', resolve);
  });
};
