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
    expect(content.impact.figurePlaceholder).toBe('[NUMBER TO BE CONFIRMED]')
  })

  it('includes Phase 4 About page content keys', () => {
    const content = getContent('en')
    expect(content.about.heading).toBe('About Us')
    expect(content.about.values).toHaveLength(4)
    expect(content.about.leadership).toHaveLength(3)
    expect(content.about.leadership[0].name).toBe('Amina Yusuf (DEMO NAME)')
    expect(content.about.commitmentPSEA).toContain('zero-tolerance')
  })

  it('includes Phase 4 extended program detail keys for all four programs', () => {
    const content = getContent('en')
    for (const slug of ['resettlement', 'shelter', 'livelihoods', 'protection'] as const) {
      expect(content.programs[slug].problem.length).toBeGreaterThan(0)
      expect(content.programs[slug].whatWeDo.length).toBeGreaterThan(0)
      expect(content.programs[slug].story.length).toBeGreaterThan(0)
      expect(content.programs[slug].storyAttribution.length).toBeGreaterThan(0)
    }
    expect(content.programDetail.problemHeading).toBe('The Problem')
    expect(content.programDetail.supportCta).toBe('Support this program')
  })

  it('includes Phase 4 Where We Work content keys with region anchors data', () => {
    const content = getContent('en')
    expect(content.whereWeWork.heading).toBe('Where We Work')
    expect(content.whereWeWork.hiran.heading).toBe('Hiran / Hirshabelle')
    expect(content.whereWeWork.hiran.coordination).toBe('[COORDINATION PARTNERS TO BE CONFIRMED]')
    expect(content.whereWeWork.southwest.heading).toBe('Southwest State')
    expect(content.whereWeWork.regionLabels.districts).toBe('Districts Covered')
  })
})
