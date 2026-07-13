import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImpactPage from '@/app/[lang]/impact/page'

describe('ImpactPage', () => {
  it('renders every section heading in order, both results tables, and the reports empty state', () => {
    render(<ImpactPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Impact & Accountability',
      'Results by Year and Region',
      'How Our Funds Are Used',
      'Complaints & Feedback',
      'Reports',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Hiran / Hirshabelle')).toBeInTheDocument()
    expect(screen.getByText('Southwest State')).toBeInTheDocument()
    expect(
      screen.getByText('Our first annual report will be published here in [YEAR TO BE CONFIRMED].')
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<ImpactPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
