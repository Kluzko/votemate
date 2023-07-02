import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
   test: {
      setupFiles: ['setup.test.ts'],
      testTimeout: 5000, // 5 seconds
   },
   plugins: [tsconfigPaths()],
})
