import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoryBlock } from '@/components/programs/StoryBlock'

describe('StoryBlock', () => {
  it('renders the story text and its attribution note', () => {
    render(<StoryBlock story="A demo story." attribution="A demo attribution." />)

    expect(screen.getByText('A demo story.')).toBeInTheDocument()
    expect(screen.getByText('A demo attribution.')).toBeInTheDocument()
  })
})
