import type { Metadata } from 'next'
import { LANGS, type Lang } from '@/lib/i18n'
import { getAllNewsPosts, getNewsPost } from '@/lib/markdown'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ConsentNotice } from '@/components/news/ConsentNotice'

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    getAllNewsPosts(lang).map((post) => ({ lang, slug: post.slug }))
  )
}

export function generateMetadata({
  params,
}: {
  params: { lang: Lang; slug: string }
}): Metadata {
  const post = getNewsPost(params.lang, params.slug)
  if (!post) {
    return {}
  }
  return buildMetadata({
    lang: params.lang,
    path: `/news/${params.slug}/`,
    title: post.title,
    description: post.summary,
  })
}

export default function NewsPostPage({
  params,
}: {
  params: { lang: Lang; slug: string }
}) {
  const { lang, slug } = params
  const post = getNewsPost(lang, slug)
  const content = getContent(lang)

  if (!post) {
    return null
  }

  const regionLabel =
    post.region === 'hiran'
      ? content.home.mapRegionHiran
      : post.region === 'southwest'
        ? content.home.mapRegionSouthwest
        : content.news.regionBoth

  return (
    <div className="px-page py-10">
      <h1 className="font-display text-3xl font-semibold">{post.title}</h1>
      <p className="text-xs text-ink/60">{post.date}</p>
      <p className="mt-1 text-sm">
        {regionLabel}
        {post.program ? ` · ${content.programs[post.program].title}` : ''}
      </p>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <ConsentNotice lang={lang} />
    </div>
  )
}
