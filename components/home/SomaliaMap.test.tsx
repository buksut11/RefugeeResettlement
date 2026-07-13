// components/home/SomaliaMap.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SomaliaMap } from '@/components/home/SomaliaMap'

describe('SomaliaMap', () => {
  it('renders an accessible map with region links and attribution', () => {
    render(<SomaliaMap lang="en" />)

    expect(
      screen.getByTitle("Illustrative map of Somalia showing Hiran and Southwest State, the organization's areas of operation")
    ).toBeInTheDocument()

    const hiranLink = screen.getByRole('link', { name: 'Hiran / Hirshabelle' })
    expect(hiranLink).toHaveAttribute('href', '/en/where-we-work/#hiran')

    const southwestLink = screen.getByRole('link', { name: 'Southwest State' })
    expect(southwestLink).toHaveAttribute('href', '/en/where-we-work/#southwest')

    expect(screen.getByText('Map data: geoBoundaries, CC-BY 4.0')).toBeInTheDocument()
  })
})
