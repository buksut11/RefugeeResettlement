import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { RegionBlock } from '@/components/where-we-work/RegionBlock'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function WhereWeWorkPage({ params }: { params: { lang: Lang } }) {
  const content = getContent(params.lang)
  const { whereWeWork } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{whereWeWork.heading}</h1>
      <p className="mt-2 text-lg">{whereWeWork.intro}</p>
      <RegionBlock id="hiran" region={whereWeWork.hiran} labels={whereWeWork.regionLabels} />
      <RegionBlock id="southwest" region={whereWeWork.southwest} labels={whereWeWork.regionLabels} />
    </div>
  )
}
