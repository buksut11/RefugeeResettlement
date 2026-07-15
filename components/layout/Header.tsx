import Link from 'next/link'
import { getContent } from '@/lib/content'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NavMenu } from './NavMenu'
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
  const links = NAV_ITEMS.map((item) => ({
    key: item.key,
    label: content.nav[item.key],
    href: item.slug ? `/${lang}/${item.slug}/` : `/${lang}/`,
  }))

  return (
    <header className="site-header sticky top-0 z-30 border-b border-line bg-paper/95 px-page py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${lang}/`}
          className="site-header__logo no-underline-children flex min-w-0 items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <span
            aria-hidden="true"
            className="block h-3 w-3 shrink-0 rotate-45"
            style={{ background: 'linear-gradient(135deg, #14355C 50%, #B5651D 50%)' }}
          />
          <span className="min-w-0 truncate">{content.site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden 2xl:flex">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="inline-block py-2 text-ink/80 no-underline transition-colors hover:text-primary hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <NavMenu links={links} openLabel={content.nav.menuOpen} closeLabel={content.nav.menuClose} />
          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  )
}
