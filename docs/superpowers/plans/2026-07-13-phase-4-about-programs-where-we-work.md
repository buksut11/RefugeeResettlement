# Phase 4 — About, Programs, Where We Work Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build seven new pages — About, Programs index, four program sub-pages, and Where We Work — completing master prompt Sections 4.2, 4.3, and 4.4, per the approved Phase 4 design spec.

**Architecture:** Same static-export Next.js App Router pattern as Phases 2–3: each route gets its own `generateStaticParams`, all copy flows through the existing `getContent(lang)`, and new presentational components live under `components/about/`, `components/programs/`, and `components/where-we-work/`. No new dependencies.

**Tech Stack:** Unchanged from Phase 2/3 — Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, Vitest + React Testing Library.

## Global Constraints

- Colour tokens (unchanged): Primary `#14355C`, Secondary `#2F6B4F`, Accent `#B5651D`, Ink `#201D1B`, Paper `#F7F5F0`.
- Trailing-slash URL convention continues: every internal `href` ends in `/`.
- English is default language; every new Somali string is a first-pass demo translation, not yet reviewed by a native speaker — same as existing `so.json` content.
- Demo/invented content (leadership bios, program stories, values, narrative body text) is tagged inline `(DEMO)` / `(QORAAL DEMO AH)` / `(DEMO STORY)` / `(DEMO NAME)` / `(DEMO ROLE)` / `(DEMO BIO)` exactly as established in Phases 2–3 — never presented as final.
- **Exception:** coordination partners are never demo-tagged with an invented organization name. They render the honest literal placeholder `[COORDINATION PARTNERS TO BE CONFIRMED]` (Somali: `[LAMBARKA IYO SHURACADA WELI LAMA XAQIIJIN]` is wrong — use `[SHURACADA WELI LAMA XAQIIJIN]`) — inventing a real humanitarian organization's name as a "partner" is a materially different risk than a fictional demo story.
- Registration number is an unconfirmed Section 0 fact — renders the literal placeholder `[REGISTRATION NUMBER TO BE CONFIRMED]` / `[LAMBARKA DIIWAANGELINTA WELI LAMA XAQIIJIN]`.
- The 2023 Shabelle river flooding claim on the Where We Work page is **verified, sourced content, not a placeholder** — do not demo-tag it, do not alter the figures without re-verifying. Sources: IOM Storyteller, OCHA/ReliefWeb Somalia flood situation reports, FAO.
- Never invent a number without the literal `[NUMBER TO BE CONFIRMED]` placeholder pattern already established (this phase introduces no new numeric statistics, so this mostly doesn't apply, but the flooding figures above are the one exception — they are cited real-world figures, not invented).
- Accessibility baseline continues: exactly one `h1` per page, semantic heading order, all interactive elements are real focusable `<a>`/`next/link` elements.
- Never leave a `TODO` in code.
- The About page's PSEA commitment links to `/{lang}/safeguarding/`, which doesn't exist until Phase 7 — expected mid-build, not a defect, same pattern as Phase 3's forward-links to `/donate/` and `/programs/`.

---

## File Structure

```
content/
  en.json                                    # extended: about.*, programDetail.*, programs.{slug} extended, programsPage.*, whereWeWork.*
  so.json                                    # same new keys, demo Somali content
lib/
  content.test.ts                            # extended with assertions for the new keys
components/
  about/
    Leadership.tsx
    Leadership.test.tsx
    CommitmentsBlock.tsx
    CommitmentsBlock.test.tsx
  programs/
    StoryBlock.tsx
    StoryBlock.test.tsx
    ProgramDetail.tsx
    ProgramDetail.test.tsx
  where-we-work/
    RegionBlock.tsx
    RegionBlock.test.tsx
app/
  [lang]/
    about/
      page.tsx
      page.test.tsx
    programs/
      page.tsx
      page.test.tsx
      [slug]/
        page.tsx
        page.test.tsx
    where-we-work/
      page.tsx
      page.test.tsx
CHECKLIST-BEFORE-LAUNCH.md                   # extended with Phase 4 placeholders
```

---

## Task 1: Content additions

**Files:**
- Modify: `content/en.json`
- Modify: `content/so.json`
- Modify: `lib/content.test.ts`

**Interfaces:**
- Consumes: existing `getContent(lang)` from `lib/content.ts` (unchanged).
- Produces: new content keys `about.*`, `programDetail.*`, extended `programs.{slug}.*` (adds `problem`, `whatWeDo`, `whereText`, `measurement`, `story`, `storyAttribution`), `programsPage.*`, `whereWeWork.*` — consumed by Tasks 2–10's components and pages.

- [ ] **Step 1: Write the failing test additions to `lib/content.test.ts`**

Replace the file's full contents with:

```ts
import { describe, it, expect } from 'vitest'
import { getContent } from '@/lib/content'

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

  it('includes Phase 3 homepage content keys', () => {
    const content = getContent('en')
    expect(content.home.whereWeWorkHeading).toBe('Where We Work')
    expect(content.home.whatWeDoHeading).toBe('What We Do')
    expect(content.home.impactHeading).toBe('Impact')
    expect(content.home.newsHeading).toBe('Latest News')
    expect(content.programs.resettlement.title).toBe('Resettlement & Durable Solutions')
    expect(content.impact.figurePlaceholder).toBe('[NUMBER TO BE CONFIRMED]')
  })

  it('includes Phase 4 About page content keys', () => {
    const content = getContent('en')
    expect(content.about.heading).toBe('About Us')
    expect(content.about.values).toHaveLength(4)
    expect(content.about.leadership).toHaveLength(3)
    expect(content.about.leadership[0].name).toBe('Amina Yusuf (DEMO NAME)')
    expect(content.about.commitmentPSEA).toContain('zero-tolerance')
  })

  it('includes Phase 4 extended program detail keys for all four programs', () => {
    const content = getContent('en')
    for (const slug of ['resettlement', 'shelter', 'livelihoods', 'protection'] as const) {
      expect(content.programs[slug].problem.length).toBeGreaterThan(0)
      expect(content.programs[slug].whatWeDo.length).toBeGreaterThan(0)
      expect(content.programs[slug].story.length).toBeGreaterThan(0)
      expect(content.programs[slug].storyAttribution.length).toBeGreaterThan(0)
    }
    expect(content.programDetail.problemHeading).toBe('The Problem')
    expect(content.programDetail.supportCta).toBe('Support this program')
  })

  it('includes Phase 4 Where We Work content keys with region anchors data', () => {
    const content = getContent('en')
    expect(content.whereWeWork.heading).toBe('Where We Work')
    expect(content.whereWeWork.hiran.heading).toBe('Hiran / Hirshabelle')
    expect(content.whereWeWork.hiran.coordination).toBe('[COORDINATION PARTNERS TO BE CONFIRMED]')
    expect(content.whereWeWork.southwest.heading).toBe('Southwest State')
    expect(content.whereWeWork.regionLabels.districts).toBe('Districts Covered')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/content.test.ts`
Expected: FAIL on the four new tests — `content.about`, `content.programDetail`, `content.programs.*.problem`, and `content.whereWeWork` are all `undefined`.

- [ ] **Step 3: Replace `content/en.json` with the full extended content**

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
    "figurePlaceholder": "[NUMBER TO BE CONFIRMED]"
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

- [ ] **Step 4: Replace `content/so.json` with the full extended content**

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
    "figurePlaceholder": "[LAMBARKA WELI LAMA XAQIIJIN]"
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

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 6: Commit**

```bash
git add content/en.json content/so.json lib/content.test.ts
git commit -m "content: add Phase 4 About, program detail, and Where We Work copy"
```

---

## Task 2: Leadership component

**Files:**
- Create: `components/about/Leadership.tsx`
- Create: `components/about/Leadership.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).about.leadership` (Task 1).
- Produces: `Leadership({ lang: Lang })` React component, consumed by the About page (Task 4).

- [ ] **Step 1: Write the failing test**

```tsx
// components/about/Leadership.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Leadership } from '@/components/about/Leadership'

describe('Leadership', () => {
  it('renders every board member name, role, and bio', () => {
    render(<Leadership lang="en" />)

    expect(screen.getByText('Amina Yusuf (DEMO NAME)')).toBeInTheDocument()
    expect(screen.getByText('Executive Director (DEMO ROLE)')).toBeInTheDocument()
    expect(
      screen.getByText("Leads the organization's strategy and community partnerships. (DEMO BIO)")
    ).toBeInTheDocument()

    expect(screen.getByText('Mohamed Ali (DEMO NAME)')).toBeInTheDocument()
    expect(screen.getByText('Fadumo Hassan (DEMO NAME)')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/about/Leadership.test.tsx`
Expected: FAIL — `components/about/Leadership.tsx` does not exist.

- [ ] **Step 3: Implement `components/about/Leadership.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function Leadership({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {content.about.leadership.map((person) => (
        <div key={person.name} className="rounded border border-primary/20 p-4">
          <div className="mb-3 flex h-32 items-center justify-center rounded bg-primary/10 text-xs text-ink">
            Photo placeholder
          </div>
          <p className="font-display font-semibold">{person.name}</p>
          <p className="text-sm text-ink/70">{person.role}</p>
          <p className="mt-2 text-sm">{person.bio}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/about/Leadership.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/about/Leadership.tsx components/about/Leadership.test.tsx
git commit -m "feat: leadership component for About page"
```

---

## Task 3: CommitmentsBlock component

**Files:**
- Create: `components/about/CommitmentsBlock.tsx`
- Create: `components/about/CommitmentsBlock.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).about.commitment*` and `getContent(lang).footer.safeguarding` (Task 1, Phase 2).
- Produces: `CommitmentsBlock({ lang: Lang })` React component, consumed by the About page (Task 4).

- [ ] **Step 1: Write the failing test**

```tsx
// components/about/CommitmentsBlock.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommitmentsBlock } from '@/components/about/CommitmentsBlock'

describe('CommitmentsBlock', () => {
  it('renders all four commitment statements and links PSEA to the safeguarding page', () => {
    const { container } = render(<CommitmentsBlock lang="en" />)

    expect(
      screen.getByText(/Humanitarian Principles of humanity, neutrality, impartiality/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Core Humanitarian Standard \(CHS\)/)).toBeInTheDocument()
    expect(screen.getByText(/Do No Harm principles/)).toBeInTheDocument()

    // The PSEA statement's paragraph contains a nested <Link>, so its text is
    // split across elements — check the paragraph's full text directly
    // rather than relying on getByText's single-node matching.
    expect(container.textContent).toMatch(/zero-tolerance policy on sexual exploitation/)

    const link = screen.getByRole('link', { name: 'Safeguarding & PSEA' })
    expect(link).toHaveAttribute('href', '/en/safeguarding/')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/about/CommitmentsBlock.test.tsx`
Expected: FAIL — `components/about/CommitmentsBlock.tsx` does not exist.

- [ ] **Step 3: Implement `components/about/CommitmentsBlock.tsx`**

```tsx
import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function CommitmentsBlock({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <div className="mt-4 space-y-3 text-sm">
      <p>{content.about.commitmentHumanitarianPrinciples}</p>
      <p>{content.about.commitmentCHS}</p>
      <p>
        {content.about.commitmentPSEA}{' '}
        <Link href={`/${lang}/safeguarding/`} className="underline">
          {content.footer.safeguarding}
        </Link>
        .
      </p>
      <p>{content.about.commitmentDoNoHarm}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/about/CommitmentsBlock.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/about/CommitmentsBlock.tsx components/about/CommitmentsBlock.test.tsx
git commit -m "feat: commitments block component for About page"
```

---

## Task 4: About page

**Files:**
- Create: `app/[lang]/about/page.tsx`
- Create: `app/[lang]/about/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).about.*` (Task 1), `Leadership` (Task 2), `CommitmentsBlock` (Task 3), `LANGS`/`Lang` (Phase 2).
- Produces: the `/​{lang}​/about/` route — no other task touches this file.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/about/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/[lang]/about/page'

describe('AboutPage', () => {
  it('renders every section heading in order and the leadership/commitments content', () => {
    render(<AboutPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'About Us',
      'Who We Are',
      'Mission',
      'Vision',
      'Values',
      'Our Story',
      'Leadership & Board',
      'Legal Registration & Governance',
      'Our Commitments',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About Us')
    expect(screen.getByText('Dignity (DEMO)')).toBeInTheDocument()
    expect(screen.getByText('Amina Yusuf (DEMO NAME)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Safeguarding & PSEA' })).toHaveAttribute(
      'href',
      '/en/safeguarding/'
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/about/page.test.tsx"`
Expected: FAIL — `app/[lang]/about/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/about/page.tsx`**

```tsx
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { Leadership } from '@/components/about/Leadership'
import { CommitmentsBlock } from '@/components/about/CommitmentsBlock'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function AboutPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { about } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{about.heading}</h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.whoWeAreHeading}</h2>
        <p className="mt-2">{about.whoWeAreBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.missionHeading}</h2>
        <p className="mt-2">{about.missionBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.visionHeading}</h2>
        <p className="mt-2">{about.visionBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.valuesHeading}</h2>
        <ul className="mt-2 list-disc pl-5">
          {about.values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.ourStoryHeading}</h2>
        <p className="mt-2">{about.ourStoryBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.leadershipHeading}</h2>
        <Leadership lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.legalGovernanceHeading}</h2>
        <p className="mt-2">{about.legalGovernanceBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.commitmentsHeading}</h2>
        <CommitmentsBlock lang={lang} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/about/page.test.tsx"`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/about/page.tsx" "app/[lang]/about/page.test.tsx"
git commit -m "feat: compose About page"
```

---

## Task 5: StoryBlock component

**Files:**
- Create: `components/programs/StoryBlock.tsx`
- Create: `components/programs/StoryBlock.test.tsx`

**Interfaces:**
- Consumes: nothing new — takes `story` and `attribution` strings as props.
- Produces: `StoryBlock({ story: string, attribution: string })` React component, consumed by `ProgramDetail` (Task 6).

- [ ] **Step 1: Write the failing test**

```tsx
// components/programs/StoryBlock.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoryBlock } from '@/components/programs/StoryBlock'

describe('StoryBlock', () => {
  it('renders the story text and its attribution note', () => {
    render(<StoryBlock story="A demo story." attribution="A demo attribution." />)

    expect(screen.getByText('A demo story.')).toBeInTheDocument()
    expect(screen.getByText('A demo attribution.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/programs/StoryBlock.test.tsx`
Expected: FAIL — `components/programs/StoryBlock.tsx` does not exist.

- [ ] **Step 3: Implement `components/programs/StoryBlock.tsx`**

```tsx
export function StoryBlock({ story, attribution }: { story: string; attribution: string }) {
  return (
    <div className="mt-2 rounded border border-accent/30 bg-accent/5 p-4">
      <p className="text-sm italic">{story}</p>
      <p className="mt-2 text-xs text-ink/60">{attribution}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/programs/StoryBlock.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/programs/StoryBlock.tsx components/programs/StoryBlock.test.tsx
git commit -m "feat: story block component for program sub-pages"
```

---

## Task 6: ProgramDetail component

**Files:**
- Create: `components/programs/ProgramDetail.tsx`
- Create: `components/programs/ProgramDetail.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).programs[slug]`, `getContent(lang).programDetail.*` (Task 1), `StoryBlock` (Task 5), `ProgramSlug` from `@/components/home/programs-data` (Phase 3).
- Produces: `ProgramDetail({ lang: Lang, slug: ProgramSlug })` React component, consumed by the program sub-page route (Task 7).

- [ ] **Step 1: Write the failing test**

```tsx
// components/programs/ProgramDetail.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgramDetail } from '@/components/programs/ProgramDetail'

describe('ProgramDetail', () => {
  it('renders the program title as h1, all section headings in order, the story, and the support CTA', () => {
    render(<ProgramDetail lang="en" slug="resettlement" />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Resettlement & Durable Solutions',
      'The Problem',
      'What We Do',
      'Where We Work',
      'How We Measure It',
      'A Story From Our Work',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Resettlement & Durable Solutions'
    )
    expect(
      screen.getByText(/Halima and her three children were displaced twice/)
    ).toBeInTheDocument()

    const cta = screen.getByRole('link', { name: 'Support this program' })
    expect(cta).toHaveAttribute('href', '/en/donate/')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/programs/ProgramDetail.test.tsx`
Expected: FAIL — `components/programs/ProgramDetail.tsx` does not exist.

- [ ] **Step 3: Implement `components/programs/ProgramDetail.tsx`**

```tsx
import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import type { ProgramSlug } from '@/components/home/programs-data'
import { StoryBlock } from './StoryBlock'

export function ProgramDetail({ lang, slug }: { lang: Lang; slug: ProgramSlug }) {
  const content = getContent(lang)
  const program = content.programs[slug]
  const { programDetail } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{program.title}</h1>
      <p className="mt-2 text-lg">{program.summary}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.problemHeading}</h2>
        <p className="mt-2">{program.problem}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.whatWeDoHeading}</h2>
        <p className="mt-2">{program.whatWeDo}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.whereHeading}</h2>
        <p className="mt-2">{program.whereText}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.measurementHeading}</h2>
        <p className="mt-2">{program.measurement}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.storyHeading}</h2>
        <StoryBlock story={program.story} attribution={program.storyAttribution} />
      </section>

      <Link href={`/${lang}/donate/`} className="mt-8 inline-block rounded bg-primary px-4 py-2 text-paper">
        {programDetail.supportCta}
      </Link>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/programs/ProgramDetail.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/programs/ProgramDetail.tsx components/programs/ProgramDetail.test.tsx
git commit -m "feat: program detail component"
```

---

## Task 7: Program sub-page route

**Files:**
- Create: `app/[lang]/programs/[slug]/page.tsx`
- Create: `app/[lang]/programs/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `ProgramDetail` (Task 6), `PROGRAM_SLUGS`/`ProgramSlug` from `@/components/home/programs-data` (Phase 3), `LANGS`/`Lang` (Phase 2).
- Produces: the `/​{lang}​/programs/​{slug}​/` route, statically generated for all 4 slugs × 2 languages.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/programs/[slug]/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramPage from '@/app/[lang]/programs/[slug]/page'

describe('ProgramPage', () => {
  it('renders the correct program detail for the given slug', () => {
    render(<ProgramPage params={{ lang: 'en', slug: 'shelter' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Shelter & Essential Services'
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/programs/[slug]/page.test.tsx"`
Expected: FAIL — `app/[lang]/programs/[slug]/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/programs/[slug]/page.tsx`**

```tsx
import { ProgramDetail } from '@/components/programs/ProgramDetail'
import { PROGRAM_SLUGS, type ProgramSlug } from '@/components/home/programs-data'
import { LANGS, type Lang } from '@/lib/i18n'

export function generateStaticParams() {
  return LANGS.flatMap((lang) => PROGRAM_SLUGS.map((slug) => ({ lang, slug })))
}

export default function ProgramPage({
  params,
}: {
  params: { lang: Lang; slug: ProgramSlug }
}) {
  return <ProgramDetail lang={params.lang} slug={params.slug} />
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/programs/[slug]/page.test.tsx"`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/programs/[slug]/page.tsx" "app/[lang]/programs/[slug]/page.test.tsx"
git commit -m "feat: program sub-page route"
```

---

## Task 8: Programs index page

**Files:**
- Create: `app/[lang]/programs/page.tsx`
- Create: `app/[lang]/programs/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).programsPage.*` (Task 1), `PROGRAM_SLUGS` (Phase 3), `ProgramCard` (Phase 3), `LANGS`/`Lang` (Phase 2).
- Produces: the `/​{lang}​/programs/` route.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/programs/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramsPage from '@/app/[lang]/programs/page'

describe('ProgramsPage', () => {
  it('renders the page heading, intro, and all four program cards with correct hrefs', () => {
    render(<ProgramsPage params={{ lang: 'en' }} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Our Programs')
    expect(
      screen.getByText('Four connected programs help displaced families move from crisis to stability. (DEMO)')
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /Resettlement & Durable Solutions/ })).toHaveAttribute(
      'href',
      '/en/programs/resettlement/'
    )
    expect(screen.getByRole('link', { name: /Shelter & Essential Services/ })).toHaveAttribute(
      'href',
      '/en/programs/shelter/'
    )
    expect(screen.getByRole('link', { name: /Livelihoods & Self-Reliance/ })).toHaveAttribute(
      'href',
      '/en/programs/livelihoods/'
    )
    expect(screen.getByRole('link', { name: /Protection & Community Cohesion/ })).toHaveAttribute(
      'href',
      '/en/programs/protection/'
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/programs/page.test.tsx"`
Expected: FAIL — `app/[lang]/programs/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/programs/page.tsx`**

```tsx
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { PROGRAM_SLUGS } from '@/components/home/programs-data'
import { ProgramCard } from '@/components/home/ProgramCard'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function ProgramsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{content.programsPage.heading}</h1>
      <p className="mt-2 text-lg">{content.programsPage.intro}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROGRAM_SLUGS.map((slug) => (
          <ProgramCard
            key={slug}
            lang={lang}
            slug={slug}
            title={content.programs[slug].title}
            summary={content.programs[slug].summary}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/programs/page.test.tsx"`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/programs/page.tsx" "app/[lang]/programs/page.test.tsx"
git commit -m "feat: programs index page"
```

---

## Task 9: RegionBlock component

**Files:**
- Create: `components/where-we-work/RegionBlock.tsx`
- Create: `components/where-we-work/RegionBlock.test.tsx`

**Interfaces:**
- Consumes: nothing new — takes a `region` object and shared `labels` object as props (both shaped like `getContent(lang).whereWeWork.hiran` / `.regionLabels` from Task 1).
- Produces: `RegionBlock({ id: string, region: Region, labels: RegionLabels })` React component, consumed by the Where We Work page (Task 10).

- [ ] **Step 1: Write the failing test**

```tsx
// components/where-we-work/RegionBlock.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RegionBlock } from '@/components/where-we-work/RegionBlock'

const region = {
  heading: 'Hiran / Hirshabelle',
  displacementContext: 'Test displacement context.',
  districts: 'Test districts.',
  office: 'Test office.',
  whatWeRun: 'Test programming.',
  coordination: '[COORDINATION PARTNERS TO BE CONFIRMED]',
}

const labels = {
  districts: 'Districts Covered',
  office: 'Our Office',
  whatWeRun: 'What We Run Here',
  coordination: 'Who We Coordinate With',
}

describe('RegionBlock', () => {
  it('renders the region heading, context, and labeled fields, with the given anchor id', () => {
    render(<RegionBlock id="hiran" region={region} labels={labels} />)

    const heading = screen.getByRole('heading', { level: 2, name: 'Hiran / Hirshabelle' })
    expect(heading).toBeInTheDocument()
    expect(heading.closest('section')).toHaveAttribute('id', 'hiran')

    expect(screen.getByText('Test displacement context.')).toBeInTheDocument()
    expect(screen.getByText('Districts Covered')).toBeInTheDocument()
    expect(screen.getByText('Test districts.')).toBeInTheDocument()
    expect(screen.getByText('[COORDINATION PARTNERS TO BE CONFIRMED]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/where-we-work/RegionBlock.test.tsx`
Expected: FAIL — `components/where-we-work/RegionBlock.tsx` does not exist.

- [ ] **Step 3: Implement `components/where-we-work/RegionBlock.tsx`**

```tsx
type Region = {
  heading: string
  displacementContext: string
  districts: string
  office: string
  whatWeRun: string
  coordination: string
}

type RegionLabels = {
  districts: string
  office: string
  whatWeRun: string
  coordination: string
}

export function RegionBlock({
  id,
  region,
  labels,
}: {
  id: string
  region: Region
  labels: RegionLabels
}) {
  return (
    <section id={id} className="mt-8">
      <h2 className="font-display text-2xl font-semibold">{region.heading}</h2>
      <p className="mt-2">{region.displacementContext}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-semibold">{labels.districts}</dt>
          <dd>{region.districts}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.office}</dt>
          <dd>{region.office}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.whatWeRun}</dt>
          <dd>{region.whatWeRun}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.coordination}</dt>
          <dd>{region.coordination}</dd>
        </div>
      </dl>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/where-we-work/RegionBlock.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/where-we-work/RegionBlock.tsx components/where-we-work/RegionBlock.test.tsx
git commit -m "feat: region block component for Where We Work page"
```

---

## Task 10: Where We Work page

**Files:**
- Create: `app/[lang]/where-we-work/page.tsx`
- Create: `app/[lang]/where-we-work/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).whereWeWork.*` (Task 1), `RegionBlock` (Task 9), `LANGS`/`Lang` (Phase 2).
- Produces: the `/​{lang}​/where-we-work/` route, with anchors `#hiran` and `#southwest` matching the homepage map's existing links (Phase 3).

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/where-we-work/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WhereWeWorkPage from '@/app/[lang]/where-we-work/page'

describe('WhereWeWorkPage', () => {
  it('renders the page heading and both region blocks with the correct anchor ids', () => {
    render(<WhereWeWorkPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['Where We Work', 'Hiran / Hirshabelle', 'Southwest State'])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Where We Work')

    const hiranHeading = screen.getByRole('heading', { level: 2, name: 'Hiran / Hirshabelle' })
    expect(hiranHeading.closest('section')).toHaveAttribute('id', 'hiran')

    const southwestHeading = screen.getByRole('heading', { level: 2, name: 'Southwest State' })
    expect(southwestHeading.closest('section')).toHaveAttribute('id', 'southwest')

    expect(screen.getByText(/Shabelle River burst its banks at Beledweyne/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/where-we-work/page.test.tsx"`
Expected: FAIL — `app/[lang]/where-we-work/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/where-we-work/page.tsx`**

```tsx
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { RegionBlock } from '@/components/where-we-work/RegionBlock'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function WhereWeWorkPage({ params }: { params: { lang: Lang } }) {
  const content = getContent(params.lang)
  const { whereWeWork } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{whereWeWork.heading}</h1>
      <p className="mt-2 text-lg">{whereWeWork.intro}</p>
      <RegionBlock id="hiran" region={whereWeWork.hiran} labels={whereWeWork.regionLabels} />
      <RegionBlock id="southwest" region={whereWeWork.southwest} labels={whereWeWork.regionLabels} />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/where-we-work/page.test.tsx"`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/where-we-work/page.tsx" "app/[lang]/where-we-work/page.test.tsx"
git commit -m "feat: compose Where We Work page"
```

---

## Task 11: Final verification and launch checklist

**Files:**
- Modify: `CHECKLIST-BEFORE-LAUNCH.md`

**Interfaces:**
- Consumes: nothing new — this is a verification and documentation pass over Tasks 1–10.
- Produces: updated `CHECKLIST-BEFORE-LAUNCH.md`.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — every test from Phases 2–3 plus this phase's new tests (21 + 8 new test files worth of assertions), 0 failures.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Build the static export and verify output**

Run: `npm run build`
Expected: exits 0. Confirms these files exist and are non-empty: `out/en/about/index.html`, `out/so/about/index.html`, `out/en/programs/index.html`, `out/en/programs/resettlement/index.html`, `out/en/programs/shelter/index.html`, `out/en/programs/livelihoods/index.html`, `out/en/programs/protection/index.html`, `out/en/where-we-work/index.html`, and the Somali (`out/so/...`) equivalents of each.

- [ ] **Step 4: Verify the homepage map's forward-links now resolve**

Run: `grep -o 'id="hiran"' out/en/where-we-work/index.html` and `grep -o 'id="southwest"' out/en/where-we-work/index.html`
Expected: both found — confirms the Phase 3 homepage map's `#hiran`/`#southwest` links now land on real anchors instead of a 404 page.

- [ ] **Step 5: Verify the verified flooding fact rendered correctly**

Run: `grep -o 'Shabelle River burst its banks' out/en/where-we-work/index.html`
Expected: found — confirms the sourced content (not a placeholder) renders in the static output.

- [ ] **Step 6: Extend `CHECKLIST-BEFORE-LAUNCH.md`**

Add a new section (keep everything already in the file — do not delete Phase 2/3's entries):

```markdown

## Phase 4 (About, Programs, Where We Work) — what's real vs. placeholder right now

- Leadership/board names, roles, bios, and photos are demo placeholders, tagged `(DEMO NAME)`/`(DEMO ROLE)`/`(DEMO BIO)` — replace once real Section 0 facts (board names, roles) are supplied.
- Each program sub-page's anonymized story is fictional demo content, clearly tagged `(DEMO STORY)` — replace with a real, consented, anonymized story before launch. Do not remove the "shared with consent" attribution pattern even when real stories are added; update it to reflect actual consent status.
- Registration number is an honest placeholder (`[REGISTRATION NUMBER TO BE CONFIRMED]`) — not invented.
- Coordination partners on the Where We Work page are an honest placeholder (`[COORDINATION PARTNERS TO BE CONFIRMED]`) — do not fill in with real organization names (UNHCR, IOM, etc.) until an actual partnership is confirmed by the user; naming a real org here without confirmation would imply a partnership that doesn't exist.
- Districts covered and field office locations continue to use Beledweyne (Hiran) / Baidoa (Southwest) structurally; still unconfirmed per Section 0.
- The 2023 Shabelle river flooding content on the Where We Work page **is verified, sourced content** (IOM, OCHA/ReliefWeb, FAO) — not a placeholder. If updated later, re-verify rather than editing from memory.
- The About page's Safeguarding & PSEA link (`/{lang}/safeguarding/`) will 404 until Phase 7 builds the legal pages — expected mid-build, not a defect.
- Program sub-page "Support this program" buttons link to `/{lang}/donate/`, which will 404 until Phase 6 — expected mid-build, not a defect.
```

- [ ] **Step 7: Commit**

```bash
git add CHECKLIST-BEFORE-LAUNCH.md
git commit -m "docs: extend launch checklist with Phase 4 placeholders"
```

- [ ] **Step 8: Report to the user in plain language**

Summarize: the site now has a full About page (mission/vision/values/story/leadership/legal/commitments), a Programs index page, four detailed program sub-pages (each with problem/approach/where/measurement/a demo story/a support button), and a Where We Work page with real, sourced context on the 2023 Shabelle river flooding alongside demo placeholders for districts/offices/coordination partners. The homepage's Somalia map links to Where We Work now resolve correctly. Nothing is deployed yet (Phase 8). The only thing the user needs to do: nothing yet — real leadership info, program stories, registration number, and coordination partners get filled in as the checklist and later phases progress.
