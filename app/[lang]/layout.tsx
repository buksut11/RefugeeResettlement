import type { Metadata } from 'next'
import { Newsreader, IBM_Plex_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getContent } from '@/lib/content'
import { buildOrganizationJsonLd } from '@/lib/jsonld'
import { LANGS, type Lang } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site-config'
import '../globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const dynamicParams = false

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const content = getContent(params.lang)
  return {
    title: content.site.name,
    metadataBase: new URL(SITE_URL),
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Lang }
}) {
  const { lang } = params

  return (
    <html lang={lang} className={`${newsreader.variable} ${plexSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildOrganizationJsonLd(lang) }}
        />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  )
}
