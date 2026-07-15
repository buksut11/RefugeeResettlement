import type { ProgramSlug } from './programs-data'

const ICON_PATHS: Record<ProgramSlug, React.ReactNode> = {
  resettlement: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
      <path d="M10 19.5v-6h4v6" />
    </>
  ),
  shelter: (
    <>
      <path d="M3 20 12 4l9 16Z" />
      <path d="M7.5 20v-4h9v4" />
      <path d="M9.8 12h4.4" />
    </>
  ),
  livelihoods: (
    <>
      <path d="M12 20v-8.5" />
      <path d="M12 11.5c0-3.5-2.5-5.8-6-6 0 3.6 2.4 6 6 6Z" />
      <path d="M12 14.5c0-3 2.2-5 5.3-5.2.2 3.1-2.1 5.3-5.3 5.2Z" />
    </>
  ),
  protection: (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.4-2.9 7.5-7 9-4.1-1.5-7-4.6-7-9V6Z" />
      <path d="M9.2 12.1 11.3 14.2 15.1 10" />
    </>
  ),
}

export function ProgramIcon({ slug }: { slug: ProgramSlug }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-primary">
      <g fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        {ICON_PATHS[slug]}
      </g>
    </svg>
  )
}
