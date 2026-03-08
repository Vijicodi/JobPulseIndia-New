import { prisma } from '@/lib/db'
import { ScrapedJob } from './types'
import { generateSampleJobs } from './sample-data'
import { fetchJobsFromSerpApi } from './serpapi'

export async function scrapeAllPortals(keywords?: string[]): Promise<{ newJobs: number; total: number }> {
  let jobs: ScrapedJob[] = []

  try {
    jobs = await fetchJobsFromSerpApi()
  } catch (err) {
    console.error('[scrapeAllPortals] SerpApi failed, falling back to sample data:', err)
  }

  if (jobs.length === 0) {
    console.log('[scrapeAllPortals] Using sample data as fallback')
    jobs = generateSampleJobs(200)
  }

  let newJobs = 0

  for (const job of jobs) {
    // Check for duplicates: same title + company + sourcePortal
    const existing = await prisma.job.findFirst({
      where: {
        title: job.title,
        company: job.company,
        sourcePortal: job.sourcePortal,
      },
    })

    if (!existing) {
      await prisma.job.create({
        data: {
          title: job.title,
          company: job.company,
          companyLogoUrl: job.companyLogoUrl || null,
          locations: JSON.stringify(job.locations),
          experienceMin: job.experienceMin ?? null,
          experienceMax: job.experienceMax ?? null,
          salaryMin: job.salaryMin ?? null,
          salaryMax: job.salaryMax ?? null,
          skills: job.skills ? JSON.stringify(job.skills) : null,
          description: job.description || null,
          workMode: job.workMode || null,
          sourcePortal: job.sourcePortal,
          sourceUrl: job.sourceUrl,
          postedAt: job.postedAt || new Date(),
          industry: job.industry || null,
          isActive: true,
        },
      })
      newJobs++
    }
  }

  const total = await prisma.job.count()
  return { newJobs, total }
}
