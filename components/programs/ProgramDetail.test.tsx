import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgramDetail } from '@/components/programs/ProgramDetail'

describe('ProgramDetail', () => {
  it('renders the program title as h1, all section headings in order, the story, and the support CTA', () => {
    render(<ProgramDetail lang="en" slug="resettlement" />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'Resettlement & Durable Solutions',
      'The Problem',
      'What We Do',
      'Where We Work',
      'How We Measure It',
      'A Story From Our Work',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Resettlement & Durable Solutions'
    )
    expect(
      screen.getByText(/Halima and her three children were displaced twice/)
    ).toBeInTheDocument()

    const cta = screen.getByRole('link', { name: 'Support this program' })
    expect(cta).toHaveAttribute('href', '/en/donate/')
  })
})
