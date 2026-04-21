"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function AdminDashboard() {
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    try {
      // In a real app, send token or rely on internal sync setup
      const res = await fetch('/api/sync/github', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password'}` }
      })
      if (res.ok) alert('Sync successful!')
      else alert('Sync failed')
    } catch (e) {
      alert('Error syncing')
    }
    setSyncing(false)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GitHub Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Sync latest repositories from GitHub.</p>
            <Button onClick={handleSync} disabled={syncing}>
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Manage featured projects and descriptions.</p>
            <Link href="/admin/projects" className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
              Manage Projects
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Edit bio, skills, and experience.</p>
            <Link href="/admin/content" className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
              Edit Content
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
