import Link from 'next/link'
import type { Lang } from '@/lib/i18n'
import { PROGRAM_ICONS, type ProgramSlug } from './programs-data'

export function ProgramCard({
  lang,
  slug,
  title,
  summary,
}: {
  lang: Lang
  slug: ProgramSlug
  title: string
  summary: string
}) {
  return (
    <Link href={`/${lang}/programs/${slug}/`} className="block rounded border border-primary/20 p-4">
      <span aria-hidden="true" className="text-2xl">
        {PROGRAM_ICONS[slug]}
      </span>
      <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm">{summary}</p>
    </Link>
  )
}
