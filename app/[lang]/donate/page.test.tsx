import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DonatePage from '@/app/[lang]/donate/page'

describe('DonatePage', () => {
  it('renders every section heading in order and all three mobile money providers', () => {
    render(<DonatePage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Donate',
      'Somali Mobile Money',
      'Bank Transfer',
      'Card Donations',
      'How Donations Are Safeguarded',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Donate')
    expect(screen.getByText('EVC Plus')).toBeInTheDocument()
    expect(screen.getByText('Zaad')).toBeInTheDocument()
    expect(screen.getByText('Sahal')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Card donations will be available here once our payment provider link is set up.'
      )
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<DonatePage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
