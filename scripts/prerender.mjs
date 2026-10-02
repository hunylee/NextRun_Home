// Writes one static HTML page per language so search engines and link previews see real content.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const { render, head } = await import('../dist-ssr/entry-server.js');
const template = await readFile('dist/index.html', 'utf8');
const pages = { ko: 'dist/index.html', en: 'dist/en/index.html', ja: 'dist/ja/index.html' };

for (const [locale, file] of Object.entries(pages)) {
  const html = template
    .replace('<html lang="ko">', `<html lang="${locale}">`)
    .replace('<!--app-head-->', head(locale))
    .replace('<div id="root"></div>', `<div id="root">${render(locale)}</div>`);
  if (html.includes('<!--app-head-->') || !html.includes(`lang="${locale}"`)) throw new Error(`Template markers missing for ${locale}`);
  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  await writeFile(file, html);
}
await rm('dist-ssr', { recursive: true, force: true });
console.log('Prerendered', Object.values(pages).join(', '));
