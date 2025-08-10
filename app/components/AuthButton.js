import Link from "next/link"
import Image from "next/image"
import { auth } from "@/auth"
import AuthDropdown from "./AuthDropdown"
import { signInWithGoogle, signOutAction } from "@/app/actions/auth"

export default async function AuthButton({ compact = false }) {
  const session = await auth()

  if (session) {
    return (
      <div className="relative">
        <div className="flex items-center space-x-3">
          <Link href="/profile" className="flex-shrink-0">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                width={compact ? 32 : 40}
                height={compact ? 32 : 40}
                className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ring-2 ring-green-200 shadow-md hover:ring-green-300 transition-all duration-200 cursor-pointer`}
              />
            ) : (
              <div className={`${compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'} rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold ring-2 ring-green-200 shadow-md hover:ring-green-300 transition-all duration-200 cursor-pointer`}>
                {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
              </div>
            )}
          </Link>
          
          {!compact && <AuthDropdown session={session} signOutAction={signOutAction} />}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${compact ? 'space-x-1' : 'space-x-3'}`}>
      <form
        action={signInWithGoogle}
      >
        <button
          type="submit"
          className={`${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl hover:bg-white hover:border-green-300 transition-all duration-200 shadow-sm`}
        >
          {compact ? 'In' : 'Sign In'}
        </button>
      </form>
      <form
        action={signInWithGoogle}
      >
        <button
          type="submit"
          className={`${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg`}
        >
          {compact ? 'Up' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}