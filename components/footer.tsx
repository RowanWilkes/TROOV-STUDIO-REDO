import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "Project Overview", href: "/features/project-overview" },
      { label: "Mood Board", href: "/features/mood-board" },
      { label: "Style Guide", href: "/features/style-guide" },
      { label: "Sitemap", href: "/features/sitemap" },
      { label: "Technical Spec", href: "/features/technical-spec" },
      { label: "Content & Copy", href: "/features/content-copy" },
      { label: "Assets", href: "/features/assets" },
      { label: "Tasks", href: "/features/tasks" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Getting Started Guide", href: "/getting-started" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "Contact", href: "mailto:contact@troov-marketing.com" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-[#231E4A] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/images/troovstudio-logo-white.png"
                alt="Troov Studio"
                width={220}
                height={55}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-sm text-[#C9BFFF]/80 leading-relaxed max-w-xs">
              Organize your web design projects in one place. From concept to delivery.
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-sm text-[#C9BFFF]/70 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#C9BFFF]/60">
            © {new Date().getFullYear()} Troov Studio. All rights reserved.
          </p>
          <p className="text-sm text-[#C9BFFF]/60">
            Built by{" "}
            <a 
              href="https://www.troov-marketing.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#C9BFFF]/80 hover:text-white transition-colors underline underline-offset-2"
            >
              Troov Marketing
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}


