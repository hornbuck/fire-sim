import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true, // Enable global test functions like describe and it
        environment: 'node',
        coverage: {
            provider: 'istanbul', // Enable coverage reports
        }
    }
})