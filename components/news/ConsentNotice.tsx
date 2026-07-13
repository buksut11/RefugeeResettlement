import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function ConsentNotice({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  return <p className="mt-6 text-xs text-ink/60">{content.news.consentNotice}</p>
}
