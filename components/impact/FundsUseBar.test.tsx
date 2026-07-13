import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FundsUseBar } from '@/components/impact/FundsUseBar'

describe('FundsUseBar', () => {
  it('renders three equal-width segments with labels and the honest percentage placeholder', () => {
    render(<FundsUseBar lang="en" />)

    expect(screen.getByText('Program')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Fundraising')).toBeInTheDocument()
    expect(screen.getAllByText('[PERCENTAGE TO BE CONFIRMED]')).toHaveLength(3)
  })
})
