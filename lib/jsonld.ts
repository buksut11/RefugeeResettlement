import { getContent } from './content'
import type { Lang } from './i18n'

export function buildOrganizationJsonLd(lang: Lang): string {
  const content = getContent(lang)

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: content.site.name,
  })
}
