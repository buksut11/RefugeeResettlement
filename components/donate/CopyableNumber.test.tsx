import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CopyableNumber } from '@/components/donate/CopyableNumber'

describe('CopyableNumber', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders the number as a tel link and shows the USSD code', () => {
    render(
      <CopyableNumber
        label="EVC Plus"
        number="[EVC PLUS NUMBER TO BE CONFIRMED]"
        ussd="[EVC PLUS USSD CODE TO BE CONFIRMED]"
        copyButtonLabel="Copy number"
        copiedLabel="Copied!"
      />
    )

    expect(screen.getByText('EVC Plus')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: '[EVC PLUS NUMBER TO BE CONFIRMED]' })
    expect(link).toHaveAttribute('href', 'tel:[EVC PLUS NUMBER TO BE CONFIRMED]')
    expect(screen.getByText('[EVC PLUS USSD CODE TO BE CONFIRMED]')).toBeInTheDocument()
  })

  it('copies the number to the clipboard and shows a confirmation', async () => {
    render(
      <CopyableNumber
        label="EVC Plus"
        number="[EVC PLUS NUMBER TO BE CONFIRMED]"
        ussd="[EVC PLUS USSD CODE TO BE CONFIRMED]"
        copyButtonLabel="Copy number"
        copiedLabel="Copied!"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Copy number' }))

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '[EVC PLUS NUMBER TO BE CONFIRMED]'
    )
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  })
})
