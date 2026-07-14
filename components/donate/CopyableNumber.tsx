'use client'

import { useState } from 'react'

export function CopyableNumber({
  label,
  number,
  ussd,
  copyButtonLabel,
  copiedLabel,
}: {
  label: string
  number: string
  ussd: string
  copyButtonLabel: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!navigator.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(number)
      setCopied(true)
    } catch {
      // Clipboard write failed (e.g. permission denied); leave the
      // button showing copyButtonLabel rather than falsely reporting success.
    }
  }

  return (
    <div className="rounded border border-primary/20 p-4">
      <p className="font-display font-semibold">{label}</p>
      <a href={`tel:${number}`} className="mt-1 block text-lg">
        {number}
      </a>
      <p className="mt-1 text-xs text-ink/70">{ussd}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-2 rounded border border-primary/20 px-3 py-1 text-sm"
      >
        {copied ? copiedLabel : copyButtonLabel}
      </button>
    </div>
  )
}
