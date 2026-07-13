import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImpactStrip } from '@/components/home/ImpactStrip'

describe('ImpactStrip', () => {
  it('renders four figures, each showing the placeholder value and its label', () => {
    render(<ImpactStrip lang="en" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Impact' })).toBeInTheDocument()

    const placeholders = screen.getAllByText('[NUMBER TO BE CONFIRMED]')
    expect(placeholders).toHaveLength(4)

    expect(screen.getByText('households supported')).toBeInTheDocument()
    expect(screen.getByText('shelter kits distributed')).toBeInTheDocument()
    expect(screen.getByText('livelihoods trainings completed')).toBeInTheDocument()
    expect(screen.getByText('districts reached')).toBeInTheDocument()
  })
})
