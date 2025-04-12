import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      fabric: path.resolve(__dirname, './fabric.ts'),
    },
  },
  test: {
    pool: 'threads',
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
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
      ],
      provider: 'v8',
    },
  },
});
