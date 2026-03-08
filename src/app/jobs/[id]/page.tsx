'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

/* ---------- Inline SVG Icons ---------- */

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CurrencyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

/* ---------- Types ---------- */

interface JobDetail {
  id: string
  title: string
  company: string
  locations: string
  experienceMin: number | null
  experienceMax: number | null
  salaryMin: number | null
  salaryMax: number | null
  skills: string | null
  description: string | null
  workMode: string | null
  sourcePortal: string
  sourceUrl: string
  postedAt: string | null
  industry: string | null
}

/* ---------- Helpers ---------- */

function parseJsonArray(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatSalary(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null
  if (min !== null && max !== null) return `${min} - ${max} LPA`
  if (min !== null) return `${min}+ LPA`
  return `Up to ${max} LPA`
}

function formatExperience(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null
  if (min !== null && max !== null) return `${min}-${max} years`
  if (min !== null) return `${min}+ years`
  return `0-${max} years`
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return ''
  const now = new Date()
  const posted = new Date(dateStr)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Posted today'
  if (diffDays === 1) return 'Posted 1 day ago'
  if (diffDays < 7) return `Posted ${diffDays} days ago`
  if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`
  return `Posted ${Math.floor(diffDays / 30)} months ago`
}

const portalColors: Record<string, string> = {
  naukri: 'bg-naukri/15 text-naukri border-naukri/25',
  indeed: 'bg-indeed/15 text-indeed border-indeed/25',
  shine: 'bg-shine/15 text-shine border-shine/25',
  foundit: 'bg-foundit/15 text-foundit border-foundit/25',
}

const portalNames: Record<string, string> = {
  naukri: 'Naukri',
  indeed: 'Indeed',
  shine: 'Shine',
  foundit: 'Foundit',
}

const workModeLabels: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  office: 'Office',
}

/* ---------- Component ---------- */

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const jobId = params.id as string

  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const fetchJob = useCallback(async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      const data = await res.json()
      if (data.job) {
        setJob(data.job)
      }
    } catch {
      // error
    }
    setLoading(false)
  }, [jobId])

  const checkBookmark = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.bookmarkIds && data.bookmarkIds.includes(jobId)) {
        setIsBookmarked(true)
      }
    } catch {
      // silently fail
    }
  }, [token, jobId])

  useEffect(() => {
    fetchJob()
    checkBookmark()
  }, [fetchJob, checkBookmark])

  const handleBookmark = async () => {
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
      setIsBookmarked(data.bookmarked)
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <div className="h-6 w-32 rounded animate-shimmer" />
            <div className="h-10 w-3/4 rounded animate-shimmer" />
            <div className="h-5 w-1/3 rounded animate-shimmer" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-xl animate-shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Job not found</p>
          <Link
            href="/jobs"
            className="text-accent hover:text-accent-hover transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const locations = parseJsonArray(job.locations)
  const skills = parseJsonArray(job.skills)
  const salary = formatSalary(job.salaryMin, job.salaryMax)
  const experience = formatExperience(job.experienceMin, job.experienceMax)
  const portal = job.sourcePortal.toLowerCase()
  const portalClass = portalColors[portal] || 'bg-surface-hover text-text-muted'
  const timeAgo = relativeTime(job.postedAt)

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors duration-200 mb-6"
        >
          <ArrowLeftIcon />
          Back to Results
        </Link>

        {/* Header card */}
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="text-accent font-semibold text-lg">
                  {job.company}
                </span>
                {job.industry && (
                  <span className="text-xs px-2.5 py-1 rounded-md bg-surface-hover text-text-muted border border-border">
                    {job.industry}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className={`text-xs px-2.5 py-1 rounded-md border capitalize font-medium ${portalClass}`}>
                  {portal}
                </span>
                {timeAgo && (
                  <span className="text-xs text-text-muted">{timeAgo}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg border transition-all duration-200 shrink-0 cursor-pointer ${
                isBookmarked
                  ? 'border-accent/30 text-accent bg-accent/10'
                  : 'border-border text-text-muted hover:text-accent hover:border-accent/30'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <HeartIcon filled={isBookmarked} />
            </button>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {locations.length > 0 && (
              <div className="bg-bg rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <MapPinIcon />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Location
                  </span>
                </div>
                <p className="text-sm text-text font-medium">
                  {locations.join(', ')}
                </p>
              </div>
            )}
            {salary && (
              <div className="bg-bg rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <CurrencyIcon />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Salary
                  </span>
                </div>
                <p className="text-sm text-text font-medium">{salary}</p>
              </div>
            )}
            {experience && (
              <div className="bg-bg rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <BriefcaseIcon />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Experience
                  </span>
                </div>
                <p className="text-sm text-text font-medium">{experience}</p>
              </div>
            )}
            {job.workMode && (
              <div className="bg-bg rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <MonitorIcon />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Work Mode
                  </span>
                </div>
                <p className="text-sm text-text font-medium">
                  {workModeLabels[job.workMode] || job.workMode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Skills section */}
        {skills.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 mt-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-heading text-lg font-semibold text-text mb-4">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description section */}
        {job.description && (
          <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-heading text-lg font-semibold text-text mb-4">
              Job Description
            </h2>
            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed text-sm space-y-3">
              {job.description.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i}>{paragraph}</p>
                ) : null,
              )}
            </div>
          </div>
        )}

        {/* Apply button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium transition-all duration-200 text-base"
          >
            Apply on {portalNames[portal] || portal}
            <ExternalLinkIcon />
          </a>
          <button
            onClick={handleBookmark}
            className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border transition-all duration-200 text-sm cursor-pointer ${
              isBookmarked
                ? 'border-accent/30 text-accent bg-accent/10'
                : 'border-border text-text-muted hover:text-text hover:border-text-muted'
            }`}
          >
            <HeartIcon filled={isBookmarked} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark Job'}
          </button>
        </div>
      </div>
    </div>
  )
}
