"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

type Skill = {
  id: string
  name: string
  display_order: number
}

export default function AdminContent() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    fetch('/api/admin/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load skills:", err)
        setLoading(false)
      })
  }, [])

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSkill.trim(), display_order: skills.length })
      })
      
      if (res.ok) {
        const added = await res.json()
        setSkills([...skills, added])
        setNewSkill('')
      }
    } catch {
      alert('Failed to add skill')
    }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSkills(skills.filter(s => s.id !== id))
      }
    } catch {
      alert('Failed to delete skill')
    }
  }

  if (loading) return <div className="p-8 text-center flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading content...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Manage Content</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <Input 
              placeholder="Add a new skill (e.g. React, Node.js)" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button type="submit"><Plus className="w-4 h-4 mr-2" /> Add</Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div key={skill.id} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm">
                <span>{skill.name}</span>
                <button 
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
          </div>
        </CardContent>
      </Card>
      
      {/* Placeholder for future content sections like Bio, Experience, etc. */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Bio & General Info (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This section will allow editing site-wide configuration.</p>
        </CardContent>
      </Card>
    </div>
  )
}
