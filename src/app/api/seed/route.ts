import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scrapeAllPortals } from '@/lib/scraper'

/**
 * POST /api/seed — Seed the database with real jobs from SerpApi
 * (falls back to sample data if API is unavailable).
 *
 * - If the DB already has 50+ jobs, returns early with a message.
 * - Otherwise fetches and inserts jobs (skipping duplicates).
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

    const result = await scrapeAllPortals()

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.newJobs} new jobs.`,
      added: result.newJobs,
      total: result.total,
    })
  } catch (error) {
    console.error('[POST /api/seed]', error)
    return NextResponse.json(
      { error: 'Seeding failed' },
      { status: 500 },
    )
  }
}
