import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('../..', import.meta.url)),
  cacheDir: fileURLToPath(new URL('./node_modules/.vite', import.meta.url)),
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    // Avoid scanning HTML outside the E2E app.
    noDiscovery: true,
    // Westures is CommonJS and needs prebundling for browser imports.
    include: ['westures'],
  },
});
