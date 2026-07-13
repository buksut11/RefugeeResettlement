import Link from 'next/link'
import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function CommitmentsBlock({ lang }: { lang: Lang }) {
  const content = getContent(lang)

  return (
    <div className="mt-4 space-y-3 text-sm">
      <p>{content.about.commitmentHumanitarianPrinciples}</p>
      <p>{content.about.commitmentCHS}</p>
      <p>
        {content.about.commitmentPSEA}{' '}
        <Link href={`/${lang}/safeguarding/`} className="underline">
          {content.footer.safeguarding}
        </Link>
        .
      </p>
      <p>{content.about.commitmentDoNoHarm}</p>
    </div>
  )
}
