// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Allow using `describe`, `it`, `expect` globally
    setupFiles: ['./setupTests.js'], // Your setup file with mocks
    environment: 'jsdom', // Simulate browser for DOM APIs (e.g. Phaser UI)
    include: ['tests/**/*.test.js'], // Adjust path if needed
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['mocks/', 'setupTests.js']
    }
  }
})
