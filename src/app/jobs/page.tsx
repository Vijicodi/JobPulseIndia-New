'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { JobCard, JobData } from '@/components/JobCard'
import { useAuth } from '@/context/AuthContext'

/* ---------- Inline SVG Icons ---------- */

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/* ---------- Filter Data ---------- */

const locationOptions = [
  'Mumbai',
  'Bangalore',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
]

const experienceOptions = [
  { label: 'Fresher', value: '0-1' },
  { label: '1-3 yrs', value: '1-3' },
  { label: '3-5 yrs', value: '3-5' },
  { label: '5-10 yrs', value: '5-10' },
  { label: '10+', value: '10-99' },
]

const salaryOptions = [
  { label: '0-3 LPA', value: '0-3' },
  { label: '3-6 LPA', value: '3-6' },
  { label: '6-10 LPA', value: '6-10' },
  { label: '10-15 LPA', value: '10-15' },
  { label: '15-25 LPA', value: '15-25' },
  { label: '25+ LPA', value: '25-999' },
]

const workModeOptions = ['Remote', 'Hybrid', 'Office']
const sourceOptions = ['Naukri', 'Indeed', 'Shine', 'Foundit']

/* ---------- FilterSection Component ---------- */

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium text-text hover:text-accent transition-colors duration-200 cursor-pointer"
      >
        {title}
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  )
}

/* ---------- Skeleton ---------- */

function JobSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
      <div className="h-5 w-3/4 rounded animate-shimmer" />
      <div className="h-4 w-1/3 rounded animate-shimmer" />
      <div className="h-4 w-2/3 rounded animate-shimmer" />
      <div className="flex gap-2 mt-3">
        <div className="h-6 w-16 rounded animate-shimmer" />
        <div className="h-6 w-20 rounded animate-shimmer" />
        <div className="h-6 w-14 rounded animate-shimmer" />
      </div>
    </div>
  )
}

/* ---------- Main Content (uses useSearchParams) ---------- */

function JobsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token } = useAuth()

  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [jobs, setJobs] = useState<JobData[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [seeded, setSeeded] = useState(false)

  // Filters
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedSalary, setSelectedSalary] = useState<string[]>([])
  const [selectedWorkMode, setSelectedWorkMode] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])

  // Mobile filter drawer
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleArrayFilter = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    val: string,
  ) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])
    setPage(1)
  }

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.bookmarkIds) {
        setBookmarkedIds(new Set(data.bookmarkIds))
      }
    } catch {
      // silently fail
    }
  }, [token])

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (selectedLocations.length > 0)
      params.set('location', selectedLocations.join(','))
    if (selectedExperience) params.set('experience', selectedExperience)
    if (selectedSalary.length > 0)
      params.set('salary', selectedSalary.join(','))
    if (selectedWorkMode.length > 0)
      params.set('workMode', selectedWorkMode.map((m) => m.toLowerCase()).join(','))
    if (selectedSources.length > 0)
      params.set('source', selectedSources.map((s) => s.toLowerCase()).join(','))
    params.set('sort', sortBy)
    params.set('page', String(page))

    try {
      const res = await fetch(`/api/jobs?${params.toString()}`)
      const data = await res.json()

      if (data.jobs && data.jobs.length === 0 && !seeded && page === 1) {
        // Auto-seed
        setSeeded(true)
        await fetch('/api/seed', { method: 'POST' })
        // Retry
        const retryRes = await fetch(`/api/jobs?${params.toString()}`)
        const retryData = await retryRes.json()
        setJobs(retryData.jobs || [])
        setTotalJobs(retryData.total || 0)
        setTotalPages(retryData.totalPages || 1)
      } else {
        setJobs(data.jobs || [])
        setTotalJobs(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch {
      setJobs([])
    }
    setLoading(false)
  }, [
    query,
    selectedLocations,
    selectedExperience,
    selectedSalary,
    selectedWorkMode,
    selectedSources,
    sortBy,
    page,
    seeded,
  ])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    router.push(`/jobs?q=${encodeURIComponent(query.trim())}`, { scroll: false })
    fetchJobs()
  }

  const handleBookmark = async (jobId: string) => {
    if (!token) {
      router.push('/auth/login')
      return
    }
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      })
      const data = await res.json()
      if (data.bookmarked) {
        setBookmarkedIds((prev) => new Set([...prev, jobId]))
      } else {
        setBookmarkedIds((prev) => {
          const next = new Set(prev)
          next.delete(jobId)
          return next
        })
      }
    } catch {
      // silently fail
    }
  }

  /* ---------- Filter panel content (shared between sidebar and drawer) ---------- */

  const filterContent = (
    <div className="space-y-0">
      <FilterSection title="Location">
        {locationOptions.map((loc) => (
          <label key={loc} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={selectedLocations.includes(loc)}
              onChange={() =>
                toggleArrayFilter(selectedLocations, setSelectedLocations, loc)
              }
              className="rounded border-border bg-surface text-accent focus:ring-accent focus:ring-offset-0 focus:ring-1"
            />
            {loc}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Experience">
        {experienceOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer transition-colors">
            <input
              type="radio"
              name="experience"
              checked={selectedExperience === opt.value}
              onChange={() => {
                setSelectedExperience(
                  selectedExperience === opt.value ? '' : opt.value,
                )
                setPage(1)
              }}
              className="border-border bg-surface text-accent focus:ring-accent focus:ring-offset-0 focus:ring-1"
            />
            {opt.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Salary (LPA)">
        {salaryOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={selectedSalary.includes(opt.value)}
              onChange={() =>
                toggleArrayFilter(selectedSalary, setSelectedSalary, opt.value)
              }
              className="rounded border-border bg-surface text-accent focus:ring-accent focus:ring-offset-0 focus:ring-1"
            />
            {opt.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Work Mode">
        {workModeOptions.map((mode) => (
          <label key={mode} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={selectedWorkMode.includes(mode)}
              onChange={() =>
                toggleArrayFilter(selectedWorkMode, setSelectedWorkMode, mode)
              }
              className="rounded border-border bg-surface text-accent focus:ring-accent focus:ring-offset-0 focus:ring-1"
            />
            {mode}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Source">
        {sourceOptions.map((src) => (
          <label key={src} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={selectedSources.includes(src)}
              onChange={() =>
                toggleArrayFilter(selectedSources, setSelectedSources, src)
              }
              className="rounded border-border bg-surface text-accent focus:ring-accent focus:ring-offset-0 focus:ring-1"
            />
            {src}
          </label>
        ))}
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky search bar */}
      <div className="sticky top-16 z-40 bg-bg/95 backdrop-blur-sm border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-surface border border-border rounded-lg overflow-hidden transition-all duration-300 focus-within:border-accent/50"
          >
            <div className="flex items-center pl-3 text-text-muted">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs..."
              className="flex-1 bg-transparent text-text placeholder-text-muted px-3 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-5 py-3 transition-colors duration-200 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-36 bg-surface border border-border rounded-xl p-5">
              <h3 className="font-heading text-sm font-semibold text-text mb-4">
                Filters
              </h3>
              {filterContent}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  className="lg:hidden flex items-center gap-2 text-sm text-text-muted hover:text-text border border-border rounded-lg px-3 py-2 transition-colors cursor-pointer"
                  onClick={() => setDrawerOpen(true)}
                >
                  <FilterIcon />
                  Filters
                </button>
                <p className="text-sm text-text-muted">
                  {loading ? (
                    'Searching...'
                  ) : (
                    <>
                      Showing{' '}
                      <span className="text-text font-medium">
                        {totalJobs.toLocaleString()}
                      </span>{' '}
                      jobs
                    </>
                  )}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(1)
                }}
                className="text-sm bg-surface border border-border rounded-lg px-3 py-2 text-text-muted outline-none focus:border-accent/50 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="salary_desc">Highest Salary</option>
              </select>
            </div>

            {/* Jobs list */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-text-muted text-lg mb-2">
                  No jobs found
                </div>
                <p className="text-text-muted text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarkedIds.has(job.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3.5 py-2 text-sm rounded-lg border transition-all duration-200 cursor-pointer ${
                        page === pageNum
                          ? 'bg-accent border-accent text-white'
                          : 'border-border text-text-muted hover:text-text hover:border-text-muted'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-surface border-l border-border overflow-y-auto animate-fade-in">
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-base font-semibold text-text">
                  Filters
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  <CloseIcon />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Page wrapper with Suspense ---------- */

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="text-text-muted">Loading...</div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  )
}
