import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 8080,
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: ['rag-poc-35grq.ondigitalocean.app'],
  },
})
