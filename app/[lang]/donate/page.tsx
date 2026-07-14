import { getContent } from '@/lib/content'
import { LANGS, type Lang } from '@/lib/i18n'
import { CopyableNumber } from '@/components/donate/CopyableNumber'
import { BankDetails } from '@/components/donate/BankDetails'
import { CardDonations } from '@/components/donate/CardDonations'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export default function DonatePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const content = getContent(lang)
  const { donate } = content

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{donate.heading}</h1>
      <p className="mt-2 text-lg">{donate.intro}</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.mobileMoneyHeading}</h2>
        <p className="mt-2">{donate.mobileMoneyIntro}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <CopyableNumber
            label={donate.mobileMoneyProviders.evcPlus.label}
            number={donate.mobileMoneyProviders.evcPlus.number}
            ussd={donate.mobileMoneyProviders.evcPlus.ussd}
            copyButtonLabel={donate.copyButtonLabel}
            copiedLabel={donate.copiedLabel}
          />
          <CopyableNumber
            label={donate.mobileMoneyProviders.zaad.label}
            number={donate.mobileMoneyProviders.zaad.number}
            ussd={donate.mobileMoneyProviders.zaad.ussd}
            copyButtonLabel={donate.copyButtonLabel}
            copiedLabel={donate.copiedLabel}
          />
          <CopyableNumber
            label={donate.mobileMoneyProviders.sahal.label}
            number={donate.mobileMoneyProviders.sahal.number}
            ussd={donate.mobileMoneyProviders.sahal.ussd}
            copyButtonLabel={donate.copyButtonLabel}
            copiedLabel={donate.copiedLabel}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.bankHeading}</h2>
        <BankDetails lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.cardHeading}</h2>
        <CardDonations lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">{donate.safeguardingHeading}</h2>
        <p className="mt-2 text-sm">{donate.safeguardingStatement}</p>
      </section>
    </div>
  )
}
