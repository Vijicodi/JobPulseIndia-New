import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

/**
 * GET /api/bookmarks - List all bookmarks for the authenticated user
 *
 * Query parameters:
 *   include=jobs  - also return full job objects
 *
 * Returns: { bookmarkIds: string[], jobs?: Job[] }
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 },
      )
    }

    const { searchParams } = request.nextUrl
    const includeJobs = searchParams.get('include') === 'jobs'

    const bookmarkIds: string[] = []

    if (includeJobs) {
      const bookmarksWithJobs = await prisma.bookmark.findMany({
        where: { userId: user.id },
        include: { job: true },
        orderBy: { createdAt: 'desc' },
      })
      const jobs = bookmarksWithJobs.map((b) => {
        bookmarkIds.push(b.jobId)
        return b.job
      })
      return NextResponse.json({ bookmarkIds, jobs })
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    bookmarks.forEach((b) => bookmarkIds.push(b.jobId))

    return NextResponse.json({ bookmarkIds })
  } catch (error) {
    console.error('[GET /api/bookmarks]', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/bookmarks - Toggle bookmark for a job
 *
 * Body: { jobId: string }
 * Returns: { bookmarked: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { jobId } = body as { jobId?: string }

    if (!jobId || typeof jobId !== 'string') {
      return NextResponse.json(
        { error: 'jobId is required.' },
        { status: 400 },
      )
    }

    // Verify the job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
    }

    // Check if bookmark already exists
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId,
        },
      },
    })

    if (existing) {
      // Remove bookmark (toggle off)
      await prisma.bookmark.delete({ where: { id: existing.id } })
      return NextResponse.json({ bookmarked: false })
    } else {
      // Add bookmark (toggle on)
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          jobId,
        },
      })
      return NextResponse.json({ bookmarked: true })
    }
  } catch (error) {
    console.error('[POST /api/bookmarks]', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    )
  }
}
