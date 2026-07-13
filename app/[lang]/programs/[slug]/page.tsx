import { ProgramDetail } from '@/components/programs/ProgramDetail'
import { PROGRAM_SLUGS, type ProgramSlug } from '@/components/home/programs-data'
import { LANGS, type Lang } from '@/lib/i18n'

export function generateStaticParams() {
  return LANGS.flatMap((lang) => PROGRAM_SLUGS.map((slug) => ({ lang, slug })))
}

export default function ProgramPage({
  params,
}: {
  params: { lang: Lang; slug: ProgramSlug }
}) {
  return <ProgramDetail lang={params.lang} slug={params.slug} />
}
