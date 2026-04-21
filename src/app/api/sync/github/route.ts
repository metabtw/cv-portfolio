import { NextResponse } from 'next/server'
import { syncGithubRepos } from '@/lib/github'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      // Allow internal admin sync
      // For cron jobs, you'd use VERCEL_CRON_SECRET
      const cronSecret = process.env.CRON_SECRET
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const projects = await syncGithubRepos()
    return NextResponse.json({ success: true, count: projects.length })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
