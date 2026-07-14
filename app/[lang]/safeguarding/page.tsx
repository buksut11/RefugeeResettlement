import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { LegalDraftNotice } from '@/components/legal/LegalDraftNotice'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/safeguarding/',
    title: content.seo.safeguarding.title,
    description: content.seo.safeguarding.description,
  })
}

export default function SafeguardingPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { safeguarding } = content

  return (
    <div className="px-4 py-10">
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->",
        }}
      />
      <LegalDraftNotice lang={lang} />
      <h1 className="font-display text-3xl font-semibold">{safeguarding.heading}</h1>
      <p className="mt-2 text-lg">{safeguarding.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.zeroToleranceHeading}</h2>
        <p className="mt-2">{safeguarding.zeroToleranceBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.reportingHeading}</h2>
        <p className="mt-2">{safeguarding.reportingBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">
          {safeguarding.confidentialityHeading}
        </h2>
        <p className="mt-2">{safeguarding.confidentialityBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.consentHeading}</h2>
        <p className="mt-2">{safeguarding.consentBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{safeguarding.investigationHeading}</h2>
        <p className="mt-2">{safeguarding.investigationBody}</p>
      </section>
    </div>
  )
}
