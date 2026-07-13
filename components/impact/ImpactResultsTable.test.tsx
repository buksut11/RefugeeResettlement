import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImpactResultsTable } from '@/components/impact/ImpactResultsTable'

describe('ImpactResultsTable', () => {
  it('renders the region label as a caption, year column headers, metric row headers, and placeholder cells', () => {
    render(<ImpactResultsTable lang="en" regionLabel="Hiran / Hirshabelle" />)

    expect(screen.getByText('Hiran / Hirshabelle')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'This Year' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Last Year' })).toBeInTheDocument()

    expect(screen.getByRole('rowheader', { name: 'households supported' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'shelter kits distributed' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'livelihoods trainings completed' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'districts reached' })).toBeInTheDocument()

    expect(screen.getAllByText('[NUMBER TO BE CONFIRMED]')).toHaveLength(8)
  })
})
