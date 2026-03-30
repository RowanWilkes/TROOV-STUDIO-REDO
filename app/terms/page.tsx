import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms of Service — Troov Studio",
  description: "Terms of Service for Troov Studio, a design project management platform.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5FF]">
      <Navigation />
      
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#231E4A] mb-4">
            Terms of Service
          </h1>
          <p className="text-[#7B6FCC] text-lg">
            Last updated: March 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">1. About Troov Studio</h2>
            <p className="text-[#4A4570] leading-relaxed">
              Troov Studio is a design project management platform that helps web designers, freelancers, and agencies plan, organise, and document their design projects. We provide tools for mood boards, style guides, sitemaps, technical specs, content planning, asset management, and PDF export.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">2. Eligibility</h2>
            <p className="text-[#4A4570] leading-relaxed">
              You must be at least 16 years old to use Troov Studio. By using our platform, you confirm that you meet this requirement. If you are using Troov Studio on behalf of a business or organisation, you confirm that you have authority to bind that entity to these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">3. Your Account</h2>
            <p className="text-[#4A4570] leading-relaxed">
              You are responsible for maintaining the security of your account credentials. You must provide accurate and complete information when registering. You are responsible for all activity that occurs under your account. You must notify us immediately if you suspect unauthorised access. We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">4. Subscription Plans and Billing</h2>
            <p className="text-[#4A4570] leading-relaxed">
              Troov Studio offers a Free Plan (1 project, 1 team member, all core features, no credit card required) and a Pro Plan (unlimited projects, unlimited team members, unlimited PDF exports, priority support, billed monthly or annually). Paid subscriptions are billed in advance and processed securely through Stripe. Prices are listed in USD and may be subject to local taxes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">5. Cancellations and Refunds</h2>
            <p className="text-[#4A4570] leading-relaxed">
              You may cancel your subscription at any time from your account settings. Cancellations take effect at the end of your current billing period. We offer a 14-day money-back guarantee on all paid plans. After 14 days, payments are non-refundable. Downgrading from Pro to Free will limit your account to 1 project. Existing project data is not deleted.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">6. Acceptable Use</h2>
            <p className="text-[#4A4570] leading-relaxed">
              You agree not to use Troov Studio to violate any laws, upload harmful or illegal content, attempt unauthorised access, reverse engineer the platform, use automated scraping tools, or resell access without written permission. We reserve the right to suspend or terminate accounts that violate these rules.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">7. Your Content</h2>
            <p className="text-[#4A4570] leading-relaxed">
              You retain ownership of all content you create and upload to Troov Studio. By using the platform, you grant us a limited licence to store, process, and display your content solely to provide the service to you. You are responsible for ensuring you have the rights to any content you upload.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">8. Intellectual Property</h2>
            <p className="text-[#4A4570] leading-relaxed">
              Troov Studio, including its design, code, branding, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of Troov Studio without our explicit written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">9. Availability and Modifications</h2>
            <p className="text-[#4A4570] leading-relaxed">
              We aim to keep Troov Studio available at all times but cannot guarantee uninterrupted access. We reserve the right to modify, discontinue, or change pricing for features at any time with reasonable notice provided via email or in-app notification.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-[#4A4570] leading-relaxed">
              Troov Studio is provided &quot;as is&quot; without warranties of any kind. We do not warrant that the platform will be error-free, secure, or meet your specific requirements. Use of the platform is at your own risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">11. Limitation of Liability</h2>
            <p className="text-[#4A4570] leading-relaxed">
              To the fullest extent permitted by law, Troov Studio and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the 12 months prior to the claim.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">12. Governing Law</h2>
            <p className="text-[#4A4570] leading-relaxed">
              These Terms are governed by the laws of Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Australia.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">13. Changes to These Terms</h2>
            <p className="text-[#4A4570] leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes by email or via an in-app notice. Continued use of Troov Studio after changes are posted constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">14. Contact Us</h2>
            <p className="text-[#4A4570] leading-relaxed">
              If you have any questions about these Terms, please contact us at{" "}
              <a 
                href="mailto:contact@troov-marketing.com" 
                className="text-[#4E4499] hover:text-[#3d3578] underline underline-offset-2 transition-colors"
              >
                contact@troov-marketing.com
              </a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
