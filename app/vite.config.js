/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vercel serves from the domain root; GitHub Pages serves from /ALEF-BEIT-GH/.
  base: process.env.VERCEL ? '/' : '/ALEF-BEIT-GH/',
})
