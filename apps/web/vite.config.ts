import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
   server: {
      host: true,
      port: 3000,
      proxy: {
         '/api': { target: 'http://localhost:3001' },
         '/socket.io': {
            target: 'http://localhost:3001/socket.io',
            ws: true,
         },
      },
   },
   define: { 'process.env': '({})' },
   plugins: [tsconfigPaths(), react()],
}))
