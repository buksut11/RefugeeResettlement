import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgramPage, { generateMetadata } from '@/app/[lang]/programs/[slug]/page'

describe('ProgramPage', () => {
  it('renders the correct program detail for the given slug', () => {
    render(<ProgramPage params={{ lang: 'en', slug: 'shelter' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Shelter & Essential Services'
    )
  })

  it('renders the Somali version without crashing', () => {
    render(<ProgramPage params={{ lang: 'so', slug: 'resettlement' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('derives title and description from the program itself, not a shared content.seo entry', () => {
    const metadata = generateMetadata({ params: { lang: 'en', slug: 'shelter' } })
    expect(metadata.title).toBe('Shelter & Essential Services | Horumar Resettlement Network')
    expect(metadata.alternates?.canonical).toBe('/en/programs/shelter/')
  })
})
