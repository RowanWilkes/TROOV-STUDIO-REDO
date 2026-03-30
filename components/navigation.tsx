"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { 
  ChevronDown, 
  Menu, 
  X, 
  Target, 
  Palette, 
  PenTool, 
  GitBranch, 
  Code, 
  FileText, 
  Folder, 
  CheckSquare, 
  FileOutput,
  BookOpen,
  HelpCircle,
  CreditCard,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Newspaper,
  PlayCircle
} from "lucide-react"

// Platform menu data
type PlatformMenuItem = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  view: string
}

const platformMenuData: {
  planning: { label: string; items: PlatformMenuItem[] }
  build: { label: string; items: PlatformMenuItem[] }
  manage: { label: string; items: PlatformMenuItem[] }
} = {
  planning: {
    label: "PLANNING",
    items: [
      { icon: Target, title: "Overview", description: "Define project goals and client requirements", view: "overview" },
      { icon: Palette, title: "Mood Board", description: "Collect visual inspiration and set creative direction", view: "moodboard" },
      { icon: PenTool, title: "Style Guide", description: "Define colours, typography, and UI components", view: "styleguide" },
    ]
  },
  build: {
    label: "BUILD",
    items: [
      { icon: GitBranch, title: "Sitemap", description: "Map your site structure with 35+ page blocks", view: "sitemap" },
      { icon: Code, title: "Technical Specs", description: "Document hosting, integrations, and dev requirements", view: "technical" },
      { icon: FileText, title: "Content & Copy", description: "Write and organise all page content and SEO strategy", view: "content" },
    ]
  },
  manage: {
    label: "MANAGE",
    items: [
      { icon: Folder, title: "Assets", description: "Organise every image, logo, and media file", view: "assets" },
      { icon: CheckSquare, title: "Tasks", description: "Track project tasks and milestones", view: "tasks" },
      { icon: FileOutput, title: "Summary", description: "Export a professional PDF summary for client handoff", view: "summary" },
    ]
  }
}

// Resources menu data
const resourcesMenuData = {
  learn: {
    label: "LEARN",
    items: [
      { icon: BookOpen, title: "Getting Started", description: "New to Troov Studio? Start here", href: "/getting-started", comingSoon: false },
      { icon: HelpCircle, title: "FAQ", description: "Answers to common questions", href: "/faq", comingSoon: false },
    ]
  },
  support: {
    label: "SUPPORT",
    items: [
      { icon: CreditCard, title: "Pricing", description: "View plans and what's included", href: "/pricing", comingSoon: false },
      { icon: MessageCircle, title: "Contact Support", description: "Get in touch with our team", href: "mailto:contact@troov-marketing.com", comingSoon: false },
    ]
  }
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const platformMenuRef = useRef<HTMLDivElement>(null)
  const resourcesMenuRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (cancelled) return
      if (sessionError) {
        setIsLoggedIn(false)
        return
      }

      setIsLoggedIn(!!session?.user)
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const dashboardHrefForView = (view: string) => {
    if (!isLoggedIn) return "/signup"
    return `/dashboard?view=${encodeURIComponent(view)}`
  }

  const platformMenuDataWithLinks = {
    planning: {
      ...platformMenuData.planning,
      items: platformMenuData.planning.items.map((item) => ({
        ...item,
        href: dashboardHrefForView(item.view),
      })),
    },
    build: {
      ...platformMenuData.build,
      items: platformMenuData.build.items.map((item) => ({
        ...item,
        href: dashboardHrefForView(item.view),
      })),
    },
    manage: {
      ...platformMenuData.manage,
      items: platformMenuData.manage.items.map((item) => ({
        ...item,
        href: dashboardHrefForView(item.view),
      })),
    },
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (dropdownRef.current?.contains(target)) return
      if (platformMenuRef.current?.contains(target)) return
      if (resourcesMenuRef.current?.contains(target)) return
      setActiveDropdown(null)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDropdownOpen = (dropdown: string) => {
    setActiveDropdown(dropdown)
  }

  const handleDropdownClose = () => {
    setActiveDropdown(null)
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-[#F7F5FF]/80 backdrop-blur-md border-b border-[rgba(78,68,153,0.08)]" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className={`mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center" style={{ width: '180px' }}>
          <div className="flex items-center justify-start w-full">
            <Image
              src="/images/troovstudio-logo.png"
              alt="Troov Studio"
              width={220}
              height={55}
              className={`w-auto transition-all duration-300 origin-left ${scrolled ? "h-9" : "h-12"}`}
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8" ref={dropdownRef}>
          <div 
            className="relative"
            onMouseEnter={() => handleDropdownOpen('platform')}
          >
            <button 
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                activeDropdown === 'platform' ? 'text-[#1BAE80]' : 'text-[#4A4570] hover:text-[#1BAE80]'
              }`}
            >
              Platform
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'platform' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <Link href="/pricing" className="text-sm font-medium text-[#4A4570] hover:text-[#1BAE80] transition-colors">
            Pricing
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={() => handleDropdownOpen('resources')}
          >
            <button 
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                activeDropdown === 'resources' ? 'text-[#1BAE80]' : 'text-[#4A4570] hover:text-[#1BAE80]'
              }`}
            >
              Resources
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          {/* Divider */}
          <div className="h-6 w-px bg-[#4E4499]" />
          <Link 
            href="/login" 
            className="text-sm font-medium text-[#16A34A] hover:text-[#22C55E] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#4E4499] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3d3578] transition-colors"
          >
            Get started for free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden rounded-md p-2 text-[#4A4570]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Platform Mega Menu */}
      <div 
        ref={platformMenuRef}
        className={`absolute left-0 right-0 bg-white border-b border-[rgba(78,68,153,0.08)] shadow-xl transition-all duration-300 ease-out origin-top ${
          activeDropdown === 'platform' 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        }`}
        style={{ borderRadius: '0 0 16px 16px' }}
        onMouseLeave={handleDropdownClose}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <div className="grid grid-cols-4 gap-8">
            {/* Column 1 - Planning */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-4">
                {platformMenuData.planning.label}
              </p>
              <div className="space-y-1">
                {platformMenuDataWithLinks.planning.items.map((item) => (
                  <MenuItemLink key={item.title} item={item} onClose={() => setActiveDropdown(null)} />
                ))}
              </div>
            </div>

            {/* Column 2 - Build */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-4">
                {platformMenuData.build.label}
              </p>
              <div className="space-y-1">
                {platformMenuDataWithLinks.build.items.map((item) => (
                  <MenuItemLink key={item.title} item={item} onClose={() => setActiveDropdown(null)} />
                ))}
              </div>
            </div>

            {/* Column 3 - Manage */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-4">
                {platformMenuData.manage.label}
              </p>
              <div className="space-y-1">
                {platformMenuDataWithLinks.manage.items.map((item) => (
                  <MenuItemLink key={item.title} item={item} onClose={() => setActiveDropdown(null)} />
                ))}
              </div>
            </div>

            {/* Feature Card */}
            <div 
              className="relative rounded-xl p-5 overflow-hidden flex flex-col"
              style={{ 
                background: 'linear-gradient(135deg, #1BAE80 0%, #0F8A63 100%)',
                minHeight: '280px',
              }}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-[0.08]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="white"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Decorative gradient orb */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }}
              />
              
              {/* AI Neural network decorative element */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="10" r="4" fill="white"/>
                  <circle cx="10" cy="30" r="4" fill="white"/>
                  <circle cx="50" cy="30" r="4" fill="white"/>
                  <circle cx="20" cy="50" r="4" fill="white"/>
                  <circle cx="40" cy="50" r="4" fill="white"/>
                  <circle cx="30" cy="30" r="5" fill="white"/>
                  <line x1="30" y1="10" x2="30" y2="30" stroke="white" strokeWidth="1.5"/>
                  <line x1="10" y1="30" x2="30" y2="30" stroke="white" strokeWidth="1.5"/>
                  <line x1="50" y1="30" x2="30" y2="30" stroke="white" strokeWidth="1.5"/>
                  <line x1="20" y1="50" x2="30" y2="30" stroke="white" strokeWidth="1.5"/>
                  <line x1="40" y1="50" x2="30" y2="30" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Frosted glass badge */}
                <span 
                  className="inline-block self-start px-3 py-1.5 rounded-full text-xs font-semibold text-white mb-4"
                  style={{ 
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  NEW FEATURE
                </span>
                
                {/* Sparkles cluster */}
                <div className="flex items-center gap-1 mb-3">
                  <Sparkles className="h-6 w-6 text-white" />
                  <Sparkles className="h-4 w-4 text-white/60" />
                  <Sparkles className="h-3 w-3 text-white/40" />
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-white text-lg leading-tight mb-1">
                  AI-Assisted Project Suggestions
                </h3>
                
                {/* Subtitle */}
                <p className="text-sm text-white/70 mb-auto">Coming soon to Pro</p>
                
                {/* Upgrade link at bottom */}
                <Link 
                  href="/pricing" 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/90 transition-colors mt-4 group"
                  onClick={() => setActiveDropdown(null)}
                >
                  Upgrade
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Mega Menu */}
      <div 
        ref={resourcesMenuRef}
        className={`absolute left-0 right-0 bg-white border-b border-[rgba(78,68,153,0.08)] shadow-xl transition-all duration-300 ease-out origin-top ${
          activeDropdown === 'resources' 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        }`}
        style={{ borderRadius: '0 0 16px 16px' }}
        onMouseLeave={handleDropdownClose}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <div className="grid grid-cols-4 gap-8">
            {/* Column 1 - Learn */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-4">
                {resourcesMenuData.learn.label}
              </p>
              <div className="space-y-1">
                {resourcesMenuData.learn.items.map((item) => (
                  <MenuItemLink key={item.title} item={item} onClose={() => setActiveDropdown(null)} />
                ))}
              </div>
            </div>

            {/* Column 2 - Support */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-4">
                {resourcesMenuData.support.label}
              </p>
              <div className="space-y-1">
                {resourcesMenuData.support.items.map((item) => (
                  <MenuItemLink key={item.title} item={item} onClose={() => setActiveDropdown(null)} />
                ))}
              </div>
            </div>

            {/* Blog Card - Coming Soon */}
            <div 
              className="rounded-xl p-5 border opacity-75"
              style={{ borderColor: '#EDE8FF', background: '#FAFAFE' }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-3 block">
                BLOG
              </span>
              <div 
                className="relative w-full h-24 rounded-lg mb-3 bg-gradient-to-br from-[#EDE8FF] to-[#F7F5FF] flex items-center justify-center"
              >
                <Newspaper className="h-8 w-8 text-[#7B6FCC] opacity-50" />
                <span 
                  className="absolute top-2 right-2 font-sans font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ fontSize: '10px', background: '#EDE8FF', color: '#4E4499' }}
                >
                  Coming soon
                </span>
              </div>
              <h3 className="font-semibold text-[#231E4A] text-sm mb-2">
                Design tips, guides, and insights for web designers
              </h3>
              <span className="text-sm text-[#7B6FCC]">
                Coming soon
              </span>
            </div>

            {/* Video Walkthrough Card - Coming Soon */}
            <div 
              className="rounded-xl p-5 border opacity-75"
              style={{ borderColor: '#EDE8FF', background: '#FAFAFE' }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-3 block">
                VIDEO WALKTHROUGH
              </span>
              <div 
                className="relative w-full h-24 rounded-lg mb-3 bg-gradient-to-br from-[#EDE8FF] to-[#F7F5FF] flex items-center justify-center"
              >
                <PlayCircle className="h-10 w-10 text-[#7B6FCC] opacity-50" />
                <span 
                  className="absolute top-2 right-2 font-sans font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ fontSize: '10px', background: '#EDE8FF', color: '#4E4499' }}
                >
                  Coming soon
                </span>
              </div>
              <h3 className="font-semibold text-[#231E4A] text-sm mb-2">
                Watch a full walkthrough of the Troov Studio dashboard
              </h3>
              <span className="text-sm text-[#7B6FCC]">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[rgba(78,68,153,0.08)] bg-white">
          <div className="space-y-1 px-6 py-4">
            <MobileNavSection title="Platform" data={platformMenuDataWithLinks} />
            <Link href="/pricing" className="block py-3 text-base font-medium text-[#4A4570]">
              Pricing
            </Link>
            <MobileNavSection title="Resources" data={resourcesMenuData} />
            <div className="pt-4 space-y-3 border-t border-[rgba(78,68,153,0.08)]">
              <Link href="/login" className="block py-2 text-base font-medium text-[#16A34A]">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="block rounded-full bg-[#4E4499] px-5 py-3 text-center text-base font-semibold text-white"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

const menuItemClass =
  "flex items-start gap-3 p-3 rounded-lg hover:bg-[#F7F5FF] transition-colors group h-[88px]"

function MenuItemLink({ 
  item, 
  onClose 
}: { 
  item: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; href: string; comingSoon?: boolean }
  onClose: () => void 
}) {
  const Icon = item.icon
  const inner = (
    <>
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#EDE8FF] flex items-center justify-center group-hover:bg-[#E0D9FF] transition-colors">
        <Icon className="h-5 w-5 text-[#4E4499]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-[#231E4A] text-sm group-hover:text-[#1BAE80] transition-colors">
            {item.title}
          </p>
          {item.comingSoon && (
            <span 
              className="font-sans font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ fontSize: '10px', background: '#EDE8FF', color: '#4E4499' }}
            >
              Coming soon
            </span>
          )}
        </div>
        <p className="text-xs text-[#7B6FCC] mt-0.5 leading-relaxed">
          {item.description}
        </p>
      </div>
    </>
  )

  if (item.href.startsWith("mailto:") || item.href.startsWith("tel:")) {
    return (
      <a href={item.href} className={menuItemClass} onClick={onClose}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={item.href} className={menuItemClass} onClick={onClose}>
      {inner}
    </Link>
  )
}

function MobileNavSection({ 
  title, 
  data 
}: { 
  title: string
  data: Record<string, { label: string; items: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; href: string }[] }>
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button 
        className="flex w-full items-center justify-between py-3 text-base font-medium text-[#4A4570]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pl-4 pb-3 space-y-4">
          {Object.values(data).map((section) => (
            <div key={section.label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7B6FCC] mb-2">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const rowClass = "flex items-center gap-2 py-2 text-sm text-[#4A4570]"
                  if (item.href.startsWith("mailto:") || item.href.startsWith("tel:")) {
                    return (
                      <a key={item.title} href={item.href} className={rowClass}>
                        <Icon className="h-4 w-4 text-[#7B6FCC]" />
                        {item.title}
                      </a>
                    )
                  }
                  return (
                    <Link key={item.title} href={item.href} className={rowClass}>
                      <Icon className="h-4 w-4 text-[#7B6FCC]" />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
