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
    <header className="site-header sticky top-0 z-30 flex flex-col gap-3 border-b border-line bg-paper/95 px-page py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={`/${lang}/`}
        className="site-header__logo no-underline-children flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink"
      >
        <span
          aria-hidden="true"
          className="block h-3 w-3 shrink-0 rotate-45"
          style={{ background: 'linear-gradient(135deg, #14355C 50%, #B5651D 50%)' }}
        />
        {content.site.name}
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {NAV_ITEMS.map((item) => {
            const href = item.slug ? `/${lang}/${item.slug}/` : `/${lang}/`
            return (
              <li key={item.key}>
                <Link
                  href={href}
                  className="inline-block py-2 text-ink/80 no-underline transition-colors hover:text-primary hover:underline"
                >
                  {content.nav[item.key]}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <LanguageSwitcher lang={lang} />
    </header>
  )
}
