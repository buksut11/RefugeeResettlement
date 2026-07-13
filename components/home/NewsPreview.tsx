import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function NewsPreview({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <section className="px-4 py-10">
      <h2 className="font-display text-2xl font-semibold">{content.home.newsHeading}</h2>
      <p className="mt-4 text-sm">{content.home.newsEmptyState}</p>
    </section>
  )
}
