import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/',
}))

describe('Header', () => {
  it('renders all primary nav links with trailing-slash hrefs', () => {
    render(<Header lang="en" />)
    // Both the desktop inline nav and the mobile menu panel expose a "Primary" nav
    // landmark; only one is visible at a given viewport width via CSS, so either works.
    const [nav] = screen.getAllByRole('navigation', { name: 'Primary' })

    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en/')
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/en/about/')
    expect(within(nav).getByRole('link', { name: 'Donate' })).toHaveAttribute('href', '/en/donate/')
  })

  it('renders the language switcher without needing a menu opened', () => {
    render(<Header lang="en" />)
    expect(screen.getByRole('link', { name: /switch to somali/i })).toBeInTheDocument()
  })
})
