#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import {
  install,
  computeExecutablePath,
  detectBrowserPlatform,
  resolveBuildId,
  Browser,
} from '@puppeteer/browsers'

const PORT = 5050
const BASE_URL = `http://localhost:${PORT}`
const OUT_DIR = 'lighthouse-reports'
const CACHE_DIR = path.resolve('.chrome-cache')

const SAMPLE_PATHS = [
  '/en/',
  '/so/',
  '/en/about/',
  '/en/programs/shelter/',
  '/en/where-we-work/',
  '/en/impact/',
  '/en/donate/',
  '/en/contact/',
  '/en/privacy/',
  '/so/contact/',
]

function slugFor(urlPath) {
  const trimmed = urlPath.replace(/^\//, '').replace(/\/$/, '')
  return trimmed === '' ? 'root' : trimmed.replace(/\//g, '-')
}

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url)
        if (res.status < 500) {
          resolve()
          return
        }
      } catch {
        // server not up yet, retry
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server at ${url} did not respond within ${timeoutMs}ms`))
        return
      }
      setTimeout(attempt, 300)
    }
    attempt()
  })
}

async function ensureChrome() {
  const platform = detectBrowserPlatform()
  if (!platform) {
    throw new Error('Could not detect a supported browser platform for this OS.')
  }
  const buildId = await resolveBuildId(Browser.CHROME, platform, 'stable')
  await install({ browser: Browser.CHROME, buildId, cacheDir: CACHE_DIR, platform })
  return computeExecutablePath({ browser: Browser.CHROME, buildId, cacheDir: CACHE_DIR, platform })
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const executablePath = await ensureChrome()

  const server = spawn('npx', ['serve', 'out', '-l', String(PORT)], {
    stdio: 'ignore',
    shell: true,
  })

  let chrome
  try {
    await waitForServer(BASE_URL)

    chrome = await chromeLauncher.launch({
      chromePath: executablePath,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    })

    const results = []

    for (const urlPath of SAMPLE_PATHS) {
      const url = `${BASE_URL}${urlPath}`
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false },
      })

      const slug = slugFor(urlPath)
      await writeFile(path.join(OUT_DIR, `${slug}.json`), runnerResult.report)

      const { categories } = runnerResult.lhr
      const scores = {
        path: urlPath,
        performance: categories.performance.score,
        accessibility: categories.accessibility.score,
        seo: categories.seo.score,
        bestPractices: categories['best-practices'].score,
      }
      results.push(scores)

      console.log(
        `${urlPath}: performance=${scores.performance} accessibility=${scores.accessibility} seo=${scores.seo} bestPractices=${scores.bestPractices}`
      )
    }

    await writeFile(path.join(OUT_DIR, 'summary.json'), JSON.stringify(results, null, 2))
    console.log(`\nWrote ${results.length} reports to ${OUT_DIR}/`)
  } finally {
    if (chrome) await chrome.kill()
    server.kill()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
