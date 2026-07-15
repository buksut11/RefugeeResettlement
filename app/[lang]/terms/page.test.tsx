import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TermsPage, { generateMetadata } from '@/app/[lang]/terms/page'

describe('TermsPage', () => {
  it('renders the literal DRAFT HTML comment, the visible draft notice, every section heading in order, and the governing law text', () => {
    const { container } = render(<TermsPage params={{ lang: 'en' }} />)

    expect(container.innerHTML).toContain(
      "<!-- DRAFT — must be reviewed by the organization's legal/protection focal point before publication -->"
    )
    expect(
      screen.getByText(
        "Draft policy — this page has not yet been reviewed by the organization's legal or protection focal point. Do not rely on it as final."
      )
    ).toBeInTheDocument()

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Terms of Use',
      'Acceptable Use',
      'Content Ownership',
      'No Warranty',
      'Governing Law',
      'Changes to These Terms',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms of Use')
    expect(screen.getByText(/the laws of Somalia/)).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<TermsPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('builds metadata with the correct title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Terms of Use | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/terms/')
  })
})
