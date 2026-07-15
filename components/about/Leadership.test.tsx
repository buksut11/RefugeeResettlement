import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Leadership } from '@/components/about/Leadership'

describe('Leadership', () => {
  it('renders every board member name, role, and bio', () => {
    render(<Leadership lang="en" />)

    expect(screen.getByText('Amina Yusuf')).toBeInTheDocument()
    expect(screen.getByText('Executive Director')).toBeInTheDocument()
    expect(
      screen.getByText("Leads the organization's strategy and community partnerships.")
    ).toBeInTheDocument()

    expect(screen.getByText('Mohamed Ali')).toBeInTheDocument()
    expect(screen.getByText('Fadumo Hassan')).toBeInTheDocument()
  })
})
