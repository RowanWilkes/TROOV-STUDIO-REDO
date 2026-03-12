"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Palette,
  Zap,
  Users,
  FileText,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  ImageIcon,
  Globe,
  Code,
  Package,
} from "lucide-react"
import { useState, useEffect } from "react"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src={scrolled ? "/troov-studio-black-text.png" : "/troov-studio-logo-white.png"}
              alt="Troov Studio"
              className="h-16 object-contain transition-all duration-300"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="relative group">
                <button
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-500 flex items-center gap-1 ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-accent"}`}
                >
                  Platform <ChevronDown className="size-4" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-background border border-border rounded-2xl shadow-2xl p-8 w-[800px]">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          PLANNING
                        </h4>
                        <div className="space-y-1">
                          <Link
                            href="/dashboard?view=overview"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <LayoutDashboard className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Overview</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Define project goals and requirements
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/dashboard?view=sitemap"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <Globe className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Sitemap</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Map out your site structure
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/dashboard?view=technical"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <Code className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Technical</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Document technical specifications
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          DESIGN
                        </h4>
                        <div className="space-y-1">
                          <Link
                            href="/dashboard?view=moodboard"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <ImageIcon className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Mood Board</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Collect visual inspiration and ideas
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/dashboard?view=styleguide"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <Palette className="size-5 text-pink-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">
                                Style Guide
                              </div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Define colors and typography
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/dashboard?view=assets"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <Package className="size-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Assets</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Organize images and media files
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          MANAGEMENT
                        </h4>
                        <div className="space-y-1">
                          <Link
                            href="/dashboard?view=content"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <FileText className="size-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Content</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Write and organize page content
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/dashboard?view=tasks"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <Zap className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Tasks</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Track project tasks and milestones
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/dashboard?view=summary"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <FileText className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Summary</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Review and export project summary
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/pricing"
                className={`px-4 py-2 text-sm font-medium transition-colors duration-500 ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-accent"}`}
              >
                Pricing
              </Link>

              <div className="relative group">
                <button
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-500 flex items-center gap-1 ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-accent"}`}
                >
                  Resources <ChevronDown className="size-4" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-background border border-border rounded-2xl shadow-2xl p-8 w-[600px]">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          LEARN
                        </h4>
                        <div className="space-y-1">
                          <Link
                            href="/getting-started"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <BookOpen className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">
                                Getting Started
                              </div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Learn how to use Troov Studio
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/faq"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <HelpCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">FAQ</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Frequently asked questions
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          SUPPORT
                        </h4>
                        <div className="space-y-1">
                          <Link
                            href="/pricing"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <FileText className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">Pricing</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                View plans and pricing
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/help"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item"
                          >
                            <Users className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground group-hover/item:text-accent">
                                Contact Support
                              </div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Get in touch with our team
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-white/20">
              <Link
                href="/login"
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-accent"}`}
              >
                Sign in
              </Link>
              <Button
                asChild
                size="sm"
                className="h-10 px-6 bg-accent hover:bg-accent/90 text-white font-medium rounded-md shadow-sm"
              >
                <Link href="/signup">Get started for free</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
