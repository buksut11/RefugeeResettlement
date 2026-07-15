import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function Hero({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <section className="px-page py-10">
      <div className="mb-6 flex h-56 items-center justify-center rounded bg-primary/10 text-ink">
        <span className="font-body text-sm">{content.home.heroPhotoPlaceholder}</span>
      </div>
      <h1 className="font-display text-3xl font-semibold">{content.home.heroHeadline}</h1>
      <p className="mt-2 text-lg">{content.home.heroSubline}</p>
      <div className="mt-6 flex gap-3">
        <Link href={`/${lang}/programs/`} className="rounded bg-primary px-4 py-2 text-paper">
          {content.home.heroCtaPrimary}
        </Link>
        <Link href={`/${lang}/donate/`} className="rounded border border-primary px-4 py-2 text-primary">
          {content.home.heroCtaSecondary}
        </Link>
      </div>
    </section>
  )
}
