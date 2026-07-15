import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function Footer({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const year = new Date().getFullYear().toString()

  return (
    <footer className="site-footer bg-primary px-page py-8 text-sm text-paper">
      <div className="mb-4">
        <h2 className="font-display text-base">{content.footer.contactHeading}</h2>
        <Link href={`/${lang}/contact/`}>{content.nav.contact}</Link>
      </div>
      <div className="mb-4">
        <h2 className="font-display text-base">{content.footer.quickLinksHeading}</h2>
        <ul className="space-y-1">
          <li>
            <Link href={`/${lang}/safeguarding/`} className="inline-block py-3">
              {content.footer.safeguarding}
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/privacy/`} className="inline-block py-3">
              {content.footer.privacy}
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/terms/`} className="inline-block py-3">
              {content.footer.terms}
            </Link>
          </li>
        </ul>
      </div>
      <p>{content.footer.copyright.replace('{year}', year)}</p>
    </footer>
  )
}
