import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewsPage from '@/app/[lang]/news/page'

describe('NewsPage', () => {
  it('renders the page heading and both demo posts unfiltered', () => {
    render(<NewsPage params={{ lang: 'en' }} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('News & Stories')
    expect(screen.getByText('Shelter kits arrive in Beledweyne (DEMO)')).toBeInTheDocument()
    expect(
      screen.getByText('First livelihoods training cohort completes course (DEMO)')
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<NewsPage params={{ lang: 'so' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
