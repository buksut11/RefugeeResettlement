import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BankDetails } from '@/components/donate/BankDetails'

describe('BankDetails', () => {
  it('renders the intro and all four labeled bank fields', () => {
    render(<BankDetails lang="en" />)

    expect(
      screen.getByText('For institutional donors, transfer directly to our bank account.')
    ).toBeInTheDocument()
    expect(screen.getByText('Bank Name')).toBeInTheDocument()
    expect(screen.getByText('Golden Horn Commercial Bank')).toBeInTheDocument()
    expect(screen.getByText('Account Name')).toBeInTheDocument()
    expect(screen.getByText('Horumar Resettlement Network')).toBeInTheDocument()
    expect(screen.getByText('Account Number')).toBeInTheDocument()
    expect(screen.getByText('0123456789')).toBeInTheDocument()
    expect(screen.getByText('SWIFT/BIC')).toBeInTheDocument()
    expect(screen.getByText('GHCBSOSOXXX')).toBeInTheDocument()
  })
})
