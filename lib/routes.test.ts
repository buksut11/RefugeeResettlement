import { describe, it, expect } from 'vitest'
import { getAllPagePaths } from '@/lib/routes'

describe('getAllPagePaths', () => {
  it('includes every static page, all four program sub-pages, and both news posts, with no duplicates', () => {
    const paths = getAllPagePaths()

    expect(paths).toContain('/')
    expect(paths).toContain('/about/')
    expect(paths).toContain('/programs/')
    expect(paths).toContain('/where-we-work/')
    expect(paths).toContain('/impact/')
    expect(paths).toContain('/news/')
    expect(paths).toContain('/get-involved/')
    expect(paths).toContain('/donate/')
    expect(paths).toContain('/contact/')
    expect(paths).toContain('/privacy/')
    expect(paths).toContain('/safeguarding/')
    expect(paths).toContain('/terms/')
    expect(paths).toContain('/programs/resettlement/')
    expect(paths).toContain('/programs/shelter/')
    expect(paths).toContain('/programs/livelihoods/')
    expect(paths).toContain('/programs/protection/')
    expect(paths).toContain('/news/shelter-kits-arrive-in-beledweyne/')
    expect(paths).toContain('/news/first-livelihoods-training-cohort/')

    expect(new Set(paths).size).toBe(paths.length)
  })
})
