import type { Locale } from './locales.ts';

export const origin = 'https://www.nextrun.site';
export const localePaths: Record<Locale, string> = { ko: '/', en: '/en/', ja: '/ja/' };

// Every page is prerendered at localePaths[locale] + pagePaths[page].
export const pagePaths = {
  home: '', about: 'about/', products: 'products/', avatar: 'products/avatar/', gloss: 'products/gloss/', syncsl: 'products/syncsl/',
  news: 'news/', qa: 'qa/', contact: 'contact/',
};
export type Page = keyof typeof pagePaths;
export const productPages = ['avatar', 'gloss', 'syncsl'] as const;

export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return first === 'en' || first === 'ja' ? first : 'ko';
}

export const pageUrl = (locale: Locale, page: Page) => localePaths[locale] + pagePaths[page];

// Unknown paths (GitHub Pages serves 404.html for them) return null.
export function pageFromPath(pathname: string): Page | null {
  const rest = (pathname.endsWith('/') ? pathname : pathname + '/').slice(localePaths[localeFromPath(pathname)].length);
  const match = Object.entries(pagePaths).find(([, path]) => path === rest);
  return match ? match[0] as Page : null;
}

// Section anchors of the old one-page site, so shared links like /#contact still land on the right page.
const legacyAnchors: Record<string, [Page, string?]> = {
  about: ['about'], company: ['about'], history: ['about', '#history'], products: ['products'], avatar: ['avatar'],
  captions: ['gloss'], syncsl: ['syncsl'], demo: ['syncsl', '#demo'], news: ['news'], qa: ['qa'], contact: ['contact'],
};
export function legacyRedirect(locale: Locale, hash: string): string | null {
  const id = hash.slice(1);
  if (!Object.hasOwn(legacyAnchors, id)) return null;
  const [page, anchor = ''] = legacyAnchors[id];
  return pageUrl(locale, page) + anchor;
}

// Legacy ?lang= links win; otherwise a valid saved preference applies. Korean is the fallback.
export function resolveLocale(search: string, saved: string | null): Locale {
  const value = new URLSearchParams(search).get('lang') ?? saved;
  return value === 'en' || value === 'ja' ? value : 'ko';
}

// ponytail: mailto drafts need an email app; add a server only for direct delivery.
export function emailDraft(email: string, subject: string, message: string): string {
  email = email.trim();
  subject = subject.trim();
  message = message.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !subject || subject.length > 120 || /[\r\n]/.test(subject) || !message || message.length > 2000) {
    throw new Error('Invalid inquiry');
  }
  return `mailto:hunylee0@gmail.com?subject=${encodeURIComponent(`[NextRun] ${subject}`)}&body=${encodeURIComponent(`${email}\n\n${message}`)}`;
}
