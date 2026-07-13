import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function Leadership({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {content.about.leadership.map((person) => (
        <div key={person.name} className="rounded border border-primary/20 p-4">
          <div className="mb-3 flex h-32 items-center justify-center rounded bg-primary/10 text-xs text-ink">
            Photo placeholder
          </div>
          <p className="font-display font-semibold">{person.name}</p>
          <p className="text-sm text-ink/70">{person.role}</p>
          <p className="mt-2 text-sm">{person.bio}</p>
        </div>
      ))}
    </div>
  )
}
