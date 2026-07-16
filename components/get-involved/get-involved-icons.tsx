export type GetInvolvedIconName = 'donate' | 'partner' | 'work'

const ICON_PATHS: Record<GetInvolvedIconName, React.ReactNode> = {
  donate: <path d="M12 20.3C12 20.3 4 15.4 4 9.7 4 6.7 6.2 4.5 9 4.5c1.6 0 3 .8 3 .8s1.4-.8 3-.8c2.8 0 5 2.2 5 5.2 0 5.7-8 10.6-8 10.6Z" />,
  partner: (
    <>
      <circle cx="9" cy="12" r="5.8" />
      <circle cx="15" cy="12" r="5.8" />
    </>
  ),
  work: (
    <>
      <rect x="3.5" y="8" width="17" height="11" rx="1" />
      <path d="M8.5 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
      <path d="M3.5 13h17" />
    </>
  ),
}

export function GetInvolvedIcon({ name, className = 'h-7 w-7' }: { name: GetInvolvedIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        {ICON_PATHS[name]}
      </g>
    </svg>
  )
}
