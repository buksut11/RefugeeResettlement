import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

const FIGURE_KEYS = [
  'householdsSupported',
  'shelterKits',
  'livelihoodsTrainings',
  'districtsReached',
] as const

export function ImpactStrip({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <section className="bg-secondary/10 px-4 py-10">
      <h2 className="font-display text-2xl font-semibold">{content.home.impactHeading}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FIGURE_KEYS.map((key) => (
          <div key={key} className="rounded bg-paper p-4 text-center">
            <p className="text-xl font-semibold">{content.impact.figurePlaceholder}</p>
            <p className="mt-1 text-sm">{content.impact[key]}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
