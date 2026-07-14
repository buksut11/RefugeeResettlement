import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function FundsUseBar({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  const segments = [
    { label: content.impact.fundsUseProgramLabel, color: 'bg-secondary', textColor: 'text-paper' },
    { label: content.impact.fundsUseAdminLabel, color: 'bg-primary', textColor: 'text-paper' },
    { label: content.impact.fundsUseFundraisingLabel, color: 'bg-accent/80', textColor: 'text-ink' },
  ]

  return (
    <div className="mt-4 flex overflow-hidden rounded">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className={`flex-1 p-3 text-center text-xs ${segment.color} ${segment.textColor}`}
        >
          <p className="font-semibold">{segment.label}</p>
          <p>{content.impact.percentagePlaceholder}</p>
        </div>
      ))}
    </div>
  )
}
