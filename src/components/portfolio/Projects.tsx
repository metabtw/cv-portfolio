import prisma from '@/lib/prisma'
import ProjectsList from './ProjectsList'

export default async function Projects() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { featured: 'desc' },
      { display_order: 'asc' },
      { updated_at: 'desc' }
    ],
  })

  return (
    <section id="projects" className="py-20 max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">Selected Projects</h2>
      <ProjectsList projects={projects} />
    </section>
  )
}
