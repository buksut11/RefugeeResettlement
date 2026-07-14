# Phase 7a — Legal Pages, SEO, Security Headers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three legal pages, apply SEO metadata (titles, descriptions, hreflang, Open Graph/Twitter, JSON-LD, sitemap/robots) across the entire site, and configure security headers — completing master prompt Sections 4.11 and 8, and the security-header portion of Section 7.

**Architecture:** A shared `lib/seo.ts` helper builds each page's `Metadata` object from a page-specific title/description plus the lang-agnostic path; every page's `page.tsx` gains a `generateMetadata` export calling it. Legal-page copy and per-page SEO titles/descriptions live in `content/en.json`/`content/so.json` under new `legal`/`privacy`/`safeguarding`/`terms`/`seo` namespaces, consistent with the project's existing content architecture. `lib/jsonld.ts` and `lib/routes.ts` are small, focused helpers for the `Organization` JSON-LD block and the site's full route list (used by `app/sitemap.ts`).

**Tech Stack:** Unchanged from Phases 2-6 — Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, Vitest + React Testing Library. No new npm dependencies. Uses Next's built-in `Metadata`/`MetadataRoute` types and the `app/sitemap.ts`/`app/robots.ts` static-export-compatible file conventions.

## Global Constraints

- Colour tokens (unchanged): Primary `#14355C`, Secondary `#2F6B4F`, Accent `#B5651D`, Ink `#201D1B`, Paper `#F7F5F0`.
- Trailing-slash URL convention continues: every path passed to `buildMetadata` and every route in the sitemap ends in `/` (except the bare lang root, e.g. `/en/`).
- **Content categorization for legal pages**: the substantive policy statements (what's collected, the zero-tolerance PSEA commitment, acceptable use, etc.) are REAL structural content — not demo-tagged — consistent with how Phase 4's Commitments block and Phase 5/6's safeguarding statements were treated (they are genuine policy commitments the org is asserting, not invented marketing filler). Only specific unconfirmed FACTS within them (the governing-law jurisdiction) get honest bracket placeholders (`[JURISDICTION TO BE CONFIRMED]`). This differs from most other Phase 7a copy (page intros, SEO descriptions for non-legal pages), which follows the established `(DEMO)`/`(QORAAL DEMO AH)` convention for invented filler.
- Every legal page must contain the literal HTML comment `<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->` in its rendered output (master prompt's exact required text) — rendered via `dangerouslySetInnerHTML` on an empty wrapper so it survives to the actual HTML, not stripped as a JSX-only comment. Additionally, all three legal pages render a visible `LegalDraftNotice` banner (a deliberate addition beyond the literal spec) stating the same thing in human-readable form.
- Analytics (Plausible/Umami) is explicitly out of scope this phase — do not add any analytics script, placeholder or otherwise.
- JSON-LD (`lib/jsonld.ts`) stays minimal (`@context`, `@type: "NGO"`, `name` only) — do not add `url`, `logo`, `address`, or `contactPoint` fields with bracketed placeholder strings, since structured-data fields are parsed more strictly by crawlers than visible page text and a non-URL string in a `url` field can produce validation warnings. Add those fields only once a real domain and Section 0 facts exist (tracked in the checklist).
- `sitemap.ts`/`robots.ts` use a placeholder production domain constant (`https://example.org`) — tracked in the checklist as needing the real domain once Phase 8 assigns one. This is the same "honest placeholder, activates later" pattern as the Formspree endpoint and card-donations link.
- CSP is `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; form-action 'self' https://formspree.io; frame-ancestors 'none'; object-src 'none'; base-uri 'self'` exactly — `script-src 'self'` (no `'unsafe-inline'`) is correct and does not conflict with the inline JSON-LD `<script type="application/ld+json">`, since browsers don't apply `script-src` enforcement to non-executable script types.
- Never leave a `TODO` in code.
- Accessibility baseline continues: exactly one `h1` per page, semantic heading order.

---

## File Structure

```
content/
  en.json                                  # extended: legal.*, privacy.*, safeguarding.*, terms.*, seo.*
  so.json                                  # same new keys, real (untagged) Somali policy translations
lib/
  content.test.ts                          # extended with assertions + parity for the new keys
  seo.ts                                   # buildMetadata({ lang, path, title, description }): Metadata
  seo.test.ts
  jsonld.ts                                # buildOrganizationJsonLd(lang): string
  jsonld.test.ts
  routes.ts                                # getAllPagePaths(): string[]
  routes.test.ts
components/
  legal/
    LegalDraftNotice.tsx
    LegalDraftNotice.test.tsx
app/
  [lang]/
    layout.tsx                             # modified: renders the JSON-LD script
    page.tsx / page.test.tsx               # modified: generateMetadata added
    about/page.tsx / page.test.tsx         # modified: generateMetadata added
    programs/page.tsx / page.test.tsx      # modified: generateMetadata added
    programs/[slug]/page.tsx / page.test.tsx  # modified: generateMetadata added (derived)
    where-we-work/page.tsx / page.test.tsx # modified: generateMetadata added
    impact/page.tsx / page.test.tsx        # modified: generateMetadata added
    news/page.tsx / page.test.tsx          # modified: generateMetadata added
    news/[slug]/page.tsx / page.test.tsx   # modified: generateMetadata added (derived)
    get-involved/page.tsx / page.test.tsx  # modified: generateMetadata added
    donate/page.tsx / page.test.tsx        # modified: generateMetadata added
    contact/page.tsx / page.test.tsx       # modified: generateMetadata added
    privacy/
      page.tsx
      page.test.tsx
    safeguarding/
      page.tsx
      page.test.tsx
    terms/
      page.tsx
      page.test.tsx
  sitemap.ts
  sitemap.test.ts
  robots.ts
  robots.test.ts
vercel.json                                # modified: adds "headers"
vercel.test.ts                             # new, root-level
CHECKLIST-BEFORE-LAUNCH.md                 # extended with Phase 7a placeholders
```

---

## Task 1: Legal and SEO content additions

**Files:**
- Modify: `content/en.json`
- Modify: `content/so.json`
- Modify: `lib/content.test.ts`

**Interfaces:**
- Consumes: existing `getContent(lang)` from `lib/content.ts` (unchanged).
- Produces: new content keys `legal.draftNotice`, `privacy.*`, `safeguarding.*`, `terms.*`, `seo.*` (one `{title, description}` pair per static page: `home`, `about`, `programs`, `whereWeWork`, `impact`, `news`, `getInvolved`, `donate`, `contact`, `privacy`, `safeguarding`, `terms`) — consumed by Tasks 2-12.

- [ ] **Step 1: Write the failing test additions to `lib/content.test.ts`**

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

  it('includes Phase 6 Get Involved, Donate, and Contact content keys', () => {
    const content = getContent('en')
    expect(content.getInvolved.heading).toBe('Get Involved')
    expect(content.donate.heading).toBe('Donate')
    expect(content.contact.heading).toBe('Contact')
  })

  it('includes Phase 7a legal content keys', () => {
    const content = getContent('en')
    expect(content.legal.draftNotice).toContain('unreviewed draft')
    expect(content.privacy.heading).toBe('Privacy Policy')
    expect(content.safeguarding.heading).toBe('Safeguarding & PSEA Policy')
    expect(content.terms.heading).toBe('Terms of Use')
    expect(content.terms.governingLawBody).toContain('[JURISDICTION TO BE CONFIRMED]')
  })

  it('includes Phase 7a SEO content keys for all twelve static pages', () => {
    const content = getContent('en')
    for (const page of [
      'home',
      'about',
      'programs',
      'whereWeWork',
      'impact',
      'news',
      'getInvolved',
      'donate',
      'contact',
      'privacy',
      'safeguarding',
      'terms',
    ] as const) {
      expect(content.seo[page].title.length).toBeGreaterThan(0)
      expect(content.seo[page].description.length).toBeGreaterThan(0)
    }
  })

  it('keeps all Somali content structurally in sync with English', () => {
    const en = getContent('en')
    const so = getContent('so')
    expect(keyShape(so.about)).toEqual(keyShape(en.about))
    expect(keyShape(so.news)).toEqual(keyShape(en.news))
    expect(keyShape(so.impact)).toEqual(keyShape(en.impact))
    expect(keyShape(so.programDetail)).toEqual(keyShape(en.programDetail))
    expect(keyShape(so.programsPage)).toEqual(keyShape(en.programsPage))
    expect(keyShape(so.whereWeWork)).toEqual(keyShape(en.whereWeWork))
    expect(keyShape(so.programs)).toEqual(keyShape(en.programs))
    expect(keyShape(so.getInvolved)).toEqual(keyShape(en.getInvolved))
    expect(keyShape(so.donate)).toEqual(keyShape(en.donate))
    expect(keyShape(so.contact)).toEqual(keyShape(en.contact))
    expect(keyShape(so.legal)).toEqual(keyShape(en.legal))
    expect(keyShape(so.privacy)).toEqual(keyShape(en.privacy))
    expect(keyShape(so.safeguarding)).toEqual(keyShape(en.safeguarding))
    expect(keyShape(so.terms)).toEqual(keyShape(en.terms))
    expect(keyShape(so.seo)).toEqual(keyShape(en.seo))
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/content.test.ts`
Expected: FAIL on the Phase 7a tests — `content.legal`, `content.privacy`, `content.safeguarding`, `content.terms`, `content.seo` are all `undefined`.

- [ ] **Step 3: Add the following keys to `content/en.json`**

Add these five new top-level keys (after the existing `"contact"` key, before the final closing `}` of the file — remember to add a comma after the existing `contact` object's closing brace):

```json
  "legal": {
    "draftNotice": "Draft policy — this page has not yet been reviewed by the organization's legal or protection focal point. Do not rely on it as final."
  },
  "privacy": {
    "heading": "Privacy Policy",
    "intro": "This Privacy Policy explains what information Horumar Resettlement Network collects through this website, how it is used, and what is never collected.",
    "whatWeCollectHeading": "What We Collect",
    "whatWeCollectBody": "Today, the only personal information this website collects is what you choose to submit through the contact form: your name, email address, subject, and message. We do not use cookies, and no analytics or tracking software is active on this site.",
    "thirdPartyHeading": "Third-Party Processing",
    "thirdPartyBody": "Contact form submissions are processed by Formspree, a third-party form service, solely to deliver your message to our staff. We do not share your information with any other third party.",
    "whatWeNeverCollectHeading": "What We Never Collect",
    "whatWeNeverCollectBody": "We never collect the names, locations, family details, or biometric data of people we assist, and this website has no feature to register for or apply for assistance.",
    "retentionHeading": "Data Retention",
    "retentionBody": "Contact form messages are retained only as long as needed to respond to your inquiry, and are not used for any other purpose.",
    "contactHeading": "Questions About This Policy",
    "contactBody": "If you have questions about this policy or wish to request that we delete information you have submitted, contact us using the details on our Contact page.",
    "changesHeading": "Changes to This Policy",
    "changesBody": "We may update this policy as our practices change. The date of the most recent update will be noted here once this policy is finalized."
  },
  "safeguarding": {
    "heading": "Safeguarding & PSEA Policy",
    "intro": "Horumar Resettlement Network is committed to protecting the people we serve, our staff, and our partners from harm, exploitation, and abuse.",
    "zeroToleranceHeading": "Zero-Tolerance Policy",
    "zeroToleranceBody": "We maintain a zero-tolerance policy toward sexual exploitation and abuse (SEA) by any staff member, volunteer, contractor, or partner. Anyone found to have violated this policy will face disciplinary action, up to and including termination and referral to law enforcement where appropriate.",
    "reportingHeading": "How to Report a Concern",
    "reportingBody": "If you have witnessed or experienced sexual exploitation, abuse, or any other safeguarding concern, you can report it through our Contact page's dedicated safeguarding channel, or using the phone, WhatsApp, and email details on our Impact & Accountability page. Reports can be made anonymously.",
    "confidentialityHeading": "Confidentiality and Non-Retaliation",
    "confidentialityBody": "All reports are handled confidentially and shared only with those who need to know in order to respond. Making a report, in good faith, will never affect your or your family's access to our assistance, and retaliation against anyone who reports a concern is itself a violation of this policy.",
    "consentHeading": "Consent, Photography, and Storytelling",
    "consentBody": "We only share a person's story or photograph with their informed consent, and names may be changed to protect identity. We never publish identifiable images of children without an explicit consent record from a parent or guardian.",
    "investigationHeading": "How Reports Are Handled",
    "investigationBody": "Every report is reviewed and, where appropriate, investigated by staff responsible for safeguarding. We aim to acknowledge reports promptly and keep the reporter informed of the outcome where safe and appropriate to do so."
  },
  "terms": {
    "heading": "Terms of Use",
    "intro": "These Terms of Use govern your use of the Horumar Resettlement Network website.",
    "acceptableUseHeading": "Acceptable Use",
    "acceptableUseBody": "You may use this website to learn about our work, read our news and reports, and contact us. You may not use it to attempt unauthorized access to our systems, to interfere with the site's operation, or for any unlawful purpose.",
    "contentOwnershipHeading": "Content Ownership",
    "contentOwnershipBody": "Unless otherwise noted, the text, photographs, and other content on this website belong to Horumar Resettlement Network or are used with permission. You may share links to our content, but you may not republish it without our written consent.",
    "noWarrantyHeading": "No Warranty",
    "noWarrantyBody": "This website is provided as-is. While we try to keep information accurate and current, we make no guarantee that it is complete or error-free.",
    "governingLawHeading": "Governing Law",
    "governingLawBody": "These terms are governed by the laws of [JURISDICTION TO BE CONFIRMED], pending confirmation of our formal legal registration.",
    "changesHeading": "Changes to These Terms",
    "changesBody": "We may update these terms from time to time. Continued use of the website after changes are posted means you accept the updated terms."
  },
  "seo": {
    "home": {
      "title": "Home",
      "description": "Horumar Resettlement Network supports displaced families in Hiran and Southwest State, Somalia, with resettlement, shelter, and livelihoods programs. (DEMO)"
    },
    "about": {
      "title": "About Us",
      "description": "Learn about Horumar Resettlement Network's mission, values, leadership, and commitments to the communities we serve. (DEMO)"
    },
    "programs": {
      "title": "Our Programs",
      "description": "Explore our four programs: resettlement, shelter, livelihoods, and protection for displaced families in Somalia. (DEMO)"
    },
    "whereWeWork": {
      "title": "Where We Work",
      "description": "See the regions of Hiran/Hirshabelle and Southwest State where Horumar Resettlement Network operates. (DEMO)"
    },
    "impact": {
      "title": "Impact & Accountability",
      "description": "Our results, funds-use breakdown, complaints mechanism, and published reports. (DEMO)"
    },
    "news": {
      "title": "News & Stories",
      "description": "The latest news and stories from Horumar Resettlement Network's work in Somalia. (DEMO)"
    },
    "getInvolved": {
      "title": "Get Involved",
      "description": "Donate, partner with us, or learn how to support Horumar Resettlement Network's work. (DEMO)"
    },
    "donate": {
      "title": "Donate",
      "description": "Support displaced families in Somalia through mobile money, bank transfer, or card donation. (DEMO)"
    },
    "contact": {
      "title": "Contact Us",
      "description": "Contact Horumar Resettlement Network's offices, or report a safeguarding concern. (DEMO)"
    },
    "privacy": {
      "title": "Privacy Policy",
      "description": "How Horumar Resettlement Network handles information collected through this website."
    },
    "safeguarding": {
      "title": "Safeguarding & PSEA Policy",
      "description": "Our zero-tolerance policy on sexual exploitation and abuse, and how to report a concern."
    },
    "terms": {
      "title": "Terms of Use",
      "description": "The terms governing use of the Horumar Resettlement Network website."
    }
  }
```

- [ ] **Step 4: Add the equivalent keys to `content/so.json`**

Add these five new top-level keys (same position, after the existing `"contact"` key):

```json
  "legal": {
    "draftNotice": "Qorshe qabyo ah — boggan wali lama eegin agaasimaha sharciga ama ilaalinta ee hay'adda. Ha u qaadan sida mid kama dambays ah."
  },
  "privacy": {
    "heading": "Siyaasadda Sirta",
    "intro": "Siyaasaddan Sirta waxay sharaxaysaa macluumaadka Horumar Resettlement Network ay ka ururiso bogga internetka, sida loo isticmaalo, iyo waxa aan la ururin marnaba.",
    "whatWeCollectHeading": "Waxa Aan Ururino",
    "whatWeCollectBody": "Hadda, macluumaadka gaarka ah ee kaliya ee bogga internetkani uu ururiyo waa waxa aad ku soo gudbiso foomka nala soo xiriirka: magacaaga, iimaylkaaga, mowduuca, iyo fariinta. Ma isticmaalno cookies, mana jiro barnaamij falanqeyn ama la socod ah oo ka shaqeeya bogga.",
    "thirdPartyHeading": "Habaynta Dhinaca Saddexaad",
    "thirdPartyBody": "Fariimaha foomka nala soo xiriirka waxaa habeeya Formspree, adeeg dhinac saddexaad ah, kaliya si loogu gudbiyo fariintaada shaqaaleheenna. Macluumaadkaaga lama wadaagno dhinac kale.",
    "whatWeNeverCollectHeading": "Waxa Aannu Marnaba Ururin",
    "whatWeNeverCollectBody": "Marnaba ma ururino magacyada, goobaha, faahfaahinta qoyska, ama xogta baayooloji ee dadka aan caawino, bogganna ma laha astaan lagu diiwaan gelinayo ama lagu codsanayo gargaar.",
    "retentionHeading": "Ilaalinta Xogta",
    "retentionBody": "Fariimaha foomka nala soo xiriirka waxaa la haystaa kaliya inta lagama maarmaan ah si loogu jawaabo su'aashaada, mana loo isticmaalo ujeeddo kale.",
    "contactHeading": "Su'aalaha Ku Saabsan Siyaasaddan",
    "contactBody": "Haddii aad qabto su'aalo ku saabsan siyaasaddan ama aad rabto inaad codsato in la tirtiro macluumaad aad soo gudbisay, nagala soo xiriir tafaasiisha ku qoran bogga Nala Soo Xiriir.",
    "changesHeading": "Isbeddelada Siyaasaddan",
    "changesBody": "Waxaan cusboonaysiin karnaa siyaasaddan marka dhaqamadeenna isbeddelaan. Taariikhda cusboonaysiinta ugu dambeysay ayaa halkan lagu qori doonaa marka siyaasaddan la dhammaystiro."
  },
  "safeguarding": {
    "heading": "Siyaasadda Ilaalinta iyo PSEA",
    "intro": "Horumar Resettlement Network waxay u heellan tahay inay ka ilaaliso dadka aan u adeegno, shaqaalaheenna, iyo iskaashatooyinkeenna khatarta, ka faa'iidaysiga, iyo xadgudubka.",
    "zeroToleranceHeading": "Siyaasadda Aan Dulqaadan Lahayn",
    "zeroToleranceBody": "Waxaan haynaa siyaasad aan dulqaadan ka faa'iidaysiga iyo xadgudubka galmada (SEA) ee ay geli karaan shaqaale, mutadawac, qandaraasle, ama iskaashade kasta. Qof kasta oo la ogaado inuu ku xadgudbay siyaasaddan wuxuu wajahi doonaa tallaabo edeb, oo ay ku jiraan ka shaqo bixin iyo gudbin ciidamada sharciga marka ay ku habboon tahay.",
    "reportingHeading": "Sida Loo Soo Sheego Walaac",
    "reportingBody": "Haddii aad aragtay ama la kulantay ka faa'iidaysiga galmada, xadgudub, ama walaac kale oo ilaalineed ah, waxaad ka soo sheegi kartaa kanaalka gaarka ah ee ilaalinta ee bogga Nala Soo Xiriir, ama adigoo isticmaalaya lambarka taleefanka, WhatsApp, iyo iimaylka ku qoran bogga Saameynta iyo Xisaabtan Bixinta. Warbixinnada waxaa lagu soo gudbin karaa qarsoodi.",
    "confidentialityHeading": "Qarsoodiga iyo Aan Aargudashada Lahayn",
    "confidentialityBody": "Dhammaan warbixinnada waxaa lagu maamulaa si qarsoodi ah waxaana lala wadaagaa kaliya kuwa u baahan inay ogaadaan si ay uga jawaabaan. Soo sheegidda, niyad wanaagsan, marnaba ma saameyn doonto helitaanka gargaarkeenna adiga ama qoyskaaga, aargudashadana ka dhanka ah qof kasta oo soo sheega walaac waa xadgudub siyaasaddan lafteeda ah.",
    "consentHeading": "Ogolaanshaha, Sawirrada, iyo Sheekaynta",
    "consentBody": "Waxaan kaliya wadaagnaa sheeko ama sawirka qof marka ay ogolaanshahiisa la ogsoon yahay jiro, magacyadana waa la beddeli karaa si loo ilaaliyo aqoonsiga. Marnaba ma daabacno sawirro la aqoonsan karo oo caruur ah oo aan lahayn diiwaan ogolaansho oo cad oo ka socda waalid ama masuul.",
    "investigationHeading": "Sida Warbixinnada Loo Maareeyo",
    "investigationBody": "Warbixin kasta waa la eegaa, marka ay ku habboon tahay waxaana baara shaqaalaha mas'uulka ka ah ilaalinta. Waxaan hadafka nahay inaan si degdeg ah u aqoonsano warbixinnada waxaana la socon doonaa kii soo sheegay natiijada marka ay ammaan iyo ku habboon tahay."
  },
  "terms": {
    "heading": "Shuruudaha Isticmaalka",
    "intro": "Shuruudahani Isticmaalka waxay xukumaan isticmaalkaaga bogga Horumar Resettlement Network.",
    "acceptableUseHeading": "Isticmaal La Aqbali Karo",
    "acceptableUseBody": "Waxaad isticmaali kartaa boggan si aad wax uga baratid shaqadeenna, akhrisatid wararkeenna iyo warbixinnadeenna, oo aad nagala soo xiriirtid. Ma isticmaali kartid si aad ugu isku daydo gelitaan aan la ogolayn nidaamyadeenna, si aad ugu faragelin shaqada bogga, ama ujeeddo sharci darro ah.",
    "contentOwnershipHeading": "Milkiilaha Waxa Ku Qoran",
    "contentOwnershipBody": "Ilaa la sheego si kale, qoraalka, sawirrada, iyo waxa kale ee ku qoran boggan waxaa iska leh Horumar Resettlement Network ama waxaa loo isticmaalaa ogolaansho. Waxaad la wadaagi kartaa xiriiriyayaal waxa aan qornay, laakiin ma dib-u-daabici kartid iyada oo aan qorista ogolaanshahayaga la helin.",
    "noWarrantyHeading": "Aan Dammaanad Lahayn",
    "noWarrantyBody": "Boggan waxaa la bixiyaa sida uu yahay. In kasta oo aan isku dayno inaan macluumaadka sax iyo cusboonaysiin ka dhigno, ma dammaanad qaadeyno inuu dhammaystiran yahay ama aan khalad lahayn.",
    "governingLawHeading": "Sharciga Xukuma",
    "governingLawBody": "Shuruudahani waxaa xukuma sharciyada [JURISDICTION TO BE CONFIRMED], iyadoo la sugayo xaqiijinta diiwaangelinta sharciga rasmiga ah ee hay'adeenna.",
    "changesHeading": "Isbeddelada Shuruudahan",
    "changesBody": "Waxaan mararka qaarkood cusboonaysiin karnaa shuruudahan. Sii isticmaalka bogga ka dib marka isbeddelada la daabaco macnaheedu waa inaad aqbashay shuruudaha cusboonaysiin ah."
  },
  "seo": {
    "home": {
      "title": "Bogga Hore",
      "description": "Horumar Resettlement Network waxay taageertaa qoysaska barakacay ee Hiiraan iyo Koonfur Galbeed, Soomaaliya, iyadoo bixineysa barnaamijyo dib-u-dejin, hoy, iyo nolol-maalmeed. (QORAAL DEMO AH)"
    },
    "about": {
      "title": "Nagu Saabsan",
      "description": "Ka baro hadafka, qiyamka, hoggaanka, iyo ballanqaadyada Horumar Resettlement Network ee bulshooyinka aan u adeegno. (QORAAL DEMO AH)"
    },
    "programs": {
      "title": "Barnaamijyadeenna",
      "description": "Sahmi afarta barnaamij: dib-u-dejin, hoy, nolol-maalmeed, iyo ilaalin oo loogu talagalay qoysaska barakacay ee Soomaaliya. (QORAAL DEMO AH)"
    },
    "whereWeWork": {
      "title": "Meesha Aan Ka Shaqeyno",
      "description": "Arag gobollada Hiiraan/Hirshabelle iyo Koonfur Galbeed ee uu Horumar Resettlement Network ka shaqeeyo. (QORAAL DEMO AH)"
    },
    "impact": {
      "title": "Saameynta iyo Xisaabtan Bixinta",
      "description": "Natiijooyinkeenna, qaybinta lacagaha, hab-cabashada, iyo warbixinnada la daabacay. (QORAAL DEMO AH)"
    },
    "news": {
      "title": "Wararka iyo Sheekooyinka",
      "description": "Wararka iyo sheekooyinka ugu dambeeyay ee shaqada Horumar Resettlement Network ee Soomaaliya. (QORAAL DEMO AH)"
    },
    "getInvolved": {
      "title": "Naga Qeyb Qaado",
      "description": "Deeq bixi, nala iskaashó, ama baro sida aad u taageeri karto shaqada Horumar Resettlement Network. (QORAAL DEMO AH)"
    },
    "donate": {
      "title": "Deeq Bixi",
      "description": "Taageer qoysaska barakacay ee Soomaaliya adigoo isticmaalaya lacagta mobilada, wareejinta bangiga, ama deeqda kaararka. (QORAAL DEMO AH)"
    },
    "contact": {
      "title": "Nala Soo Xiriir",
      "description": "La xiriir xafiisyada Horumar Resettlement Network, ama soo sheeg walaac ilaalineed. (QORAAL DEMO AH)"
    },
    "privacy": {
      "title": "Siyaasadda Sirta",
      "description": "Sida Horumar Resettlement Network u maareeyo macluumaadka laga ururiyo bogga internetkan."
    },
    "safeguarding": {
      "title": "Siyaasadda Ilaalinta iyo PSEA",
      "description": "Siyaasaddeenna aan dulqaadan ka faa'iidaysiga iyo xadgudubka galmada, iyo sida loo soo sheego walaac."
    },
    "terms": {
      "title": "Shuruudaha Isticmaalka",
      "description": "Shuruudaha xukuma isticmaalka bogga Horumar Resettlement Network."
    }
  }
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 6: Commit**

```bash
git add content/en.json content/so.json lib/content.test.ts
git commit -m "content: add Phase 7a legal page and SEO copy"
```

---

## Task 2: SEO metadata helper

**Files:**
- Create: `lib/seo.ts`
- Create: `lib/seo.test.ts`

**Interfaces:**
- Consumes: `getContent` from `@/lib/content`, `otherLang`/`Lang` from `@/lib/i18n`.
- Produces: `buildMetadata({ lang: Lang, path: string, title: string, description: string }): Metadata` — consumed by every page's `generateMetadata` in Tasks 4-9.

- [ ] **Step 1: Write the failing test**

```ts
// lib/seo.test.ts
import { describe, it, expect } from 'vitest'
import { buildMetadata } from '@/lib/seo'

describe('buildMetadata', () => {
  it('builds a complete metadata object with title, description, hreflang alternates, and Open Graph/Twitter data', () => {
    const metadata = buildMetadata({
      lang: 'en',
      path: '/about/',
      title: 'About Us',
      description: 'Learn about our mission.',
    })

    expect(metadata.title).toBe('About Us | Horumar Resettlement Network')
    expect(metadata.description).toBe('Learn about our mission.')
    expect(metadata.alternates?.canonical).toBe('/en/about/')
    expect(metadata.alternates?.languages).toEqual({
      en: '/en/about/',
      so: '/so/about/',
    })
    expect(metadata.openGraph?.title).toBe('About Us | Horumar Resettlement Network')
    expect(metadata.openGraph?.description).toBe('Learn about our mission.')
    expect(metadata.openGraph?.locale).toBe('en')
    expect(metadata.twitter?.card).toBe('summary')
    expect(metadata.twitter?.title).toBe('About Us | Horumar Resettlement Network')
  })

  it('builds correct alternates for the home page path', () => {
    const metadata = buildMetadata({ lang: 'so', path: '/', title: 'Home', description: 'x' })
    expect(metadata.alternates?.canonical).toBe('/so/')
    expect(metadata.alternates?.languages).toEqual({
      en: '/en/',
      so: '/so/',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/seo.test.ts`
Expected: FAIL — `lib/seo.ts` does not exist.

- [ ] **Step 3: Implement `lib/seo.ts`**

```ts
import type { Metadata } from 'next'
import { getContent } from './content'
import { otherLang, type Lang } from './i18n'

export function buildMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: Lang
  path: string
  title: string
  description: string
}): Metadata {
  const content = getContent(lang)
  const target = otherLang(lang)
  const fullTitle = `${title} | ${content.site.name}`
  const canonicalPath = `/${lang}${path}`
  const alternatePath = `/${target}${path}`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: lang === 'en' ? canonicalPath : alternatePath,
        so: lang === 'so' ? canonicalPath : alternatePath,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      locale: lang,
      url: canonicalPath,
      siteName: content.site.name,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/seo.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/seo.ts lib/seo.test.ts
git commit -m "feat: SEO metadata builder helper"
```

---

## Task 3: LegalDraftNotice component

**Files:**
- Create: `components/legal/LegalDraftNotice.tsx`
- Create: `components/legal/LegalDraftNotice.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).legal.draftNotice` (Task 1).
- Produces: `LegalDraftNotice({ lang: Lang })` component, consumed by the three legal pages (Tasks 4-6).

- [ ] **Step 1: Write the failing test**

```tsx
// components/legal/LegalDraftNotice.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LegalDraftNotice } from '@/components/legal/LegalDraftNotice'

describe('LegalDraftNotice', () => {
  it('renders the visible draft notice text', () => {
    render(<LegalDraftNotice lang="en" />)
    expect(
      screen.getByText(
        "Draft policy — this page has not yet been reviewed by the organization's legal or protection focal point. Do not rely on it as final."
      )
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/legal/LegalDraftNotice.test.tsx`
Expected: FAIL — `components/legal/LegalDraftNotice.tsx` does not exist.

- [ ] **Step 3: Implement `components/legal/LegalDraftNotice.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function LegalDraftNotice({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <p className="mb-6 rounded border border-accent/40 bg-accent/10 p-3 text-sm font-semibold text-ink">
      {content.legal.draftNotice}
    </p>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/legal/LegalDraftNotice.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/legal/LegalDraftNotice.tsx components/legal/LegalDraftNotice.test.tsx
git commit -m "feat: legal draft notice component"
```

---

## Task 4: Privacy page

**Files:**
- Create: `app/[lang]/privacy/page.tsx`
- Create: `app/[lang]/privacy/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).privacy.*`, `getContent(lang).seo.privacy` (Task 1), `buildMetadata` (Task 2), `LegalDraftNotice` (Task 3), `LANGS`/`Lang` from `@/lib/i18n`.
- Produces: the `/​{lang}​/privacy/` route.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/privacy/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacyPage, { generateMetadata } from '@/app/[lang]/privacy/page'

describe('PrivacyPage', () => {
  it('renders the literal DRAFT HTML comment, the visible draft notice, and every section heading in order', () => {
    const { container } = render(<PrivacyPage params={{ lang: 'en' }} />)

    expect(container.innerHTML).toContain(
      "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->"
    )
    expect(
      screen.getByText(
        "Draft policy — this page has not yet been reviewed by the organization's legal or protection focal point. Do not rely on it as final."
      )
    ).toBeInTheDocument()

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Privacy Policy',
      'What We Collect',
      'Third-Party Processing',
      'What We Never Collect',
      'Data Retention',
      'Questions About This Policy',
      'Changes to This Policy',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy Policy')
  })

  it('renders correctly for Somali without crashing', () => {
    render(<PrivacyPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('builds metadata with the correct title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Privacy Policy | Horumar Resettlement Network')
    expect(metadata.description).toBe(
      'How Horumar Resettlement Network handles information collected through this website.'
    )
    expect(metadata.alternates?.canonical).toBe('/en/privacy/')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/privacy/page.test.tsx"`
Expected: FAIL — `app/[lang]/privacy/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/privacy/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { LegalDraftNotice } from '@/components/legal/LegalDraftNotice'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/privacy/',
    title: content.seo.privacy.title,
    description: content.seo.privacy.description,
  })
}

export default function PrivacyPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { privacy } = content

  return (
    <div className="px-4 py-10">
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->",
        }}
      />
      <LegalDraftNotice lang={lang} />
      <h1 className="font-display text-3xl font-semibold">{privacy.heading}</h1>
      <p className="mt-2 text-lg">{privacy.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.whatWeCollectHeading}</h2>
        <p className="mt-2">{privacy.whatWeCollectBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.thirdPartyHeading}</h2>
        <p className="mt-2">{privacy.thirdPartyBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.whatWeNeverCollectHeading}</h2>
        <p className="mt-2">{privacy.whatWeNeverCollectBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.retentionHeading}</h2>
        <p className="mt-2">{privacy.retentionBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.contactHeading}</h2>
        <p className="mt-2">{privacy.contactBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.changesHeading}</h2>
        <p className="mt-2">{privacy.changesBody}</p>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/privacy/page.test.tsx"`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/privacy/page.tsx" "app/[lang]/privacy/page.test.tsx"
git commit -m "feat: compose Privacy page"
```

---

## Task 5: Safeguarding page

**Files:**
- Create: `app/[lang]/safeguarding/page.tsx`
- Create: `app/[lang]/safeguarding/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).safeguarding.*`, `getContent(lang).seo.safeguarding` (Task 1), `buildMetadata` (Task 2), `LegalDraftNotice` (Task 3), `LANGS`/`Lang` from `@/lib/i18n`.
- Produces: the `/​{lang}​/safeguarding/` route — this resolves the forward-links from About's Commitments block, the Contact page's safeguarding callout, and the Footer, all of which have 404'd since Phase 4.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/safeguarding/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SafeguardingPage, { generateMetadata } from '@/app/[lang]/safeguarding/page'

describe('SafeguardingPage', () => {
  it('renders the literal DRAFT HTML comment, the visible draft notice, and every section heading in order', () => {
    const { container } = render(<SafeguardingPage params={{ lang: 'en' }} />)

    expect(container.innerHTML).toContain(
      "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->"
    )
    expect(
      screen.getByText(
        "Draft policy — this page has not yet been reviewed by the organization's legal or protection focal point. Do not rely on it as final."
      )
    ).toBeInTheDocument()

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Safeguarding & PSEA Policy',
      'Zero-Tolerance Policy',
      'How to Report a Concern',
      'Confidentiality and Non-Retaliation',
      'Consent, Photography, and Storytelling',
      'How Reports Are Handled',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Safeguarding & PSEA Policy'
    )
  })

  it('renders correctly for Somali without crashing', () => {
    render(<SafeguardingPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('builds metadata with the correct title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Safeguarding & PSEA Policy | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/safeguarding/')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/safeguarding/page.test.tsx"`
Expected: FAIL — `app/[lang]/safeguarding/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/safeguarding/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { LegalDraftNotice } from '@/components/legal/LegalDraftNotice'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/safeguarding/',
    title: content.seo.safeguarding.title,
    description: content.seo.safeguarding.description,
  })
}

export default function SafeguardingPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { safeguarding } = content

  return (
    <div className="px-4 py-10">
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->",
        }}
      />
      <LegalDraftNotice lang={lang} />
      <h1 className="font-display text-3xl font-semibold">{safeguarding.heading}</h1>
      <p className="mt-2 text-lg">{safeguarding.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.zeroToleranceHeading}</h2>
        <p className="mt-2">{safeguarding.zeroToleranceBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.reportingHeading}</h2>
        <p className="mt-2">{safeguarding.reportingBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">
          {safeguarding.confidentialityHeading}
        </h2>
        <p className="mt-2">{safeguarding.confidentialityBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.consentHeading}</h2>
        <p className="mt-2">{safeguarding.consentBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.investigationHeading}</h2>
        <p className="mt-2">{safeguarding.investigationBody}</p>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/safeguarding/page.test.tsx"`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/safeguarding/page.tsx" "app/[lang]/safeguarding/page.test.tsx"
git commit -m "feat: compose Safeguarding & PSEA page"
```

---

## Task 6: Terms page

**Files:**
- Create: `app/[lang]/terms/page.tsx`
- Create: `app/[lang]/terms/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).terms.*`, `getContent(lang).seo.terms` (Task 1), `buildMetadata` (Task 2), `LegalDraftNotice` (Task 3), `LANGS`/`Lang` from `@/lib/i18n`.
- Produces: the `/​{lang}​/terms/` route — resolves the Footer's forward-link to this page.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/terms/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TermsPage, { generateMetadata } from '@/app/[lang]/terms/page'

describe('TermsPage', () => {
  it('renders the literal DRAFT HTML comment, the visible draft notice, every section heading in order, and the jurisdiction placeholder', () => {
    const { container } = render(<TermsPage params={{ lang: 'en' }} />)

    expect(container.innerHTML).toContain(
      "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->"
    )
    expect(
      screen.getByText(
        "Draft policy — this page has not yet been reviewed by the organization's legal or protection focal point. Do not rely on it as final."
      )
    ).toBeInTheDocument()

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Terms of Use',
      'Acceptable Use',
      'Content Ownership',
      'No Warranty',
      'Governing Law',
      'Changes to These Terms',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms of Use')
    expect(screen.getByText(/\[JURISDICTION TO BE CONFIRMED\]/)).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<TermsPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('builds metadata with the correct title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Terms of Use | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/terms/')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/terms/page.test.tsx"`
Expected: FAIL — `app/[lang]/terms/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/terms/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { LegalDraftNotice } from '@/components/legal/LegalDraftNotice'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/terms/',
    title: content.seo.terms.title,
    description: content.seo.terms.description,
  })
}

export default function TermsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { terms } = content

  return (
    <div className="px-4 py-10">
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->",
        }}
      />
      <LegalDraftNotice lang={lang} />
      <h1 className="font-display text-3xl font-semibold">{terms.heading}</h1>
      <p className="mt-2 text-lg">{terms.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.acceptableUseHeading}</h2>
        <p className="mt-2">{terms.acceptableUseBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.contentOwnershipHeading}</h2>
        <p className="mt-2">{terms.contentOwnershipBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.noWarrantyHeading}</h2>
        <p className="mt-2">{terms.noWarrantyBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.governingLawHeading}</h2>
        <p className="mt-2">{terms.governingLawBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.changesHeading}</h2>
        <p className="mt-2">{terms.changesBody}</p>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/terms/page.test.tsx"`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/terms/page.tsx" "app/[lang]/terms/page.test.tsx"
git commit -m "feat: compose Terms of Use page"
```

---

## Task 7: Apply SEO metadata — home, about, programs index, programs sub-pages

**Files:**
- Modify: `app/[lang]/page.tsx`, `app/[lang]/page.test.tsx`
- Modify: `app/[lang]/about/page.tsx`, `app/[lang]/about/page.test.tsx`
- Modify: `app/[lang]/programs/page.tsx`, `app/[lang]/programs/page.test.tsx`
- Modify: `app/[lang]/programs/[slug]/page.tsx`, `app/[lang]/programs/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `buildMetadata` (Task 2), `content.seo.{home,about,programs}` (Task 1), and for the program sub-page, the item's own existing `content.programs[slug].{title,summary}` (Phase 3/4 — no new content needed there).
- Produces: `generateMetadata` exports on all four pages — no change to their default-exported components or rendered output.

- [ ] **Step 1: Replace `app/[lang]/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/home/Hero'
import { SomaliaMap } from '@/components/home/SomaliaMap'
import { ProgramsSection } from '@/components/home/ProgramsSection'
import { ImpactStrip } from '@/components/home/ImpactStrip'
import { NewsPreview } from '@/components/home/NewsPreview'
import type { Lang } from '@/lib/i18n'

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/',
    title: content.seo.home.title,
    description: content.seo.home.description,
  })
}

export default function HomePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params

  return (
    <>
      <Hero lang={lang} />
      <SomaliaMap lang={lang} />
      <ProgramsSection lang={lang} />
      <ImpactStrip lang={lang} />
      <NewsPreview lang={lang} />
    </>
  )
}
```

- [ ] **Step 2: Replace `app/[lang]/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage, { generateMetadata } from '@/app/[lang]/page'

describe('HomePage', () => {
  it('renders every section in order: hero, map, programs (incl. each card title), impact, news', () => {
    render(<HomePage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Helping displaced families in Hiran and Southwest State rebuild their lives (DEMO TEXT)',
      'Where We Work',
      'What We Do',
      'Resettlement & Durable Solutions',
      'Shelter & Essential Services',
      'Livelihoods & Self-Reliance',
      'Protection & Community Cohesion',
      'Impact',
      'Latest News',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the home page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Home | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/')
    expect(metadata.alternates?.languages).toEqual({ en: '/en/', so: '/so/' })
  })
})
```

- [ ] **Step 3: Replace `app/[lang]/about/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { Leadership } from '@/components/about/Leadership'
import { CommitmentsBlock } from '@/components/about/CommitmentsBlock'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/about/',
    title: content.seo.about.title,
    description: content.seo.about.description,
  })
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

- [ ] **Step 4: Replace `app/[lang]/about/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage, { generateMetadata } from '@/app/[lang]/about/page'

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

  it('renders the Somali version without crashing', () => {
    render(<AboutPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the About page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('About Us | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/about/')
  })
})
```

- [ ] **Step 5: Replace `app/[lang]/programs/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { PROGRAM_SLUGS } from '@/components/home/programs-data'
import { ProgramCard } from '@/components/home/ProgramCard'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/programs/',
    title: content.seo.programs.title,
    description: content.seo.programs.description,
  })
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

- [ ] **Step 6: Replace `app/[lang]/programs/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramsPage, { generateMetadata } from '@/app/[lang]/programs/page'

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

    expect(
      screen.getByRole('heading', { level: 2, name: /Resettlement & Durable Solutions/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /Shelter & Essential Services/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /Livelihoods & Self-Reliance/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /Protection & Community Cohesion/ })
    ).toBeInTheDocument()
  })

  it('renders the Somali version without crashing', () => {
    render(<ProgramsPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Programs index page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Our Programs | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/programs/')
  })
})
```

- [ ] **Step 7: Replace `app/[lang]/programs/[slug]/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ProgramDetail } from '@/components/programs/ProgramDetail'
import { PROGRAM_SLUGS, type ProgramSlug } from '@/components/home/programs-data'
import { LANGS, type Lang } from '@/lib/i18n'

export function generateStaticParams() {
  return LANGS.flatMap((lang) => PROGRAM_SLUGS.map((slug) => ({ lang, slug })))
}

export function generateMetadata({
  params,
}: {
  params: { lang: Lang; slug: ProgramSlug }
}): Metadata {
  const content = getContent(params.lang)
  const program = content.programs[params.slug]
  return buildMetadata({
    lang: params.lang,
    path: `/programs/${params.slug}/`,
    title: program.title,
    description: program.summary,
  })
}

export default function ProgramPage({
  params,
}: {
  params: { lang: Lang; slug: ProgramSlug }
}) {
  return <ProgramDetail lang={params.lang} slug={params.slug} />
}
```

- [ ] **Step 8: Replace `app/[lang]/programs/[slug]/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramPage, { generateMetadata } from '@/app/[lang]/programs/[slug]/page'

describe('ProgramPage', () => {
  it('renders the correct program detail for the given slug', () => {
    render(<ProgramPage params={{ lang: 'en', slug: 'shelter' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Shelter & Essential Services'
    )
  })

  it('renders the Somali version without crashing', () => {
    render(<ProgramPage params={{ lang: 'so', slug: 'resettlement' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('derives title and description from the program itself, not a shared content.seo entry', () => {
    const metadata = generateMetadata({ params: { lang: 'en', slug: 'shelter' } })
    expect(metadata.title).toBe('Shelter & Essential Services | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/programs/shelter/')
  })
})
```

- [ ] **Step 9: Run the full suite**

Run: `npm test`
Expected: PASS, no failures.

- [ ] **Step 10: Commit**

```bash
git add "app/[lang]/page.tsx" "app/[lang]/page.test.tsx" "app/[lang]/about/page.tsx" "app/[lang]/about/page.test.tsx" "app/[lang]/programs/page.tsx" "app/[lang]/programs/page.test.tsx" "app/[lang]/programs/[slug]/page.tsx" "app/[lang]/programs/[slug]/page.test.tsx"
git commit -m "feat: SEO metadata for home, about, and programs pages"
```

---

## Task 8: Apply SEO metadata — where-we-work, impact, news index, news detail

**Files:**
- Modify: `app/[lang]/where-we-work/page.tsx`, `app/[lang]/where-we-work/page.test.tsx`
- Modify: `app/[lang]/impact/page.tsx`, `app/[lang]/impact/page.test.tsx`
- Modify: `app/[lang]/news/page.tsx`, `app/[lang]/news/page.test.tsx`
- Modify: `app/[lang]/news/[slug]/page.tsx`, `app/[lang]/news/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `buildMetadata` (Task 2), `content.seo.{whereWeWork,impact,news}` (Task 1), and for the news detail page, the post's own existing `NewsPost.{title,summary}` (Phase 5 — no new content needed).
- Produces: `generateMetadata` exports on all four pages — no change to their default-exported components or rendered output.

- [ ] **Step 1: Replace `app/[lang]/where-we-work/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { RegionBlock } from '@/components/where-we-work/RegionBlock'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/where-we-work/',
    title: content.seo.whereWeWork.title,
    description: content.seo.whereWeWork.description,
  })
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

- [ ] **Step 2: Replace `app/[lang]/where-we-work/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WhereWeWorkPage, { generateMetadata } from '@/app/[lang]/where-we-work/page'

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

  it('renders the Somali version without crashing', () => {
    render(<WhereWeWorkPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Where We Work page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Where We Work | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/where-we-work/')
  })
})
```

- [ ] **Step 3: Replace `app/[lang]/impact/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllReports } from '@/lib/markdown'
import { ImpactResultsTable } from '@/components/impact/ImpactResultsTable'
import { FundsUseBar } from '@/components/impact/FundsUseBar'
import { ComplaintsBlock } from '@/components/impact/ComplaintsBlock'
import { ReportsSection } from '@/components/impact/ReportsSection'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/impact/',
    title: content.seo.impact.title,
    description: content.seo.impact.description,
  })
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

- [ ] **Step 4: Replace `app/[lang]/impact/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImpactPage, { generateMetadata } from '@/app/[lang]/impact/page'

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

describe('generateMetadata', () => {
  it('returns the Impact page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Impact & Accountability | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/impact/')
  })
})
```

- [ ] **Step 5: Replace `app/[lang]/news/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllNewsPosts } from '@/lib/markdown'
import { NewsFilters } from '@/components/news/NewsFilters'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/news/',
    title: content.seo.news.title,
    description: content.seo.news.description,
  })
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

- [ ] **Step 6: Replace `app/[lang]/news/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewsPage, { generateMetadata } from '@/app/[lang]/news/page'

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

describe('generateMetadata', () => {
  it('returns the News index page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('News & Stories | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/news/')
  })
})
```

- [ ] **Step 7: Replace `app/[lang]/news/[slug]/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllNewsPosts, getNewsPost } from '@/lib/markdown'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ConsentNotice } from '@/components/news/ConsentNotice'

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    getAllNewsPosts(lang).map((post) => ({ lang, slug: post.slug }))
  )
}

export function generateMetadata({
  params,
}: {
  params: { lang: Lang; slug: string }
}): Metadata {
  const post = getNewsPost(params.lang, params.slug)
  if (!post) {
    return {}
  }
  return buildMetadata({
    lang: params.lang,
    path: `/news/${params.slug}/`,
    title: post.title,
    description: post.summary,
  })
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

- [ ] **Step 8: Replace `app/[lang]/news/[slug]/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewsPostPage, { generateMetadata } from '@/app/[lang]/news/[slug]/page'

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

describe('generateMetadata', () => {
  it('derives title and description from the post itself, not a shared content.seo entry', () => {
    const metadata = generateMetadata({
      params: { lang: 'en', slug: 'shelter-kits-arrive-in-beledweyne' },
    })
    expect(metadata.title).toBe('Shelter kits arrive in Beledweyne (DEMO) | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe(
      '/en/news/shelter-kits-arrive-in-beledweyne/'
    )
  })
})
```

- [ ] **Step 9: Run the full suite**

Run: `npm test`
Expected: PASS, no failures.

- [ ] **Step 10: Commit**

```bash
git add "app/[lang]/where-we-work/page.tsx" "app/[lang]/where-we-work/page.test.tsx" "app/[lang]/impact/page.tsx" "app/[lang]/impact/page.test.tsx" "app/[lang]/news/page.tsx" "app/[lang]/news/page.test.tsx" "app/[lang]/news/[slug]/page.tsx" "app/[lang]/news/[slug]/page.test.tsx"
git commit -m "feat: SEO metadata for where-we-work, impact, and news pages"
```

---

## Task 9: Apply SEO metadata — get-involved, donate, contact

**Files:**
- Modify: `app/[lang]/get-involved/page.tsx`, `app/[lang]/get-involved/page.test.tsx`
- Modify: `app/[lang]/donate/page.tsx`, `app/[lang]/donate/page.test.tsx`
- Modify: `app/[lang]/contact/page.tsx`, `app/[lang]/contact/page.test.tsx`

**Interfaces:**
- Consumes: `buildMetadata` (Task 2), `content.seo.{getInvolved,donate,contact}` (Task 1).
- Produces: `generateMetadata` exports on all three pages — no change to their default-exported components or rendered output.

- [ ] **Step 1: Replace `app/[lang]/get-involved/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/get-involved/',
    title: content.seo.getInvolved.title,
    description: content.seo.getInvolved.description,
  })
}

export default function GetInvolvedPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { getInvolved } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{getInvolved.heading}</h1>
      <p className="mt-2 text-lg">{getInvolved.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{getInvolved.donateHeading}</h2>
        <p className="mt-2">{getInvolved.donateBody}</p>
        <Link href={`/${lang}/donate/`} className="mt-2 inline-block font-semibold underline">
          {getInvolved.donateCta}
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{getInvolved.partnerHeading}</h2>
        <p className="mt-2">{getInvolved.partnerBody}</p>
        <Link href={`/${lang}/contact/`} className="mt-2 inline-block font-semibold underline">
          {getInvolved.partnerCta}
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{getInvolved.workHeading}</h2>
        <p className="mt-2">{getInvolved.workBody}</p>
        <Link href={`/${lang}/contact/`} className="mt-2 inline-block font-semibold underline">
          {getInvolved.workCta}
        </Link>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Replace `app/[lang]/get-involved/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GetInvolvedPage, { generateMetadata } from '@/app/[lang]/get-involved/page'

describe('GetInvolvedPage', () => {
  it('renders all three paths in order, each linking to the right page', () => {
    render(<GetInvolvedPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['Get Involved', 'Donate', 'Partner With Us', 'Work With Us'])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get Involved')

    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute(
      'href',
      '/en/donate/'
    )
    expect(screen.getByRole('link', { name: 'Contact us to partner' })).toHaveAttribute(
      'href',
      '/en/contact/'
    )
    expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute(
      'href',
      '/en/contact/'
    )
    expect(
      screen.getByText(/No open positions or volunteer roles are listed here/)
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<GetInvolvedPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Get Involved page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Get Involved | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/get-involved/')
  })
})
```

- [ ] **Step 3: Replace `app/[lang]/donate/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { CopyableNumber } from '@/components/donate/CopyableNumber'
import { BankDetails } from '@/components/donate/BankDetails'
import { CardDonations } from '@/components/donate/CardDonations'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/donate/',
    title: content.seo.donate.title,
    description: content.seo.donate.description,
  })
}

export default function DonatePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { donate } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{donate.heading}</h1>
      <p className="mt-2 text-lg">{donate.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.mobileMoneyHeading}</h2>
        <p className="mt-2">{donate.mobileMoneyIntro}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <CopyableNumber
            label={donate.mobileMoneyProviders.evcPlus.label}
            number={donate.mobileMoneyProviders.evcPlus.number}
            ussd={donate.mobileMoneyProviders.evcPlus.ussd}
            copyButtonLabel={donate.copyButtonLabel}
            copiedLabel={donate.copiedLabel}
          />
          <CopyableNumber
            label={donate.mobileMoneyProviders.zaad.label}
            number={donate.mobileMoneyProviders.zaad.number}
            ussd={donate.mobileMoneyProviders.zaad.ussd}
            copyButtonLabel={donate.copyButtonLabel}
            copiedLabel={donate.copiedLabel}
          />
          <CopyableNumber
            label={donate.mobileMoneyProviders.sahal.label}
            number={donate.mobileMoneyProviders.sahal.number}
            ussd={donate.mobileMoneyProviders.sahal.ussd}
            copyButtonLabel={donate.copyButtonLabel}
            copiedLabel={donate.copiedLabel}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.bankHeading}</h2>
        <BankDetails lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.cardHeading}</h2>
        <CardDonations lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.safeguardingHeading}</h2>
        <p className="mt-2 text-sm">{donate.safeguardingStatement}</p>
        <p className="mt-2 text-sm">
          {donate.safeguardingLinkIntro}{' '}
          <Link href={`/${lang}/impact/`} className="underline">
            {content.impact.pageHeading}
          </Link>{' '}
          {donate.safeguardingLinkOutro}
        </p>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Replace `app/[lang]/donate/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DonatePage, { generateMetadata } from '@/app/[lang]/donate/page'

describe('DonatePage', () => {
  it('renders every section heading in order and all three mobile money providers', () => {
    render(<DonatePage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Donate',
      'Somali Mobile Money',
      'Bank Transfer',
      'Card Donations',
      'How Donations Are Safeguarded',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Donate')
    expect(screen.getByText('EVC Plus')).toBeInTheDocument()
    expect(screen.getByText('Zaad')).toBeInTheDocument()
    expect(screen.getByText('Sahal')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Card donations will be available here once our payment provider link is set up.'
      )
    ).toBeInTheDocument()

    const impactLink = screen.getByRole('link', { name: 'Impact & Accountability' })
    expect(impactLink).toHaveAttribute('href', '/en/impact/')
  })

  it('renders correctly for Somali without crashing', () => {
    render(<DonatePage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Donate page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Donate | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/donate/')
  })
})
```

- [ ] **Step 5: Replace `app/[lang]/contact/page.tsx` in full**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { OfficeCard } from '@/components/contact/OfficeCard'
import { ContactForm } from '@/components/contact/ContactForm'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/contact/',
    title: content.seo.contact.title,
    description: content.seo.contact.description,
  })
}

export default function ContactPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { contact } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{contact.heading}</h1>
      <p className="mt-2 text-lg">{contact.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{contact.officesHeading}</h2>
        <OfficeCard office={contact.offices.hiran} labels={contact.officeLabels} />
        <OfficeCard office={contact.offices.southwest} labels={contact.officeLabels} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{contact.formHeading}</h2>
        <ContactForm lang={lang} />
      </section>

      <section className="mt-8 rounded border border-accent/30 bg-accent/5 p-4">
        <p className="text-sm">{contact.safeguardingPrompt}</p>
        <Link href={`/${lang}/safeguarding/`} className="mt-2 inline-block font-semibold underline">
          {contact.safeguardingCta}
        </Link>
      </section>
    </div>
  )
}
```

- [ ] **Step 6: Replace `app/[lang]/contact/page.test.tsx` in full**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactPage, { generateMetadata } from '@/app/[lang]/contact/page'

describe('ContactPage', () => {
  it('renders both office cards, the contact form, and a prominent separate safeguarding link', () => {
    render(<ContactPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Contact',
      'Our Offices',
      'Beledweyne Office',
      'Baidoa Office',
      'Send a Message',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contact')
    expect(screen.getByRole('heading', { level: 3, name: 'Beledweyne Office' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Baidoa Office' })).toBeInTheDocument()

    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    const safeguardingLink = screen.getByRole('link', { name: 'Report a concern' })
    expect(safeguardingLink).toHaveAttribute('href', '/en/safeguarding/')
  })

  it('renders correctly for Somali without crashing', () => {
    render(<ContactPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Contact page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Contact Us | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/contact/')
  })
})
```

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS, no failures.

- [ ] **Step 8: Commit**

```bash
git add "app/[lang]/get-involved/page.tsx" "app/[lang]/get-involved/page.test.tsx" "app/[lang]/donate/page.tsx" "app/[lang]/donate/page.test.tsx" "app/[lang]/contact/page.tsx" "app/[lang]/contact/page.test.tsx"
git commit -m "feat: SEO metadata for get-involved, donate, and contact pages"
```

---

## Task 10: JSON-LD Organization schema

**Files:**
- Create: `lib/jsonld.ts`
- Create: `lib/jsonld.test.ts`
- Modify: `app/[lang]/layout.tsx`

**Interfaces:**
- Consumes: `getContent(lang).site.name` (existing).
- Produces: `buildOrganizationJsonLd(lang: Lang): string`, rendered once site-wide in the root `[lang]` layout.

- [ ] **Step 1: Write the failing test**

```ts
// lib/jsonld.test.ts
import { describe, it, expect } from 'vitest'
import { buildOrganizationJsonLd } from '@/lib/jsonld'

describe('buildOrganizationJsonLd', () => {
  it('returns valid JSON-LD with the correct schema.org type and organization name', () => {
    const json = buildOrganizationJsonLd('en')
    const parsed = JSON.parse(json)

    expect(parsed['@context']).toBe('https://schema.org')
    expect(parsed['@type']).toBe('NGO')
    expect(parsed.name).toBe('Horumar Resettlement Network')
  })

  it('returns the same organization name regardless of language, since it is a proper noun', () => {
    const enJson = JSON.parse(buildOrganizationJsonLd('en'))
    const soJson = JSON.parse(buildOrganizationJsonLd('so'))
    expect(enJson.name).toBe(soJson.name)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/jsonld.test.ts`
Expected: FAIL — `lib/jsonld.ts` does not exist.

- [ ] **Step 3: Implement `lib/jsonld.ts`**

```ts
import { getContent } from './content'
import type { Lang } from './i18n'

export function buildOrganizationJsonLd(lang: Lang): string {
  const content = getContent(lang)

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: content.site.name,
  })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/jsonld.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Modify `app/[lang]/layout.tsx` to render the JSON-LD script**

Add the import and render the script as the first child of `<body>`, before `<Header>`:

```tsx
import type { Metadata } from 'next'
import { Newsreader, IBM_Plex_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getContent } from '@/lib/content'
import { buildOrganizationJsonLd } from '@/lib/jsonld'
import { LANGS, type Lang } from '@/lib/i18n'
import '../globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const dynamicParams = false

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return {
    title: content.site.name,
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Lang }
}) {
  const { lang } = params

  return (
    <html lang={lang} className={`${newsreader.variable} ${plexSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildOrganizationJsonLd(lang) }}
        />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Verify the layout still renders correctly**

Run: `npm test`
Expected: PASS — existing page tests that render through this layout indirectly (none currently render the layout directly, since every page test renders its own `page.tsx` in isolation) are unaffected; no new test file is needed for the layout change itself since `buildOrganizationJsonLd` is already covered by Step 4's test and the JSX wiring is a one-line, visually-inspectable addition.

- [ ] **Step 7: Commit**

```bash
git add lib/jsonld.ts lib/jsonld.test.ts "app/[lang]/layout.tsx"
git commit -m "feat: Organization JSON-LD schema"
```

---

## Task 11: Sitemap and robots.txt

**Files:**
- Create: `lib/routes.ts`
- Create: `lib/routes.test.ts`
- Create: `app/sitemap.ts`
- Create: `app/sitemap.test.ts`
- Create: `app/robots.ts`
- Create: `app/robots.test.ts`

**Interfaces:**
- Consumes: `LANGS` from `@/lib/i18n`, `PROGRAM_SLUGS` from `@/components/home/programs-data`, `getAllNewsPosts` from `@/lib/markdown`.
- Produces: `getAllPagePaths(): string[]` (lang-agnostic paths, e.g. `/about/`), consumed by `app/sitemap.ts`.

- [ ] **Step 1: Write the failing test for `lib/routes.ts`**

```ts
// lib/routes.test.ts
import { describe, it, expect } from 'vitest'
import { getAllPagePaths } from '@/lib/routes'

describe('getAllPagePaths', () => {
  it('includes every static page, all four program sub-pages, and both news posts, with no duplicates', () => {
    const paths = getAllPagePaths()

    expect(paths).toContain('/')
    expect(paths).toContain('/about/')
    expect(paths).toContain('/programs/')
    expect(paths).toContain('/where-we-work/')
    expect(paths).toContain('/impact/')
    expect(paths).toContain('/news/')
    expect(paths).toContain('/get-involved/')
    expect(paths).toContain('/donate/')
    expect(paths).toContain('/contact/')
    expect(paths).toContain('/privacy/')
    expect(paths).toContain('/safeguarding/')
    expect(paths).toContain('/terms/')
    expect(paths).toContain('/programs/resettlement/')
    expect(paths).toContain('/programs/shelter/')
    expect(paths).toContain('/programs/livelihoods/')
    expect(paths).toContain('/programs/protection/')
    expect(paths).toContain('/news/shelter-kits-arrive-in-beledweyne/')
    expect(paths).toContain('/news/first-livelihoods-training-cohort/')

    expect(new Set(paths).size).toBe(paths.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/routes.test.ts`
Expected: FAIL — `lib/routes.ts` does not exist.

- [ ] **Step 3: Implement `lib/routes.ts`**

```ts
import { PROGRAM_SLUGS } from '@/components/home/programs-data'
import { LANGS } from './i18n'
import { getAllNewsPosts } from './markdown'

const STATIC_PATHS = [
  '/',
  '/about/',
  '/programs/',
  '/where-we-work/',
  '/impact/',
  '/news/',
  '/get-involved/',
  '/donate/',
  '/contact/',
  '/privacy/',
  '/safeguarding/',
  '/terms/',
]

export function getAllPagePaths(): string[] {
  const programPaths = PROGRAM_SLUGS.map((slug) => `/programs/${slug}/`)
  const newsPaths = Array.from(
    new Set(LANGS.flatMap((lang) => getAllNewsPosts(lang).map((post) => `/news/${post.slug}/`)))
  )

  return [...STATIC_PATHS, ...programPaths, ...newsPaths]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/routes.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Write the failing test for `app/sitemap.ts`**

```ts
// app/sitemap.test.ts
import { describe, it, expect } from 'vitest'
import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  it('includes both languages for every page path, as absolute URLs', () => {
    const entries = sitemap()
    const urls = entries.map((entry) => entry.url)

    expect(urls).toContain('https://example.org/en/about/')
    expect(urls).toContain('https://example.org/so/about/')
    expect(urls).toContain('https://example.org/en/privacy/')
    expect(urls).toContain('https://example.org/en/programs/resettlement/')
    expect(urls).toContain('https://example.org/en/news/shelter-kits-arrive-in-beledweyne/')
    expect(urls).toContain('https://example.org/en/')
    expect(urls).toContain('https://example.org/so/')
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run app/sitemap.test.ts`
Expected: FAIL — `app/sitemap.ts` does not exist.

- [ ] **Step 7: Implement `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { LANGS } from '@/lib/i18n'
import { getAllPagePaths } from '@/lib/routes'

// [SITE URL TO BE CONFIRMED] — replace with the real production domain once
// Phase 8 assigns one; sitemap.xml requires absolute URLs.
const SITE_URL = 'https://example.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getAllPagePaths()

  return LANGS.flatMap((lang) =>
    paths.map((path) => ({
      url: path === '/' ? `${SITE_URL}/${lang}/` : `${SITE_URL}/${lang}${path}`,
    }))
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run app/sitemap.test.ts`
Expected: PASS (1 test)

- [ ] **Step 9: Write the failing test for `app/robots.ts`**

```ts
// app/robots.test.ts
import { describe, it, expect } from 'vitest'
import robots from '@/app/robots'

describe('robots', () => {
  it('allows all crawlers and references the sitemap', () => {
    const result = robots()
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' })
    expect(result.sitemap).toBe('https://example.org/sitemap.xml')
  })
})
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx vitest run app/robots.test.ts`
Expected: FAIL — `app/robots.ts` does not exist.

- [ ] **Step 11: Implement `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

// [SITE URL TO BE CONFIRMED] — replace with the real production domain once
// Phase 8 assigns one.
const SITE_URL = 'https://example.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npx vitest run app/robots.test.ts`
Expected: PASS (1 test)

- [ ] **Step 13: Commit**

```bash
git add lib/routes.ts lib/routes.test.ts app/sitemap.ts app/sitemap.test.ts app/robots.ts app/robots.test.ts
git commit -m "feat: sitemap.xml and robots.txt generation"
```

---

## Task 12: Security headers

**Files:**
- Modify: `vercel.json`
- Create: `vercel.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: a `headers` block in `vercel.json` applied to all routes, verified by a Vitest test that parses the file as JSON.

- [ ] **Step 1: Write the failing test**

```ts
// vercel.test.ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

describe('vercel.json security headers', () => {
  it('applies CSP, HSTS, X-Frame-Options, and Referrer-Policy to all routes', () => {
    const raw = readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
    const config = JSON.parse(raw)

    const headerBlock = config.headers.find(
      (entry: { source: string }) => entry.source === '/(.*)'
    )
    expect(headerBlock).toBeDefined()

    const headerNames = headerBlock.headers.map((h: { key: string }) => h.key)
    expect(headerNames).toContain('Content-Security-Policy')
    expect(headerNames).toContain('Strict-Transport-Security')
    expect(headerNames).toContain('X-Frame-Options')
    expect(headerNames).toContain('Referrer-Policy')

    const csp = headerBlock.headers.find(
      (h: { key: string }) => h.key === 'Content-Security-Policy'
    ).value
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("form-action 'self' https://formspree.io")

    const xFrameOptions = headerBlock.headers.find(
      (h: { key: string }) => h.key === 'X-Frame-Options'
    ).value
    expect(xFrameOptions).toBe('DENY')
  })

  it('preserves the existing redirect from "/" to "/en/"', () => {
    const raw = readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
    const config = JSON.parse(raw)
    expect(config.redirects).toEqual([
      { source: '/', destination: '/en/', permanent: false },
    ])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run vercel.test.ts`
Expected: FAIL — `config.headers` is `undefined`.

- [ ] **Step 3: Replace `vercel.json` in full**

```json
{
  "redirects": [
    { "source": "/", "destination": "/en/", "permanent": false }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; form-action 'self' https://formspree.io; frame-ancestors 'none'; object-src 'none'; base-uri 'self'"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run vercel.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add vercel.json vercel.test.ts
git commit -m "feat: security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy)"
```

---

## Task 13: Final verification and launch checklist

**Files:**
- Modify: `CHECKLIST-BEFORE-LAUNCH.md`

**Interfaces:**
- Consumes: nothing new — this is a verification and documentation pass over Tasks 1-12.
- Produces: updated `CHECKLIST-BEFORE-LAUNCH.md`.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — every test from Phases 2-6 plus this phase's new tests, 0 failures.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Build the static export and verify output**

Run: `npm run build`
Expected: exits 0. Confirms these files exist and are non-empty: `out/en/privacy/index.html`, `out/so/privacy/index.html`, `out/en/safeguarding/index.html`, `out/so/safeguarding/index.html`, `out/en/terms/index.html`, `out/so/terms/index.html`, `out/sitemap.xml`, `out/robots.txt`.

- [ ] **Step 4: Verify the DRAFT comment and JSON-LD render in the static output**

Run: `grep -o "DRAFT — must be reviewed" out/en/privacy/index.html`
Expected: found.

Run: `grep -o 'application/ld+json' out/en/index.html`
Expected: found — confirms the JSON-LD script renders on the homepage (and, by the same layout, every page).

Run: `grep -o "<loc>" out/sitemap.xml | head -1`
Expected: found — confirms `sitemap.xml` contains real `<loc>` URL entries, not an empty or error page.

- [ ] **Step 5: Verify previously-404ing forward-links now resolve**

Run: `grep -o "Safeguarding" out/en/safeguarding/index.html | head -1`
Expected: found — confirms the About page's Commitments link, the Contact page's safeguarding callout, and the Footer's safeguarding link (all pointing here since Phase 4) now resolve.

- [ ] **Step 6: Extend `CHECKLIST-BEFORE-LAUNCH.md`**

Add a new section (keep everything already in the file — do not delete prior phases' entries):

```markdown

## Phase 7a (Legal Pages, SEO, Security Headers) — what's real vs. placeholder right now

- All three legal pages (Privacy, Safeguarding & PSEA, Terms) are unreviewed drafts — both the literal HTML comment and the visible on-page banner say so. They must be reviewed by the organization's legal/protection focal point before launch. The policy language itself is real and specific (not lorem ipsum, not demo filler) and is meant to be followed once reviewed — only the Terms page's governing-law jurisdiction is an honest placeholder pending confirmation of the organization's legal registration.
- Analytics (Plausible/Umami) was not wired up this phase, per explicit decision — needs a real account/site ID before it can be added.
- JSON-LD Organization schema is intentionally minimal (name only) — add `url`, `logo`, `address`, and `contactPoint` once a real domain and Section 0 facts exist; don't fill these with bracketed placeholder strings, since structured-data fields are parsed more strictly than visible page text.
- `sitemap.xml` and `robots.txt` use a placeholder production domain (`https://example.org`) in `app/sitemap.ts` and `app/robots.ts` — update the `SITE_URL` constant in both files once Phase 8 assigns the real domain.
- Security headers are configured in `vercel.json` but only take effect once the site is actually deployed (Phase 8).
- The Safeguarding & PSEA page now resolves — the About page's Commitments block link, the Contact page's safeguarding callout, and the Footer's safeguarding link (all pointing here since Phase 4) are no longer 404s. The Terms page resolves the Footer's terms link similarly.
```

- [ ] **Step 7: Commit**

```bash
git add CHECKLIST-BEFORE-LAUNCH.md
git commit -m "docs: extend launch checklist with Phase 7a placeholders"
```

- [ ] **Step 8: Report to the user in plain language**

Summarize: the site now has real (if legal-review-pending) Privacy, Safeguarding & PSEA, and Terms of Use pages — resolving forward-links that have 404'd since Phase 4. Every page on the site now has a unique, SEO-appropriate title and description in both languages, correct hreflang tags linking the English/Somali versions, Open Graph/Twitter card data, a site-wide Organization JSON-LD block, and a generated sitemap.xml/robots.txt. Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) are configured and will take effect once the site deploys. Nothing is deployed yet (Phase 8). The only thing the user needs to do: nothing yet — the real production domain, analytics account, and legal review of the three new pages are tracked in the checklist for when they're available. Phase 7b (accessibility audit + a real Lighthouse run against this finished site) is the next planned cycle.
