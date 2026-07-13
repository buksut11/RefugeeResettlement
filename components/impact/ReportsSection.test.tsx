import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReportsSection } from '@/components/impact/ReportsSection'
import type { Report } from '@/lib/markdown'

describe('ReportsSection', () => {
  it('renders the honest empty state when there are no reports', () => {
    render(<ReportsSection lang="en" reports={[]} />)
    expect(
      screen.getByText('Our first annual report will be published here in [YEAR TO BE CONFIRMED].')
    ).toBeInTheDocument()
  })

  it('renders a download link per report when reports exist', () => {
    const reports: Report[] = [
      {
        slug: 'annual-report-2026',
        title: 'Annual Report 2026',
        date: '2026-12-31',
        category: 'annual-report',
        file: '/reports/annual-report-2026.pdf',
      },
    ]
    render(<ReportsSection lang="en" reports={reports} />)

    const link = screen.getByRole('link', { name: 'Annual Report 2026' })
    expect(link).toHaveAttribute('href', '/reports/annual-report-2026.pdf')
    expect(
      screen.queryByText('Our first annual report will be published here in [YEAR TO BE CONFIRMED].')
    ).not.toBeInTheDocument()
  })
})
