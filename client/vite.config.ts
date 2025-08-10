import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 4000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        secure: false,
        changeOrigin: true
      },
      '/graphql': {
        target: 'http://localhost:4000',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
