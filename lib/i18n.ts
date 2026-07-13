export type Lang = 'en' | 'so'

export const LANGS: Lang[] = ['en', 'so']

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'so' : 'en'
}

export function getAlternatePath(pathname: string, targetLang: Lang): string {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length > 0 && LANGS.includes(segments[0] as Lang)) {
    segments[0] = targetLang
  } else {
    segments.unshift(targetLang)
  }

  return '/' + segments.join('/') + '/'
}
