import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/[lang]/page'

describe('HomePage', () => {
  it('renders the hero headline and subline for the given language', () => {
    render(<HomePage params={{ lang: 'en' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Helping displaced families in Hiran and Southwest State rebuild their lives (DEMO TEXT)'
    )
    expect(
      screen.getByText(
        'Resettlement, shelter, and livelihoods support for families in Beledweyne and Baidoa. (DEMO TEXT)'
      )
    ).toBeInTheDocument()
  })
})
