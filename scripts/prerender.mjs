// Writes one static HTML page per language and page so search engines and link previews see real content,
// plus 404.html (GitHub Pages serves it for unknown paths) and a sitemap listing every page.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const { render, head, origin, pagePaths, pageUrl } = await import('../dist-ssr/entry-server.js');
const template = await readFile('dist/index.html', 'utf8');
const locales = ['ko', 'en', 'ja'];

async function write(file, locale, page) {
  const html = template
    .replace('<html lang="ko">', `<html lang="${locale}">`)
    .replace('<!--app-head-->', head(locale, page))
    .replace('<div id="root"></div>', `<div id="root">${render(locale, page)}</div>`);
  if (html.includes('<!--app-head-->') || !html.includes(`lang="${locale}"`)) throw new Error(`Template markers missing for ${file}`);
  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  await writeFile(file, html);
}

const urls = [];
for (const page of Object.keys(pagePaths)) {
  const alternates = locales.map(code => `    <xhtml:link rel="alternate" hreflang="${code}" href="${origin}${pageUrl(code, page)}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${pageUrl('ko', page)}"/>`).join('\n');
  for (const locale of locales) {
    await write(`dist${pageUrl(locale, page)}index.html`, locale, page);
    urls.push(`  <url>\n    <loc>${origin}${pageUrl(locale, page)}</loc>\n${alternates}\n  </url>`);
  }
}
await write('dist/404.html', 'ko', null);
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
await rm('dist-ssr', { recursive: true, force: true });
console.log(`Prerendered ${urls.length} pages, 404.html and sitemap.xml`);
