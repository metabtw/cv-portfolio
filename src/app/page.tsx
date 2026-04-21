import Projects from '@/components/portfolio/Projects'
import Skills from '@/components/portfolio/Skills'
import Posts from '@/components/portfolio/Posts'
import Link from 'next/link'
import { GitBranch, Link as LinkIcon } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
        <div className="z-10 text-center space-y-6 max-w-3xl px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
            Hi, I&apos;m a <span className="text-primary">Developer</span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto">
            I build modern web applications and scalable systems. Welcome to my portfolio.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="#projects" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              View Projects
            </Link>
            <Link href="/cv" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
              Build CV
            </Link>
          </div>
          <div className="flex justify-center gap-6 pt-8">
            <Link href="https://github.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <GitBranch className="w-6 h-6" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <LinkIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <Projects />
      <Skills />
      <Posts />
      
      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
        <Link href="/admin" className="text-sm mt-2 inline-block hover:underline">
          Admin Login
        </Link>
      </footer>
    </main>
  )
}
