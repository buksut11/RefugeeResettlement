import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'

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
  const content = getContent(lang)
  const { getInvolved } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{getInvolved.heading}</h1>
      <p className="mt-2 text-lg">{getInvolved.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{getInvolved.donateHeading}</h2>
        <p className="mt-2">{getInvolved.donateBody}</p>
        <Link href={`/${lang}/donate/`} className="mt-2 inline-block font-semibold underline">
          {getInvolved.donateCta}
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{getInvolved.partnerHeading}</h2>
        <p className="mt-2">{getInvolved.partnerBody}</p>
        <Link href={`/${lang}/contact/`} className="mt-2 inline-block font-semibold underline">
          {getInvolved.partnerCta}
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{getInvolved.workHeading}</h2>
        <p className="mt-2">{getInvolved.workBody}</p>
        <Link href={`/${lang}/contact/`} className="mt-2 inline-block font-semibold underline">
          {getInvolved.workCta}
        </Link>
      </section>
    </div>
  )
}
