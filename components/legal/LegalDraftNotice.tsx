import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function LegalDraftNotice({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <p className="mb-6 rounded border border-accent/40 bg-accent/10 p-3 text-sm font-semibold text-ink">
      {content.legal.draftNotice}
    </p>
  )
}
