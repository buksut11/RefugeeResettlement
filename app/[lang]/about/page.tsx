import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { Leadership } from '@/components/about/Leadership'
import { CommitmentsBlock } from '@/components/about/CommitmentsBlock'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/about/',
    title: content.seo.about.title,
    description: content.seo.about.description,
  })
}

export default function AboutPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { about } = content

  return (
    <div className="px-page py-10">
      <h1 className="font-display text-3xl font-semibold">{about.heading}</h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.whoWeAreHeading}</h2>
        <p className="mt-2">{about.whoWeAreBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.missionHeading}</h2>
        <p className="mt-2">{about.missionBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.visionHeading}</h2>
        <p className="mt-2">{about.visionBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.valuesHeading}</h2>
        <ul className="mt-2 list-disc pl-5">
          {about.values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.ourStoryHeading}</h2>
        <p className="mt-2">{about.ourStoryBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.leadershipHeading}</h2>
        <Leadership lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.legalGovernanceHeading}</h2>
        <p className="mt-2">{about.legalGovernanceBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{about.commitmentsHeading}</h2>
        <CommitmentsBlock lang={lang} />
      </section>
    </div>
  )
}
