import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramsPage from '@/app/[lang]/programs/page'

describe('ProgramsPage', () => {
  it('renders the page heading, intro, and all four program cards with correct hrefs', () => {
    render(<ProgramsPage params={{ lang: 'en' }} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Our Programs')
    expect(
      screen.getByText('Four connected programs help displaced families move from crisis to stability. (DEMO)')
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /Resettlement & Durable Solutions/ })).toHaveAttribute(
      'href',
      '/en/programs/resettlement/'
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
