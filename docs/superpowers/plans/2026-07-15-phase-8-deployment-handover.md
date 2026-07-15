# Phase 8 — Deployment & Handover Implementation Plan

**Goal:** Write the three remaining Section 10 deliverables (`CONTENT-GUIDE.md`, `DEPLOY.md`, assumptions list) and close out `CHECKLIST-BEFORE-LAUNCH.md` with a final Phase 8 section. Documentation-only — no site code changes.

## Task 1: `CONTENT-GUIDE.md`

- [x] Document editing `content/en.json` / `content/so.json` (matching-key structure, one worked example)
- [x] Document adding a news post (`content/news/{lang}/slug.md`, required front-matter fields, one worked example)
- [x] Document adding a report PDF (`content/reports/{lang}/slug.md` front-matter + where the actual PDF file goes under `public/reports/`)
- [x] Document swapping a photo (news post `image`/`alt` front-matter)
- [x] Document changing donation numbers (`content.donate.mobileMoneyProviders.*`, bank fields)
- [x] Document how to preview changes locally (`npm run dev`) before they go live
- [x] Note what not to touch without developer help (`app/`, `components/`, `lib/`)

## Task 2: `DEPLOY.md`

- [x] Prerequisites (GitHub account, Vercel account)
- [x] Push the repo to GitHub
- [x] Import into Vercel, confirm build settings (`npm run build`, static export via `next.config.js`'s `output: 'export'`)
- [x] First deploy and smoke-test on the assigned `*.vercel.app` URL
- [x] Connect a real custom domain once purchased (DNS records, HTTPS — automatic on Vercel)
- [x] Update `lib/site-config.ts`'s `SITE_URL` constant to the real domain and redeploy (fixes sitemap/robots/canonical/OG URLs — flagged in the Phase 7a checklist entry)
- [x] Set up the real Formspree endpoint and update `content.contact.formspreeEndpoint`
- [x] Post-deploy verification checklist (sitemap reachable, contact form submits, security headers present, re-run Lighthouse against the live domain per the Phase 7b report's scope note)

## Task 3: `ASSUMPTIONS.md`

- [x] List every technical/design decision made without explicit user sign-off, with the reasoning, so the user can veto any before launch (hosting target, form vendor, tap-target bar, sample URL set, analytics deferral, geoBoundaries data source, demo-content strategy, etc.)

## Task 4: Close out `CHECKLIST-BEFORE-LAUNCH.md`

- [x] Add a "Phase 8 (Deployment & Handover)" section pointing to the three new docs and restating that every Section 0 fact (including the domain) is still unconfirmed and blocks the domain-connection step in `DEPLOY.md`

## Task 5: Verify and commit

- [x] `npm test`, `npm run typecheck`, `npm run build` still pass (no code touched, but confirm no regressions)
- [x] Commit all new/modified docs
