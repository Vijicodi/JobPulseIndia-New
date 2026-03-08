'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { JobCard, JobData } from '@/components/JobCard'

/* ---------- Inline SVG Icons ---------- */

function UserIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ---------- Constants ---------- */

const locationChoices = [
  'Mumbai',
  'Bangalore',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
]

const categoryChoices = [
  'IT / Software',
  'Data Science',
  'Marketing',
  'Finance',
  'Design',
  'Sales',
  'HR',
  'Operations',
]

const experienceLevels = [
  { label: 'Fresher', value: 'fresher' },
  { label: 'Junior (1-3 yrs)', value: 'junior' },
  { label: 'Mid (3-5 yrs)', value: 'mid' },
  { label: 'Senior (5-10 yrs)', value: 'senior' },
  { label: 'Lead (10+ yrs)', value: 'lead' },
  { label: 'Executive', value: 'executive' },
]

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

/* ---------- Component ---------- */

export default function ProfilePage() {
  const { user, token, loading, updateProfile, logout } = useAuth()
  const router = useRouter()

  // Preferences state
  const [editingPrefs, setEditingPrefs] = useState(false)
  const [prefLocations, setPrefLocations] = useState<string[]>([])
  const [prefCategories, setPrefCategories] = useState<string[]>([])
  const [prefExperience, setPrefExperience] = useState('')
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [prefSuccess, setPrefSuccess] = useState(false)

  // Bookmarked jobs
  const [bookmarkedJobs, setBookmarkedJobs] = useState<JobData[]>([])
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(new Set())
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [loading, user, router])

  // Initialize prefs from user data
  useEffect(() => {
    if (user) {
      setPrefLocations(parseJsonArray(user.preferredLocations))
      setPrefCategories(parseJsonArray(user.preferredCategories))
      setPrefExperience(user.experienceLevel || '')
    }
  }, [user])

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!token) return
    setLoadingBookmarks(true)
    try {
      const res = await fetch('/api/bookmarks?include=jobs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.jobs) {
        setBookmarkedJobs(data.jobs)
        setBookmarkIds(new Set(data.jobs.map((j: JobData) => j.id)))
      }
    } catch {
      // silently fail
    }
    setLoadingBookmarks(false)
  }, [token])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const handleSavePrefs = async () => {
    setSavingPrefs(true)
    setPrefSuccess(false)
    const result = await updateProfile({
      preferredLocations: prefLocations,
      preferredCategories: prefCategories,
      experienceLevel: prefExperience || undefined,
    })
    setSavingPrefs(false)
    if (!result.error) {
      setPrefSuccess(true)
      setEditingPrefs(false)
      setTimeout(() => setPrefSuccess(false), 3000)
    }
  }

  const handleRemoveBookmark = async (jobId: string) => {
    if (!token) return
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      })
      setBookmarkedJobs((prev) => prev.filter((j) => j.id !== jobId))
      setBookmarkIds((prev) => {
        const next = new Set(prev)
        next.delete(jobId)
        return next
      })
    } catch {
      // silently fail
    }
  }

  const togglePrefLocation = (loc: string) => {
    setPrefLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    )
  }

  const togglePrefCategory = (cat: string) => {
    setPrefCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 animate-fade-in">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <UserIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-2xl font-bold text-text">
                {user.name}
              </h1>
              <p className="text-text-muted text-sm mt-1">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-all duration-200 shrink-0 cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Preferences section */}
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 mt-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg font-semibold text-text">
              Job Preferences
            </h2>
            {!editingPrefs ? (
              <button
                onClick={() => setEditingPrefs(true)}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                <EditIcon />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPrefs(false)}
                  className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrefs}
                  disabled={savingPrefs}
                  className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <CheckIcon />
                  {savingPrefs ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {prefSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
              Preferences saved successfully.
            </div>
          )}

          {editingPrefs ? (
            <div className="space-y-6">
              {/* Locations */}
              <div>
                <p className="text-sm font-medium text-text-muted mb-2">
                  Preferred Locations
                </p>
                <div className="flex flex-wrap gap-2">
                  {locationChoices.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => togglePrefLocation(loc)}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                        prefLocations.includes(loc)
                          ? 'bg-accent/10 border-accent/30 text-accent'
                          : 'bg-bg border-border text-text-muted hover:border-text-muted hover:text-text'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <p className="text-sm font-medium text-text-muted mb-2">
                  Preferred Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoryChoices.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => togglePrefCategory(cat)}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                        prefCategories.includes(cat)
                          ? 'bg-accent/10 border-accent/30 text-accent'
                          : 'bg-bg border-border text-text-muted hover:border-text-muted hover:text-text'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <p className="text-sm font-medium text-text-muted mb-2">
                  Experience Level
                </p>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map((lvl) => (
                    <button
                      key={lvl.value}
                      onClick={() =>
                        setPrefExperience(
                          prefExperience === lvl.value ? '' : lvl.value,
                        )
                      }
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                        prefExperience === lvl.value
                          ? 'bg-accent/10 border-accent/30 text-accent'
                          : 'bg-bg border-border text-text-muted hover:border-text-muted hover:text-text'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Locations
                </p>
                <div className="flex flex-wrap gap-2">
                  {prefLocations.length > 0 ? (
                    prefLocations.map((loc) => (
                      <span
                        key={loc}
                        className="text-sm px-3 py-1 rounded-lg bg-surface-hover text-text-muted border border-border"
                      >
                        {loc}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-text-muted">Not set</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {prefCategories.length > 0 ? (
                    prefCategories.map((cat) => (
                      <span
                        key={cat}
                        className="text-sm px-3 py-1 rounded-lg bg-surface-hover text-text-muted border border-border"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-text-muted">Not set</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Experience Level
                </p>
                <span className="text-sm text-text-muted">
                  {prefExperience
                    ? experienceLevels.find((l) => l.value === prefExperience)
                        ?.label || prefExperience
                    : 'Not set'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bookmarked Jobs */}
        <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-heading text-lg font-semibold text-text mb-4">
            My Bookmarked Jobs
          </h2>

          {loadingBookmarks ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-xl p-5 space-y-3"
                >
                  <div className="h-5 w-3/4 rounded animate-shimmer" />
                  <div className="h-4 w-1/3 rounded animate-shimmer" />
                  <div className="h-4 w-2/3 rounded animate-shimmer" />
                </div>
              ))}
            </div>
          ) : bookmarkedJobs.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-10 text-center">
              <p className="text-text-muted mb-2">No bookmarked jobs yet</p>
              <p className="text-text-muted text-sm">
                Browse jobs and click the heart icon to save them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onBookmark={handleRemoveBookmark}
                  isBookmarked={bookmarkIds.has(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
