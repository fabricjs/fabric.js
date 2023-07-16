import { PlaywrightTestConfig } from '@playwright/test';
import { execSync } from 'child_process';

export default (config: PlaywrightTestConfig) => {
  execSync(
    `babel --no-babelrc e2e/tests --extensions '.ts' --ignore '**/*.spec.ts' --out-dir e2e/dist --config-file ./.babelrcAlt`,
    // 'tsc --incremental -p e2e/tsconfig.json',
    { cwd: process.cwd(), stdio: 'inherit' }
  );
};
