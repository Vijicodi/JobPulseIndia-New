'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

/* ---------- Inline SVG Icons ---------- */

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ZapIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

/* ---------- Data ---------- */

const quickFilters = [
  { label: 'Remote Jobs', query: 'remote' },
  { label: 'Fresher Jobs', query: 'fresher' },
  { label: 'IT Jobs', query: 'IT software' },
  { label: 'Bangalore', query: 'Bangalore' },
  { label: 'Mumbai', query: 'Mumbai' },
  { label: 'Data Science', query: 'data science' },
  { label: 'Marketing', query: 'marketing' },
  { label: 'Delhi NCR', query: 'Delhi NCR' },
]

const stats = [
  { value: '10,000+', label: 'Jobs Indexed', icon: <ZapIcon /> },
  { value: '4', label: 'Job Portals', icon: <LayersIcon /> },
  { value: '100+', label: 'Indian Cities', icon: <GlobeIcon /> },
]

const portals = [
  { name: 'Naukri', color: 'text-naukri', bg: 'bg-naukri/10 border-naukri/20' },
  { name: 'Indeed', color: 'text-indeed', bg: 'bg-indeed/10 border-indeed/20' },
  { name: 'Shine', color: 'text-shine', bg: 'bg-shine/10 border-shine/20' },
  { name: 'Foundit', color: 'text-foundit', bg: 'bg-foundit/10 border-foundit/20' },
]

/* ---------- Component ---------- */

export default function Home() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs')
  }

  function handleQuickFilter(q: string) {
    router.push(`/jobs?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-80 h-80 bg-indeed/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          {/* Heading */}
          <div className="text-center animate-fade-in">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="block text-text">Search once.</span>
              <span className="block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">
                  See every job
                </span>{' '}
                <span className="text-text">in India.</span>
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              Aggregate jobs from Naukri, Indeed, Shine, and Foundit into one
              powerful search. Stop switching tabs. Start finding your next role.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex items-center bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 focus-within:border-accent/50 focus-within:shadow-lg focus-within:shadow-accent/10"
            >
              <div className="flex items-center pl-4 text-text-muted">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, skills, or company..."
                className="flex-1 bg-transparent text-text placeholder-text-muted px-4 py-4 text-base outline-none"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-4 transition-colors duration-200 cursor-pointer"
              >
                Search Jobs
              </button>
            </form>
          </div>

          {/* Quick filter chips */}
          <div
            className="mt-6 flex flex-wrap justify-center gap-2 animate-slide-up"
            style={{ animationDelay: '0.35s' }}
          >
            {quickFilters.map((f) => (
              <button
                key={f.query}
                onClick={() => handleQuickFilter(f.query)}
                className="text-sm px-4 py-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text hover:border-accent/30 transition-all duration-200 cursor-pointer"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-surface border border-border animate-glow"
              >
                <div className="mb-3">{stat.icon}</div>
                <p className="font-heading text-3xl font-bold text-text">
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-3">
            All major job portals, one search
          </h2>
          <p className="text-text-muted mb-10 max-w-xl mx-auto">
            We aggregate listings from India&apos;s top recruitment platforms so
            you never miss an opportunity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {portals.map((p) => (
              <div
                key={p.name}
                className={`px-8 py-4 rounded-xl border font-heading text-lg font-semibold transition-all duration-300 hover:scale-105 ${p.bg} ${p.color}`}
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-2xl bg-surface border border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-3">
                Ready to find your next role?
              </h2>
              <p className="text-text-muted mb-8 max-w-md mx-auto">
                Create a free account to bookmark jobs, set alerts, and
                customize your search preferences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => router.push('/jobs')}
                  className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium transition-all duration-200 cursor-pointer"
                >
                  Start Searching
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-8 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-text-muted transition-all duration-200 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
