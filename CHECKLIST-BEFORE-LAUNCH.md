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
