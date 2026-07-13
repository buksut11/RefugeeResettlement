import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function ComplaintsBlock({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <div className="mt-4 text-sm">
      <p>{content.impact.complaintsIntro}</p>
      <dl className="mt-4 space-y-2">
        <div>
          <dt className="font-semibold">{content.impact.complaintsPhoneLabel}</dt>
          <dd>{content.impact.complaintsPhone}</dd>
        </div>
        <div>
          <dt className="font-semibold">{content.impact.complaintsWhatsappLabel}</dt>
          <dd>{content.impact.complaintsWhatsapp}</dd>
        </div>
        <div>
          <dt className="font-semibold">{content.impact.complaintsEmailLabel}</dt>
          <dd>{content.impact.complaintsEmail}</dd>
        </div>
      </dl>
    </div>
  )
}
