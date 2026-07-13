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

## Phase 4 (About, Programs, Where We Work) — what's real vs. placeholder right now

- Leadership/board names, roles, bios, and photos are demo placeholders, tagged `(DEMO NAME)`/`(DEMO ROLE)`/`(DEMO BIO)` — replace once real Section 0 facts (board names, roles) are supplied.
- Each program sub-page's anonymized story is fictional demo content, clearly tagged `(DEMO STORY)` — replace with a real, consented, anonymized story before launch. Do not remove the "shared with consent" attribution pattern even when real stories are added; update it to reflect actual consent status.
- Registration number is an honest placeholder (`[REGISTRATION NUMBER TO BE CONFIRMED]`) — not invented.
- Coordination partners on the Where We Work page are an honest placeholder (`[COORDINATION PARTNERS TO BE CONFIRMED]`) — do not fill in with real organization names (UNHCR, IOM, etc.) until an actual partnership is confirmed by the user; naming a real org here without confirmation would imply a partnership that doesn't exist.
- Districts covered and field office locations continue to use Beledweyne (Hiran) / Baidoa (Southwest) structurally; still unconfirmed per Section 0.
- The 2023 Shabelle river flooding content on the Where We Work page **is verified, sourced content** (IOM, OCHA/ReliefWeb, FAO) — not a placeholder. If updated later, re-verify rather than editing from memory.
- The About page's Safeguarding & PSEA link (`/{lang}/safeguarding/`) will 404 until Phase 7 builds the legal pages — expected mid-build, not a defect.
- Program sub-page "Support this program" buttons link to `/{lang}/donate/`, which will 404 until Phase 6 — expected mid-build, not a defect.

## Phase 5 (Impact & Accountability, News, Reports) — what's real vs. placeholder right now

- Both news posts are fictional demo content, clearly tagged `(DEMO)`/`(QORAAL DEMO AH)` — remove or replace once real news exists. The consent-notice line itself is real, mandated policy text (not a placeholder) and renders on every post regardless of whether the post is real or demo.
- Impact results-table figures (all 8 cells per region) are placeholders (`[NUMBER TO BE CONFIRMED]`) — no year, region-specific figures have been supplied yet.
- The funds-use bar's three percentages are placeholders (`[PERCENTAGE TO BE CONFIRMED]`) — never invent a plausible-looking split; replace only with real, sourced percentages.
- Complaints/feedback phone, WhatsApp, and email are honest placeholders pending Section 0 facts.
- The Reports section is an honest empty state (`content/reports/{lang}/` is intentionally empty) — no demo PDF was fabricated, per the master prompt's explicit instruction. Populate `content/reports/{lang}/*.md` and the corresponding files under `public/reports/` once real PDFs are supplied.
- Both demo news posts omit `image`/`alt` front-matter (no image renders) — this is intentional (no fabricated photo), not a bug; the pipeline supports real images with meaningful alt text once supplied.
