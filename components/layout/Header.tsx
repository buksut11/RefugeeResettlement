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
