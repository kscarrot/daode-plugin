import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Extension loads from chrome-extension://...; relative asset URLs need './'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
