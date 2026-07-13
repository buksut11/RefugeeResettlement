import Image from 'next/image'
import Link from 'next/link'
import type { Lang } from '@/lib/i18n'
import type { NewsPost } from '@/lib/markdown'

export function NewsPostCard({ lang, post }: { lang: Lang; post: NewsPost }) {
  return (
    <article className="border-b border-primary/10 py-4">
      {post.image ? (
        <Image
          src={post.image}
          alt={post.alt ?? post.title}
          width={400}
          height={225}
          className="mb-2 w-full rounded object-cover"
        />
      ) : null}
      <h3 className="font-display text-lg font-semibold">
        <Link href={`/${lang}/news/${post.slug}/`}>{post.title}</Link>
      </h3>
      <p className="text-xs text-ink/60">{post.date}</p>
      <p className="mt-2 text-sm">{post.summary}</p>
    </article>
  )
}
