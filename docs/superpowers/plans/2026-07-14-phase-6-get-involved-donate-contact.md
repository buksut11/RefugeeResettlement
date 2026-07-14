# Phase 6 — Get Involved, Donate, Contact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Get Involved, Donate, and Contact pages — completing master prompt Sections 4.7-4.9 — per the approved Phase 6 design spec.

**Architecture:** Same static-export Next.js App Router pattern as Phases 2-5: each route gets its own `generateStaticParams`, copy flows through `getContent(lang)`, new presentational components live under `components/donate/` and `components/contact/`. One new client-side pattern this phase: `CopyableNumber` is a `'use client'` island using the Clipboard API, isolated to the mobile-money section only — everything else on all three pages is server-rendered and fully readable with JavaScript disabled.

**Tech Stack:** Unchanged from Phases 2-5 — Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, Vitest + React Testing Library. No new npm dependencies.

## Global Constraints

- Colour tokens (unchanged): Primary `#14355C`, Secondary `#2F6B4F`, Accent `#B5651D`, Ink `#201D1B`, Paper `#F7F5F0`.
- Trailing-slash URL convention continues: every internal `href` ends in `/`.
- The contact form POSTs to Formspree (not Netlify Forms — this project deploys to Vercel, a documented Phase 1 deviation, and Netlify Forms only works on Netlify hosting). The endpoint is an honest placeholder: `https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]`.
- Spam protection is a hidden honeypot field (`name="_gotcha"`, Formspree's documented convention) — never a CAPTCHA.
- Honeypot field must be `aria-hidden="true"` and `tabIndex={-1}` (not just visually hidden via CSS) so it is invisible to screen readers and unreachable by keyboard — a sighted mouse user must never be able to tab into or hear it announced.
- All mobile money numbers/USSD codes, bank transfer details, and office address/phone/WhatsApp/email are honest bracketed placeholders (`[X TO BE CONFIRMED]`) — Section 0 facts not yet supplied, never invented.
- The card-donations section is an honest empty-state note — no fake Stripe/Donorbox button or link, per the master prompt's explicit instruction never to build a custom payment form.
- Suggested giving levels are omitted entirely this phase — not built, not even as a placeholder section — per the master prompt's explicit instruction, since no unit costs have been supplied.
- The Get Involved page's "Work with us" statement describes the page's current content honestly ("no positions listed here") rather than asserting a fact about the organization's actual hiring status.
- The donation safeguarding statement and the Get Involved → Contact form reuse pattern are real, structural content — not demo-tagged (there is no "(DEMO)" on policy/mechanism text, consistent with Phase 4's Commitments block and Phase 5's complaints-intro treatment).
- Accessibility baseline continues: exactly one `h1` per page, semantic heading order, all interactive elements are real focusable `<a>`/`next/link`/`<button>`/form control elements.
- Never leave a `TODO` in code.
- The Safeguarding & PSEA link on the Contact page will 404 until Phase 7 builds the legal pages — expected mid-build, not a defect (same pattern as the About page's existing forward-link).

---

## File Structure

```
content/
  en.json                                    # extended: getInvolved.*, donate.*, contact.*
  so.json                                    # same new keys, demo/placeholder Somali content
lib/
  content.test.ts                            # extended with assertions + parity check for the new keys
components/
  donate/
    CopyableNumber.tsx                       # 'use client'
    CopyableNumber.test.tsx
    BankDetails.tsx
    BankDetails.test.tsx
    CardDonations.tsx
    CardDonations.test.tsx
  contact/
    OfficeCard.tsx
    OfficeCard.test.tsx
    ContactForm.tsx
    ContactForm.test.tsx
app/
  [lang]/
    donate/
      page.tsx
      page.test.tsx
    contact/
      page.tsx
      page.test.tsx
    get-involved/
      page.tsx
      page.test.tsx
CHECKLIST-BEFORE-LAUNCH.md                   # extended with Phase 6 placeholders
```

---

## Task 1: Content additions

**Files:**
- Modify: `content/en.json`
- Modify: `content/so.json`
- Modify: `lib/content.test.ts`

**Interfaces:**
- Consumes: existing `getContent(lang)` from `lib/content.ts` (unchanged).
- Produces: new content keys `getInvolved.*`, `donate.*` (including `donate.mobileMoneyProviders.{evcPlus,zaad,sahal}.{label,number,ussd}`), `contact.*` (including `contact.offices.{hiran,southwest}.{heading,address,phone,whatsapp,email}` and `contact.officeLabels.{address,phone,whatsapp,email}`) — consumed by Tasks 2-9's components and pages.

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

  it('includes Phase 5 News and Impact content keys', () => {
    const content = getContent('en')
    expect(content.news.pageHeading).toBe('News & Stories')
    expect(content.impact.pageHeading).toBe('Impact & Accountability')
  })

  it('includes Phase 6 Get Involved content keys', () => {
    const content = getContent('en')
    expect(content.getInvolved.heading).toBe('Get Involved')
    expect(content.getInvolved.workBody).toContain('contact form')
  })

  it('includes Phase 6 Donate content keys', () => {
    const content = getContent('en')
    expect(content.donate.heading).toBe('Donate')
    expect(content.donate.mobileMoneyProviders.evcPlus.label).toBe('EVC Plus')
    expect(content.donate.mobileMoneyProviders.evcPlus.number).toBe(
      '[EVC PLUS NUMBER TO BE CONFIRMED]'
    )
    expect(content.donate.bankName).toBe('[BANK NAME TO BE CONFIRMED]')
    expect(content.donate.cardEmptyState).toContain('payment provider')
  })

  it('includes Phase 6 Contact content keys', () => {
    const content = getContent('en')
    expect(content.contact.heading).toBe('Contact')
    expect(content.contact.offices.hiran.heading).toBe('Beledweyne Office')
    expect(content.contact.offices.southwest.heading).toBe('Baidoa Office')
    expect(content.contact.formspreeEndpoint).toBe(
      'https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]'
    )
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
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/content.test.ts`
Expected: FAIL on the Phase 6 tests — `content.getInvolved`, `content.donate`, `content.contact` are all `undefined`.

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
  },
  "getInvolved": {
    "heading": "Get Involved",
    "intro": "There are three ways to support our work. (DEMO)",
    "donateHeading": "Donate",
    "donateBody": "Support our programs with a one-time or recurring gift. (DEMO)",
    "donateCta": "Donate now",
    "partnerHeading": "Partner With Us",
    "partnerBody": "We welcome partnerships with donors, government agencies, and other organizations working in Hiran and Southwest State. (DEMO)",
    "partnerCta": "Contact us to partner",
    "workHeading": "Work With Us",
    "workBody": "No open positions or volunteer roles are listed here at this time. If you're interested in volunteering with us, please reach out through our contact form and mention your interest.",
    "workCta": "Contact us"
  },
  "donate": {
    "heading": "Donate",
    "intro": "Your support helps displaced families in Hiran and Southwest State rebuild their lives. (DEMO)",
    "mobileMoneyHeading": "Somali Mobile Money",
    "mobileMoneyIntro": "Send a donation directly using mobile money. (DEMO)",
    "copyButtonLabel": "Copy number",
    "copiedLabel": "Copied!",
    "mobileMoneyProviders": {
      "evcPlus": {
        "label": "EVC Plus",
        "number": "[EVC PLUS NUMBER TO BE CONFIRMED]",
        "ussd": "[EVC PLUS USSD CODE TO BE CONFIRMED]"
      },
      "zaad": {
        "label": "Zaad",
        "number": "[ZAAD NUMBER TO BE CONFIRMED]",
        "ussd": "[ZAAD USSD CODE TO BE CONFIRMED]"
      },
      "sahal": {
        "label": "Sahal",
        "number": "[SAHAL NUMBER TO BE CONFIRMED]",
        "ussd": "[SAHAL USSD CODE TO BE CONFIRMED]"
      }
    },
    "bankHeading": "Bank Transfer",
    "bankIntro": "For institutional donors, transfer directly to our bank account. (DEMO)",
    "bankNameLabel": "Bank Name",
    "bankName": "[BANK NAME TO BE CONFIRMED]",
    "accountNameLabel": "Account Name",
    "accountName": "[ACCOUNT NAME TO BE CONFIRMED]",
    "accountNumberLabel": "Account Number",
    "accountNumber": "[ACCOUNT NUMBER TO BE CONFIRMED]",
    "swiftLabel": "SWIFT/BIC",
    "swift": "[SWIFT CODE TO BE CONFIRMED]",
    "cardHeading": "Card Donations",
    "cardEmptyState": "Card donations will be available here once our payment provider link is set up.",
    "safeguardingHeading": "How Donations Are Safeguarded",
    "safeguardingStatement": "All donations are recorded, allocated according to our published funds-use breakdown, and subject to our financial accountability and safeguarding policies. See our Impact & Accountability page for details."
  },
  "contact": {
    "heading": "Contact",
    "intro": "Reach out to our offices or send us a message. (DEMO)",
    "officesHeading": "Our Offices",
    "officeLabels": {
      "address": "Address",
      "phone": "Phone",
      "whatsapp": "WhatsApp",
      "email": "Email"
    },
    "offices": {
      "hiran": {
        "heading": "Beledweyne Office",
        "address": "[ADDRESS TO BE CONFIRMED], Beledweyne, Hiran",
        "phone": "[PHONE NUMBER TO BE CONFIRMED]",
        "whatsapp": "[WHATSAPP NUMBER TO BE CONFIRMED]",
        "email": "[EMAIL TO BE CONFIRMED]"
      },
      "southwest": {
        "heading": "Baidoa Office",
        "address": "[ADDRESS TO BE CONFIRMED], Baidoa, Southwest State",
        "phone": "[PHONE NUMBER TO BE CONFIRMED]",
        "whatsapp": "[WHATSAPP NUMBER TO BE CONFIRMED]",
        "email": "[EMAIL TO BE CONFIRMED]"
      }
    },
    "formHeading": "Send a Message",
    "nameLabel": "Name",
    "emailLabel": "Email",
    "subjectLabel": "Subject",
    "messageLabel": "Message",
    "submitLabel": "Send message",
    "formspreeEndpoint": "https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]",
    "safeguardingPrompt": "If you need to report a safeguarding concern or complaint, please use our dedicated channel instead of this form.",
    "safeguardingCta": "Report a concern"
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
  },
  "getInvolved": {
    "heading": "Naga Qeyb Qaado",
    "intro": "Waxaa jira saddex siyaabood oo aad shaqadeenna u taageeri karto. (QORAAL DEMO AH)",
    "donateHeading": "Deeq Bixi",
    "donateBody": "Taageer barnaamijyadeenna hadiyad hal mar ah ama mid soo noqnoqota. (QORAAL DEMO AH)",
    "donateCta": "Deeq bixi hadda",
    "partnerHeading": "Nala Iskaashó",
    "partnerBody": "Waxaan soo dhaweynaa iskaashi la sameyno deeq-bixiyayaal, hay'adaha dawladda, iyo hay'ado kale oo ka shaqeeya Hiiraan iyo Koonfur Galbeed. (QORAAL DEMO AH)",
    "partnerCta": "Nala soo xiriir si aad u iskaashato",
    "workHeading": "Nala Shaqee",
    "workBody": "Wax boos banaan ama door mutadawac ah halkan lagama qorin waqtigan. Haddii aad xiisaynayso inaad naga qeyb qaadato mutadawac ahaan, fadlan nagala soo xiriir foomka nala soo xiriirka oo sheeg xiisahaaga.",
    "workCta": "Nala soo xiriir"
  },
  "donate": {
    "heading": "Deeq Bixi",
    "intro": "Taageeradaadu waxay caawisaa qoysaska barakacay ee Hiiraan iyo Koonfur Galbeed inay dib u dhisaan noloshooda. (QORAAL DEMO AH)",
    "mobileMoneyHeading": "Lacagta Mobilada Soomaalida",
    "mobileMoneyIntro": "Deeq toos ah ugu dir adigoo isticmaalaya lacagta mobilada. (QORAAL DEMO AH)",
    "copyButtonLabel": "Koobi lambarka",
    "copiedLabel": "La koobiyeeyay!",
    "mobileMoneyProviders": {
      "evcPlus": {
        "label": "EVC Plus",
        "number": "[LAMBARKA EVC PLUS WELI LAMA XAQIIJIN]",
        "ussd": "[XARIIQDA USSD EE EVC PLUS WELI LAMA XAQIIJIN]"
      },
      "zaad": {
        "label": "Zaad",
        "number": "[LAMBARKA ZAAD WELI LAMA XAQIIJIN]",
        "ussd": "[XARIIQDA USSD EE ZAAD WELI LAMA XAQIIJIN]"
      },
      "sahal": {
        "label": "Sahal",
        "number": "[LAMBARKA SAHAL WELI LAMA XAQIIJIN]",
        "ussd": "[XARIIQDA USSD EE SAHAL WELI LAMA XAQIIJIN]"
      }
    },
    "bankHeading": "Wareejinta Bangiga",
    "bankIntro": "Deeq-bixiyayaasha hay'adaha, si toos ah ugu wareeji xisaabta bangigeenna. (QORAAL DEMO AH)",
    "bankNameLabel": "Magaca Bangiga",
    "bankName": "[MAGACA BANGIGA WELI LAMA XAQIIJIN]",
    "accountNameLabel": "Magaca Xisaabta",
    "accountName": "[MAGACA XISAABTA WELI LAMA XAQIIJIN]",
    "accountNumberLabel": "Lambarka Xisaabta",
    "accountNumber": "[LAMBARKA XISAABTA WELI LAMA XAQIIJIN]",
    "swiftLabel": "SWIFT/BIC",
    "swift": "[XARIIQDA SWIFT WELI LAMA XAQIIJIN]",
    "cardHeading": "Deeqaha Kaararka",
    "cardEmptyState": "Deeqaha kaararku waxay halkan ka heli doonaan marka bixiyaha lacag-bixinta la dejiyo.",
    "safeguardingHeading": "Sida Deeqaha Loo Ilaaliyo",
    "safeguardingStatement": "Deeqaha oo dhan waa la duubaa, waxaana loo qaybiyaa sida ku qeexan qaybinta lacagaha ee la daabacay, waxaana ku xiran siyaasadaha xisaabtan bixinta iyo ilaalinta. Eeg bogga Saameynta iyo Xisaabtan Bixinta si aad wax badan u ogaato."
  },
  "contact": {
    "heading": "Nala Soo Xiriir",
    "intro": "Nala soo xiriir xafiisyadeenna ama nagu soo dir fariin. (QORAAL DEMO AH)",
    "officesHeading": "Xafiisyadeenna",
    "officeLabels": {
      "address": "Ciwaanka",
      "phone": "Telefoon",
      "whatsapp": "WhatsApp",
      "email": "Iimayl"
    },
    "offices": {
      "hiran": {
        "heading": "Xafiiska Beledweyne",
        "address": "[CIWAANKA WELI LAMA XAQIIJIN], Beledweyne, Hiiraan",
        "phone": "[LAMBARKA TALEEFANKA WELI LAMA XAQIIJIN]",
        "whatsapp": "[LAMBARKA WHATSAPP WELI LAMA XAQIIJIN]",
        "email": "[IIMAYLKA WELI LAMA XAQIIJIN]"
      },
      "southwest": {
        "heading": "Xafiiska Baydhabo",
        "address": "[CIWAANKA WELI LAMA XAQIIJIN], Baydhabo, Koonfur Galbeed",
        "phone": "[LAMBARKA TALEEFANKA WELI LAMA XAQIIJIN]",
        "whatsapp": "[LAMBARKA WHATSAPP WELI LAMA XAQIIJIN]",
        "email": "[IIMAYLKA WELI LAMA XAQIIJIN]"
      }
    },
    "formHeading": "Nagu Soo Dir Fariin",
    "nameLabel": "Magaca",
    "emailLabel": "Iimayl",
    "subjectLabel": "Mowduuca",
    "messageLabel": "Fariinta",
    "submitLabel": "Dir fariinta",
    "formspreeEndpoint": "https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]",
    "safeguardingPrompt": "Haddii aad u baahan tahay inaad soo sheegto walaac ilaalineed ama cabasho, fadlan isticmaal kanaalka gaarka ah ee ilaalinta halkii aad ka isticmaali lahayd foomkan.",
    "safeguardingCta": "Soo sheeg walaac"
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 6: Commit**

```bash
git add content/en.json content/so.json lib/content.test.ts
git commit -m "content: add Phase 6 Get Involved, Donate, and Contact copy"
```

---

## Task 2: CopyableNumber component

**Files:**
- Create: `components/donate/CopyableNumber.tsx`
- Create: `components/donate/CopyableNumber.test.tsx`

**Interfaces:**
- Consumes: nothing new — takes `label`, `number`, `ussd`, `copyButtonLabel`, `copiedLabel` as plain string props (same "presentational component takes props, doesn't call getContent itself" pattern as Phase 4's `StoryBlock`).
- Produces: `CopyableNumber({ label: string, number: string, ussd: string, copyButtonLabel: string, copiedLabel: string })` `'use client'` component, consumed by the Donate page (Task 5).

- [ ] **Step 1: Write the failing test**

```tsx
// components/donate/CopyableNumber.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CopyableNumber } from '@/components/donate/CopyableNumber'

describe('CopyableNumber', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders the number as a tel link and shows the USSD code', () => {
    render(
      <CopyableNumber
        label="EVC Plus"
        number="[EVC PLUS NUMBER TO BE CONFIRMED]"
        ussd="[EVC PLUS USSD CODE TO BE CONFIRMED]"
        copyButtonLabel="Copy number"
        copiedLabel="Copied!"
      />
    )

    expect(screen.getByText('EVC Plus')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: '[EVC PLUS NUMBER TO BE CONFIRMED]' })
    expect(link).toHaveAttribute('href', 'tel:[EVC PLUS NUMBER TO BE CONFIRMED]')
    expect(screen.getByText('[EVC PLUS USSD CODE TO BE CONFIRMED]')).toBeInTheDocument()
  })

  it('copies the number to the clipboard and shows a confirmation', async () => {
    render(
      <CopyableNumber
        label="EVC Plus"
        number="[EVC PLUS NUMBER TO BE CONFIRMED]"
        ussd="[EVC PLUS USSD CODE TO BE CONFIRMED]"
        copyButtonLabel="Copy number"
        copiedLabel="Copied!"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Copy number' }))

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '[EVC PLUS NUMBER TO BE CONFIRMED]'
    )
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/donate/CopyableNumber.test.tsx`
Expected: FAIL — `components/donate/CopyableNumber.tsx` does not exist.

- [ ] **Step 3: Implement `components/donate/CopyableNumber.tsx`**

```tsx
'use client'

import { useState } from 'react'

export function CopyableNumber({
  label,
  number,
  ussd,
  copyButtonLabel,
  copiedLabel,
}: {
  label: string
  number: string
  ussd: string
  copyButtonLabel: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(number)
    setCopied(true)
  }

  return (
    <div className="rounded border border-primary/20 p-4">
      <p className="font-display font-semibold">{label}</p>
      <a href={`tel:${number}`} className="mt-1 block text-lg">
        {number}
      </a>
      <p className="mt-1 text-xs text-ink/60">{ussd}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-2 rounded border border-primary/20 px-3 py-1 text-sm"
      >
        {copied ? copiedLabel : copyButtonLabel}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/donate/CopyableNumber.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add components/donate/CopyableNumber.tsx components/donate/CopyableNumber.test.tsx
git commit -m "feat: copyable mobile money number component"
```

---

## Task 3: BankDetails component

**Files:**
- Create: `components/donate/BankDetails.tsx`
- Create: `components/donate/BankDetails.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).donate.*` (Task 1).
- Produces: `BankDetails({ lang: Lang })` component, consumed by the Donate page (Task 5).

- [ ] **Step 1: Write the failing test**

```tsx
// components/donate/BankDetails.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BankDetails } from '@/components/donate/BankDetails'

describe('BankDetails', () => {
  it('renders the intro and all four labeled bank fields', () => {
    render(<BankDetails lang="en" />)

    expect(
      screen.getByText('For institutional donors, transfer directly to our bank account. (DEMO)')
    ).toBeInTheDocument()
    expect(screen.getByText('Bank Name')).toBeInTheDocument()
    expect(screen.getByText('[BANK NAME TO BE CONFIRMED]')).toBeInTheDocument()
    expect(screen.getByText('Account Name')).toBeInTheDocument()
    expect(screen.getByText('[ACCOUNT NAME TO BE CONFIRMED]')).toBeInTheDocument()
    expect(screen.getByText('Account Number')).toBeInTheDocument()
    expect(screen.getByText('[ACCOUNT NUMBER TO BE CONFIRMED]')).toBeInTheDocument()
    expect(screen.getByText('SWIFT/BIC')).toBeInTheDocument()
    expect(screen.getByText('[SWIFT CODE TO BE CONFIRMED]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/donate/BankDetails.test.tsx`
Expected: FAIL — `components/donate/BankDetails.tsx` does not exist.

- [ ] **Step 3: Implement `components/donate/BankDetails.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function BankDetails({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const { donate } = content

  return (
    <div className="mt-4 text-sm">
      <p>{donate.bankIntro}</p>
      <dl className="mt-4 space-y-2">
        <div>
          <dt className="font-semibold">{donate.bankNameLabel}</dt>
          <dd>{donate.bankName}</dd>
        </div>
        <div>
          <dt className="font-semibold">{donate.accountNameLabel}</dt>
          <dd>{donate.accountName}</dd>
        </div>
        <div>
          <dt className="font-semibold">{donate.accountNumberLabel}</dt>
          <dd>{donate.accountNumber}</dd>
        </div>
        <div>
          <dt className="font-semibold">{donate.swiftLabel}</dt>
          <dd>{donate.swift}</dd>
        </div>
      </dl>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/donate/BankDetails.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/donate/BankDetails.tsx components/donate/BankDetails.test.tsx
git commit -m "feat: bank transfer details component"
```

---

## Task 4: CardDonations component

**Files:**
- Create: `components/donate/CardDonations.tsx`
- Create: `components/donate/CardDonations.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).donate.cardEmptyState` (Task 1).
- Produces: `CardDonations({ lang: Lang })` component, consumed by the Donate page (Task 5).

- [ ] **Step 1: Write the failing test**

```tsx
// components/donate/CardDonations.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardDonations } from '@/components/donate/CardDonations'

describe('CardDonations', () => {
  it('renders the honest empty-state note with no fake payment link', () => {
    render(<CardDonations lang="en" />)

    expect(
      screen.getByText(
        'Card donations will be available here once our payment provider link is set up.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/donate/CardDonations.test.tsx`
Expected: FAIL — `components/donate/CardDonations.tsx` does not exist.

- [ ] **Step 3: Implement `components/donate/CardDonations.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function CardDonations({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  return <p className="mt-4 text-sm">{content.donate.cardEmptyState}</p>
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/donate/CardDonations.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/donate/CardDonations.tsx components/donate/CardDonations.test.tsx
git commit -m "feat: card donations honest empty-state component"
```

---

## Task 5: Donate page

**Files:**
- Create: `app/[lang]/donate/page.tsx`
- Create: `app/[lang]/donate/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).donate.*` (Task 1), `CopyableNumber` (Task 2), `BankDetails` (Task 3), `CardDonations` (Task 4), `LANGS`/`Lang` from `@/lib/i18n` (Phase 2).
- Produces: the `/​{lang}​/donate/` route. This resolves two existing forward-links that have 404'd since Phase 3/4: the homepage Hero's "Support our work" button and every program sub-page's "Support this program" button both link to `/{lang}/donate/`.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/donate/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DonatePage from '@/app/[lang]/donate/page'

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
  })

  it('renders correctly for Somali without crashing', () => {
    render(<DonatePage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/donate/page.test.tsx"`
Expected: FAIL — `app/[lang]/donate/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/donate/page.tsx`**

```tsx
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { CopyableNumber } from '@/components/donate/CopyableNumber'
import { BankDetails } from '@/components/donate/BankDetails'
import { CardDonations } from '@/components/donate/CardDonations'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
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
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/donate/page.test.tsx"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/donate/page.tsx" "app/[lang]/donate/page.test.tsx"
git commit -m "feat: compose Donate page"
```

---

## Task 6: OfficeCard component

**Files:**
- Create: `components/contact/OfficeCard.tsx`
- Create: `components/contact/OfficeCard.test.tsx`

**Interfaces:**
- Consumes: nothing new — takes an `office` object and shared `labels` object as props (shaped like `getContent(lang).contact.offices.hiran` / `.officeLabels` from Task 1), following the same "data + shared labels" pattern as Phase 4's `RegionBlock`.
- Produces: `OfficeCard({ office: Office, labels: OfficeLabels })` component, consumed by the Contact page (Task 8).

- [ ] **Step 1: Write the failing test**

```tsx
// components/contact/OfficeCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OfficeCard } from '@/components/contact/OfficeCard'

const office = {
  heading: 'Beledweyne Office',
  address: '[ADDRESS TO BE CONFIRMED], Beledweyne, Hiran',
  phone: '[PHONE NUMBER TO BE CONFIRMED]',
  whatsapp: '[WHATSAPP NUMBER TO BE CONFIRMED]',
  email: '[EMAIL TO BE CONFIRMED]',
}

const labels = {
  address: 'Address',
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  email: 'Email',
}

describe('OfficeCard', () => {
  it('renders the office heading and all four labeled contact fields', () => {
    render(<OfficeCard office={office} labels={labels} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Beledweyne Office' })).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('[ADDRESS TO BE CONFIRMED], Beledweyne, Hiran')).toBeInTheDocument()
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

Run: `npx vitest run components/contact/OfficeCard.test.tsx`
Expected: FAIL — `components/contact/OfficeCard.tsx` does not exist.

- [ ] **Step 3: Implement `components/contact/OfficeCard.tsx`**

```tsx
type Office = {
  heading: string
  address: string
  phone: string
  whatsapp: string
  email: string
}

type OfficeLabels = {
  address: string
  phone: string
  whatsapp: string
  email: string
}

export function OfficeCard({ office, labels }: { office: Office; labels: OfficeLabels }) {
  return (
    <div className="mt-4 rounded border border-primary/20 p-4 text-sm">
      <h3 className="font-display text-lg font-semibold">{office.heading}</h3>
      <dl className="mt-2 space-y-2">
        <div>
          <dt className="font-semibold">{labels.address}</dt>
          <dd>{office.address}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.phone}</dt>
          <dd>{office.phone}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.whatsapp}</dt>
          <dd>{office.whatsapp}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.email}</dt>
          <dd>{office.email}</dd>
        </div>
      </dl>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/contact/OfficeCard.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/contact/OfficeCard.tsx components/contact/OfficeCard.test.tsx
git commit -m "feat: office card component for Contact page"
```

---

## Task 7: ContactForm component

**Files:**
- Create: `components/contact/ContactForm.tsx`
- Create: `components/contact/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).contact.*` (Task 1).
- Produces: `ContactForm({ lang: Lang })` component, consumed by the Contact page (Task 8).

- [ ] **Step 1: Write the failing test**

```tsx
// components/contact/ContactForm.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactForm } from '@/components/contact/ContactForm'

describe('ContactForm', () => {
  it('renders a POST form to the Formspree placeholder endpoint with all fields, correct required attributes, and a hidden honeypot', () => {
    const { container } = render(<ContactForm lang="en" />)

    const form = container.querySelector('form')
    expect(form).toHaveAttribute('method', 'POST')
    expect(form).toHaveAttribute('action', 'https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]')

    expect(screen.getByLabelText('Name')).toBeRequired()
    expect(screen.getByLabelText('Email')).toBeRequired()
    expect(screen.getByLabelText('Message')).toBeRequired()
    expect(screen.getByLabelText('Subject')).not.toBeRequired()

    const honeypot = container.querySelector('input[name="_gotcha"]')
    expect(honeypot).not.toBeNull()
    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
    expect(honeypot).toHaveAttribute('tabindex', '-1')

    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/contact/ContactForm.test.tsx`
Expected: FAIL — `components/contact/ContactForm.tsx` does not exist.

- [ ] **Step 3: Implement `components/contact/ContactForm.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function ContactForm({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const { contact } = content

  return (
    <form method="POST" action={contact.formspreeEndpoint} className="mt-4 space-y-4 text-sm">
      <input
        type="text"
        name="_gotcha"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px' }}
      />
      <div>
        <label htmlFor="contact-name">{contact.nameLabel}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <div>
        <label htmlFor="contact-email">{contact.emailLabel}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <div>
        <label htmlFor="contact-subject">{contact.subjectLabel}</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <div>
        <label htmlFor="contact-message">{contact.messageLabel}</label>
        <textarea
          id="contact-message"
          name="message"
          required
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <button type="submit" className="rounded bg-primary px-4 py-2 text-paper">
        {contact.submitLabel}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/contact/ContactForm.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/contact/ContactForm.tsx components/contact/ContactForm.test.tsx
git commit -m "feat: contact form component"
```

---

## Task 8: Contact page

**Files:**
- Create: `app/[lang]/contact/page.tsx`
- Create: `app/[lang]/contact/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).contact.*` (Task 1), `OfficeCard` (Task 6), `ContactForm` (Task 7), `LANGS`/`Lang` from `@/lib/i18n` (Phase 2).
- Produces: the `/​{lang}​/contact/` route.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/contact/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactPage from '@/app/[lang]/contact/page'

describe('ContactPage', () => {
  it('renders both office cards, the contact form, and a prominent separate safeguarding link', () => {
    render(<ContactPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['Contact', 'Our Offices', 'Send a Message'])

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/contact/page.test.tsx"`
Expected: FAIL — `app/[lang]/contact/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/contact/page.tsx`**

```tsx
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { OfficeCard } from '@/components/contact/OfficeCard'
import { ContactForm } from '@/components/contact/ContactForm'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/contact/page.test.tsx"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/contact/page.tsx" "app/[lang]/contact/page.test.tsx"
git commit -m "feat: compose Contact page"
```

---

## Task 9: Get Involved page

**Files:**
- Create: `app/[lang]/get-involved/page.tsx`
- Create: `app/[lang]/get-involved/page.test.tsx`

**Interfaces:**
- Consumes: `getContent(lang).getInvolved.*` (Task 1), `LANGS`/`Lang` from `@/lib/i18n` (Phase 2). No new components — each of the three sections is simple inline heading/body/link JSX, following the same pattern as Phase 4's About page (which also composed several plain content sections directly in the page without extracting a component per section).
- Produces: the `/​{lang}​/get-involved/` route — no other task touches this file.

- [ ] **Step 1: Write the failing test**

```tsx
// app/[lang]/get-involved/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GetInvolvedPage from '@/app/[lang]/get-involved/page'

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/get-involved/page.test.tsx"`
Expected: FAIL — `app/[lang]/get-involved/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/get-involved/page.tsx`**

```tsx
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/get-involved/page.test.tsx"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add "app/[lang]/get-involved/page.tsx" "app/[lang]/get-involved/page.test.tsx"
git commit -m "feat: compose Get Involved page"
```

---

## Task 10: Final verification and launch checklist

**Files:**
- Modify: `CHECKLIST-BEFORE-LAUNCH.md`

**Interfaces:**
- Consumes: nothing new — this is a verification and documentation pass over Tasks 1-9.
- Produces: updated `CHECKLIST-BEFORE-LAUNCH.md`.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — every test from Phases 2-5 plus this phase's new tests, 0 failures.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Build the static export and verify output**

Run: `npm run build`
Expected: exits 0. Confirms these files exist and are non-empty: `out/en/get-involved/index.html`, `out/so/get-involved/index.html`, `out/en/donate/index.html`, `out/so/donate/index.html`, `out/en/contact/index.html`, `out/so/contact/index.html`.

- [ ] **Step 4: Verify previously-404ing forward-links now resolve**

Run: `grep -o 'Donate' out/en/donate/index.html | head -1`
Expected: found — confirms the Donate page (previously only linked to, from Hero and program sub-pages) now actually exists.

Run: `grep -o 'Somali Mobile Money' out/en/donate/index.html`
Expected: found.

Run: `grep -o 'aria-hidden="true"' out/en/contact/index.html | head -1`
Expected: found — confirms the honeypot field renders in the static output.

- [ ] **Step 5: Extend `CHECKLIST-BEFORE-LAUNCH.md`**

Add a new section (keep everything already in the file — do not delete prior phases' entries):

```markdown

## Phase 6 (Get Involved, Donate, Contact) — what's real vs. placeholder right now

- All three mobile money numbers and USSD codes (EVC Plus, Zaad, Sahal) are honest placeholders — the Copy button is fully functional but copies placeholder text until real numbers are supplied.
- Bank transfer details (bank name, account name, account number, SWIFT/BIC) are honest placeholders pending Section 0 facts.
- The card donations section is an honest empty state — no Stripe Payment Link or Donorbox embed has been supplied yet, and none was fabricated. Populate `content.donate` with a real link once the organization provides one; do not build a custom payment form per the master prompt's explicit instruction.
- Suggested giving levels were omitted entirely this phase, per the master prompt's own instruction, since no unit costs have been supplied.
- The Contact page's Formspree endpoint (`content.contact.formspreeEndpoint`) is a placeholder — the contact form will not actually submit anywhere until a real Formspree form ID is configured.
- Office address/phone/WhatsApp/email on the Contact page are placeholders, same unconfirmed Section 0 facts tracked since Phase 2.
- The Contact page's Safeguarding & PSEA link will 404 until Phase 7 builds the legal pages — expected mid-build, not a defect.
- The Get Involved page's "Work with us" section describes the page's current content (no positions listed) rather than asserting the organization has no vacancies — update this copy directly if/when real listings exist.
- The Hero button and every program sub-page's "Support this program" button, which linked to `/donate/` since Phases 3-4, now resolve correctly.
```

- [ ] **Step 6: Commit**

```bash
git add CHECKLIST-BEFORE-LAUNCH.md
git commit -m "docs: extend launch checklist with Phase 6 placeholders"
```

- [ ] **Step 7: Report to the user in plain language**

Summarize: the site now has a Get Involved page (three paths: donate, partner, work with us), a full Donate page (mobile money with working copy-to-clipboard, bank transfer details, an honest card-donations placeholder, and a safeguarding statement), and a Contact page (two office cards, a working contact form structure posting to a placeholder Formspree endpoint, and a prominent separate safeguarding/complaints link). This also resolves several forward-links that have 404'd since Phase 3. Nothing is deployed yet (Phase 8). The only thing the user needs to do: nothing yet — real mobile money numbers, bank details, a payment provider link, a Formspree endpoint, and office contact details get filled in as the checklist and later phases progress.
