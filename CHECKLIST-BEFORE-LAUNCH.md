# Checklist Before Launch

Every placeholder introduced so far, tracked in one place. Updated at the end of each build phase — do not delete old entries until they're actually resolved.

## Section 0 facts still needed (see refugee-resettlement-website-master-prompt.md)

- Organization legal name, short name/acronym, registration number
- Year founded, head office address
- Field offices — currently used structurally as Beledweyne (Hiran State) / Baidoa (Southwest State) but **unconfirmed**
- Phone/WhatsApp, email
- Mission statement
- Domain name
- Mobile money numbers (EVC Plus, Zaad, Sahal)
- Bank details for institutional donors
- Board/leadership names + roles
- Partner/donor logos to display

## Content needing Somali translation (`content/so.json`)

`nav.*` and `footer.*` (heading/label) keys have a first-pass demo translation. `site.name`, `footer.copyright`, and `home.heroHeadline`/`home.heroSubline` are marked inline with `(DEMO)`/`(MAGAC DEMO AH)`/`(QORAAL DEMO AH)` tags so they're visibly fake on the running site. **None of this has had native-speaker or protection-focal-point review** — do not treat any Somali string as final:

- `site.name`
- `nav.home`, `nav.about`, `nav.programs`, `nav.whereWeWork`, `nav.impact`, `nav.news`, `nav.getInvolved`, `nav.donate`, `nav.contact`
- `footer.contactHeading`, `footer.quickLinksHeading`, `footer.safeguarding`, `footer.privacy`, `footer.terms`, `footer.copyright`
- `home.heroHeadline`, `home.heroSubline`

## Numeric placeholders

None yet — impact statistics are introduced in Phase 3 (homepage) and Phase 5 (Impact & Accountability).

## Phase 2 (Foundation) — what's real vs. placeholder right now

- Routing, language switching, header/footer structure, fonts, and color tokens are final.
- Organization name ("Horumar Resettlement Network"), hero headline/subline, and all Somali text are **demo placeholders only** — invented for local preview purposes, not real facts about the organization. Every occurrence is tagged `(DEMO)`/`(DEMO NAME)`/`(DEMO TEXT)` (or the Somali equivalent) directly in the copy so it's obvious on the rendered page. Replace with real Section 0 facts and reviewed translations before launch — see above.

## Phase 3 (Homepage) — what's real vs. placeholder right now

- Program names (Resettlement & Durable Solutions, Shelter & Essential Services, Livelihoods & Self-Reliance, Protection & Community Cohesion) are final, from the source brief. Their one-sentence summaries are **demo copy**, tagged `(DEMO)`/`(QORAAL DEMO AH)` inline — replace with real program language before launch.
- All four impact-strip figures are placeholders (`[NUMBER TO BE CONFIRMED]` / Somali equivalent) with no source or period yet — per the source brief's rule, never invent a number. Replace once real, sourced, dated figures are supplied.
- Hero image is a styled placeholder box, not a real photograph — swap in `hero-placeholder.jpg` (or the real photo) via `next/image` once supplied.
- The homepage "Latest News" section is an honest empty state — no fake posts. Becomes real once the Markdown news pipeline (Phase 5) is built and posts exist in `/content/news/`.
- The Somalia map uses real geoBoundaries (CC-BY 4.0) boundary data for the national outline and the closest available real regions (Hiiraan + Middle Shebelle for "Hiran/Hirshabelle"; Bay + Bakool + Lower Shebelle for "Southwest State") — no federal-member-state boundary dataset exists publicly. The map's CC-BY attribution line is a license requirement and must stay visible in both languages; do not remove it.
- Program page links (`/programs/resettlement/` etc.) will 404 until Phase 4 builds those pages — expected mid-build, not a defect.
