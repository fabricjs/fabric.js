import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const fixturesPath = resolve(__dirname, 'test/fixtures');
let fixturesUrl = pathToFileURL(fixturesPath).href;
if (!fixturesUrl.endsWith('/')) {
  fixturesUrl += '/';
}

export default defineConfig({
  resolve: {
    alias: {
      fabric: resolve(__dirname, './fabric.ts'),
    },
  },
  test: {
    pool: 'vmThreads',
    clearMocks: true,
    mockReset: true,
    snapshotSerializers: [
      'test/snapshot-serializers/canvas-rendering-context.ts',
    ],
    setupFiles: ['./vitest.setup.ts'],
    workspace: [
      {
        extends: true,
        test: {
          environment: 'jsdom',
          environmentOptions: {
            jsdom: {
              resources: 'usable',
              url: fixturesUrl,
            },
          },
          name: 'unit-node',
        },
      },
      {
        extends: true,
        test: {
          browser: {
            provider: 'playwright',
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          name: 'unit-chromium',
        },
      },
    ],
    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'extensions/**/*.spec.{ts,tsx}',
      'extensions/**/*.test.{ts,tsx}',
    ],
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
