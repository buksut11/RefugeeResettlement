import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function NewsPreview({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <section className="px-page py-14 sm:py-16">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{content.home.newsHeading}</h2>
      <div className="mt-8 border border-dashed border-line px-6 py-10 text-center">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-6 w-6 text-ink/30">
          <g fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4.5h10.5L20 9v10.5H5Z" />
            <path d="M15.5 4.5V9H20" />
          </g>
        </svg>
        <p className="mx-auto mt-3 max-w-[36ch] text-sm text-ink/70">{content.home.newsEmptyState}</p>
      </div>
    </section>
  )
}
