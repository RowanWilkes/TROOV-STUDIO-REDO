import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsOfServicePage() {
  const lastUpdated = "4 March 2026"

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003A33] via-primary to-[#002724]"></div>
      </div>

      <div className="relative z-10">
        <SiteHeader />

        {/* Hero */}
        <section className="pt-32 lg:pt-40 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-5xl lg:text-6xl font-semibold text-white tracking-tight">
                Terms of Service
              </h1>
              <p className="text-white/60 text-base">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-10 lg:p-14 space-y-10">

              <div className="space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  Welcome to Troov Studio. These Terms of Service ("Terms") govern your access to and use of the Troov Studio platform and services. By creating an account or using Troov Studio, you agree to be bound by these Terms. Please read them carefully.
                </p>
              </div>

              <Section title="1. About Troov Studio">
                <p>
                  Troov Studio is a design project management platform that helps web designers, freelancers, and agencies plan, organise, and document their design projects. We provide tools for mood boards, style guides, sitemaps, technical specs, content planning, asset management, and PDF export.
                </p>
              </Section>

              <Section title="2. Eligibility">
                <p>
                  You must be at least 16 years old to use Troov Studio. By using our platform, you confirm that you meet this requirement. If you are using Troov Studio on behalf of a business or organisation, you confirm that you have authority to bind that entity to these Terms.
                </p>
              </Section>

              <Section title="3. Your Account">
                <ul>
                  <li>You are responsible for maintaining the security of your account credentials.</li>
                  <li>You must provide accurate and complete information when registering.</li>
                  <li>You are responsible for all activity that occurs under your account.</li>
                  <li>You must notify us immediately if you suspect unauthorised access to your account.</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                </ul>
              </Section>

              <Section title="4. Subscription Plans and Billing">
                <p>Troov Studio offers the following plans:</p>
                <ul>
                  <li><strong>Free Plan:</strong> 1 project, 1 team member, access to all core features. No credit card required.</li>
                  <li><strong>Pro Plan:</strong> Unlimited projects, unlimited team members, unlimited PDF exports, priority support. Billed monthly or annually.</li>
                </ul>
                <p>
                  Paid subscriptions are billed in advance on a monthly or annual basis. All payments are processed securely through Stripe. By providing payment details, you authorise us to charge your payment method for the applicable subscription fee.
                </p>
                <p>
                  Prices are listed in USD and may be subject to taxes depending on your location.
                </p>
              </Section>

              <Section title="5. Cancellations and Refunds">
                <ul>
                  <li>You may cancel your subscription at any time from your account settings.</li>
                  <li>Cancellations take effect at the end of your current billing period. You retain access to Pro features until then.</li>
                  <li>We offer a 14-day money-back guarantee on all paid plans. If you are not satisfied within the first 14 days of your first paid subscription, contact us for a full refund.</li>
                  <li>After 14 days, subscription payments are non-refundable.</li>
                  <li>Downgrading from Pro to Free will limit your account to 1 project at the end of your billing period. Existing project data is not deleted.</li>
                </ul>
              </Section>

              <Section title="6. Acceptable Use">
                <p>You agree not to use Troov Studio to:</p>
                <ul>
                  <li>Violate any applicable laws or regulations.</li>
                  <li>Upload or share content that is illegal, harmful, offensive, or infringes third-party rights.</li>
                  <li>Attempt to gain unauthorised access to any part of the platform or other users' accounts.</li>
                  <li>Reverse engineer, decompile, or attempt to extract the source code of Troov Studio.</li>
                  <li>Use automated tools or scripts to scrape or abuse the platform.</li>
                  <li>Resell or sublicense access to the platform without our written permission.</li>
                </ul>
                <p>We reserve the right to suspend or terminate your account if we determine you have violated these rules.</p>
              </Section>

              <Section title="7. Your Content">
                <p>
                  You retain ownership of all content you create and upload to Troov Studio. By using the platform, you grant us a limited licence to store, process, and display your content solely for the purpose of providing the service to you.
                </p>
                <p>
                  You are responsible for ensuring you have the rights to any content you upload, including images, text, and other assets.
                </p>
              </Section>

              <Section title="8. Intellectual Property">
                <p>
                  Troov Studio, including its design, code, branding, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of Troov Studio without our explicit written permission.
                </p>
              </Section>

              <Section title="9. Availability and Modifications">
                <p>
                  We aim to keep Troov Studio available at all times but cannot guarantee uninterrupted access. We may carry out maintenance, updates, or modifications at any time. We will endeavour to provide advance notice of significant downtime where possible.
                </p>
                <p>
                  We reserve the right to modify, discontinue, or change pricing for features at any time. We will provide reasonable notice of material changes via email or in-app notification.
                </p>
              </Section>

              <Section title="10. Disclaimer of Warranties">
                <p>
                  Troov Studio is provided "as is" without warranties of any kind, whether express or implied. We do not warrant that the platform will be error-free, secure, or meet your specific requirements. Use of the platform is at your own risk.
                </p>
              </Section>

              <Section title="11. Limitation of Liability">
                <p>
                  To the fullest extent permitted by law, Troov Studio and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to loss of data, profits, or business opportunities.
                </p>
                <p>
                  Our total liability to you for any claims arising from these Terms or your use of the platform shall not exceed the amount you paid us in the 12 months prior to the claim.
                </p>
              </Section>

              <Section title="12. Governing Law">
                <p>
                  These Terms are governed by and construed in accordance with the laws of Australia. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Australia.
                </p>
              </Section>

              <Section title="13. Changes to These Terms">
                <p>
                  We may update these Terms from time to time. We will notify you of material changes by email or via an in-app notice. Continued use of Troov Studio after changes are posted constitutes acceptance of the updated Terms.
                </p>
              </Section>

              <Section title="14. Contact Us">
                <p>
                  If you have any questions about these Terms, please contact us at <a href="mailto:legal@troovstudio.com" className="text-emerald-600 hover:underline">legal@troovstudio.com</a>.
                </p>
              </Section>

            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-2">
        {children}
      </div>
    </div>
  )
}

