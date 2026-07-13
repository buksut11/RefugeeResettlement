# Phase 2 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a working, testable Next.js static-export skeleton with bilingual (`/en/`, `/so/`) routing, a content-driven header/footer with language switcher, and the approved design tokens (colors, fonts) wired in — the "Foundation" phase from the design spec.

**Architecture:** Next.js App Router + TypeScript, statically exported (`output: 'export'`). `app/[lang]/layout.tsx` is the sole root layout (no top-level `app/layout.tsx` or `app/page.tsx` — see rationale in Task 6); `vercel.json` handles the `/` → `/en/` redirect at the platform edge, since static export has no middleware/server to do it in-app. All copy lives in `content/en.json` / `content/so.json`, loaded through `lib/content.ts`. `lib/i18n.ts` holds pure, unit-tested language-path helpers shared by the language switcher.

**Tech Stack:** Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, `next/font/google` (Newsreader + IBM Plex Sans, self-hosted at build time), Vitest + React Testing Library + jsdom, deploy target Vercel.

## Global Constraints

- Tech stack is exactly: Next.js (App Router) + TypeScript, static export; Tailwind CSS; no backend server, no database, no CMS. (Design spec §3)
- Deploy target: Vercel free tier. (Design spec §3, user-confirmed deviation from source brief's Netlify option)
- All page copy lives in `/content/en.json` and `/content/so.json` — same keys, flat, human-editable. (Design spec §3)
- **English is the default language**: root `/` redirects to `/en/`. This is a confirmed deviation from the source brief (which specifies Somali default) — do not "fix" it back. (Design spec §4)
- Where Somali text isn't supplied yet, `so.json` carries the English string and the key is tracked in `CHECKLIST-BEFORE-LAUNCH.md` as needing translation — never silently machine-translate and present as final. (Design spec §4)
- Colour tokens (exact hex, do not alter): Primary `#14355C`, Secondary `#2F6B4F`, Accent `#B5651D`, Ink `#201D1B`, Paper `#F7F5F0`. (Design spec §5)
- Typography: Newsreader (display/headings) + IBM Plex Sans (body), self-hosted and subset via `next/font/google`. (Design spec §5)
- No `[NUMBER TO BE CONFIRMED]`-style statistic may be invented — Foundation phase introduces no statistics, so this doesn't apply yet, but keep it in mind for later phases. (Design spec §2)
- Accessibility baseline applies from the start: semantic HTML, one `h1` per page, keyboard-navigable links, `nav` landmarks labelled. (Design spec §9)
- No third-party trackers, analytics, or ad pixels in this phase. (Design spec §3, §10)
- Never leave a `TODO` in code; explain each phase in plain language with what the user needs to do, if anything. (Design spec §12)

---

## File Structure

```
package.json                       # deps + scripts
tsconfig.json                      # TS config, @/* path alias
next.config.js                     # output: 'export', trailingSlash: true
tailwind.config.js                 # 5-color tokens, font families
postcss.config.js
vitest.config.ts                   # jsdom env, @/* alias, react plugin
vitest.setup.ts                    # jest-dom matchers
vercel.json                        # "/" -> "/en/" redirect
app/
  globals.css                      # Tailwind directives + base body styles
  [lang]/
    layout.tsx                     # root layout: <html lang>, Header, Footer, fonts
    page.tsx                       # home stub (real homepage build is Phase 3)
content/
  en.json                          # site/nav/footer/home copy keys
  so.json                          # same keys, mirrors en.json until translated
lib/
  i18n.ts                          # Lang, LANGS, otherLang, getAlternatePath
  i18n.test.ts
  content.ts                       # getContent(lang)
  content.test.ts
components/
  layout/
    Header.tsx
    Header.test.tsx
    Footer.tsx
    Footer.test.tsx
    LanguageSwitcher.tsx
    LanguageSwitcher.test.tsx
CHECKLIST-BEFORE-LAUNCH.md         # running list of placeholders/translation gaps
```

Each file has one job: `lib/i18n.ts` is pure path math (no React, no Next APIs beyond types), `lib/content.ts` is the single JSON-loading seam, `components/layout/*` are presentation wired to content, `app/[lang]/*` is the only place Next's routing conventions live.

---

## Task 1: Tooling scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/globals.css`
- Create: `vercel.json`

**Interfaces:**
- Produces: `@/*` TypeScript path alias resolving to the project root, usable by every later task's imports.
- Produces: Tailwind tokens `bg-primary`, `bg-secondary`, `bg-accent`, `text-ink`, `bg-paper`, `font-display`, `font-body`, consumed by components in later tasks.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "refugee-resettlement-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.1.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

- [ ] **Step 4: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14355C',
        secondary: '#2F6B4F',
        accent: '#B5651D',
        ink: '#201D1B',
        paper: '#F7F5F0',
      },
      fontFamily: {
        display: ['var(--font-newsreader)', 'serif'],
        body: ['var(--font-plex-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

- [ ] **Step 7: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 8: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-paper text-ink font-body;
}

h1,
h2,
h3 {
  @apply font-display;
}
```

- [ ] **Step 9: Create `vercel.json`**

Static export has no server/middleware to redirect `/` to `/en/`, so this is handled at the Vercel edge instead — matches the trailing-slash convention used everywhere else on the site.

```json
{
  "redirects": [
    { "source": "/", "destination": "/en/", "permanent": false }
  ]
}
```

- [ ] **Step 10: Install and verify the toolchain**

Run: `npm install`
Expected: completes without error, creates `node_modules/` and `package-lock.json`.

Run: `npx tsc --noEmit`
Expected: exits 0 (no `.ts` files yet, so nothing to check, but confirms the config itself is valid).

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.js tailwind.config.js postcss.config.js vitest.config.ts vitest.setup.ts app/globals.css vercel.json
git commit -m "chore: scaffold Next.js static export toolchain"
```

---

## Task 2: Content loader and i18n path helpers

**Files:**
- Create: `content/en.json`
- Create: `content/so.json`
- Create: `lib/i18n.ts`
- Create: `lib/i18n.test.ts`
- Create: `lib/content.ts`
- Create: `lib/content.test.ts`

**Interfaces:**
- Consumes: `@/*` path alias from Task 1.
- Produces: `Lang` (`'en' | 'so'`), `LANGS: Lang[]`, `otherLang(lang: Lang): Lang`, `getAlternatePath(pathname: string, targetLang: Lang): string` from `lib/i18n.ts` — consumed by `LanguageSwitcher` (Task 3).
- Produces: `getContent(lang: Lang): SiteContent`, `SiteContent` type from `lib/content.ts` — consumed by `Header`, `Footer` (Tasks 4–5) and `app/[lang]/page.tsx` (Task 6).

- [ ] **Step 1: Create `content/en.json`**

```json
{
  "site": {
    "name": "[ORGANIZATION NAME]"
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
    "copyright": "© {year} [ORGANIZATION NAME]. All rights reserved."
  },
  "home": {
    "heroHeadline": "[HERO HEADLINE TO BE CONFIRMED]",
    "heroSubline": "[HERO SUBLINE TO BE CONFIRMED]"
  }
}
```

- [ ] **Step 2: Create `content/so.json`**

Mirrors `en.json` exactly for now (tracked in `CHECKLIST-BEFORE-LAUNCH.md` in Task 7 as needing native-speaker translation — see design spec §4, no silent machine translation).

```json
{
  "site": {
    "name": "[ORGANIZATION NAME]"
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
    "copyright": "© {year} [ORGANIZATION NAME]. All rights reserved."
  },
  "home": {
    "heroHeadline": "[HERO HEADLINE TO BE CONFIRMED]",
    "heroSubline": "[HERO SUBLINE TO BE CONFIRMED]"
  }
}
```

- [ ] **Step 3: Write the failing test for `lib/i18n.ts`**

```ts
// lib/i18n.test.ts
import { describe, it, expect } from 'vitest'
import { getAlternatePath, otherLang, LANGS } from '@/lib/i18n'

describe('LANGS', () => {
  it('contains exactly en and so, in that order', () => {
    expect(LANGS).toEqual(['en', 'so'])
  })
})

describe('otherLang', () => {
  it('returns so for en', () => {
    expect(otherLang('en')).toBe('so')
  })

  it('returns en for so', () => {
    expect(otherLang('so')).toBe('en')
  })
})

describe('getAlternatePath', () => {
  it('swaps the language segment of a nested path', () => {
    expect(getAlternatePath('/en/about', 'so')).toBe('/so/about/')
  })

  it('handles the root of a language', () => {
    expect(getAlternatePath('/en/', 'so')).toBe('/so/')
  })

  it('handles deeply nested paths', () => {
    expect(getAlternatePath('/so/programs/resettlement', 'en')).toBe('/en/programs/resettlement/')
  })

  it('prefixes a language when the path has none', () => {
    expect(getAlternatePath('/', 'en')).toBe('/en/')
  })
})
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx vitest run lib/i18n.test.ts`
Expected: FAIL — `lib/i18n.ts` does not exist ("Failed to resolve import").

- [ ] **Step 5: Implement `lib/i18n.ts`**

```ts
export type Lang = 'en' | 'so'

export const LANGS: Lang[] = ['en', 'so']

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'so' : 'en'
}

export function getAlternatePath(pathname: string, targetLang: Lang): string {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length > 0 && LANGS.includes(segments[0] as Lang)) {
    segments[0] = targetLang
  } else {
    segments.unshift(targetLang)
  }

  return '/' + segments.join('/') + '/'
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run lib/i18n.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 7: Write the failing test for `lib/content.ts`**

```ts
// lib/content.test.ts
import { describe, it, expect } from 'vitest'
import { getContent } from '@/lib/content'

describe('getContent', () => {
  it('returns English content for "en"', () => {
    const content = getContent('en')
    expect(content.site.name).toBe('[ORGANIZATION NAME]')
    expect(content.nav.home).toBe('Home')
  })

  it('returns Somali content for "so"', () => {
    const content = getContent('so')
    expect(content.site.name).toBe('[ORGANIZATION NAME]')
    expect(content.nav.home).toBeDefined()
  })
})
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npx vitest run lib/content.test.ts`
Expected: FAIL — `lib/content.ts` does not exist.

- [ ] **Step 9: Implement `lib/content.ts`**

```ts
import type { Lang } from './i18n'
import en from '@/content/en.json'
import so from '@/content/so.json'

const contentByLang = { en, so } satisfies Record<Lang, typeof en>

export type SiteContent = typeof en

export function getContent(lang: Lang): SiteContent {
  return contentByLang[lang]
}
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 11: Run the full suite**

Run: `npm test`
Expected: PASS (9 tests total across `lib/i18n.test.ts` and `lib/content.test.ts`)

- [ ] **Step 12: Commit**

```bash
git add content/en.json content/so.json lib/i18n.ts lib/i18n.test.ts lib/content.ts lib/content.test.ts
git commit -m "feat: content loader and i18n path helpers"
```

---

## Task 3: LanguageSwitcher component

**Files:**
- Create: `components/layout/LanguageSwitcher.tsx`
- Create: `components/layout/LanguageSwitcher.test.tsx`

**Interfaces:**
- Consumes: `otherLang`, `getAlternatePath`, `Lang` from `lib/i18n.ts` (Task 2).
- Produces: `LanguageSwitcher({ lang: Lang })` React component, consumed by `Header` (Task 4).

- [ ] **Step 1: Write the failing test**

```tsx
// components/layout/LanguageSwitcher.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/about',
}))

describe('LanguageSwitcher', () => {
  it('links to the Somali version of the current path', () => {
    render(<LanguageSwitcher lang="en" />)
    const link = screen.getByRole('link', { name: /switch to somali/i })
    expect(link).toHaveAttribute('href', '/so/about/')
    expect(link).toHaveTextContent('SO')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/layout/LanguageSwitcher.test.tsx`
Expected: FAIL — `components/layout/LanguageSwitcher.tsx` does not exist.

- [ ] **Step 3: Implement `components/layout/LanguageSwitcher.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { otherLang, getAlternatePath, type Lang } from '@/lib/i18n'

export function LanguageSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? `/${lang}/`
  const target = otherLang(lang)
  const href = getAlternatePath(pathname, target)
  const label = target === 'en' ? 'English' : 'Somali'

  return (
    <Link href={href} className="lang-switcher" aria-label={`Switch to ${label}`}>
      {target.toUpperCase()}
    </Link>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/layout/LanguageSwitcher.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add components/layout/LanguageSwitcher.tsx components/layout/LanguageSwitcher.test.tsx
git commit -m "feat: language switcher component"
```

---

## Task 4: Header component

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Header.test.tsx`

**Interfaces:**
- Consumes: `getContent` from `lib/content.ts` (Task 2), `LanguageSwitcher` from Task 3.
- Produces: `Header({ lang: Lang })` React component, consumed by `app/[lang]/layout.tsx` (Task 6).

- [ ] **Step 1: Write the failing test**

```tsx
// components/layout/Header.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/',
}))

describe('Header', () => {
  it('renders all primary nav links with trailing-slash hrefs', () => {
    render(<Header lang="en" />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })

    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en/')
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/en/about/')
    expect(within(nav).getByRole('link', { name: 'Donate' })).toHaveAttribute('href', '/en/donate/')
  })

  it('renders the language switcher without needing a menu opened', () => {
    render(<Header lang="en" />)
    expect(screen.getByRole('link', { name: /switch to somali/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/layout/Header.test.tsx`
Expected: FAIL — `components/layout/Header.tsx` does not exist.

- [ ] **Step 3: Implement `components/layout/Header.tsx`**

```tsx
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Lang } from '@/lib/i18n'

type NavKey = 'home' | 'about' | 'programs' | 'whereWeWork' | 'impact' | 'news' | 'getInvolved' | 'donate' | 'contact'

const NAV_ITEMS: { key: NavKey; slug: string }[] = [
  { key: 'home', slug: '' },
  { key: 'about', slug: 'about' },
  { key: 'programs', slug: 'programs' },
  { key: 'whereWeWork', slug: 'where-we-work' },
  { key: 'impact', slug: 'impact' },
  { key: 'news', slug: 'news' },
  { key: 'getInvolved', slug: 'get-involved' },
  { key: 'donate', slug: 'donate' },
  { key: 'contact', slug: 'contact' },
]

export function Header({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <header className="site-header flex items-center justify-between gap-4 bg-paper px-4 py-3">
      <Link href={`/${lang}/`} className="site-header__logo font-display font-semibold text-primary">
        {content.site.name}
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap gap-4 text-sm">
          {NAV_ITEMS.map((item) => {
            const href = item.slug ? `/${lang}/${item.slug}/` : `/${lang}/`
            return (
              <li key={item.key}>
                <Link href={href}>{content.nav[item.key]}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <LanguageSwitcher lang={lang} />
    </header>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/layout/Header.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add components/layout/Header.tsx components/layout/Header.test.tsx
git commit -m "feat: header component with primary nav"
```

---

## Task 5: Footer component

**Files:**
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: `getContent` from `lib/content.ts` (Task 2).
- Produces: `Footer({ lang: Lang })` React component, consumed by `app/[lang]/layout.tsx` (Task 6).

- [ ] **Step 1: Write the failing test**

```tsx
// components/layout/Footer.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders safeguarding, privacy, and terms links with trailing-slash hrefs', () => {
    render(<Footer lang="en" />)
    expect(screen.getByRole('link', { name: 'Safeguarding & PSEA' })).toHaveAttribute('href', '/en/safeguarding/')
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/en/privacy/')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/en/terms/')
  })

  it('renders the copyright line with the current year', () => {
    render(<Footer lang="en" />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/layout/Footer.test.tsx`
Expected: FAIL — `components/layout/Footer.tsx` does not exist.

- [ ] **Step 3: Implement `components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function Footer({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const year = new Date().getFullYear().toString()

  return (
    <footer className="site-footer bg-primary px-4 py-8 text-sm text-paper">
      <div className="mb-4">
        <h2 className="font-display text-base">{content.footer.contactHeading}</h2>
        <Link href={`/${lang}/contact/`}>{content.nav.contact}</Link>
      </div>
      <div className="mb-4">
        <h2 className="font-display text-base">{content.footer.quickLinksHeading}</h2>
        <ul>
          <li>
            <Link href={`/${lang}/safeguarding/`}>{content.footer.safeguarding}</Link>
          </li>
          <li>
            <Link href={`/${lang}/privacy/`}>{content.footer.privacy}</Link>
          </li>
          <li>
            <Link href={`/${lang}/terms/`}>{content.footer.terms}</Link>
          </li>
        </ul>
      </div>
      <p>{content.footer.copyright.replace('{year}', year)}</p>
    </footer>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/layout/Footer.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx components/layout/Footer.test.tsx
git commit -m "feat: footer component"
```

---

## Task 6: Root layout, home stub, and fonts

**Files:**
- Create: `app/[lang]/layout.tsx`
- Create: `app/[lang]/page.tsx`
- Create: `app/[lang]/page.test.tsx`

**Interfaces:**
- Consumes: `Header` (Task 4), `Footer` (Task 5), `getContent` (Task 2), `LANGS`/`Lang` (Task 2).
- Produces: the only route tree in the app — no other task adds routes in this phase.

Next.js App Router requires exactly one root layout containing `<html>`/`<body>`. Rather than adding a top-level `app/layout.tsx` (which would force a second, generic `<html>` wrapper with no locale) and a separate `app/page.tsx` (which static export can't redirect from, since middleware doesn't run in `output: 'export'`), this project follows Next's own documented app-router-i18n pattern: `app/[lang]/layout.tsx` is the sole, outermost layout, so each locale gets its own `<html lang>`. The `/` route itself doesn't exist in the app at all — `vercel.json` (Task 1) redirects it to `/en/` at the edge instead.

- [ ] **Step 1: Write the failing test for the home page stub**

```tsx
// app/[lang]/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/[lang]/page'

describe('HomePage', () => {
  it('renders the hero headline and subline for the given language', () => {
    render(<HomePage params={{ lang: 'en' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('[HERO HEADLINE TO BE CONFIRMED]')
    expect(screen.getByText('[HERO SUBLINE TO BE CONFIRMED]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[lang]/page.test.tsx"`
Expected: FAIL — `app/[lang]/page.tsx` does not exist.

- [ ] **Step 3: Implement `app/[lang]/page.tsx`**

```tsx
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export default function HomePage({ params }: { params: { lang: Lang } }) {
  const content = getContent(params.lang)

  return (
    <section className="px-4 py-12">
      <h1 className="text-3xl font-semibold">{content.home.heroHeadline}</h1>
      <p className="mt-2 text-lg">{content.home.heroSubline}</p>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "app/[lang]/page.test.tsx"`
Expected: PASS (1 test)

- [ ] **Step 5: Implement `app/[lang]/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Newsreader, IBM_Plex_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import '../globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const dynamicParams = false

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return {
    title: content.site.name,
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Lang }
}) {
  const { lang } = params

  return (
    <html lang={lang} className={`${newsreader.variable} ${plexSans.variable}`}>
      <body>
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: PASS (all tests from Tasks 2–6)

- [ ] **Step 7: Build the static export and verify output**

Run: `npm run build`
Expected: exits 0, creates `out/en/index.html` and `out/so/index.html`.

Run: `ls out/en/index.html out/so/index.html`
Expected: both files listed (confirms both locales were statically generated).

- [ ] **Step 8: Commit**

```bash
git add app/[lang]/layout.tsx app/[lang]/page.tsx "app/[lang]/page.test.tsx" next-env.d.ts
git commit -m "feat: root layout with header/footer/fonts and home stub"
```

---

## Task 7: Final verification and launch checklist

**Files:**
- Create: `CHECKLIST-BEFORE-LAUNCH.md`

**Interfaces:**
- Consumes: nothing new — this is a documentation and verification pass over Tasks 1–6.
- Produces: `CHECKLIST-BEFORE-LAUNCH.md`, which later phases (3–8) append to rather than replace.

- [ ] **Step 1: Run the full test suite one more time**

Run: `npm test`
Expected: PASS (every test from Tasks 2–6, 0 failures)

- [ ] **Step 2: Run a clean build**

Run: `npm run build`
Expected: exits 0, `out/en/index.html` and `out/so/index.html` both exist and are non-empty.

- [ ] **Step 3: Create `CHECKLIST-BEFORE-LAUNCH.md`**

```markdown
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

Currently identical to `content/en.json` — needs native-speaker review, not machine translation:

- `site.name`
- `nav.home`, `nav.about`, `nav.programs`, `nav.whereWeWork`, `nav.impact`, `nav.news`, `nav.getInvolved`, `nav.donate`, `nav.contact`
- `footer.contactHeading`, `footer.quickLinksHeading`, `footer.safeguarding`, `footer.privacy`, `footer.terms`, `footer.copyright`
- `home.heroHeadline`, `home.heroSubline`

## Numeric placeholders

None yet — impact statistics are introduced in Phase 3 (homepage) and Phase 5 (Impact & Accountability).

## Phase 2 (Foundation) — what's real vs. placeholder right now

- Routing, language switching, header/footer structure, fonts, and color tokens are final.
- Organization name, hero headline/subline, and all Somali text are placeholders — see above.
```

- [ ] **Step 4: Commit**

```bash
git add CHECKLIST-BEFORE-LAUNCH.md
git commit -m "docs: add launch checklist tracking Phase 2 placeholders"
```

- [ ] **Step 5: Report to the user in plain language**

Summarize: the site now builds and exports statically with working `/en/` and `/so/` routes, a header with full navigation and a language switcher, a footer with safeguarding/privacy/terms links, and the approved Institutional Blue palette + Newsreader/IBM Plex Sans typography wired in. Nothing is deployed yet (that's Phase 8). The only thing the user needs to do: nothing yet — real content (org name, contact facts, Somali translations) gets filled in as later phases and the checklist file grow.
