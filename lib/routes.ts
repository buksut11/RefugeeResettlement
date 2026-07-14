import { PROGRAM_SLUGS } from '@/components/home/programs-data'
import { LANGS } from './i18n'
import { getAllNewsPosts } from './markdown'

const STATIC_PATHS = [
  '/',
  '/about/',
  '/programs/',
  '/where-we-work/',
  '/impact/',
  '/news/',
  '/get-involved/',
  '/donate/',
  '/contact/',
  '/privacy/',
  '/safeguarding/',
  '/terms/',
]

export function getAllPagePaths(): string[] {
  const programPaths = PROGRAM_SLUGS.map((slug) => `/programs/${slug}/`)
  const newsPaths = Array.from(
    new Set(LANGS.flatMap((lang) => getAllNewsPosts(lang).map((post) => `/news/${post.slug}/`)))
  )

  return [...STATIC_PATHS, ...programPaths, ...newsPaths]
}
