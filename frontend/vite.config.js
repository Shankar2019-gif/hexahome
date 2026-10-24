import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8085,
    proxy: {
      '/api': {
        target: process.env.VITE_GATEWAY_URL || 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        timeout: 120000,
        proxyTimeout: 120000,
      },
      '/uploads': {
        target: process.env.VITE_GATEWAY_URL || 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        timeout: 120000,
        proxyTimeout: 120000,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 8085,
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    pool: 'threads',
  }
})

