import type { MetadataRoute } from 'next'

// [SITE URL TO BE CONFIRMED] — replace with the real production domain once
// Phase 8 assigns one.
const SITE_URL = 'https://example.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
