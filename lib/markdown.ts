import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Lang } from './i18n'
import type { ProgramSlug } from '@/components/home/programs-data'

export type NewsRegion = 'hiran' | 'southwest' | 'both'

export type NewsPost = {
  slug: string
  title: string
  date: string
  region: NewsRegion
  program: ProgramSlug | null
  summary: string
  image: string | null
  alt: string | null
  contentHtml: string
}

export type ReportCategory = 'annual-report' | 'financial-statement' | 'project-report'

export type Report = {
  slug: string
  title: string
  date: string
  category: ReportCategory
  file: string
}

const NEWS_DIR = path.join(process.cwd(), 'content', 'news')
const REPORTS_DIR = path.join(process.cwd(), 'content', 'reports')

function readMarkdownFilenames(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((file) => file.endsWith('.md'))
}

export function getAllNewsPosts(lang: Lang): NewsPost[] {
  const dir = path.join(NEWS_DIR, lang)

  const posts = readMarkdownFilenames(dir).map((file) => {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      region: data.region as NewsRegion,
      program: (data.program as ProgramSlug | undefined) ?? null,
      summary: data.summary as string,
      image: (data.image as string | undefined) ?? null,
      alt: (data.alt as string | undefined) ?? null,
      contentHtml: marked(content, { async: false }),
    }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getNewsPost(lang: Lang, slug: string): NewsPost | null {
  return getAllNewsPosts(lang).find((post) => post.slug === slug) ?? null
}

export function getAllReports(lang: Lang): Report[] {
  const dir = path.join(REPORTS_DIR, lang)

  return readMarkdownFilenames(dir).map((file) => {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data } = matter(raw)

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      category: data.category as ReportCategory,
      file: data.file as string,
    }
  })
}
