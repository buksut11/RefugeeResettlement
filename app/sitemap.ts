import type { MetadataRoute } from 'next'
import { LANGS } from '@/lib/i18n'
import { getAllPagePaths } from '@/lib/routes'
import { SITE_URL } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getAllPagePaths()

  return LANGS.flatMap((lang) =>
    paths.map((path) => ({
      url: path === '/' ? `${SITE_URL}/${lang}/` : `${SITE_URL}/${lang}${path}`,
    }))
  )
}
