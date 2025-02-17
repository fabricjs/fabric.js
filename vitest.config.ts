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
      exclude: ['**/node_modules/**', 'vitest.extend.ts'],
      provider: 'v8',
    },
  },
});
