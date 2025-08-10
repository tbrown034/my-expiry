import Image from "next/image"
import { signOutAction } from "@/app/actions/auth"

export default function ProfileHeader({ user }) {
  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl mb-8 border border-green-100">
      <div className="px-6 py-8">
        <div className="flex items-center space-x-6">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "Profile"}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full ring-4 ring-green-200 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-green-200 shadow-lg">
              {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.name || 'Welcome'}
            </h1>
            <p className="text-lg text-gray-600 mb-1">{user?.email}</p>
            <p className="text-sm text-gray-500">Member since January 2025</p>
          </div>
          
          {/* Sign Out Button */}
          <div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Account Information for Settings Tab */}
      <div className="border-t border-green-100 px-6 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1 text-sm text-gray-900">{user?.name || 'Not provided'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <div className="mt-1 text-sm text-gray-900">Google OAuth</div>
          </div>
        </div>
      </div>
    </div>
  )
}