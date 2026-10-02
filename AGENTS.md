# NextRun Homepage - AGENTS.md

## Project Overview
This document contains instructions for AI agents working on the NextRun homepage project. The app is a React 19 + TypeScript 6 + Vite 8 single-page frontend using @astryxdesign/core, rebuilt around NextRun's AI sign-language products. Product descriptions express direction, not verified availability or deployment claims.

## Company Information
- Company Name: NextRun
- Business Registration Number: 440-09-03154
- Representative Email: hunylee0@gmail.com
- Domain: nextrun.site (purchased from Gabia)
- Representative: 이태헌
- Bottom/footer must display the representative email, business registration number, and representative name above.

## Menu Structure
The website should include the following menu items, in this top-menu order:
- 소개 (Company Introduction): 회사 소개, 연혁
- 제품소개 (Product Introduction): AI 실사 수어 아바타, AI 실시간 Gloss 기반 자막, SyncSL 솔루션 (planned products; SyncSL has reached a demo version)
- 소식: NextRun의 새로운 소식
- Q&A: provide an entry to Q&A
- Contact Us (연락처): 문의 사항 form with 이메일, 제목, 내용

## Brand and Product Requirements
- Use `src/assets/NextRun-logo.png` for the NextRun logo; it must appear in the home navigation and main/hero area, not just as a text name or rocket icon.
- Produce a design proposal appropriate for an AI sign-language specialist as part of the rebuild.
- AI 실시간 Gloss 기반 자막 translates live speech into captions for Deaf users, not standard captions. Use cases (the `spaces` list, kept in sync across ko/en/ja) include public offices, courts, schools, academic seminars, theaters, hospitals, airports/KTX, and religious facilities (churches, cathedrals).
- SyncSL recognizes signing through a camera and shows Korean text. Its demo section (`#demo`) uses `src/assets/sign-demo.svg`, a redrawn illustration of the real demo capture with the person replaced by a character for portrait rights. Never publish the original capture or a real person's likeness.
- Replace the legacy NextAI/NextCloud/NextData positioning in both page content and SEO metadata; do not invent company history or news to fill the new sections.

## Localization Requirements
Support for three languages:
- Korean (한국어) - Default
- English (English)
- Japanese (日本語)
- `src/locales.ts` holds typed `ko`, `en`, and `ja` copy for navigation, products, contact, footer, and metadata. Each language has its own page: `/` (Korean), `/en/`, `/ja/`. Legacy `?lang=` links redirect to those paths, and a saved `nextrun-locale` preference redirects only from `/`; the language links save the chosen language before navigating.

## Development Guidelines
1. Maintain consistent styling with existing @astryxdesign/core components
2. Ensure responsive design for all pages
3. Follow existing code patterns in the codebase
4. Add proper SEO meta tags for each language version
5. Implement proper routing for multi-language support
6. Ponytail full: reuse existing components and native browser features before adding dependencies; keep the smallest working diff, without speculative abstractions. Preserve validation, error handling, security, and accessibility.

## Dev Environment and Commands
- Use npm with the committed `package-lock.json` (lockfile v3); install dependencies with `npm ci`.
- The locked Vite requires Node `^20.19.0 || >=22.12.0`; the repo has no Node version pin.
- `npm run dev` — Vite development server; `vite.config.ts` enables the React plugin and a dev-only plugin that fills the same per-language head as the prerendered build, with no custom port or base path.
- `npm run build` — `tsc -b`, client and SSR Vite builds, then `scripts/prerender.mjs`; output is `dist/`.
- `npm run lint` — `oxlint`, configured in `.oxlintrc.json` with React, TypeScript, and Oxc plugins.
- `npm run preview` — Vite preview of the built site.
- `node --experimental-strip-types --test tests/site.test.mjs` — dependency-free locale, copy-parity, and email-draft tests (verified with Node 22.22.3).
- In the Vite page console, run `await (await import('/tests/browser-smoke.js')).smoke()` for all three languages and mobile. It checks logos, menus, metadata, Q&A, contact, and overflow; it fills/resets inputs but sends no email.
- No test framework or checked-in CI workflow is configured; run lint, build, and the checks above.

## Code Layout and Observed Conventions
- `src/main.tsx` mounts `App` under React StrictMode and imports `src/index.css`.
- `src/App.tsx` renders the homepage and local `Contact` component; navigation uses anchors. `src/site.ts` owns locale resolution and validated mailto draft construction.
- Import design-system components through subpaths such as `@astryxdesign/core/Button`; layout uses semantic HTML, contact uses native inputs, and Q&A uses details/summary.
- `src/index.css` imports the design-system reset before `astryx.css`; retain this order. `src/App.css` is the active responsive design, with `--nr-*` tokens and mobile breakpoints.
- App.tsx uses single-quoted imports and semicolons; main.tsx and Vite config omit semicolons. Match the file being edited rather than reformatting unrelated code.
- TypeScript uses project references, bundler resolution for app code, and checks unused locals/parameters. `verbatimModuleSyntax` requires type-only imports for types.
- `npm run build` prerenders `dist/index.html`, `dist/en/index.html`, and `dist/ja/index.html` (`src/entry-server.tsx` + `scripts/prerender.mjs`), each with its own lang, title, description, canonical, hreflang, Open Graph image (`public/og-*.png`), and Organization JSON-LD; `main.tsx` hydrates them. `index.html` holds the `<!--app-head-->` marker. `public/robots.txt` and `public/sitemap.xml` list the three pages. GitHub Pages redirects `/en` and `/ja` to their trailing-slash directories.

## Pitfalls and Current Gaps
- Use the exact hyphenated logo filename above, imported in header/hero. Favicons are `public/icon-32.png` and `public/apple-touch-icon.png`, padded from that logo. The original small raster asset is not a high-resolution illustration.
- Contact prepares an email draft for `hunylee0@gmail.com`; the user must open an email app and send it. There is no delivery server or form-data storage. Never label draft preparation as successful delivery.
- News and history show preparation states until verified content is supplied. Q&A is an accordion, not a posted-question board. Do not invent milestones, telephone numbers, or deployed customers.
- Homepage translation does not imply product support for English/Japanese sign languages. Locale links reload the page; unsent form input is not persisted.
- `dist/`, `node_modules/`, and TypeScript build info under `node_modules/.tmp/` are generated. Edit `src/App.tsx`, not the legacy `src/App.tsx.backup`.
- README.md is Vite template documentation and Plan.md is empty; neither defines the new product requirements. No required app environment variables are referenced by the current source/config.

## Deployment Instructions
- Hosting is GitHub Pages. `.github/workflows/deploy.yml` runs lint, tests and `npm run build` on every push to `main`, then publishes `dist/`.
- One-time repository settings: Settings → Pages → Source "GitHub Actions"; Custom domain `nextrun.site` with Enforce HTTPS. A `CNAME` file is not used with Actions deployments.
- DNS is at Gabia: apex `A` records to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153, and `www` `CNAME` to `hunylee.github.io`.
- The site is served from the domain root, so Vite needs no `base` setting. There are no PR preview deployments; check changes locally with `npm run build && npm run preview`.

## Skills References
Refer to SKILL.md for specific implementation guidelines and best practices.
- SKILL.md records the implementation workflow; the menu, product, logo, and locale requirements in this file are authoritative.
