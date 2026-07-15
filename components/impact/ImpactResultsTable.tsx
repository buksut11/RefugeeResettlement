import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

const METRIC_KEYS = [
  'householdsSupported',
  'shelterKits',
  'livelihoodsTrainings',
  'districtsReached',
] as const

type Region = 'hiran' | 'southwest'

export function ImpactResultsTable({
  lang,
  region,
  regionLabel,
}: {
  lang: Lang
  region: Region
  regionLabel: string
}) {
  const content = getContent(lang)
  const results = content.impact.resultsByRegion[region]

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
            <td>{results[key].thisYear}</td>
            <td>{results[key].lastYear}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
