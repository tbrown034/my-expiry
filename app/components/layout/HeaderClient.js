"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function HeaderClient() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isActive = (path) => pathname === path

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: "linear-gradient(180deg, #64748b 0%, #475569 50%, #334155 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
        }}
      >
        {/* Brushed steel texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)`
          }}
        />

        {/* Top highlight edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent" />

        <div className="container-default relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group min-h-[44px]">
              {/* Fridge icon with metallic styling */}
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <svg
                  className="w-5 h-5 text-slate-200 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="5" y1="9" x2="19" y2="9" />
                  <line x1="14" y1="5" x2="14" y2="7" />
                  <line x1="14" y1="12" x2="14" y2="15" />
                </svg>
              </div>
              <span className="text-lg font-medium text-white/90 hidden sm:block">
                Food Xpiry
              </span>
            </Link>

            {/* Main Navigation - Always visible */}
            <nav className="flex items-center gap-2">
              {/* Add Items Button */}
              <Link
                href="/add"
                className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg transition-all cursor-pointer"
                style={{
                  background: isActive('/add')
                    ? 'linear-gradient(145deg, #f59e0b, #d97706)'
                    : 'rgba(251, 191, 36, 0.15)',
                  color: isActive('/add') ? 'white' : 'rgba(251, 191, 36, 0.9)',
                  boxShadow: isActive('/add') ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-sm font-semibold hidden sm:block">Add</span>
              </Link>

              {/* My Fridge Button */}
              <Link
                href="/fridge"
                className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg transition-all cursor-pointer"
                style={{
                  background: isActive('/fridge')
                    ? 'linear-gradient(145deg, #0ea5e9, #0284c7)'
                    : 'rgba(56, 189, 248, 0.15)',
                  color: isActive('/fridge') ? 'white' : 'rgba(56, 189, 248, 0.9)',
                  boxShadow: isActive('/fridge') ? '0 2px 8px rgba(14, 165, 233, 0.4)' : 'none'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="5" y1="9" x2="19" y2="9" />
                </svg>
                <span className="text-sm font-semibold hidden sm:block">Fridge</span>
              </Link>

              {/* Menu Button - hamburger for more options */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg transition-colors duration-150 flex items-center justify-center"
                style={{
                  backgroundColor: isMobileMenuOpen ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)"
                }}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-5 relative">
                  <span
                    className="absolute block h-0.5 w-full transition-all duration-200 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      transform: isMobileMenuOpen ? "rotate(45deg)" : "none",
                      top: isMobileMenuOpen ? "9px" : "3px"
                    }}
                  />
                  <span
                    className="absolute block h-0.5 w-full top-[9px] transition-opacity duration-200 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      opacity: isMobileMenuOpen ? 0 : 1
                    }}
                  />
                  <span
                    className="absolute block h-0.5 w-full transition-all duration-200 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      transform: isMobileMenuOpen ? "rotate(-45deg)" : "none",
                      top: isMobileMenuOpen ? "9px" : "15px"
                    }}
                  />
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom edge shadow for depth */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/30" />
      </header>

      {/* Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className="absolute top-16 left-0 right-0 shadow-xl animate-fade-up"
            style={{
              background: "linear-gradient(180deg, #475569 0%, #334155 100%)",
            }}
          >
            <nav className="container-default py-3">
              <div className="flex flex-col gap-1">
                {/* Primary actions - large touch targets */}
                <Link
                  href="/add"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl font-semibold transition-all min-h-[56px]"
                  style={{
                    background: isActive('/add') ? 'linear-gradient(145deg, #f59e0b, #d97706)' : 'rgba(251, 191, 36, 0.1)',
                    color: isActive('/add') ? 'white' : 'rgba(251, 191, 36, 0.95)'
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base">Add Items</div>
                    <div className="text-xs opacity-70 font-normal">Track with smart expiry dates</div>
                  </div>
                </Link>

                <Link
                  href="/fridge"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl font-semibold transition-all min-h-[56px]"
                  style={{
                    background: isActive('/fridge') ? 'linear-gradient(145deg, #0ea5e9, #0284c7)' : 'rgba(56, 189, 248, 0.1)',
                    color: isActive('/fridge') ? 'white' : 'rgba(56, 189, 248, 0.95)'
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="5" y1="9" x2="19" y2="9" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base">My Fridge</div>
                    <div className="text-xs opacity-70 font-normal">View items & expiring soon</div>
                  </div>
                </Link>

                {/* Divider */}
                <div className="h-px bg-slate-600/50 my-2" />

                {/* Secondary links */}
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-[48px]"
                  style={{
                    color: isActive('/') ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                    backgroundColor: isActive('/') ? 'rgba(0,0,0,0.2)' : 'transparent'
                  }}
                >
                  <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Home
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-[48px]"
                  style={{
                    color: isActive('/about') ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                    backgroundColor: isActive('/about') ? 'rgba(0,0,0,0.2)' : 'transparent'
                  }}
                >
                  <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  About
                </Link>

                <Link
                  href="/tracking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-[48px]"
                  style={{
                    color: isActive('/tracking') ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                    backgroundColor: isActive('/tracking') ? 'rgba(0,0,0,0.2)' : 'transparent'
                  }}
                >
                  <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  Stats
                </Link>
              </div>
            </nav>
            {/* Bottom edge */}
            <div className="h-px bg-black/30" />
          </div>
        </div>
      )}
    </>
  )
}
