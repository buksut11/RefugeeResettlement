import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/[lang]/page'

describe('HomePage', () => {
  it('renders the hero headline and subline for the given language', () => {
    render(<HomePage params={{ lang: 'en' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('[HERO HEADLINE TO BE CONFIRMED]')
    expect(screen.getByText('[HERO SUBLINE TO BE CONFIRMED]')).toBeInTheDocument()
  })
})
