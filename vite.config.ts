import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// The dev server fills the same per-language head and lang that scripts/prerender.mjs writes into built pages.
const devHead: Plugin = {
  name: 'nextrun-dev-head',
  apply: 'serve',
  async transformIndexHtml(html, { server, originalUrl = '/' }) {
    const { head } = await server!.ssrLoadModule('/src/entry-server.tsx')
    const { localeFromPath } = await server!.ssrLoadModule('/src/site.ts')
    const locale = localeFromPath(new URL(originalUrl, 'http://localhost').pathname)
    return html.replace('<html lang="ko">', `<html lang="${locale}">`).replace('<!--app-head-->', head(locale))
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devHead],
  // The design system imports its own CSS, so bundle it for the prerender build.
  ssr: { noExternal: ['@astryxdesign/core'] },
})
