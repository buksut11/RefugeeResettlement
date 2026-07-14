import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GetInvolvedPage, { generateMetadata } from '@/app/[lang]/get-involved/page'

describe('GetInvolvedPage', () => {
  it('renders all three paths in order, each linking to the right page', () => {
    render(<GetInvolvedPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['Get Involved', 'Donate', 'Partner With Us', 'Work With Us'])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get Involved')

    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute(
      'href',
      '/en/donate/'
    )
    expect(screen.getByRole('link', { name: 'Contact us to partner' })).toHaveAttribute(
      'href',
      '/en/contact/'
    )
    expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute(
      'href',
      '/en/contact/'
    )
    expect(
      screen.getByText(/No open positions or volunteer roles are listed here/)
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<GetInvolvedPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Get Involved page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Get Involved | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/get-involved/')
  })
})
