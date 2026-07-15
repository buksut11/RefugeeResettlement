# Phase 8 — Deployment & Handover Design Spec

**Goal:** Deliver the final three items from master prompt Section 10 that aren't done yet — `CONTENT-GUIDE.md`, `DEPLOY.md`, and a written assumptions list — plus a closing Phase 8 entry in `CHECKLIST-BEFORE-LAUNCH.md`. This is the last phase in the master prompt's Section 9 build order.

## Why this shape

Section 0's facts (org name, domain, mobile money numbers, bank details, etc.) are all still `<<FILL IN>>` in the master prompt — none have been supplied yet. That means:

- `DEPLOY.md` cannot hardcode a real domain or DNS records. It must be a generic, step-by-step Vercel deployment guide (per Section 2's "Netlify or Vercel free tier" instruction — Vercel chosen since `vercel.json` already exists with the Phase 7a security headers and redirect config written in Vercel's format) with a clearly-marked step for "once you own a domain, do this."
- `CONTENT-GUIDE.md` doesn't depend on Section 0 facts at all — it documents the mechanics of editing `content/en.json`/`content/so.json`, adding a news post, adding a report, and updating donation numbers, regardless of what the real values end up being.
- The assumptions list is distinct from `CHECKLIST-BEFORE-LAUNCH.md`: the checklist tracks unresolved *content* placeholders; the assumptions list documents *technical/design decisions* made without explicit user sign-off (e.g., choosing Vercel over Netlify, Formspree over Netlify Forms, the 44px tap-target bar) so the user can veto any of them before launch.

## No code changes

This phase is documentation-only. No component, page, or content file changes are needed — the site itself is feature-complete as of Phase 7b (accessibility: 1.00 on all 10 sampled pages; all tests/typecheck/build passing on `master`).

## Files

```
CONTENT-GUIDE.md   # new — non-developer's guide to editing content
DEPLOY.md          # new — click-by-click Vercel deployment + domain connection
ASSUMPTIONS.md     # new — every technical/design assumption made, for user sign-off
CHECKLIST-BEFORE-LAUNCH.md  # modified — add Phase 8 section
```
