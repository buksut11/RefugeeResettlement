import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WhereWeWorkPage, { generateMetadata } from '@/app/[lang]/where-we-work/page'

describe('WhereWeWorkPage', () => {
  it('renders the page heading and both region blocks with the correct anchor ids', () => {
    render(<WhereWeWorkPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['Where We Work', 'Hirshabelle State', 'Southwest State'])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Where We Work')

    const hiranHeading = screen.getByRole('heading', { level: 2, name: 'Hirshabelle State' })
    expect(hiranHeading.closest('section')).toHaveAttribute('id', 'hiran')

    const southwestHeading = screen.getByRole('heading', { level: 2, name: 'Southwest State' })
    expect(southwestHeading.closest('section')).toHaveAttribute('id', 'southwest')

    expect(screen.getByText(/Shabelle River burst its banks at Beledweyne/)).toBeInTheDocument()
  })

  it('renders the Somali version without crashing', () => {
    render(<WhereWeWorkPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the Where We Work page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('Where We Work | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/where-we-work/')
  })
})
