// app/[lang]/privacy/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacyPage, { generateMetadata } from '@/app/[lang]/privacy/page'

describe('PrivacyPage', () => {
  it('renders the literal DRAFT HTML comment, the visible draft notice, and every section heading in order', () => {
    const { container } = render(<PrivacyPage params={{ lang: 'en' }} />)

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
      'Privacy Policy',
      'What We Collect',
      'Third-Party Processing',
      'What We Never Collect',
      'Data Retention',
      'Questions About This Policy',
      'Changes to This Policy',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy Policy')
  })

  it('renders correctly for Somali without crashing', () => {
    render(<PrivacyPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('builds metadata with the correct title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Privacy Policy | Horumar Resettlement Network')
    expect(metadata.description).toBe(
      'How Horumar Resettlement Network handles information collected through this website.'
    )
    expect(metadata.alternates?.canonical).toBe('/en/privacy/')
  })
})
