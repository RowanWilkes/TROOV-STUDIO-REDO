"use client"

import { ChevronDown, ChevronUp, Search, ChevronLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      category: "Getting Started",
      color: "emerald",
      questions: [
        {
          question: "How do I create my first project?",
          answer:
            'Click the project selector in the top right corner of the dashboard and select "Create New Project". Give your project a meaningful name that reflects your design work, such as "Acme Corp Website Redesign". You can create multiple projects to organize different design initiatives.',
        },
        {
          question: "What information should I include in the Project Overview?",
          answer:
            "The Project Overview is your foundation. Include your project goals, target audience demographics, key deliverables, success metrics, timeline (kickoff and deadline dates), budget, and any specific requirements from your client. The more detailed you are here, the better your final summary will be.",
        },
        {
          question: "How long does it take to complete a project?",
          answer:
            "Most users complete a comprehensive design project plan in 30-60 minutes. You can work at your own pace, save your progress, and return anytime. Each section (Overview, Mood Board, Style Guide, etc.) can be completed independently.",
        },
      ],
    },
    {
      category: "Projects & Plans",
      color: "blue",
      questions: [
        {
          question: "How many projects can I create on the free plan?",
          answer:
            "The free plan allows you to create 1 project, which is perfect for trying out DesignFlow. To create unlimited projects and unlock premium features, upgrade to the Pro plan ($19/month) or Professional plan ($49/month) with team collaboration.",
        },
        {
          question: "What happens to my projects if I cancel my subscription?",
          answer:
            "Your data is stored locally in your browser and remains accessible. If you cancel a paid subscription, you'll revert to the free plan and maintain access to 1 project. We recommend exporting your projects as PDFs before downgrading to preserve all your work.",
        },
        {
          question: "Can I switch between projects?",
          answer:
            "Yes! Use the project selector dropdown in the top right corner to switch between all your projects instantly. Your progress in each project is automatically saved.",
        },
        {
          question: "How do I delete a project?",
          answer:
            'In the project selector dropdown, click the three dots next to any project name and select "Delete Project". This action cannot be undone, so make sure to export any important data first.',
        },
      ],
    },
    {
      category: "Features & Functionality",
      color: "purple",
      questions: [
        {
          question: "How do I upload images to my mood board?",
          answer:
            'Navigate to the Mood Board section and click "Upload Image". Select one or multiple images from your computer. Supported formats include JPG, PNG, GIF, and WebP. You can organize images, add descriptions, and create a cohesive visual inspiration collection.',
        },
        {
          question: "Can I customize colors in the Style Guide?",
          answer:
            'The Style Guide section lets you create both standard color palettes and custom colors. Click "Add Color" to define primary, secondary, accent colors with hex codes. You can also preview how colors work together and copy hex codes for easy implementation.',
        },
        {
          question: "How does the Site Structure tool work?",
          answer:
            "The Site Structure section provides a visual sitemap builder. Add pages, define navigation hierarchy, and specify what features/sections go on each page. You can drag to reorganize, add child pages, and build a complete information architecture for your website or app.",
        },
        {
          question: "What's included in the Technical Specs section?",
          answer:
            "Technical Specs covers hosting platform, CMS choice, database requirements, third-party integrations, security requirements, performance goals, browser support, SEO strategy, and accessibility standards. This ensures your development team has all the technical requirements documented.",
        },
        {
          question: "How do I add content and copy?",
          answer:
            "The Content & Copy section lets you define brand messaging, tone of voice, key messages, content snippets, SEO metadata, and content guidelines. Add taglines, value propositions, CTAs, and any copy that will be used throughout your design. This becomes your content source of truth.",
        },
      ],
    },
    {
      category: "Export & Sharing",
      color: "orange",
      questions: [
        {
          question: "Can I export my design summary?",
          answer:
            'Yes! Once all project sections are marked complete, navigate to the Summary view and click "Export to PDF". This generates a professional, print-ready document with all your project details, mood boards, style guides, sitemaps, and specifications formatted beautifully.',
        },
        {
          question: "What does the Client Copy toggle do?",
          answer:
            "The Client Copy toggle (coming soon) will generate a simplified, client-friendly version of your summary that focuses on visual elements and high-level strategy while hiding technical jargon. Perfect for client presentations and stakeholder reviews.",
        },
        {
          question: "Can I share my project with others?",
          answer:
            "Team collaboration features are available on Pro and Professional plans. You can invite team members via email, set permissions, and work on projects together in real-time. Everyone sees the same up-to-date information.",
        },
      ],
    },
    {
      category: "Account & Billing",
      color: "pink",
      questions: [
        {
          question: "How do I upgrade my plan?",
          answer:
            'Click the "Upgrade" button in the sidebar or visit the Pricing page. Choose between Pro ($19/month for unlimited projects) or Professional ($49/month for teams). Complete the secure payment process and your account will be upgraded immediately with no downtime.',
        },
        {
          question: "Can I change my subscription plan?",
          answer:
            "Yes, you can upgrade or downgrade your plan anytime from Settings > View Usage. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period, so you get full value from your current plan.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Absolutely. We use industry-standard encryption and secure payment processing. We never store your full credit card details on our servers. All transactions are processed through certified payment gateways.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied within the first 14 days, contact support for a full refund. After 14 days, subscriptions are non-refundable but you can cancel anytime to prevent future charges.",
        },
      ],
    },
    {
      category: "Troubleshooting",
      color: "red",
      questions: [
        {
          question: "My sections aren't saving. What should I do?",
          answer:
            "DesignFlow saves data in your browser's local storage. If sections aren't saving, check that your browser allows local storage and isn't in private/incognito mode. Try refreshing the page or clearing your browser cache. Contact support if the issue persists.",
        },
        {
          question: "Why can't I see the Summary?",
          answer:
            'The Summary becomes available only when all 7 project sections are marked complete (Overview, Mood Board, Style Guide, Site Structure, Technical Specs, Content & Copy, and Assets). Check each section and click "Mark as Complete" when finished.',
        },
        {
          question: "Images aren't uploading. Help!",
          answer:
            "Ensure your images are under 10MB and in supported formats (JPG, PNG, GIF, WebP). Check your internet connection. If using Safari, try Chrome or Firefox as some browsers have stricter upload restrictions. Clear browser cache if issues continue.",
        },
        {
          question: "How do I reset a section?",
          answer:
            "Currently, you need to manually clear content in each section. There's no one-click reset to prevent accidental data loss. If you want to start fresh, consider creating a new project and archiving the old one.",
        },
      ],
    },
  ]

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
      blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
      orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
      pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
      red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Find answers to common questions about DesignFlow</p>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-12">
          {filteredCategories.map((category, categoryIndex) => {
            const colors = getColorClasses(category.color)
            return (
              <div key={categoryIndex}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} mb-6`}>
                  <h2 className={`text-xl font-semibold ${colors.text}`}>{category.category}</h2>
                  <span className={`text-sm ${colors.text} opacity-60`}>({category.questions.length})</span>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const globalIndex = categoryIndex * 100 + index
                    const isOpen = openIndex === globalIndex

                    return (
                      <div key={index} className={`bg-white rounded-xl border ${colors.border} overflow-hidden`}>
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 text-left">{faq.question}</h3>
                          {isOpen ? (
                            <ChevronUp className={`size-5 ${colors.text} flex-shrink-0 ml-4`} />
                          ) : (
                            <ChevronDown className={`size-5 ${colors.text} flex-shrink-0 ml-4`} />
                          )}
                        </button>
                        {isOpen && (
                          <div className={`px-6 py-4 ${colors.bg} border-t ${colors.border}`}>
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-lg text-gray-600 mb-6">Our support team is here to assist you with any questions</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Email Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
