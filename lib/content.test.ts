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

  it('includes Phase 6 Get Involved, Donate, and Contact content keys', () => {
    const content = getContent('en')
    expect(content.getInvolved.heading).toBe('Get Involved')
    expect(content.donate.heading).toBe('Donate')
    expect(content.contact.heading).toBe('Contact')
  })

  it('includes Phase 7a legal content keys', () => {
    const content = getContent('en')
    expect(content.legal.draftNotice).toContain('has not yet been reviewed')
    expect(content.privacy.heading).toBe('Privacy Policy')
    expect(content.safeguarding.heading).toBe('Safeguarding & PSEA Policy')
    expect(content.terms.heading).toBe('Terms of Use')
    expect(content.terms.governingLawBody).toContain('[JURISDICTION TO BE CONFIRMED]')
  })

  it('includes Phase 7a SEO content keys for all twelve static pages', () => {
    const content = getContent('en')
    for (const page of [
      'home',
      'about',
      'programs',
      'whereWeWork',
      'impact',
      'news',
      'getInvolved',
      'donate',
      'contact',
      'privacy',
      'safeguarding',
      'terms',
    ] as const) {
      expect(content.seo[page].title.length).toBeGreaterThan(0)
      expect(content.seo[page].description.length).toBeGreaterThan(0)
    }
  })

  it('keeps all Somali content structurally in sync with English', () => {
    const en = getContent('en')
    const so = getContent('so')
    expect(keyShape(so.about)).toEqual(keyShape(en.about))
    expect(keyShape(so.news)).toEqual(keyShape(en.news))
    expect(keyShape(so.impact)).toEqual(keyShape(en.impact))
    expect(keyShape(so.programDetail)).toEqual(keyShape(en.programDetail))
    expect(keyShape(so.programsPage)).toEqual(keyShape(en.programsPage))
    expect(keyShape(so.whereWeWork)).toEqual(keyShape(en.whereWeWork))
    expect(keyShape(so.programs)).toEqual(keyShape(en.programs))
    expect(keyShape(so.getInvolved)).toEqual(keyShape(en.getInvolved))
    expect(keyShape(so.donate)).toEqual(keyShape(en.donate))
    expect(keyShape(so.contact)).toEqual(keyShape(en.contact))
    expect(keyShape(so.legal)).toEqual(keyShape(en.legal))
    expect(keyShape(so.privacy)).toEqual(keyShape(en.privacy))
    expect(keyShape(so.safeguarding)).toEqual(keyShape(en.safeguarding))
    expect(keyShape(so.terms)).toEqual(keyShape(en.terms))
    expect(keyShape(so.seo)).toEqual(keyShape(en.seo))
  })
})
