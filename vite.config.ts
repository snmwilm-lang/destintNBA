import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel/Netlify serve from the domain root, so base stays '/' by default.
// GitHub Pages serves from a subpath, so its workflow sets VITE_BASE_PATH explicitly.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
