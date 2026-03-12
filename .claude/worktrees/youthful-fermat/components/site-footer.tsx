import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Check } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="relative overflow-visible">
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003A33] via-primary to-[#002724]"></div>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-8 relative z-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-accent p-12 rounded-3xl shadow-2xl relative overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-radial from-emerald-300/20 via-transparent to-transparent"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-400/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">Transform your design workflow</h2>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                  <div className="flex items-center gap-2 text-white">
                    <Check className="size-5" />
                    <span className="text-sm font-medium">Free for your first project</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Check className="size-5" />
                    <span className="text-sm font-medium">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Check className="size-5" />
                    <span className="text-sm font-medium">Upgrade only when you need more</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-accent border-0 shadow-lg hover:shadow-xl transition-all h-12 px-8 text-base font-semibold"
                  asChild
                >
                  <Link href="/signup">Get started for free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all h-12 px-8 text-base font-semibold"
                  asChild
                >
                  <Link href="/pricing">Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12 pt-18 relative z-0 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Image
              src="/troov-studio-footer-logo.png"
              alt="Troov Studio"
              width={300}
              height={60}
              className="h-16 w-auto"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Left side: Dashboard, Resources, and Company columns */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {/* Dashboard Sections Column */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-white">Dashboard</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/dashboard#overview"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Project Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard#mood-board"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Mood Board
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard#style-guide"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Style Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard#sitemap"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Sitemap
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard#technical-specs"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Technical Specs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard#content"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Content & Copy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources Column */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-white">Resources</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/dashboard#summary"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Project Summary
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard#assets" className="text-sm text-white/70 hover:text-white transition-colors">
                      Assets Library
                    </Link>
                  </li>
                  <li>
                    <Link href="/documentation" className="text-sm text-white/70 hover:text-white transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="text-sm text-white/70 hover:text-white transition-colors">
                      Help & Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/getting-started" className="text-sm text-white/70 hover:text-white transition-colors">
                      Getting Started
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-white">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-white/70 hover:text-white transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-white/70 hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white">Subscribe To Our Newsletter</h4>
              <p className="text-sm text-white/70">Get design tips, tricks, and updates delivered to your inbox.</p>
              <form className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email:"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-11 border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-white/60">©2025 All rights reserved</p>

            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="ghost"
                className="size-9 text-white/70 hover:text-white hover:bg-white/10"
                asChild
              >
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-9 text-white/70 hover:text-white hover:bg-white/10"
                asChild
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-9 text-white/70 hover:text-white hover:bg-white/10"
                asChild
              >
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-9 text-white/70 hover:text-white hover:bg-white/10"
                asChild
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s0 3.93.502 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126C19.24 1.347 18.502.935 17.86.63c-.765-.297-1.636-.499-2.913-.558C13.667.012 13.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.06 1.277.072 1.646.072 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.421.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42 2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.421-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
