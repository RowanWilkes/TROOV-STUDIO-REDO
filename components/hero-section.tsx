"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Star, Check, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { 
  Home,
  LayoutGrid, 
  Palette, 
  PenTool, 
  GitBranch, 
  CheckSquare,
  FileText 
} from "lucide-react"

// Preload all tab images
const tabImages: Record<string, string> = {
  "home": "/images/dashboard-preview.png",
  "overview": "/images/overview-preview.png",
  "mood-board": "/images/moodboard-preview.png",
  "style-guide": "/images/styleguide-preview.png",
  "sitemap": "/images/sitemap-preview.png",
  "tasks": "/images/tasks-preview.png",
  "summary": "/images/summary-preview.png",
}

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "mood-board", label: "Mood Board", icon: Palette },
  { id: "style-guide", label: "Style Guide", icon: PenTool },
  { id: "sitemap", label: "Sitemap", icon: GitBranch },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "summary", label: "Summary", icon: FileText },
]

const mockupContent: Record<string, { title: string; description: string }> = {
  "home": {
    title: "Home",
    description: "Your project dashboard. See recent activity, quick actions, and an overview of all your design projects in one place.",
  },
  "overview": {
    title: "Project Overview",
    description: "Set project goals, define deliverables, and align with your client from day one. The Overview keeps every project anchored to what matters.",
  },
  "mood-board": {
    title: "Mood Board",
    description: "Upload inspiration images, define colour direction, and set the visual tone before a single pixel is designed.",
  },
  "style-guide": {
    title: "Style Guide",
    description: "Document your colour palette, typography scale, button styles, and UI components, all with live website previews.",
  },
  "sitemap": {
    title: "Sitemap",
    description: "Plan your entire site architecture with our interactive sitemap builder and library of 35+ pre-designed page section blocks.",
  },
  "tasks": {
    title: "Tasks",
    description: "Track every design task with priorities and categories. Stay organised throughout the entire project lifecycle.",
  },
  "summary": {
    title: "Summary",
    description: "Export a comprehensive project summary as a professional PDF. Perfect for client handoffs and developer documentation.",
  },
}

const AUTO_ADVANCE_DURATION = 7000 // 7 seconds

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("home")
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null)

  const activeIndex = tabs.findIndex(t => t.id === activeTab)

  // Preload all images on mount for instant switching
  useEffect(() => {
    const imageUrls = Object.values(tabImages)
    let loadedCount = 0
    
    imageUrls.forEach((url) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        if (loadedCount === imageUrls.length) {
          setImagesLoaded(true)
        }
      }
      img.src = url
    })
  }, [])

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % tabs.length
    setActiveTab(tabs[nextIndex].id)
    setProgress(0)
  }

  const goToPrev = () => {
    const prevIndex = (activeIndex - 1 + tabs.length) % tabs.length
    setActiveTab(tabs[prevIndex].id)
    setProgress(0)
  }

  const selectTab = (tabId: string) => {
    setActiveTab(tabId)
    setProgress(0)
  }

  // Intersection Observer to detect when tabs are visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Section entered viewport - start timer
          setIsVisible(true)
        } else {
          // Section left viewport - reset to home
          setIsVisible(false)
          setActiveTab("home")
          setProgress(0)
          // Clear timers
          if (progressRef.current) clearInterval(progressRef.current)
          if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
        }
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    )

    if (tabsContainerRef.current) {
      observer.observe(tabsContainerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-advance timer - only runs when section is visible
  useEffect(() => {
    // Don't start until section is visible
    if (!isVisible) return

    // Clear existing timers
    if (progressRef.current) clearInterval(progressRef.current)
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)

    // Progress animation (update every 40ms for smooth animation)
    const progressInterval = 40
    const progressStep = (progressInterval / AUTO_ADVANCE_DURATION) * 100

    progressRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + progressStep, 100))
    }, progressInterval)

    // Auto-advance after duration
    autoAdvanceRef.current = setTimeout(() => {
      goToNext()
    }, AUTO_ADVANCE_DURATION)

    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [activeTab, isVisible])

  return (
    <section className="relative hero-gradient overflow-hidden -mt-[88px] pt-[88px]">
      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/4 -translate-x-1/2 w-96 h-96 rounded-full bg-[#C9BFFF]/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 translate-x-1/2 w-96 h-96 rounded-full bg-[#C3F0E0]/30 blur-3xl" />
      <div className="absolute left-10 top-40 w-16 h-16 rounded-full bg-[#C9BFFF]/40 blur-xl hidden lg:block" />
      <div className="absolute right-16 top-56 w-24 h-24 rounded-full bg-[#C3F0E0]/50 blur-xl hidden lg:block" />
      
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-24 lg:px-8">
        {/* Announcement Banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDE8FF] px-4 py-2 border border-[#C9BFFF]/50">
            <Sparkles className="h-4 w-4 text-[#4E4499]" />
            <span className="text-sm font-medium text-[#4E4499]">
              NEW: AI-powered design suggestions
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] text-[#231E4A] text-balance">
            Organize Your Web Design{" "}
            <span className="italic text-[#4E4499]">Projects in One Place</span>
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-[#4A4570] max-w-2xl mx-auto text-balance">
            Plan, organize, and document your design projects from concept to delivery. 
            Everything you need for mood boards, style guides, sitemaps, and project 
            specifications in one platform.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1BAE80] px-8 py-4 text-base font-semibold text-white hover:bg-[#159a70] transition-colors shadow-lg shadow-[#1BAE80]/20"
            >
              <ArrowUpRight className="h-5 w-5" />
              Get started for free
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#FFB800] text-[#FFB800]" />
              ))}
            </div>
            <span className="text-sm text-[#4A4570]">
              <span className="font-semibold text-[#231E4A]">5 stars</span> across 450+ reviews
            </span>
          </div>

          {/* Trust Signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#4A4570]">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#1BAE80]" />
              Free for your first project
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#1BAE80]" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#1BAE80]" />
              Upgrade only when you need more
            </span>
          </div>
        </div>

        {/* Feature Tabs */}
        <div ref={tabsContainerRef} className="mt-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Left Arrow */}
            <button
              onClick={goToPrev}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#E8E4F0] bg-white text-[#4A4570] hover:border-[#4E4499] hover:text-[#4E4499] transition-colors shadow-sm"
              aria-label="Previous feature"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Tabs Container */}
            <div className="flex items-center rounded-full bg-[#231E4A]/5 px-2 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white text-[#4E4499] shadow-sm"
                        : "text-[#4A4570] hover:text-[#4E4499]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Right Arrow with Progress */}
            <div className="relative">
              {/* Progress Ring - positioned outside the button */}
              <svg className="absolute -inset-1 w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  fill="none"
                  stroke="#4E4499"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 163.4} 163.4`}
                  className="transition-all duration-100"
                />
              </svg>
              <button
                onClick={goToNext}
                className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#E8E4F0] bg-white text-[#4A4570] hover:border-[#4E4499] hover:text-[#4E4499] transition-colors shadow-sm"
                aria-label="Next feature"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Browser Mockup */}
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl bg-white border-2 border-[#C9BFFF] shadow-xl shadow-[#4E4499]/5 overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b border-[#EDE8FF]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white rounded-md text-xs text-[#4A4570] border border-[#EDE8FF]">
                    troovstudio.com
                  </div>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="min-h-[400px] bg-gradient-to-br from-[#FAFAFA] to-white">
                <ProductMockup activeTab={activeTab} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductMockup({ activeTab }: { activeTab: string }) {
  const imageAltText: Record<string, string> = {
    "home": "Troov Studio Dashboard - Home view showing project overview, stats, and recent activity",
    "overview": "Troov Studio Overview - Project details, goals, deliverables and success metrics",
    "mood-board": "Troov Studio Mood Board - Design inspiration with uploaded screenshots and visual references",
    "style-guide": "Troov Studio Style Guide - Colors, typography, and button styles configuration",
    "sitemap": "Troov Studio Sitemap - Build your website structure with pages and blocks",
    "tasks": "Troov Studio Tasks - Track your to-do list with progress tracking and task management",
    "summary": "Troov Studio Summary - Design project summary with client details, timeline, and downloadable PDF",
  }
  
  // Fixed container for all tabs - prevents resizing when images are inserted
  // All images are rendered but only the active one is visible for instant switching
  return (
    <div className="w-full h-[400px] overflow-hidden relative">
      {Object.entries(tabImages).map(([tabId, imageSrc]) => (
        <img 
          key={tabId}
          src={imageSrc} 
          alt={imageAltText[tabId] || `Troov Studio ${tabId}`}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-150 ${
            activeTab === tabId ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
      {!Object.keys(tabImages).includes(activeTab) && (
        <div className="flex flex-col lg:flex-row gap-8 h-full p-8">
          {/* Sidebar */}
          <div className="lg:w-56 shrink-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#4E4499] flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="text-sm font-medium text-[#231E4A]">troovstudio</span>
            </div>
            <div className="space-y-1">
              <SidebarItem icon="home" label="Home" active />
              <SidebarItem icon="overview" label="Overview" />
              <SidebarItem icon="mood" label="Mood Board" />
              <SidebarItem icon="style" label="Style Guide" />
              <SidebarItem icon="sitemap" label="Sitemap" />
              <SidebarItem icon="technical" label="Technical" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#231E4A]">
                Welcome back, Emma Chen!
              </h3>
              <p className="text-sm text-[#4A4570]">
                {"Here's what's happening with your projects today"}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Projects" value="3" subtext="+1 this month" icon="folder" />
              <StatCard label="Active Tasks" value="12" subtext="3 due this week" icon="tasks" />
              <StatCard label="Completion" value="67%" subtext="+12% from last week" highlight icon="chart" />
              <StatCard label="Team Members" value="4" subtext="2 active now" icon="users" />
            </div>

            {/* Quick Actions */}
            <div className="bg-[#EDE8FF]/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1BAE80] flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <span className="font-medium text-[#231E4A]">Quick Actions</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <QuickAction icon="new" label="New Project" />
                <QuickAction icon="upload" label="Upload Assets" />
                <QuickAction icon="invite" label="Invite Team" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <div 
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
        active 
          ? "bg-[#1BAE80]/10 text-[#1BAE80] font-medium" 
          : "text-[#4A4570] hover:bg-[#EDE8FF]/50"
      }`}
    >
      <div className="w-5 h-5 rounded bg-current/10 flex items-center justify-center text-xs">
        {icon === "home" && "🏠"}
        {icon === "overview" && "📊"}
        {icon === "mood" && "🎨"}
        {icon === "style" && "✏️"}
        {icon === "sitemap" && "🗺️"}
        {icon === "technical" && "⚙️"}
      </div>
      {label}
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  subtext, 
  highlight = false,
  icon 
}: { 
  label: string
  value: string
  subtext: string
  highlight?: boolean
  icon: string 
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#EDE8FF]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#4A4570]">{label}</span>
        <div className="w-6 h-6 rounded-lg bg-[#EDE8FF] flex items-center justify-center text-xs">
          {icon === "folder" && "📁"}
          {icon === "tasks" && "✓"}
          {icon === "chart" && "📈"}
          {icon === "users" && "👥"}
        </div>
      </div>
      <div className="text-2xl font-semibold text-[#231E4A]">{value}</div>
      <div className={`text-xs mt-1 ${highlight ? "text-[#1BAE80]" : "text-[#4A4570]"}`}>
        {subtext}
      </div>
    </div>
  )
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-[#EDE8FF] hover:border-[#C9BFFF] transition-colors cursor-pointer">
      <div className="w-8 h-8 rounded-lg bg-[#EDE8FF] flex items-center justify-center mb-2 text-sm">
        {icon === "new" && "📄"}
        {icon === "upload" && "⬆️"}
        {icon === "invite" && "👥"}
      </div>
      <span className="text-xs font-medium text-[#231E4A]">{label}</span>
    </div>
  )
}
