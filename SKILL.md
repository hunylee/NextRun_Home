# NextRun Homepage - SKILL.md

## Implementation Skills and Best Practices

### 1. Menu Implementation
- Keep top categories in order: 소개, 제품소개, 소식, Q&A, Contact Us.
- Use section anchors in `src/App.tsx`; 소개 links to 회사 소개/연혁, and 제품소개 links to the three product sections.
- Ensure proper href anchoring to corresponding sections
- Maintain accessibility standards (aria-label, keyboard navigation)

### 2. Business Information Display
- Keep 사업자 등록번호 (440-09-03154), 대표메일 (hunylee0@gmail.com), and 대표 (이태헌) in the footer.
- Import `src/assets/NextRun-logo.png` in home navigation and main/hero; retain its aspect ratio and original file.
- Format information clearly and legibly
- Ensure information is visible but not intrusive

### 3. Localization (i18n) Implementation
- Use the header's language links to `/`, `/en/`, `/ja/`; the path decides the language. Old `?lang=` links redirect.
- Keep localized copy in `src/locales.ts`; English and Japanese must match the Korean copy shape.
- Keep locale resolution in `src/site.ts`, not duplicated in components.
- Support Korean (ko), English (en), Japanese (ja)
- Persist language preference under `nextrun-locale` (it redirects only from `/`); catch blocked storage access so the path still works.
- Update locale metadata alongside visible copy; `npm run build` prerenders one HTML page per language with its metadata.

### 4. Domain Configuration
- Document that nextrun.site is purchased from Gabia
- Prepare DNS configuration for Vercel/GitHub integration
- Set up appropriate CNAME or A records
- Configure SSL/TLS certificates for secure connection

### 5. GitHub and Deployment Workflow
- Follow conventional commit messages
- Push/deploy only when explicitly requested; automatic deployment is not configured in this repository.
- Use pull requests for feature development
- Tag releases appropriately
- Monitor deployment status and logs

### 6. Vercel/GitHub Domain Connection
- For Vercel: Add domain in project settings, configure DNS
- For GitHub Pages: Configure custom domain in repo settings
- Set up proper redirects (www to non-www or vice versa)
- Verify domain ownership through provider validation

### 7. Code Quality Standards
- Maintain existing code formatting and style
- Add meaningful comments for complex logic
- Keep local-only components local. Reuse Astryx Button and native form controls/details instead of adding UI dependencies.
- Test functionality across supported languages
- Validate business information accuracy

### 8. Solution Proposal Reference
- Reference the 솔루션 제안서 한글 파일 for product details when supplied; do not invent missing content.
- Ensure consistency between website content and proposal document
- Update website when proposal document is revised

### 9. Rebuild Verification and Content Boundaries
- Run `npm run lint`, `npm run build`, and `node --experimental-strip-types --test tests/site.test.mjs`.
- In the Vite page console run `await (await import('/tests/browser-smoke.js')).smoke()` for `/`, `/en/`, and `/ja/`; inspect desktop/mobile screenshots. The check resets inputs and sends nothing.
- Keep the bright neutral/deep-green design in `src/App.css`, with `--nr-*` tokens, visible focus, and reduced-motion support.
- AI 실시간 Gloss 기반 자막 is Gloss-based, real-time speech-to-caption translation intended for Deaf users, not standard transcription. Religious facilities, hospital desks, airports, and KTX are potential uses, not verified customers.
- Validate contact fields and encode subject/body in the shared `emailDraft` helper. Draft preparation is not sending; retain the email-app step and direct-email fallback. Add a backend only for direct web submission.
- Keep news/history empty until verified material exists; website language support is separate from product sign-language support.
