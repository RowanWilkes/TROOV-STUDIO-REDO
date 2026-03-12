import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPolicyPage() {
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
                Privacy Policy
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
                  Troov Studio ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. By using Troov Studio, you agree to the practices described below.
                </p>
              </div>

              <Section title="1. Information We Collect">
                <p>We collect the following types of information when you use Troov Studio:</p>
                <ul>
                  <li><strong>Account information:</strong> Your name, email address, and password when you register.</li>
                  <li><strong>Project data:</strong> Content you create within the platform including project overviews, mood boards, style guides, sitemaps, technical specs, content, assets, and tasks.</li>
                  <li><strong>Payment information:</strong> Billing details processed securely through Stripe. We do not store your full card details on our servers.</li>
                  <li><strong>Usage data:</strong> Information about how you interact with the platform, including pages visited, features used, and session duration.</li>
                  <li><strong>Device information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
                </ul>
              </Section>

              <Section title="2. How We Use Your Information">
                <p>We use your information to:</p>
                <ul>
                  <li>Provide, operate, and improve Troov Studio.</li>
                  <li>Process payments and manage your subscription.</li>
                  <li>Send account-related emails such as receipts, password resets, and important service updates.</li>
                  <li>Respond to support requests and enquiries.</li>
                  <li>Analyse usage patterns to improve the product experience.</li>
                  <li>Comply with legal obligations.</li>
                </ul>
                <p>We do not sell your personal data to third parties.</p>
              </Section>

              <Section title="3. Data Storage and Security">
                <p>
                  Your data is stored securely using Supabase, a cloud database provider with industry-standard security practices. We use encryption in transit (HTTPS) and at rest. While we take reasonable measures to protect your data, no system is completely secure and we cannot guarantee absolute security.
                </p>
              </Section>

              <Section title="4. Third-Party Services">
                <p>We use the following third-party services to operate Troov Studio:</p>
                <ul>
                  <li><strong>Supabase</strong> — database and authentication</li>
                  <li><strong>Stripe</strong> — payment processing</li>
                  <li><strong>Vercel</strong> — hosting and deployment</li>
                </ul>
                <p>Each of these services has their own privacy policy and data handling practices. We encourage you to review them.</p>
              </Section>

              <Section title="5. Cookies">
                <p>
                  Troov Studio uses essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies. You can control cookie behaviour through your browser settings, though disabling essential cookies may affect platform functionality.
                </p>
              </Section>

              <Section title="6. Your Rights">
                <p>Depending on your location, you may have the right to:</p>
                <ul>
                  <li>Access the personal data we hold about you.</li>
                  <li>Request correction of inaccurate data.</li>
                  <li>Request deletion of your account and associated data.</li>
                  <li>Object to or restrict certain processing of your data.</li>
                  <li>Export your data in a portable format.</li>
                </ul>
                <p>To exercise any of these rights, please contact us at <a href="mailto:contact@troov-marketing.com" className="text-emerald-600 hover:underline">contact@troov-marketing.com</a>.</p>
              </Section>

              <Section title="7. Data Retention">
                <p>
                  We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or compliance purposes.
                </p>
              </Section>

              <Section title="8. Children's Privacy">
                <p>
                  Troov Studio is not intended for use by anyone under the age of 16. We do not knowingly collect personal data from children. If you believe a child has provided us with their data, please contact us and we will delete it promptly.
                </p>
              </Section>

              <Section title="9. Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page and notify you by email if the changes are material. Continued use of Troov Studio after changes constitutes your acceptance of the updated policy.
                </p>
              </Section>

              <Section title="10. Contact Us">
                <p>
                  If you have any questions about this Privacy Policy or how we handle your data, please contact us at <a href="mailto:contact@troov-marketing.com" className="text-emerald-600 hover:underline">contact@troov-marketing.com</a>.
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

