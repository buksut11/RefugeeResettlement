# MASTER PROMPT — Refugee Resettlement Nonprofit Website

> **How to use this file:**
> 1. Fill in every `<<FILL IN>>` in Section 0 below. Do not skip them — the AI will invent fake details if you leave them blank.
> 2. Delete this "How to use" box.
> 3. Paste the **whole document** into your AI builder (Claude, Cursor, Lovable, Bolt, v0, Replit) as your first message.
> 4. Add one line at the top: *"Build this. Start with Phase 1 only, show me the result, then wait for my approval before Phase 2."*

---

## SECTION 0 — FACTS YOU MUST USE (do not invent any of these)

| Item | Value |
|---|---|
| Organization legal name | `<<FILL IN>>` |
| Short name / acronym | `<<FILL IN>>` |
| Registration number & registering authority | `<<FILL IN>>` (leave blank if not yet registered — then omit the registration line entirely, do NOT invent one) |
| Year founded | `<<FILL IN>>` |
| Head office address | `<<FILL IN>>` |
| Field offices | Beledweyne (Hiran State), Baidoa (Southwest State) — `<<CONFIRM OR CORRECT>>` |
| Phone (WhatsApp) | `<<FILL IN>>` |
| Email | `<<FILL IN>>` |
| Mission statement (1 sentence) | `<<FILL IN>>` |
| Domain name | `<<FILL IN>>` |
| Mobile money numbers for donations | EVC Plus: `<<FILL IN>>` / Zaad: `<<FILL IN>>` / Sahal: `<<FILL IN>>` |
| Bank details for institutional donors | `<<FILL IN>>` |
| Board / leadership names + roles | `<<FILL IN>>` |
| Partners / donors to display | `<<FILL IN>>` (only real, permitted ones) |

**Rule for the AI:** If a fact above is blank, leave that element out of the site. Never fabricate statistics, beneficiary numbers, testimonials, partner logos, registration numbers, or awards. Where I have not given a number, use the literal placeholder text `[NUMBER TO BE CONFIRMED]` so I can spot it.

---

## SECTION 1 — CONTEXT

You are a senior web developer + designer building the public website for a Somali non-profit organization working on **refugee and IDP (internally displaced person) resettlement** in **Hiran State** and **Southwest State**, Somalia.

I am **not a developer and not a designer**. I will not be able to fix your code. Therefore:
- Everything must work on the first deploy with no debugging from me.
- Explain each step in plain language before you do it.
- Any text I might want to change later must live in **one clearly-labelled content file**, not scattered through code.

### Who the website is actually for (in priority order)

1. **Institutional donors and grant officers** — UNHCR, IOM, OCHA, EU, USAID-type bodies, embassies, INGOs, Somali diaspora foundations. They arrive to answer one question: *"Is this organization real, competent, accountable, and worth funding?"*
2. **Partner agencies and government** — Hirshabelle and South West State authorities, UN clusters, NGO consortiums. They want to know who to contact and what we actually do where.
3. **Diaspora and individual donors** — mostly on mobile phones, often abroad.
4. **Journalists and researchers** — need facts, reports, photos, contact.
5. **Prospective staff and volunteers.**

Beneficiaries themselves will mostly NOT use this website. **Do not build any feature that asks a displaced person to submit personal data online.** (See Section 7.)

### The conditions this site must survive

- Many visitors are on **slow 3G on cheap Android phones**, paying per megabyte.
- Some visitors are on fast connections in Nairobi, Geneva, Brussels, Minneapolis.
- Electricity and connectivity in Beledweyne and Baidoa are unreliable — the site must be static and fast, not dependent on a live server we have to maintain.

---

## SECTION 2 — WHAT TO BUILD

A **fast, static, bilingual, mobile-first marketing and accountability website**. No user accounts. No database of people. No login for the public.

### Tech stack (use exactly this unless you have a strong reason and tell me first)

- **Next.js (App Router) + TypeScript**, exported as a static site.
- **Tailwind CSS** for styling.
- **All page text in `/content/en.json` and `/content/so.json`** — two flat files, human-readable, with the same keys. I edit these files to change any wording on the site.
- **Blog / news / reports as Markdown files** in `/content/news/` and `/content/reports/`, each with front-matter (`title`, `date`, `region`, `summary`, `image`).
- Images: Next.js `<Image>`, all served as WebP, lazy-loaded.
- **Deploy target: Netlify or Vercel free tier.** Give me copy-paste deployment instructions at the end, written for someone who has never deployed a website.
- **No backend server. No database. No CMS to install.**
- Forms (contact, newsletter, volunteer) submit via **Netlify Forms** or **Formspree** — a service, not a server we run.

### Performance budget (hard requirements)

- Homepage total weight under **500 KB** on first load, images included.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 on mobile.
- Fully usable with JavaScript disabled for all core content pages.
- No web fonts over 100 KB total; subset them.

---

## SECTION 3 — LANGUAGE

- **Somali (so) and English (en). Somali is the default language.**
- Language switcher in the header, visible on mobile without opening a menu.
- URLs: `/so/...` and `/en/...`. Root `/` redirects to `/so/`.
- Every page must exist in both languages. Where I have not supplied a Somali translation, output the English text with an HTML comment `<!-- NEEDS SOMALI TRANSLATION -->` and list all such keys for me at the end. **Do not machine-translate humanitarian or legal terms silently and present them as final.**
- Optional third language: Arabic (`/ar/`) — build the structure so I can add it later by dropping in `ar.json`, but do not create the Arabic pages now.

---

## SECTION 4 — SITEMAP AND PAGE-BY-PAGE SPEC

Build exactly these pages. Nothing more.

### 4.1 Home (`/so/`, `/en/`)

- **Hero:** One real photograph (I will supply; use a neutral placeholder with the filename `hero-placeholder.jpg` for now). One headline stating what we do and where — plain, not slogan-y. One sub-line. Two buttons: *"Our work"* and *"Support our work"*.
- **Where we work:** A simple, hand-drawn-feel SVG map of Somalia with **Hiran State** and **Southwest State** highlighted, and pins on Beledweyne and Baidoa. Static SVG — no mapping library, no API key, no tile loading. Clicking a region goes to that region's section on the Programs page.
- **What we do:** Four program cards (see 4.3). Icon + title + one sentence + link.
- **Impact strip:** 3–4 key figures. Each figure MUST show its source and period, e.g. `1,240 households supported — Jan–Dec 2025, verified by [source]`. If I have not supplied a figure, print `[NUMBER TO BE CONFIRMED]`. Never round up or invent.
- **Latest news:** 3 most recent posts, auto-pulled from `/content/news/`.
- **Partners:** Logo row (only logos I supply).
- **Footer:** See 4.10.

### 4.2 About (`/about`)

Sections: Who we are · Mission · Vision · Values · Our story · Leadership & board (photo, name, role, 2-line bio) · Legal registration & governance · Our commitments (see below).

**Our commitments block** — state plainly that the organization adheres to:
- The Humanitarian Principles (humanity, neutrality, impartiality, independence)
- The Core Humanitarian Standard (CHS)
- Protection from Sexual Exploitation and Abuse (PSEA) — with a link to the Safeguarding page
- Do No Harm and informed consent in all storytelling and photography

### 4.3 Programs (`/programs`) and four sub-pages

The four programs — adjust wording only if I correct you:

1. **Resettlement & Durable Solutions** — site selection, land tenure, shelter, relocation support, integration with host communities.
2. **Shelter & Essential Services** — shelter kits, WASH, access to health and education for resettled families.
3. **Livelihoods & Self-Reliance** — skills training, cash-for-work, small business grants, so families stop being aid-dependent.
4. **Protection & Community Cohesion** — safeguarding, GBV referral pathways, child protection, dispute resolution between displaced and host communities.

Each sub-page: What the problem is → What we do about it → Where (Hiran / Southwest) → How we measure it → One anonymized story → "Support this program" button.

### 4.4 Where We Work (`/where-we-work`)

Two blocks — **Hiran State (Hirshabelle)** and **Southwest State**. For each: brief context on displacement drivers (conflict, drought, the 2023 Shabelle river flooding — verify before stating anything), districts covered, our office, what we run there, who we coordinate with.

### 4.5 Impact & Accountability (`/impact`)

This page is what wins grants. Include:
- Results table by year and by region.
- **Downloadable PDFs:** annual report, audited financial statement, project reports. Sourced from `/content/reports/`. If none supplied, show an honest empty state: *"Our first annual report will be published here in [YEAR]."*
- **How our funds are used** — a simple horizontal bar showing program / admin / fundraising split.
- **Complaints and feedback mechanism** — a clearly explained, safe way for anyone (including beneficiaries) to raise a concern: a phone number, a WhatsApp number, an email, and a statement that reports can be made anonymously and will not affect anyone's access to assistance.

### 4.6 News & Stories (`/news`)

List + detail pages from Markdown. Filters by region and program. Every human story must carry a line stating that the person consented and that names may have been changed for protection.

### 4.7 Get Involved (`/get-involved`)

Three paths: **Donate** · **Partner with us** · **Work with us** (jobs/volunteer; if no vacancies, say so plainly).

### 4.8 Donate (`/donate`)

- **Somali mobile money:** EVC Plus, Zaad, Sahal — show the number, a tap-to-copy button, and the USSD dial string. On mobile, the number should be tappable.
- **Bank transfer:** for institutional donors, with SWIFT details.
- **International card donations:** integrate a **Stripe Payment Link** or **Donorbox** embed — I will paste the link; do not build a custom payment form and do not handle card numbers in our own code.
- Suggested giving levels tied to real outcomes ("$50 = a shelter kit for one family") — **only if I supply those unit costs.** Otherwise omit.
- A short line on how donations are safeguarded and reported.

### 4.9 Contact (`/contact`)

Offices with addresses, phone, WhatsApp link, email. General contact form (name, email, subject, message) via Netlify Forms/Formspree. Separate, prominent link to the **safeguarding / complaints** channel.

### 4.10 Footer (every page)

Contact · Quick links · Language switcher · Social links (only real ones) · Safeguarding & PSEA link · Privacy policy · Copyright line.

### 4.11 Legal pages

`/privacy`, `/safeguarding`, `/terms`. Write real, specific drafts — not lorem ipsum — and clearly mark at the top of each: `<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->`.

---

## SECTION 5 — DESIGN DIRECTION

**Do not produce a generic NGO template.** No stock-photo grid of smiling children, no beige-and-terracotta "AI default" palette, no giant gradient hero.

- **Tone:** Serious, dignified, institutional, evidence-led. This organization moves families into new lives — the design should feel like something a grant officer trusts, not like a charity ad.
- **Dignity rule:** Never crop a photo to show suffering as spectacle. Show people as agents — building, working, teaching, deciding — not as recipients.
- **Palette:** Build a 5-colour token system in `tailwind.config.js`. Draw it from the actual environment of the work — river-valley greens of the Shabelle, the ochre of Bay, the deep blue of the Somali flag used with restraint as an institutional accent — and give me the hex values with a one-line justification for each. Enforce WCAG AA contrast throughout.
- **Typography:** One characteristic display face and one highly legible body face that renders Somali diacritics and long Somali compound words cleanly. Self-host and subset. Show me the pairing and why before building.
- **Structure:** Generous whitespace, strong left-aligned type, real data given room to breathe.
- **Motion:** Minimal. Respect `prefers-reduced-motion`. No parallax, no scroll-jacking.
- **The signature element:** the Somalia map — hand-drawn, textured, honest, not a slick data-viz. It is the one place to spend design boldness.

---

## SECTION 6 — ACCESSIBILITY (non-negotiable)

- Semantic HTML, one `h1` per page, correct heading order.
- All images have meaningful `alt` text in the page's language.
- Keyboard navigable, visible focus rings.
- Colour contrast AA minimum.
- Tap targets ≥ 44×44 px.
- Site is readable and usable at 200% zoom.

---

## SECTION 7 — PROTECTION, PRIVACY, SECURITY (read this twice)

This is a humanitarian organization working with displaced people in a conflict-affected area. Getting this wrong endangers real people.

**Absolutely do not build:**
- Any form, portal, or database that collects beneficiary names, locations, family details, or biometric data.
- Any "register for assistance" or "apply for resettlement" feature.
- Any map that shows exact camp coordinates, settlement locations, or the addresses of vulnerable households.
- Any page displaying identifiable photos of children or of individuals without an explicit consent record.
- Any third-party tracker, ad pixel, or session-recording script.

**Do build:**
- A privacy policy that states plainly what the site collects (nothing beyond basic, anonymized analytics) and what it never collects.
- Analytics: **Plausible or Umami only** — cookieless, no personal data, no Google Analytics, no Meta pixel. No cookie banner needed, and say so.
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) configured at deploy.
- Consent line displayed under every human story and photo.
- Spam-protected forms (honeypot; no CAPTCHA — CAPTCHAs fail on low-end devices and slow connections).

---

## SECTION 8 — SEO & DISCOVERY

- Unique title + meta description per page, per language.
- Open Graph and Twitter cards.
- `hreflang` tags linking the Somali and English versions.
- `Organization` and `NGO` JSON-LD schema with real details from Section 0.
- `sitemap.xml` and `robots.txt`.
- Clean, human-readable URLs.

---

## SECTION 9 — HOW TO WORK WITH ME (build order)

Do not build everything at once. Work in phases and stop at each checkpoint.

- **Phase 1 — Plan.** Show me: the design token system (colours + type with justification), a text wireframe of the homepage, and the folder structure. **Stop. Wait for my approval.**
- **Phase 2 — Foundation.** Next.js + Tailwind + bilingual routing + `en.json` / `so.json` + header/footer + language switcher. Show me a running site. **Stop.**
- **Phase 3 — Homepage,** including the SVG map. **Stop.**
- **Phase 4 — About, Programs (+4 sub-pages), Where We Work.**
- **Phase 5 — Impact & Accountability, News (Markdown pipeline), Reports.**
- **Phase 6 — Get Involved, Donate, Contact, forms.**
- **Phase 7 — Legal pages, SEO, security headers, accessibility audit, Lighthouse run. Report the actual scores.**
- **Phase 8 — Deployment + handover.**

At every phase: explain in plain English what you built and what I need to do (if anything). Never leave a `TODO` in the code.

---

## SECTION 10 — FINAL DELIVERABLES

1. The complete, working codebase.
2. `CONTENT-GUIDE.md` — written for a non-developer. How to change any text, add a news post, upload a report PDF, swap a photo, change the donation numbers. With examples.
3. `DEPLOY.md` — step-by-step, click-by-click, from zero to a live site on our domain, including how to connect the domain and get HTTPS.
4. `CHECKLIST-BEFORE-LAUNCH.md` — every placeholder, every `[NUMBER TO BE CONFIRMED]`, every `NEEDS SOMALI TRANSLATION`, every draft legal page that must be reviewed, listed in one place.
5. A written list of every assumption you made that I need to verify.

---

## SECTION 11 — BEFORE YOU START

Ask me any question whose answer would change the structure of the site. Then confirm you understand:
- Somali is the default language.
- No beneficiary data is ever collected.
- No statistic, partner, or credential is invented.
- Phase 1 only, then stop.
