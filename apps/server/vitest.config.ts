import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
   test: {
      setupFiles: ['vitest.setup.ts'],
      testTimeout: 5000, // 5 seconds
      coverage: {
         reporter: ['html', 'text-summary', 'lcovonly'],
         provider: 'v8',
         all: true,
         reportOnFailure: true,
      },
   },
   plugins: [tsconfigPaths()],
})
