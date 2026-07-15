import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NewsPostPage, { generateMetadata } from '@/app/[lang]/news/[slug]/page'

describe('NewsPostPage', () => {
  it('renders the post title, date, rendered Markdown body, and consent notice', () => {
    const { container } = render(
      <NewsPostPage params={{ lang: 'en', slug: 'shelter-kits-arrive-in-beledweyne' }} />
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Shelter kits arrive in Beledweyne'
    )
    expect(screen.getByText('2026-06-01')).toBeInTheDocument()
    expect(container.querySelector('strong')).toHaveTextContent('first delivery')
    expect(
      screen.getByText(
        "Names in personal stories may be changed to protect identity, and are shared only with the individual's informed consent."
      )
    ).toBeInTheDocument()
  })

  it('renders correctly for Somali without crashing', () => {
    render(<NewsPostPage params={{ lang: 'so', slug: 'shelter-kits-arrive-in-beledweyne' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('derives title and description from the post itself, not a shared content.seo entry', () => {
    const metadata = generateMetadata({
      params: { lang: 'en', slug: 'shelter-kits-arrive-in-beledweyne' },
    })
    expect(metadata.title).toBe('Shelter kits arrive in Beledweyne | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe(
      '/en/news/shelter-kits-arrive-in-beledweyne/'
    )
  })
})
