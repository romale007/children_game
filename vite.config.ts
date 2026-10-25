/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the project at https://<user>.github.io/children_game/
  base: '/children_game/',
  plugins: [react()],
})
