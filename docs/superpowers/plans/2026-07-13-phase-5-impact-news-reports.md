# Phase 5 — Impact & Accountability, News, Reports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Markdown content pipeline (news posts + reports), the News list/detail pages with region/program filtering, and the Impact & Accountability page, per the approved Phase 5 design spec.

**Architecture:** `lib/markdown.ts` is a new, server-only (Node `fs`) module parsing front-matter (`gray-matter`) and rendering Markdown bodies to HTML (`marked`) from `content/news/{lang}/*.md` and `content/reports/{lang}/*.md`. This is a separate data source from `lib/content.ts`'s JSON-backed `getContent(lang)`, which still holds all UI copy/labels. News filtering is a small `'use client'` island (`NewsFilters`) over an already-fully-rendered, server-provided post list, so the page remains readable with JavaScript disabled.

**Tech Stack:** Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, Vitest + React Testing Library — plus two new dependencies this phase: `gray-matter` (front-matter parsing) and `marked` (Markdown → HTML). Both ship their own TypeScript types; no ambient declarations needed.

## Global Constraints

- Colour tokens (unchanged): Primary `#14355C`, Secondary `#2F6B4F`, Accent `#B5651D`, Ink `#201D1B`, Paper `#F7F5F0`.
- Trailing-slash URL convention continues: every internal `href` ends in `/`.
- Demo content (the two seed news posts) is tagged `(DEMO)` / `(QORAAL DEMO AH)` inline, exactly as established in Phases 3-4 — never presented as final.
- Never invent a number: every impact results-table cell and every funds-use segment renders the literal placeholder (`content.impact.figurePlaceholder` / `content.impact.percentagePlaceholder`), never a fabricated figure or percentage.
- Never invent a specific year for the Reports empty state — render the literal bracketed placeholder from `content.impact.reportsEmptyState`, which already contains `[YEAR TO BE CONFIRMED]`.
- No demo/fabricated PDF report is created — `content/reports/{lang}/` stays empty this phase, matching the master prompt's explicit "if none supplied, show an honest empty state" instruction.
- The consent notice on news detail pages (`content.news.consentNotice`) and the complaints/feedback policy statement (`content.impact.complaintsIntro`) are fixed, mandated policy text — not demo-tagged, consistent with how Phase 4 treated the About page's Commitments block.
- Complaints/feedback phone, WhatsApp, and email render honest bracketed placeholders (`[PHONE NUMBER TO BE CONFIRMED]` etc.) — Section 0 facts, not yet supplied.
- Accessibility baseline continues: exactly one `h1` per page, semantic heading order, real focusable `<a>`/`next/link` elements, meaningful `alt` text on any image that is present (never `alt=""` on a content-bearing photo).
- The news list page must render its full, unfiltered post list in the initial server-rendered HTML — filtering is progressive enhancement layered on top via a `'use client'` island, never a requirement for the content to be visible.
- Never leave a `TODO` in code.
- Somali translations are first-pass demo translations, not yet reviewed by a native speaker, matching every prior phase's existing content.

---

## File Structure

```
package.json                                # +gray-matter, +marked
content/
  en.json                                   # extended: news.*, impact.* (19 new keys)
  so.json                                   # same new keys, demo Somali content
  news/
    en/
      shelter-kits-arrive-in-beledweyne.md
      first-livelihoods-training-cohort.md
    so/
      shelter-kits-arrive-in-beledweyne.md
      first-livelihoods-training-cohort.md
  reports/
    en/                                     # intentionally empty this phase
    so/                                     # intentionally empty this phase
lib/
  markdown.ts                               # getAllNewsPosts, getNewsPost, getAllReports
  markdown.test.ts
  content.test.ts                           # extended with news/impact parity assertions
components/
  news/
    NewsPostCard.tsx
    NewsPostCard.test.tsx
    NewsFilters.tsx                         # 'use client'
    NewsFilters.test.tsx
    ConsentNotice.tsx
    ConsentNotice.test.tsx
  impact/
    ImpactResultsTable.tsx
    ImpactResultsTable.test.tsx
    FundsUseBar.tsx
    FundsUseBar.test.tsx
    ComplaintsBlock.tsx
    ComplaintsBlock.test.tsx
    ReportsSection.tsx
    ReportsSection.test.tsx
app/
  [lang]/
    news/
      page.tsx
      page.test.tsx
      [slug]/
        page.tsx
        page.test.tsx
    impact/
      page.tsx
      page.test.tsx
CHECKLIST-BEFORE-LAUNCH.md                  # extended with Phase 5 placeholders
```

---

## Task 1: Add Markdown pipeline dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `gray-matter` and `marked` as installed dependencies, consumed by `lib/markdown.ts` (Task 3).

- [ ] **Step 1: Add the two dependencies to `package.json`**

In the `"dependencies"` object (after `"react-dom"`), add:

```json
    "gray-matter": "^4.0.3",
    "marked": "^18.0.6"
```

So the full `"dependencies"` block reads:

```json
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "gray-matter": "^4.0.3",
    "marked": "^18.0.6"
  },
```

- [ ] **Step 2: Install and verify**

Run: `npm install`
Expected: completes without error, `package-lock.json` updated, `node_modules/gray-matter` and `node_modules/marked` exist.

Run: `npx tsc --noEmit`
Expected: exits 0 (both packages ship their own `.d.ts` files — `gray-matter/gray-matter.d.ts` and `marked/lib/marked.d.ts` — so no ambient type declarations are needed).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gray-matter and marked for the Markdown content pipeline"
```

---

## Task 2: Seed news content and content JSON additions

**Files:**
- Create: `content/news/en/shelter-kits-arrive-in-beledweyne.md`
- Create: `content/news/en/first-livelihoods-training-cohort.md`
- Create: `content/news/so/shelter-kits-arrive-in-beledweyne.md`
- Create: `content/news/so/first-livelihoods-training-cohort.md`
- Modify: `content/en.json`
- Modify: `content/so.json`
- Modify: `lib/content.test.ts`

**Interfaces:**
- Consumes: existing `getContent(lang)` from `lib/content.ts` (unchanged).
- Produces: new content keys `news.*` and 19 new `impact.*` keys — consumed by Tasks 4-13's components. Produces the two seed Markdown posts (both languages) — consumed by Task 3's `lib/markdown.ts` and its tests.

- [ ] **Step 1: Create `content/news/en/shelter-kits-arrive-in-beledweyne.md`**

```markdown
---
title: "Shelter kits arrive in Beledweyne (DEMO)"
date: "2026-06-01"
region: "hiran"
program: "shelter"
summary: "A demonstration post showing how shelter kit distribution updates will be reported once real distributions begin. (DEMO)"
---
This is a **demonstration article** showing how shelter kit distribution updates will appear once real distributions begin.

No real distribution has taken place yet — this article exists only to verify the news pipeline renders correctly in both languages.
```

- [ ] **Step 2: Create `content/news/en/first-livelihoods-training-cohort.md`**

```markdown
---
title: "First livelihoods training cohort completes course (DEMO)"
date: "2026-05-15"
region: "southwest"
program: "livelihoods"
summary: "A demonstration post showing how livelihoods training milestones will be reported once real cohorts begin. (DEMO)"
---
This is a **demonstration article** showing how livelihoods training milestones will appear once real training cohorts begin.

No real training cohort exists yet — this article exists only to verify the news pipeline renders correctly in both languages.
```

- [ ] **Step 3: Create `content/news/so/shelter-kits-arrive-in-beledweyne.md`**

```markdown
---
title: "Qalab hoy ayaa yimid Beledweyne (QORAAL DEMO AH)"
date: "2026-06-01"
region: "hiran"
program: "shelter"
summary: "Qoraal tusaale ah oo muujinaya sida wararka qaybinta qalabka hoyga loogu soo warrami doono marka qaybinta dhabta ahi bilaabato. (QORAAL DEMO AH)"
---
Kani waa **maqaal tusaale ah** oo muujinaya sida wararka qaybinta qalabka hoyga u soo bixi doonaan marka qaybinta dhabta ahi bilaabato.

Wali ma jirto qaybin dhab ah oo dhacday — maqaalkani wuxuu u yaal kaliya inuu xaqiijiyo in dhinaca wararku si sax ah ugu shaqeeyo labada luqadood.
```

- [ ] **Step 4: Create `content/news/so/first-livelihoods-training-cohort.md`**

```markdown
---
title: "Kooxdii ugu horreysay ee tababarka nolol-maalmeedka way dhammaysay koorsada (QORAAL DEMO AH)"
date: "2026-05-15"
region: "southwest"
program: "livelihoods"
summary: "Qoraal tusaale ah oo muujinaya sida guulaha tababarka nolol-maalmeedka loogu soo warrami doono marka kooxaha dhabta ahi bilaabmaan. (QORAAL DEMO AH)"
---
Kani waa **maqaal tusaale ah** oo muujinaya sida guulaha tababarka nolol-maalmeedka u soo bixi doonaan marka kooxaha tababarka dhabta ahi bilaabmaan.

Wali ma jirto kooxdii tababar oo dhab ah — maqaalkani wuxuu u yaal kaliya inuu xaqiijiyo in dhinaca wararku si sax ah ugu shaqeeyo labada luqadood.
```

- [ ] **Step 5: Write the failing test additions to `lib/content.test.ts`**

Replace the file's full contents with:

```ts
import { describe, it, expect } from 'vitest'
import { getContent } from '@/lib/content'

function keyShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(keyShape)
  if (value !== null && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .map((key) => [key, keyShape((value as Record<string, unknown>)[key])])
  }
  return null
}

describe('getContent', () => {
  it('returns English content for "en"', () => {
    const content = getContent('en')
    expect(content.site.name).toBe('Horumar Resettlement Network')
    expect(content.nav.home).toBe('Home')
  })

  it('returns Somali content for "so"', () => {
    const content = getContent('so')
    expect(content.site.name).toBe('Horumar Resettlement Network')
    expect(content.nav.home).toBeDefined()
  })

  it('includes Phase 4 About page content keys', () => {
    const content = getContent('en')
    expect(content.about.heading).toBe('About Us')
    expect(content.about.leadership).toHaveLength(3)
  })

  it('includes Phase 5 News content keys', () => {
    const content = getContent('en')
    expect(content.news.pageHeading).toBe('News & Stories')
    expect(content.news.filterRegionLabel).toBe('Region')
    expect(content.news.filterProgramLabel).toBe('Program')
    expect(content.news.filterAllLabel).toBe('All')
    expect(content.news.regionBoth).toBe('Both regions')
    expect(content.news.readMoreLabel).toBe('Read more')
    expect(content.news.consentNotice).toContain('informed consent')
  })

  it('includes Phase 5 Impact page content keys', () => {
    const content = getContent('en')
    expect(content.impact.pageHeading).toBe('Impact & Accountability')
    expect(content.impact.resultsThisYearLabel).toBe('This Year')
    expect(content.impact.resultsLastYearLabel).toBe('Last Year')
    expect(content.impact.percentagePlaceholder).toBe('[PERCENTAGE TO BE CONFIRMED]')
    expect(content.impact.complaintsPhone).toBe('[PHONE NUMBER TO BE CONFIRMED]')
    expect(content.impact.reportsEmptyState).toContain('[YEAR TO BE CONFIRMED]')
  })

  it('keeps Somali news and impact content structurally in sync with English', () => {
    const en = getContent('en')
    const so = getContent('so')
    expect(keyShape(so.news)).toEqual(keyShape(en.news))
    expect(keyShape(so.impact)).toEqual(keyShape(en.impact))
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npx vitest run lib/content.test.ts`
Expected: FAIL on the "Phase 5" tests — `content.news` and the new `content.impact.*` keys are `undefined`.

- [ ] **Step 7: Replace `content/en.json` with the full extended content**

```json
{
  "site": {
    "name": "Horumar Resettlement Network"
  },
  "nav": {
    "home": "Home",
    "about": "About",
    "programs": "Programs",
    "whereWeWork": "Where We Work",
    "impact": "Impact",
    "news": "News",
    "getInvolved": "Get Involved",
    "donate": "Donate",
    "contact": "Contact"
  },
  "footer": {
    "contactHeading": "Contact",
    "quickLinksHeading": "Quick Links",
    "safeguarding": "Safeguarding & PSEA",
    "privacy": "Privacy Policy",
    "terms": "Terms",
    "copyright": "© {year} Horumar Resettlement Network (DEMO NAME). All rights reserved."
  },
  "home": {
    "heroHeadline": "Helping displaced families in Hiran and Southwest State rebuild their lives (DEMO TEXT)",
    "heroSubline": "Resettlement, shelter, and livelihoods support for families in Beledweyne and Baidoa. (DEMO TEXT)",
    "heroCtaPrimary": "Our work",
    "heroCtaSecondary": "Support our work",
    "heroPhotoPlaceholder": "Photo placeholder — real photograph to follow",
    "whereWeWorkHeading": "Where We Work",
    "mapAriaLabel": "Illustrative map of Somalia showing Hiran and Southwest State, the organization's areas of operation",
    "mapRegionHiran": "Hiran / Hirshabelle",
    "mapRegionSouthwest": "Southwest State",
    "mapAttribution": "Map data: geoBoundaries, CC-BY 4.0",
    "whatWeDoHeading": "What We Do",
    "impactHeading": "Impact",
    "newsHeading": "Latest News",
    "newsEmptyState": "News and updates will appear here once published."
  },
  "programs": {
    "resettlement": {
      "title": "Resettlement & Durable Solutions",
      "summary": "We help displaced families secure land, shelter, and a lasting place to rebuild. (DEMO)",
      "problem": "Many displaced families in Hiran and Southwest State lack secure land tenure and safe shelter, leaving them without a stable place to rebuild. (DEMO)",
      "whatWeDo": "We support site selection, land tenure documentation, shelter construction, and integration support with host communities. (DEMO)",
      "whereText": "Active in Hiran/Hirshabelle (Beledweyne) and Southwest State (Baidoa). (DEMO)",
      "measurement": "We track households resettled, land tenure documents issued, and household satisfaction surveys. (DEMO)",
      "story": "Halima and her three children were displaced twice before resettling near Beledweyne with support securing land and building a permanent shelter. Name and details changed to protect identity. (DEMO STORY)",
      "storyAttribution": "Shared with consent for illustrative purposes; not a real client account. (DEMO STORY)"
    },
    "shelter": {
      "title": "Shelter & Essential Services",
      "summary": "We provide shelter kits and connect resettled families to water, health, and education. (DEMO)",
      "problem": "Resettled families often lack access to safe shelter and basic services like clean water, health care, and education. (DEMO)",
      "whatWeDo": "We distribute shelter kits and connect resettled households to water, health, and education services. (DEMO)",
      "whereText": "Active in Hiran/Hirshabelle and Southwest State, alongside our resettlement sites. (DEMO)",
      "measurement": "We track shelter kits distributed and households connected to essential services. (DEMO)",
      "story": "After resettling in Baidoa, Ahmed's family received a shelter kit and was connected to a nearby health clinic. Name and details changed to protect identity. (DEMO STORY)",
      "storyAttribution": "Shared with consent for illustrative purposes; not a real client account. (DEMO STORY)"
    },
    "livelihoods": {
      "title": "Livelihoods & Self-Reliance",
      "summary": "We offer skills training and small business support so families move beyond aid dependency. (DEMO)",
      "problem": "Without stable income, displaced families remain dependent on aid long after resettlement. (DEMO)",
      "whatWeDo": "We provide skills training, cash-for-work opportunities, and small business grants. (DEMO)",
      "whereText": "Active in Hiran/Hirshabelle and Southwest State. (DEMO)",
      "measurement": "We track trainings completed, grants disbursed, and household income over time. (DEMO)",
      "story": "With a small business grant, Fartun opened a tailoring shop in Beledweyne, now employing two other resettled women. Name and details changed to protect identity. (DEMO STORY)",
      "storyAttribution": "Shared with consent for illustrative purposes; not a real client account. (DEMO STORY)"
    },
    "protection": {
      "title": "Protection & Community Cohesion",
      "summary": "We run safeguarding, referral, and dispute-resolution work between displaced and host communities. (DEMO)",
      "problem": "Displacement can increase risks of gender-based violence, child protection concerns, and tension between displaced and host communities. (DEMO)",
      "whatWeDo": "We run safeguarding services, GBV referral pathways, child protection support, and community dispute resolution. (DEMO)",
      "whereText": "Active in Hiran/Hirshabelle and Southwest State. (DEMO)",
      "measurement": "We track referrals made, disputes resolved, and community feedback sessions held. (DEMO)",
      "story": "A community dispute-resolution session in Baidoa helped a displaced family and host neighbors agree on shared water access. Details changed to protect identity. (DEMO STORY)",
      "storyAttribution": "Shared with consent for illustrative purposes; not a real client account. (DEMO STORY)"
    }
  },
  "impact": {
    "householdsSupported": "households supported",
    "shelterKits": "shelter kits distributed",
    "livelihoodsTrainings": "livelihoods trainings completed",
    "districtsReached": "districts reached",
    "figurePlaceholder": "[NUMBER TO BE CONFIRMED]",
    "pageHeading": "Impact & Accountability",
    "resultsHeading": "Results by Year and Region",
    "resultsThisYearLabel": "This Year",
    "resultsLastYearLabel": "Last Year",
    "fundsUseHeading": "How Our Funds Are Used",
    "fundsUseProgramLabel": "Program",
    "fundsUseAdminLabel": "Admin",
    "fundsUseFundraisingLabel": "Fundraising",
    "percentagePlaceholder": "[PERCENTAGE TO BE CONFIRMED]",
    "complaintsHeading": "Complaints & Feedback",
    "complaintsIntro": "If you have a concern about our programs or the conduct of our staff, you can reach us through any of the channels below. Reports can be made anonymously and will never affect your or your family's access to assistance.",
    "complaintsPhoneLabel": "Phone",
    "complaintsPhone": "[PHONE NUMBER TO BE CONFIRMED]",
    "complaintsWhatsappLabel": "WhatsApp",
    "complaintsWhatsapp": "[WHATSAPP NUMBER TO BE CONFIRMED]",
    "complaintsEmailLabel": "Email",
    "complaintsEmail": "[EMAIL TO BE CONFIRMED]",
    "reportsHeading": "Reports",
    "reportsEmptyState": "Our first annual report will be published here in [YEAR TO BE CONFIRMED]."
  },
  "news": {
    "pageHeading": "News & Stories",
    "filterRegionLabel": "Region",
    "filterProgramLabel": "Program",
    "filterAllLabel": "All",
    "regionBoth": "Both regions",
    "readMoreLabel": "Read more",
    "consentNotice": "Names in personal stories may be changed to protect identity, and are shared only with the individual's informed consent."
  },
  "about": {
    "heading": "About Us",
    "whoWeAreHeading": "Who We Are",
    "whoWeAreBody": "Horumar Resettlement Network is a Somali-led organization supporting families displaced by conflict and climate shocks as they resettle and rebuild in Hiran and Southwest State. (DEMO)",
    "missionHeading": "Mission",
    "missionBody": "To help displaced families secure safe shelter, sustainable livelihoods, and a lasting place to belong. (DEMO)",
    "visionHeading": "Vision",
    "visionBody": "A Somalia where no family remains displaced without a path to a stable, dignified life. (DEMO)",
    "valuesHeading": "Values",
    "values": [
      "Dignity (DEMO)",
      "Accountability (DEMO)",
      "Community-led solutions (DEMO)",
      "Do no harm (DEMO)"
    ],
    "ourStoryHeading": "Our Story",
    "ourStoryBody": "Founded in response to displacement across Hiran and Southwest State, our organization grew from local relief efforts into a structured resettlement and livelihoods program. (DEMO)",
    "leadershipHeading": "Leadership & Board",
    "leadership": [
      {
        "name": "Amina Yusuf (DEMO NAME)",
        "role": "Executive Director (DEMO ROLE)",
        "bio": "Leads the organization's strategy and community partnerships. (DEMO BIO)"
      },
      {
        "name": "Mohamed Ali (DEMO NAME)",
        "role": "Programs Director (DEMO ROLE)",
        "bio": "Oversees resettlement, shelter, and livelihoods programming. (DEMO BIO)"
      },
      {
        "name": "Fadumo Hassan (DEMO NAME)",
        "role": "Board Chair (DEMO ROLE)",
        "bio": "Provides governance oversight and community accountability. (DEMO BIO)"
      }
    ],
    "legalGovernanceHeading": "Legal Registration & Governance",
    "legalGovernanceBody": "Registration status: [REGISTRATION NUMBER TO BE CONFIRMED]. Governed by a volunteer board of trustees. (DEMO)",
    "commitmentsHeading": "Our Commitments",
    "commitmentHumanitarianPrinciples": "We adhere to the Humanitarian Principles of humanity, neutrality, impartiality, and independence in all our work.",
    "commitmentCHS": "We are committed to meeting the Core Humanitarian Standard (CHS) on Quality and Accountability.",
    "commitmentPSEA": "We maintain a zero-tolerance policy on sexual exploitation and abuse (PSEA). Read our full",
    "commitmentDoNoHarm": "We apply Do No Harm principles and obtain informed consent before sharing any story or photograph."
  },
  "programDetail": {
    "problemHeading": "The Problem",
    "whatWeDoHeading": "What We Do",
    "whereHeading": "Where We Work",
    "measurementHeading": "How We Measure It",
    "storyHeading": "A Story From Our Work",
    "supportCta": "Support this program"
  },
  "programsPage": {
    "heading": "Our Programs",
    "intro": "Four connected programs help displaced families move from crisis to stability. (DEMO)"
  },
  "whereWeWork": {
    "heading": "Where We Work",
    "intro": "We work in two areas of Somalia: Hiran/Hirshabelle and Southwest State. (DEMO)",
    "regionLabels": {
      "districts": "Districts Covered",
      "office": "Our Office",
      "whatWeRun": "What We Run Here",
      "coordination": "Who We Coordinate With"
    },
    "hiran": {
      "heading": "Hiran / Hirshabelle",
      "displacementContext": "In May 2023, the Shabelle River burst its banks at Beledweyne in its worst flooding in roughly 30 years, affecting an estimated 200,000+ people and flooding around 79% of the town — one of several conflict- and climate-driven displacement waves in the region. (Sources: IOM, OCHA)",
      "districts": "Beledweyne district. (structural placeholder — additional districts to be confirmed)",
      "office": "Beledweyne (field office location structurally assumed; to be confirmed)",
      "whatWeRun": "Resettlement, shelter, and livelihoods programming. (DEMO)",
      "coordination": "[COORDINATION PARTNERS TO BE CONFIRMED]"
    },
    "southwest": {
      "heading": "Southwest State",
      "displacementContext": "Southwest State has experienced repeated displacement driven by conflict and recurring drought across South-Central Somalia. (general, well-established context; specific incident data pending)",
      "districts": "Baidoa district. (structural placeholder — additional districts to be confirmed)",
      "office": "Baidoa (field office location structurally assumed; to be confirmed)",
      "whatWeRun": "Resettlement, shelter, and livelihoods programming. (DEMO)",
      "coordination": "[COORDINATION PARTNERS TO BE CONFIRMED]"
    }
  }
}
```

- [ ] **Step 8: Replace `content/so.json` with the full extended content**

```json
{
  "site": {
    "name": "Horumar Resettlement Network"
  },
  "nav": {
    "home": "Bogga Hore",
    "about": "Nagu Saabsan",
    "programs": "Barnaamijyada",
    "whereWeWork": "Meesha Aan Ka Shaqeyno",
    "impact": "Saameynta",
    "news": "Wararka",
    "getInvolved": "Naga Qeyb Qaado",
    "donate": "Deeq Bixi",
    "contact": "Nala Soo Xiriir"
  },
  "footer": {
    "contactHeading": "Nala Soo Xiriir",
    "quickLinksHeading": "Xiriiriyayaal Degdeg ah",
    "safeguarding": "Ilaalinta iyo PSEA",
    "privacy": "Siyaasadda Sirta",
    "terms": "Shuruudaha",
    "copyright": "© {year} Horumar Resettlement Network (MAGAC DEMO AH). Xuquuqda oo dhan waa xifdisan yihiin."
  },
  "home": {
    "heroHeadline": "Ka caawinta qoysaska barakacay ee Hiiraan iyo Koonfur Galbeed inay dib u dhisaan noloshooda (QORAAL DEMO AH)",
    "heroSubline": "Taageero dib-u-dejin, hoy, iyo nolol-maalmeed oo loogu talagalay qoysaska ku nool Beledweyne iyo Baydhabo. (QORAAL DEMO AH)",
    "heroCtaPrimary": "Shaqadeenna",
    "heroCtaSecondary": "Taageer Shaqadeenna",
    "heroPhotoPlaceholder": "Sawir beddel ah — sawir dhab ah ayaa iman doona",
    "whereWeWorkHeading": "Meesha Aan Ka Shaqeyno",
    "mapAriaLabel": "Khariidad muujineed oo Soomaaliya ah oo muujinaysa Hiiraan iyo Gobolka Koonfur Galbeed, meelaha ay hay'adu ka shaqeyso",
    "mapRegionHiran": "Hiiraan / Hirshabelle",
    "mapRegionSouthwest": "Gobolka Koonfur Galbeed",
    "mapAttribution": "Xogta khariidadda: geoBoundaries, CC-BY 4.0",
    "whatWeDoHeading": "Waxa Aan Qabano",
    "impactHeading": "Saameynta",
    "newsHeading": "Wararka Ugu Dambeeyay",
    "newsEmptyState": "Wararka iyo cusboonaysiinta halkan ayey ka soo muuqan doonaan marka la daabaco."
  },
  "programs": {
    "resettlement": {
      "title": "Dib-u-dejin iyo Xalal Waara",
      "summary": "Waxaan ka caawinaa qoysaska barakacay inay helaan dhul, hoy, iyo meel ay dib ugu dhisan karaan noloshooda. (QORAAL DEMO AH)",
      "problem": "Qoysas badan oo barakacay oo ku nool Hiiraan iyo Koonfur Galbeed ma haystaan dhul sugan ama hoy ammaan ah. (QORAAL DEMO AH)",
      "whatWeDo": "Waxaan taageernaa doorashada goobta, dukumentiga dhulka, dhismaha hoyga, iyo isku-dhafka bulshada martida loo yahay. (QORAAL DEMO AH)",
      "whereText": "Waxaan ka shaqeynaa Hiiraan/Hirshabelle (Beledweyne) iyo Koonfur Galbeed (Baydhabo). (QORAAL DEMO AH)",
      "measurement": "Waxaan la soconaa qoysaska dib loo dejiyay, dukumentiyada dhulka, iyo sahannada qanaacsanaanta qoysaska. (QORAAL DEMO AH)",
      "story": "Halima iyo saddexdeeda carruur ayaa laba jeer barakacay ka hor inta aysan dib ugu dejin agagaarka Beledweyne, iyagoo la caawiyay dhul iyo hoy joogto ah. Magaca iyo faahfaahinta waa la beddelay si loo ilaaliyo aqoonsiga. (QORAAL DEMO AH)",
      "storyAttribution": "Waxaa lala wadaagay ogolaansho ujeeddo tusaale ah; ma aha xisaab dhab ah oo macmiil. (QORAAL DEMO AH)"
    },
    "shelter": {
      "title": "Hoy iyo Adeegyo Muhiim ah",
      "summary": "Waxaan bixinaa qalabka hoyga waxaanan qoysaska dib loo dejiyay ku xiraa biyo, caafimaad, iyo waxbarasho. (QORAAL DEMO AH)",
      "problem": "Qoysaska dib loo dejiyay badanaa ma helaan hoy ammaan ah iyo adeegyo aasaasi ah sida biyo, caafimaad, iyo waxbarasho. (QORAAL DEMO AH)",
      "whatWeDo": "Waxaan qaybinaa qalabka hoyga waxaanan xiraa qoysaska biyo, caafimaad, iyo adeegyada waxbarasho. (QORAAL DEMO AH)",
      "whereText": "Waxaan ka shaqeynaa Hiiraan/Hirshabelle iyo Koonfur Galbeed, agagaarka goobaha dib-u-dejinta. (QORAAL DEMO AH)",
      "measurement": "Waxaan la soconaa qalabka hoyga ee la qaybiyay iyo qoysaska adeegyada lagu xiray. (QORAAL DEMO AH)",
      "story": "Kadib markii uu dib ugu dejiyay Baydhabo, qoyska Ahmed waxay helay qalab hoy waxaana lagu xiray xarun caafimaad u dhow. Magaca iyo faahfaahinta waa la beddelay. (QORAAL DEMO AH)",
      "storyAttribution": "Waxaa lala wadaagay ogolaansho ujeeddo tusaale ah; ma aha xisaab dhab ah oo macmiil. (QORAAL DEMO AH)"
    },
    "livelihoods": {
      "title": "Nolol-maalmeed iyo Iskaa Wax u Qabso",
      "summary": "Waxaan bixinaa tababar xirfadeed iyo taageero ganacsi yar si qoysasku uga gudbaan ku tiirsanaanta gargaarka. (QORAAL DEMO AH)",
      "problem": "La'aanta dakhli joogto ah, qoysaska barakacay way sii ku tiirsanaan gargaarka xitaa kadib dib-u-dejinta. (QORAAL DEMO AH)",
      "whatWeDo": "Waxaan bixinaa tababar xirfadeed, fursado shaqo-lacag, iyo deeqo ganacsi yaryar. (QORAAL DEMO AH)",
      "whereText": "Waxaan ka shaqeynaa Hiiraan/Hirshabelle iyo Koonfur Galbeed. (QORAAL DEMO AH)",
      "measurement": "Waxaan la soconaa tababarrada la dhammeeyay, deeqaha la bixiyay, iyo dakhliga qoysaska muddo ka dib. (QORAAL DEMO AH)",
      "story": "Deeq ganacsi yar ayay Fartun ku furatay dukaan dharsameyn oo ku yaal Beledweyne, oo hadda shaqaaleysiisa laba haween ah oo dib loo dejiyay. Magaca iyo faahfaahinta waa la beddelay. (QORAAL DEMO AH)",
      "storyAttribution": "Waxaa lala wadaagay ogolaansho ujeeddo tusaale ah; ma aha xisaab dhab ah oo macmiil. (QORAAL DEMO AH)"
    },
    "protection": {
      "title": "Ilaalin iyo Isku-dhafka Bulshada",
      "summary": "Waxaan qabannaa shaqada ilaalinta, gudbinta xaaladaha, iyo xallinta khilaafaadka dhex mara bulshooyinka barakacay iyo kuwa martida loo yahay. (QORAAL DEMO AH)",
      "problem": "Barakac wuxuu kordhin karaa khatarta rabshadaha jinsiga, walaaca ilaalinta caruurta, iyo xiisadda dhex mara bulshooyinka barakacay iyo kuwa martida loo yahay. (QORAAL DEMO AH)",
      "whatWeDo": "Waxaan qabannaa adeegyada ilaalinta, wadooyinka gudbinta rabshadaha jinsiga, taageerada ilaalinta caruurta, iyo xallinta khilaafaadka bulshada. (QORAAL DEMO AH)",
      "whereText": "Waxaan ka shaqeynaa Hiiraan/Hirshabelle iyo Koonfur Galbeed. (QORAAL DEMO AH)",
      "measurement": "Waxaan la soconaa gudbinta la sameeyay, khilaafaadka la xalliyay, iyo kulamada jawaab-celinta bulshada. (QORAAL DEMO AH)",
      "story": "Kulan xallinta khilaaf oo ku dhacay Baydhabo ayaa caawiyay qoys barakacay iyo deris martida loo yahay inay ku heshiiyaan gelitaanka biyaha la wadaago. Faahfaahinta waa la beddelay. (QORAAL DEMO AH)",
      "storyAttribution": "Waxaa lala wadaagay ogolaansho ujeeddo tusaale ah; ma aha xisaab dhab ah oo macmiil. (QORAAL DEMO AH)"
    }
  },
  "impact": {
    "householdsSupported": "qoysas la taageeray",
    "shelterKits": "qalab hoy oo la qaybiyay",
    "livelihoodsTrainings": "tababarro nolol-maalmeed oo dhammaystiran",
    "districtsReached": "degmooyin la gaadhay",
    "figurePlaceholder": "[LAMBARKA WELI LAMA XAQIIJIN]",
    "pageHeading": "Saameynta iyo Xisaabtan Bixinta",
    "resultsHeading": "Natiijooyinka Sanadka iyo Gobolka",
    "resultsThisYearLabel": "Sanadkan",
    "resultsLastYearLabel": "Sanadkii Hore",
    "fundsUseHeading": "Sida Loo Isticmaalo Lacagaha",
    "fundsUseProgramLabel": "Barnaamijka",
    "fundsUseAdminLabel": "Maamulka",
    "fundsUseFundraisingLabel": "Ururinta Lacagaha",
    "percentagePlaceholder": "[BOQOLKIIBAHA WELI LAMA XAQIIJIN]",
    "complaintsHeading": "Cabashooyinka iyo Jawaab-celinta",
    "complaintsIntro": "Haddii aad qabto walaac ku saabsan barnaamijyadeenna ama habdhaqanka shaqaalaheenna, waxaad nagala soo xiriiri kartaa mid ka mid ah kanaalada hoose. Warbixinnada waxaa lagu soo gudbin karaa qarsoodi, mana saameyn doonaan helitaanka gargaarka adiga ama qoyskaaga.",
    "complaintsPhoneLabel": "Telefoon",
    "complaintsPhone": "[LAMBARKA TALEEFANKA WELI LAMA XAQIIJIN]",
    "complaintsWhatsappLabel": "WhatsApp",
    "complaintsWhatsapp": "[LAMBARKA WHATSAPP WELI LAMA XAQIIJIN]",
    "complaintsEmailLabel": "Iimayl",
    "complaintsEmail": "[IIMAYLKA WELI LAMA XAQIIJIN]",
    "reportsHeading": "Warbixinnada",
    "reportsEmptyState": "Warbixintayada sannadlaha ah ee ugu horreysa waxaa halkan lagu daabici doonaa sanadka [SANADKA WELI LAMA XAQIIJIN]."
  },
  "news": {
    "pageHeading": "Wararka iyo Sheekooyinka",
    "filterRegionLabel": "Gobolka",
    "filterProgramLabel": "Barnaamijka",
    "filterAllLabel": "Dhammaan",
    "regionBoth": "Labada gobol",
    "readMoreLabel": "Sii akhri",
    "consentNotice": "Magacyada ku jira sheekooyinka gaarka ah waa la beddeli karaa si loo ilaaliyo aqoonsiga, waxaana lala wadaagaa oo kaliya ogolaanshaha la ogsoon yahay ee qofka."
  },
  "about": {
    "heading": "Nagu Saabsan",
    "whoWeAreHeading": "Waa Ayaan Nahay",
    "whoWeAreBody": "Horumar Resettlement Network waa hay'ad Soomaali ah oo taageerta qoysaska ay barakaciyeen colaad iyo saameyn cimilo, kuwaas oo dib u dejinaya oo dib u dhisaya Hiiraan iyo Koonfur Galbeed. (QORAAL DEMO AH)",
    "missionHeading": "Hadafka",
    "missionBody": "In la caawiyo qoysaska barakacay inay helaan hoy ammaan ah, nolol-maalmeed waara, iyo meel ay ku noolaadaan si joogto ah. (QORAAL DEMO AH)",
    "visionHeading": "Aragtida",
    "visionBody": "Soomaali aysan qoys ku hadhin barakac la'aan hab ku gaadhaya nolol deggan oo sharaf leh. (QORAAL DEMO AH)",
    "valuesHeading": "Qiyamka",
    "values": [
      "Sharafta (QORAAL DEMO AH)",
      "Xisaabtan bixinta (QORAAL DEMO AH)",
      "Xalallo bulshadu hoggaamiso (QORAAL DEMO AH)",
      "Waxyeelo la'aan (QORAAL DEMO AH)"
    ],
    "ourStoryHeading": "Taariikhdeenna",
    "ourStoryBody": "Waxaa la aasaasay jawaab celin loogu talagalay barakaca Hiiraan iyo Koonfur Galbeed, hay'adeenna waxay ka soo baxday dadaallo gargaar deegaan una soo baxday barnaamij dib-u-dejin iyo nolol-maalmeed oo qaab leh. (QORAAL DEMO AH)",
    "leadershipHeading": "Hoggaanka iyo Guddiga",
    "leadership": [
      {
        "name": "Amina Yusuf (MAGAC DEMO AH)",
        "role": "Agaasimaha Guud (DOORKA DEMO AH)",
        "bio": "Hoggaamiya istaraatiijiyadda hay'adda iyo iskaashiga bulshada. (SHARAXAAD DEMO AH)"
      },
      {
        "name": "Mohamed Ali (MAGAC DEMO AH)",
        "role": "Agaasimaha Barnaamijyada (DOORKA DEMO AH)",
        "bio": "Kormeeraya barnaamijyada dib-u-dejinta, hoyga, iyo nolol-maalmeedka. (SHARAXAAD DEMO AH)"
      },
      {
        "name": "Fadumo Hassan (MAGAC DEMO AH)",
        "role": "Guddoomiyaha Guddiga (DOORKA DEMO AH)",
        "bio": "Bixisa kormeerka maamulka iyo xisaabtan bixinta bulshada. (SHARAXAAD DEMO AH)"
      }
    ],
    "legalGovernanceHeading": "Diiwaangelinta Sharciga iyo Maamulka",
    "legalGovernanceBody": "Xaaladda diiwaangelinta: [LAMBARKA DIIWAANGELINTA WELI LAMA XAQIIJIN]. Waxaa maamula guddi aasaas ah oo mutadawiciin ah. (QORAAL DEMO AH)",
    "commitmentsHeading": "Ballanqaadyadeenna",
    "commitmentHumanitarianPrinciples": "Waxaan raacnaa Mabaadi'da Bini'aadmiga ee bini'aadannimada, dhexdhexaadnimada, cadaaladda, iyo madax-banaanida shaqadeenna oo dhan.",
    "commitmentCHS": "Waxaan u heellan nahay inaan buuxino Heerka Bini'aadmiga Dhexe (CHS) ee Tayada iyo Xisaabtan Bixinta.",
    "commitmentPSEA": "Waxaan haynaa siyaasad aan dulqaadan ka faa'iidaysiga iyo xadgudubka galmada (PSEA). Akhri buuggeenna",
    "commitmentDoNoHarm": "Waxaan raacnaa mabaadi'da Waxyeelo La'aanta waxaana helnaa ogolaansho la ogsoon yahay ka hor inaan wadaagno sheeko ama sawir kasta."
  },
  "programDetail": {
    "problemHeading": "Dhibaatada",
    "whatWeDoHeading": "Waxa Aan Qabano",
    "whereHeading": "Meesha Aan Ka Shaqeyno",
    "measurementHeading": "Sida Aan U Cabbirno",
    "storyHeading": "Sheeko Ka Mid Ah Shaqadeenna",
    "supportCta": "Taageer barnaamijkan"
  },
  "programsPage": {
    "heading": "Barnaamijyadeenna",
    "intro": "Afar barnaamij oo isku xiran ayaa ka caawiya qoysaska barakacay inay uga gudbaan xaalad degdeg ah una gudbaan xasilooni. (QORAAL DEMO AH)"
  },
  "whereWeWork": {
    "heading": "Meesha Aan Ka Shaqeyno",
    "intro": "Waxaan ka shaqeynaa laba gobol oo Soomaaliya ah: Hiiraan/Hirshabelle iyo Koonfur Galbeed. (QORAAL DEMO AH)",
    "regionLabels": {
      "districts": "Degmooyinka La Gaadhay",
      "office": "Xafiiskeenna",
      "whatWeRun": "Waxa Aan Ka Wadno Halkan",
      "coordination": "Kuwa Aan La Iskaashano"
    },
    "hiran": {
      "heading": "Hiiraan / Hirshabelle",
      "displacementContext": "Bishii Maajo 2023, Webiga Shabeelle ayaa ka buuxsamay Beledweyne, daadka ugu weyn 30 sano gudahood, taasoo saameysay ilaa 200,000 oo qof waxayna daadku qarqisay ilaa 79% oo magaalada ah — mid ka mid ah dhowr duufaan oo barakac ah oo ay keentay colaad iyo isbeddel cimileed. (Ilo: IOM, OCHA)",
      "districts": "Degmada Beledweyne. (qodob qaab dhismeed ah — degmooyin dheeraad ah waxaa lagu xaqiijin doonaa)",
      "office": "Beledweyne (goobta xafiiska waa qaab dhismeed loo qaatay; waxaa lagu xaqiijin doonaa)",
      "whatWeRun": "Barnaamijyada dib-u-dejinta, hoyga, iyo nolol-maalmeedka. (QORAAL DEMO AH)",
      "coordination": "[SHURACADA WELI LAMA XAQIIJIN]"
    },
    "southwest": {
      "heading": "Koonfur Galbeed",
      "displacementContext": "Koonfur Galbeed waxay soo martay barakac dib-u-soo-noqnoqda oo ay sababeen colaad iyo abaaro soo noqnoqda ee ka dhaca Koonfur-Dhexe ee Soomaaliya. (macluumaad guud oo la aqoonsaday; xogta dhacdada gaarka ah waa la sugayaa)",
      "districts": "Degmada Baydhabo. (qodob qaab dhismeed ah — degmooyin dheeraad ah waxaa lagu xaqiijin doonaa)",
      "office": "Baydhabo (goobta xafiiska waa qaab dhismeed loo qaatay; waxaa lagu xaqiijin doonaa)",
      "whatWeRun": "Barnaamijyada dib-u-dejinta, hoyga, iyo nolol-maalmeedka. (QORAAL DEMO AH)",
      "coordination": "[SHURACADA WELI LAMA XAQIIJIN]"
    }
  }
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 10: Commit**

```bash
git add content/en.json content/so.json content/news lib/content.test.ts
git commit -m "content: add Phase 5 news seed posts and impact/news copy"
```

---

## Task 3: Markdown pipeline (`lib/markdown.ts`)

**Files:**
- Create: `lib/markdown.ts`
- Create: `lib/markdown.test.ts`

**Interfaces:**
- Consumes: the four seed Markdown files from Task 2, `Lang` from `lib/i18n.ts`, `ProgramSlug` from `@/components/home/programs-data`.
- Produces: `NewsRegion` (`'hiran' | 'southwest' | 'both'`), `NewsPost` type (`{ slug, title, date, region, program, summary, image, alt, contentHtml }`), `ReportCategory` (`'annual-report' | 'financial-statement' | 'project-report'`), `Report` type (`{ slug, title, date, category, file }`), `getAllNewsPosts(lang: Lang): NewsPost[]`, `getNewsPost(lang: Lang, slug: string): NewsPost | null`, `getAllReports(lang: Lang): Report[]` — consumed by Tasks 4-13.

- [ ] **Step 1: Write the failing test**

```ts
// lib/markdown.test.ts
import { describe, it, expect } from 'vitest'
import { getAllNewsPosts, getNewsPost, getAllReports } from '@/lib/markdown'

describe('getAllNewsPosts', () => {
  it('returns both demo posts sorted newest first, with parsed front-matter and rendered HTML', () => {
    const posts = getAllNewsPosts('en')

    expect(posts).toHaveLength(2)
    expect(posts[0].slug).toBe('shelter-kits-arrive-in-beledweyne')
    expect(posts[0].title).toBe('Shelter kits arrive in Beledweyne (DEMO)')
    expect(posts[0].date).toBe('2026-06-01')
    expect(posts[0].region).toBe('hiran')
    expect(posts[0].program).toBe('shelter')
    expect(posts[0].image).toBeNull()
    expect(posts[0].contentHtml).toContain('<strong>demonstration article</strong>')

    expect(posts[1].slug).toBe('first-livelihoods-training-cohort')
    expect(posts[1].program).toBe('livelihoods')
  })

  it('returns Somali posts with the same slugs as English', () => {
    const enSlugs = getAllNewsPosts('en').map((post) => post.slug).sort()
    const soSlugs = getAllNewsPosts('so').map((post) => post.slug).sort()
    expect(soSlugs).toEqual(enSlugs)
  })
})

describe('getNewsPost', () => {
  it('returns the matching post by slug', () => {
    const post = getNewsPost('en', 'shelter-kits-arrive-in-beledweyne')
    expect(post?.title).toBe('Shelter kits arrive in Beledweyne (DEMO)')
  })

  it('returns null for an unknown slug', () => {
    expect(getNewsPost('en', 'does-not-exist')).toBeNull()
  })
})

describe('getAllReports', () => {
  it('returns an empty array when no reports have been supplied yet', () => {
    expect(getAllReports('en')).toEqual([])
    expect(getAllReports('so')).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/markdown.test.ts`
Expected: FAIL — `lib/markdown.ts` does not exist ("Failed to resolve import").

- [ ] **Step 3: Implement `lib/markdown.ts`**

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Lang } from './i18n'
import type { ProgramSlug } from '@/components/home/programs-data'

export type NewsRegion = 'hiran' | 'southwest' | 'both'

export type NewsPost = {
  slug: string
  title: string
  date: string
  region: NewsRegion
  program: ProgramSlug | null
  summary: string
  image: string | null
  alt: string | null
  contentHtml: string
}

export type ReportCategory = 'annual-report' | 'financial-statement' | 'project-report'

export type Report = {
  slug: string
  title: string
  date: string
  category: ReportCategory
  file: string
}

const NEWS_DIR = path.join(process.cwd(), 'content', 'news')
const REPORTS_DIR = path.join(process.cwd(), 'content', 'reports')

function readMarkdownFilenames(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((file) => file.endsWith('.md'))
}

export function getAllNewsPosts(lang: Lang): NewsPost[] {
  const dir = path.join(NEWS_DIR, lang)

  const posts = readMarkdownFilenames(dir).map((file) => {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      region: data.region as NewsRegion,
      program: (data.program as ProgramSlug | undefined) ?? null,
      summary: data.summary as string,
      image: (data.image as string | undefined) ?? null,
      alt: (data.alt as string | undefined) ?? null,
      contentHtml: marked(content, { async: false }),
    }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getNewsPost(lang: Lang, slug: string): NewsPost | null {
  return getAllNewsPosts(lang).find((post) => post.slug === slug) ?? null
}

export function getAllReports(lang: Lang): Report[] {
  const dir = path.join(REPORTS_DIR, lang)

  return readMarkdownFilenames(dir).map((file) => {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data } = matter(raw)

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      category: data.category as ReportCategory,
      file: data.file as string,
    }
  })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/markdown.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/markdown.ts lib/markdown.test.ts
git commit -m "feat: Markdown pipeline for news posts and reports"
```

---

## Task 4: NewsPostCard component

**Files:**
- Create: `components/news/NewsPostCard.tsx`
- Create: `components/news/NewsPostCard.test.tsx`

**Interfaces:**
- Consumes: `NewsPost` type from `@/lib/markdown` (Task 3), `Lang` from `@/lib/i18n`.
- Produces: `NewsPostCard({ lang: Lang, post: NewsPost })` React component, consumed by `NewsFilters` (Task 5).

- [ ] **Step 1: Write the failing test**

```tsx
// components/news/NewsPostCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewsPostCard } from '@/components/news/NewsPostCard'
import type { NewsPost } from '@/lib/markdown'

const basePost: NewsPost = {
  slug: 'shelter-kits-arrive-in-beledweyne',
  title: 'Shelter kits arrive in Beledweyne (DEMO)',
  date: '2026-06-01',
  region: 'hiran',
  program: 'shelter',
  summary: 'A demonstration post. (DEMO)',
  image: null,
  alt: null,
  contentHtml: '<p>Demo body.</p>',
}

describe('NewsPostCard', () => {
  it('renders the title as a link to the detail page, the date, and the summary', () => {
    render(<NewsPostCard lang="en" post={basePost} />)

    const link = screen.getByRole('link', { name: 'Shelter kits arrive in Beledweyne (DEMO)' })
    expect(link).toHaveAttribute('href', '/en/news/shelter-kits-arrive-in-beledweyne/')
    expect(screen.getByText('2026-06-01')).toBeInTheDocument()
    expect(screen.getByText('A demonstration post. (DEMO)')).toBeInTheDocument()
  })

  it('renders no image when the post has none', () => {
    render(<NewsPostCard lang="en" post={basePost} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders an image with meaningful alt text when the post has one', () => {
    const postWithImage: NewsPost = {
      ...basePost,
      image: '/images/demo-shelter-kits.jpg',
      alt: 'Volunteers unloading shelter kits from a truck (DEMO)',
    }
    render(<NewsPostCard lang="en" post={postWithImage} />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Volunteers unloading shelter kits from a truck (DEMO)')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/news/NewsPostCard.test.tsx`
Expected: FAIL — `components/news/NewsPostCard.tsx` does not exist.

- [ ] **Step 3: Implement `components/news/NewsPostCard.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Lang } from '@/lib/i18n'
import type { NewsPost } from '@/lib/markdown'

export function NewsPostCard({ lang, post }: { lang: Lang; post: NewsPost }) {
  return (
    <article className="border-b border-primary/10 py-4">
      {post.image ? (
        <Image
          src={post.image}
          alt={post.alt ?? post.title}
          width={400}
          height={225}
          className="mb-2 w-full rounded object-cover"
        />
      ) : null}
      <h3 className="font-display text-lg font-semibold">
        <Link href={`/${lang}/news/${post.slug}/`}>{post.title}</Link>
      </h3>
      <p className="text-xs text-ink/60">{post.date}</p>
      <p className="mt-2 text-sm">{post.summary}</p>
    </article>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/news/NewsPostCard.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add components/news/NewsPostCard.tsx components/news/NewsPostCard.test.tsx
git commit -m "feat: news post card component"
```

---

## Task 5: NewsFilters component

**Files:**
- Create: `components/news/NewsFilters.tsx`
- Create: `components/news/NewsFilters.test.tsx`

**Interfaces:**
- Consumes: `getContent` from `@/lib/content`, `NewsPost`/`NewsRegion` from `@/lib/markdown` (Task 3), `PROGRAM_SLUGS`/`ProgramSlug` from `@/components/home/programs-data`, `NewsPostCard` (Task 4).
- Produces: `NewsFilters({ lang: Lang, posts: NewsPost[] })` client component, consumed by the news list page (Task 6).

- [ ] **Step 1: Write the failing test**

```tsx
// components/news/NewsFilters.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NewsFilters } from '@/components/news/NewsFilters'
import type { NewsPost } from '@/lib/markdown'

const posts: NewsPost[] = [
  {
    slug: 'shelter-kits-arrive-in-beledweyne',
    title: 'Shelter kits arrive in Beledweyne (DEMO)',
    date: '2026-06-01',
    region: 'hiran',
    program: 'shelter',
    summary: 'A demonstration post. (DEMO)',
    image: null,
    alt: null,
    contentHtml: '<p>Demo body.</p>',
  },
  {
    slug: 'first-livelihoods-training-cohort',
    title: 'First livelihoods training cohort completes course (DEMO)',
    date: '2026-05-15',
    region: 'southwest',
    program: 'livelihoods',
    summary: 'A demonstration post. (DEMO)',
    image: null,
    alt: null,
    contentHtml: '<p>Demo body.</p>',
  },
]

describe('NewsFilters', () => {
  it('shows all posts by default, then filters by region and by program', () => {
    render(<NewsFilters lang="en" posts={posts} />)

    expect(screen.getByText('Shelter kits arrive in Beledweyne (DEMO)')).toBeInTheDocument()
    expect(
      screen.getByText('First livelihoods training cohort completes course (DEMO)')
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'hiran' } })
    expect(screen.getByText('Shelter kits arrive in Beledweyne (DEMO)')).toBeInTheDocument()
    expect(
      screen.queryByText('First livelihoods training cohort completes course (DEMO)')
    ).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'all' } })
    fireEvent.change(screen.getByLabelText('Program'), { target: { value: 'livelihoods' } })
    expect(
      screen.getByText('First livelihoods training cohort completes course (DEMO)')
    ).toBeInTheDocument()
    expect(screen.queryByText('Shelter kits arrive in Beledweyne (DEMO)')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/news/NewsFilters.test.tsx`
Expected: FAIL — `components/news/NewsFilters.tsx` does not exist.

- [ ] **Step 3: Implement `components/news/NewsFilters.tsx`**

```tsx
'use client'

import { useMemo, useState } from 'react'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import type { NewsPost, NewsRegion } from '@/lib/markdown'
import { PROGRAM_SLUGS, type ProgramSlug } from '@/components/home/programs-data'
import { NewsPostCard } from './NewsPostCard'

const REGIONS: NewsRegion[] = ['hiran', 'southwest', 'both']

export function NewsFilters({ lang, posts }: { lang: Lang; posts: NewsPost[] }) {
  const content = getContent(lang)
  const [region, setRegion] = useState<NewsRegion | 'all'>('all')
  const [program, setProgram] = useState<ProgramSlug | 'all'>('all')

  function regionLabel(value: NewsRegion): string {
    if (value === 'hiran') return content.home.mapRegionHiran
    if (value === 'southwest') return content.home.mapRegionSouthwest
    return content.news.regionBoth
  }

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const regionMatches = region === 'all' || post.region === region
        const programMatches = program === 'all' || post.program === program
        return regionMatches && programMatches
      }),
    [posts, region, program]
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <label className="text-sm">
          {content.news.filterRegionLabel}
          <select
            className="ml-2 border border-primary/20 p-1"
            value={region}
            onChange={(event) => setRegion(event.target.value as NewsRegion | 'all')}
          >
            <option value="all">{content.news.filterAllLabel}</option>
            {REGIONS.map((value) => (
              <option key={value} value={value}>
                {regionLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          {content.news.filterProgramLabel}
          <select
            className="ml-2 border border-primary/20 p-1"
            value={program}
            onChange={(event) => setProgram(event.target.value as ProgramSlug | 'all')}
          >
            <option value="all">{content.news.filterAllLabel}</option>
            {PROGRAM_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {content.programs[slug].title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        {filtered.map((post) => (
          <NewsPostCard key={post.slug} lang={lang} post={post} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/news/NewsFilters.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/news/NewsFilters.tsx components/news/NewsFilters.test.tsx
git commit -m "feat: news region/program filter component"
```

---

## Task 6: News list page

**Files:**
- Create: `app/[lang]/news/page.tsx`
- Create: `app/[lang]/news/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).news.pageHeading` (Task 2), `getAllNewsPosts` from `@/lib/markdown` (Task 3), `NewsFilters` (Task 5), `LANGS`/`Lang` from `@/lib/i18n`.
- Produces: the `/​{lang}​/news/` route.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/news/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewsPage from '@/app/[lang]/news/page'

describe('NewsPage', () => {
  it('renders the page heading and both demo posts unfiltered', () => {
    render(<NewsPage params={{ lang: 'en' }} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('News & Stories')
    expect(screen.getByText('Shelter kits arrive in Beledweyne (DEMO)')).toBeInTheDocument()
    expect(
      screen.getByText('First livelihoods training cohort completes course (DEMO)')
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<NewsPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/news/page.test.tsx"`
Expected: FAIL — `app/[lang]/news/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/news/page.tsx`**

```tsx
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllNewsPosts } from '@/lib/markdown'
import { NewsFilters } from '@/components/news/NewsFilters'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function NewsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const posts = getAllNewsPosts(lang)

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{content.news.pageHeading}</h1>
      <NewsFilters lang={lang} posts={posts} />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/news/page.test.tsx"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/news/page.tsx" "app/[lang]/news/page.test.tsx"
git commit -m "feat: news list page"
```

---

## Task 7: ConsentNotice component

**Files:**
- Create: `components/news/ConsentNotice.tsx`
- Create: `components/news/ConsentNotice.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).news.consentNotice` (Task 2).
- Produces: `ConsentNotice({ lang: Lang })` component, consumed by the news detail page (Task 8).

- [ ] **Step 1: Write the failing test**

```tsx
// components/news/ConsentNotice.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConsentNotice } from '@/components/news/ConsentNotice'

describe('ConsentNotice', () => {
  it('renders the fixed consent statement', () => {
    render(<ConsentNotice lang="en" />)
    expect(
      screen.getByText(
        "Names in personal stories may be changed to protect identity, and are shared only with the individual's informed consent."
      )
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/news/ConsentNotice.test.tsx`
Expected: FAIL — `components/news/ConsentNotice.tsx` does not exist.

- [ ] **Step 3: Implement `components/news/ConsentNotice.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function ConsentNotice({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  return <p className="mt-6 text-xs text-ink/60">{content.news.consentNotice}</p>
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/news/ConsentNotice.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/news/ConsentNotice.tsx components/news/ConsentNotice.test.tsx
git commit -m "feat: consent notice component for news detail pages"
```

---

## Task 8: News detail page

**Files:**
- Create: `app/[lang]/news/[slug]/page.tsx`
- Create: `app/[lang]/news/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `getAllNewsPosts`/`getNewsPost` from `@/lib/markdown` (Task 3), `getContent` from `@/lib/content`, `ConsentNotice` (Task 7), `LANGS`/`Lang` from `@/lib/i18n`.
- Produces: the `/​{lang}​/news/​{slug}​/` route, statically generated for every post returned by `getAllNewsPosts(lang)` in each language.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/news/[slug]/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewsPostPage from '@/app/[lang]/news/[slug]/page'

describe('NewsPostPage', () => {
  it('renders the post title, date, rendered Markdown body, and consent notice', () => {
    const { container } = render(
      <NewsPostPage params={{ lang: 'en', slug: 'shelter-kits-arrive-in-beledweyne' }} />
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Shelter kits arrive in Beledweyne (DEMO)'
    )
    expect(screen.getByText('2026-06-01')).toBeInTheDocument()
    expect(container.querySelector('strong')).toHaveTextContent('demonstration article')
    expect(
      screen.getByText(
        "Names in personal stories may be changed to protect identity, and are shared only with the individual's informed consent."
      )
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<NewsPostPage params={{ lang: 'so', slug: 'shelter-kits-arrive-in-beledweyne' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/news/[slug]/page.test.tsx"`
Expected: FAIL — `app/[lang]/news/[slug]/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/news/[slug]/page.tsx`**

```tsx
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllNewsPosts, getNewsPost } from '@/lib/markdown'
import { getContent } from '@/lib/content'
import { ConsentNotice } from '@/components/news/ConsentNotice'

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    getAllNewsPosts(lang).map((post) => ({ lang, slug: post.slug }))
  )
}

export default function NewsPostPage({
  params,
}: {
  params: { lang: Lang; slug: string }
}) {
  const { lang, slug } = params
  const post = getNewsPost(lang, slug)
  const content = getContent(lang)

  if (!post) {
    return null
  }

  const regionLabel =
    post.region === 'hiran'
      ? content.home.mapRegionHiran
      : post.region === 'southwest'
        ? content.home.mapRegionSouthwest
        : content.news.regionBoth

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{post.title}</h1>
      <p className="text-xs text-ink/60">{post.date}</p>
      <p className="mt-1 text-sm">
        {regionLabel}
        {post.program ? ` · ${content.programs[post.program].title}` : ''}
      </p>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <ConsentNotice lang={lang} />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/news/[slug]/page.test.tsx"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/news/[slug]/page.tsx" "app/[lang]/news/[slug]/page.test.tsx"
git commit -m "feat: news detail page"
```

---

## Task 9: ImpactResultsTable component

**Files:**
- Create: `components/impact/ImpactResultsTable.tsx`
- Create: `components/impact/ImpactResultsTable.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).impact.*` (Task 2).
- Produces: `ImpactResultsTable({ lang: Lang, regionLabel: string })` component, consumed by the Impact page (Task 13).

- [ ] **Step 1: Write the failing test**

```tsx
// components/impact/ImpactResultsTable.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImpactResultsTable } from '@/components/impact/ImpactResultsTable'

describe('ImpactResultsTable', () => {
  it('renders the region label as a caption, year column headers, metric row headers, and placeholder cells', () => {
    render(<ImpactResultsTable lang="en" regionLabel="Hiran / Hirshabelle" />)

    expect(screen.getByText('Hiran / Hirshabelle')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'This Year' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Last Year' })).toBeInTheDocument()

    expect(screen.getByRole('rowheader', { name: 'households supported' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'shelter kits distributed' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'livelihoods trainings completed' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'districts reached' })).toBeInTheDocument()

    expect(screen.getAllByText('[NUMBER TO BE CONFIRMED]')).toHaveLength(8)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/impact/ImpactResultsTable.test.tsx`
Expected: FAIL — `components/impact/ImpactResultsTable.tsx` does not exist.

- [ ] **Step 3: Implement `components/impact/ImpactResultsTable.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

const METRIC_KEYS = [
  'householdsSupported',
  'shelterKits',
  'livelihoodsTrainings',
  'districtsReached',
] as const

export function ImpactResultsTable({ lang, regionLabel }: { lang: Lang; regionLabel: string }) {
  const content = getContent(lang)

  return (
    <table className="mt-4 w-full text-sm">
      <caption className="mb-2 text-left font-display font-semibold">{regionLabel}</caption>
      <thead>
        <tr>
          <th className="text-left" scope="col"></th>
          <th className="text-left" scope="col">
            {content.impact.resultsThisYearLabel}
          </th>
          <th className="text-left" scope="col">
            {content.impact.resultsLastYearLabel}
          </th>
        </tr>
      </thead>
      <tbody>
        {METRIC_KEYS.map((key) => (
          <tr key={key}>
            <th className="text-left font-normal" scope="row">
              {content.impact[key]}
            </th>
            <td>{content.impact.figurePlaceholder}</td>
            <td>{content.impact.figurePlaceholder}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/impact/ImpactResultsTable.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/impact/ImpactResultsTable.tsx components/impact/ImpactResultsTable.test.tsx
git commit -m "feat: impact results table component"
```

---

## Task 10: FundsUseBar component

**Files:**
- Create: `components/impact/FundsUseBar.tsx`
- Create: `components/impact/FundsUseBar.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).impact.*` (Task 2).
- Produces: `FundsUseBar({ lang: Lang })` component, consumed by the Impact page (Task 13).

- [ ] **Step 1: Write the failing test**

```tsx
// components/impact/FundsUseBar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FundsUseBar } from '@/components/impact/FundsUseBar'

describe('FundsUseBar', () => {
  it('renders three equal-width segments with labels and the honest percentage placeholder', () => {
    render(<FundsUseBar lang="en" />)

    expect(screen.getByText('Program')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Fundraising')).toBeInTheDocument()
    expect(screen.getAllByText('[PERCENTAGE TO BE CONFIRMED]')).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/impact/FundsUseBar.test.tsx`
Expected: FAIL — `components/impact/FundsUseBar.tsx` does not exist.

- [ ] **Step 3: Implement `components/impact/FundsUseBar.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function FundsUseBar({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  const segments = [
    { label: content.impact.fundsUseProgramLabel, color: 'bg-secondary' },
    { label: content.impact.fundsUseAdminLabel, color: 'bg-primary' },
    { label: content.impact.fundsUseFundraisingLabel, color: 'bg-accent' },
  ]

  return (
    <div className="mt-4 flex overflow-hidden rounded">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className={`flex-1 p-3 text-center text-xs text-paper ${segment.color}`}
        >
          <p className="font-semibold">{segment.label}</p>
          <p>{content.impact.percentagePlaceholder}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/impact/FundsUseBar.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/impact/FundsUseBar.tsx components/impact/FundsUseBar.test.tsx
git commit -m "feat: funds-use bar component"
```

---

## Task 11: ComplaintsBlock component

**Files:**
- Create: `components/impact/ComplaintsBlock.tsx`
- Create: `components/impact/ComplaintsBlock.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).impact.*` (Task 2).
- Produces: `ComplaintsBlock({ lang: Lang })` component, consumed by the Impact page (Task 13).

- [ ] **Step 1: Write the failing test**

```tsx
// components/impact/ComplaintsBlock.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComplaintsBlock } from '@/components/impact/ComplaintsBlock'

describe('ComplaintsBlock', () => {
  it('renders the anonymous-reporting statement and all three contact placeholders', () => {
    render(<ComplaintsBlock lang="en" />)

    expect(screen.getByText(/Reports can be made anonymously/)).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('[PHONE NUMBER TO BE CONFIRMED]')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('[WHATSAPP NUMBER TO BE CONFIRMED]')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('[EMAIL TO BE CONFIRMED]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/impact/ComplaintsBlock.test.tsx`
Expected: FAIL — `components/impact/ComplaintsBlock.tsx` does not exist.

- [ ] **Step 3: Implement `components/impact/ComplaintsBlock.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function ComplaintsBlock({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <div className="mt-4 text-sm">
      <p>{content.impact.complaintsIntro}</p>
      <dl className="mt-4 space-y-2">
        <div>
          <dt className="font-semibold">{content.impact.complaintsPhoneLabel}</dt>
          <dd>{content.impact.complaintsPhone}</dd>
        </div>
        <div>
          <dt className="font-semibold">{content.impact.complaintsWhatsappLabel}</dt>
          <dd>{content.impact.complaintsWhatsapp}</dd>
        </div>
        <div>
          <dt className="font-semibold">{content.impact.complaintsEmailLabel}</dt>
          <dd>{content.impact.complaintsEmail}</dd>
        </div>
      </dl>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/impact/ComplaintsBlock.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/impact/ComplaintsBlock.tsx components/impact/ComplaintsBlock.test.tsx
git commit -m "feat: complaints and feedback block component"
```

---

## Task 12: ReportsSection component

**Files:**
- Create: `components/impact/ReportsSection.tsx`
- Create: `components/impact/ReportsSection.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).impact.reportsEmptyState` (Task 2), `Report` type from `@/lib/markdown` (Task 3).
- Produces: `ReportsSection({ lang: Lang, reports: Report[] })` component, consumed by the Impact page (Task 13).

- [ ] **Step 1: Write the failing test**

```tsx
// components/impact/ReportsSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReportsSection } from '@/components/impact/ReportsSection'
import type { Report } from '@/lib/markdown'

describe('ReportsSection', () => {
  it('renders the honest empty state when there are no reports', () => {
    render(<ReportsSection lang="en" reports={[]} />)
    expect(
      screen.getByText('Our first annual report will be published here in [YEAR TO BE CONFIRMED].')
    ).toBeInTheDocument()
  })

  it('renders a download link per report when reports exist', () => {
    const reports: Report[] = [
      {
        slug: 'annual-report-2026',
        title: 'Annual Report 2026',
        date: '2026-12-31',
        category: 'annual-report',
        file: '/reports/annual-report-2026.pdf',
      },
    ]
    render(<ReportsSection lang="en" reports={reports} />)

    const link = screen.getByRole('link', { name: 'Annual Report 2026' })
    expect(link).toHaveAttribute('href', '/reports/annual-report-2026.pdf')
    expect(
      screen.queryByText('Our first annual report will be published here in [YEAR TO BE CONFIRMED].')
    ).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/impact/ReportsSection.test.tsx`
Expected: FAIL — `components/impact/ReportsSection.tsx` does not exist.

- [ ] **Step 3: Implement `components/impact/ReportsSection.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import type { Report } from '@/lib/markdown'

export function ReportsSection({ lang, reports }: { lang: Lang; reports: Report[] }) {
  const content = getContent(lang)

  if (reports.length === 0) {
    return <p className="mt-4 text-sm">{content.impact.reportsEmptyState}</p>
  }

  return (
    <ul className="mt-4 space-y-2 text-sm">
      {reports.map((report) => (
        <li key={report.slug}>
          <a href={report.file}>{report.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/impact/ReportsSection.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add components/impact/ReportsSection.tsx components/impact/ReportsSection.test.tsx
git commit -m "feat: reports section component"
```

---

## Task 13: Impact & Accountability page

**Files:**
- Create: `app/[lang]/impact/page.tsx`
- Create: `app/[lang]/impact/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).impact.*` (Task 2), `getAllReports` from `@/lib/markdown` (Task 3), `ImpactResultsTable` (Task 9), `FundsUseBar` (Task 10), `ComplaintsBlock` (Task 11), `ReportsSection` (Task 12), `LANGS`/`Lang` from `@/lib/i18n`.
- Produces: the `/​{lang}​/impact/` route — no other task touches this file.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/impact/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImpactPage from '@/app/[lang]/impact/page'

describe('ImpactPage', () => {
  it('renders every section heading in order, both results tables, and the reports empty state', () => {
    render(<ImpactPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Impact & Accountability',
      'Results by Year and Region',
      'How Our Funds Are Used',
      'Complaints & Feedback',
      'Reports',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Hiran / Hirshabelle')).toBeInTheDocument()
    expect(screen.getByText('Southwest State')).toBeInTheDocument()
    expect(
      screen.getByText('Our first annual report will be published here in [YEAR TO BE CONFIRMED].')
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<ImpactPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/impact/page.test.tsx"`
Expected: FAIL — `app/[lang]/impact/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/impact/page.tsx`**

```tsx
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllReports } from '@/lib/markdown'
import { ImpactResultsTable } from '@/components/impact/ImpactResultsTable'
import { FundsUseBar } from '@/components/impact/FundsUseBar'
import { ComplaintsBlock } from '@/components/impact/ComplaintsBlock'
import { ReportsSection } from '@/components/impact/ReportsSection'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function ImpactPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const reports = getAllReports(lang)

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{content.impact.pageHeading}</h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.resultsHeading}</h2>
        <ImpactResultsTable lang={lang} regionLabel={content.home.mapRegionHiran} />
        <ImpactResultsTable lang={lang} regionLabel={content.home.mapRegionSouthwest} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.fundsUseHeading}</h2>
        <FundsUseBar lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.complaintsHeading}</h2>
        <ComplaintsBlock lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.reportsHeading}</h2>
        <ReportsSection lang={lang} reports={reports} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/impact/page.test.tsx"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/impact/page.tsx" "app/[lang]/impact/page.test.tsx"
git commit -m "feat: compose Impact & Accountability page"
```

---

## Task 14: Final verification and launch checklist

**Files:**
- Modify: `CHECKLIST-BEFORE-LAUNCH.md`

**Interfaces:**
- Consumes: nothing new — this is a verification and documentation pass over Tasks 1-13.
- Produces: updated `CHECKLIST-BEFORE-LAUNCH.md`.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — every test from Phases 2-4 plus this phase's new tests, 0 failures.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Build the static export and verify output**

Run: `npm run build`
Expected: exits 0. Confirms these files exist and are non-empty: `out/en/news/index.html`, `out/so/news/index.html`, `out/en/news/shelter-kits-arrive-in-beledweyne/index.html`, `out/en/news/first-livelihoods-training-cohort/index.html`, and the Somali equivalents, plus `out/en/impact/index.html` and `out/so/impact/index.html`.

- [ ] **Step 4: Verify the demo posts and consent notice render in the static output**

Run: `grep -o "Shelter kits arrive in Beledweyne" out/en/news/index.html`
Expected: found.

Run: `grep -o "informed consent" "out/en/news/shelter-kits-arrive-in-beledweyne/index.html"`
Expected: found — confirms the consent notice renders on every generated post page, not just in tests.

- [ ] **Step 5: Extend `CHECKLIST-BEFORE-LAUNCH.md`**

Add a new section (keep everything already in the file — do not delete prior phases' entries):

```markdown

## Phase 5 (Impact & Accountability, News, Reports) — what's real vs. placeholder right now

- Both news posts are fictional demo content, clearly tagged `(DEMO)`/`(QORAAL DEMO AH)` — remove or replace once real news exists. The consent-notice line itself is real, mandated policy text (not a placeholder) and renders on every post regardless of whether the post is real or demo.
- Impact results-table figures (all 8 cells per region) are placeholders (`[NUMBER TO BE CONFIRMED]`) — no year, region-specific figures have been supplied yet.
- The funds-use bar's three percentages are placeholders (`[PERCENTAGE TO BE CONFIRMED]`) — never invent a plausible-looking split; replace only with real, sourced percentages.
- Complaints/feedback phone, WhatsApp, and email are honest placeholders pending Section 0 facts.
- The Reports section is an honest empty state (`content/reports/{lang}/` is intentionally empty) — no demo PDF was fabricated, per the master prompt's explicit instruction. Populate `content/reports/{lang}/*.md` and the corresponding files under `public/reports/` once real PDFs are supplied.
- Both demo news posts omit `image`/`alt` front-matter (no image renders) — this is intentional (no fabricated photo), not a bug; the pipeline supports real images with meaningful alt text once supplied.
```

- [ ] **Step 6: Commit**

```bash
git add CHECKLIST-BEFORE-LAUNCH.md
git commit -m "docs: extend launch checklist with Phase 5 placeholders"
```

- [ ] **Step 7: Report to the user in plain language**

Summarize: the site now has a working Markdown news pipeline (two demo-tagged example articles, filterable by region and program, each with a guaranteed consent notice), and a full Impact & Accountability page (a results table per region with honest placeholder figures, a funds-use bar with honest placeholder percentages, a complaints/feedback block with placeholder contact details and a real anonymous-reporting policy statement, and a Reports section that's an honest empty state since no real PDFs exist yet). Nothing is deployed yet (Phase 8). The only thing the user needs to do: nothing yet — real news articles, impact figures, funds-use percentages, contact details, and report PDFs get filled in as the checklist and later phases progress.
