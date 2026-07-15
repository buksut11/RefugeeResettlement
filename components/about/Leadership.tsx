import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function Leadership({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {content.about.leadership.map((person) => (
        <div key={person.name} className="rounded border border-primary/20 p-4">
          <div
            aria-hidden="true"
            className="mb-3 flex h-32 items-center justify-center rounded bg-primary font-display text-2xl font-semibold tracking-wide text-paper"
          >
            {initialsFor(person.name)}
          </div>
          <p className="font-display font-semibold">{person.name}</p>
          <p className="text-sm text-ink/70">{person.role}</p>
          <p className="mt-2 text-sm">{person.bio}</p>
        </div>
      ))}
    </div>
  )
}
