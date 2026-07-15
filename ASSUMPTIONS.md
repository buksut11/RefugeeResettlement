# Assumptions Made — Please Verify

This is a list of **technical and design decisions** made during the build without explicit sign-off from you, because the master prompt left them open or a real-world constraint forced a choice. This is separate from `CHECKLIST-BEFORE-LAUNCH.md`, which tracks unresolved *content* (names, numbers, translations) — everything here is a build/architecture decision you should confirm or overrule before launch.

## Hosting & deployment

- **Vercel was chosen over Netlify.** The master prompt allowed either. Vercel was picked because it has first-class native support for Next.js static export and its own `vercel.json` header/redirect format, which is what `vercel.json` (Phase 7a) is already written for. If you'd rather use Netlify, the `vercel.json` header rules would need to be re-expressed as a `netlify.toml`/`_headers` file, and `DEPLOY.md` would need a Netlify-specific rewrite.
- **Formspree was chosen over Netlify Forms** for the contact form, independent of the hosting choice above — `content.contact.formspreeEndpoint` is already wired for it. Switching would mean changing the form's submission handling in `components/contact/ContactForm.tsx`.

## Accessibility & audit methodology (Phase 7b)

- **A 44×44px tap-target minimum was enforced**, stricter than Lighthouse's own default 24×24px bar — because master prompt Section 6 explicitly requires ≥44px. If Section 6 actually meant Lighthouse's default, the footer-link fix in Phase 7b was stricter than strictly necessary (though not wrong to apply).
- **Exactly 10 sample URLs** were audited (one instance of every distinct page template, in both languages where relevant), not every single page on the site (e.g. only one of the four program sub-pages, not all four; only one news post, not both). This was an explicit instruction in the Phase 7b plan, not an inference.
- **The audit ran against the local static build (`localhost:5050`), not a deployed URL** — Performance scores in particular can shift on a real domain/CDN. `DEPLOY.md` Step 7 asks you to re-run this after the real domain is live.

## Content & data sourcing

- **Somalia map region boundaries** use real CC-BY 4.0 geoBoundaries data for the closest available real regions (Hiiraan + Middle Shebelle standing in for "Hiran/Hirshabelle"; Bay + Bakool + Lower Shebelle for "Southwest State") — because no public dataset draws Somalia's federal member state boundaries directly. If the organization has access to an official boundary file, swapping it in would be more precise.
- **The 2023 Shabelle river flooding content** on the Where We Work page is sourced from IOM, OCHA/ReliefWeb, and FAO reporting — real, verifiable content, not invented. If this is republished later, re-verify against current sourcing rather than editing from memory, since displacement figures change.
- **Demo/placeholder content was written and clearly tagged** (`(DEMO)`, `[NUMBER TO BE CONFIRMED]`, etc.) rather than leaving entire sections blank, so every page could be built, tested, and reviewed end-to-end during the build. This includes: the organization name "Horumar Resettlement Network," two demo news posts, demo leadership bios, and demo program stories. None of this is real — all of it must be replaced or explicitly approved as-is before launch (full list in `CHECKLIST-BEFORE-LAUNCH.md`).

## Technical defaults

- **A single `SITE_URL` constant** (`lib/site-config.ts`) drives every canonical/sitemap/robots/Open Graph URL, on the assumption the site has one production domain, not separate domains per language. If English and Somali content will ever live on different domains, this would need to become two constants.
- **Analytics (Plausible/Umami) was deliberately left unwired** this build, per an explicit Phase 7a scope decision, rather than guessing which provider you'd prefer or fabricating a site ID.
- **The bare `/` path redirects to `/en/`** (in `vercel.json`), making English the default language for a visitor with no language preference signaled. If Somali should be the default, this redirect needs to change.
- **No CMS, no database, no user accounts** — per the master prompt's explicit instruction (Section 2), all content editing happens through the flat files described in `CONTENT-GUIDE.md`. This was a requirement, not an assumption, but is restated here since it shapes every other decision above.
