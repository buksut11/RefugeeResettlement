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
}: {
  id: string
  region: Region
  labels: RegionLabels
}) {
  return (
    <section id={id} className="mt-8">
      <h2 className="font-display text-2xl font-semibold">{region.heading}</h2>
      <p className="mt-2">{region.displacementContext}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-semibold">{labels.districts}</dt>
          <dd>{region.districts}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.office}</dt>
          <dd>{region.office}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.whatWeRun}</dt>
          <dd>{region.whatWeRun}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.coordination}</dt>
          <dd>{region.coordination}</dd>
        </div>
      </dl>
    </section>
  )
}
