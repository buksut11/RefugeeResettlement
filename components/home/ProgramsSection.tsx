import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import { PROGRAM_SLUGS } from './programs-data'
import { ProgramCard } from './ProgramCard'

export function ProgramsSection({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <section className="px-page py-10">
      <h2 className="font-display text-2xl font-semibold">{content.home.whatWeDoHeading}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROGRAM_SLUGS.map((slug) => (
          <ProgramCard
            key={slug}
            lang={lang}
            slug={slug}
            title={content.programs[slug].title}
            summary={content.programs[slug].summary}
          />
        ))}
      </div>
    </section>
  )
}
