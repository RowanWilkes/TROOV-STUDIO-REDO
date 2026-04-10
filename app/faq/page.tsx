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
          question: "How do I create my first project in Troov Studio?",
          answer: "Click the project selector in the top right corner of the dashboard and select 'Create New Project'. Give it a name — usually the client's business name works best, like 'Bloom Florist Rebrand'. Your project comes pre-loaded with all 8 sections ready to fill in.",
        },
        {
          question: "What is the recommended order to fill in project sections?",
          answer: "Start by sending your client the content link from the Handoff section — their answers give you the brief before you touch anything. Once you receive their submission and accept the content, fill in the Mood Board and Style Guide using their direction, then map out the Sitemap, add Technical Specs, and complete Content and Assets last.",
        },
        {
          question: "How do I send my client a content collection form?",
          answer: "Go to the Handoff & Export section in your project sidebar and click 'Generate client link'. You can optionally enter your client's email address. Share the link with your client — they fill in their business info, brand colours, logo, inspiration sites and more. You get notified when they submit, then review and accept each field from the client review page.",
        },
        {
          question: "What information does the client fill in through the content link?",
          answer: "The client form collects their business name, project goals, target audience, primary call to action, launch date, brand colours (primary, secondary, accent), font preferences, tagline, mission statement, style notes, website inspiration links with notes, logo upload, and other brand asset files. Everything maps directly into the relevant sections of your project.",
        },
        {
          question: "How long does it take to set up a project?",
          answer: "Sending the client link takes less than a minute. Once the client submits, accepting their content takes around 5 to 10 minutes. From there, completing the remaining sections like the Mood Board, Style Guide and Sitemap typically takes 20 to 40 minutes depending on how detailed you want to be.",
        },
        {
          question: "Can I use Troov Studio without sending a client form?",
          answer: "Absolutely. The client content link is optional. You can fill in every section manually yourself if you prefer to gather information through your own discovery process and then enter it directly.",
        },
        {
          question: "What is the Getting Started guide?",
          answer: "The Getting Started guide at troovstudio.com/getting-started walks you through the full recommended workflow — from creating your project and sending the client link through to reviewing their submission, completing your project sections, and exporting to Figma. It takes about 5 minutes to read.",
        },
      ],
    },
    {
      category: "Client Content Link",
      color: "purple",
      questions: [
        {
          question: "What is the client content link?",
          answer: "The client content link is a unique shareable URL you generate from the Handoff section. When your client opens it, they see a clean multi-step form asking for their business details, brand direction, logo, inspiration sites and more. Their answers populate directly into your Troov Studio project once you review and accept them.",
        },
        {
          question: "Does my client need to create a Troov Studio account?",
          answer: "No. The client form is completely public-facing. Your client just opens the link in their browser and fills it in — no account, no login, no app to install.",
        },
        {
          question: "What happens after my client submits the form?",
          answer: "You receive an email notification that your client has submitted. You then go to the client review page inside your project, where you can see every field they filled in. You can accept or decline each field individually. Accepted fields automatically populate into the correct sections — colours go to the Style Guide, inspiration sites go to the Mood Board, logo goes to Assets, and so on.",
        },
        {
          question: "Can I review and reject individual fields from the client submission?",
          answer: "Yes. The review page shows every field your client submitted. You can accept fields you are happy with and decline ones that are incorrect or incomplete. Declined fields can have a note attached so you can follow up with your client on what you need instead.",
        },
        {
          question: "Can I regenerate the client link if it expires?",
          answer: "Yes. You can generate a new link from the Handoff section at any time. Links can also be toggled off if you no longer want the form to be accessible.",
        },
        {
          question: "What file types can clients upload?",
          answer: "Clients can upload PNG, JPG, JPEG, WebP, SVG and PDF files for logos and brand assets. Inspiration screenshots can be uploaded as PNG, JPG, JPEG or WebP.",
        },
      ],
    },
    {
      category: "Mood Board",
      color: "pink",
      questions: [
        {
          question: "How do I add images to my Mood Board?",
          answer: "In the Mood Board section, click 'Upload image' to add inspiration screenshots directly from your computer. You can also add website reference links — paste a URL and add an optional note about what you like about that site. If your client submitted inspiration sites via the content link, those automatically appear here once accepted.",
        },
        {
          question: "What is the difference between images and website references on the Mood Board?",
          answer: "Images are uploaded files — screenshots of designs, photography, UI examples, colour palettes. Website references are saved URLs with optional notes, so you and your client can click through to live sites during the project. Both types export into the Figma mood board frame.",
        },
        {
          question: "How many images can I upload to the Mood Board?",
          answer: "There is no hard limit on mood board images. Upload as many as you need to communicate the visual direction of the project.",
        },
        {
          question: "Can I add notes to website references?",
          answer: "Yes. When adding a website reference you can include a note explaining what you or the client likes about that site — for example 'love the navigation style' or 'the colour palette is the right direction'. These notes display under the link in the mood board and are included in the Figma export.",
        },
      ],
    },
    {
      category: "Style Guide",
      color: "blue",
      questions: [
        {
          question: "What does the Style Guide section include?",
          answer: "The Style Guide lets you define your full visual design system — colour palette (primary, secondary, accent and any custom colours), typography (heading and body fonts with sizes and weights), and button styles. Each element includes a live website preview so you can see exactly how it will look on a real site.",
        },
        {
          question: "How do I add colours to the Style Guide?",
          answer: "In the Style Guide section, click the colour swatch to open the colour picker or type in a hex code directly. You can add primary, secondary and accent colours plus any number of custom palette colours. If your client submitted brand colours via the content link, those populate automatically once accepted.",
        },
        {
          question: "Can I set custom fonts in the Style Guide?",
          answer: "Yes. The typography section lets you choose heading and body fonts, set sizes, weights and line heights. You can type in any Google Font name and see a live preview of how it renders on a website.",
        },
        {
          question: "Does the Style Guide export to Figma?",
          answer: "Yes. When you export to Figma (Pro feature), all colours from your Style Guide become named Figma colour styles, and all typography becomes named Figma text styles. They appear in the right-hand panel in Figma ready to apply to any element, just like you would set them up manually.",
        },
      ],
    },
    {
      category: "Sitemap",
      color: "teal",
      questions: [
        {
          question: "How does the Sitemap section work?",
          answer: "The Sitemap section lets you plan your full website architecture. Add pages, name them, and assign section blocks to each page from a library of 35+ pre-designed page sections. This gives you and your client a clear picture of the site structure before any design work begins.",
        },
        {
          question: "What are section blocks in the Sitemap?",
          answer: "Section blocks are pre-defined website sections you can assign to each page — things like Hero, About, Services, Testimonials, Contact Form, Footer and more. Choosing them for each page helps scope the project accurately and communicates to developers exactly what each page needs to contain.",
        },
        {
          question: "Does the Sitemap connect to the Figma export?",
          answer: "Yes. Every page you add to your Sitemap becomes a dedicated page inside your exported Figma file. So if your sitemap has Home, About, Services and Contact, your Figma file will have four pages ready and named for you to start designing on immediately.",
        },
      ],
    },
    {
      category: "Technical Specs",
      color: "gray",
      questions: [
        {
          question: "What goes in the Technical Specs section?",
          answer: "Technical Specs is where you document all the non-visual requirements of the project — hosting platform, CMS choice (Webflow, WordPress, Shopify etc), third-party integrations, performance targets, browser support, accessibility requirements, SEO technical requirements, and any custom development notes.",
        },
        {
          question: "Who is the Technical Specs section for?",
          answer: "It is primarily for developer handoff — giving whoever builds the site a clear technical brief without needing a separate document. It is also useful during client discovery to make sure expectations are aligned on platform and technical constraints before design begins.",
        },
      ],
    },
    {
      category: "Handoff & Export",
      color: "orange",
      questions: [
        {
          question: "What can I export from Troov Studio?",
          answer: "You can export a PDF project brief (full project summary with goals, style guide, sitemap and specs), CSS variables (your colour palette and typography as ready-to-use CSS custom properties), and a JSON file of your full project data for use in any other tool or platform. The Figma export (Pro feature) creates a fully scaffolded Figma file.",
        },
        {
          question: "What is the Figma export and how does it work?",
          answer: "The Figma export is a Pro feature that creates a ready-to-design Figma file from your Troov Studio project. You install the Troov Studio plugin in Figma once from the Figma Community, then paste your project export token. The plugin builds your file automatically — colour styles, text styles, one page per sitemap page, a mood board frame, a style guide frame and a project brief frame.",
        },
        {
          question: "What does the Figma export actually create inside Figma?",
          answer: "The plugin creates: named colour styles for every colour in your palette, named text styles for every typography setting, one Figma page for each page in your sitemap, a Mood Board page with your inspiration images arranged in a grid, a Style Guide reference frame with swatches and type samples, and a Brief page with your project goals and client info laid out as readable text.",
        },
        {
          question: "Do I need to install anything to use the Figma export?",
          answer: "You need to install the Troov Studio plugin from the Figma Community once — it takes about 30 seconds. After that, open any Figma file, run the plugin, paste your project token, and the file is built automatically. You never need to install it again.",
        },
        {
          question: "Is the Figma export available on the free plan?",
          answer: "The Figma export is a Pro feature. The PDF export, CSS variables and JSON export are available on all plans including free.",
        },
        {
          question: "What is the CSS variables export?",
          answer: "The CSS variables export generates a ready-to-use CSS file with all your colours and typography defined as CSS custom properties (variables). A developer can drop this file straight into a project and immediately have access to the full design system without manually transcribing hex codes or font sizes.",
        },
        {
          question: "What does the PDF project brief include?",
          answer: "The PDF export includes your project name and goals, client details, target audience, key deliverables, timeline, mood board visuals, full style guide (colours, typography, buttons), sitemap structure, content overview, technical specifications, and asset list. It is formatted professionally and ready to send to clients or developers.",
        },
      ],
    },
    {
      category: "Projects & Plans",
      color: "blue",
      questions: [
        {
          question: "How many projects can I create on the free plan?",
          answer: "The free plan gives you 1 active project with full access to all 8 sections, PDF export, and the client content link. To run multiple client projects simultaneously, upgrade to Pro for unlimited projects.",
        },
        {
          question: "What is included in the Pro plan?",
          answer: "Pro gives you unlimited projects, unlimited PDF exports, the Figma export feature, the client content link and review workflow, and priority support. It is $10 per month (or $8 per month billed annually).",
        },
        {
          question: "Is there a free trial of the Pro plan?",
          answer: "The free plan itself acts as a permanent trial — you get full access to all features on your first project with no time limit and no credit card required. Upgrade to Pro when you need to run more than one project.",
        },
        {
          question: "What happens to my data if I downgrade from Pro to free?",
          answer: "Your data is never deleted. All your projects are preserved. If you downgrade to the free plan, you can only actively work on 1 project at a time, but all your other project data remains safe and accessible.",
        },
        {
          question: "Can I cancel my subscription at any time?",
          answer: "Yes. You can cancel from Settings at any time. Your Pro access continues until the end of your current billing period. There are no cancellation fees. We also offer a 14-day money-back guarantee if you are not satisfied.",
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes. We offer a 14-day money-back guarantee on all paid plans. Contact us at contact@troov-marketing.com within 14 days of your payment and we will process a full refund.",
        },
        {
          question: "Is Troov Studio built for Australian designers?",
          answer: "Yes. Troov Studio is built and based in Australia. Pricing is available in AUD and invoices include GST and ABN details where applicable, making it straightforward for Australian freelancers and studios.",
        },
      ],
    },
    {
      category: "Troubleshooting",
      color: "red",
      questions: [
        {
          question: "My client submitted the form but I cannot see their content. What do I do?",
          answer: "Go to the Handoff section in your project and scroll down to the Client Content Link card. If the status shows 'Submitted', click through to the review page. If the submission is not appearing, try refreshing the page. If the issue persists, contact support at contact@troov-marketing.com.",
        },
        {
          question: "Images are not uploading to my Mood Board. What should I do?",
          answer: "Check that your image is under 10MB and is a supported format (PNG, JPG, JPEG, WebP). Try refreshing the page and uploading again. If the issue continues, clear your browser cache or try a different browser and contact support if it persists.",
        },
        {
          question: "My section progress is not updating correctly.",
          answer: "Section completion is calculated automatically based on the fields you have filled in. If a section is not showing as complete when you expect it to, try refreshing the page. If a section has a manual 'Mark as complete' toggle, make sure that is enabled. Contact support if the issue continues.",
        },
        {
          question: "The CSS variables or JSON export is downloading an empty file.",
          answer: "This usually means the relevant sections (Style Guide for CSS variables, or all sections for JSON) have not been filled in yet. Add at least one colour to your Style Guide and try the CSS export again. For JSON, make sure at least one section has content saved.",
        },
        {
          question: "I am not receiving email notifications when my client submits.",
          answer: "Check your spam or junk folder first — notification emails can occasionally land there. Make sure the email address on your Troov Studio account is correct in your account settings. If you still are not receiving emails, contact support at contact@troov-marketing.com.",
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
          <p className="text-lg text-gray-600">Find answers to common questions about Troov Studio</p>

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
      </div>
    </div>
  )
}
