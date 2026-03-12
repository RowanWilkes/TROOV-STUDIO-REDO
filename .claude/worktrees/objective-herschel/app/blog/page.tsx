import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from 'lucide-react'

export default function BlogPage() {
  const posts = [
    {
      title: "10 Design Planning Mistakes That Cost You Time",
      excerpt: "Learn how to avoid the most common pitfalls in design planning and save hours on every project.",
      category: "Best Practices",
      date: "Mar 15, 2025",
      readTime: "5 min read",
      image: "/design-planning-workspace.jpg"
    },
    {
      title: "How to Build a Mood Board That Actually Guides Your Design",
      excerpt: "A step-by-step guide to creating mood boards that keep your projects on track and clients happy.",
      category: "Tutorial",
      date: "Mar 12, 2025",
      readTime: "8 min read",
      image: "/mood-board-design-colors.jpg"
    },
    {
      title: "The Designer's Guide to Efficient Wireframing",
      excerpt: "Master wireframing techniques that speed up your workflow without sacrificing quality.",
      category: "Workflow",
      date: "Mar 8, 2025",
      readTime: "6 min read",
      image: "/wireframe-sketch-design.jpg"
    },
    {
      title: "Managing Multiple Client Projects Without Burning Out",
      excerpt: "Strategies and tools for juggling multiple design projects while maintaining your sanity.",
      category: "Productivity",
      date: "Mar 5, 2025",
      readTime: "7 min read",
      image: "/designer-workspace-multiple-projects.jpg"
    },
    {
      title: "Typography Systems: From Selection to Implementation",
      excerpt: "Everything you need to know about building cohesive typography systems for your projects.",
      category: "Design Systems",
      date: "Mar 1, 2025",
      readTime: "10 min read",
      image: "/typography-font-design.jpg"
    },
    {
      title: "Color Theory for Web Designers in 2025",
      excerpt: "Modern color theory principles and how to apply them to create stunning web designs.",
      category: "Design Theory",
      date: "Feb 28, 2025",
      readTime: "9 min read",
      image: "/color-palette-swatches.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
              Design insights and inspiration
            </h1>
            <p className="text-xl text-muted-foreground">
              Tips, tutorials, and best practices to help you design better and faster
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img 
                      src={post.image || "/placeholder.svg"} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{post.category}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2 group/btn">
                        Read more
                        <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
