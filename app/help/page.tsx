import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"

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
              <Card className="p-8 lg:p-12 bg-white rounded-2xl shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-foreground">Contact Support</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Send us a message and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full h-11 px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full h-11 px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        className="w-full h-11 px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="What do you need help with?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="w-full min-h-32 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        placeholder="Describe your issue or question in detail..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  )
}
