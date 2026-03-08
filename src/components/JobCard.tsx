'use client'

import React from 'react'
import Link from 'next/link'

/* ---------- Inline SVG icons ---------- */

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CurrencyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function BriefcaseSmallIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

/* ---------- Types ---------- */

export interface JobData {
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

interface JobCardProps {
  job: JobData
  onBookmark?: (jobId: string) => void
  isBookmarked?: boolean
}

/* ---------- Helpers ---------- */

const portalColors: Record<string, string> = {
  naukri: 'bg-naukri/15 text-naukri border-naukri/25',
  indeed: 'bg-indeed/15 text-indeed border-indeed/25',
  shine: 'bg-shine/15 text-shine border-shine/25',
  foundit: 'bg-foundit/15 text-foundit border-foundit/25',
}

const workModeStyles: Record<string, string> = {
  remote: 'text-success',
  hybrid: 'text-warning',
  office: 'text-text-muted',
}

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

function formatExperience(
  min: number | null,
  max: number | null,
): string | null {
  if (min === null && max === null) return null
  if (min !== null && max !== null) return `${min}-${max} yrs`
  if (min !== null) return `${min}+ yrs`
  return `0-${max} yrs`
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return ''
  const now = new Date()
  const posted = new Date(dateStr)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

/* ---------- Component ---------- */

export function JobCard({ job, onBookmark, isBookmarked = false }: JobCardProps) {
  const locations = parseJsonArray(job.locations)
  const skills = parseJsonArray(job.skills)
  const salary = formatSalary(job.salaryMin, job.salaryMax)
  const experience = formatExperience(job.experienceMin, job.experienceMax)
  const portal = job.sourcePortal.toLowerCase()
  const portalClass = portalColors[portal] || 'bg-surface-hover text-text-muted'
  const workModeClass = workModeStyles[job.workMode || ''] || 'text-text-muted'
  const timeAgo = relativeTime(job.postedAt)

  return (
    <div className="relative group bg-surface border border-border rounded-xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
      {/* Bookmark button */}
      {onBookmark && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onBookmark(job.id)
          }}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 ${
            isBookmarked
              ? 'text-accent hover:text-accent-hover'
              : 'text-text-muted hover:text-accent opacity-0 group-hover:opacity-100'
          } ${isBookmarked ? 'opacity-100' : ''}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <HeartIcon filled={isBookmarked} />
        </button>
      )}

      {/* Title */}
      <Link href={`/jobs/${job.id}`}>
        <h3 className="font-heading text-lg font-semibold text-text hover:text-accent transition-colors duration-200 pr-10 leading-tight">
          {job.title}
        </h3>
      </Link>

      {/* Company */}
      <p className="text-accent text-sm font-medium mt-1.5">{job.company}</p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-text-muted">
        {locations.length > 0 && (
          <span className="flex items-center gap-1.5">
            <MapPinIcon />
            {locations.slice(0, 2).join(', ')}
            {locations.length > 2 && ` +${locations.length - 2}`}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1.5">
            <CurrencyIcon />
            <span>{salary}</span>
          </span>
        )}
        {experience && (
          <span className="flex items-center gap-1.5">
            <BriefcaseSmallIcon />
            {experience}
          </span>
        )}
      </div>

      {/* Skills chips */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.slice(0, 6).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 rounded-md bg-surface-hover text-text-muted border border-border"
            >
              {skill}
            </span>
          ))}
          {skills.length > 6 && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-surface-hover text-text-muted border border-border">
              +{skills.length - 6}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: portal badge + work mode + time */}
      <div className="flex items-center flex-wrap gap-3 mt-4 pt-3 border-t border-border">
        <span
          className={`text-xs px-2.5 py-1 rounded-md border capitalize font-medium ${portalClass}`}
        >
          {portal}
        </span>
        {job.workMode && (
          <span className={`text-xs font-medium capitalize ${workModeClass}`}>
            {job.workMode}
          </span>
        )}
        {timeAgo && (
          <span className="text-xs text-text-muted ml-auto">{timeAgo}</span>
        )}
      </div>
    </div>
  )
}
