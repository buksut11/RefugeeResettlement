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
    path: '/terms/',
    title: content.seo.terms.title,
    description: content.seo.terms.description,
  })
}

export default function TermsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { terms } = content

  return (
    <div className="px-4 py-10">
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->",
        }}
      />
      <LegalDraftNotice lang={lang} />
      <h1 className="font-display text-3xl font-semibold">{terms.heading}</h1>
      <p className="mt-2 text-lg">{terms.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.acceptableUseHeading}</h2>
        <p className="mt-2">{terms.acceptableUseBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.contentOwnershipHeading}</h2>
        <p className="mt-2">{terms.contentOwnershipBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.noWarrantyHeading}</h2>
        <p className="mt-2">{terms.noWarrantyBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.governingLawHeading}</h2>
        <p className="mt-2">{terms.governingLawBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{terms.changesHeading}</h2>
        <p className="mt-2">{terms.changesBody}</p>
      </section>
    </div>
  )
}
