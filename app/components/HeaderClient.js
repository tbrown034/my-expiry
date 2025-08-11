"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOutAction } from "@/app/actions/auth"

export default function HeaderClient({ session }) {
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
    { href: "/", label: "Home", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: "/profile", label: "Profile", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { href: "/admin", label: "Admin", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )}
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-gentle-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Expiry
                </h1>
                <span className="text-xs text-gray-500 hidden sm:block">Track • Save • Thrive</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl flex items-center gap-2 ${
                      isActive(link.href)
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              {/* Desktop Auth Button */}
              {session ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200 rounded-lg transition-all duration-300 group"
                >
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-md border border-emerald-300"
                    />
                  )}
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700">
                    My Account
                  </span>
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-5 relative">
                  <span className={`absolute block h-0.5 w-full transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'bg-white rotate-45 top-2' 
                      : 'bg-gray-700 top-0'
                  }`}></span>
                  <span className={`absolute block h-0.5 w-full top-2 transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'opacity-0' 
                      : 'bg-gray-700 opacity-100'
                  }`}></span>
                  <span className={`absolute block h-0.5 w-full transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'bg-white -rotate-45 top-2' 
                      : 'bg-gray-700 top-4'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'visible' : 'invisible'
      }`}>
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Mobile Menu Panel */}
        <div className={`absolute top-16 right-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <nav className="px-4 py-6 space-y-2">
            {/* User Info (if signed in) */}
            {session && (
              <div className="px-4 py-4 mb-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-xl border-2 border-emerald-300"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{session.user?.name || 'User'}</p>
                    <p className="text-sm text-gray-600">{session.user?.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={isActive(link.href) ? 'text-white' : 'text-gray-500'}>
                    {link.icon}
                  </div>
                  <span className="font-medium">{link.label}</span>
                  {isActive(link.href) && (
                    <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</p>
              <div className="space-y-1 mt-2">
                <button 
                  onClick={() => {
                    window.location.href = '/?action=add'
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
                >
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium">Add Items</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/?action=scan'
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
                >
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Scan Receipt</span>
                </button>
              </div>
            </div>
            
            {/* Auth Section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              {session ? (
                <form action={signOutAction}>
                  <button 
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </form>
              ) : (
                <Link 
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-semibold">Sign In</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}