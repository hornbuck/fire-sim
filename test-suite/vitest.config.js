// vitest.config.js
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-suite/setupTests.js',
    include: ['test-suite/tests/**/*.test.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});
