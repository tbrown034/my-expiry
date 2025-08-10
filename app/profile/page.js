import { auth } from "@/auth"
import AuthButton from "../components/AuthButton"
import ProfileContent from "../components/ProfileContent"
import ProfileHeader from "../components/ProfileHeader"

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-green-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <AuthButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <ProfileHeader user={session.user} />
        <ProfileContent />
      </div>
    </div>
  )
}