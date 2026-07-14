import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function CardDonations({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  return <p className="mt-4 text-sm">{content.donate.cardEmptyState}</p>
}
