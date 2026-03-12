import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      company: "Acme Design Studio",
      industry: "Design Agency",
      title: "How Acme reduced project planning time by 75%",
      results: [
        { metric: "75%", label: "Faster planning" },
        { metric: "12+", label: "Projects managed" },
        { metric: "95%", label: "Client satisfaction" }
      ],
      image: "/design-agency-workspace.jpg"
    },
    {
      company: "TechFlow Inc",
      industry: "SaaS Company",
      title: "Streamlining design workflows for a fast-growing startup",
      results: [
        { metric: "3x", label: "More projects" },
        { metric: "60%", label: "Time saved" },
        { metric: "$50k", label: "Cost savings" }
      ],
      image: "/tech-startup-office.png"
    },
    {
      company: "Creative Minds",
      industry: "Freelance Collective",
      title: "Managing 50+ client projects with ease",
      results: [
        { metric: "50+", label: "Active projects" },
        { metric: "90%", label: "On-time delivery" },
        { metric: "4.9/5", label: "Client rating" }
      ],
      image: "/freelance-designer-workspace.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
              Real results from real designers
            </h1>
            <p className="text-xl text-muted-foreground">
              See how design teams use DesignFlow to plan better and ship faster
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {caseStudies.map((study, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-auto bg-muted">
                    <img 
                      src={study.image || "/placeholder.svg"} 
                      alt={study.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-12 space-y-6">
                    <div>
                      <p className="text-sm font-medium text-primary mb-2">{study.industry}</p>
                      <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{study.company}</h2>
                      <p className="text-lg text-muted-foreground">{study.title}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 py-6 border-y border-border">
                      {study.results.map((result, j) => (
                        <div key={j} className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <p className="text-2xl lg:text-3xl font-bold text-foreground">{result.metric}</p>
                            <TrendingUp className="size-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">{result.label}</p>
                        </div>
                      ))}
                    </div>

                    <Button className="gap-2 group">
                      Read full story
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
