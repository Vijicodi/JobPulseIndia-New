'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

function BriefcaseIcon() {
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function MenuIcon() {
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
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
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
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg/95 backdrop-blur-sm border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <BriefcaseIcon />
          <span className="font-heading text-xl font-bold">
            <span className="text-accent">JobPulse</span>
            <span className="text-text"> India</span>
          </span>
        </Link>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/jobs"
            className="text-text-muted hover:text-text transition-colors duration-200 text-sm font-medium"
          >
            Search Jobs
          </Link>
          {user && (
            <Link
              href="/profile"
              className="text-text-muted hover:text-text transition-colors duration-200 text-sm font-medium"
            >
              My Profile
            </Link>
          )}
        </div>

        {/* Right: Auth buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors duration-200"
              >
                <UserIcon />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-all duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden text-text-muted hover:text-text transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link
              href="/jobs"
              className="text-text-muted hover:text-text transition-colors py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Search Jobs
            </Link>
            {user && (
              <Link
                href="/profile"
                className="text-text-muted hover:text-text transition-colors py-2 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                My Profile
              </Link>
            )}
            <hr className="border-border" />
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-text-muted py-1">
                  <UserIcon />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-all duration-200 w-full text-left"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-all duration-200 text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-all duration-200 text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
