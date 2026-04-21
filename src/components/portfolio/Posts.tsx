import prisma from '@/lib/prisma'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function Posts() {
  const posts = await prisma.linkedinPost.findMany({
    orderBy: { published_at: 'desc' },
    take: 5,
  })

  if (posts.length === 0) {
    return null
  }

  return (
    <section id="posts" className="py-20 max-w-5xl mx-auto px-4 border-t bg-muted/20">
      <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">Recent Updates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 flex-1">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                {post.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {post.published_at ? format(post.published_at, 'MMM d, yyyy') : 'Recent'}
              </div>
              <Link 
                href={post.post_url}
                target="_blank"
                className="flex items-center text-xs text-primary hover:underline transition-colors"
              >
                View Post <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
