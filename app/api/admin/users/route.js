import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            groceries: true,
            sessions: true,
            accounts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return Response.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}