import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FundsUseBar } from '@/components/impact/FundsUseBar'

describe('FundsUseBar', () => {
  it('renders three segments with labels and their percentages', () => {
    render(<FundsUseBar lang="en" />)

    expect(screen.getByText('Program')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('11%')).toBeInTheDocument()
    expect(screen.getByText('Fundraising')).toBeInTheDocument()
    expect(screen.getByText('7%')).toBeInTheDocument()
  })
})
