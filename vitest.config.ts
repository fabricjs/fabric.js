import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {},
  test: {
    pool: 'threads',
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'extensions/**/*.test.{ts,tsx}',
    ],
    coverage: {
      reportsDirectory: '.nyc_output',
      reporter: ['json'],
      exclude: [
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
