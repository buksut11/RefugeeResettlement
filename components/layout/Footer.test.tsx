import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders safeguarding, privacy, and terms links with trailing-slash hrefs', () => {
    render(<Footer lang="en" />)
    expect(screen.getByRole('link', { name: 'Safeguarding & PSEA' })).toHaveAttribute('href', '/en/safeguarding/')
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/en/privacy/')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/en/terms/')
  })

  it('renders the copyright line with the current year', () => {
    render(<Footer lang="en" />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })
})
