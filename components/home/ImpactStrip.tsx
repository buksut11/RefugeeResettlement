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
    <section className="px-page py-14 sm:py-16">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{content.home.impactHeading}</h2>
      <div className="mt-8 grid divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {FIGURE_KEYS.map((key) => (
          <div key={key} className="py-6 sm:px-6 sm:py-2 sm:first:pl-0">
            <p className="font-mono text-2xl font-medium tracking-tight text-ink sm:text-[1.75rem]">
              {content.impact.figurePlaceholder}
            </p>
            <p className="mt-1.5 text-sm text-ink/70">{content.impact[key]}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
