import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllReports } from '@/lib/markdown'
import { ImpactResultsTable } from '@/components/impact/ImpactResultsTable'
import { FundsUseBar } from '@/components/impact/FundsUseBar'
import { ComplaintsBlock } from '@/components/impact/ComplaintsBlock'
import { ReportsSection } from '@/components/impact/ReportsSection'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/impact/',
    title: content.seo.impact.title,
    description: content.seo.impact.description,
  })
}

export default function ImpactPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const reports = getAllReports(lang)

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{content.impact.pageHeading}</h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.resultsHeading}</h2>
        <ImpactResultsTable lang={lang} regionLabel={content.home.mapRegionHiran} />
        <ImpactResultsTable lang={lang} regionLabel={content.home.mapRegionSouthwest} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.fundsUseHeading}</h2>
        <FundsUseBar lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.complaintsHeading}</h2>
        <ComplaintsBlock lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{content.impact.reportsHeading}</h2>
        <ReportsSection lang={lang} reports={reports} />
      </section>
    </div>
  )
}
