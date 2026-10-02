import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@astryxdesign/core/Button';
import logo from './assets/NextRun-logo.png';
import signDemo from './assets/sign-demo.svg';
import { locales } from './locales';
import type { Copy, Locale } from './locales';
import { emailDraft, localePaths } from './site';
import './App.css';

const sections = ['about', 'products', 'news', 'qa', 'contact'];
const productIds = ['avatar', 'captions', 'syncsl'];
const languages = { ko: '한국어', en: 'English', ja: '日本語' };

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
          <h2>{t.contactTitle}</h2>
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

export default function App({ locale }: { locale: Locale }) {
  const t = locales[locale];
  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href={`${localePaths[locale]}#home`} aria-label={t.home}>
            <img src={logo} width="78" height="57" alt="NextRun" />
            <span>NextRun<span className="brand-caption">AI SIGN LANGUAGE</span></span>
          </a>
          <nav id="primary-nav" aria-label={t.menu}>
            {sections.map((id, i) => <a key={id} href={`#${id}`}>{t.nav[i]}</a>)}
          </nav>
          <nav className="locale-nav" aria-label={t.language}>
            {Object.entries(languages).map(([code, label]) => <a key={code} href={localePaths[code as Locale]} onClick={() => saveLocale(code)} lang={code} hrefLang={code} aria-current={locale === code ? 'page' : undefined}>{label}</a>)}
          </nav>
        </div>
      </header>

      <main id="main">
        <section id="home" className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" />{t.eyebrow}</p>
            <h1>{t.hero[0]}<br /><span>{t.hero[1]}</span></h1>
            <p className="hero-lead">{t.lead}</p>
            <div className="hero-actions">
              <Button label={t.explore} href="#products" variant="primary" className="site-button" endContent={<span aria-hidden="true">↗</span>} />
              <a className="text-link" href="#contact">{t.talk} <span aria-hidden="true">→</span></a>
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

        <section id="about" className="wrap section-pad">
          <div className="section-heading"><p className="eyebrow">01 / {t.aboutLabel}</p><nav className="section-nav" aria-label={t.aboutLabel}><a href="#company">{t.company}</a><a href="#history">{t.history} ↓</a></nav></div>
          <div id="company" className="about-grid"><h2>{t.aboutTitle}</h2><p className="section-copy">{t.aboutText}</p></div>
          <div id="history" className="history"><div><span className="mini-label">{t.history}</span><h3>{t.historyTitle}</h3></div><p>{t.historyEmpty}</p></div>
        </section>

        <section id="products" className="products section-pad">
          <div className="wrap">
            <p className="eyebrow">02 / {t.productsLabel}</p>
            <div className="split-heading"><h2>{t.productsTitle}</h2><p className="section-copy">{t.productsIntro}</p></div>
            <nav className="product-nav" aria-label={t.productsLabel}>{t.products.map((product, i) => <a key={product.name} href={`#${productIds[i]}`}>0{i + 1} / {product.name} <span aria-hidden="true">↓</span></a>)}</nav>
            <div className="product-grid">{t.products.map((product, i) => (
              <article key={product.name} id={productIds[i]} className={`product-card product-${i}`}>
                <div className="product-top"><span className="product-number">0{i + 1}</span><span className="mini-label">{product.tag}</span></div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <ul>{product.points.map(point => <li key={point}>{point}</li>)}</ul>
                {i === 2 && <a href="#demo" className="product-link product-demo-link">{t.demoLink}<span aria-hidden="true">↓</span></a>}
                <a href="#contact" className="product-link" aria-label={`${product.name} — ${t.productContact}`}>{t.productContact}<span aria-hidden="true">↗</span></a>
              </article>
            ))}</div>
            <p className="fine-print product-note">{t.productNote}</p>
          </div>
        </section>

        <section id="demo" className="demo section-pad"><div className="wrap"><p className="eyebrow">{t.demoLabel}</p><div className="split-heading"><h2>{t.demoTitle}</h2><p className="section-copy">{t.demoIntro}</p></div><figure className="demo-figure"><img src={signDemo} width="1000" height="576" alt={t.demoAlt} loading="lazy" decoding="async" /><figcaption className="fine-print">{t.demoNote}</figcaption></figure></div></section>

        <section className="spaces section-pad"><div className="wrap"><p className="eyebrow">{t.spacesLabel}</p><h2>{t.spacesTitle}</h2><p className="section-copy">{t.spacesIntro}</p><div className="space-grid">{t.spaces.map(([name, detail], i) => <div key={name}><span className="space-number">0{i + 1}</span><h3>{name}</h3><p>{detail}</p></div>)}</div></div></section>

        <section id="news" className="wrap section-pad news"><div><p className="eyebrow">03 / {t.newsLabel}</p><h2>{t.newsTitle}</h2></div><div className="news-empty"><span className="empty-mark" aria-hidden="true">↗</span><h3>{t.newsEmpty}</h3><p>{t.newsText}</p></div></section>

        <section id="qa" className="qa section-pad"><div className="wrap qa-grid"><div><p className="eyebrow">04 / Q&A</p><h2>{t.qaTitle}</h2><p className="section-copy">{t.qaIntro}</p><a className="text-link" href="#contact">{t.talk} →</a></div><div className="questions">{t.questions.map(([question, answer], i) => <details key={question}><summary><span className="question-number">0{i + 1}</span><span>{question}</span><span className="expand" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
        <Contact t={t} />
      </main>

      <footer><div className="wrap"><div className="footer-top"><a className="footer-brand" href="#home">NextRun<span>{t.footerLine}</span></a><a className="text-link" href="#home">{t.top} ↑</a></div><div className="footer-bottom"><div><a href="mailto:hunylee0@gmail.com">{t.email} : hunylee0@gmail.com</a><span>{t.business} : 440-09-03154</span><span>{t.representative} : {t.representativeName}</span></div><span suppressHydrationWarning>© {new Date().getFullYear()} NextRun</span></div></div></footer>
    </>
  );
}