import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

const METRIC_KEYS = [
  'householdsSupported',
  'shelterKits',
  'livelihoodsTrainings',
  'districtsReached',
] as const

export function ImpactResultsTable({ lang, regionLabel }: { lang: Lang; regionLabel: string }) {
  const content = getContent(lang)

  return (
    <table className="mt-4 w-full text-sm">
      <caption className="mb-2 text-left font-display font-semibold">{regionLabel}</caption>
      <thead>
        <tr>
          <th className="text-left" scope="col"></th>
          <th className="text-left" scope="col">
            {content.impact.resultsThisYearLabel}
          </th>
          <th className="text-left" scope="col">
            {content.impact.resultsLastYearLabel}
          </th>
        </tr>
      </thead>
      <tbody>
        {METRIC_KEYS.map((key) => (
          <tr key={key}>
            <th className="text-left font-normal" scope="row">
              {content.impact[key]}
            </th>
            <td>{content.impact.figurePlaceholder}</td>
            <td>{content.impact.figurePlaceholder}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
