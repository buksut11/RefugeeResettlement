// vercel.test.ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

describe('vercel.json security headers', () => {
  it('applies CSP, HSTS, X-Frame-Options, and Referrer-Policy to all routes', () => {
    const raw = readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
    const config = JSON.parse(raw)

    const headerBlock = config.headers.find(
      (entry: { source: string }) => entry.source === '/(.*)'
    )
    expect(headerBlock).toBeDefined()

    const headerNames = headerBlock.headers.map((h: { key: string }) => h.key)
    expect(headerNames).toContain('Content-Security-Policy')
    expect(headerNames).toContain('Strict-Transport-Security')
    expect(headerNames).toContain('X-Frame-Options')
    expect(headerNames).toContain('Referrer-Policy')

    const csp = headerBlock.headers.find(
      (h: { key: string }) => h.key === 'Content-Security-Policy'
    ).value
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("form-action 'self' https://formspree.io")

    const xFrameOptions = headerBlock.headers.find(
      (h: { key: string }) => h.key === 'X-Frame-Options'
    ).value
    expect(xFrameOptions).toBe('DENY')
  })

  it('preserves the existing redirect from "/" to "/en/"', () => {
    const raw = readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
    const config = JSON.parse(raw)
    expect(config.redirects).toEqual([
      { source: '/', destination: '/en/', permanent: false },
    ])
  })
})
