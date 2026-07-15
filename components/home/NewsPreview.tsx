import Link from 'next/link'
import { getContent } from '@/lib/content'
import { getAllNewsPosts } from '@/lib/markdown'
import { NewsPostCard } from '@/components/news/NewsPostCard'
import type { Lang } from '@/lib/i18n'

const PREVIEW_COUNT = 3

export function NewsPreview({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const posts = getAllNewsPosts(lang).slice(0, PREVIEW_COUNT)

  return (
    <section className="px-page py-14 sm:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{content.home.newsHeading}</h2>
        {posts.length > 0 ? (
          <Link
            href={`/${lang}/news/`}
            className="text-sm font-medium text-primary no-underline hover:underline"
          >
            {content.news.viewAllLabel}
          </Link>
        ) : null}
      </div>

      {posts.length > 0 ? (
        <div className="mt-8 border-t border-primary/10">
          {posts.map((post) => (
            <NewsPostCard key={post.slug} lang={lang} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-line px-6 py-10 text-center">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-6 w-6 text-ink/30">
            <g fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4.5h10.5L20 9v10.5H5Z" />
              <path d="M15.5 4.5V9H20" />
            </g>
          </svg>
          <p className="mx-auto mt-3 max-w-[36ch] text-sm text-ink/70">{content.home.newsEmptyState}</p>
        </div>
      )}
    </section>
  )
}
