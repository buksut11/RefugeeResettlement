import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function BankDetails({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const { donate } = content

  return (
    <div className="mt-4 text-sm">
      <p>{donate.bankIntro}</p>
      <dl className="mt-4 space-y-2">
        <div>
          <dt className="font-semibold">{donate.bankNameLabel}</dt>
          <dd>{donate.bankName}</dd>
        </div>
        <div>
          <dt className="font-semibold">{donate.accountNameLabel}</dt>
          <dd>{donate.accountName}</dd>
        </div>
        <div>
          <dt className="font-semibold">{donate.accountNumberLabel}</dt>
          <dd>{donate.accountNumber}</dd>
        </div>
        <div>
          <dt className="font-semibold">{donate.swiftLabel}</dt>
          <dd>{donate.swift}</dd>
        </div>
      </dl>
    </div>
  )
}
