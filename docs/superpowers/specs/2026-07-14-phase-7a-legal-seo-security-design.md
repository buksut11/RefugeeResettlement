# Design: Phase 7a — Legal Pages, SEO, Security Headers

Status: Approved. Builds on `2026-07-13-refugee-resettlement-website-design.md` (Phase 1 design) and completed Phases 2-6. Implements master prompt Sections 4.11, 8, and the security-header portion of Section 7. This is the first of two execution cycles for master prompt Section 9's "Phase 7" — the second (Phase 7b: accessibility audit + Lighthouse run) is a separate spec/plan cycle that follows once this one is merged, since its concrete fixes can't be known until real audit/measurement data exists against the finished site.

## 1. Scope

- Three new pages: `/{lang}/privacy/`, `/{lang}/safeguarding/`, `/{lang}/terms/`.
- SEO metadata infrastructure applied to every page — 12 static pages (9 pre-existing plus the 3 new legal pages), the 4 program sub-pages, and however many news posts currently exist (2 as of this phase, 18 page instances total) — plus `Organization`/`NGO` JSON-LD, `sitemap.xml`, `robots.txt`.
- `vercel.json` security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy).
- Analytics (Plausible/Umami) is explicitly out of scope this phase, per user decision — tracked as a known gap in `CHECKLIST-BEFORE-LAUNCH.md`, since it requires a real third-party account not yet supplied (same situation as Stripe/Formspree).

## 2. Legal pages

All three follow the same shape: `<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->` as a literal HTML comment (master prompt's exact required text), plus a visible `LegalDraftNotice` banner component (a small, styled callout stating the page is an unreviewed draft) — this is a deliberate addition beyond the literal spec, since a legal/safeguarding policy is exactly the kind of content a visitor might rely on, and this project's established ethos is to never present unconfirmed content as final without visible disclosure.

- **Privacy** (`/privacy/`): what the site currently collects (contact form submissions — name/email/subject/message — sent to Formspree, a third-party form processor, disclosed as such) and what it never collects (no beneficiary names, locations, family details, or biometric data, per master prompt Section 7). States plainly that no analytics or tracking is active today. Data retention, a privacy-inquiries contact (reuses existing placeholder contact fields), and a changes-to-this-policy clause.
- **Safeguarding & PSEA** (`/safeguarding/`): the full zero-tolerance policy on sexual exploitation and abuse, how to report a concern (cross-references the Contact page's safeguarding callout and the Impact page's complaints channels — both already built), confidentiality and non-retaliation for reporters, and the Do No Harm / informed-consent commitment for stories and photographs (consistent with the About page's Commitments block and every program story's attribution). This is the page every existing forward-link (About, Contact, Footer) has pointed to since Phase 4 — building it resolves those 404s.
- **Terms** (`/terms/`): acceptable use of the website, content ownership/copyright, no-warranty disclaimer, a placeholder governing-law jurisdiction (honest placeholder — the organization's legal registration itself is still unconfirmed per Section 0), and a changes-to-terms clause.

All org-specific facts (registration status, jurisdiction, contact details) reuse the same honest-placeholder conventions already established (`[REGISTRATION NUMBER TO BE CONFIRMED]`, etc.) — no new fact-invention.

## 3. SEO metadata infrastructure

**Shared helper** — `lib/seo.ts` exports `buildMetadata({ lang, path, title, description }): Metadata`, producing:
- `title`, `description`.
- `alternates.languages` (hreflang: `{ en: '/en/{path}/', so: '/so/{path}/' }`) and `alternates.canonical`.
- `openGraph` (title, description, locale, url, siteName from `content.site.name`).
- `twitter` (card: `summary`, title, description).

Every page's `page.tsx` exports a `generateMetadata({ params })` calling this helper. For the 12 static pages (home, about, programs index, where-we-work, impact, news index, get-involved, donate, contact, privacy, safeguarding, terms), title/description come from a new `content.seo.*` namespace (one `{title, description}` pair per page, both languages) — consistent with the project's "all copy lives in content JSON" architecture (master prompt Section 2). For the 4 program sub-pages and however many news posts exist, title/description are **derived from the item's own existing content** (`program.title`/`program.summary`, or `post.title`/`post.summary`) rather than duplicated into `content.seo` — this keeps each dynamic page's metadata genuinely unique without inventing a parallel content structure that could drift out of sync.

**JSON-LD**: an `Organization`/`NGO` schema script rendered once in `app/[lang]/layout.tsx` (site-wide, since it describes the entity, not a specific page), built from the same Section 0 placeholder facts (`content.site.name`, placeholder address/contact) already used elsewhere.

**Sitemap/robots**: `app/sitemap.ts` and `app/robots.ts` using Next's static-export-compatible metadata file conventions, generating real `sitemap.xml`/`robots.txt` in the build output listing every route in both languages.

## 4. Security headers

`vercel.json` gets a `headers` array applying to all routes (`"source": "/(.*)"`):
- `Content-Security-Policy`: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; form-action 'self' https://formspree.io; frame-ancestors 'none'; object-src 'none'; base-uri 'self'` — deliberately strict, since the site currently loads no external scripts, fonts, or analytics (fonts are self-hosted via `next/font`). `script-src 'self'` (no `'unsafe-inline'`) does not conflict with the inline `<script type="application/ld+json">` JSON-LD block from Section 3: browsers don't apply `script-src` enforcement to non-executable script types like `application/ld+json` (it's a data island, not parsed as JavaScript), so no CSP relaxation is needed for it. `style-src` needs `'unsafe-inline'` because `ContactForm`'s honeypot field (Phase 6) uses an inline `style` attribute for off-screen positioning.
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains`.
- `X-Frame-Options`: `DENY`.
- `Referrer-Policy`: `strict-origin-when-cross-origin`.

These take effect once Phase 8 actually deploys to Vercel — the config is built and its syntax/content verified now, same "build the honest scaffold, it activates later" pattern already used for the Formspree endpoint and card-donations link.

## 5. Testing approach

Metadata and JSON-LD are testable via rendering each page/layout and inspecting Next's metadata output (or, for `generateMetadata`, calling it directly as a function and asserting on the returned object — it's a plain async function, not a component). `sitemap.ts`/`robots.ts` are tested by calling their exported functions directly and asserting the returned route list/structure. `vercel.json` is verified by parsing it as JSON and asserting the expected header directives are present — there's no way to test actual HTTP response headers without a real deployment, consistent with how Phase 6's Formspree endpoint could only be structurally verified, not exercised end-to-end.

## 6. Open items carried to `CHECKLIST-BEFORE-LAUNCH.md`

- Analytics (Plausible/Umami) was not wired up this phase — needs a real account/site ID before it can be added.
- All three legal pages are unreviewed drafts (both the HTML comment and the visible banner say so) — must be reviewed by the organization's legal/protection focal point before launch.
- Terms' governing-law jurisdiction is a placeholder pending the organization's actual legal registration details.
- JSON-LD Organization schema uses the same placeholder org facts (name, address, contact) tracked since Phase 2 — update once real Section 0 facts are supplied.
- Security headers are configured in `vercel.json` but only take effect once the site is actually deployed (Phase 8).
