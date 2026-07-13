import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConsentNotice } from '@/components/news/ConsentNotice'

describe('ConsentNotice', () => {
  it('renders the fixed consent statement', () => {
    render(<ConsentNotice lang="en" />)
    expect(
      screen.getByText(
        "Names in personal stories may be changed to protect identity, and are shared only with the individual's informed consent."
      )
    ).toBeInTheDocument()
  })
})
