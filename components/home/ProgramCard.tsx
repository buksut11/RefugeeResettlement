import Link from 'next/link'
import type { Lang } from '@/lib/i18n'
import { type ProgramSlug } from './programs-data'
import { ProgramIcon } from './program-icons'

export function ProgramCard({
  lang,
  slug,
  title,
  summary,
  headingLevel = 'h3',
}: {
  lang: Lang
  slug: ProgramSlug
  title: string
  summary: string
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel

  return (
    <Link
      href={`/${lang}/programs/${slug}/`}
      className="group block h-full border border-line p-5 no-underline transition-colors hover:border-primary"
    >
      <ProgramIcon slug={slug} />
      <p className="eyebrow mt-4">{slug}</p>
      <Heading className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink">{title}</Heading>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{summary}</p>
      <span
        aria-hidden="true"
        className="mt-4 inline-block font-mono text-xs uppercase tracking-wide text-primary opacity-0 transition-opacity group-hover:opacity-100"
      >
        &rarr;
      </span>
    </Link>
  )
}
