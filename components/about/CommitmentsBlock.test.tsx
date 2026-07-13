import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommitmentsBlock } from '@/components/about/CommitmentsBlock'

describe('CommitmentsBlock', () => {
  it('renders all four commitment statements and links PSEA to the safeguarding page', () => {
    const { container } = render(<CommitmentsBlock lang="en" />)

    expect(
      screen.getByText(/Humanitarian Principles of humanity, neutrality, impartiality/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Core Humanitarian Standard \(CHS\)/)).toBeInTheDocument()
    expect(screen.getByText(/Do No Harm principles/)).toBeInTheDocument()

    // The PSEA statement's paragraph contains a nested <Link>, so its text is
    // split across elements — check the paragraph's full text directly
    // rather than relying on getByText's single-node matching.
    expect(container.textContent).toMatch(/zero-tolerance policy on sexual exploitation/)

    const link = screen.getByRole('link', { name: 'Safeguarding & PSEA' })
    expect(link).toHaveAttribute('href', '/en/safeguarding/')
  })
})
