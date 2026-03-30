import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { LogoStrip } from "@/components/logo-strip"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FreelancersSection } from "@/components/freelancers-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <LogoStrip />
      <FeaturesSection />
      <TestimonialsSection />
      <FreelancersSection />
      <CTASection />
      <Footer />
    </main>
  )
}
