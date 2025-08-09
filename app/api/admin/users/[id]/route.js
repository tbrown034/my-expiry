import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Prevent users from deleting themselves
    if (session.user?.email) {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      
      if (currentUser?.id === id) {
        return Response.json({ error: 'Cannot delete your own account' }, { status: 400 })
      }
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    
    if (error.code === 'P2025') {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}