import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { PROGRAM_SLUGS } from '@/components/home/programs-data'
import { ProgramCard } from '@/components/home/ProgramCard'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/programs/',
    title: content.seo.programs.title,
    description: content.seo.programs.description,
  })
}

export default function ProgramsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{content.programsPage.heading}</h1>
      <p className="mt-2 text-lg">{content.programsPage.intro}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROGRAM_SLUGS.map((slug) => (
          <ProgramCard
            key={slug}
            lang={lang}
            slug={slug}
            title={content.programs[slug].title}
            summary={content.programs[slug].summary}
            headingLevel="h2"
          />
        ))}
      </div>
    </div>
  )
}
