import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/about',
}))

describe('LanguageSwitcher', () => {
  it('links to the Somali version of the current path', () => {
    render(<LanguageSwitcher lang="en" />)
    const link = screen.getByRole('link', { name: /switch to somali/i })
    expect(link).toHaveAttribute('href', '/so/about/')
    expect(link).toHaveTextContent('SO')
  })
})
