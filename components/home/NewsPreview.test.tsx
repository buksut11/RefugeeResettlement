import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewsPreview } from '@/components/home/NewsPreview'

describe('NewsPreview', () => {
  it('renders the heading, a "view all" link, and the latest news posts', () => {
    render(<NewsPreview lang="en" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Latest News' })).toBeInTheDocument()

    const viewAllLink = screen.getByRole('link', { name: 'View all news' })
    expect(viewAllLink).toHaveAttribute('href', '/en/news/')

    const articles = screen.getAllByRole('article')
    expect(articles.length).toBeGreaterThan(0)

    expect(
      screen.getByRole('link', { name: 'Shelter kits arrive in Beledweyne' })
    ).toHaveAttribute('href', '/en/news/shelter-kits-arrive-in-beledweyne/')
  })
})
