# Phase 7b — Lighthouse & Accessibility Audit Report

Audited against the local static build (`npm run build` + `out/` served on `localhost:5050`), mobile form factor, per master prompt Section 9's "real Lighthouse run reporting actual scores" requirement and Section 6's accessibility checklist.

The audit run (`npm run audit:lighthouse`) was executed in an earlier session of this phase and produced 10 real per-URL JSON reports plus `summary.json` in `lighthouse-reports/`. This report re-verifies those results directly against the JSON files (not from a cached summary) and adds a manual Section 6 pass.

## Baseline scores (before fixes)

| URL | Performance | Accessibility | SEO | Best Practices |
|---|---|---|---|---|
| /en/ | 1.00 | 0.95 | 1.00 | 0.96 |
| /so/ | 0.99 | 0.95 | 1.00 | 1.00 |
| /en/about/ | 0.99 | 0.95 | 1.00 | 1.00 |
| /en/programs/shelter/ | 0.99 | 0.90 | 1.00 | 1.00 |
| /en/where-we-work/ | 0.97 | 0.96 | 1.00 | 1.00 |
| /en/impact/ | 0.96 | 0.92 | 1.00 | 1.00 |
| /en/donate/ | 0.98 | 0.92 | 1.00 | 1.00 |
| /en/contact/ | 0.99 | 0.96 | 1.00 | 1.00 |
| /en/privacy/ | 0.95 | 0.95 | 1.00 | 1.00 |
| /so/contact/ | 0.87 | 0.96 | 1.00 | 1.00 |

(Verified directly against `lighthouse-reports/summary.json` — matches exactly.)

## Failing Lighthouse accessibility audits (verified against raw JSON)

Extracted directly from each report's `categories.accessibility.auditRefs` / `audits[id]` (score `< 1`, excluding `null`/not-applicable):

| Report file | Page | Failing audit IDs |
|---|---|---|
| `en.json` | /en/ | `target-size` |
| `so.json` | /so/ | `target-size` |
| `en-about.json` | /en/about/ | `target-size` |
| `en-programs-shelter.json` | /en/programs/shelter/ | `target-size`, `color-contrast` |
| `en-where-we-work.json` | /en/where-we-work/ | `target-size` |
| `en-impact.json` | /en/impact/ | `target-size`, `color-contrast` |
| `en-donate.json` | /en/donate/ | `target-size`, `color-contrast` |
| `en-contact.json` | /en/contact/ | `target-size` |
| `en-privacy.json` | /en/privacy/ | `target-size` |
| `so-contact.json` | /so/contact/ | `target-size` |

`target-size` fails on all 10/10 pages; `color-contrast` fails on exactly 3/10 pages (donate, impact, programs/shelter). No other accessibility audit IDs fail on any page (SEO and Best Practices categories are essentially clean already, per the Baseline table).

## Section 6 triage

### 1. `target-size` — tap targets < 44×44px (all 10 pages) — **Important**

Confirmed via `audits['target-size'].details.items` in `lighthouse-reports/en.json` (and identical structurally across all 10 reports): three footer legal links share one root cause —

- `<a href="/en/safeguarding/">` — 133 × 18px
- `<a href="/en/privacy/">` — 86 × 18px
- `<a href="/en/terms/">` — 39 × 18px

All three live at `FOOTER > DIV.mb-4 > UL > LI > A` in `components/layout/Footer.tsx` (verified — lines 17–27), which renders these as plain inline `<Link>` text with no padding:

```tsx
<ul>
  <li><Link href={`/${lang}/safeguarding/`}>{content.footer.safeguarding}</Link></li>
  <li><Link href={`/${lang}/privacy/`}>{content.footer.privacy}</Link></li>
  <li><Link href={`/${lang}/terms/`}>{content.footer.terms}</Link></li>
</ul>
```

Lighthouse's own bar is ≥24×24px; master prompt Section 6 requires the stricter ≥44×44px, which the current 18px-tall links miss by a wide margin regardless of which bar is used.

**Proposed fix**: give each `<li>`/`<Link>` block-level display and vertical padding so the tappable box reaches ≥44px tall, e.g. `className="inline-block py-3"` on each `Link` (or `className="py-3"` on the `<li>` with `block` on the `Link`), plus `space-y-1`/`gap` on the `<ul>` so adjacent links don't collide. This is a single shared-component fix (`components/layout/Footer.tsx`) that resolves the defect on all 10 pages simultaneously since every page shares one Footer.

**Severity rationale**: Important, not Critical — the links are still visible, labeled, and clickable (this is a "hit area too small" issue, not a missing/broken/inaccessible control), but it affects literal 100% of sampled pages and specifically the Safeguarding/PSEA link, which the master prompt elsewhere treats as a priority contact channel for a vulnerable user population — so it's not a Minor/cosmetic issue either.

### 2. `color-contrast` — /en/donate/ — **Important**

Confirmed via `lighthouse-reports/en-donate.json` → `audits['color-contrast'].details.items`: three `<p class="mt-1 text-xs text-ink/60">` elements (the USSD-code lines under EVC Plus / Zaad / Sahal) have contrast 4.32 (`#767370` on `#f7f5f0`), needs 4.5. Located in `components/donate/CopyableNumber.tsx` line 40 (verified):

```tsx
<p className="mt-1 text-xs text-ink/60">{ussd}</p>
```

`text-ink/60` = `#201D1B` at 60% opacity over the `paper` (`#F7F5F0`) background, which composites to `#767370` — just under the 4.5:1 AA threshold for normal-size text.

**Proposed fix**: increase opacity, e.g. `text-ink/70` or `text-ink/75` (raises effective foreground darkness enough to clear 4.5:1 against `#f7f5f0`), or swap to a fixed darker utility if the design system has one. Verify the exact ratio against the real formula/Tailwind config before finalizing (fix belongs to Task 4/5, not this task).

**Severity rationale**: Important — 4.32 vs. 4.5 required is a narrow miss on secondary/supporting text (USSD codes), not primary content; still user-facing and affects a donation flow, so it isn't Minor.

### 3. `color-contrast` — /en/impact/ — **Important**

Confirmed via `lighthouse-reports/en-impact.json`: two elements in the Funds Use bar's "Fundraising" segment — the `<p class="font-semibold">Fundraising</p>` label and the adjacent `<p>` percentage value — have contrast 3.97 (`#f7f5f0` white/paper-colored text on `#b5651d` background), needs 4.5. Located in `components/impact/FundsUseBar.tsx` lines 18–21 (verified):

```tsx
<div className={`flex-1 p-3 text-center text-xs text-paper ${segment.color}`}>
  <p className="font-semibold">{segment.label}</p>
  <p>{content.impact.percentagePlaceholder}</p>
</div>
```

Only the `bg-accent` (`#B5651D`, the "Fundraising" segment) segment fails — the `bg-secondary` (`#2F6B4F`) and `bg-primary` (`#14355C`) segments are not flagged, confirming the accent color specifically is too light relative to `text-paper` (`#F7F5F0`) at this text size.

**Proposed fix**: darken the accent color used behind white text (e.g. a dedicated `bg-accent-dark`/`bg-accent/90`-style token, or apply `text-ink` instead of `text-paper` on the accent segment only), or increase font-weight/size if the design intends to keep the exact accent hue. A same-hue darker shade is preferable to preserve the 3-color program/admin/fundraising visual language.

**Severity rationale**: Important — narrow miss (3.97 vs 4.5) on a data-visualization label, not body copy, but it's the literal legend text for how donor funds are allocated, so legibility matters for trust/transparency messaging.

### 4. `color-contrast` — /en/programs/shelter/ — **Important**

Confirmed via `lighthouse-reports/en-programs-shelter.json`: one `<p class="mt-2 text-xs text-ink/60">` element (the "Shared with consent for illustrative purposes; not a real client account. (DEMO…)" attribution line under the client story) has contrast 4.2 (`#75716c` on `#f4eee5`), needs 4.5. Located in `components/programs/StoryBlock.tsx` line 5 (verified):

```tsx
<p className="mt-2 text-xs text-ink/60">{attribution}</p>
```

Note the background here (`#f4eee5`) differs slightly from the donate-page case (`#f7f5f0`) because this `<p>` sits inside a `bg-accent/5` tinted card (`components/programs/StoryBlock.tsx` line 3: `bg-accent/5`), not directly on the page background — same `text-ink/60` utility, different effective background, similar-magnitude failure.

**Proposed fix**: same family of fix as #2 — bump to `text-ink/70`+ (re-verify against the `#f4eee5` composite background specifically, since it's slightly lighter than plain paper and may need a hair more contrast than the donate-page fix). Given `text-ink/60` fails on two different backgrounds in two different components, a shared Tailwind utility class (e.g. a `text-caption` or `text-muted` class fixed at `ink/70`) may be worth introducing in Task 4 to avoid a third recurrence elsewhere.

**Severity rationale**: Important — same reasoning as #2/#3: narrow AA miss on secondary attribution/disclaimer text, single page.

### 5. Heading order / semantic HTML — **Pass (verified)**

All 8 distinct route `page.test.tsx` files covering the 10 sample URLs (`/en/` and `/so/` share `app/[lang]/page.test.tsx`; `/en/contact/` and `/so/contact/` share `app/[lang]/contact/page.test.tsx`) were re-run via `npx vitest run` in this session: **8 test files, 23 tests, all passing.** Each asserts exactly one `role: heading, level: 1` and, where applicable (e.g. Contact), the full ordered heading list (`['Contact', 'Our Offices', 'Beledweyne Office', 'Baidoa Office', 'Send a Message']`). This has been a Global Constraint enforced since Phase 2, and it still holds — no regression found. Somali-language routes are rendered from the same page templates (confirmed by reading `contact/page.test.tsx`'s Somali test, which asserts a single `h1` renders without crashing), so heading structure is shared across languages by construction.

### 6. Alt text / accessible names for non-text content — **Pass (by inspection)**

Grepped all of `app/` and `components/` for `next/image`/`<img`: the only raster-image usage in the codebase is `components/news/NewsPostCard.tsx` (`<Image ... alt={post.alt ?? post.title} />`), which is not one of the 10 sampled routes but is well-formed regardless (always has an alt fallback).

None of the 10 sampled pages render a raster `<img>`/`next/image`. The one non-text graphic among the samples is the inline Somalia map SVG (`components/home/SomaliaMap.tsx`, used on `/en/` and `/so/`): it has a `<title>{content.home.mapAriaLabel}</title>` for the whole graphic and `aria-label` on each interactive region link (`aria-label={content.home.mapRegionHiran}` / `mapRegionSouthwest}`), giving every clickable/informational element an accessible name in the page's language via `getContent(lang)`. No defect found.

### 7. Keyboard navigable / visible focus rings — **Pass (by inspection)**

`app/globals.css` confirmed to contain no `outline` rule at all (re-verified this session — zero matches for `outline` in that file), so no global focus-ring suppression exists. Grepped all of `components/` and `app/` for `outline-none`/`focus:outline`: the only match is a `tabIndex={-1}` in `components/contact/ContactForm.tsx` line 14, which is on the hidden honeypot spam-trap input (`aria-hidden="true"`, positioned off-screen at `left: -9999px`) — correctly excluded from the tab order, not a real interactive control, so this is expected/correct behavior, not a defect.

All genuine interactive elements sampled — nav links (`components/layout/Header.tsx`), the language switcher, the Donate page's `CopyableNumber` `<button>` (`components/donate/CopyableNumber.tsx` line 41-47, plain `<button type="button">` with no focus override), and the Contact page's real form fields (`ContactForm.tsx` lines 20-54, all plain labeled `<input>`/`<textarea>`) — rely on the browser's default focus ring, which remains intact since nothing suppresses it. Browser default focus rings are visible-contrast by design against light backgrounds such as Paper (`#F7F5F0`).

### 8. Usable at 200% zoom — **Pass (best-effort assessment)**

Could not literally open a browser to test this; assessed from layout source and from the mobile Lighthouse run's own rendered geometry:

- The Lighthouse mobile run itself renders at a 360px-wide viewport (visible in every report's `boundingRect` data, e.g. `body` width 360 in `en-donate.json`/`en-programs-shelter.json`) — narrower than the 640px viewport that would simulate 200% zoom on a 1280px design. No element in any of the 10 reports' audit `details.items` shows a bounding box wider than its 360px viewport, i.e. nothing is already overflowing at an even tighter width than the zoom check calls for.
- Grepped all of `components/` and `app/` for hardcoded pixel widths (`w-[`, `min-w-[`, `max-w-[`, inline `style={{ width`): **zero matches**. All layout uses Tailwind's relational/responsive utilities (`flex`, `flex-wrap`, `w-full`, `max-w-md`, `px-4`, etc.).
- `/en/` (`app/[lang]/page.tsx`): a simple vertical stack of sections (Hero, SomaliaMap, ProgramsSection, ImpactStrip, NewsPreview) with no multi-column grid forcing a minimum width; the map SVG is `w-full max-w-md` (scales down, doesn't clip).
- `/en/contact/` (`ContactForm.tsx`): a single-column form (`space-y-4`, each field `block w-full`) with no side-by-side layout to break; office cards render via a `flex-wrap`-friendly pattern (per Header.tsx's nav using the same technique) rather than a fixed grid.

No fixed-width or non-reflowing elements found in the 2 recommended pages (or elsewhere in the codebase) that would be expected to clip or force horizontal scrolling at a simulated 200% zoom. Recorded as a pass on best-effort static analysis; a literal browser check remains recommended if a real device/browser becomes available before ship.

## Summary

- **1 shared-component defect** (`target-size` in `components/layout/Footer.tsx`) affecting all 10/10 sampled pages — Important.
- **3 distinct color-contrast defects**, one root cause per page (`components/donate/CopyableNumber.tsx`, `components/impact/FundsUseBar.tsx`, `components/programs/StoryBlock.tsx`) — Important each.
- **4 total defects**, 0 Critical, 4 Important, 0 Minor.
- Criteria 1 (heading order), 2 (alt text), 3 (keyboard/focus), and 6 (200% zoom) all pass — no additional Section 6 gaps beyond the four Lighthouse-flagged audits above.
