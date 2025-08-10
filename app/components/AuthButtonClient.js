"use client"

import Link from "next/link"
import { signInWithGoogle } from "@/app/actions/auth"

export default function AuthButtonClient({ compact = false }) {
  return (
    <div className={`flex ${compact ? 'space-x-1' : 'space-x-3'}`}>
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className={`${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl hover:bg-white hover:border-green-300 transition-all duration-200 shadow-sm`}
        >
          {compact ? 'In' : 'Sign In'}
        </button>
      </form>
      <Link
        href="/profile"
        className={`${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center`}
      >
        {compact ? '👤' : 'Profile'}
      </Link>
    </div>
  )
}