import { describe, it, expect } from 'vitest'
import { buildOrganizationJsonLd } from '@/lib/jsonld'

describe('buildOrganizationJsonLd', () => {
  it('returns valid JSON-LD with the correct schema.org type and organization name', () => {
    const json = buildOrganizationJsonLd('en')
    const parsed = JSON.parse(json)

    expect(parsed['@context']).toBe('https://schema.org')
    expect(parsed['@type']).toBe('NGO')
    expect(parsed.name).toBe('Horumar Resettlement Network')
  })

  it('returns the same organization name regardless of language, since it is a proper noun', () => {
    const enJson = JSON.parse(buildOrganizationJsonLd('en'))
    const soJson = JSON.parse(buildOrganizationJsonLd('so'))
    expect(enJson.name).toBe(soJson.name)
  })
})
