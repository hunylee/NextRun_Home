import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveLocale, localeFromPath, localePaths, emailDraft, pageFromPath, pageUrl, pagePaths, legacyRedirect } from '../src/site.ts';
import { locales } from '../src/locales.ts';

test('URL language wins; unknown languages use Korean; missing URL uses valid saved preference', () => {
  assert.equal(resolveLocale('?lang=ja', 'en'), 'ja');
  assert.equal(resolveLocale('?lang=xx', 'en'), 'ko');
  assert.equal(resolveLocale('', 'en'), 'en');
  assert.equal(resolveLocale('', 'constructor'), 'ko');
  assert.equal(resolveLocale('', null), 'ko');
});

test('language pages live at /, /en/ and /ja/', () => {
  assert.equal(localeFromPath('/'), 'ko');
  assert.equal(localeFromPath('/en/'), 'en');
  assert.equal(localeFromPath('/ja'), 'ja');
  assert.equal(localeFromPath('/english/'), 'ko');
  assert.deepEqual(localePaths, { ko: '/', en: '/en/', ja: '/ja/' });
});

test('each menu and product has its own page in every language', () => {
  assert.equal(pageUrl('ko', 'about'), '/about/');
  assert.equal(pageUrl('en', 'syncsl'), '/en/products/syncsl/');
  assert.equal(pageUrl('ja', 'home'), '/ja/');
  for (const locale of ['ko', 'en', 'ja']) {
    for (const page of Object.keys(pagePaths)) assert.equal(pageFromPath(pageUrl(locale, page)), page);
  }
  assert.equal(pageFromPath('/products/gloss'), 'gloss');
  assert.equal(pageFromPath('/en/careers/'), null);
  assert.equal(pageFromPath('/products/unknown/'), null);
});

test('old one-page anchors move to their new pages', () => {
  assert.equal(legacyRedirect('ko', '#contact'), '/contact/');
  assert.equal(legacyRedirect('en', '#captions'), '/en/products/gloss/');
  assert.equal(legacyRedirect('ja', '#demo'), '/ja/products/syncsl/#demo');
  assert.equal(legacyRedirect('ko', '#history'), '/about/#history');
  assert.equal(legacyRedirect('ko', '#main'), null);
  assert.equal(legacyRedirect('ko', '#constructor'), null);
  assert.equal(legacyRedirect('ko', ''), null);
});

test('email draft encodes multilingual data without injecting headers', () => {
  const draft = new URL(emailDraft('reader@example.com', '제목 & 件名', '내용 + hello\n日本語'));
  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, 'hunylee0@gmail.com');
  assert.equal(draft.searchParams.get('subject'), '[NextRun] 제목 & 件名');
  assert.equal(draft.searchParams.get('body'), 'reader@example.com\n\n내용 + hello\n日本語');
  for (const args of [['bad', 'subject', 'body'], ['reader@example.com', '  ', 'body'], ['reader@example.com', 's', '  '], ['reader@example.com', 's\r\nBcc: other@example.com', 'body']]) {
    assert.throws(() => emailDraft(...args));
  }
});

test('all locales carry matching copy structure and complete product/menu content', () => {
  const shape = value => Array.isArray(value) ? value.map(shape) : typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)])) : typeof value;
  for (const copy of Object.values(locales)) {
    assert.deepEqual(shape(copy), shape(locales.ko));
    assert.equal(copy.products.length, 3);
    assert.equal(copy.nav.length, 5);
    assert.equal(copy.spaces.length, 8);
    assert.ok(copy.representativeName.includes('이태헌'));
  }
});
