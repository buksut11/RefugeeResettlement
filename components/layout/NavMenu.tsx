'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavLink = { key: string; label: string; href: string }

export function NavMenu({
  links,
  openLabel,
  closeLabel,
}: {
  links: NavLink[]
  openLabel: string
  closeLabel: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="nav-toggle inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line text-ink transition-colors hover:border-primary hover:text-primary 2xl:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
          {open ? (
            <path
              d="M4 4 L16 16 M16 4 L4 16"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 5.5 H17 M3 10 H17 M3 14.5 H17"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <nav aria-label="Primary" className="2xl:hidden">
        <ul
          id={panelId}
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full z-20 flex-col gap-1 border-b border-line bg-paper px-page py-3 shadow-md`}
        >
          {links.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="block min-h-[44px] rounded-sm px-2 py-2.5 leading-[1.4] text-ink/80 no-underline transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
