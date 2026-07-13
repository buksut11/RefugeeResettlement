import { describe, it, expect } from 'vitest'
import { getContent } from '@/lib/content'

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

  it('includes Phase 3 homepage content keys', () => {
    const content = getContent('en')
    expect(content.home.whereWeWorkHeading).toBe('Where We Work')
    expect(content.home.whatWeDoHeading).toBe('What We Do')
    expect(content.home.impactHeading).toBe('Impact')
    expect(content.home.newsHeading).toBe('Latest News')
    expect(content.programs.resettlement.title).toBe('Resettlement & Durable Solutions')
    expect(content.programs.shelter.title).toBe('Shelter & Essential Services')
    expect(content.programs.livelihoods.title).toBe('Livelihoods & Self-Reliance')
    expect(content.programs.protection.title).toBe('Protection & Community Cohesion')
    expect(content.impact.figurePlaceholder).toBe('[NUMBER TO BE CONFIRMED]')
  })
})
