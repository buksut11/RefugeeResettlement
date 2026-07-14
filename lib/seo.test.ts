import { describe, it, expect } from 'vitest'
import { buildMetadata } from '@/lib/seo'

describe('buildMetadata', () => {
  it('builds a complete metadata object with title, description, hreflang alternates, and Open Graph/Twitter data', () => {
    const metadata = buildMetadata({
      lang: 'en',
      path: '/about/',
      title: 'About Us',
      description: 'Learn about our mission.',
    })

    expect(metadata.title).toBe('About Us | Horumar Resettlement Network')
    expect(metadata.description).toBe('Learn about our mission.')
    expect(metadata.alternates?.canonical).toBe('/en/about/')
    expect(metadata.alternates?.languages).toEqual({
      en: '/en/about/',
      so: '/so/about/',
    })
    expect(metadata.openGraph?.title).toBe('About Us | Horumar Resettlement Network')
    expect(metadata.openGraph?.description).toBe('Learn about our mission.')
    expect(metadata.openGraph?.locale).toBe('en')
    expect(metadata.twitter?.card).toBe('summary')
    expect(metadata.twitter?.title).toBe('About Us | Horumar Resettlement Network')
  })

  it('builds correct alternates for the home page path', () => {
    const metadata = buildMetadata({ lang: 'so', path: '/', title: 'Home', description: 'x' })
    expect(metadata.alternates?.canonical).toBe('/so/')
    expect(metadata.alternates?.languages).toEqual({
      en: '/en/',
      so: '/so/',
    })
  })
})
