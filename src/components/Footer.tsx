import React from 'react'
import Link from 'next/link'

function BriefcaseIcon() {
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
      className="text-accent"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <BriefcaseIcon />
            <span className="font-heading text-lg font-bold">
              <span className="text-accent">JobPulse</span>
              <span className="text-text"> India</span>
            </span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center justify-center gap-6">
            <Link
              href="#"
              className="text-sm text-text-muted hover:text-text transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted hover:text-text transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted hover:text-text transition-colors duration-200"
            >
              Terms
            </Link>
          </div>

          {/* Right: Made in India */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-text-muted">
              Made in India{' '}
              <span role="img" aria-label="India flag">
                &#127470;&#127475;
              </span>
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            &copy; 2026 JobPulse India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
