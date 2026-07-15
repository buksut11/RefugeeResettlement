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
    <Link
      href={href}
      className="lang-switcher inline-flex h-9 w-fit min-w-[2.75rem] shrink-0 items-center justify-center self-start rounded-full border border-primary/30 px-3 font-mono text-xs font-medium tracking-wide text-primary no-underline transition-colors hover:border-primary hover:bg-primary hover:text-paper sm:self-auto"
      aria-label={`Switch to ${label}`}
    >
      {target.toUpperCase()}
    </Link>
  )
}
