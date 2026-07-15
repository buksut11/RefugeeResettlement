# Content Guide

This guide is for editing the website's words, news posts, reports, and donation numbers. **You do not need to know how to code for anything in this guide.** Every file you'll touch is plain text.

If you want to change layout, colors, or add a new kind of page, that needs a developer — see the "What not to touch" section at the end.

## Before you start: how to preview your changes

1. Open a terminal in the project folder.
2. Run `npm run dev`.
3. Open `http://localhost:3000` in your browser.
4. Edit a file, save it, and the browser updates automatically — no need to restart anything.
5. When you're happy, save the file, then follow the "publish your changes" steps at the end of this guide.

---

## 1. Changing any text on the site

All page text lives in two files:

- `content/en.json` — English
- `content/so.json` — Somali

Both files have **exactly the same structure** — the same labels ("keys") in the same order, just with different text as the value. For example, in `content/en.json` you'll find:

```json
"donate": {
  "heading": "Donate",
  "intro": "Your support helps displaced families in Hiran and Southwest State rebuild their lives. (DEMO)",
```

To change the introduction sentence on the Donate page, edit the text after `"intro":` — keep the quotation marks, and remove the `(DEMO)` tag once the sentence is real and approved:

```json
"donate": {
  "heading": "Donate",
  "intro": "Your support helps displaced families in Hiran and Southwest State rebuild their lives.",
```

Then make the same change to the matching line in `content/so.json`.

**Rules:**
- Never delete a line, only change the text between the quotation marks.
- Keep the quotation marks and the comma at the end of the line exactly as they are.
- If a piece of text appears in square brackets like `[NUMBER TO BE CONFIRMED]`, that's a deliberate placeholder — replace it with the real figure once you have it, sourced and dated. Never guess a number.
- Anything tagged `(DEMO)` or `(QORAAL DEMO AH)` is fake placeholder content used to test the site — replace it with real, approved copy before launch, and remove the tag.

---

## 2. Adding a news post

News posts live as one file per post, per language:

- `content/news/en/your-post-slug.md`
- `content/news/so/your-post-slug.md` (the Somali translation, same filename)

Each file starts with a front-matter block (between the `---` lines), then the article body in plain text/Markdown. Example (`content/news/en/shelter-kits-arrive-in-beledweyne.md`):

```markdown
---
title: "Shelter kits arrive in Beledweyne"
date: "2026-06-01"
region: "hiran"
program: "shelter"
summary: "A one-sentence summary shown on the News list page."
image: "/news/shelter-kits.jpg"
alt: "Volunteers distributing shelter kits in Beledweyne"
---
The full article text goes here. You can use **bold**, *italics*, and
paragraphs like a normal document.
```

**Field reference:**

| Field | Required? | Notes |
|---|---|---|
| `title` | Yes | Shown as the post heading |
| `date` | Yes | `YYYY-MM-DD` format, controls sort order (newest first) |
| `region` | Yes | `hiran`, `southwest`, or `both` |
| `program` | No | One of the four program slugs (`resettlement`, `shelter`, `livelihoods`, `protection`), or omit the line entirely if not tied to a program |
| `summary` | Yes | One sentence, shown on the News listing page |
| `image` | No | Path to a photo — see "Swapping a photo" below. Omit the line entirely if you don't have a real photo; never invent one |
| `alt` | No, but required if `image` is set | A plain-language description of the photo, in the post's language, for screen readers |

To add a new post: create both the English and Somali `.md` files with the same filename, fill in the fields above, and write the article body under the `---`.

---

## 3. Adding a report (PDF)

Reports (annual reports, financial statements, project reports) work the same two-part way as news:

1. **The actual PDF file** goes in `public/reports/` (create this folder if it doesn't exist yet), e.g. `public/reports/annual-report-2026.pdf`.
2. **A front-matter file** describing it goes in `content/reports/en/annual-report-2026.md` (and the Somali equivalent under `content/reports/so/`):

```markdown
---
title: "Annual Report 2026"
date: "2026-12-31"
category: "annual-report"
file: "/reports/annual-report-2026.pdf"
---
```

`category` must be one of: `annual-report`, `financial-statement`, `project-report`. The `file` path always starts with `/reports/` and matches the PDF's filename in `public/reports/`.

There is no demo report on the site right now — the Reports section is intentionally empty until real PDFs are supplied, per the organization's own instruction not to fabricate placeholder documents.

---

## 4. Swapping a photo

The site currently has almost no real photos — most images are either intentionally absent (no fabricated photos) or simple styled placeholder boxes. To add a real photo:

1. Save the image as a `.jpg`, `.png`, or `.webp` file under `public/` (e.g. `public/news/shelter-kits.jpg`, or `public/hero-placeholder.jpg` for the homepage hero).
2. Reference it by that same path (e.g. `/news/shelter-kits.jpg`) in the relevant content field — for news posts, that's the `image` front-matter field described above.
3. Always write a real, descriptive `alt` value in the same language as the post — this is required for accessibility (screen readers) and is checked by the site's automated accessibility audit.
4. Keep photos reasonably sized (under ~500KB) since many visitors are on slow mobile connections — resize/compress before uploading if your original is a multi-megabyte camera photo.

Never use a stock photo of unrelated people or a photo of a real beneficiary without documented, informed consent — see the Safeguarding & PSEA page's policy, which the site's copy must not contradict.

---

## 5. Changing donation numbers

All donation details live in the `"donate"` section of `content/en.json` (and mirrored in `content/so.json`, since numbers/codes are usually the same in both languages — only the surrounding labels need translating):

```json
"mobileMoneyProviders": {
  "evcPlus": {
    "label": "EVC Plus",
    "number": "[EVC PLUS NUMBER TO BE CONFIRMED]",
    "ussd": "[EVC PLUS USSD CODE TO BE CONFIRMED]"
  },
  ...
},
"bankName": "[BANK NAME TO BE CONFIRMED]",
"accountName": "[ACCOUNT NAME TO BE CONFIRMED]",
"accountNumber": "[ACCOUNT NUMBER TO BE CONFIRMED]",
"swift": "[SWIFT CODE TO BE CONFIRMED]",
```

Replace each bracketed placeholder with the real value. The "Copy number" button on the Donate page works automatically off whatever text is in `number`/`ussd` — no code change needed.

The card-donations section (`cardEmptyState`) stays an empty message until you have a real payment link (e.g. a Stripe Payment Link or Donorbox page) to add — ask a developer to wire that link in once you have it, since it involves adding a button/embed, not just text.

---

## 6. Publishing your changes

This site is a static export — changes only go live once they're committed to the project's Git repository and redeployed. If you're comfortable with Git:

```bash
git add content/en.json content/so.json
git commit -m "Update donate page copy"
git push
```

Vercel (see `DEPLOY.md`) automatically rebuilds and redeploys the live site within a minute or two of every push. If you're not comfortable with Git, ask a developer to make the commit/push for you — but you can still make all the text edits described above yourself in any plain text editor.

---

## What not to touch without a developer

- Anything under `app/`, `components/`, or `lib/` — this is the site's code (layout, styling, logic), not content.
- `package.json`, `next.config.js`, `tailwind.config.js`, `vercel.json` — build and deployment configuration.
- File and folder *names* under `content/` — the code looks for exact paths (`content/news/en/`, `content/reports/so/`, etc.); renaming a folder will break the site.

If you're ever unsure whether an edit is "just content," ask a developer before saving — editing anything outside the files named in this guide risks breaking the build.
