import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewsPostCard } from '@/components/news/NewsPostCard'
import type { NewsPost } from '@/lib/markdown'

const basePost: NewsPost = {
  slug: 'shelter-kits-arrive-in-beledweyne',
  title: 'Shelter kits arrive in Beledweyne (DEMO)',
  date: '2026-06-01',
  region: 'hiran',
  program: 'shelter',
  summary: 'A demonstration post. (DEMO)',
  image: null,
  alt: null,
  contentHtml: '<p>Demo body.</p>',
}

describe('NewsPostCard', () => {
  it('renders the title as a link to the detail page, the date, and the summary', () => {
    render(<NewsPostCard lang="en" post={basePost} />)

    const link = screen.getByRole('link', { name: 'Shelter kits arrive in Beledweyne (DEMO)' })
    expect(link).toHaveAttribute('href', '/en/news/shelter-kits-arrive-in-beledweyne/')
    expect(screen.getByText('2026-06-01')).toBeInTheDocument()
    expect(screen.getByText('A demonstration post. (DEMO)')).toBeInTheDocument()
  })

  it('renders no image when the post has none', () => {
    render(<NewsPostCard lang="en" post={basePost} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders an image with meaningful alt text when the post has one', () => {
    const postWithImage: NewsPost = {
      ...basePost,
      image: '/images/demo-shelter-kits.jpg',
      alt: 'Volunteers unloading shelter kits from a truck (DEMO)',
    }
    render(<NewsPostCard lang="en" post={postWithImage} />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Volunteers unloading shelter kits from a truck (DEMO)')
  })
})
