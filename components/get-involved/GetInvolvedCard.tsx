import Link from 'next/link'
import { GetInvolvedIcon, type GetInvolvedIconName } from './get-involved-icons'

export function GetInvolvedCard({
  icon,
  heading,
  body,
  ctaLabel,
  ctaHref,
  emphasized = false,
}: {
  icon: GetInvolvedIconName
  heading: string
  body: string
  ctaLabel: string
  ctaHref: string
  emphasized?: boolean
}) {
  return (
    <div
      className={`flex h-full flex-col border p-6 ${emphasized ? 'border-primary' : 'border-line'}`}
    >
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
          emphasized ? 'bg-primary text-paper' : 'bg-primary/[0.08] text-primary'
        }`}
      >
        <GetInvolvedIcon name={icon} className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink">{heading}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{body}</p>
      <Link
        href={ctaHref}
        className={
          emphasized
            ? 'mt-5 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-primary px-5 text-sm font-medium tracking-wide text-paper no-underline transition-colors hover:bg-ink'
            : 'mt-5 inline-flex min-h-[44px] items-center justify-center rounded-sm border border-primary px-5 text-sm font-medium tracking-wide text-primary no-underline transition-colors hover:bg-primary hover:text-paper'
        }
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
