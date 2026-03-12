import Link from "next/link"
import {
  ChevronLeft,
  BookOpen,
  Target,
  Palette,
  Layout,
  FileText,
  MessageSquare,
  Package,
  CheckCircle2,
} from "lucide-react"

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Getting Started Guide</h1>
          <p className="text-lg text-gray-600">Learn the basics in just 5 minutes</p>
        </div>

        {/* Guide Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-12">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <Target className="w-6 h-6 text-emerald-600" />
                Create Your First Project
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Click the project selector in the top right and create a new project. Give it a meaningful name that
                reflects your design work. This will be your workspace for organizing all design elements.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-emerald-800">
                  <strong>Tip:</strong> Use descriptive project names like "E-commerce Redesign 2025" or "Brand Identity
                  - Tech Startup" for easy identification.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                Fill Out Project Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Start with the Overview section to define your project goals, target audience, and key deliverables.
                This sets the foundation for your design process and ensures everyone is aligned.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Define clear project goals and objectives</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Identify your target audience and their needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>List key deliverables and success metrics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-600" />
                Build Your Mood Board
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Add visual inspiration, color palettes, and reference websites to establish the design direction and
                aesthetic. Upload images or add website URLs to create a cohesive visual reference.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>Pro Tip:</strong> Include 3-5 reference images and 2-3 competitor websites to create a
                  well-rounded mood board.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <Layout className="w-6 h-6 text-pink-600" />
                Define Your Style Guide
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Create your brand's visual identity by selecting colors, typography, and button styles. This ensures
                consistency across all design elements and provides clear guidelines for implementation.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span>Choose primary and secondary brand colors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span>Select heading and body fonts with appropriate sizes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span>Design button styles for consistent UI components</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                5
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <FileText className="w-6 h-6 text-orange-600" />
                Map Out Site Structure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Plan your website's architecture by adding pages and defining the features that go on each page. Use the
                wireframe canvas to create visual layouts and organize your site's navigation flow.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                6
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-rose-600" />
                Add Content & Copy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Define your brand messaging, key content snippets, and SEO strategy. Include headlines, CTAs, and
                important copy that will be used throughout your website.
              </p>
            </div>
          </div>

          {/* Step 7 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                7
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <Package className="w-6 h-6 text-cyan-600" />
                Upload Design Assets
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Organize all your design assets including logos, icons, images, and graphics. Label them appropriately
                for easy reference and categorization.
              </p>
            </div>
          </div>

          {/* Final Step */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                8
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Generate Your Summary
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once you've completed all sections, navigate to the Summary page to see your comprehensive design brief.
                Export it as a PDF to share with your team or clients.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-emerald-800">
                  <strong>Next Steps:</strong> Your design summary includes all project details, visual references,
                  style guidelines, and technical specifications in one professional document.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Building Your Project
          </Link>
        </div>
      </div>
    </div>
  )
}
