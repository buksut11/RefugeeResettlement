import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { GetInvolvedCard } from '@/components/get-involved/GetInvolvedCard'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/get-involved/',
    title: content.seo.getInvolved.title,
    description: content.seo.getInvolved.description,
  })
}

export default function GetInvolvedPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const { getInvolved } = getContent(lang)

  return (
    <div className="px-page py-10">
      <h1 className="font-display text-3xl font-semibold">{getInvolved.heading}</h1>
      <p className="mt-2 max-w-[52ch] text-lg text-ink/80">{getInvolved.intro}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <GetInvolvedCard
          icon="donate"
          heading={getInvolved.donateHeading}
          body={getInvolved.donateBody}
          ctaLabel={getInvolved.donateCta}
          ctaHref={`/${lang}/donate/`}
          emphasized
        />
        <GetInvolvedCard
          icon="partner"
          heading={getInvolved.partnerHeading}
          body={getInvolved.partnerBody}
          ctaLabel={getInvolved.partnerCta}
          ctaHref={`/${lang}/contact/`}
        />
        <GetInvolvedCard
          icon="work"
          heading={getInvolved.workHeading}
          body={getInvolved.workBody}
          ctaLabel={getInvolved.workCta}
          ctaHref={`/${lang}/contact/`}
        />
      </div>
    </div>
  )
}
