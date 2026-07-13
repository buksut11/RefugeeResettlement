import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramPage from '@/app/[lang]/programs/[slug]/page'

describe('ProgramPage', () => {
  it('renders the correct program detail for the given slug', () => {
    render(<ProgramPage params={{ lang: 'en', slug: 'shelter' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Shelter & Essential Services'
    )
  })
})
