// lib/markdown.test.ts
import { describe, it, expect } from 'vitest'
import { getAllNewsPosts, getNewsPost, getAllReports } from '@/lib/markdown'

describe('getAllNewsPosts', () => {
  it('returns both demo posts sorted newest first, with parsed front-matter and rendered HTML', () => {
    const posts = getAllNewsPosts('en')

    expect(posts).toHaveLength(2)
    expect(posts[0].slug).toBe('shelter-kits-arrive-in-beledweyne')
    expect(posts[0].title).toBe('Shelter kits arrive in Beledweyne (DEMO)')
    expect(posts[0].date).toBe('2026-06-01')
    expect(posts[0].region).toBe('hiran')
    expect(posts[0].program).toBe('shelter')
    expect(posts[0].image).toBeNull()
    expect(posts[0].contentHtml).toContain('<strong>demonstration article</strong>')

    expect(posts[1].slug).toBe('first-livelihoods-training-cohort')
    expect(posts[1].program).toBe('livelihoods')
  })

  it('returns Somali posts with the same slugs as English', () => {
    const enSlugs = getAllNewsPosts('en').map((post) => post.slug).sort()
    const soSlugs = getAllNewsPosts('so').map((post) => post.slug).sort()
    expect(soSlugs).toEqual(enSlugs)
  })
})

describe('getNewsPost', () => {
  it('returns the matching post by slug', () => {
    const post = getNewsPost('en', 'shelter-kits-arrive-in-beledweyne')
    expect(post?.title).toBe('Shelter kits arrive in Beledweyne (DEMO)')
  })

  it('returns null for an unknown slug', () => {
    expect(getNewsPost('en', 'does-not-exist')).toBeNull()
  })
})

describe('getAllReports', () => {
  it('returns an empty array when no reports have been supplied yet', () => {
    expect(getAllReports('en')).toEqual([])
    expect(getAllReports('so')).toEqual([])
  })
})
