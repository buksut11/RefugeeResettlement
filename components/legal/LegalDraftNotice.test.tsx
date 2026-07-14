import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LegalDraftNotice } from '@/components/legal/LegalDraftNotice'

describe('LegalDraftNotice', () => {
  it('renders the visible draft notice text', () => {
    render(<LegalDraftNotice lang="en" />)
    expect(
      screen.getByText(
        "Draft policy — this page has not yet been reviewed by the organization's legal or protection focal point. Do not rely on it as final."
      )
    ).toBeInTheDocument()
  })
})
