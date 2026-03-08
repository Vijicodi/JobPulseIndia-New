export interface ScrapedJob {
  title: string
  company: string
  companyLogoUrl?: string
  locations: string[]
  experienceMin?: number
  experienceMax?: number
  salaryMin?: number  // in LPA
  salaryMax?: number  // in LPA
  skills?: string[]
  description?: string
  workMode?: 'remote' | 'hybrid' | 'office'
  sourcePortal: 'naukri' | 'indeed' | 'shine' | 'foundit'
  sourceUrl: string
  postedAt?: Date
  industry?: string
}

export interface ScraperResult {
  jobs: ScrapedJob[]
  portal: string
  success: boolean
  error?: string
}
