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

  return (
    <section className="px-4 py-10">
      <h2 className="font-display text-2xl font-semibold">{content.home.whereWeWorkHeading}</h2>
      <svg viewBox={VIEW_BOX} className="mt-4 w-full max-w-md">
        <title>{content.home.mapAriaLabel}</title>
        <path
          d={NATIONAL_PATH}
          fill="#F7F5F0"
          stroke="#14355C"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <a href={`/${lang}/where-we-work/#hiran`} aria-label={content.home.mapRegionHiran}>
          <path d={HIRAN_PATH} fill="#2F6B4F" opacity={0.85} />
          <circle
            cx={BELEDWEYNE_PIN[0]}
            cy={BELEDWEYNE_PIN[1]}
            r={4.5}
            fill="#F7F5F0"
            stroke="#201D1B"
            strokeWidth={1.8}
          />
        </a>
        <a href={`/${lang}/where-we-work/#southwest`} aria-label={content.home.mapRegionSouthwest}>
          <path d={SOUTHWEST_PATH} fill="#B5651D" opacity={0.85} />
          <circle
            cx={BAIDOA_PIN[0]}
            cy={BAIDOA_PIN[1]}
            r={4.5}
            fill="#F7F5F0"
            stroke="#201D1B"
            strokeWidth={1.8}
          />
        </a>
      </svg>
      <p className="mt-2 text-xs text-ink/70">{content.home.mapAttribution}</p>
    </section>
  )
}
