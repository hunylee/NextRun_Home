import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The design system imports its own CSS, so bundle it for the prerender build.
  ssr: { noExternal: ['@astryxdesign/core'] },
})
