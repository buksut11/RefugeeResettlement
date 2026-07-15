import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage, { generateMetadata } from '@/app/[lang]/page'

describe('HomePage', () => {
  it('renders every section in order: hero, map, programs (incl. each card title), impact, news', () => {
    render(<HomePage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Helping displaced families in Hirshabelle State and Southwest State rebuild their lives',
      'Where We Work',
      'What We Do',
      'Resettlement & Durable Solutions',
      'Shelter & Essential Services',
      'Livelihoods & Self-Reliance',
      'Protection & Community Cohesion',
      'Impact',
      'Latest News',
      'Shelter kits arrive in Beledweyne',
      'First livelihoods training cohort completes course',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the home page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Home | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/')
    expect(metadata.alternates?.languages).toEqual({ en: '/en/', so: '/so/' })
  })
})
