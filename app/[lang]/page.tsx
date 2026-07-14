import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/home/Hero'
import { SomaliaMap } from '@/components/home/SomaliaMap'
import { ProgramsSection } from '@/components/home/ProgramsSection'
import { ImpactStrip } from '@/components/home/ImpactStrip'
import { NewsPreview } from '@/components/home/NewsPreview'
import type { Lang } from '@/lib/i18n'

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return buildMetadata({
    lang: params.lang,
    path: '/',
    title: content.seo.home.title,
    description: content.seo.home.description,
  })
}

export default function HomePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params

  return (
    <>
      <Hero lang={lang} />
      <SomaliaMap lang={lang} />
      <ProgramsSection lang={lang} />
      <ImpactStrip lang={lang} />
      <NewsPreview lang={lang} />
    </>
  )
}
