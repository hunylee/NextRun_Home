import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { legacyRedirect, localeFromPath, localePaths, pageFromPath, resolveLocale } from './site.ts'

const locale = localeFromPath(location.pathname)
const page = pageFromPath(location.pathname)
let saved = null
try { saved = localStorage.getItem('nextrun-locale') } catch { /* Storage may be disabled. The path still selects the language. */ }
const hasLang = new URLSearchParams(location.search).has('lang')
// Old ?lang= links, and a saved preference on the Korean home page, move to that language's own page.
const wanted = hasLang ? resolveLocale(location.search, null) : locale === 'ko' && location.pathname === '/' ? resolveLocale('', saved) : locale
// Section links from the old one-page site (/#contact) move to the page that now holds that section.
const legacy = page === 'home' ? legacyRedirect(locale, location.hash) : null

if (wanted !== locale || hasLang) {
  location.replace(localePaths[wanted] + location.hash)
} else if (legacy) {
  location.replace(legacy)
} else {
  const root = document.getElementById('root')!
  const app = <StrictMode><App locale={locale} page={page} /></StrictMode>
  // 404.html is prerendered in Korean, so an unknown /en/ or /ja/ path renders fresh in its own language.
  if (root.hasChildNodes() && (page || locale === 'ko')) hydrateRoot(root, app)
  else { root.textContent = ''; createRoot(root).render(app) }
}
