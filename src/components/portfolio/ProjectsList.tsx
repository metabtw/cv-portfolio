"use client"

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitBranch, ExternalLink, Star } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@prisma/client'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-center text-muted-foreground">No projects found. Run sync to fetch repos.</p>
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={item} className="h-full">
          <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl line-clamp-1">{project.name}</CardTitle>
                {project.featured && (
                  <Badge variant="default" className="ml-2">Featured</Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2 mt-2">
                {project.description_override || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-4">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{project.stars} stars</span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 border-t pt-4">
              {project.github_url && (
                <Link 
                  href={project.github_url}
                  target="_blank"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Code
                </Link>
              )}
              {project.live_url && (
                <Link 
                  href={project.live_url}
                  target="_blank"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live
                </Link>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
