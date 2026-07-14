type Office = {
  heading: string
  address: string
  phone: string
  whatsapp: string
  email: string
}

type OfficeLabels = {
  address: string
  phone: string
  whatsapp: string
  email: string
}

export function OfficeCard({ office, labels }: { office: Office; labels: OfficeLabels }) {
  return (
    <div className="mt-4 rounded border border-primary/20 p-4 text-sm">
      <h3 className="font-display text-lg font-semibold">{office.heading}</h3>
      <dl className="mt-2 space-y-2">
        <div>
          <dt className="font-semibold">{labels.address}</dt>
          <dd>{office.address}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.phone}</dt>
          <dd>{office.phone}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.whatsapp}</dt>
          <dd>{office.whatsapp}</dd>
        </div>
        <div>
          <dt className="font-semibold">{labels.email}</dt>
          <dd>{office.email}</dd>
        </div>
      </dl>
    </div>
  )
}
