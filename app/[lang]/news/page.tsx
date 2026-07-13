import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllNewsPosts } from '@/lib/markdown'
import { NewsFilters } from '@/components/news/NewsFilters'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function NewsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const posts = getAllNewsPosts(lang)

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{content.news.pageHeading}</h1>
      <NewsFilters lang={lang} posts={posts} />
    </div>
  )
}
