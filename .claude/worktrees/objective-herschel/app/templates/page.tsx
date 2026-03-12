import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

export default function TemplatesPage() {
  const templates = [
    {
      title: "E-commerce Website",
      description: "Complete design system for online stores",
      image: "/ecommerce-website-design.png",
      downloads: "2.4k"
    },
    {
      title: "SaaS Landing Page",
      description: "Conversion-focused landing page template",
      image: "/saas-landing-page.png",
      downloads: "3.1k"
    },
    {
      title: "Portfolio Website",
      description: "Showcase your work beautifully",
      image: "/portfolio-website-design.png",
      downloads: "1.8k"
    },
    {
      title: "Mobile App Design",
      description: "iOS and Android app design system",
      image: "/mobile-app-interface.png",
      downloads: "2.9k"
    },
    {
      title: "Dashboard UI",
      description: "Clean admin dashboard template",
      image: "/general-dashboard-interface.png",
      downloads: "4.2k"
    },
    {
      title: "Marketing Website",
      description: "Multi-page marketing site template",
      image: "/marketing-website.jpg",
      downloads: "1.5k"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
              Design templates
            </h1>
            <p className="text-xl text-muted-foreground">
              Kickstart your projects with professionally crafted design templates
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img 
                      src={template.image || "/placeholder.svg"} 
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{template.title}</h3>
                      <p className="text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">{template.downloads} downloads</span>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="size-4" />
                        Use Template
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
