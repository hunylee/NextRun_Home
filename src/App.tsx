import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '@astryxdesign/core/Button';
import logo from './assets/NextRun-logo.png';
import signDemo from './assets/sign-demo.svg';
import { locales } from './locales';
import type { Copy, Locale } from './locales';
import { emailDraft, localePaths, pageUrl, productPages } from './site';
import type { Page } from './site';
import './App.css';

const menuPages = ['about', 'products', 'news', 'qa', 'contact'] as const;
const languages = { ko: '한국어', en: 'English', ja: '日本語' };
type Crumbs = { label: string; items: [string, string][] };
const productIndex = (page: Page | null) => productPages.indexOf(page as typeof productPages[number]);

function Contact({ t }: { t: Copy }) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(false);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      setDraft(emailDraft(String(data.get('email')), String(data.get('subject')), String(data.get('message'))));
      setError(false);
    } catch {
      setDraft('');
      setError(true);
    }
  }
  return (
    <section id="contact" className="contact section-pad">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow">Contact Us</p>
          <h1 className="page-title">{t.contactTitle}</h1>
          <p className="section-copy">{t.contactIntro}</p>
          <a className="contact-email" href="mailto:hunylee0@gmail.com">hunylee0@gmail.com <span aria-hidden="true">↗</span></a>
          <p className="fine-print">{t.contactNote}</p>
        </div>
        <form onSubmit={prepare} onInput={() => { setDraft(''); setError(false); }} onReset={() => { setDraft(''); setError(false); }} aria-describedby="contact-privacy">
          <label htmlFor="email">{t.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} />
          <label htmlFor="subject">{t.subject}</label>
          <input id="subject" name="subject" placeholder={t.subjectPlaceholder} required maxLength={120} />
          <label htmlFor="message">{t.message}</label>
          <textarea id="message" name="message" placeholder={t.messagePlaceholder} required maxLength={2000} rows={5} />
          <p id="contact-privacy" className="fine-print">{t.privacy}</p>
          <Button label={t.prepare} type="submit" variant="primary" className="site-button" endContent={<span aria-hidden="true">↗</span>} />
          {error && <p role="alert" className="form-error">{t.invalid}</p>}
          {draft && <div className="draft-result" role="status"><p>{t.ready}</p><a id="email-draft" href={draft}>{t.openMail} ↗</a></div>}
        </form>
      </div>
    </section>
  );
}

function saveLocale(code: string) {
  try { localStorage.setItem('nextrun-locale', code); } catch { /* Language links work without persistence. */ }
}

function Header({ locale, page, t }: { locale: Locale; page: Page | null; t: Copy }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const url = (target: Page) => pageUrl(locale, target);
  const submenus: Record<string, [string, string][]> = {
    about: [[url('about'), t.company], [url('about') + '#history', t.history]],
    products: [[url('products'), t.allProducts], ...productPages.map((id, i): [string, string] => [url(id), t.products[i].name])],
  };
  const section = productIndex(page) >= 0 ? 'products' : page;

  useEffect(() => {
    if (!menuOpen && !openSub) return;
    const close = (event: KeyboardEvent | MouseEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !(event.target as Element).closest('.site-header')) { setMenuOpen(false); setOpenSub(null); }
    };
    document.addEventListener('keydown', close);
    document.addEventListener('click', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('click', close); };
  }, [menuOpen, openSub]);

  return (
    <header className={`site-header${menuOpen ? ' menu-open' : ''}`}>
      <div className="wrap header-inner">
        <a className="brand" href={localePaths[locale]} aria-label={t.home}>
          <img src={logo} width="78" height="57" alt="NextRun" />
          <span>NextRun<span className="brand-caption">AI SIGN LANGUAGE</span></span>
        </a>
        <nav id="primary-nav" aria-label={t.menu}>
          <ul className="nav-list">{menuPages.map((id, i) => (
            <li key={id} className={`nav-item${openSub === id ? ' open' : ''}${section === id ? ' active' : ''}`}>
              <a href={url(id)} aria-current={page === id ? 'page' : undefined}>{t.nav[i]}</a>
              {submenus[id] && <>
                <button type="button" className="sub-toggle" aria-expanded={openSub === id} aria-controls={`sub-${id}`} aria-label={`${t.nav[i]} ${t.submenu}`} onClick={() => setOpenSub(openSub === id ? null : id)}><span aria-hidden="true">▾</span></button>
                <ul id={`sub-${id}`} className="submenu">{submenus[id].map(([href, label]) => <li key={href}><a href={href} aria-current={href === url(page ?? 'home') ? 'page' : undefined}>{label}</a></li>)}</ul>
              </>}
            </li>
          ))}</ul>
        </nav>
        <nav className="locale-nav" aria-label={t.language}>
          {Object.entries(languages).map(([code, label]) => <a key={code} href={pageUrl(code as Locale, page ?? 'home')} onClick={() => saveLocale(code)} lang={code} hrefLang={code} aria-current={locale === code ? 'page' : undefined}>{label}</a>)}
        </nav>
        <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen(!menuOpen)}><span aria-hidden="true" /></button>
      </div>
    </header>
  );
}

function PageHead({ label, title, children, crumbs }: { label: string; title: string; children?: ReactNode; crumbs: Crumbs }) {
  return (
    <section className="page-head">
      <div className="wrap">
        <nav aria-label={crumbs.label} className="breadcrumb"><ol>{crumbs.items.map(([href, name], i, all) => <li key={href}>{i === all.length - 1 ? <span aria-current="page">{name}</span> : <a href={href}>{name}</a>}</li>)}</ol></nav>
        <p className="eyebrow">{label}</p>
        <div className="split-heading"><h1 className="page-title">{title}</h1>{children}</div>
      </div>
    </section>
  );
}

function ProductCards({ locale, t, current = -1 }: { locale: Locale; t: Copy; current?: number }) {
  return (
    <div className={`product-grid${current < 0 ? '' : ' two'}`}>{t.products.map((product, i) => i !== current && (
      <article key={product.name} className={`product-card product-${i}`}>
        <div className="product-top"><span className="product-number">0{i + 1}</span><span className="mini-label">{product.tag}</span></div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {current < 0 && <ul>{product.points.map(point => <li key={point}>{point}</li>)}</ul>}
        <a href={pageUrl(locale, productPages[i])} className="product-link" aria-label={`${product.name}: ${t.more}`}>{t.more}<span aria-hidden="true">→</span></a>
      </article>
    ))}</div>
  );
}

function ContactBand({ locale, t }: { locale: Locale; t: Copy }) {
  return (
    <section className="cta-band section-pad"><div className="wrap split-heading"><h2>{t.contactTitle}</h2><div><p className="section-copy">{t.contactIntro}</p><Button label={t.talk} href={pageUrl(locale, 'contact')} variant="primary" className="site-button" endContent={<span aria-hidden="true">↗</span>} /></div></div></section>
  );
}

function Home({ locale, t }: { locale: Locale; t: Copy }) {
  return (
    <>
      <section id="home" className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" />{t.eyebrow}</p>
          <h1>{t.hero[0]}<br /><span>{t.hero[1]}</span></h1>
          <p className="hero-lead">{t.lead}</p>
          <div className="hero-actions">
            <Button label={t.explore} href={pageUrl(locale, 'products')} variant="primary" className="site-button" endContent={<span aria-hidden="true">→</span>} />
            <a className="text-link" href={pageUrl(locale, 'contact')}>{t.talk} <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <figure className="vision-panel">
          <div className="vision-top"><span>{t.visionLabel}</span><span aria-hidden="true">N / R</span></div>
          <div className="vision-center"><div className="logo-tile"><img src={logo} width="156" height="114" alt="NextRun" /></div><p>{t.vision}</p></div>
          <div className="signal-line" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <ol className="flow">{t.flow.map((label, i) => <li key={label}><small>0{i + 1}</small>{label}</li>)}</ol>
          <figcaption>{t.concept}</figcaption>
        </figure>
      </section>
      <div className="principles"><div className="wrap">{t.strip.map((text, i) => <p key={text}><span>0{i + 1}</span>{text}</p>)}</div></div>
      <section className="products section-pad">
        <div className="wrap">
          <p className="eyebrow">{t.productsLabel}</p>
          <div className="split-heading"><h2>{t.productsTitle}</h2><p className="section-copy">{t.productsIntro}</p></div>
          <ProductCards locale={locale} t={t} />
        </div>
      </section>
      <section className="wrap section-pad">
        <p className="eyebrow">{t.aboutLabel}</p>
        <div className="about-grid"><h2>{t.aboutTitle}</h2><div><p className="section-copy">{t.aboutText}</p><a className="text-link" href={pageUrl(locale, 'about')}>{t.aboutMore} <span aria-hidden="true">→</span></a></div></div>
      </section>
      <ContactBand locale={locale} t={t} />
    </>
  );
}

function About({ locale, t, crumbs }: { locale: Locale; t: Copy; crumbs: Crumbs }) {
  return (
    <>
      <PageHead label={t.aboutLabel} title={t.aboutTitle} crumbs={crumbs}><p className="section-copy">{t.aboutText}</p></PageHead>
      <nav className="wrap section-nav" aria-label={t.aboutLabel}><a href="#company">{t.company}</a><a href="#history">{t.history}</a></nav>
      <section id="company" className="wrap section-pad">
        <h2 className="sub-title">{t.valuesTitle}</h2>
        <div className="values">{t.strip.map((text, i) => <p key={text}><span>0{i + 1}</span>{text}</p>)}</div>
        <h2 className="sub-title">{t.aboutProducts}</h2>
        <ul className="link-list">{t.products.map((product, i) => <li key={product.name}><a href={pageUrl(locale, productPages[i])}><span>0{i + 1}</span>{product.name}<small>{product.tag}</small><span aria-hidden="true">→</span></a></li>)}</ul>
        <h2 className="sub-title">{t.companyInfo}</h2>
        <dl className="company-info">
          <div><dt>{t.companyName}</dt><dd>NextRun</dd></div>
          <div><dt>{t.representative}</dt><dd>{t.representativeName}</dd></div>
          <div><dt>{t.business}</dt><dd>440-09-03154</dd></div>
          <div><dt>{t.email}</dt><dd><a href="mailto:hunylee0@gmail.com">hunylee0@gmail.com</a></dd></div>
        </dl>
      </section>
      <section id="history" className="wrap history section-pad"><div><span className="mini-label">{t.history}</span><h2>{t.historyTitle}</h2></div><p>{t.historyEmpty}</p></section>
      <ContactBand locale={locale} t={t} />
    </>
  );
}

function Products({ locale, t, crumbs }: { locale: Locale; t: Copy; crumbs: Crumbs }) {
  return (
    <>
      <PageHead label={t.productsLabel} title={t.productsTitle} crumbs={crumbs}><p className="section-copy">{t.productsIntro}</p></PageHead>
      <section className="products section-pad"><div className="wrap"><ProductCards locale={locale} t={t} /><p className="fine-print product-note">{t.productNote}</p></div></section>
      <ContactBand locale={locale} t={t} />
    </>
  );
}

function Product({ locale, t, index, crumbs }: { locale: Locale; t: Copy; index: number; crumbs: Crumbs }) {
  const product = t.products[index];
  return (
    <>
      <PageHead label={`0${index + 1} / ${product.tag}`} title={product.name} crumbs={crumbs}><p className="section-copy">{product.description}</p></PageHead>
      <nav className="wrap product-nav" aria-label={t.productsLabel}>{t.products.map((item, i) => <a key={item.name} href={pageUrl(locale, productPages[i])} aria-current={i === index ? 'page' : undefined}>0{i + 1} / {item.name}</a>)}</nav>
      <section className="wrap section-pad features">
        <h2 className="sub-title">{t.features}</h2>
        <ol>{product.points.map((point, i) => <li key={point}><span>0{i + 1}</span>{point}</li>)}</ol>
        <p className="fine-print">{t.productNote}</p>
        <div className="hero-actions"><Button label={t.productContact} href={pageUrl(locale, 'contact')} variant="primary" className="site-button" endContent={<span aria-hidden="true">↗</span>} /></div>
      </section>
      {index === 1 && <section className="spaces section-pad"><div className="wrap"><p className="eyebrow">{t.spacesLabel}</p><h2>{t.spacesTitle}</h2><p className="section-copy">{t.spacesIntro}</p><div className="space-grid">{t.spaces.map(([name, detail], i) => <div key={name}><span className="space-number">0{i + 1}</span><h3>{name}</h3><p>{detail}</p></div>)}</div></div></section>}
      {index === 2 && <section id="demo" className="demo section-pad"><div className="wrap"><p className="eyebrow">{t.demoLabel}</p><div className="split-heading"><h2>{t.demoTitle}</h2><p className="section-copy">{t.demoIntro}</p></div><figure className="demo-figure"><img src={signDemo} width="1000" height="576" alt={t.demoAlt} loading="lazy" decoding="async" /><figcaption className="fine-print">{t.demoNote}</figcaption></figure></div></section>}
      <section className="products section-pad"><div className="wrap"><h2 className="sub-title">{t.otherProducts}</h2><ProductCards locale={locale} t={t} current={index} /></div></section>
    </>
  );
}

export default function App({ locale, page }: { locale: Locale; page: Page | null }) {
  const t = locales[locale];
  const url = (target: Page) => pageUrl(locale, target);
  const index = productIndex(page);
  const crumbs: Crumbs = { label: t.breadcrumb, items: [[url('home'), t.homeLabel]] };
  if (index >= 0) crumbs.items.push([url('products'), t.productsLabel]);
  if (page && page !== 'home') crumbs.items.push([url(page), index >= 0 ? t.products[index].name : t.nav[menuPages.indexOf(page as typeof menuPages[number])]]);
  let content: ReactNode;
  if (page === 'home') content = <Home locale={locale} t={t} />;
  else if (page === 'about') content = <About locale={locale} t={t} crumbs={crumbs} />;
  else if (page === 'products') content = <Products locale={locale} t={t} crumbs={crumbs} />;
  else if (index >= 0) content = <Product locale={locale} t={t} index={index} crumbs={crumbs} />;
  else if (page === 'news') content = <><PageHead label={t.newsLabel} title={t.newsTitle} crumbs={crumbs} /><section className="wrap section-pad news-page"><div className="news-empty"><span className="empty-mark" aria-hidden="true">↗</span><h2>{t.newsEmpty}</h2><p>{t.newsText}</p></div></section></>;
  else if (page === 'qa') content = <><PageHead label="Q&A" title={t.qaTitle} crumbs={crumbs}><p className="section-copy">{t.qaIntro}</p></PageHead><section id="qa" className="qa section-pad"><div className="wrap"><div className="questions">{t.questions.map(([question, answer], i) => <details key={question}><summary><span className="question-number">0{i + 1}</span><span>{question}</span><span className="expand" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div><a className="text-link" href={url('contact')}>{t.talk} →</a></div></section></>;
  else if (page === 'contact') content = <Contact t={t} />;
  else content = <section className="wrap section-pad not-found"><p className="eyebrow">404</p><h1 className="page-title">{t.notFoundTitle}</h1><p className="section-copy">{t.notFoundText}</p><div className="hero-actions"><Button label={t.backHome} href={url('home')} variant="primary" className="site-button" endContent={<span aria-hidden="true">→</span>} /></div></section>;

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <Header locale={locale} page={page} t={t} />
      <main id="main">{content}</main>
      <footer><div className="wrap"><div className="footer-top"><a className="footer-brand" href={url('home')}>NextRun<span>{t.footerLine}</span></a><nav className="footer-nav" aria-label={t.menu}>{menuPages.map((id, i) => <a key={id} href={url(id)}>{t.nav[i]}</a>)}</nav></div><div className="footer-bottom"><div><a href="mailto:hunylee0@gmail.com">{t.email} : hunylee0@gmail.com</a><span>{t.business} : 440-09-03154</span><span>{t.representative} : {t.representativeName}</span></div><span suppressHydrationWarning>© {new Date().getFullYear()} NextRun</span></div></div></footer>
    </>
  );
}
