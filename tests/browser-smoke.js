// Run on the Vite dev site: await (await import('/tests/browser-smoke.js')).smoke()
export async function smoke() {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const tick = () => new Promise(resolve => setTimeout(resolve, 100));
  const locale = document.documentElement.lang;
  check(['ko', 'en', 'ja'].includes(locale), 'Supported document language');
  check(document.querySelector('header img')?.getAttribute('src').includes('NextRun-logo'), 'Header must use the supplied logo');
  check(document.querySelector('#home img')?.getAttribute('src').includes('NextRun-logo'), 'Hero must use the supplied logo');
  check([...document.querySelectorAll('#primary-nav > a')].map(a => a.hash).join(',') === '#about,#products,#news,#qa,#contact', 'Five navigation categories in order');
  for (const id of ['about', 'history', 'products', 'avatar', 'captions', 'syncsl', 'demo', 'news', 'qa', 'contact']) {
    check(document.getElementById(id), `Missing section: ${id}`);
  }
  check(document.querySelectorAll('.locale-nav a').length === 3, 'Three language links');
  check(document.querySelector('link[rel="canonical"]').href.endsWith({ ko: '/', en: '/en/', ja: '/ja/' }[locale]), 'Localized canonical URL');
  check(document.querySelectorAll('link[rel="alternate"][hreflang]').length === 4, 'Language alternates plus default');
  check(document.querySelector('meta[property="og:title"]').content === document.title, 'Localized Open Graph title');
  check(document.querySelectorAll('#products article').length === 3, 'Three sign-language products');
  const footer = document.querySelector('footer').textContent;
  check(footer.includes('440-09-03154') && footer.includes('hunylee0@gmail.com') && footer.includes('이태헌'), 'Required footer information');
  check(!document.body.textContent.match(/NextCloud|NextData|contact@nextrun\.com|1234-5678/), 'No legacy placeholder content');
  const question = document.querySelector('#qa summary');
  question.click();
  check(question.parentElement.open, 'Q&A expands');
  question.click();
  const form = document.querySelector('#contact form');
  check(!form.checkValidity(), 'Empty contact form is invalid');
  form.elements.email.value = 'invalid';
  form.elements.subject.value = 'Question & 제목';
  form.elements.message.value = '내용 + 日本語 & English';
  check(!form.checkValidity(), 'Invalid email is rejected');
  form.elements.email.value = 'reader@example.com';
  check(form.checkValidity(), 'Valid contact data accepted');
  form.requestSubmit();
  await tick();
  const draft = document.querySelector('#email-draft');
  check(draft, 'Contact prepares an email draft, not a false sent status');
  const url = new URL(draft.href);
  check(url.protocol === 'mailto:' && url.pathname === 'hunylee0@gmail.com', 'Correct draft recipient');
  check(url.searchParams.get('subject').includes('Question & 제목'), 'Subject is encoded safely');
  check(url.searchParams.get('body').includes('내용 + 日本語 & English'), 'Multilingual message is preserved');
  form.elements.message.value = '   ';
  form.elements.message.dispatchEvent(new Event('input', { bubbles: true }));
  form.requestSubmit();
  await tick();
  check(!document.querySelector('#email-draft'), 'Editing clears the old draft; whitespace is rejected');
  form.reset();
  check(document.documentElement.scrollWidth <= innerWidth, 'No horizontal overflow');
  return `PASS: ${locale}, logos, navigation, metadata, products, footer, Q&A, form validation and draft encoding, layout`;
}
