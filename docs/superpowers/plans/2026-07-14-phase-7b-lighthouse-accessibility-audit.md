# Phase 7b — Accessibility Audit & Lighthouse Run Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run a real Lighthouse audit against a representative sample of the finished static site, cross-check the result against master prompt Section 6's accessibility criteria, fix any real accessibility defects found, and produce a checked-in report of the actual scores.

**Architecture:** A standalone Node script (`scripts/lighthouse-audit.mjs`, not part of `npm test`) builds the site, serves the static export locally, launches the Chrome binary already verified working in this sandbox, and runs Lighthouse against 10 sample URLs, writing one JSON report per URL plus a `summary.json`. The scores and a manual Section 6 checklist pass feed a written report; any accessibility defects found get fixed with jsdom-testable changes where possible, or documented as verified-by-re-audit where not (CSS-only concerns like contrast and focus rings).

**Tech Stack:** Adds `lighthouse`, `chrome-launcher`, `@puppeteer/browsers`, and `serve` as devDependencies. No new runtime dependencies — these are audit tooling only, not shipped in the site bundle.

## Global Constraints

- Colour tokens (unchanged): Primary `#14355C`, Secondary `#2F6B4F`, Accent `#B5651D`, Ink `#201D1B`, Paper `#F7F5F0`.
- Sample set is exactly these 10 URLs, no more, no fewer: `/en/`, `/so/`, `/en/about/`, `/en/programs/shelter/`, `/en/where-we-work/`, `/en/impact/`, `/en/donate/`, `/en/contact/`, `/en/privacy/`, `/so/contact/`.
- The Lighthouse run must be real — an actual tool execution against a real Chrome instance. Never fabricate scores. If the run genuinely cannot execute in this sandbox despite the earlier proof-of-concept, the report must say so honestly instead of inventing numbers.
- Fix scope this phase is accessibility defects only. Performance and SEO score gaps (if any) are documented in the report and `CHECKLIST-BEFORE-LAUNCH.md`, not fixed.
- `lighthouse-reports/` (raw JSON output) and `.chrome-cache/` (downloaded Chrome binary) must be gitignored — never committed.
- `scripts/lighthouse-audit.mjs` is a standalone script, not wired into `npm test`.
- Never leave a `TODO` in code.
- Accessibility baseline continues: exactly one `h1` per page, semantic heading order.

---

## File Structure

```
package.json                                          # modified: devDependencies, audit:lighthouse script
.gitignore                                            # modified: lighthouse-reports/, .chrome-cache/
scripts/
  lighthouse-audit.mjs                                # new: builds, serves, runs Lighthouse, writes reports
docs/superpowers/reports/
  2026-07-14-phase-7b-lighthouse-accessibility-audit.md  # new: the checked-in findings report
CHECKLIST-BEFORE-LAUNCH.md                            # modified: Phase 7b section
```

Task 4 (accessibility fixes) may touch component/page files depending on what the audit finds — candidates include `app/globals.css`, `tailwind.config.js`, `components/layout/Header.tsx`, `components/contact/ContactForm.tsx`, `components/donate/CopyableNumber.tsx`, or any sample page's `page.tsx` — the exact set is determined by Task 3's findings, not fixed in advance.

---

### Task 1: Audit tooling setup

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run audit:lighthouse` script alias, available devDependencies (`lighthouse`, `chrome-launcher`, `@puppeteer/browsers`, `serve`) for Task 2 to import.

- [ ] **Step 1: Install the four new devDependencies**

Run:
```bash
npm install --save-dev lighthouse chrome-launcher @puppeteer/browsers serve
```

Expected: `package.json`'s `devDependencies` gains four new entries (exact versions npm resolves — do not hand-edit version numbers after install).

- [ ] **Step 2: Add the `audit:lighthouse` npm script**

In `package.json`, add to the `"scripts"` object (alongside the existing `dev`/`build`/`start`/`test`/`test:watch`/`typecheck` entries):

```json
"audit:lighthouse": "npm run build && node scripts/lighthouse-audit.mjs"
```

- [ ] **Step 3: Gitignore the audit script's output directories**

Add these two lines to `.gitignore` (append after the existing `tsconfig.tsbuildinfo` line):

```
lighthouse-reports/
.chrome-cache/
```

- [ ] **Step 4: Verify `package.json` and `.gitignore` are well-formed**

Run: `node -e "require('./package.json')"`
Expected: no output, exits 0 (confirms valid JSON).

Run: `git check-ignore -q lighthouse-reports/foo.json && git check-ignore -q .chrome-cache/foo && echo BOTH_IGNORED`
Expected: prints `BOTH_IGNORED`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add Lighthouse audit tooling"
```

---

### Task 2: The audit script

**Files:**
- Create: `scripts/lighthouse-audit.mjs`

**Interfaces:**
- Consumes: `lighthouse`, `chrome-launcher`, `@puppeteer/browsers`, `serve` (Task 1).
- Produces: running `npm run audit:lighthouse` writes `lighthouse-reports/<slug>.json` (one per sample URL) and `lighthouse-reports/summary.json` (an array of `{ path, performance, accessibility, seo, bestPractices }` scores, each a number from 0-1), and prints one summary line per URL to stdout.

- [ ] **Step 1: Write `scripts/lighthouse-audit.mjs` in full**

```js
#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import {
  install,
  computeExecutablePath,
  detectBrowserPlatform,
  resolveBuildId,
  Browser,
} from '@puppeteer/browsers'

const PORT = 5050
const BASE_URL = `http://localhost:${PORT}`
const OUT_DIR = 'lighthouse-reports'
const CACHE_DIR = path.resolve('.chrome-cache')

const SAMPLE_PATHS = [
  '/en/',
  '/so/',
  '/en/about/',
  '/en/programs/shelter/',
  '/en/where-we-work/',
  '/en/impact/',
  '/en/donate/',
  '/en/contact/',
  '/en/privacy/',
  '/so/contact/',
]

function slugFor(urlPath) {
  return urlPath.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-') || 'root'
}

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url)
        if (res.status < 500) {
          resolve()
          return
        }
      } catch {
        // server not up yet, retry
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server at ${url} did not respond within ${timeoutMs}ms`))
        return
      }
      setTimeout(attempt, 300)
    }
    attempt()
  })
}

async function ensureChrome() {
  const platform = detectBrowserPlatform()
  if (!platform) {
    throw new Error('Could not detect a supported browser platform for this OS.')
  }
  const buildId = await resolveBuildId(Browser.CHROME, platform, 'stable')
  await install({ browser: Browser.CHROME, buildId, cacheDir: CACHE_DIR, platform })
  return computeExecutablePath({ browser: Browser.CHROME, buildId, cacheDir: CACHE_DIR, platform })
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const executablePath = await ensureChrome()

  const server = spawn('npx', ['serve', 'out', '-l', String(PORT)], {
    stdio: 'ignore',
    shell: true,
  })

  let chrome
  try {
    await waitForServer(BASE_URL)

    chrome = await chromeLauncher.launch({
      chromePath: executablePath,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    })

    const results = []

    for (const urlPath of SAMPLE_PATHS) {
      const url = `${BASE_URL}${urlPath}`
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false },
      })

      const slug = slugFor(urlPath)
      await writeFile(path.join(OUT_DIR, `${slug}.json`), runnerResult.report)

      const { categories } = runnerResult.lhr
      const scores = {
        path: urlPath,
        performance: categories.performance.score,
        accessibility: categories.accessibility.score,
        seo: categories.seo.score,
        bestPractices: categories['best-practices'].score,
      }
      results.push(scores)

      console.log(
        `${urlPath}: performance=${scores.performance} accessibility=${scores.accessibility} seo=${scores.seo} bestPractices=${scores.bestPractices}`
      )
    }

    await writeFile(path.join(OUT_DIR, 'summary.json'), JSON.stringify(results, null, 2))
    console.log(`\nWrote ${results.length} reports to ${OUT_DIR}/`)
  } finally {
    if (chrome) await chrome.kill()
    server.kill()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
```

- [ ] **Step 2: Verify the script runs end-to-end**

Run: `npm run audit:lighthouse`

Expected:
- On first run, Chrome downloads to `.chrome-cache/` (may take a minute; subsequent runs skip this since `install()` is idempotent).
- 10 lines print to stdout, one per sample URL, each showing four numeric scores between 0 and 1.
- `lighthouse-reports/` contains 10 JSON files (one per URL, named by `slugFor`, e.g. `root.json` for `/en/` — note both `/en/` and `/so/` slug to `root.json` and would overwrite each other; see Step 3 fix before relying on this).

- [ ] **Step 3: Fix the home-page slug collision**

`/en/` and `/so/` both produce the empty string after stripping leading/trailing slashes, so `slugFor` returns `'root'` for both — the second run overwrites the first. Fix `slugFor` to include the language prefix so both are kept:

```js
function slugFor(urlPath) {
  const trimmed = urlPath.replace(/^\//, '').replace(/\/$/, '')
  return trimmed === '' ? 'root' : trimmed.replace(/\//g, '-')
}
```

This still collapses to `'root'` only for a literal bare `/`, which never occurs in `SAMPLE_PATHS` (every entry has a language prefix) — so in practice every slug is now unique (`en`, `so`, `en-about`, `so-contact`, etc.). Confirm by re-running:

Run: `npm run audit:lighthouse`
Expected: `lighthouse-reports/` now contains 10 distinct JSON files: `en.json`, `so.json`, `en-about.json`, `en-programs-shelter.json`, `en-where-we-work.json`, `en-impact.json`, `en-donate.json`, `en-contact.json`, `en-privacy.json`, `so-contact.json`.

- [ ] **Step 4: Commit**

```bash
git add scripts/lighthouse-audit.mjs
git commit -m "feat: Lighthouse audit script"
```

---

### Task 3: Baseline audit run and Section 6 triage

**Files:**
- Create: `docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md` (started here, completed in Task 5)

**Interfaces:**
- Consumes: `lighthouse-reports/summary.json` and the 10 per-URL JSON reports (Task 2).
- Produces: a "Baseline scores" table and a "Section 6 triage" list in the report file — the concrete input Task 4 acts on.

- [ ] **Step 1: Run the baseline audit**

Run: `npm run audit:lighthouse`
Expected: as in Task 2 Step 3 — 10 JSON reports plus `summary.json`, each with four category scores.

If this command fails to produce real scores after reasonable troubleshooting (e.g., Chrome genuinely cannot launch in this environment despite the earlier `--dump-dom` proof-of-concept), stop and write that failure plainly into the report's Baseline section instead of proceeding — do not fabricate numbers. This is expected to succeed based on this session's prior verification, but the instruction stands regardless.

- [ ] **Step 2: Read each report's `categories.accessibility.auditRefs` for failing audits**

For each of the 10 JSON files in `lighthouse-reports/`, parse it and look at `categories.accessibility.auditRefs` — each entry has an `id` and a `weight`. For every `id` where `audits[id].score` is not `1` and not `null` (Lighthouse uses `null` for "not applicable"), that is a failing accessibility audit. Note the `id`, the page it occurred on, and `audits[id].description`/`audits[id].details` for what to fix.

A quick way to extract this for one file:

```bash
node -e "
const r = require('./lighthouse-reports/en.json');
const failing = r.categories.accessibility.auditRefs
  .map(ref => r.audits[ref.id])
  .filter(a => a.score !== null && a.score < 1);
console.log(JSON.stringify(failing.map(a => ({ id: a.id, title: a.title, score: a.score })), null, 2));
"
```

Run this (adjusting the filename) for all 10 reports and collect the results.

- [ ] **Step 3: Manually cross-check the six Section 6 criteria on each sample page**

For each of the 10 sample URLs, open the corresponding file under `out/` in a browser (or re-derive from the source `page.tsx`/rendered test output) and check:

1. Semantic HTML, one `h1`, correct heading order — cross-reference the existing `page.test.tsx` heading-order assertions for that route; if they pass, this criterion passes (this has been a Global Constraint enforced since Phase 2, so a defect here would be a regression, not a new pattern).
2. Every image has meaningful `alt` text in the page's language — check every `next/image`/`<img>` usage rendered on the sample pages (the Somalia map SVG, program images if any, hero placeholder).
3. Keyboard navigable, visible focus rings — tab through each sample page's interactive elements (nav links, language switcher, form fields, the Donate page's `CopyableNumber` buttons, the Contact page's `ContactForm` fields) and confirm a visible focus indicator appears on each. Note: `app/globals.css` has no `outline: none` reset (confirmed absent), so browser default focus rings should be intact — verify they are still visible against the site's Paper (`#F7F5F0`) background.
4. Colour contrast AA minimum — cross-reference the `color-contrast` audit from Step 2's failing-audits list (Lighthouse's `color-contrast` audit's `details.items` lists the exact failing text/background pairs, if any).
5. Tap targets ≥ 44×44 px — cross-reference the `tap-targets` audit from Step 2 (mobile-only Lighthouse audit; `formFactor: 'mobile'` in Task 2's script ensures this runs).
6. Usable at 200% zoom — manually resize the browser viewport to simulate 200% zoom (e.g. a 640px-wide viewport for content designed at 1280px) on 2-3 of the sample pages (recommend `/en/` and `/en/contact/`, since these have the most layout complexity — hero/map/cards, and a form) and confirm text reflows without horizontal scrolling or clipped content.

- [ ] **Step 4: Write the Baseline section of the report**

Create `docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md` with this structure (fill in the real numbers from Steps 1-3 — the table below shows the required shape, not placeholder values to leave as-is):

```markdown
# Phase 7b — Lighthouse & Accessibility Audit Report

Audited against the local static build (`npm run build` + `out/` served on `localhost:5050`), mobile form factor, per master prompt Section 9's "real Lighthouse run reporting actual scores" requirement and Section 6's accessibility checklist.

## Baseline scores (before fixes)

| URL | Performance | Accessibility | SEO | Best Practices |
|---|---|---|---|---|
| /en/ | <real score> | <real score> | <real score> | <real score> |
| /so/ | <real score> | <real score> | <real score> | <real score> |
| /en/about/ | <real score> | <real score> | <real score> | <real score> |
| /en/programs/shelter/ | <real score> | <real score> | <real score> | <real score> |
| /en/where-we-work/ | <real score> | <real score> | <real score> | <real score> |
| /en/impact/ | <real score> | <real score> | <real score> | <real score> |
| /en/donate/ | <real score> | <real score> | <real score> | <real score> |
| /en/contact/ | <real score> | <real score> | <real score> | <real score> |
| /en/privacy/ | <real score> | <real score> | <real score> | <real score> |
| /so/contact/ | <real score> | <real score> | <real score> | <real score> |

## Section 6 triage

For each failing Lighthouse accessibility audit or manually-found Section 6 gap, one line:

- **<audit id or criterion #>** (`<page>`): <what's wrong> — proposed fix: <Tailwind class / code change>. Severity: Critical / Important / Minor.

If a full pass is found (no failures on any of the six criteria and no failing Lighthouse accessibility audits), write: "No accessibility defects found — all six Section 6 criteria pass on every sample page, and the Lighthouse Accessibility category has no failing audits."
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md
git commit -m "docs: Phase 7b baseline Lighthouse scores and Section 6 triage"
```

---

### Task 4: Fix triaged accessibility defects

**Files:**
- Modify: whichever files Task 3's triage identifies (see candidates in File Structure above). If Task 3 found zero defects, this task has no file changes.

**Interfaces:**
- Consumes: the "Section 6 triage" list from Task 3's report.
- Produces: fixed code for every Critical/Important item in the triage list, each verified per the procedure below.

This task is contingent on Task 3's findings. Follow whichever of these procedures match what was actually found — do not apply a fix for a defect category that wasn't triaged:

- **Missing or non-descriptive `alt` text**: update the image's `alt` prop (sourced from `content/en.json`/`content/so.json` if the text should be translatable, following the project's existing content-architecture pattern — do not hardcode English text into a component). Add or update a test in that page/component's existing test file asserting `screen.getByAltText('<expected text>')`.

- **Heading order / structure defect**: correct the heading level in the specific `page.tsx` or component. Update that route's existing `page.test.tsx` heading-order array assertion (the pattern already used throughout Phases 2-7a: `const headings = screen.getAllByRole('heading').map(h => h.textContent); expect(headings).toEqual([...])`) to reflect the corrected, real order.

- **Missing form label association**: add `htmlFor`/matching `id`, or an `aria-label`/`aria-labelledby`, to the specific field in `components/contact/ContactForm.tsx` (or wherever triaged). Add a test asserting `screen.getByLabelText('<label text>')` resolves to that field.

- **Insufficient colour contrast**: identify the exact failing foreground/background pair from the Lighthouse `color-contrast` audit's `details.items` (Task 3 Step 2). Adjust the Tailwind class to a compliant combination using the existing 5-token palette (e.g., if `text-ink/60` on `bg-paper` fails, try `text-ink/80` or the un-opacitized `text-ink`) — do not introduce a new color outside the established palette. Verify by re-running `npm run audit:lighthouse` for that one URL only (temporarily edit `SAMPLE_PATHS` in `scripts/lighthouse-audit.mjs` to just that URL, or accept the full 10-URL run) and confirming `audits['color-contrast'].score` is now `1` in that URL's JSON report. Revert any temporary edit to `SAMPLE_PATHS` before committing.

- **Missing or insufficient focus indicator**: add an explicit Tailwind focus-visible utility to the specific interactive element, e.g.:
  ```
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
  ```
  (using the Accent token `#B5651D` for visibility against both Paper and Primary backgrounds). This is not reliably scored by Lighthouse's automated Accessibility category, so verify by manual keyboard-tab inspection (re-open the built page and tab to the element) rather than a score change, and note the before/after in the report's fix list.

- **Tap target below 44×44px**: add `min-h-[44px] min-w-[44px]` (or equivalent padding) to the flagged element. Verify by re-running the audit and confirming `audits['tap-targets'].score` is now `1` for that URL.

- **200% zoom layout defect**: adjust the specific layout issue (e.g., a fixed-width element that should use `max-w-*` with fluid width, or text that needs `break-words`). Verify manually (zoom/viewport-resize check per Task 3 Step 3.6) — no automated test exists for this.

- [ ] **Step 1: Apply fixes for every Critical/Important item in the triage list**, following the matching procedure above. Commit is per logical fix (not one giant commit), following the project's established frequent-commit pattern — one commit per defect category fixed, e.g.:

```bash
git add <changed files>
git commit -m "fix: <specific accessibility defect fixed>"
```

- [ ] **Step 2: Run the full test suite after all fixes**

Run: `npm test`
Expected: PASS, no failures (including any new/updated tests from Step 1).

- [ ] **Step 3: If Task 3 found zero defects, record that explicitly instead of skipping this task silently**

If there was nothing to fix, make no code changes, and instead note in the progress ledger (or, if using subagent-driven-development, the implementer's report) that Task 4 was a deliberate no-op because Task 3's triage found a full pass. This is a valid, complete outcome for this task — do not invent a defect to have something to fix.

---

### Task 5: Final audit, report completion, and checklist update

**Files:**
- Modify: `docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md`
- Modify: `CHECKLIST-BEFORE-LAUNCH.md`

**Interfaces:**
- Consumes: Task 4's fixes (if any), the report file started in Task 3.
- Produces: the completed report with before/after scores, and a new Phase 7b section in `CHECKLIST-BEFORE-LAUNCH.md`.

- [ ] **Step 1: Re-run the full audit**

Run: `npm run audit:lighthouse`
Expected: 10 fresh JSON reports and `summary.json`. If Task 4 made no changes (zero-defect case), these scores should match the baseline; if fixes were made, the Accessibility column (and possibly others incidentally) should improve for the affected URLs.

- [ ] **Step 2: Add an "After fixes" section to the report** (skip this section entirely if Task 4 was a no-op — the Baseline section is then also the final section; say so explicitly)

```markdown
## After fixes

| URL | Performance | Accessibility | SEO | Best Practices |
|---|---|---|---|---|
| /en/ | <real score> | <real score> | <real score> | <real score> |
| ... (all 10 URLs) |

## Fixes made

- <one line per fix, with file reference, e.g.:> Fixed insufficient contrast on the Donate page's safeguarding note (`app/[lang]/donate/page.tsx`) — changed `text-ink/60` to `text-ink` on Paper background. Verified: `color-contrast` audit now scores 1 on `/en/donate/`.

(If Task 4 was a no-op: "No fixes were needed — Task 3's baseline audit found a full pass on all six Section 6 criteria and no failing Lighthouse accessibility audits.")
```

- [ ] **Step 3: Add a "Performance/SEO gaps (not fixed this phase)" section**

```markdown
## Performance/SEO gaps (not fixed this phase)

<For each URL/category where the final score is below the master prompt's target (Performance ≥ 90, SEO ≥ 95 on mobile — note these are 0-100 scale targets; Lighthouse's raw score field is 0-1, multiply by 100 to compare), one line noting the gap and the likely cause if apparent from the report (e.g., font loading strategy, unoptimized image). If every score meets target, write: "All Performance and SEO scores meet or exceed the master prompt's targets (Performance ≥ 90, SEO ≥ 95) across all 10 sample URLs — no gaps to record.">

## Scope note

This audit ran against the local static build on `localhost`, not the real deployed domain. Re-verify scores once Phase 8 deploys to the real production URL, since network conditions and the real domain's TLS/CDN setup can shift results.
```

- [ ] **Step 4: Extend `CHECKLIST-BEFORE-LAUNCH.md`**

Add a new section (keep everything already in the file — do not delete prior phases' entries). Fill in the bracketed parts based on Task 5 Steps 2-3's actual findings:

```markdown

## Phase 7b (Accessibility Audit & Lighthouse Run) — what's real vs. placeholder right now

- A real Lighthouse run (not a re-implementation of its checks) was executed against 10 representative URLs covering every distinct page pattern, in both languages where relevant. See `docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md` for full scores.
- <One line: either "All six Section 6 accessibility criteria passed with no fixes needed" or "N accessibility defects were found and fixed — see the report's Fixes Made section for details.">
- <One line: either "All Performance and SEO scores meet the master prompt's targets" or "M pages have Performance/SEO scores below target — see the report's Performance/SEO gaps section; not fixed this phase per explicit scope decision.">
- This audit ran against the local static build, not the real deployed domain — re-verify scores once Phase 8 assigns a real domain and deploys.
```

- [ ] **Step 5: Run the full test suite, typecheck, and build one more time**

Run: `npm test`
Expected: PASS, 0 failures.

Run: `npm run typecheck`
Expected: exits 0.

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md CHECKLIST-BEFORE-LAUNCH.md
git commit -m "docs: complete Phase 7b Lighthouse report and launch checklist"
```
