import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { LANGS, type Lang } from '@/lib/i18n'
import { RegionBlock } from '@/components/where-we-work/RegionBlock'
import { RegionMap } from '@/components/where-we-work/RegionMap'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/where-we-work/',
    title: content.seo.whereWeWork.title,
    description: content.seo.whereWeWork.description,
  })
}

export default function WhereWeWorkPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { whereWeWork } = content

  return (
    <div className="px-page py-10">
      <p className="eyebrow">{content.home.mapRegionHiran} &middot; {content.home.mapRegionSouthwest}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{whereWeWork.heading}</h1>
      <p className="mt-2 max-w-[52ch] text-lg text-ink/80">{whereWeWork.intro}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-14">
        <RegionMap lang={lang} />
        <div className="grid gap-6">
          <RegionBlock id="hiran" region={whereWeWork.hiran} labels={whereWeWork.regionLabels} tone="secondary" />
          <RegionBlock id="southwest" region={whereWeWork.southwest} labels={whereWeWork.regionLabels} tone="accent" />
        </div>
      </div>
    </div>
  )
}
