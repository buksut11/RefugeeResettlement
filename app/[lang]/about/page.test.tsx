import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/[lang]/about/page'

describe('AboutPage', () => {
  it('renders every section heading in order and the leadership/commitments content', () => {
    render(<AboutPage params={{ lang: 'en' }} />)

    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'About Us',
      'Who We Are',
      'Mission',
      'Vision',
      'Values',
      'Our Story',
      'Leadership & Board',
      'Legal Registration & Governance',
      'Our Commitments',
    ])

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About Us')
    expect(screen.getByText('Dignity (DEMO)')).toBeInTheDocument()
    expect(screen.getByText('Amina Yusuf (DEMO NAME)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Safeguarding & PSEA' })).toHaveAttribute(
      'href',
      '/en/safeguarding/'
    )
  })
})
