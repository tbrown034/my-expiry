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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" }
  ]

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
            <Link href="/" className="flex items-center gap-2 group">
              {/* Fridge icon with metallic styling */}
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
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
              <span className="text-lg font-medium text-white/90">
                Food Xpiry
              </span>
            </Link>

            {/* Desktop Navigation - subtle metallic buttons */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-150"
                  style={{
                    color: isActive(link.href) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                    backgroundColor: isActive(link.href) ? "rgba(0,0,0,0.2)" : "transparent",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href)) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href)) {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)"
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md transition-colors duration-150"
              style={{
                backgroundColor: isMobileMenuOpen ? "rgba(0,0,0,0.2)" : "transparent"
              }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-5 h-5 relative">
                <span
                  className="absolute block h-0.5 w-full transition-all duration-200 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    transform: isMobileMenuOpen ? "rotate(45deg)" : "none",
                    top: isMobileMenuOpen ? "9px" : "3px"
                  }}
                />
                <span
                  className="absolute block h-0.5 w-full top-[9px] transition-opacity duration-200 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    opacity: isMobileMenuOpen ? 0 : 1
                  }}
                />
                <span
                  className="absolute block h-0.5 w-full transition-all duration-200 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    transform: isMobileMenuOpen ? "rotate(-45deg)" : "none",
                    top: isMobileMenuOpen ? "9px" : "15px"
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom edge shadow for depth */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/30" />
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
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
            <nav className="container-default py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium transition-colors duration-150"
                    style={{
                      color: isActive(link.href) ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
                      backgroundColor: isActive(link.href) ? "rgba(0,0,0,0.2)" : "transparent"
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
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
