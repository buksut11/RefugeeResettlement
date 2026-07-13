import { describe, it, expect } from 'vitest'
import { getContent } from '@/lib/content'

function keyShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(keyShape)
  if (value !== null && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .map((key) => [key, keyShape((value as Record<string, unknown>)[key])])
  }
  return null
}

describe('getContent', () => {
  it('returns English content for "en"', () => {
    const content = getContent('en')
    expect(content.site.name).toBe('Horumar Resettlement Network')
    expect(content.nav.home).toBe('Home')
  })

  it('returns Somali content for "so"', () => {
    const content = getContent('so')
    expect(content.site.name).toBe('Horumar Resettlement Network')
    expect(content.nav.home).toBeDefined()
  })

  it('includes Phase 4 About page content keys', () => {
    const content = getContent('en')
    expect(content.about.heading).toBe('About Us')
    expect(content.about.leadership).toHaveLength(3)
  })

  it('includes Phase 5 News content keys', () => {
    const content = getContent('en')
    expect(content.news.pageHeading).toBe('News & Stories')
    expect(content.news.filterRegionLabel).toBe('Region')
    expect(content.news.filterProgramLabel).toBe('Program')
    expect(content.news.filterAllLabel).toBe('All')
    expect(content.news.regionBoth).toBe('Both regions')
    expect(content.news.readMoreLabel).toBe('Read more')
    expect(content.news.consentNotice).toContain('informed consent')
  })

  it('includes Phase 5 Impact page content keys', () => {
    const content = getContent('en')
    expect(content.impact.pageHeading).toBe('Impact & Accountability')
    expect(content.impact.resultsThisYearLabel).toBe('This Year')
    expect(content.impact.resultsLastYearLabel).toBe('Last Year')
    expect(content.impact.percentagePlaceholder).toBe('[PERCENTAGE TO BE CONFIRMED]')
    expect(content.impact.complaintsPhone).toBe('[PHONE NUMBER TO BE CONFIRMED]')
    expect(content.impact.reportsEmptyState).toContain('[YEAR TO BE CONFIRMED]')
  })

  it('keeps Somali news and impact content structurally in sync with English', () => {
    const en = getContent('en')
    const so = getContent('so')
    expect(keyShape(so.news)).toEqual(keyShape(en.news))
    expect(keyShape(so.impact)).toEqual(keyShape(en.impact))
  })
})
