"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AuthButtonClient from "./AuthButtonClient"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
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
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/admin", label: "Admin", icon: "⚙️" }
  ]

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36" className="flex-shrink-0 lg:w-10 lg:h-10">
                  <defs>
                    <linearGradient id="bgGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#34D399', stopOpacity:1}} />
                      <stop offset="50%" style={{stopColor:'#10B981', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#047857', stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                  <rect width="32" height="32" rx="8" fill="url(#bgGradHeader)"/>
                  <text x="16" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">E</text>
                </svg>
                {/* Subtle pulse indicator */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-lg opacity-20 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors leading-tight">
                  My Expiry
                </h1>
                <span className="text-xs text-gray-500 mt-0.5 hidden sm:block lg:text-sm">Smart Food Tracking</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive(link.href)
                        ? 'text-emerald-600'
                        : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    <span className="hidden xl:inline">{link.icon} </span>
                    {link.label}
                    {isActive(link.href) && (
                      <div className="absolute inset-x-0 -bottom-2 h-0.5 bg-emerald-500 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </nav>
              <AuthButtonClient />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative p-2 rounded-lg transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-6 h-6 relative">
                  <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
                  }`}></span>
                  <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 top-2.5 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-16 right-0 left-0 bg-white shadow-lg z-50">
            <nav className="px-4 py-6 space-y-1 max-w-md mx-auto">
              {navLinks.map((link, index) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 animate-fade-in-up ${
                    isActive(link.href)
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                  }`}
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <span className="text-2xl w-8 text-center">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive(link.href) && (
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </Link>
              ))}
              
              {/* Additional Mobile Menu Items */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Quick Actions</p>
                </div>
                <Link 
                  href="/?action=add"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <span className="text-xl w-8 text-center">➕</span>
                  <span>Add Items</span>
                </Link>
                <Link 
                  href="/?action=scan"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <span className="text-xl w-8 text-center">📸</span>
                  <span>Scan Receipt</span>
                </Link>
              </div>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Account</p>
                </div>
                <Link 
                  href="/profile"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-xl w-8 text-center">👤</span>
                  <span>Profile / Sign In</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}