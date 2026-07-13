import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgramsSection } from '@/components/home/ProgramsSection'

describe('ProgramsSection', () => {
  it('renders all four program cards with correct titles, summaries, and hrefs', () => {
    render(<ProgramsSection lang="en" />)

    expect(screen.getByRole('heading', { level: 2, name: 'What We Do' })).toBeInTheDocument()

    const resettlement = screen.getByRole('link', { name: /Resettlement & Durable Solutions/ })
    expect(resettlement).toHaveAttribute('href', '/en/programs/resettlement/')
    expect(resettlement).toHaveTextContent(
      'We help displaced families secure land, shelter, and a lasting place to rebuild. (DEMO)'
    )

    expect(screen.getByRole('link', { name: /Shelter & Essential Services/ })).toHaveAttribute(
      'href',
      '/en/programs/shelter/'
    )
    expect(screen.getByRole('link', { name: /Livelihoods & Self-Reliance/ })).toHaveAttribute(
      'href',
      '/en/programs/livelihoods/'
    )
    expect(screen.getByRole('link', { name: /Protection & Community Cohesion/ })).toHaveAttribute(
      'href',
      '/en/programs/protection/'
    )
  })
})
