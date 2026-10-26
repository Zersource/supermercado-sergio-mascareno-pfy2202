import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite desplegar en gh-pages sin depender del nombre del repo
export default defineConfig({
  plugins: [react()],
  base: './',
})
