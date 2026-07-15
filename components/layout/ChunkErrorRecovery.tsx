'use client'

import { useEffect } from 'react'

const RELOAD_FLAG = 'chunk-reload-once'

function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return error.name === 'ChunkLoadError' || /Loading chunk [\d]+ failed/.test(error.message)
}

/**
 * Static exports rehash JS chunk filenames on every deploy. A tab left open
 * across a deploy still references the old filenames, so a client-side nav
 * silently fails once those files are gone from the new deployment. This
 * catches that specific failure and reloads once to recover.
 */
export function ChunkErrorRecovery() {
  useEffect(() => {
    sessionStorage.removeItem(RELOAD_FLAG)

    function recover() {
      if (sessionStorage.getItem(RELOAD_FLAG)) return
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
    }

    function onError(event: ErrorEvent) {
      if (isChunkLoadError(event.error)) recover()
    }

    function onRejection(event: PromiseRejectionEvent) {
      if (isChunkLoadError(event.reason)) recover()
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return null
}
