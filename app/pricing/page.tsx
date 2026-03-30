"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Check, Sparkles, ArrowUpRight, ChevronDown } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()

  const freeFeatures = [
    "1 active project",
    "All 8 dashboard sections",
    "PDF summary export",
    "1 team member",
    "Project progress tracking",
  ]

  const proFeatures = [
    { text: "Unlimited projects", comingSoon: false },
    { text: "Unlimited PDF summary exports", comingSoon: false },
    { text: "Priority support", comingSoon: false },
    { text: "AI-assisted project suggestions", comingSoon: true },
    { text: "Client sharing & collaboration", comingSoon: true },
    { text: "Custom branding on exports", comingSoon: true },
  ]

  const faqs = [
    {
      question: "Is Troov Studio really free to start?",
      answer: "Yes. The Free plan gives you full access to all 8 dashboard sections on your first project. No credit card needed, no time limit. Try it out and upgrade only when you need more.",
    },
    {
      question: "What do I get on the Pro plan?",
      answer: "Pro unlocks unlimited projects, unlimited PDF summary exports, and priority support. You also get early access to upcoming features like AI-assisted project suggestions, client sharing, and custom branding on exports.",
    },
    {
      question: "Can I upgrade or downgrade at any time?",
      answer: "Yes, you can change your plan at any time from your account settings. Changes take effect at the end of your current billing period.",
    },
    {
      question: "What happens to my projects if I downgrade?",
      answer: "Your data is never deleted. If you downgrade to Free, all your projects are preserved but you can only actively work on 1 project at a time.",
    },
    {
      question: "Do you charge per team member?",
      answer: "No. The Pro plan includes unlimited team members across all your projects. No per-seat fees.",
    },
    {
      question: "When should I upgrade to Pro?",
      answer: "When you are ready to take on more than one client project at a time, or you want unlimited PDF exports for professional client handoffs, that is when Pro makes sense.",
    },
  ]

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const monthlyPrice = 10
  const yearlyPrice = 8

  const handleUpgrade = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.id) {
      router.push("/signup")
      return
    }

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod: isYearly ? "yearly" : "monthly" }),
      })

      const data = await res.json().catch(() => ({}))
      if (data.url) window.location.href = data.url
      else router.push("/signup")
    } catch {
      router.push("/signup")
    }
  }

  return (
    <div className="bg-[#F7F5FF]">
      <main className="min-h-screen bg-[#F7F5FF]">
        <Navigation />

      {/* Hero: pull under sticky header so lavender shows through (matches home HeroSection) */}
      <section className="-mt-[88px] pt-[calc(88px+8rem)] pb-20 bg-[#F7F5FF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 
            className="font-serif text-balance mb-6"
            style={{ fontSize: '56px', color: '#231E4A', lineHeight: 1.1 }}
          >
            Start free, upgrade{" "}
            <span style={{ color: '#1BAE80' }}>when you&apos;re ready</span>
          </h1>
          
          <p 
            className="font-sans mb-10 max-w-2xl mx-auto"
            style={{ fontSize: '20px', color: '#4A4570', lineHeight: 1.6 }}
          >
            Everything you need to plan, design, and deliver exceptional web projects. No credit card required.
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-center mb-4">
            <a 
              href="/signup"
              className="flex items-center gap-2 font-sans font-semibold py-3.5 px-7 rounded-full transition-opacity hover:opacity-90"
              style={{ background: '#4E4499', color: 'white', fontSize: '15px' }}
            >
              <ArrowUpRight size={18} />
              Get started for free
            </a>
          </div>

          <p 
            className="font-sans"
            style={{ fontSize: '14px', color: '#7B6FCC' }}
          >
            Try free for as long as you need
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-[#F7F5FF]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Layout - Text on left, Cards centered-right */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-12">
            {/* Left Column - Text */}
            <div className="lg:w-[340px] flex-shrink-0">
              <p 
                className="font-sans font-semibold uppercase mb-3"
                style={{ fontSize: '12px', color: '#1BAE80', letterSpacing: '0.1em' }}
              >
                PLANS & PRICING
              </p>
              <h2 
                className="font-serif text-balance"
                style={{ fontSize: '42px', color: '#231E4A', lineHeight: 1.15 }}
              >
                Most designers<br />
                start and stay<br />
                free.
              </h2>
            </div>

            {/* Right Column - Pricing Cards - Overlapping Layout */}
            <div className="relative flex flex-col flex-1 items-stretch lg:items-start lg:justify-center gap-0">
              {/* Monthly/Yearly Toggle - Above Pro Card */}
              <div className="flex items-center gap-3 mb-3 lg:ml-[420px]">
                <span 
                  className="font-sans font-medium"
                  style={{ fontSize: '14px', color: isYearly ? '#7B6FCC' : '#231E4A' }}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative w-14 h-7 rounded-full transition-colors duration-200"
                  style={{ background: isYearly ? '#1BAE80' : '#C9BFFF' }}
                >
                  <div 
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
                    style={{ 
                      transform: isYearly ? 'translateX(32px)' : 'translateX(4px)'
                    }}
                  />
                </button>
                <span 
                  className="font-sans font-medium"
                  style={{ fontSize: '14px', color: isYearly ? '#231E4A' : '#7B6FCC' }}
                >
                  Yearly
                </span>
                <span 
                  className="font-sans font-semibold px-2 py-1 rounded-full"
                  style={{ fontSize: '12px', background: '#C3F0E0', color: '#0F6E56' }}
                >
                  Save 20%
                </span>
              </div>

              {/* Cards Row */}
              <div className="relative flex flex-col lg:flex-row items-stretch lg:items-start gap-0">
                {/* Green Glow Behind Cards */}
                <div 
                  className="absolute z-0 rounded-full blur-3xl opacity-40"
                  style={{
                    width: '350px',
                    height: '350px',
                    background: 'radial-gradient(circle, #1BAE80 0%, transparent 70%)',
                    top: '50%',
                    left: '120px',
                    transform: 'translateY(-50%)',
                  }}
                />
            {/* Free Card - Elevated/In Front */}
            <div 
              className="relative z-20 bg-white rounded-2xl p-8 w-full lg:w-[400px] lg:-mr-4"
              style={{ 
                border: '1px solid #EDE8FF',
                boxShadow: '0 0 24px 5px rgba(27, 174, 128, 0.3), 0 25px 50px -12px rgba(78, 68, 153, 0.25)'
              }}
            >
              <p 
                className="font-sans font-semibold mb-2"
                style={{ fontSize: '20px', color: '#231E4A' }}
              >
                Free
              </p>
              <p 
                className="font-sans mb-4"
                style={{ fontSize: '14px', color: '#7B6FCC' }}
              >
                Perfect for getting started
              </p>
              
              <div className="flex items-baseline gap-1 mb-3">
                <span 
                  className="font-serif"
                  style={{ fontSize: '52px', color: '#4E4499' }}
                >
                  $0
                </span>
                <span 
                  className="font-sans"
                  style={{ fontSize: '16px', color: '#7B6FCC' }}
                >
                  / MONTH
                </span>
              </div>

              <p 
                className="font-sans mb-6 pb-6"
                style={{ 
                  fontSize: '14px', 
                  color: '#4A4570', 
                  lineHeight: 1.6,
                  borderBottom: '1px solid #EDE8FF'
                }}
              >
                Get started with Troov Studio and explore all core features with your first project.
              </p>

              <p 
                className="font-sans font-semibold uppercase mb-4"
                style={{ fontSize: '11px', color: '#7B6FCC', letterSpacing: '0.08em' }}
              >
                KEY FEATURES
              </p>

              <div className="flex flex-col gap-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <FeatureItem key={index} text={feature} />
                ))}
              </div>

              {/* Spacer to balance card heights */}
              <div className="h-24" />

              <a 
                href="/signup"
                className="flex items-center justify-center gap-2 w-full font-sans font-semibold py-3.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: '#231E4A', color: 'white', fontSize: '14px' }}
              >
                <ArrowUpRight size={16} />
                Get started for free
              </a>
            </div>

            {/* Pro Card - Behind */}
            <div 
              className="relative z-10 bg-white rounded-2xl p-8 pl-12 pt-12 lg:pt-8 w-full lg:w-[420px] lg:mt-8"
              style={{ 
                border: '1px solid #EDE8FF',
                boxShadow: '0 10px 30px -12px rgba(78, 68, 153, 0.15)'
              }}
            >
              <p 
                className="font-sans font-semibold mb-2"
                style={{ fontSize: '20px', color: '#231E4A' }}
              >
                Pro
              </p>
              <p 
                className="font-sans mb-4"
                style={{ fontSize: '14px', color: '#7B6FCC' }}
              >
                Unlimited & scalable
              </p>
              
              <div className="flex items-baseline gap-1 mb-3">
                <span 
                  className="font-serif"
                  style={{ fontSize: '52px', color: '#1BAE80' }}
                >
                  ${isYearly ? yearlyPrice : monthlyPrice}
                </span>
                <span 
                  className="font-sans"
                  style={{ fontSize: '16px', color: '#7B6FCC' }}
                >
                  / MONTH
                </span>
              </div>

              <p 
                className="font-sans mb-6 pb-6"
                style={{ 
                  fontSize: '14px', 
                  color: '#4A4570', 
                  lineHeight: 1.6,
                  borderBottom: '1px solid #EDE8FF'
                }}
              >
                Unlimited everything for professionals and teams who need to scale.
              </p>

              <p 
                className="font-sans font-semibold uppercase mb-4"
                style={{ fontSize: '11px', color: '#7B6FCC', letterSpacing: '0.08em' }}
              >
                EVERYTHING IN FREE +
              </p>

              <div className="flex flex-col gap-4 mb-8">
                {proFeatures.map((feature, index) => (
                  <FeatureItem 
                    key={index} 
                    text={feature.text} 
                    comingSoon={feature.comingSoon}
                    isPro 
                  />
                ))}
              </div>

              {/* Spacer to push button down */}
              <div className="h-6" />

              <a 
                href="/signup"
                onClick={(e) => {
                  e.preventDefault()
                  void handleUpgrade()
                }}
                className="flex items-center justify-center w-full font-sans font-semibold py-3.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: '#1BAE80', color: 'white', fontSize: '14px' }}
              >
                Upgrade
              </a>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F7F5FF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">
            {/* Left Column - Label & Heading */}
            <div className="lg:w-[340px] flex-shrink-0">
              <p 
                className="font-sans font-semibold uppercase mb-3"
                style={{ fontSize: '12px', color: '#1BAE80', letterSpacing: '0.1em' }}
              >
                FAQ
              </p>
              <h2 
                className="font-serif"
                style={{ fontSize: '36px', color: '#231E4A', lineHeight: 1.15 }}
              >
                Frequently asked questions
              </h2>
            </div>

            {/* Right Column - Accordion */}
            <div className="flex-1">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border-b"
                  style={{ borderColor: '#E5E0F5' }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <h3 
                      className="font-sans font-semibold pr-4"
                      style={{ fontSize: '16px', color: '#231E4A' }}
                    >
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      size={20} 
                      className="flex-shrink-0 transition-transform duration-200"
                      style={{ 
                        color: '#7B6FCC',
                        transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>
                  <div 
                    className="overflow-hidden transition-all duration-200"
                    style={{ 
                      maxHeight: openFaqIndex === index ? '200px' : '0',
                      opacity: openFaqIndex === index ? 1 : 0
                    }}
                  >
                    <p 
                      className="font-sans pb-5"
                      style={{ fontSize: '15px', color: '#4A4570', lineHeight: 1.6 }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </main>
    </div>
  )
}

function FeatureItem({ text, comingSoon, isPro }: { text: string; comingSoon?: boolean; isPro?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ 
          width: '22px', 
          height: '22px', 
          background: isPro ? '#C3F0E0' : '#EDE8FF' 
        }}
      >
        {comingSoon ? (
          <Sparkles size={12} style={{ color: isPro ? '#0F6E56' : '#4E4499' }} />
        ) : (
          <Check size={13} style={{ color: isPro ? '#0F6E56' : '#4E4499' }} />
        )}
      </div>
      <span 
        className="font-sans flex-1"
        style={{ fontSize: '14px', color: '#4A4570', minWidth: '180px' }}
      >
        {text}
      </span>
      {comingSoon && (
        <span 
          className="font-sans font-medium px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0"
          style={{ fontSize: '11px', background: '#EDE8FF', color: '#4E4499' }}
        >
          Coming soon
        </span>
      )}
    </div>
  )
}
