import { Hero } from '@/components/home/Hero'
import { SomaliaMap } from '@/components/home/SomaliaMap'
import { ProgramsSection } from '@/components/home/ProgramsSection'
import { ImpactStrip } from '@/components/home/ImpactStrip'
import { NewsPreview } from '@/components/home/NewsPreview'
import type { Lang } from '@/lib/i18n'

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
