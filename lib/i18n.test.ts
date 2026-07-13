import { describe, it, expect } from 'vitest'
import { getAlternatePath, otherLang, LANGS } from '@/lib/i18n'

describe('LANGS', () => {
  it('contains exactly en and so, in that order', () => {
    expect(LANGS).toEqual(['en', 'so'])
  })
})

describe('otherLang', () => {
  it('returns so for en', () => {
    expect(otherLang('en')).toBe('so')
  })

  it('returns en for so', () => {
    expect(otherLang('so')).toBe('en')
  })
})

describe('getAlternatePath', () => {
  it('swaps the language segment of a nested path', () => {
    expect(getAlternatePath('/en/about', 'so')).toBe('/so/about/')
  })

  it('handles the root of a language', () => {
    expect(getAlternatePath('/en/', 'so')).toBe('/so/')
  })

  it('handles deeply nested paths', () => {
    expect(getAlternatePath('/so/programs/resettlement', 'en')).toBe('/en/programs/resettlement/')
  })

  it('prefixes a language when the path has none', () => {
    expect(getAlternatePath('/', 'en')).toBe('/en/')
  })
})
