import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    if (type === 'projects') {
      const projects = await prisma.project.findMany({
        where: { featured: true },
        orderBy: { display_order: 'asc' },
        select: {
          id: true,
          name: true,
          description_override: true,
          live_url: true,
          github_url: true,
        }
      })
      return NextResponse.json(projects)
    }

    if (type === 'skills') {
      const skills = await prisma.skill.findMany({
        orderBy: { display_order: 'asc' },
      })
      return NextResponse.json(skills)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching CV data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
