import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RegionBlock } from '@/components/where-we-work/RegionBlock'

const region = {
  heading: 'Hiran / Hirshabelle',
  displacementContext: 'Test displacement context.',
  districts: 'Test districts.',
  office: 'Test office.',
  whatWeRun: 'Test programming.',
  coordination: '[COORDINATION PARTNERS TO BE CONFIRMED]',
}

const labels = {
  districts: 'Districts Covered',
  office: 'Our Office',
  whatWeRun: 'What We Run Here',
  coordination: 'Who We Coordinate With',
}

describe('RegionBlock', () => {
  it('renders the region heading, context, and labeled fields, with the given anchor id', () => {
    render(<RegionBlock id="hiran" region={region} labels={labels} tone="secondary" />)

    const heading = screen.getByRole('heading', { level: 2, name: 'Hiran / Hirshabelle' })
    expect(heading).toBeInTheDocument()
    expect(heading.closest('section')).toHaveAttribute('id', 'hiran')

    expect(screen.getByText('Test displacement context.')).toBeInTheDocument()
    expect(screen.getByText('Districts Covered')).toBeInTheDocument()
    expect(screen.getByText('Test districts.')).toBeInTheDocument()
    expect(screen.getByText('[COORDINATION PARTNERS TO BE CONFIRMED]')).toBeInTheDocument()
  })
})
