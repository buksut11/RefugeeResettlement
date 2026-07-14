import type { Metadata } from 'next'
import { getContent } from './content'
import { otherLang, type Lang } from './i18n'

export function buildMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: Lang
  path: string
  title: string
  description: string
}): Metadata {
  const content = getContent(lang)
  const target = otherLang(lang)
  const fullTitle = `${title} | ${content.site.name}`
  const canonicalPath = `/${lang}${path}`
  const alternatePath = `/${target}${path}`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: lang === 'en' ? canonicalPath : alternatePath,
        so: lang === 'so' ? canonicalPath : alternatePath,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      locale: lang,
      url: canonicalPath,
      siteName: content.site.name,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  }
}
