# Design: Refugee Resettlement Nonprofit Website

Status: Approved (Phase 1 — plan). Source brief: `refugee-resettlement-website-master-prompt.md` (project root).

## 1. Purpose & audience

Static, bilingual, mobile-first marketing and accountability website for a Somali nonprofit working on refugee/IDP resettlement in Hiran State and Southwest State. Audience priority: institutional donors/grant officers → partner agencies/government → diaspora/individual donors (mobile, often abroad) → journalists/researchers → prospective staff/volunteers. Beneficiaries are explicitly **not** a target user — no feature may collect personal data from a displaced person.

Must survive slow 3G on cheap Android phones (pay-per-MB) as well as fast connections abroad, and unreliable electricity/connectivity at the field offices — hence fully static, no server/database to maintain.

## 2. Facts policy (Section 0 of the source brief)

Every organizational fact (legal name, registration, address, phone, email, mission statement, mobile-money numbers, bank details, leadership names, partner list, field-office confirmation) is currently unfilled. Decision: **build with literal placeholders now**, per the brief's own rule — never invent statistics, testimonials, partner logos, registration numbers, or awards. Where a number is missing, render the literal string `[NUMBER TO BE CONFIRMED]`. Field offices (Beledweyne/Hiran, Baidoa/Southwest) are used structurally but marked unconfirmed. All placeholders are tracked in `CHECKLIST-BEFORE-LAUNCH.md` (Section 10 of the brief) so they're easy to find before going live.

## 3. Tech stack

- Next.js (App Router) + TypeScript, static export (`output: 'export'`).
- Tailwind CSS, 5-token palette (below) wired into `tailwind.config.js`.
- All page copy in `/content/en.json` and `/content/so.json` — flat, same keys, human-editable.
- News/reports as Markdown with front-matter (`title`, `date`, `region`, `summary`, `image`) in `/content/news/` and `/content/reports/`.
- Images via Next.js `<Image>`, WebP, lazy-loaded.
- **Deploy target: Vercel free tier** (user's choice over Netlify).
- **Forms: Formspree** (contact, newsletter, volunteer) — since Vercel has no built-in form handler like Netlify Forms. Honeypot spam protection; no CAPTCHA (fails on low-end devices/slow connections).
- No backend server, no database, no CMS install.
- **Analytics: deferred.** No analytics wired up in this build; Plausible or Umami (cookieless, no personal data) can be added later. No cookie banner needed either way.

### Performance budget (hard requirement)

Homepage ≤ 500 KB first load incl. images. Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 (mobile). Core content pages fully usable with JS disabled. Web fonts ≤ 100 KB total, subset.

## 4. Language

- **English is the default language** (deviation from the source brief, confirmed with the user): root `/` redirects to `/en/`. English content is written first and is authoritative.
- Somali (`/so/`) is a secondary language, built with the same routing/content structure and the same keys in `so.json`, but content may lag — where Somali text is not yet supplied, `so.json` falls back to the English string flagged for translation, and all such keys are listed in the launch checklist. No silent machine-translation of humanitarian/legal terms presented as final.
- Language switcher in the header, visible on mobile without opening a menu.
- Structure supports a future `/ar/` (Arabic) by dropping in `ar.json` — not built now.

## 5. Design tokens

### Typography — confirmed: **Newsreader** (display) + **IBM Plex Sans** (body)

Newsreader is an editorial/newsroom serif (evidence-led, reporting-grade feel); IBM Plex Sans is a technical, engineered sans that reads like a research institution's site. Both are Google Fonts, self-hostable and subsettable. Plain Latin-script Somali (long compound words) renders cleanly in both.

### Colour — confirmed: **Institutional Blue**

| Token | Hex | Role | Justification |
|---|---|---|---|
| Primary | `#14355C` | Nav, primary CTAs | Somali flag blue, deepened/desaturated for institutional restraint — reads as serious, UN-cluster-report credible. |
| Secondary | `#2F6B4F` | Section dividers, icons, region tags (Hiran) | Shabelle river-valley green. |
| Accent | `#B5651D` | Small highlights only — Southwest region tags, hover states, icons. Never a large fill or small text-on-accent. | Bay State ochre soil; kept restrained per the brief's explicit "no beige-terracotta AI-NGO" rule. |
| Ink | `#201D1B` | Body text | Warm near-black, not clinical pure black. |
| Paper | `#F7F5F0` | Background | Warm off-white, avoids clinical white. |

Primary-on-Paper, Secondary-on-white, and white-on-Primary/Secondary all meet WCAG AA (4.5:1+) at body text size. Ochre is restricted to large text/icons/large fills where contrast is safe, never small text.

## 6. Homepage structure (approved wireframe)

In order: header/nav (logo, primary nav, EN/SO switcher) → Hero (real photo placeholder `hero-placeholder.jpg`, plain headline, sub-line, "Our work" / "Support our work" buttons) → Where We Work (static hand-drawn-feel SVG map of Somalia, Hiran + Southwest highlighted, pins on Beledweyne/Baidoa, click-through to Programs page sections — no map library, no API key) → What We Do (4 program cards: icon, title, one sentence, link) → Impact strip (3–4 sourced/dated figures, `[NUMBER TO BE CONFIRMED]` where unsupplied) → Latest news (3 most recent from `/content/news/`) → Partners (logo row, empty until real logos supplied) → Footer (contact, quick links, language switcher, real social links only, Safeguarding/PSEA link, privacy, terms, copyright).

## 7. Full sitemap (unchanged from source brief — see brief Section 4 for full page-by-page spec)

`/` (redirects to `/en/`), Home, About, Programs (+ 4 sub-pages: Resettlement & Durable Solutions, Shelter & Essential Services, Livelihoods & Self-Reliance, Protection & Community Cohesion), Where We Work, Impact & Accountability, News & Stories, Get Involved, Donate, Contact, Footer (all pages), legal pages (`/privacy`, `/safeguarding`, `/terms` — drafted, marked for legal/protection review before publication).

Each sub-page under Programs follows: problem → what we do → where (Hiran/Southwest) → how we measure it → one anonymized story → "Support this program" button.

Donate page: Somali mobile money (EVC Plus/Zaad/Sahal — tap-to-copy, USSD dial string, tappable on mobile), bank transfer for institutional donors, a Stripe Payment Link or Donorbox embed placeholder (link supplied later, no custom card handling), suggested giving levels only if unit costs are supplied.

## 8. Folder structure

```
/
├── app/
│   └── [lang]/                      # "en" | "so"
│       ├── layout.tsx
│       ├── page.tsx                 # home
│       ├── about/page.tsx
│       ├── programs/
│       │   ├── page.tsx
│       │   ├── resettlement/page.tsx
│       │   ├── shelter/page.tsx
│       │   ├── livelihoods/page.tsx
│       │   └── protection/page.tsx
│       ├── where-we-work/page.tsx
│       ├── impact/page.tsx
│       ├── news/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── get-involved/page.tsx
│       ├── donate/page.tsx
│       ├── contact/page.tsx
│       ├── privacy/page.tsx
│       ├── safeguarding/page.tsx
│       └── terms/page.tsx
├── content/
│   ├── en.json
│   ├── so.json
│   ├── news/*.md
│   └── reports/*.md
├── components/
│   ├── layout/                      # Header, Footer, LanguageSwitcher
│   ├── home/                        # Hero, SomaliaMap, ProgramCard, ImpactStrip, NewsPreview, PartnerRow
│   └── ui/
├── lib/
│   ├── content.ts
│   ├── markdown.ts
│   └── i18n.ts
├── public/
│   ├── images/
│   └── reports/
├── tailwind.config.js
├── next.config.js
├── CONTENT-GUIDE.md
├── DEPLOY.md
├── CHECKLIST-BEFORE-LAUNCH.md
└── package.json
```

## 9. Accessibility (non-negotiable)

Semantic HTML, one `h1`/page, correct heading order, meaningful `alt` text per page language, full keyboard navigation with visible focus rings, WCAG AA contrast, tap targets ≥ 44×44px, usable at 200% zoom.

## 10. Protection, privacy, security (non-negotiable)

No form/portal/database collecting beneficiary names, locations, family details, or biometric data. No "register for assistance" feature. No map showing exact camp coordinates or household addresses. No identifiable photos of children/individuals without an explicit consent record. No third-party trackers, ad pixels, or session recording. Privacy policy states plainly what's collected (nothing beyond anonymized analytics, currently none) and what's never collected. Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) configured at deploy. Consent line under every human story/photo. Spam-protected forms via honeypot, no CAPTCHA.

## 11. SEO

Unique title + meta description per page/language, Open Graph + Twitter cards, `hreflang` linking en/so, `Organization`/`NGO` JSON-LD from Section 0 facts (using placeholders until real), `sitemap.xml`, `robots.txt`, clean URLs.

## 12. Build order (unchanged from source brief)

Phase 1 (this document) is complete and approved. Remaining phases, each with a stop/review checkpoint:

- Phase 2 — Foundation: Next.js + Tailwind + bilingual routing + `en.json`/`so.json` + header/footer + language switcher. Show a running site.
- Phase 3 — Homepage, including the SVG map.
- Phase 4 — About, Programs (+ 4 sub-pages), Where We Work.
- Phase 5 — Impact & Accountability, News (Markdown pipeline), Reports.
- Phase 6 — Get Involved, Donate, Contact, forms (Formspree).
- Phase 7 — Legal pages, SEO, security headers, accessibility audit, real Lighthouse run (report actual scores).
- Phase 8 — Deployment (Vercel) + handover docs (`CONTENT-GUIDE.md`, `DEPLOY.md`, `CHECKLIST-BEFORE-LAUNCH.md`, assumptions list).

No `TODO`s left in code at any phase; each phase explained in plain language with what the user needs to do, if anything.

## 13. Open items / assumptions carried forward

- All Section 0 facts (org name, contacts, mission statement, mobile money numbers, bank details, leadership, partners) are placeholders pending user input.
- Field offices (Beledweyne/Hiran, Baidoa/Southwest) used structurally but unconfirmed.
- Somali translations are incomplete; `so.json` will need native-speaker review before launch.
- Analytics (Plausible/Umami) not wired up; can be added post-launch.
- Stripe Payment Link / Donorbox embed link not yet supplied — Donate page will show an honest placeholder state until provided.
