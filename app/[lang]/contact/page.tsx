import Link from 'next/link'
import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { OfficeCard } from '@/components/contact/OfficeCard'
import { ContactForm } from '@/components/contact/ContactForm'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function ContactPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { contact } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{contact.heading}</h1>
      <p className="mt-2 text-lg">{contact.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{contact.officesHeading}</h2>
        <OfficeCard office={contact.offices.hiran} labels={contact.officeLabels} />
        <OfficeCard office={contact.offices.southwest} labels={contact.officeLabels} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{contact.formHeading}</h2>
        <ContactForm lang={lang} />
      </section>

      <section className="mt-8 rounded border border-accent/30 bg-accent/5 p-4">
        <p className="text-sm">{contact.safeguardingPrompt}</p>
        <Link href={`/${lang}/safeguarding/`} className="mt-2 inline-block font-semibold underline">
          {contact.safeguardingCta}
        </Link>
      </section>
    </div>
  )
}
