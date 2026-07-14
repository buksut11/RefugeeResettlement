import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardDonations } from '@/components/donate/CardDonations'

describe('CardDonations', () => {
  it('renders the honest empty-state note with no fake payment link', () => {
    render(<CardDonations lang="en" />)

    expect(
      screen.getByText(
        'Card donations will be available here once our payment provider link is set up.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
