import { renderToString } from 'react-dom/server';
import App from './App';
import { locales } from './locales';
import type { Locale } from './locales';
import { localePaths, origin, pagePaths, pageUrl, productPages } from './site';
import type { Page } from './site';

export { origin, pagePaths, pageUrl };

const ogLocales: Record<Locale, string> = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' };
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function render(locale: Locale, page: Page | null): string {
  return renderToString(<App locale={locale} page={page} />);
}

function meta(locale: Locale, page: Page | null): [string, string] {
  const t = locales[locale];
  const product = t.products[productPages.indexOf(page as typeof productPages[number])];
  if (page === 'home') return [t.meta.title, t.meta.description];
  if (product) return [`${product.name} | NextRun`, product.description];
  return t.pageMeta[(page ?? 'notFound') as keyof typeof t.pageMeta] as [string, string];
}

// A null page is the 404 page: no canonical or alternates, and kept out of search results.
export function head(locale: Locale, page: Page | null): string {
  const [title, description] = meta(locale, page);
  const url = origin + pageUrl(locale, page ?? 'home');
  const image = `${origin}/og-${locale}.png`;
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'NextRun', url: origin + '/', logo: `${origin}/logo.png`, email: 'hunylee0@gmail.com' };
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    ...(page ? [
      `<link rel="canonical" href="${url}" />`,
      ...(Object.keys(localePaths) as Locale[]).map(code => `<link rel="alternate" hreflang="${code}" href="${origin}${pageUrl(code, page)}" />`),
      `<link rel="alternate" hreflang="x-default" href="${origin}${pageUrl('ko', page)}" />`,
    ] : ['<meta name="robots" content="noindex" />']),
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="NextRun" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${ogLocales[locale]}" />`,
    ...(Object.keys(ogLocales) as Locale[]).filter(code => code !== locale).map(code => `<meta property="og:locale:alternate" content="${ogLocales[code]}" />`),
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(organization)}</script>`,
  ].join('\n    ');
}
