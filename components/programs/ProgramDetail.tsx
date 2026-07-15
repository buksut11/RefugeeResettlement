import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import type { ProgramSlug } from '@/components/home/programs-data'
import { StoryBlock } from './StoryBlock'

export function ProgramDetail({ lang, slug }: { lang: Lang; slug: ProgramSlug }) {
  const content = getContent(lang)
  const program = content.programs[slug]
  const { programDetail } = content

  return (
    <div className="px-page py-10">
      <h1 className="font-display text-3xl font-semibold">{program.title}</h1>
      <p className="mt-2 text-lg">{program.summary}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.problemHeading}</h2>
        <p className="mt-2">{program.problem}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.whatWeDoHeading}</h2>
        <p className="mt-2">{program.whatWeDo}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.whereHeading}</h2>
        <p className="mt-2">{program.whereText}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.measurementHeading}</h2>
        <p className="mt-2">{program.measurement}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{programDetail.storyHeading}</h2>
        <StoryBlock story={program.story} attribution={program.storyAttribution} />
      </section>

      <Link href={`/${lang}/donate/`} className="mt-8 inline-block rounded bg-primary px-4 py-2 text-paper">
        {programDetail.supportCta}
      </Link>
    </div>
  )
}
