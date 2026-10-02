import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { localeFromPath, localePaths, resolveLocale } from './site.ts'

const locale = localeFromPath(location.pathname)
let saved = null
try { saved = localStorage.getItem('nextrun-locale') } catch { /* Storage may be disabled. The path still selects the language. */ }
const hasLang = new URLSearchParams(location.search).has('lang')
// Old ?lang= links, and a saved preference on the Korean home page, move to that language's own page.
const wanted = hasLang ? resolveLocale(location.search, null) : locale === 'ko' && location.pathname === '/' ? resolveLocale('', saved) : locale

if (wanted !== locale || hasLang) {
  location.replace(localePaths[wanted] + location.hash)
} else {
  const root = document.getElementById('root')!
  const app = <StrictMode><App locale={locale} /></StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
