"use client"

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GripVertical, Download, Eye } from 'lucide-react'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { CVDocument } from '@/components/cv/CVTemplate'

// Note: Ensure your Prisma client is generating correctly, or use a typed API response
type CVProject = { id: string, name: string, description_override: string | null, live_url: string | null }

function SortableItem({ project }: { project: CVProject }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} className="mb-2 bg-card">
      <CardContent className="p-4 flex items-center gap-4">
        <button {...attributes} {...listeners} className="cursor-grab touch-none p-1 hover:bg-muted rounded">
          <GripVertical className="text-muted-foreground w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{project.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {project.description_override || "No description"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CVBuilder() {
  const [projects, setProjects] = useState<CVProject[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Fetch data from API
    const fetchData = async () => {
      try {
        const [projRes, skillsRes] = await Promise.all([
          fetch('/api/cv/data?type=projects'),
          fetch('/api/cv/data?type=skills')
        ])
        
        if (projRes.ok) {
          const data = await projRes.json()
          setProjects(data)
        }
        if (skillsRes.ok) {
          const data = await skillsRes.json()
          setSkills(data.map((s: { name: string }) => s.name))
        }
      } catch (e) {
        console.error("Failed to fetch CV data", e)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: { active: { id: string }, over: { id: string } | null }) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Mock user data, typically this would come from site_config or user profile
  const cvData = {
    name: "John Doe", // Fallback
    title: "Software Engineer",
    email: "contact@example.com",
    github: "johndoe",
    projects: projects,
    skills: skills
  }

  if (!isClient) return null
  if (loading) return <div className="p-10 text-center animate-pulse">Loading CV builder...</div>

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CV Builder</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <PDFDownloadLink document={<CVDocument data={cvData} />} fileName="portfolio_cv.pdf">
            {/* @ts-expect-error react-pdf types are outdated */}
            {({ loading }: { loading: boolean }) => (
              <Button disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Generating...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="mb-6 bg-muted/30 p-4 rounded-lg border">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Instructions</h2>
            <p className="text-sm">Drag and drop your projects to reorder them for your CV. The generated PDF is ATS-friendly and uses clean typography.</p>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Selected Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No featured projects found. Add them in the admin panel.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <SortableItem key={project.id} project={project} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <div className={`transition-all duration-300 ${showPreview ? 'opacity-100 h-auto' : 'opacity-50 grayscale pointer-events-none'}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Live Preview
            {!showPreview && <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">Click &apos;Show Preview&apos; to interact</span>}
          </h2>
          <Card className="overflow-hidden border bg-white h-[600px] shadow-sm">
            {showPreview ? (
              <PDFViewer width="100%" height="100%" className="border-none">
                <CVDocument data={cvData} />
              </PDFViewer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/10">
                <p className="text-muted-foreground flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Preview Hidden
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
