# 📝 Changelog

All notable changes to the Valentine Proposal App are documented here.

## [Unreleased]

### Added
- **Romantic Typography** - Integrated beautiful Google Fonts:
  - **Great Vibes** - Elegant cursive font for main headings ("Will you be my Valentine?")
  - **Dancing Script** - Script style font for accents
  - **Poppins** - Modern sans-serif for body text
- **Font Styling Enhancements**:
  - Bold text-stroke effect (1px) for prominent cursive headings
  - Subtle text-shadow glow for romantic ambiance
  - Proper line-height (1.4) to prevent cursive descender clipping
- **iOS Safari Optimizations**:
  - Theme-color meta tags for address bar color matching
  - Safe-area insets for iPhone notch and home indicator
  - PWA support with apple-mobile-web-app meta tags
  - Bottom padding to prevent content overlap with Safari navigation
- **Mobile Responsiveness**:
  - NO button movement confined to smaller range on mobile devices
  - Touch-friendly button interactions
  - Proper viewport-fit cover for full-screen experience

### Changed
- Updated font sizes for main headings (larger on desktop, optimized for mobile)
- Improved glass-card styling with overflow-visible for cursive text
- Enhanced gradient text effect with subtle shadow

### Fixed
- NO button staying visible within viewport on mobile devices
- Cursive text descenders/ascenders no longer clipped
- iOS Safari bottom bar color now matches app background

---

## Version History

### v0.1.0 - Initial Release (February 2026)

#### Core Features
- Google OAuth authentication
- Personalized proposal link creation
- Playful escaping NO button
- Real-time analytics tracking
- Image upload support (creator and responder)
- Success celebration page with confetti
- Dashboard for managing proposals

#### Technical Features
- Next.js 16 with App Router
- Prisma ORM with PostgreSQL
- Framer Motion animations
- Tailwind CSS 4 styling
- Docker deployment support
- Vercel deployment ready

---

## Roadmap

### Planned Features
- [ ] Email notifications when someone responds
- [ ] Multiple proposal themes/templates
- [ ] Custom background music
- [ ] Video message support
- [ ] QR code generation for easy sharing
- [ ] Multi-language support
- [ ] Proposal expiration dates
- [ ] Analytics dashboard improvements
