import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const { id } = params

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(data.description_override !== undefined && { description_override: data.description_override }),
        ...(data.featured !== undefined && { featured: data.featured }),
      }
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
