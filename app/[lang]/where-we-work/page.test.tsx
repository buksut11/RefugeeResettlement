import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WhereWeWorkPage from '@/app/[lang]/where-we-work/page'

describe('WhereWeWorkPage', () => {
  it('renders the page heading and both region blocks with the correct anchor ids', () => {
    render(<WhereWeWorkPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['Where We Work', 'Hiran / Hirshabelle', 'Southwest State'])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Where We Work')

    const hiranHeading = screen.getByRole('heading', { level: 2, name: 'Hiran / Hirshabelle' })
    expect(hiranHeading.closest('section')).toHaveAttribute('id', 'hiran')

    const southwestHeading = screen.getByRole('heading', { level: 2, name: 'Southwest State' })
    expect(southwestHeading.closest('section')).toHaveAttribute('id', 'southwest')

    expect(screen.getByText(/Shabelle River burst its banks at Beledweyne/)).toBeInTheDocument()
  })
})
