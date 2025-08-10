import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminClient from "./AdminClient"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session) {
    redirect("/api/auth/signin")
  }

  return <AdminClient />
}