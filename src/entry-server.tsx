import { renderToString } from 'react-dom/server';
import App from './App';
import { locales } from './locales';
import type { Locale } from './locales';
import { localePaths, origin } from './site';

const ogLocales: Record<Locale, string> = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' };
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function render(locale: Locale): string {
  return renderToString(<App locale={locale} />);
}

export function head(locale: Locale): string {
  const { title, description } = locales[locale].meta;
  const url = origin + localePaths[locale];
  const image = `${origin}/og-${locale}.png`;
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'NextRun', url: origin + '/', logo: `${origin}/logo.png`, email: 'hunylee0@gmail.com' };
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...(Object.keys(localePaths) as Locale[]).map(code => `<link rel="alternate" hreflang="${code}" href="${origin}${localePaths[code]}" />`),
    `<link rel="alternate" hreflang="x-default" href="${origin}/" />`,
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
