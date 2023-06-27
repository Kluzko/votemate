import { defineConfig } from 'vitest/config'

export default defineConfig({
   test: {
      setupFiles: ['setup.test.ts'],
      testTimeout: 5000, // 5 seconds
   },
   resolve: {
      alias: {
         prisma: 'src/prisma/index',
         common: 'src/common',
         modules: 'src/modules',
         container: 'src/container',
         server: 'src/server',
         utils: 'src/utils',
      },
   },
})
