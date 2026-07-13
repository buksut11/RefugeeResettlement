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
