import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function Footer({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const year = new Date().getFullYear().toString()

  return (
    <footer className="site-footer border-t border-primary bg-primary px-page pb-8 pt-12 text-sm text-paper">
      <div className="grid gap-8 border-b border-paper/15 pb-8 sm:grid-cols-2">
        <div>
          <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-paper/60">
            {content.footer.contactHeading}
          </h2>
          <Link href={`/${lang}/contact/`} className="mt-2 inline-block text-paper no-underline hover:underline">
            {content.nav.contact}
          </Link>
        </div>
        <div>
          <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-paper/60">
            {content.footer.quickLinksHeading}
          </h2>
          <ul className="mt-1">
            <li>
              <Link href={`/${lang}/safeguarding/`} className="inline-block py-3 text-paper no-underline hover:underline">
                {content.footer.safeguarding}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/privacy/`} className="inline-block py-3 text-paper/85 no-underline hover:underline">
                {content.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/terms/`} className="inline-block py-3 text-paper/85 no-underline hover:underline">
                {content.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-6 font-mono text-xs text-paper/50">{content.footer.copyright.replace('{year}', year)}</p>
    </footer>
  )
}
