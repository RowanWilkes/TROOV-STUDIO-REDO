"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check } from "lucide-react"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003A33] to-[#002724] opacity-80" />

        {/* Enhanced green glow effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />

        <div className="relative">
          {/* Hero Section */}
          <div className="container mx-auto px-6 pt-32 pb-12 lg:pt-40">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              <h1 className="text-[64px] leading-[1.1] font-semibold tracking-tight">
                <span className="text-emerald-400">Simple pricing.</span>
                <br />
                <span className="text-white">Powerful design tools.</span>
              </h1>
              <p className="text-lg leading-relaxed text-white/85 max-w-2xl mx-auto">
                Everything you need to plan, design, and deliver exceptional web projects.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-6 pb-8">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-0 bg-white/10 backdrop-blur-sm rounded-full p-1 shadow-lg">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                    billingPeriod === "monthly" ? "bg-white text-gray-900 shadow-md" : "text-white/70 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                    billingPeriod === "yearly" ? "bg-white text-gray-900 shadow-md" : "text-white/70 hover:text-white"
                  }`}
                >
                  Yearly
                </button>
                <span className="ml-1 px-3 py-1.5 bg-blue-100/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards with increased green glow */}
          <div className="container mx-auto px-6 pb-24">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <Card className="p-10 bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-emerald-600">For individuals & freelancers</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold text-gray-900">$0</span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Get started with Troov Studio and explore all core features with your first project.
                    </p>
                  </div>

                  <Button className="w-full h-14 text-base font-semibold bg-black hover:bg-gray-900 text-white rounded-xl">
                    Get Started Free
                  </Button>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-emerald-600 mb-6">Includes:</p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">1 project</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">1 team member</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">All dashboard sections</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">Mood board & style guide</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">Project overview tools</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">Sitemap & technical specs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Pro Plan */}
              <Card className="p-10 bg-white border border-gray-200 rounded-3xl shadow-[0_0_100px_-10px_rgba(16,185,129,0.7),0_0_60px_-15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_120px_-5px_rgba(16,185,129,0.8),0_0_80px_-10px_rgba(16,185,129,0.6)] transition-shadow">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Pro</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold text-gray-900">
                        ${billingPeriod === "monthly" ? "20" : "16"}
                      </span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Unlimited everything for professionals and teams who need to scale their design workflow.
                    </p>
                  </div>

                  <Button className="w-full h-14 text-base font-semibold bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 rounded-xl">
                    Upgrade to Pro
                  </Button>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-emerald-600 mb-6">Everything in Free, plus:</p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base font-medium">Unlimited projects</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base font-medium">Unlimited team members</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">Unlimited summary downloads</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">Advanced collaboration</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">Priority support</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-50 p-1 mt-0.5 flex-shrink-0">
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-base">Custom branding options</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-32 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Frequently asked questions</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-0 divide-y divide-gray-200">
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline py-6 hover:text-emerald-600 transition-colors">
                  What is Troov Studio?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  Troov Studio is a comprehensive design project management platform that helps you plan, organize, and
                  deliver web design projects. From mood boards to technical specs, everything you need in one place.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-0">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline py-6 hover:text-emerald-600 transition-colors">
                  Who is Troov Studio for?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  Troov Studio is built for web designers, freelancers, agencies, and teams who want to streamline their
                  design workflow and deliver better projects faster.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-0">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline py-6 hover:text-emerald-600 transition-colors">
                  How does the Free plan work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  The Free plan is completely free forever. You get access to all core features with 1 project and 1
                  team member. No credit card required, no time limits.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-0">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline py-6 hover:text-emerald-600 transition-colors">
                  Can I upgrade or downgrade my plan?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  Yes, you can upgrade from Free to Pro at any time. If you downgrade, your existing projects remain
                  accessible, but you'll be limited to the Free plan restrictions for new projects.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-0">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline py-6 hover:text-emerald-600 transition-colors">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  We accept all major credit cards (Visa, Mastercard, American Express, Discover) and process payments
                  securely through Stripe.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-0">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline py-6 hover:text-emerald-600 transition-colors">
                  Can I cancel my plan anytime?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  Absolutely. There's no commitment. You can cancel or pause your subscription anytime directly from
                  your account settings. No cancellation fees.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
