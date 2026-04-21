import prisma from '@/lib/prisma'

export async function syncGithubRepos() {
  const username = process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_TOKEN

  if (!username) {
    throw new Error('GITHUB_USERNAME is not configured')
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  }

  if (token) {
    headers.Authorization = `token ${token}`
  }

  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers,
    next: { revalidate: 3600 } // Cache for 1 hour if used in fetch cache, but typically route handles this
  })

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.statusText}`)
  }

  const repos = await res.json()

  const syncedProjects = []

  for (const repo of repos) {
    // Upsert into Supabase/Prisma
    const project = await prisma.project.upsert({
      where: { github_id: repo.id },
      update: {
        name: repo.name,
        // Only update description if override is not set
        live_url: repo.homepage || null,
        github_url: repo.html_url,
        stars: repo.stargazers_count || 0,
        updated_at: new Date(),
        tags: [repo.language].filter(Boolean) as string[],
      },
      create: {
        github_id: repo.id,
        name: repo.name,
        live_url: repo.homepage || null,
        github_url: repo.html_url,
        stars: repo.stargazers_count || 0,
        tags: [repo.language].filter(Boolean) as string[],
      }
    })
    
    // Check if we need to set description override default
    if (!project.description_override && repo.description) {
      await prisma.project.update({
        where: { id: project.id },
        data: { description_override: repo.description }
      })
    }

    syncedProjects.push(project)
  }

  return syncedProjects
}
