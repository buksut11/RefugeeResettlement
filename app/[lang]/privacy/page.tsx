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
    path: '/privacy/',
    title: content.seo.privacy.title,
    description: content.seo.privacy.description,
  })
}

export default function PrivacyPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { privacy } = content

  return (
    <div className="px-page py-10">
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->",
        }}
      />
      <LegalDraftNotice lang={lang} />
      <h1 className="font-display text-3xl font-semibold">{privacy.heading}</h1>
      <p className="mt-2 text-lg">{privacy.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.whatWeCollectHeading}</h2>
        <p className="mt-2">{privacy.whatWeCollectBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.thirdPartyHeading}</h2>
        <p className="mt-2">{privacy.thirdPartyBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.whatWeNeverCollectHeading}</h2>
        <p className="mt-2">{privacy.whatWeNeverCollectBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.retentionHeading}</h2>
        <p className="mt-2">{privacy.retentionBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.contactHeading}</h2>
        <p className="mt-2">{privacy.contactBody}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{privacy.changesHeading}</h2>
        <p className="mt-2">{privacy.changesBody}</p>
      </section>
    </div>
  )
}
