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

  it('includes Phase 5 News and Impact content keys', () => {
    const content = getContent('en')
    expect(content.news.pageHeading).toBe('News & Stories')
    expect(content.impact.pageHeading).toBe('Impact & Accountability')
  })

  it('includes Phase 6 Get Involved content keys', () => {
    const content = getContent('en')
    expect(content.getInvolved.heading).toBe('Get Involved')
    expect(content.getInvolved.workBody).toContain('contact form')
  })

  it('includes Phase 6 Donate content keys', () => {
    const content = getContent('en')
    expect(content.donate.heading).toBe('Donate')
    expect(content.donate.mobileMoneyProviders.evcPlus.label).toBe('EVC Plus')
    expect(content.donate.mobileMoneyProviders.evcPlus.number).toBe(
      '[EVC PLUS NUMBER TO BE CONFIRMED]'
    )
    expect(content.donate.bankName).toBe('[BANK NAME TO BE CONFIRMED]')
    expect(content.donate.cardEmptyState).toContain('payment provider')
  })

  it('includes Phase 6 Contact content keys', () => {
    const content = getContent('en')
    expect(content.contact.heading).toBe('Contact')
    expect(content.contact.offices.hiran.heading).toBe('Beledweyne Office')
    expect(content.contact.offices.southwest.heading).toBe('Baidoa Office')
    expect(content.contact.formspreeEndpoint).toBe(
      'https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]'
    )
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
  })
})
