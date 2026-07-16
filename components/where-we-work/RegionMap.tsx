'use client'

import { useEffect, useRef, useState } from 'react'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import {
  VIEW_BOX,
  NATIONAL_PATH,
  HIRAN_PATH,
  SOUTHWEST_PATH,
  BELEDWEYNE_PIN,
  BAIDOA_PIN,
} from '@/components/home/somalia-map-data'

export function RegionMap({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const node = wrapRef.current
    if (prefersReducedMotion || !node) {
      setRevealed(true)
      return
    }

    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setRevealed(true)
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    const fallback = window.setTimeout(() => setRevealed(true), 2500)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:max-w-none">
      <svg viewBox={VIEW_BOX} className="mx-auto w-full max-w-sm" aria-labelledby="region-map-title">
        <title id="region-map-title">{content.home.mapAriaLabel}</title>
        <path
          d={NATIONAL_PATH}
          fill="none"
          stroke="#201D1B"
          strokeOpacity={0.35}
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1000}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: revealed ? 0 : 1000,
            transition: 'stroke-dashoffset 1.6s ease-out',
          }}
        />
        <a href="#hiran" aria-label={content.home.mapRegionHiran}>
          <path
            d={HIRAN_PATH}
            fill="#2F6B4F"
            className="cursor-pointer transition-opacity duration-300 hover:!opacity-100"
            style={{ opacity: revealed ? 0.82 : 0, transition: 'opacity 0.8s ease-out 0.5s' }}
          />
        </a>
        <a href="#southwest" aria-label={content.home.mapRegionSouthwest}>
          <path
            d={SOUTHWEST_PATH}
            fill="#B5651D"
            className="cursor-pointer transition-opacity duration-300 hover:!opacity-100"
            style={{ opacity: revealed ? 0.82 : 0, transition: 'opacity 0.8s ease-out 0.65s' }}
          />
        </a>
        <g style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease-out 0.9s' }}>
          <circle cx={BELEDWEYNE_PIN[0]} cy={BELEDWEYNE_PIN[1]} r={9} fill="#14355C" style={{ animation: 'pin-pulse 2.4s ease-in-out infinite' }} />
          <circle cx={BELEDWEYNE_PIN[0]} cy={BELEDWEYNE_PIN[1]} r={4} fill="#14355C" stroke="#F2EEE3" strokeWidth={1.4} />
          <circle cx={BAIDOA_PIN[0]} cy={BAIDOA_PIN[1]} r={9} fill="#14355C" style={{ animation: 'pin-pulse 2.4s ease-in-out infinite 0.4s' }} />
          <circle cx={BAIDOA_PIN[0]} cy={BAIDOA_PIN[1]} r={4} fill="#14355C" stroke="#F2EEE3" strokeWidth={1.4} />
        </g>
      </svg>

      <ul className="mt-6 flex justify-center gap-6 text-sm lg:justify-start">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
          <span className="font-medium text-ink">{content.home.mapRegionHiran}</span>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
          <span className="font-medium text-ink">{content.home.mapRegionSouthwest}</span>
        </li>
      </ul>
      <p className="mt-4 text-center font-mono text-[0.7rem] uppercase tracking-wide text-ink/45 lg:text-left">
        {content.home.mapAttribution}
      </p>
    </div>
  )
}
