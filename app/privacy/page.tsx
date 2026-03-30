import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Privacy Policy — Troov Studio",
  description: "Privacy Policy for Troov Studio, a design project management platform.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7F5FF]">
      <Navigation />
      
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#231E4A] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#7B6FCC] text-lg">
            Last updated: March 2026
          </p>
        </div>

        {/* Intro */}
        <div className="mb-10">
          <p className="text-[#4A4570] leading-relaxed text-lg">
            Troov Studio (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. By using Troov Studio, you agree to the practices described below.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">1. Information We Collect</h2>
            <p className="text-[#4A4570] leading-relaxed mb-4">
              We collect the following types of information when you use Troov Studio:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4A4570]">
              <li><strong>Account information:</strong> Your name, email address, and password when you register.</li>
              <li><strong>Project data:</strong> Content you create within the platform including project overviews, mood boards, style guides, sitemaps, technical specs, content, assets, and tasks.</li>
              <li><strong>Payment information:</strong> Billing details processed securely through Stripe. We do not store your full card details on our servers.</li>
              <li><strong>Usage data:</strong> Information about how you interact with the platform, including pages visited, features used, and session duration.</li>
              <li><strong>Device information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">2. How We Use Your Information</h2>
            <p className="text-[#4A4570] leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4A4570]">
              <li>Provide, operate, and improve Troov Studio.</li>
              <li>Process payments and manage your subscription.</li>
              <li>Send account-related emails such as receipts, password resets, and important service updates.</li>
              <li>Respond to support requests and enquiries.</li>
              <li>Analyse usage patterns to improve the product experience.</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="text-[#4A4570] leading-relaxed mt-4">
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">3. Data Storage and Security</h2>
            <p className="text-[#4A4570] leading-relaxed">
              Your data is stored securely using Supabase, a cloud database provider with industry-standard security practices. We use encryption in transit (HTTPS) and at rest. While we take reasonable measures to protect your data, no system is completely secure and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">4. Third-Party Services</h2>
            <p className="text-[#4A4570] leading-relaxed mb-4">
              We use the following third-party services to operate Troov Studio:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4A4570]">
              <li><strong>Supabase</strong> — database and authentication</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Vercel</strong> — hosting and deployment</li>
            </ul>
            <p className="text-[#4A4570] leading-relaxed mt-4">
              Each of these services has their own privacy policy and data handling practices. We encourage you to review them.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">5. Cookies</h2>
            <p className="text-[#4A4570] leading-relaxed">
              Troov Studio uses essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies. You can control cookie behaviour through your browser settings, though disabling essential cookies may affect platform functionality.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">6. Your Rights</h2>
            <p className="text-[#4A4570] leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4A4570]">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Object to or restrict certain processing of your data.</li>
              <li>Export your data in a portable format.</li>
            </ul>
            <p className="text-[#4A4570] leading-relaxed mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a 
                href="mailto:contact@troov-marketing.com" 
                className="text-[#4E4499] hover:text-[#3d3578] underline underline-offset-2 transition-colors"
              >
                contact@troov-marketing.com
              </a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">7. Data Retention</h2>
            <p className="text-[#4A4570] leading-relaxed">
              We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or compliance purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-[#4A4570] leading-relaxed">
              Troov Studio is not intended for use by anyone under the age of 16. We do not knowingly collect personal data from children. If you believe a child has provided us with their data, please contact us and we will delete it promptly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">9. Changes to This Policy</h2>
            <p className="text-[#4A4570] leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page and notify you by email if the changes are material. Continued use of Troov Studio after changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-[#231E4A] mb-4">10. Contact Us</h2>
            <p className="text-[#4A4570] leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at{" "}
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
