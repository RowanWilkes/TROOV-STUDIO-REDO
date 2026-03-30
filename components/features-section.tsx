"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, LayoutGrid, Palette, PenTool, GitBranch, FileCode, FileText, FolderOpen, CheckSquare } from "lucide-react"

const AUTO_ADVANCE_DURATION = 6000 // 6 seconds

// Preload all feature images for instant switching
const featureImages: Record<string, { src: string; alt: string }> = {
  "overview": {
    src: "/images/feature-overview.png",
    alt: "Troov Studio Overview - Deliverables & Scope with website features and requirements"
  },
  "mood-board": {
    src: "/images/feature-moodboard.png",
    alt: "Troov Studio Mood Board - Website references and design inspiration uploads"
  },
  "style-guide": {
    src: "/images/feature-styleguide.png",
    alt: "Troov Studio Style Guide - Colors, typography, and button customization"
  },
  "sitemap": {
    src: "/images/feature-sitemap.png",
    alt: "Troov Studio Sitemap - Pages structure and section blocks"
  },
  "technical-specs": {
    src: "/images/feature-technical.png",
    alt: "Troov Studio Technical Specs - Hosting, CMS, integrations, and performance requirements"
  },
  "content-copy": {
    src: "/images/feature-content.png",
    alt: "Troov Studio Content & Copy - Tone, key messages, content snippets, and SEO strategy"
  },
  "assets": {
    src: "/images/feature-assets.png",
    alt: "Troov Studio Assets - Upload and organize logos, images, icons, and media files"
  },
  "tasks": {
    src: "/images/feature-tasks.png",
    alt: "Troov Studio Tasks - Track tasks with progress tracking and export project summary"
  },
}

const features = [
  {
    id: "overview",
    title: "Overview",
    description: "Set project goals, define deliverables, and align with your client from day one. The Overview keeps every project anchored to what matters.",
    icon: LayoutGrid,
  },
  {
    id: "mood-board",
    title: "Mood Board",
    description: "Upload inspiration images, define colour direction, and set the visual tone before a single pixel is designed.",
    icon: Palette,
  },
  {
    id: "style-guide",
    title: "Style Guide",
    description: "Document your colour palette, typography scale, button styles, and UI components, all with live website previews.",
    icon: PenTool,
  },
  {
    id: "sitemap",
    title: "Sitemap",
    description: "Plan your entire site architecture with our interactive sitemap builder and library of 35+ pre-designed page section blocks.",
    icon: GitBranch,
  },
  {
    id: "technical-specs",
    title: "Technical Specs",
    description: "Document hosting, platforms, integrations, performance targets, and SEO requirements in one organised place.",
    icon: FileCode,
  },
  {
    id: "content-copy",
    title: "Content & Copy",
    description: "Write and organise all page content, brand messaging, SEO strategy, and competitor analysis. Ready for development handoff.",
    icon: FileText,
  },
  {
    id: "assets",
    title: "Assets",
    description: "Upload and organise every image, logo, icon, and media file your project needs. No more hunting through Drive folders.",
    icon: FolderOpen,
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Track every design task with priorities and categories. Then export a comprehensive project summary as a professional PDF.",
    icon: CheckSquare,
  },
]

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState("overview")
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null)

  const activeIndex = features.findIndex(f => f.id === activeFeature)

  // Preload all feature images on mount for instant switching
  useEffect(() => {
    Object.values(featureImages).forEach(({ src }) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % features.length
    setActiveFeature(features[nextIndex].id)
    setProgress(0)
  }

  const selectFeature = (featureId: string) => {
    setActiveFeature(featureId)
    setProgress(0)
  }

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Section entered viewport - start timer
          setIsVisible(true)
        } else {
          // Section left viewport - reset to overview
          setIsVisible(false)
          setActiveFeature("overview")
          setProgress(0)
          // Clear timers
          if (progressRef.current) clearInterval(progressRef.current)
          if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
        }
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
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
  }, [activeFeature, isVisible])

  return (
    <section ref={sectionRef} className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Heading & Accordion */}
          <div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] text-[#231E4A] text-balance">
              Get to know<br />
              <span className="italic text-[#4E4499]">Troov Studio</span>
            </h2>
            
            <p className="mt-6 text-[#4A4570] leading-relaxed max-w-md">
              Replace scattered tools with Troov Studio, the only design project platform 
              designed to make your workflow seamless and clients happier.
            </p>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1 text-[#1BAE80] font-medium">
                Platform Overview
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>

            {/* Feature Accordion */}
            <div className="mt-12 space-y-2">
              {features.map((feature) => (
                <FeatureRow
                  key={feature.id}
                  feature={feature}
                  isActive={activeFeature === feature.id}
                  onClick={() => selectFeature(feature.id)}
                  progress={activeFeature === feature.id ? progress : 0}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Product Screenshot */}
          <div className="lg:sticky lg:top-24">
            <FeatureMockup activeFeature={activeFeature} />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureRow({ 
  feature, 
  isActive, 
  onClick,
  progress 
}: { 
  feature: typeof features[0]
  isActive: boolean
  onClick: () => void
  progress: number
}) {
  const Icon = feature.icon
  
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all ${
        isActive 
          ? "bg-white border-l-[3px] border-l-[#4E4499] shadow-sm" 
          : "hover:bg-white/50 border-l-[3px] border-l-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isActive ? "bg-[#EDE8FF]" : "bg-[#F7F5FF]"
        }`}>
          <Icon className={`h-5 w-5 ${isActive ? "text-[#4E4499]" : "text-[#4A4570]"}`} />
        </div>
        <span className={`text-base font-medium ${isActive ? "text-[#231E4A]" : "text-[#4A4570]"}`}>
          {feature.title}
        </span>
        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
          isActive ? "text-[#4E4499] rotate-90" : "text-[#C9BFFF]"
        }`} />
      </div>
      
      {isActive && (
        <p className="mt-3 ml-[52px] text-sm text-[#4A4570] leading-relaxed">
          {feature.description}
        </p>
      )}
      
      {isActive && (
        <div className="mt-3 ml-[52px] h-1 bg-[#EDE8FF] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#4E4499] rounded-full transition-all duration-100 ease-linear" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  )
}

function FeatureMockup({ activeFeature }: { activeFeature: string }) {
  return (
    <div className="rounded-2xl bg-white border border-[#EDE8FF] shadow-xl shadow-[#4E4499]/5 overflow-hidden">
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b border-[#EDE8FF]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 min-h-[400px]">
        <MockupContent activeFeature={activeFeature} />
      </div>
    </div>
  )
}

function MockupContent({ activeFeature }: { activeFeature: string }) {
  // Render all images at once with visibility toggling for instant switching
  // Uses negative margin to counteract parent padding
  return (
    <div className="-m-6 h-[400px] overflow-hidden relative">
      {Object.entries(featureImages).map(([featureId, { src, alt }]) => (
        <img 
          key={featureId}
          src={src} 
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-150 ${
            activeFeature === featureId ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
    </div>
  )
}
