import { defineConfig } from 'vitest/config'

export default defineConfig({
   test: { setupFiles: ['src/setup.test.ts'] },
   resolve: {
      alias: {
         prisma: 'src/prisma/index',
         common: 'src/common',
         modules: 'src/modules',
         container: 'src/container',
      },
   },
})
