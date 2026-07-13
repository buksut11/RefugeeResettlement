import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewsPreview } from '@/components/home/NewsPreview'

describe('NewsPreview', () => {
  it('renders the heading and an honest empty state, with no fabricated posts', () => {
    render(<NewsPreview lang="en" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Latest News' })).toBeInTheDocument()
    expect(screen.getByText('News and updates will appear here once published.')).toBeInTheDocument()
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })
})
