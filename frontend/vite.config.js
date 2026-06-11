import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // proxy api calls to backend during development
    // so we dont get CORS errors when running locally
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
