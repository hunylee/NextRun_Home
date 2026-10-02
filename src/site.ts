import type { Locale } from './locales.ts';

export const origin = 'https://www.nextrun.site';
export const localePaths: Record<Locale, string> = { ko: '/', en: '/en/', ja: '/ja/' };

export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return first === 'en' || first === 'ja' ? first : 'ko';
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
