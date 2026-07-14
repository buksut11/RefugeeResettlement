import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OfficeCard } from '@/components/contact/OfficeCard'

const office = {
  heading: 'Beledweyne Office',
  address: '[ADDRESS TO BE CONFIRMED], Beledweyne, Hiran',
  phone: '[PHONE NUMBER TO BE CONFIRMED]',
  whatsapp: '[WHATSAPP NUMBER TO BE CONFIRMED]',
  email: '[EMAIL TO BE CONFIRMED]',
}

const labels = {
  address: 'Address',
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  email: 'Email',
}

describe('OfficeCard', () => {
  it('renders the office heading and all four labeled contact fields', () => {
    render(<OfficeCard office={office} labels={labels} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Beledweyne Office' })).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('[ADDRESS TO BE CONFIRMED], Beledweyne, Hiran')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('[PHONE NUMBER TO BE CONFIRMED]')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('[WHATSAPP NUMBER TO BE CONFIRMED]')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('[EMAIL TO BE CONFIRMED]')).toBeInTheDocument()
  })
})
