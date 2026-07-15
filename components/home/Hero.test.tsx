import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/home/Hero'

describe('Hero', () => {
  it('renders the headline as the page h1, the subline, and both CTAs with correct hrefs', () => {
    render(<Hero lang="en" />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Helping displaced families in Hirshabelle State and Southwest State rebuild their lives'
    )
    expect(
      screen.getByText(
        'Resettlement, shelter, and livelihoods support for families in Beledweyne and Baidoa.'
      )
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Our work' })).toHaveAttribute('href', '/en/programs/')
    expect(screen.getByRole('link', { name: 'Support our work' })).toHaveAttribute('href', '/en/donate/')
    expect(screen.getByRole('img', { name: 'Hands stacked together in a show of unity and support' })).toBeInTheDocument()
    expect(screen.getByText('Photo: Hannah Busing / Unsplash')).toBeInTheDocument()
  })
})
