import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImpactStrip } from '@/components/home/ImpactStrip'

describe('ImpactStrip', () => {
  it('renders four figures, each showing its value and label', () => {
    render(<ImpactStrip lang="en" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Impact' })).toBeInTheDocument()

    expect(screen.getByText('1,240')).toBeInTheDocument()
    expect(screen.getByText('860')).toBeInTheDocument()
    expect(screen.getByText('410')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    expect(screen.getByText('households supported')).toBeInTheDocument()
    expect(screen.getByText('shelter kits distributed')).toBeInTheDocument()
    expect(screen.getByText('livelihoods trainings completed')).toBeInTheDocument()
    expect(screen.getByText('districts reached')).toBeInTheDocument()
  })
})
