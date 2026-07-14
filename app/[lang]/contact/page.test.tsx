import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactPage, { generateMetadata } from '@/app/[lang]/contact/page'

describe('ContactPage', () => {
  it('renders both office cards, the contact form, and a prominent separate safeguarding link', () => {
    render(<ContactPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Contact',
      'Our Offices',
      'Beledweyne Office',
      'Baidoa Office',
      'Send a Message',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contact')
    expect(screen.getByRole('heading', { level: 3, name: 'Beledweyne Office' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Baidoa Office' })).toBeInTheDocument()

    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    const safeguardingLink = screen.getByRole('link', { name: 'Report a concern' })
    expect(safeguardingLink).toHaveAttribute('href', '/en/safeguarding/')
  })

  it('renders correctly for Somali without crashing', () => {
    render(<ContactPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Contact page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Contact Us | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/contact/')
  })
})
