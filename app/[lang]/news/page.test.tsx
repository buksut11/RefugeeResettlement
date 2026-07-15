import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewsPage, { generateMetadata } from '@/app/[lang]/news/page'

describe('NewsPage', () => {
  it('renders the page heading and both demo posts unfiltered', () => {
    render(<NewsPage params={{ lang: 'en' }} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('News & Stories')
    expect(screen.getByText('Shelter kits arrive in Beledweyne')).toBeInTheDocument()
    expect(
      screen.getByText('First livelihoods training cohort completes course')
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<NewsPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns the News index page title, description, and hreflang alternates', () => {
    const metadata = generateMetadata({ params: { lang: 'en' } })
    expect(metadata.title).toBe('News & Stories | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/news/')
  })
})
