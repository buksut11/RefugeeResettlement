import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/home/Hero'

describe('Hero', () => {
  it('renders the headline as the page h1, the subline, and both CTAs with correct hrefs', () => {
    render(<Hero lang="en" />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Helping displaced families in Hiran and Southwest State rebuild their lives (DEMO TEXT)'
    )
    expect(
      screen.getByText(
        'Resettlement, shelter, and livelihoods support for families in Beledweyne and Baidoa. (DEMO TEXT)'
      )
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Our work' })).toHaveAttribute('href', '/en/programs/')
    expect(screen.getByRole('link', { name: 'Support our work' })).toHaveAttribute('href', '/en/donate/')
    expect(screen.getByText('Photo placeholder — real photograph to follow')).toBeInTheDocument()
  })
})
