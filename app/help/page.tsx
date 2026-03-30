import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { ChevronRight, Mail } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="min-h-screen relative">
      {/* Dark green background matching footer */}
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003A33] via-primary to-[#002724]"></div>
      </div>

      <div className="relative z-10">
        <SiteHeader />

        <section className="pt-32 lg:pt-40 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-[64px] leading-[1.1] font-semibold text-white tracking-tight text-balance">
                How can we help?
              </h1>
              <p className="text-lg leading-relaxed text-white/80">
                Choose a category below to find the information you need
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
                <a href="mailto:contact@troov-marketing.com">
                  <Card className="cursor-pointer hover:shadow-md transition-all bg-emerald-50 border-emerald-200 hover:border-emerald-300">
                    <div className="flex items-center justify-between p-6 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg text-emerald-900">
                            Contact Support
                          </h3>
                          <p className="text-sm text-emerald-800">Get in touch with our team</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    </div>
                  </Card>
                </a>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  )
}
