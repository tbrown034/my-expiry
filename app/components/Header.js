"use client"

import Link from "next/link"
import AuthButton from "./AuthButton"

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" className="flex-shrink-0">
              <defs>
                <linearGradient id="bgGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#34D399', stopOpacity:1}} />
                  <stop offset="50%" style={{stopColor:'#10B981', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#047857', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="7" fill="url(#bgGradHeader)"/>
              <text x="16" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white">E</text>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors">
              My Expiry
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/profile" 
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Profile
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Admin
              </Link>
            </nav>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}