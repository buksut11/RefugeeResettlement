import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NewsFilters } from '@/components/news/NewsFilters'
import type { NewsPost } from '@/lib/markdown'

const posts: NewsPost[] = [
  {
    slug: 'shelter-kits-arrive-in-beledweyne',
    title: 'Shelter kits arrive in Beledweyne (DEMO)',
    date: '2026-06-01',
    region: 'hiran',
    program: 'shelter',
    summary: 'A demonstration post. (DEMO)',
    image: null,
    alt: null,
    contentHtml: '<p>Demo body.</p>',
  },
  {
    slug: 'first-livelihoods-training-cohort',
    title: 'First livelihoods training cohort completes course (DEMO)',
    date: '2026-05-15',
    region: 'southwest',
    program: 'livelihoods',
    summary: 'A demonstration post. (DEMO)',
    image: null,
    alt: null,
    contentHtml: '<p>Demo body.</p>',
  },
]

describe('NewsFilters', () => {
  it('shows all posts by default, then filters by region and by program', () => {
    render(<NewsFilters lang="en" posts={posts} />)

    expect(screen.getByText('Shelter kits arrive in Beledweyne (DEMO)')).toBeInTheDocument()
    expect(
      screen.getByText('First livelihoods training cohort completes course (DEMO)')
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'hiran' } })
    expect(screen.getByText('Shelter kits arrive in Beledweyne (DEMO)')).toBeInTheDocument()
    expect(
      screen.queryByText('First livelihoods training cohort completes course (DEMO)')
    ).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'all' } })
    fireEvent.change(screen.getByLabelText('Program'), { target: { value: 'livelihoods' } })
    expect(
      screen.getByText('First livelihoods training cohort completes course (DEMO)')
    ).toBeInTheDocument()
    expect(screen.queryByText('Shelter kits arrive in Beledweyne (DEMO)')).not.toBeInTheDocument()
  })
})
