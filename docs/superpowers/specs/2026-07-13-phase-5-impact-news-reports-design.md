# Design: Phase 5 — Impact & Accountability, News, Reports

Status: Approved. Builds on `2026-07-13-refugee-resettlement-website-design.md` (Phase 1 design) and completed Phases 2-4. Implements master prompt Sections 4.5 and 4.6, and the Markdown content pipeline described in Section 2.

## 1. Scope

This phase adds:

- `/{lang}/impact/` — Impact & Accountability page.
- `/{lang}/news/` — News list page, with region/program filters.
- `/{lang}/news/{slug}/` — News detail page, rendering parsed Markdown.
- The Reports data model (consumed by the Impact page's Reports section) — no separate `/reports` route; reports are downloadable PDFs listed on the Impact page per master prompt Section 4.5.

This is the first phase to introduce new npm dependencies since Phase 2's initial scaffold: `gray-matter` (front-matter parsing) and `marked` (Markdown-to-HTML). Both are small, standard, static-export-compatible (parsed at build time via Node's `fs`, never in the browser).

## 2. Markdown pipeline architecture

**Why a new dependency:** the master prompt requires real Markdown authoring (bold, links, lists) so a future non-technical editor can write posts without touching code. A regex/blank-line-splitting approach wouldn't satisfy that; `next-mdx-remote`/MDX would over-solve it (no embedded interactive components are needed in article bodies).

**Bilingual layout:** unlike `content/en.json`/`content/so.json` (one file, nested `en`/`so` keys), Markdown files don't nest per-language content cleanly. Each language gets its own folder with matching slugs:

```
content/
  news/
    en/
      2026-01-shelter-kits-arrive.md
      2026-01-first-training-cohort.md
    so/
      2026-01-shelter-kits-arrive.md
      2026-01-first-training-cohort.md
  reports/
    en/            # empty for this phase — see Section 5
    so/
```

**`lib/markdown.ts`** (new): a build-time-only module (uses Node's `fs`, never imported by client components) providing:

- `getAllNewsPosts(lang: Lang): NewsPost[]` — reads `content/news/{lang}/*.md`, parses front-matter with `gray-matter`, sorts by `date` descending. `NewsPost` = `{ slug, title, date, region, program, summary, image, contentHtml }`, where `contentHtml` is the front-matter-stripped body rendered through `marked`.
- `getNewsPost(lang: Lang, slug: string): NewsPost | null` — same parse, single file, returns `null` if the slug doesn't exist (used to drive `notFound()` semantics at build time — every slug that exists gets a static page via `generateStaticParams`, so this is a safety check, not runtime routing logic).
- `getAllReports(lang: Lang): Report[]` — reads `content/reports/{lang}/*.md` (returns `[]` when the directory has no `.md` files, which is the case for this phase). `Report` = `{ slug, title, date, category, file }`.

Front-matter schema:

- News: `title`, `date` (ISO string, e.g. `"2026-01-15"`), `region` (`"hiran" | "southwest" | "both"`), `program` (one of the four `ProgramSlug` values, or omitted for a general post), `summary`, `image` (path under `public/images/`, or omitted — no image is rendered if absent, never a fabricated placeholder photo... consistent with Phase 3's Hero, an *absent* image renders nothing here rather than a styled placeholder box, since a news list can reasonably have text-only entries).
- Reports: `title`, `date`, `category` (`"annual-report" | "financial-statement" | "project-report"`), `file` (path under `public/reports/`, e.g. `/reports/annual-report-2026.pdf`).

## 3. Consent-line safety (news detail pages)

Per master prompt Section 4.6, "every human story must carry a line stating the person consented and that names may have been changed." Rather than relying on each Markdown file's author to remember this, the news detail page template renders a fixed consent notice unconditionally on every post — the same pattern as Phase 4's `StoryBlock` keeping its attribution as a guaranteed structural element rather than free-form body text. The notice text comes from `content.news.consentNotice` (new content key), not from front-matter.

## 4. News list page (`/{lang}/news/`)

- Renders all posts from `getAllNewsPosts(lang)`, newest first.
- Filter controls: two `<select>`s (region, program) plus "All". Filtering happens client-side over the full (small) post array already present in the page's static HTML — no server, no API route, consistent with static export. A `'use client'` `NewsFilters` component wraps the list; the initial server-rendered HTML shows all posts unfiltered (so the page works with JavaScript disabled, per the master prompt's accessibility/performance baseline — filtering is progressive enhancement, not required for the content to be readable).
- Each list item: title (linking to the detail page), date, region/program tags, summary, image if present.
- Seeded with 2 demo-tagged example posts (per your decision), each with `(DEMO)`/`(QORAAL DEMO AH)`-tagged title and summary, one tagged to `program: shelter` and one to `program: livelihoods`, one in each region, so the filter UI has real, verifiable data to filter across languages.

## 5. News detail page (`/{lang}/news/{slug}/`)

- `generateStaticParams` over the cross product of `LANGS` × the slugs returned by `getAllNewsPosts(lang)` for each language (both demo posts exist in both languages, so this is 2 slugs × 2 languages = 4 static pages).
- Renders: title (h1), date, region/program tags, the parsed `contentHtml` (via `dangerouslySetInnerHTML` — safe here because content is authored Markdown from the repository, not user input), and the fixed consent notice from Section 3.

## 6. Impact & Accountability page (`/{lang}/impact/`)

- **Results table:** by year and region. No real figures exist yet — every cell renders the existing `impact.figurePlaceholder` (`[NUMBER TO BE CONFIRMED]`), continuing the Phase 3 rule (never invent a number). Row/column labels (years, regions) use structural placeholders consistent with the rest of the site (e.g., current year and the prior year, tagged, or an honest "reporting period to be confirmed" note if no year is safe to assume — resolved in the plan as showing the labels "This Year" / "Last Year" rather than inventing specific calendar years the org hasn't confirmed it has data for).
- **Funds-use bar:** a simple horizontal three-segment bar (program / admin / fundraising). No real split has been supplied, so each segment renders the literal placeholder `[PERCENTAGE TO BE CONFIRMED]` rather than a plausible-looking invented split (e.g. never defaulting to a generic "80/15/5") — same "never invent a number" rule.
- **Complaints & feedback mechanism:** phone, WhatsApp, and email placeholders (Section 0 facts, already tracked as unconfirmed in `CHECKLIST-BEFORE-LAUNCH.md`), plus a fixed, non-placeholder statement that reports can be made anonymously and will not affect anyone's access to assistance — this is a policy commitment mandated by the master prompt itself, not an invented fact, so (consistent with Phase 4's Commitments block) it is not demo-tagged.
- **Reports section:** lists `getAllReports(lang)` grouped/labeled by category; since this returns `[]` for this phase, renders the master prompt's literal fallback text with a bracketed placeholder year: "Our first annual report will be published here in `[YEAR TO BE CONFIRMED]`." — not a specific invented year.

## 7. Content additions

New `content.news.*` (list/filter labels, `consentNotice`), `content.impact.*` extensions (page heading, results table labels, funds-use labels, complaints/feedback labels and placeholder contact fields), consistent with the existing `getContent(lang)` pattern — no changes to `lib/content.ts` itself.

## 8. Accessibility carryover

One `h1` per page. The `NewsFilters` client component's `<select>` elements are real form controls with associated `<label>`s, keyboard-operable, and — per Section 4 above — non-essential to reading the unfiltered list (works with JS disabled).

## 9. Open items carried to `CHECKLIST-BEFORE-LAUNCH.md`

- Both demo news posts are fictional, clearly tagged — replace/remove once real news exists.
- Impact results table figures, funds-use percentages, and the reports "first annual report" year are all placeholders.
- Complaints/feedback phone/WhatsApp/email are structural placeholders pending Section 0 facts.
- Reports section is an honest empty state — populate `content/reports/{lang}/` and `public/reports/` once real PDFs are supplied; no demo PDF is fabricated.
