import { defineConfig } from 'vitest/config';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

const fixturesPath = path.resolve(__dirname, 'test/fixtures');
let fixturesUrl = pathToFileURL(fixturesPath).href;
if (!fixturesUrl.endsWith('/')) {
  fixturesUrl += '/';
}

export default defineConfig({
  resolve: {
    alias: {
      fabric: path.resolve(__dirname, './fabric.ts'),
    },
  },
  test: {
    pool: 'vmThreads',
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'extensions/**/*.spec.{ts,tsx}',
      'extensions/**/*.test.{ts,tsx}',
    ],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        url: fixturesUrl,
      },
    },
    coverage: {
      reportsDirectory: '.nyc_output',
      reporter: ['json'],
      exclude: [
        'test/**',
        'dist/**',
        'dist-extensions/**',
        'src/benchmarks/**',
        'vitest*',
        'rollup*',
        'eslint*',
        'playwright*',
        '**/node_modules/**',
        '.codesandbox/**',
        'lib/**',
        'e2e/**',
        'scripts/**',
        'publish-next.js',
        'publish.js',
      ],
      provider: 'v8',
    },
  },
});
