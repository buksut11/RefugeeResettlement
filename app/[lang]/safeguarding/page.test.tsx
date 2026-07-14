// app/[lang]/safeguarding/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SafeguardingPage, { generateMetadata } from '@/app/[lang]/safeguarding/page'

describe('SafeguardingPage', () => {
  it('renders the literal DRAFT HTML comment, the visible draft notice, and every section heading in order', () => {
    const { container } = render(<SafeguardingPage params={{ lang: 'en' }} />)

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
      'Safeguarding & PSEA Policy',
      'Zero-Tolerance Policy',
      'How to Report a Concern',
      'Confidentiality and Non-Retaliation',
      'Consent, Photography, and Storytelling',
      'How Reports Are Handled',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Safeguarding & PSEA Policy'
    )
  })

  it('renders correctly for Somali without crashing', () => {
    render(<SafeguardingPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('builds metadata with the correct title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Safeguarding & PSEA Policy | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/safeguarding/')
  })
})
