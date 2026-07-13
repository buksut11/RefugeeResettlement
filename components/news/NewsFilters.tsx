'use client'

import { useMemo, useState } from 'react'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import type { NewsPost, NewsRegion } from '@/lib/markdown'
import { PROGRAM_SLUGS, type ProgramSlug } from '@/components/home/programs-data'
import { NewsPostCard } from './NewsPostCard'

const REGIONS: NewsRegion[] = ['hiran', 'southwest', 'both']

export function NewsFilters({ lang, posts }: { lang: Lang; posts: NewsPost[] }) {
  const content = getContent(lang)
  const [region, setRegion] = useState<NewsRegion | 'all'>('all')
  const [program, setProgram] = useState<ProgramSlug | 'all'>('all')

  function regionLabel(value: NewsRegion): string {
    if (value === 'hiran') return content.home.mapRegionHiran
    if (value === 'southwest') return content.home.mapRegionSouthwest
    return content.news.regionBoth
  }

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const regionMatches = region === 'all' || post.region === region
        const programMatches = program === 'all' || post.program === program
        return regionMatches && programMatches
      }),
    [posts, region, program]
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <label className="text-sm">
          {content.news.filterRegionLabel}
          <select
            className="ml-2 border border-primary/20 p-1"
            value={region}
            onChange={(event) => setRegion(event.target.value as NewsRegion | 'all')}
          >
            <option value="all">{content.news.filterAllLabel}</option>
            {REGIONS.map((value) => (
              <option key={value} value={value}>
                {regionLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          {content.news.filterProgramLabel}
          <select
            className="ml-2 border border-primary/20 p-1"
            value={program}
            onChange={(event) => setProgram(event.target.value as ProgramSlug | 'all')}
          >
            <option value="all">{content.news.filterAllLabel}</option>
            {PROGRAM_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {content.programs[slug].title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        {filtered.map((post) => (
          <NewsPostCard key={post.slug} lang={lang} post={post} />
        ))}
      </div>
    </div>
  )
}
