import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import type { Report } from '@/lib/markdown'

export function ReportsSection({ lang, reports }: { lang: Lang; reports: Report[] }) {
  const content = getContent(lang)

  if (reports.length === 0) {
    return <p className="mt-4 text-sm">{content.impact.reportsEmptyState}</p>
  }

  return (
    <ul className="mt-4 space-y-2 text-sm">
      {reports.map((report) => (
        <li key={report.slug}>
          <a href={report.file}>{report.title}</a>
        </li>
      ))}
    </ul>
  )
}
