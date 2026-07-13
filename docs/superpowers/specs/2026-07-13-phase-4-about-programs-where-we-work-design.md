# Design: Phase 4 — About, Programs, Where We Work

Status: Approved. Builds on `2026-07-13-refugee-resettlement-website-design.md` (Phase 1 design) and the completed Phase 2 (Foundation) and Phase 3 (Homepage). Implements master prompt Sections 4.2, 4.3, and 4.4.

## 1. Scope

This phase adds seven pages, all under the existing `[lang]` routing:

- `/{lang}/about/`
- `/{lang}/programs/` (index)
- `/{lang}/programs/{slug}/` — one per program (`resettlement`, `shelter`, `livelihoods`, `protection`), reusing `PROGRAM_SLUGS` from `components/home/programs-data.ts`
- `/{lang}/where-we-work/`

All are static, content-JSON-driven pages using the header/footer/i18n scaffolding from Phase 2. No new dependencies, no new architecture — same Next.js static export + `getContent(lang)` pattern throughout.

## 2. Routing and static params

Each new route segment gets its own `generateStaticParams`, following the pattern already established in `app/[lang]/layout.tsx`:

- `/{lang}/about/`, `/{lang}/programs/`, `/{lang}/where-we-work/` each generate over `LANGS` only.
- `/{lang}/programs/{slug}/` generates over the cross product of `LANGS` × `PROGRAM_SLUGS` (8 static pages total).

## 3. Content additions

New keys added to `content/en.json` / `content/so.json`:

- `about.*` — heading, whoWeAre, mission, vision, values (list), ourStory, leadership (array of `{name, role, bio}`), legalGovernance, commitments (Humanitarian Principles, CHS, PSEA-with-link-to-safeguarding, Do No Harm — four short statements).
- `programs.{slug}.*` — extends the existing `title`/`summary` (Phase 3) with `problem`, `whatWeDo`, `whereText`, `measurement`, `story`, `storyAttribution`.
- `whereWeWork.*` — heading, intro, and per-region blocks for Hiran/Hirshabelle and Southwest State: `displacementContext`, `districts`, `office`, `whatWeRun`, `coordination`.

## 4. Placeholder conventions (continuing established project rules)

Every piece of content not yet confirmed by the user follows the same tagging rules used since Phase 2 — written now so pages aren't empty, but never presented as final:

- **Leadership & board** — Section 0 has no real names yet. Renders 2–3 demo entries (`(DEMO)` / `(QORAAL DEMO AH)` tagged name/role/bio), each with a placeholder photo box (same pattern as the Hero photo placeholder — a styled `<div>`, never a fabricated stock image).
- **Anonymized program stories** — per user decision, each program sub-page gets one short, clearly demo-tagged fictional story (`(DEMO STORY)` / Somali equivalent), consistent with how hero copy and program summaries were handled in Phase 3. Not a real beneficiary account.
- **Legal registration & governance** — registration number is an unconfirmed Section 0 fact; renders the literal placeholder `[REGISTRATION NUMBER TO BE CONFIRMED]`.
- **Coordination partners** — different treatment from the above: rather than a demo-tagged *invented* organization name, this renders an honest `[COORDINATION PARTNERS TO BE CONFIRMED]` placeholder. Naming real humanitarian organizations (UNHCR, IOM, etc.) without confirmation risks implying a partnership that doesn't exist, which is a materially different risk than a fictional demo hero headline — so no plausible-sounding names are invented here, demo-tagged or not.
- **Districts covered / field offices** — continues using Beledweyne (Hiran) / Baidoa (Southwest) structurally, per existing Phase 2/3 convention; already tracked in `CHECKLIST-BEFORE-LAUNCH.md` as unconfirmed.

## 5. Where We Work — verified factual content (not a placeholder)

The master prompt explicitly requires verifying the 2023 Shabelle river flooding claim before stating it. This was researched and confirmed: the Shabelle River burst its banks at Belet Weyne (Hiran/Hirshabelle) in May 2023 in its worst flooding in roughly 30 years, affecting an estimated 200,000+ people and flooding around 79% of the town, as part of flooding across Somalia that displaced hundreds of thousands (sources: IOM, ReliefWeb/OCHA situation reports, FAO — see the implementation plan for citations). This fact is written as **verified content**, distinct from the demo-tagged placeholders above, and cited inline (e.g., "Sources: IOM, OCHA" footnote) so it's clear this claim was checked rather than invented. Drought and conflict as general displacement drivers are stated only in general terms (well-established, non-specific), not tied to invented dates or figures.

## 6. Components

- `components/about/Leadership.tsx` (+ test) — renders the leadership array as cards with placeholder photo boxes.
- `components/about/CommitmentsBlock.tsx` (+ test) — the four-statement commitments block, with the PSEA statement linking to `/{lang}/safeguarding/` (won't resolve until the Phase 7 legal pages are built — expected mid-build, same pattern as Phase 3's forward-links to `/donate/` and `/programs/`).
- `components/programs/ProgramDetail.tsx` (+ test) — renders one program's problem/what-we-do/where/measurement/story sections; used by each `[slug]/page.tsx`.
- `components/programs/StoryBlock.tsx` (+ test) — the demo-tagged anonymized story, isolated so its placeholder styling (e.g., a visible "Demo story" label) is applied in one place.
- `components/where-we-work/RegionBlock.tsx` (+ test) — one region's context/districts/office/whatWeRun/coordination; used twice (Hiran, Southwest) with anchor ids `#hiran` / `#southwest` matching the Phase 3 homepage map's existing links.

Programs index page (`/programs/`) reuses the existing `ProgramCard`/`ProgramsSection` components from Phase 3, rendered as a full page with its own `h1` and a short intro paragraph — not embedded under a homepage `h2` as it is on the homepage.

## 7. Accessibility carryover

Same rules as Phase 2/3: exactly one `h1` per page (owned by each page's top-level heading), semantic heading order, all links real focusable `<a>`/`next/link` elements, `nav`/landmark structure unchanged.

## 8. Open items carried to `CHECKLIST-BEFORE-LAUNCH.md`

- Leadership/board names, roles, bios, and photos are demo placeholders — replace once real Section 0 facts are supplied.
- Program sub-page stories are fictional demo content, clearly tagged — replace with real, consented, anonymized stories before launch.
- Registration number is an unconfirmed placeholder.
- Coordination partners are an honest "to be confirmed" placeholder, not invented names — do not fill in with real organization names until an actual partnership is confirmed by the user.
- Safeguarding page link (from the About commitments block) will 404 until Phase 7 builds the legal pages — expected mid-build, not a defect.
- The 2023 Shabelle river flooding claim is verified/sourced (see Section 5) — if the user later wants this citation removed or a different framing, flag it, but do not silently un-verify it.
