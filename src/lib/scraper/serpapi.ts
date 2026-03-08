import { ScrapedJob } from './types'

// ---------------------------------------------------------------------------
// SerpApi response types
// ---------------------------------------------------------------------------

interface SerpApiApplyOption {
  title: string
  link: string
}

interface SerpApiDetectedExtensions {
  posted_at?: string
  schedule_type?: string
  salary?: string
  work_from_home?: boolean
}

interface SerpApiJobHighlight {
  title: string
  items: string[]
}

interface SerpApiJob {
  title: string
  company_name: string
  location: string
  via: string
  description: string
  job_id: string
  thumbnail?: string
  extensions?: string[]
  detected_extensions?: SerpApiDetectedExtensions
  job_highlights?: SerpApiJobHighlight[]
  apply_options?: SerpApiApplyOption[]
}

interface SerpApiResponse {
  jobs_results?: SerpApiJob[]
  search_metadata?: { status: string; id: string }
  error?: string
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function detectPortal(via: string): ScrapedJob['sourcePortal'] {
  const v = via.toLowerCase()
  if (v.includes('naukri')) return 'naukri'
  if (v.includes('indeed')) return 'indeed'
  if (v.includes('shine')) return 'shine'
  if (v.includes('foundit') || v.includes('monster')) return 'foundit'
  return 'indeed' // fallback for LinkedIn, Glassdoor, etc.
}

function parseSalaryLPA(salaryStr?: string): { min?: number; max?: number } {
  if (!salaryStr) return {}

  const numbers = salaryStr.match(/[\d,]+\.?\d*/g)
  if (!numbers || numbers.length === 0) return {}

  const parsed = numbers.map(n => parseFloat(n.replace(/,/g, '')))

  const isMonthly = /month/i.test(salaryStr)
  const isHourly = /hour/i.test(salaryStr)

  let multiplier = 1
  if (isMonthly) multiplier = 12
  if (isHourly) multiplier = 2080

  const toLPA = (val: number): number => {
    const annual = val * multiplier
    // If > 10 000 assume absolute rupees; convert to LPA
    if (annual > 10000) return Math.round((annual / 100000) * 10) / 10
    return Math.round(annual * 10) / 10
  }

  if (parsed.length >= 2) {
    return { min: toLPA(parsed[0]), max: toLPA(parsed[1]) }
  }
  return { min: toLPA(parsed[0]) }
}

function detectWorkMode(job: SerpApiJob): ScrapedJob['workMode'] {
  if (job.detected_extensions?.work_from_home) return 'remote'

  const allText = [...(job.extensions || []), job.location || ''].join(' ').toLowerCase()

  if (allText.includes('remote') || allText.includes('work from home')) return 'remote'
  if (allText.includes('hybrid')) return 'hybrid'
  return 'office'
}

function parsePostedAt(postedAt?: string): Date {
  if (!postedAt) return new Date()

  const now = new Date()
  const match = postedAt.match(/(\d+)\+?\s*(hour|day|week|month)/i)
  if (!match) return now

  const amount = parseInt(match[1])
  const unit = match[2].toLowerCase()
  const msPerDay = 86_400_000

  switch (unit) {
    case 'hour':
      return new Date(now.getTime() - amount * 3_600_000)
    case 'day':
      return new Date(now.getTime() - amount * msPerDay)
    case 'week':
      return new Date(now.getTime() - amount * 7 * msPerDay)
    case 'month':
      return new Date(now.getTime() - amount * 30 * msPerDay)
    default:
      return now
  }
}

const TECH_KEYWORDS = [
  'java', 'python', 'javascript', 'typescript', 'react', 'angular', 'vue',
  'node', 'nodejs', 'express', 'spring', 'django', 'flask', 'sql', 'nosql',
  'mongodb', 'postgresql', 'mysql', 'redis', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'ci/cd', 'git', 'rest', 'api', 'microservices',
  'html', 'css', 'tailwind', 'next.js', 'graphql',
  'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch',
  'data analysis', 'power bi', 'tableau', 'excel', 'salesforce',
  'figma', 'adobe', 'agile', 'scrum', 'jira',
  'c++', 'c#', '.net', 'go', 'rust', 'kotlin', 'swift',
]

function extractSkills(job: SerpApiJob): string[] {
  const skills = new Set<string>()

  const qualifications = job.job_highlights?.find(h =>
    h.title.toLowerCase().includes('qualif'),
  )

  if (qualifications) {
    for (const item of qualifications.items) {
      const lower = item.toLowerCase()
      for (const kw of TECH_KEYWORDS) {
        if (lower.includes(kw)) {
          skills.add(
            kw
              .split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
          )
        }
      }
    }
  }

  return Array.from(skills).slice(0, 10)
}

// ---------------------------------------------------------------------------
// Map a single SerpApi job to our ScrapedJob interface
// ---------------------------------------------------------------------------

function mapSerpApiJobToScrapedJob(job: SerpApiJob): ScrapedJob {
  const portal = detectPortal(job.via)

  // Prefer the apply option matching the detected portal, else first available
  let sourceUrl = ''
  if (job.apply_options && job.apply_options.length > 0) {
    const portalOption = job.apply_options.find(opt =>
      opt.title.toLowerCase().includes(portal),
    )
    sourceUrl = portalOption?.link || job.apply_options[0].link
  }
  if (!sourceUrl) {
    sourceUrl = `https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company_name + ' jobs')}`
  }

  const salary = parseSalaryLPA(job.detected_extensions?.salary)

  return {
    title: job.title,
    company: job.company_name,
    companyLogoUrl: job.thumbnail || undefined,
    locations: [job.location],
    salaryMin: salary.min,
    salaryMax: salary.max,
    skills: extractSkills(job),
    description: job.description,
    workMode: detectWorkMode(job),
    sourcePortal: portal,
    sourceUrl,
    postedAt: parsePostedAt(job.detected_extensions?.posted_at),
  }
}

// ---------------------------------------------------------------------------
// Main export — fetch real jobs from SerpApi
// ---------------------------------------------------------------------------

const SEARCH_QUERIES = [
  { q: 'software engineer', location: 'Bangalore' },
  { q: 'data scientist', location: 'Bangalore' },
  { q: 'product manager', location: 'Mumbai' },
  { q: 'frontend developer', location: 'Pune' },
  { q: 'backend developer', location: 'Hyderabad' },
  { q: 'devops engineer', location: 'Delhi' },
  { q: 'business analyst', location: 'Gurugram' },
  { q: 'data analyst', location: 'Chennai' },
  { q: 'full stack developer', location: 'Noida' },
  { q: 'machine learning engineer', location: 'Bangalore' },
  { q: 'UI UX designer', location: 'Mumbai' },
  { q: 'cloud architect', location: 'Hyderabad' },
  { q: 'quality assurance engineer', location: 'Pune' },
  { q: 'android developer', location: 'Bangalore' },
  { q: 'project manager IT', location: 'Chennai' },
  { q: 'sales manager', location: 'Mumbai' },
  { q: 'digital marketing manager', location: 'Delhi' },
  { q: 'HR manager', location: 'Bangalore' },
  { q: 'financial analyst', location: 'Mumbai' },
  { q: 'operations manager', location: 'Hyderabad' },
]

export async function fetchJobsFromSerpApi(): Promise<ScrapedJob[]> {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) {
    console.warn('[SerpApi] SERPAPI_KEY not set, skipping API fetch')
    return []
  }

  const allJobs: ScrapedJob[] = []

  for (const search of SEARCH_QUERIES) {
    try {
      const params = new URLSearchParams({
        engine: 'google_jobs',
        q: search.q,
        location: search.location + ', India',
        hl: 'en',
        api_key: apiKey,
      })

      const response = await fetch(`https://serpapi.com/search?${params}`)

      if (!response.ok) {
        console.error(
          `[SerpApi] HTTP ${response.status} for "${search.q}" in ${search.location}`,
        )
        continue
      }

      const data: SerpApiResponse = await response.json()

      if (data.error) {
        console.error(`[SerpApi] API error: ${data.error}`)
        continue
      }

      if (data.jobs_results) {
        const mapped = data.jobs_results.map(mapSerpApiJobToScrapedJob)
        allJobs.push(...mapped)
      }
    } catch (err) {
      console.error(
        `[SerpApi] Failed to fetch "${search.q}" in ${search.location}:`,
        err,
      )
      continue
    }
  }

  console.log(
    `[SerpApi] Fetched ${allJobs.length} total jobs from ${SEARCH_QUERIES.length} queries`,
  )
  return allJobs
}
