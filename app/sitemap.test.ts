import { describe, it, expect } from 'vitest'
import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  it('includes both languages for every page path, as absolute URLs', () => {
    const entries = sitemap()
    const urls = entries.map((entry) => entry.url)

    expect(urls).toContain('https://example.org/en/about/')
    expect(urls).toContain('https://example.org/so/about/')
    expect(urls).toContain('https://example.org/en/privacy/')
    expect(urls).toContain('https://example.org/en/programs/resettlement/')
    expect(urls).toContain('https://example.org/en/news/shelter-kits-arrive-in-beledweyne/')
    expect(urls).toContain('https://example.org/en/')
    expect(urls).toContain('https://example.org/so/')
  })
})
