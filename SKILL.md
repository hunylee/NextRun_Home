# NextRun Homepage - SKILL.md

## Implementation Skills and Best Practices

### 1. Menu Implementation
- Use existing TopNav component from @astryxdesign/core
- Add new TopNavItem for 회사 소개 menu item
- Ensure proper href anchoring to corresponding sections
- Maintain accessibility standards (aria-label, keyboard navigation)

### 2. Business Information Display
- Add 사업자 등록번호 (440-09-03154) to footer section
- Add 대표메일 (hunylee0@gmail.com) to contact section
- Format information clearly and legibly
- Ensure information is visible but not intrusive

### 3. Localization (i18n) Implementation
- Implement language switcher in header/footer
- Use React context or state management for language selection
- Store translations in JSON format or use i18n library
- Support Korean (ko), English (en), Japanese (ja)
- Persist language preference in localStorage
- Handle RTL layout considerations for future expansion

### 4. Domain Configuration
- Document that nextrun.site is purchased from Gabia
- Prepare DNS configuration for Vercel/GitHub integration
- Set up appropriate CNAME or A records
- Configure SSL/TLS certificates for secure connection

### 5. GitHub and Deployment Workflow
- Follow conventional commit messages
- Push to main branch for automatic deployment
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
- Ensure all new components are properly exported
- Test functionality across supported languages
- Validate business information accuracy

### 8. Solution Proposal Reference
- Reference the 솔루션 제안서 한글 파일 for product details
- Ensure consistency between website content and proposal document
- Update website when proposal document is revised
