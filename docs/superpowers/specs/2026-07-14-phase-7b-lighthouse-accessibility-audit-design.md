# Design: Phase 7b — Accessibility Audit & Lighthouse Run

Status: Approved. Builds on `2026-07-14-phase-7a-legal-seo-security-design.md` and completed Phases 2-7a (full site: 20 page routes × 2 languages, legal pages, SEO metadata, security headers). Implements master prompt Section 6 (Accessibility) and the "real Lighthouse run reporting actual scores" requirement from Section 9's build order — the second of the two execution cycles Phase 7a's design proposed for the master prompt's "Phase 7."

## 1. Scope

- A real, tool-driven Lighthouse run (not a manual re-implementation of its checks) against a representative sample of the finished static build, reporting actual Performance/Accessibility/SEO/Best-Practices scores.
- A manual accessibility pass against master prompt Section 6's six criteria, cross-checked against the Lighthouse Accessibility category's findings.
- Fixes for any real accessibility defects found, each backed by a test where jsdom can verify it (alt text, heading order, label association, ARIA). CSS-only concerns (contrast, focus rings, tap-target sizing) are verified by re-running Lighthouse after the fix, not by a jsdom test, since jsdom does not compute real rendered contrast or layout.
- Performance and SEO score gaps (if any) are documented, not chased — out of scope per explicit decision, since closing them could mean design tradeoffs (font strategy, image strategy) beyond a hardening pass.
- A written, checked-in report of the actual scores obtained, plus a `CHECKLIST-BEFORE-LAUNCH.md` addition for anything left open.

## 2. Sample set

Running Lighthouse against all 40 URL variants (20 routes × 2 languages) would be slow and mostly redundant, since every page is built from the same handful of shared layout/component patterns. Ten URLs cover every distinct pattern, plus one Somali-language check for text-length regressions in a form-heavy page:

`/en/`, `/so/`, `/en/about/`, `/en/programs/shelter/`, `/en/where-we-work/`, `/en/impact/`, `/en/donate/`, `/en/contact/`, `/en/privacy/`, `/so/contact/`

## 3. Tooling

- `lighthouse` added as a devDependency (audit tooling only — not shipped in the site bundle, so it doesn't conflict with master prompt Section 2's "use exactly this stack" rule for the runtime).
- A standalone script, `scripts/lighthouse-audit.mjs`, not wired into `npm test`: builds the site (`npm run build`), serves the `out/` static export on a local port, points Lighthouse's Chrome launcher at the already-verified downloaded Chrome binary (`npx @puppeteer/browsers install chrome@stable`, confirmed working earlier this session with `--headless=new --dump-dom`) via `CHROME_PATH`, runs Lighthouse against each of the 10 sample URLs, and writes one JSON report per URL to a gitignored `lighthouse-reports/` directory.
- An `npm run audit:lighthouse` script alias for re-running later (useful again post-deploy in Phase 8, against the real domain).
- This is a one-off/occasional audit tool, not a CI gate — there's no CI in this project, and Lighthouse runs are slow (~10-20s each) and depend on a locally-downloaded Chrome binary not committed to the repo.

**Honesty guardrail**: if the real Lighthouse run cannot execute in this sandbox despite the earlier proof-of-concept, the report states that plainly and falls back to the manual Section 6 checklist only — actual scores are never fabricated, consistent with this project's established "never invent a fact" rule.

## 4. Manual accessibility pass

Independent of Lighthouse's own Accessibility category (which is thorough but not exhaustive — e.g., it can't verify 200% zoom usability or real keyboard tab order), each of Section 6's six criteria gets an explicit check against the sample pages. Master prompt Section 6 lists these six: (1) semantic HTML/one h1/heading order, (2) meaningful alt text, (3) keyboard navigation + visible focus rings, (4) AA color contrast, (5) tap targets ≥ 44×44px, (6) usable at 200% zoom. Each is expanded below:

1. Semantic HTML, one `h1` per page, correct heading order — already enforced as a running "Global Constraint" across every phase's implementation plan since Phase 2; spot-checked here, not re-litigated from scratch.
2. All images have meaningful `alt` text in the page's language — checked across `next/image` usages and any decorative-vs-meaningful distinction.
3. Keyboard navigable, visible focus rings — tab through the sample pages' interactive elements (nav, language switcher, forms, copy-to-clipboard buttons, links); confirm Tailwind's focus-visible styling is present and visible against the site's color tokens.
4. Colour contrast AA minimum — check text/background combinations against the 5-token palette (Primary `#14355C`, Secondary `#2F6B4F`, Accent `#B5651D`, Ink `#201D1B`, Paper `#F7F5F0`) using Lighthouse's contrast findings plus a manual spot-check of any combination Lighthouse doesn't cover (e.g., focus-ring color against its background).
5. Tap targets ≥ 44×44 px — check nav links, buttons, and form controls, especially on the Donate page's copy buttons and the language switcher.
6. Site is readable and usable at 200% zoom — manual check (not something Lighthouse or jsdom verifies) on a couple of representative pages, since this is a layout/reflow property.

## 5. Fix approach and testing

- Structural fixes (missing/wrong `alt` text, incorrect heading level, missing form label association, missing ARIA attribute) get a small code change plus a targeted RTL/jsdom test asserting the corrected structure — following the project's existing TDD pattern.
- Styling fixes (contrast, focus-ring visibility, tap-target sizing) are Tailwind class changes verified by re-running the Lighthouse audit script and confirming the relevant score/audit item improves, plus a note in the report of the before/after. These are not testable via jsdom (no real CSS layout or color computation), so no jsdom test is added for them — this matches how Phase 7a's `vercel.json` CSP was verified structurally (parsing the config) rather than via a live HTTP request.
- No fix is made for Performance or SEO score gaps in this phase (see Scope) — any such gap is written into the report and `CHECKLIST-BEFORE-LAUNCH.md` as a known, deferred item.

## 6. Report output

A new checked-in report, `docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md`, containing:
- The actual Lighthouse scores (Performance / Accessibility / SEO / Best Practices) for each of the 10 sample URLs, before and after any fixes.
- A pass/fail note against each of Section 6's six criteria.
- A list of any fixes made, with file references.
- Any Performance/SEO gaps left open, cross-referenced into `CHECKLIST-BEFORE-LAUNCH.md`.

`docs/superpowers/reports/` is a new directory (siblings: `specs/`, `plans/`) — this is the project's first audit-style deliverable that isn't a spec or a plan.

## 7. Open items carried to `CHECKLIST-BEFORE-LAUNCH.md`

- Any Performance or SEO Lighthouse score below the master prompt's targets (Performance ≥ 90, SEO ≥ 95 on mobile) is recorded as a known gap, not fixed this phase.
- The Lighthouse run in this phase is against the local static build on `localhost`, not the real deployed domain — scores should be re-verified once Phase 8 deploys to the real production URL, since network conditions and the real domain's TLS/CDN setup can shift results.
