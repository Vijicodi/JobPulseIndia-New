import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

const PAGE_SIZE = 20

/**
 * GET /api/jobs - Search and filter jobs
 *
 * Query parameters:
 *   q          - keyword search (title, company, skills, description, locations)
 *   location   - comma-separated location names
 *   experience - experience range like "1-3" or "5-10"
 *   salary     - comma-separated salary ranges like "3-6,6-10"
 *   workMode   - comma-separated: remote,hybrid,office
 *   source     - comma-separated: naukri,indeed,shine,foundit
 *   sort       - "newest" (default) | "salary_desc"
 *   page       - page number (default 1)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const q = searchParams.get('q')?.trim() || ''
    const locationParam = searchParams.get('location') || ''
    const experienceParam = searchParams.get('experience') || ''
    const salaryParam = searchParams.get('salary') || ''
    const workModeParam = searchParams.get('workMode') || ''
    const sourceParam = searchParams.get('source') || ''
    const sort = searchParams.get('sort') || 'newest'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

    // Build where clause
    const where: Prisma.JobWhereInput = { isActive: true }
    const andConditions: Prisma.JobWhereInput[] = []

    // Text search: match title, company, skills, description, or locations
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { company: { contains: q } },
        { skills: { contains: q } },
        { description: { contains: q } },
        { locations: { contains: q } },
      ]
    }

    // Location filter (comma-separated)
    if (locationParam) {
      const locations = locationParam
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
      if (locations.length > 0) {
        andConditions.push({
          OR: locations.map((loc) => ({ locations: { contains: loc } })),
        })
      }
    }

    // Experience filter (range like "1-3")
    if (experienceParam) {
      const [minStr, maxStr] = experienceParam.split('-')
      const min = parseFloat(minStr)
      const max = parseFloat(maxStr)
      if (!isNaN(min) && !isNaN(max)) {
        andConditions.push({
          OR: [{ experienceMin: { lte: max } }, { experienceMin: null }],
        })
        if (max < 99) {
          andConditions.push({
            OR: [{ experienceMax: { gte: min } }, { experienceMax: null }],
          })
        }
      }
    }

    // Salary filter (comma-separated ranges)
    if (salaryParam) {
      const ranges = salaryParam
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
      if (ranges.length > 0) {
        const salaryConditions: Prisma.JobWhereInput[] = ranges.map((range) => {
          const [minStr, maxStr] = range.split('-')
          const min = parseFloat(minStr)
          const max = parseFloat(maxStr)
          const cond: Prisma.JobWhereInput = {}
          if (!isNaN(min)) cond.salaryMax = { gte: min }
          if (!isNaN(max) && max < 999) cond.salaryMin = { lte: max }
          return cond
        })
        andConditions.push({ OR: salaryConditions })
      }
    }

    // Work mode filter (comma-separated)
    if (workModeParam) {
      const modes = workModeParam
        .split(',')
        .map((m) => m.trim().toLowerCase())
        .filter(Boolean)
      if (modes.length > 0) {
        andConditions.push({ workMode: { in: modes } })
      }
    }

    // Source portal filter (comma-separated)
    if (sourceParam) {
      const sources = sourceParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
      if (sources.length > 0) {
        andConditions.push({ sourcePortal: { in: sources } })
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    // Sorting
    let orderBy: Prisma.JobOrderByWithRelationInput
    if (sort === 'salary_desc') {
      orderBy = { salaryMax: 'desc' }
    } else {
      orderBy = { postedAt: 'desc' }
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({
      jobs,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    })
  } catch (error) {
    console.error('[GET /api/jobs]', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    )
  }
}
