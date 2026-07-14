// components/contact/ContactForm.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactForm } from '@/components/contact/ContactForm'

describe('ContactForm', () => {
  it('renders a POST form to the Formspree placeholder endpoint with all fields, correct required attributes, and a hidden honeypot', () => {
    const { container } = render(<ContactForm lang="en" />)

    const form = container.querySelector('form')
    expect(form).toHaveAttribute('method', 'POST')
    expect(form).toHaveAttribute('action', 'https://formspree.io/f/[FORMSPREE_FORM_ID_TO_BE_CONFIRMED]')

    expect(screen.getByLabelText('Name')).toBeRequired()
    expect(screen.getByLabelText('Email')).toBeRequired()
    expect(screen.getByLabelText('Message')).toBeRequired()
    expect(screen.getByLabelText('Subject')).not.toBeRequired()

    const honeypot = container.querySelector('input[name="_gotcha"]')
    expect(honeypot).not.toBeNull()
    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
    expect(honeypot).toHaveAttribute('tabindex', '-1')

    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
  })
})
