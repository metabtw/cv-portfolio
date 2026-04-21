"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  description_override: string | null
  featured: boolean
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleUpdate = async (id: string, data: Partial<Project>) => {
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, ...data } : p))
      } else {
        alert('Failed to update project')
      }
    } catch {
      alert('Error updating project')
    }
    setSaving(null)
  }

  if (loading) return <div className="p-8 text-center flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading projects...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Manage Projects</h1>
      </div>

      <div className="space-y-6">
        {projects.map(project => (
          <Card key={project.id}>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`featured-${project.id}`} 
                    checked={project.featured}
                    onCheckedChange={(checked) => handleUpdate(project.id, { featured: checked })}
                    disabled={saving === project.id}
                  />
                  <Label htmlFor={`featured-${project.id}`}>Featured on Home & CV</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description Override</Label>
                <div className="flex gap-2">
                  <Textarea 
                    defaultValue={project.description_override || ''}
                    placeholder="Enter custom description..."
                    className="flex-1"
                    onBlur={(e) => {
                      if (e.target.value !== project.description_override) {
                        handleUpdate(project.id, { description_override: e.target.value })
                      }
                    }}
                  />
                  <div className="flex flex-col justify-end">
                     {saving === project.id && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Changes save automatically when you click outside the text area.</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="text-center text-muted-foreground">No projects found. Sync from GitHub first.</p>
        )}
      </div>
    </div>
  )
}
