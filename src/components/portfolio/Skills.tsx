import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'

export default async function Skills() {
  const skills = await prisma.skill.findMany({
    orderBy: { display_order: 'asc' },
  })

  if (skills.length === 0) {
    return null
  }

  return (
    <section id="skills" className="py-20 max-w-5xl mx-auto px-4 border-t">
      <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">Skills</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {skills.map((skill) => (
          <Badge key={skill.id} variant="secondary" className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
            {skill.name}
          </Badge>
        ))}
      </div>
    </section>
  )
}
