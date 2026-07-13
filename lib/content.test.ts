import { describe, it, expect } from 'vitest'
import { getContent } from '@/lib/content'

describe('getContent', () => {
  it('returns English content for "en"', () => {
    const content = getContent('en')
    expect(content.site.name).toBe('[ORGANIZATION NAME]')
    expect(content.nav.home).toBe('Home')
  })

  it('returns Somali content for "so"', () => {
    const content = getContent('so')
    expect(content.site.name).toBe('[ORGANIZATION NAME]')
    expect(content.nav.home).toBeDefined()
  })
})
