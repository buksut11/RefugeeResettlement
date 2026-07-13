import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export default function HomePage({ params }: { params: { lang: Lang } }) {
  const content = getContent(params.lang)

  return (
    <section className="px-4 py-12">
      <h1 className="text-3xl font-semibold">{content.home.heroHeadline}</h1>
      <p className="mt-2 text-lg">{content.home.heroSubline}</p>
    </section>
  )
}
