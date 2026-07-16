type Region = {
  heading: string
  displacementContext: string
  districts: string
  office: string
  whatWeRun: string
  coordination: string
}

type RegionLabels = {
  districts: string
  office: string
  whatWeRun: string
  coordination: string
}

export function RegionBlock({
  id,
  region,
  labels,
  tone,
}: {
  id: string
  region: Region
  labels: RegionLabels
  tone: 'secondary' | 'accent'
}) {
  const dotClass = tone === 'secondary' ? 'bg-secondary' : 'bg-accent'
  const borderClass = tone === 'secondary' ? 'border-secondary' : 'border-accent'
  const quoteBorderClass = tone === 'secondary' ? 'border-secondary/50' : 'border-accent/50'

  return (
    <section id={id} className={`scroll-mt-24 border-t-4 ${borderClass} border-x border-b border-line p-6 sm:p-8`}>
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{region.heading}</h2>
      </div>

      <blockquote className={`mt-5 border-l-2 ${quoteBorderClass} pl-4 text-[15px] leading-relaxed text-ink/75`}>
        {region.displacementContext}
      </blockquote>

      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <dt className="eyebrow">{labels.districts}</dt>
          <dd className="mt-1.5 font-medium text-ink">{region.districts}</dd>
        </div>
        <div>
          <dt className="eyebrow">{labels.office}</dt>
          <dd className="mt-1.5 font-medium text-ink">{region.office}</dd>
        </div>
        <div>
          <dt className="eyebrow">{labels.whatWeRun}</dt>
          <dd className="mt-1.5 font-medium text-ink">{region.whatWeRun}</dd>
        </div>
        <div>
          <dt className="eyebrow">{labels.coordination}</dt>
          <dd className="mt-1.5 font-medium text-ink">{region.coordination}</dd>
        </div>
      </dl>
    </section>
  )
}
