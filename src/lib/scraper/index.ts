import { prisma } from '@/lib/db'
import { ScrapedJob } from './types'
import { generateSampleJobs } from './sample-data'

export async function scrapeAllPortals(keywords?: string[]): Promise<{ newJobs: number; total: number }> {
  // For the MVP, we use sample data since real scrapers would be blocked
  // In production, you'd call actual scrapers here and fall back to sample data
  const jobs: ScrapedJob[] = generateSampleJobs(200)

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
