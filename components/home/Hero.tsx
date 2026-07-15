import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function Hero({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <section className="px-page pb-14 pt-10 sm:pt-14 lg:pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
        <div style={{ animation: 'rise-in 0.6s ease-out both' }}>
          <p className="eyebrow">
            {content.home.mapRegionHiran} &middot; {content.home.mapRegionSouthwest}
          </p>
          <h1 className="mt-4 max-w-[16ch] font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
            {content.home.heroHeadline}
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-ink/80">{content.home.heroSubline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${lang}/programs/`}
              className="inline-flex min-h-[44px] items-center rounded-sm bg-primary px-5 text-sm font-medium tracking-wide text-paper no-underline transition-colors hover:bg-ink"
            >
              {content.home.heroCtaPrimary}
            </Link>
            <Link
              href={`/${lang}/donate/`}
              className="inline-flex min-h-[44px] items-center rounded-sm border border-primary px-5 text-sm font-medium tracking-wide text-primary no-underline transition-colors hover:bg-primary hover:text-paper"
            >
              {content.home.heroCtaSecondary}
            </Link>
          </div>
        </div>
        <figure
          className="m-0 border border-line"
          style={{ animation: 'rise-in 0.7s ease-out 0.1s both' }}
        >
          <div className="flex aspect-[4/3] items-center justify-center bg-primary/[0.06]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9 text-ink/25">
              <rect x="2.5" y="4.5" width="19" height="15" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="8" cy="10" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 17.5 L9.5 12 L13 15 L16.5 11 L20 14.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <figcaption className="border-t border-line px-3 py-2 font-mono text-[0.7rem] uppercase tracking-wide text-ink/50">
            {content.home.heroPhotoPlaceholder}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
