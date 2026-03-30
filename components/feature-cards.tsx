import { Palette, PenTool, LayoutGrid, FileCode, MessageSquare, CheckSquare } from "lucide-react"

const features = [
  {
    title: "Visual Mood Boards",
    description: "Upload inspiration images, create color palettes, define typography, and add website references. Build the visual direction for your project.",
    icon: Palette,
  },
  {
    title: "Complete Style Guides",
    description: "Define your design system with color palettes, typography scales, button styles, and UI components with live website previews.",
    icon: PenTool,
  },
  {
    title: "Interactive Sitemaps",
    description: "Build comprehensive site structures with our block library containing 35+ pre-designed page sections. Plan your entire website architecture.",
    icon: LayoutGrid,
  },
  {
    title: "Technical Specifications",
    description: "Document hosting, platform, database, integrations, security, performance, and SEO requirements in organized sections.",
    icon: FileCode,
  },
  {
    title: "Content & Asset Management",
    description: "Organize brand messaging, content guidelines, SEO strategy, competitor analysis, and all your project assets in one place.",
    icon: MessageSquare,
  },
  {
    title: "Task Management & Summary",
    description: "Track design tasks with priorities and categories, then export comprehensive project summaries as professional PDFs.",
    icon: CheckSquare,
  },
]

export function FeatureCards() {
  return (
    <section className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-[#1BAE80] tracking-wide uppercase">
            Features
          </span>
          <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-[#231E4A] text-balance">
            Everything you need to plan & design
          </h2>
          <p className="mt-6 text-[#4A4570] leading-relaxed">
            All the tools modern designers need to go from concept to launch, in one unified platform.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string
  description: string
  icon: typeof Palette
}) {
  return (
    <div className="group p-6 rounded-2xl bg-[#F7F5FF] border border-transparent hover:border-[#C9BFFF] hover:bg-white transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-[#EDE8FF] flex items-center justify-center mb-5 group-hover:bg-[#4E4499]/10 transition-colors">
        <Icon className="h-6 w-6 text-[#4E4499]" />
      </div>
      
      <h3 className="text-lg font-semibold text-[#231E4A] mb-3">
        {title}
      </h3>
      
      <p className="text-sm text-[#4A4570] leading-relaxed">
        {description}
      </p>
    </div>
  )
}
