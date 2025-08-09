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
                <linearGradient id="leafGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#10b981', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#059669', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <path d="M16 2 C24 2, 30 8, 30 16 C30 20, 28 24, 24 26 C20 28, 16 28, 16 28 C16 28, 12 28, 8 26 C4 24, 2 20, 2 16 C2 8, 8 2, 16 2 Z" 
                    fill="url(#leafGradientHeader)" 
                    stroke="#047857" 
                    strokeWidth="1"/>
              <path d="M16 4 L16 26" 
                    stroke="#047857" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"/>
              <path d="M16 8 L12 12" 
                    stroke="#047857" 
                    strokeWidth="1" 
                    strokeLinecap="round"/>
              <path d="M16 8 L20 12" 
                    stroke="#047857" 
                    strokeWidth="1" 
                    strokeLinecap="round"/>
              <path d="M16 14 L11 18" 
                    stroke="#047857" 
                    strokeWidth="1" 
                    strokeLinecap="round"/>
              <path d="M16 14 L21 18" 
                    stroke="#047857" 
                    strokeWidth="1" 
                    strokeLinecap="round"/>
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