import Link from "next/link"

export default function AuthDropdown({ session, signOutAction }) {
  return (
    <details className="relative">
      <summary className="flex items-center space-x-2 px-2 py-1 rounded-xl hover:bg-white/50 transition-all duration-200 cursor-pointer list-none">
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-gray-900">
            {session.user?.name || 'User'}
          </div>
          <div className="text-xs text-gray-600">
            {session.user?.email}
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-green-100 py-2 z-50">
        <Link 
          href="/profile" 
          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          View Profile
        </Link>
        <Link 
          href="/admin" 
          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Admin Panel
        </Link>
        <div className="border-t border-gray-200 mt-2 pt-2">
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </details>
  )
}