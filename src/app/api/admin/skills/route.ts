import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const skills = await prisma.skill.findMany({
      orderBy: { display_order: 'asc' }
    })
    return NextResponse.json(skills)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, display_order } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const newSkill = await prisma.skill.create({
      data: { name, display_order: display_order || 0 }
    })
    
    return NextResponse.json(newSkill)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
