import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage, { generateMetadata } from '@/app/[lang]/about/page'

describe('AboutPage', () => {
  it('renders every section heading in order and the leadership/commitments content', () => {
    render(<AboutPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'About Us',
      'Who We Are',
      'Mission',
      'Vision',
      'Values',
      'Our Story',
      'Leadership & Board',
      'Legal Registration & Governance',
      'Our Commitments',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About Us')
    expect(screen.getByText('Dignity')).toBeInTheDocument()
    expect(screen.getByText('Amina Yusuf')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Safeguarding & PSEA' })).toHaveAttribute(
      'href',
      '/en/safeguarding/'
    )
  })

  it('renders the Somali version without crashing', () => {
    render(<AboutPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the About page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('About Us | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/about/')
  })
})
