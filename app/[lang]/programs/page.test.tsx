import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramsPage, { generateMetadata } from '@/app/[lang]/programs/page'

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

    expect(
      screen.getByRole('heading', { level: 2, name: /Resettlement & Durable Solutions/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /Shelter & Essential Services/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /Livelihoods & Self-Reliance/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /Protection & Community Cohesion/ })
    ).toBeInTheDocument()
  })

  it('renders the Somali version without crashing', () => {
    render(<ProgramsPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Programs index page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Our Programs | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/programs/')
  })
})
