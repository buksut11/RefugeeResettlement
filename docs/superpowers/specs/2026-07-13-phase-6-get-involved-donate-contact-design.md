# Design: Phase 6 — Get Involved, Donate, Contact

Status: Approved. Builds on `2026-07-13-refugee-resettlement-website-design.md` (Phase 1 design) and completed Phases 2-5. Implements master prompt Sections 4.7, 4.8, and 4.9.

## 1. Scope

This phase adds three pages:

- `/{lang}/get-involved/`
- `/{lang}/donate/`
- `/{lang}/contact/`

Per user decision, there is only one form on the site (the Contact page's general form) — the Get Involved page's "Work with us" path reuses it rather than adding a second, dedicated volunteer form. This matches how the page-by-page spec (Section 4) only ever details one form, even though the tech-stack section names "volunteer" as a form type.

## 2. Forms backend: Formspree, not Netlify Forms

The master prompt allows either Netlify Forms or Formspree. Netlify Forms only works when the site is hosted on Netlify and relies on Netlify's build-time static-HTML form scanner — but this project already deployed to Vercel (Phase 1's documented, confirmed deviation from the source brief's Netlify option). Formspree works with any static host: the form POSTs directly to a Formspree endpoint URL via a plain `<form method="POST" action="...">` — no JavaScript required to submit, satisfying the "works with JavaScript disabled" performance baseline (master prompt Section 2).

The Formspree endpoint ID isn't supplied yet, so the form's `action` attribute uses an honest placeholder (`https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]`) — submitting the form today would fail, and this is tracked in `CHECKLIST-BEFORE-LAUNCH.md`. Spam protection is Formspree's documented honeypot convention: a hidden `_gotcha` input, never a CAPTCHA (master prompt Section 7 explicitly prohibits CAPTCHA).

## 3. Get Involved page (`/{lang}/get-involved/`)

Three sections, each a heading + short body + link:

- **Donate** — links to `/{lang}/donate/`.
- **Partner with us** — links to `/{lang}/contact/`.
- **Work with us** — an honest statement that no open positions or volunteer roles are currently listed on the page (this is literally true of the page's content today, not an invented claim about the organization's actual hiring status — same framing as the Reports page's empty state in Phase 5), plus a note to mention volunteering interest via the Contact form, linking to `/{lang}/contact/`.

## 4. Donate page (`/{lang}/donate/`)

- **Mobile money** (EVC Plus, Zaad, Sahal): each rendered by a small `'use client'` component (`CopyableNumber`) showing the number as a tappable `tel:` link, a "Copy" button using `navigator.clipboard.writeText`, and a placeholder USSD dial string. All three numbers and USSD strings are honest bracketed placeholders (Section 0 facts not yet supplied) — copying today copies literal placeholder text, but the UI is fully functional and ready to go live once real numbers are supplied.
- **Bank transfer**: institutional donor details (bank name, account name, account number, SWIFT/BIC) — all honest placeholders, plain server-rendered labeled list, no client interactivity needed.
- **Card donations**: an honest empty-state note that a Stripe Payment Link or Donorbox embed will appear here once the organization supplies one — no fake button, no placeholder link that looks clickable. Per the master prompt's explicit instruction, the site must never build a custom payment form or handle card numbers directly.
- **Suggested giving levels**: omitted entirely this phase (not even a placeholder section) — the master prompt explicitly says to omit this unless real unit costs are supplied, and none have been.
- **Safeguarding statement**: a fixed, real (non-placeholder) sentence on how donations are tracked and safeguarded, cross-referencing the Impact & Accountability page — mandated policy text, same treatment as Phase 4's Commitments block and Phase 5's complaints-intro statement.

## 5. Contact page (`/{lang}/contact/`)

- **Offices**: reuses the established Hiran (Beledweyne) / Southwest (Baidoa) structure from Phase 4's Where We Work page, extended with placeholder address/phone/WhatsApp/email per office (Section 0 facts, not yet supplied).
- **Contact form**: name, email, subject (plain text input, not a dropdown — keeps scope minimal since the master prompt doesn't specify subject options), message, honeypot field, submit button. Native HTML form per Section 2 above.
- **Safeguarding/complaints link**: a separate, visually distinct callout (not part of the form) linking to `/{lang}/safeguarding/` (won't resolve until Phase 7 — expected mid-build, same forward-link pattern as prior phases) — per the master prompt's explicit instruction that this must be prominent and separate from the general contact flow, not buried inside it.

## 6. Components

- `components/donate/CopyableNumber.tsx` (+ test, `'use client'`) — one mobile-money provider's number/USSD/copy-button, reused three times.
- `components/donate/BankDetails.tsx` (+ test) — plain labeled bank transfer details.
- `components/donate/CardDonations.tsx` (+ test) — the honest card-donation empty state.
- `components/contact/OfficeCard.tsx` (+ test) — one office's placeholder contact details, reused twice.
- `components/contact/ContactForm.tsx` (+ test) — the general contact form.

## 7. Testing notes

- `CopyableNumber`'s test mocks `navigator.clipboard.writeText` (a new testing pattern for this project — no prior component has used the Clipboard API) and asserts the button calls it with the placeholder number text, plus that the number renders as a `tel:` link.
- `ContactForm`'s test verifies structure only (method `POST`, the placeholder Formspree `action` URL, presence of the honeypot field, `required` attributes on name/email/message) — there is no real endpoint to submit to in tests, consistent with how Phase 5's Reports section was tested against its real empty state rather than a live PDF.

## 8. Accessibility carryover

One `h1` per page. The mobile-money `tel:` links and the Copy buttons are real, keyboard-focusable elements. The contact form's labels are properly associated with their inputs (`<label htmlFor>` / matching `id`), and the honeypot field is visually hidden via CSS (not `type="hidden"`, since Formspree's convention expects a real-looking-but-hidden text input) but marked `aria-hidden="true"` and `tabIndex={-1}` so it's invisible to screen readers and unreachable by keyboard, not just visually hidden.

## 9. Open items carried to `CHECKLIST-BEFORE-LAUNCH.md`

- All three mobile money numbers/USSD codes are placeholders.
- Bank transfer details (name, account, SWIFT) are placeholders.
- Card donation link (Stripe Payment Link or Donorbox embed) has not been supplied — honest empty state shown instead.
- Contact form's Formspree endpoint ID is a placeholder — the form will not actually submit until a real endpoint is configured.
- Office address/phone/WhatsApp/email on the Contact page are placeholders, same unconfirmed Section 0 facts tracked since Phase 2.
- The safeguarding/complaints link on the Contact page will 404 until Phase 7 builds the legal pages — expected mid-build, not a defect.
