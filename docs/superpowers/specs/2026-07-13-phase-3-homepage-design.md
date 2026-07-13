# Design: Phase 3 — Homepage

Status: Approved. Builds on `2026-07-13-refugee-resettlement-website-design.md` (Phase 1 design) and the completed Phase 2 (Foundation). Implements master prompt Section 4.1.

## 1. Scope

This phase builds the full homepage at `app/[lang]/page.tsx`, replacing the Phase 2 stub. Per the Phase 1 wireframe, in order: Hero → Where We Work (Somalia map) → What We Do (4 program cards) → Impact strip → Latest news → Partners → Footer (Footer already exists from Phase 2).

## 2. Somalia map — real geographic data (confirmed deviation from Phase 1)

Phase 1's spec called for a "hand-drawn-feel" illustrative map. During Phase 3 brainstorming the user asked for a **geographically accurate** map instead. Decision, confirmed with the user and visually approved:

- **Data source:** [geoBoundaries](https://www.geoboundaries.org) ADM0 (national) and ADM1 (regional) boundaries for Somalia, CC-BY 4.0 licensed. Fetched from `https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/SOM/ADM0/geoBoundaries-SOM-ADM0_simplified.geojson` and the ADM1 equivalent.
- **No federal-member-state boundary dataset exists publicly** (confirmed via search — Somalia's six federal member states, including Hirshabelle and South West, are not present in any admin boundary dataset, even at ADM2). The map therefore highlights the underlying traditional regions that compose each area of operation:
  - "Hiran / Hirshabelle" = **Hiiraan** + **Middle Shebelle** regions (shapeName values in the ADM1 file)
  - "Southwest State" = **Bay** + **Bakool** + **Lower Shebelle** regions
- **Rendering method:** lat/lon coordinates projected to a 400×500 SVG viewBox with a simple linear equirectangular projection (justified at Somalia's near-equatorial latitude — no aspect distortion correction needed). Adjacent regions of the same highlight color are rendered as separate filled `<path>`s with **no stroke between them**, so shared borders disappear visually without needing true polygon-union geometry (regions share exact border vertices in the source data).
- **Pins:** Beledweyne (45.2036°E, 4.7358°N) and Baidoa (43.6499°E, 3.1136°N), projected with the same transform, rendered as small labeled circles.
- **Colors:** national outline stroked in Primary (`#14355C`); Hiran/Hirshabelle fill in Secondary (`#2F6B4F`) at 85% opacity; Southwest fill in Accent (`#B5651D`) at 85% opacity — reusing the approved Phase 1 palette, no new tokens.
- **Attribution requirement (legal, not a placeholder):** CC-BY 4.0 requires attribution. A small credit line ("Map data: geoBoundaries, CC-BY 4.0") must be rendered near the map (e.g., in small print beneath it), in both languages.
- **Technical constraints preserved:** plain inline SVG, no map library, no tile loading, no API key — matches Section 2/Section 4.1 of the master prompt. No exact camp/settlement coordinates are shown — only country/region-level boundaries and two town-level pins for the organization's own field offices, which is explicitly permitted (Section 7 of the master prompt only forbids showing beneficiary/settlement locations, not the org's own public office towns).
- Clicking the Hiran or Southwest region (or its pin) links to that region's anchor on the future Where We Work page (`/​{lang}​/where-we-work#hiran` / `#southwest`) — the page itself is built in Phase 4; the anchor target won't resolve until then, which is expected mid-build, not a defect.

## 3. Program cards

Four cards per master prompt Section 4.3, each with an icon, title, one-sentence description, and a link to `/​{lang}​/programs/​{slug}​`:

| Program | Slug |
|---|---|
| Resettlement & Durable Solutions | `resettlement` |
| Shelter & Essential Services | `shelter` |
| Livelihoods & Self-Reliance | `livelihoods` |
| Protection & Community Cohesion | `protection` |

One-sentence descriptions are **demo copy**, following the same pattern already established for the hero/org name: written now so the homepage isn't empty, tagged as placeholder content in `CHECKLIST-BEFORE-LAUNCH.md`, to be reviewed/replaced with real program language later. Program sub-pages themselves are built in Phase 4 — links will 404 until then, which is expected mid-build.

## 4. Impact strip

3–4 figures per master prompt Section 4.1. No real figures have been supplied, so every figure renders the literal placeholder `[NUMBER TO BE CONFIRMED]` per the master prompt's explicit rule (Section 0/Section 2) — never invent a number. Labels (e.g., "households supported") are real, sourced from the program descriptions; the figure, source, and period are all placeholders together (a number without a source/period would be worse than an honest placeholder).

## 5. Latest news — empty state (confirmed decision)

The Markdown news pipeline isn't built until Phase 5. Rather than hardcoding fake demo posts, the section shows an honest empty state: "News and updates will appear here once published." No fake post cards, no invented dates/authors — consistent with the project's "never invent content" rule. This section gets replaced with real `/content/news/`-driven cards in Phase 5.

## 6. Partners

Per Phase 1 wireframe: omitted entirely (not even an empty-state placeholder box) until real partner logos are supplied, per master prompt Section 0 rule ("only real, permitted ones").

## 7. Hero

Per master prompt Section 4.1: one photograph (placeholder for now), a plain headline/sub-line (demo copy, already in `content/en.json`/`so.json` from the interim content fill), two buttons ("Our work" → programs, "Support our work" → donate). Since no real photo exists yet, the hero renders an **honest placeholder box** (a styled `<div>` with the Paper/Primary palette and centered "Photo placeholder" text) rather than a fabricated stock photo or a fake image file — swapped for a real `next/image` once `hero-placeholder.jpg` is supplied, per the master prompt's own naming convention.

## 8. Accessibility carryover

Map: the SVG gets a `<title>`/`aria-label` describing it as an illustrative regional map (not a precise boundary map), region/pin links are keyboard-focusable `<a>` elements (not `<div onClick>`), respecting Section 6/9 of the master prompt. Program cards, impact figures, and the news empty state all use semantic headings maintaining single-`h1`-per-page order established in Phase 2.

## 9. Open items carried to `CHECKLIST-BEFORE-LAUNCH.md`

- Program card one-sentence descriptions are demo copy, not final.
- Impact strip figures, sources, and periods are all placeholders.
- Hero photo is a placeholder box, not a real photograph.
- Map region highlights use the closest available real administrative regions (Hiiraan+Middle Shebelle, Bay+Bakool+Lower Shebelle) as a stand-in for the federal member states, since no federal-state boundary dataset exists — worth a footnote if a grant reviewer asks why the map doesn't show "Hirshabelle"/"South West" by name on the highlighted shapes themselves.
