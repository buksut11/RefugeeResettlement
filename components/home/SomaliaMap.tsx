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
} from './somalia-map-data'

export function SomaliaMap({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const node = sectionRef.current
    if (prefersReducedMotion || !node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    // Some browsers don't fire the observer's initial callback for content
    // that's already on-screen at load unless the user scrolls. Check the
    // element's actual position up front so it isn't stuck hidden forever.
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
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

    // Belt-and-suspenders: never leave the map permanently hidden if the
    // observer doesn't fire for some reason.
    const fallback = window.setTimeout(() => setRevealed(true), 2500)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-primary px-page py-14 text-paper sm:py-16">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{content.home.whereWeWorkHeading}</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-center lg:gap-14">
        <svg viewBox={VIEW_BOX} className="w-full max-w-md" aria-labelledby="somalia-map-title">
          <title id="somalia-map-title">{content.home.mapAriaLabel}</title>
          <defs>
            <filter id="hand-inked" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
            </filter>
          </defs>
          <g filter="url(#hand-inked)">
            <path
              d={NATIONAL_PATH}
              fill="none"
              stroke="#F2EEE3"
              strokeWidth={1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1000}
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: revealed ? 0 : 1000,
                transition: 'stroke-dashoffset 1.8s ease-out',
              }}
            />
            <a href={`/${lang}/where-we-work/#hiran`} aria-label={content.home.mapRegionHiran}>
              <path
                d={HIRAN_PATH}
                fill="#2F6B4F"
                className="transition-opacity duration-300 hover:!opacity-100"
                style={{ opacity: revealed ? 0.8 : 0, transition: 'opacity 0.9s ease-out 0.6s' }}
              />
            </a>
            <a href={`/${lang}/where-we-work/#southwest`} aria-label={content.home.mapRegionSouthwest}>
              <path
                d={SOUTHWEST_PATH}
                fill="#B5651D"
                className="transition-opacity duration-300 hover:!opacity-100"
                style={{ opacity: revealed ? 0.8 : 0, transition: 'opacity 0.9s ease-out 0.75s' }}
              />
            </a>
          </g>
          <g style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease-out 1s' }}>
            <circle cx={BELEDWEYNE_PIN[0]} cy={BELEDWEYNE_PIN[1]} r={9} fill="#F2EEE3" style={{ animation: 'pin-pulse 2.4s ease-in-out infinite' }} />
            <circle cx={BELEDWEYNE_PIN[0]} cy={BELEDWEYNE_PIN[1]} r={4} fill="#F2EEE3" stroke="#14355C" strokeWidth={1.4} />
            <circle cx={BAIDOA_PIN[0]} cy={BAIDOA_PIN[1]} r={9} fill="#F2EEE3" style={{ animation: 'pin-pulse 2.4s ease-in-out infinite 0.4s' }} />
            <circle cx={BAIDOA_PIN[0]} cy={BAIDOA_PIN[1]} r={4} fill="#F2EEE3" stroke="#14355C" strokeWidth={1.4} />
          </g>
        </svg>
        <ul className="grid gap-4 border-t border-paper/20 pt-6 text-sm sm:grid-cols-2 lg:border-t-0 lg:pt-0">
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
            <span className="font-medium text-paper">{content.home.mapRegionHiran}</span>
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
            <span className="font-medium text-paper">{content.home.mapRegionSouthwest}</span>
          </li>
        </ul>
      </div>
      <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-wide text-paper/50">{content.home.mapAttribution}</p>
    </section>
  )
}
