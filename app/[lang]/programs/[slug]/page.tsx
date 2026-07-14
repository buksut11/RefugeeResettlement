import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ProgramDetail } from '@/components/programs/ProgramDetail'
import { PROGRAM_SLUGS, type ProgramSlug } from '@/components/home/programs-data'
import { LANGS, type Lang } from '@/lib/i18n'

export function generateStaticParams() {
  return LANGS.flatMap((lang) => PROGRAM_SLUGS.map((slug) => ({ lang, slug })))
}

export function generateMetadata({
  params,
}: {
  params: { lang: Lang; slug: ProgramSlug }
}): Metadata {
  const content = getContent(params.lang)
  const program = content.programs[params.slug]
  return buildMetadata({
    lang: params.lang,
    path: `/programs/${params.slug}/`,
    title: program.title,
    description: program.summary,
  })
}

export default function ProgramPage({
  params,
}: {
  params: { lang: Lang; slug: ProgramSlug }
}) {
  return <ProgramDetail lang={params.lang} slug={params.slug} />
}
