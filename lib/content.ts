import type { Lang } from './i18n'
import en from '@/content/en.json'
import so from '@/content/so.json'

const contentByLang = { en, so } satisfies Record<Lang, typeof en>

export type SiteContent = typeof en

export function getContent(lang: Lang): SiteContent {
  return contentByLang[lang]
}
