import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateSampleJobs } from '@/lib/scraper/sample-data'

/**
 * POST /api/seed — Seed the database with sample jobs for development.
 *
 * - If the DB already has 50+ jobs, returns early with a message.
 * - Otherwise generates and inserts 200 sample jobs (skipping duplicates).
 */
export async function POST() {
  try {
    const existingCount = await prisma.job.count()

    if (existingCount >= 50) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${existingCount} jobs. Skipping seed.`,
        added: 0,
        total: existingCount,
      })
    }

    const jobs = generateSampleJobs(200)
    let added = 0

    for (const job of jobs) {
      // Deduplicate by title + company + sourcePortal
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
        added++
      }
    }

    const total = await prisma.job.count()

    return NextResponse.json({
      success: true,
      message: `Seeded ${added} new jobs.`,
      added,
      total,
    })
  } catch (error) {
    console.error('[POST /api/seed]', error)
    return NextResponse.json(
      { error: 'Seeding failed' },
      { status: 500 },
    )
  }
}
