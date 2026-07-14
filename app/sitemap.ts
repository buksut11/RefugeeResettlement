import type { MetadataRoute } from 'next'
import { LANGS } from '@/lib/i18n'
import { getAllPagePaths } from '@/lib/routes'

// [SITE URL TO BE CONFIRMED] — replace with the real production domain once
// Phase 8 assigns one; sitemap.xml requires absolute URLs.
const SITE_URL = 'https://example.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getAllPagePaths()

  return LANGS.flatMap((lang) =>
    paths.map((path) => ({
      url: path === '/' ? `${SITE_URL}/${lang}/` : `${SITE_URL}/${lang}${path}`,
    }))
  )
}
