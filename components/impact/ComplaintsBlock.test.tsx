import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComplaintsBlock } from '@/components/impact/ComplaintsBlock'

describe('ComplaintsBlock', () => {
  it('renders the anonymous-reporting statement and all three contact placeholders', () => {
    render(<ComplaintsBlock lang="en" />)

    expect(screen.getByText(/Reports can be made anonymously/)).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('+252 61 234 5678')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('complaints@horumarresettlement.org')).toBeInTheDocument()
  })
})
