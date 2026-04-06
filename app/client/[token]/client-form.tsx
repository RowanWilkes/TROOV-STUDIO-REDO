"use client"

import { useState, useRef } from "react"

type SitemapPage = { id: string; name: string; path?: string }
type FormField = {
  key: string
  label: string
  type: "text" | "longtext" | "file" | "color"
  hint?: string
  accept?: string
  multiple?: boolean
  placeholder?: string
}
type FormStep = {
  id: string
  title: string
  subtitle: string
  fields: FormField[]
}
type PageSelection = { id: string; name: string; isCustom?: boolean }
type Props = {
  token: string
  projectId: string
  projectName: string
  pages: SitemapPage[]
  alreadySubmitted: boolean
}

function buildSteps(pages: SitemapPage[], selectedPages: PageSelection[]): FormStep[] {
  const steps: FormStep[] = []

  steps.push({
    id: "business",
    title: "About Your Business",
    subtitle: "Help your designer understand who you are and what you want to achieve.",
    fields: [
      { key: "business_name", label: "Business Name", type: "text", placeholder: "e.g. Darren's Electrical", hint: "Your trading name as it should appear on the site." },
      { key: "business_description", label: "What does your business do?", type: "longtext", placeholder: "Brief description of your products or services.", hint: "2–3 sentences is perfect." },
      { key: "project_goal", label: "What is the main goal of this website?", type: "longtext", placeholder: "e.g. Generate leads, sell products online, build credibility...", hint: "What do you want visitors to do or feel?" },
      { key: "target_audience", label: "Who is your target customer?", type: "longtext", placeholder: "e.g. Homeowners in Melbourne aged 30–55 who need electrical work.", hint: "Describe your ideal client in a sentence or two." },
      { key: "primary_action", label: "What is the #1 action you want visitors to take?", type: "text", placeholder: "e.g. Book a free quote, Call us, Shop now", hint: "The single most important button or action on the site." },
    ],
  })

  steps.push({
    id: "style",
    title: "Brand & Style",
    subtitle: "Give your designer a feel for the look you're after. Skip anything you don't have yet.",
    fields: [
      { key: "brand_primary_color", label: "Primary Brand Colour", type: "color", hint: "Your main brand colour. Click the swatch to pick or type a hex code." },
      { key: "brand_secondary_color", label: "Secondary Colour", type: "color", hint: "A supporting colour — optional." },
      { key: "brand_accent_color", label: "Accent Colour", type: "color", hint: "Used for buttons or highlights — optional." },
      { key: "font_preference", label: "Font Style Preference", type: "text", placeholder: "e.g. Clean and modern, Bold and strong, Elegant and minimal", hint: "Describe the feel of font that suits your brand." },
      { key: "brands_admired", label: "Websites or brands you admire", type: "longtext", placeholder: "e.g. apple.com, Nike — I like clean layouts with bold imagery", hint: "Paste URLs or describe what you like about them." },
      { key: "style_notes", label: "Any other style notes for your designer?", type: "longtext", placeholder: "e.g. Avoid dark backgrounds. Keep it professional but friendly.", hint: "Anything else that helps set the visual direction." },
    ],
  })

  // Page selection step is rendered separately (not as a FormStep with fields)
  // so we only add it as a sentinel to track step count
  steps.push({
    id: "page_selection",
    title: "Your Website Pages",
    subtitle: "Tell your designer which pages your website needs.",
    fields: [],
  })

  // Per-page content steps — use selectedPages if available, else fall back to sitemap pages
  const pagesToUse = selectedPages.length > 0 ? selectedPages : pages.length > 0 ? pages : [{ id: "home", name: "Home" }]
  pagesToUse.forEach((page) => {
    steps.push({
      id: `page_${page.id}`,
      title: `${page.name} Page`,
      subtitle: `Provide the copy for your ${page.name} page. Leave anything blank you don't have ready.`,
      fields: [
        { key: `${page.id}__headline`, label: "Main Headline", type: "text", placeholder: "The first big text visitors see on this page.", hint: "Keep it short and punchy — one strong sentence." },
        { key: `${page.id}__subheadline`, label: "Subheadline", type: "text", placeholder: "A supporting line beneath the headline.", hint: "1–2 sentences that expand on the headline." },
        { key: `${page.id}__body`, label: "Body Copy", type: "longtext", placeholder: "The main written content for this page.", hint: "Paste your copy or write it fresh. Can be rough — your designer will work with it." },
        { key: `${page.id}__cta`, label: "Call to Action Button", type: "text", placeholder: 'e.g. "Get a Free Quote", "Shop Now", "Contact Us"', hint: "What should the main button on this page say?" },
        { key: `${page.id}__image`, label: "Page Image", type: "file", accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp", hint: "A photo or image for this page — PNG, JPG, WebP, max 10MB." },
      ],
    })
  })

  steps.push({
    id: "assets",
    title: "Files & Assets",
    subtitle: "Upload your logo and any brand files. You can always come back and add more later.",
    fields: [
      { key: "logo", label: "Logo", type: "file", accept: "image/png,image/svg+xml,image/jpeg", hint: "PNG or SVG preferred — max 5MB." },
      { key: "brand_assets", label: "Other Brand Files", type: "file", multiple: true, accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml", hint: "Photos, icons, product shots — you can select multiple files at once." },
    ],
  })

  return steps
}

export function ClientForm({ token, projectName, pages, alreadySubmitted }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isReview, setIsReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(alreadySubmitted)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [textValues, setTextValues] = useState<Record<string, string>>({})
  const [colorValues, setColorValues] = useState<Record<string, string>>({})
  const [fileValues, setFileValues] = useState<Record<string, File | null>>({})
  const [multiFiles, setMultiFiles] = useState<Record<string, File[]>>({})
  const [selectedPages, setSelectedPages] = useState<PageSelection[]>([{ id: "home", name: "Home" }])
  const [customPageInput, setCustomPageInput] = useState("")
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const steps = buildSteps(pages, selectedPages)
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  function handleText(key: string, value: string) { setTextValues((p) => ({ ...p, [key]: value })) }
  function handleColor(key: string, value: string) { setColorValues((p) => ({ ...p, [key]: value })) }
  function handleFile(key: string, file: File | null) { setFileValues((p) => ({ ...p, [key]: file })) }
  function handleMultiFiles(key: string, files: FileList | null) {
    if (!files) return
    setMultiFiles((p) => ({ ...p, [key]: [...(p[key] ?? []), ...Array.from(files)] }))
  }
  function removeMultiFile(key: string, index: number) {
    setMultiFiles((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }))
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch(`/api/client/${token}/upload`, { method: "POST", body: fd })
    if (!res.ok) return null
    const data = await res.json()
    return data.url ?? null
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      type FieldPayload = {
        fieldKey: string
        fieldLabel: string
        fieldType: "text" | "longtext" | "file" | "color"
        pageName: string | null
        stepId: string
        textValue: string | null
        colorValue: string | null
        fileUrl: string | null
        isBlank: boolean
      }
      const fields: FieldPayload[] = []

      for (const s of steps) {
        const isPageStep = s.id.startsWith("page_")
        const pageName = isPageStep ? s.title.replace(" Page", "") : null

        for (const field of s.fields) {
          if (field.type === "file" && field.multiple) {
            const files = multiFiles[field.key] ?? []
            if (files.length > 0) {
              for (let i = 0; i < files.length; i++) {
                const url = await uploadFile(files[i])
                fields.push({ fieldKey: `${field.key}_${i}`, fieldLabel: field.label, fieldType: "file", pageName, stepId: s.id, textValue: null, colorValue: null, fileUrl: url, isBlank: url === null })
              }
            } else {
              fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: "file", pageName, stepId: s.id, textValue: null, colorValue: null, fileUrl: null, isBlank: true })
            }
          } else if (field.type === "file") {
            const file = fileValues[field.key] ?? null
            const url = file ? await uploadFile(file) : null
            fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: "file", pageName, stepId: s.id, textValue: null, colorValue: null, fileUrl: url, isBlank: url === null })
          } else if (field.type === "color") {
            const val = colorValues[field.key] ?? ""
            fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: "color", pageName, stepId: s.id, textValue: null, colorValue: val || null, fileUrl: null, isBlank: !val })
          } else {
            const val = textValues[field.key] ?? ""
            fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: field.type, pageName, stepId: s.id, textValue: val || null, colorValue: null, fileUrl: null, isBlank: !val.trim() })
          }
        }
      }

      // Add selected pages as a special submission field
      fields.push({
        fieldKey: "selected_pages",
        fieldLabel: "Selected Pages",
        fieldType: "text",
        pageName: null,
        stepId: "page_selection",
        textValue: JSON.stringify(selectedPages.map((p) => ({ id: p.id, name: p.name }))),
        colorValue: null,
        fileUrl: null,
        isBlank: selectedPages.length === 0,
      })

      const res = await fetch(`/api/client/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSubmitError(err.error ?? "Submission failed. Please try again.")
        return
      }
      setSubmitted(true)
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function getFilledFields() {
    const result: { stepTitle: string; label: string; value: string | null; colorValue: string | null; fileUrl: string | null; fileName: string | null }[] = []
    for (const s of steps) {
      for (const f of s.fields) {
        if (f.type === "file" && f.multiple) {
          const files = multiFiles[f.key] ?? []
          if (files.length > 0) result.push({ stepTitle: s.title, label: f.label, value: null, colorValue: null, fileUrl: null, fileName: `${files.length} file(s): ${files.map(x => x.name).join(", ")}` })
        } else if (f.type === "file") {
          const file = fileValues[f.key]
          if (file) result.push({ stepTitle: s.title, label: f.label, value: null, colorValue: null, fileUrl: URL.createObjectURL(file), fileName: file.name })
        } else if (f.type === "color") {
          const val = colorValues[f.key] ?? ""
          if (val) result.push({ stepTitle: s.title, label: f.label, value: null, colorValue: val, fileUrl: null, fileName: null })
        } else {
          const val = textValues[f.key] ?? ""
          if (val.trim()) result.push({ stepTitle: s.title, label: f.label, value: val, colorValue: null, fileUrl: null, fileName: null })
        }
      }
    }
    return result
  }

  const totalFields = steps.reduce((acc, s) => acc + s.fields.length, 0)

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#F7F5FF" }}>
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#1BAE80" }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}>Thanks!</h1>
          <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>Your content has been submitted. Your designer will be in touch.</p>
        </div>
      </div>
    )
  }

  if (isReview) {
    const filled = getFilledFields()
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F7F5FF", fontFamily: "var(--font-body)" }}>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <p className="text-sm font-medium mb-2" style={{ color: "#4E4499" }}>{projectName}</p>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}>Review Your Submission</h1>
            <p className="text-gray-600">{filled.length} of {totalFields} fields filled in.</p>
          </div>
          <div className="space-y-2 mb-8">
            {filled.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#4E4499" }}>
                  {item.stepTitle} — {item.label}
                </p>
                {item.fileUrl ? (
                  <img src={item.fileUrl} alt={item.label} className="h-16 w-auto rounded-lg object-cover" />
                ) : item.fileName ? (
                  <p className="text-sm text-gray-600">{item.fileName}</p>
                ) : item.colorValue ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full border border-gray-200" style={{ backgroundColor: item.colorValue }} />
                    <span className="text-sm font-mono text-gray-600">{item.colorValue}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 line-clamp-2">{item.value}</p>
                )}
              </div>
            ))}
          </div>
          {submitError && <p className="text-red-600 text-sm mb-4 text-center">{submitError}</p>}
          <div className="flex gap-3">
            <button onClick={() => setIsReview(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 text-gray-700 bg-white hover:bg-gray-50 transition-colors" style={{ borderColor: "#4E4499" }}>Back to Edit</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-semibold text-white transition-colors" style={{ backgroundColor: isSubmitting ? "#9ca3af" : "#1BAE80" }}>
              {isSubmitting ? "Submitting…" : "Submit Content"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5FF", fontFamily: "var(--font-body)" }}>
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{projectName}</p>
          <p className="text-sm font-semibold" style={{ color: "#4E4499" }}>Step {currentStep + 1} of {steps.length}</p>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-1 transition-all duration-300" style={{ backgroundColor: "#1BAE80", width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#4E4499" }}>Step {currentStep + 1} of {steps.length}</p>
          <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}>{step.title}</h2>
          <p className="text-gray-500 text-sm">{step.subtitle}</p>
        </div>

        {step.id === "page_selection" ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-800 mb-1">Which pages do you need?</p>
              <p className="text-xs text-gray-400 mb-4">Select all that apply. Home is always included.</p>
              <div className="space-y-2">
                {[
                  { id: "home", name: "Home" },
                  { id: "about", name: "About Us" },
                  { id: "services", name: "Services" },
                  { id: "contact", name: "Contact" },
                  { id: "blog", name: "Blog / News" },
                  { id: "faq", name: "FAQ" },
                  { id: "gallery", name: "Gallery / Portfolio" },
                  { id: "testimonials", name: "Testimonials" },
                  { id: "pricing", name: "Pricing" },
                  { id: "booking", name: "Book / Enquire" },
                ].map((page) => {
                  const isHome = page.id === "home"
                  const isSelected = selectedPages.some((p) => p.id === page.id)
                  return (
                    <button
                      key={page.id}
                      type="button"
                      disabled={isHome}
                      onClick={() => {
                        if (isHome) return
                        setSelectedPages((prev) =>
                          isSelected ? prev.filter((p) => p.id !== page.id) : [...prev, { id: page.id, name: page.name }],
                        )
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-[#4E4499] bg-purple-50/60 text-[#4E4499]"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      } ${isHome ? "opacity-60 cursor-default" : "cursor-pointer"}`}
                    >
                      <div
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? "border-[#4E4499] bg-[#4E4499]" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{page.name}</span>
                      {isHome && <span className="text-xs text-gray-400 ml-auto">Always included</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-800 mb-1">Need a page not listed above?</p>
              <p className="text-xs text-gray-400 mb-3">Type the name and press Add.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPageInput}
                  onChange={(e) => setCustomPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const name = customPageInput.trim()
                      if (!name) return
                      const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                      if (!selectedPages.some((p) => p.id === id)) {
                        setSelectedPages((prev) => [...prev, { id, name, isCustom: true }])
                      }
                      setCustomPageInput("")
                    }
                  }}
                  placeholder="e.g. Our Team, Case Studies, Shop..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const name = customPageInput.trim()
                    if (!name) return
                    const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                    if (!selectedPages.some((p) => p.id === id)) {
                      setSelectedPages((prev) => [...prev, { id, name, isCustom: true }])
                    }
                    setCustomPageInput("")
                  }}
                  className="px-5 py-3 rounded-xl font-semibold text-white text-sm transition-colors"
                  style={{ backgroundColor: "#4E4499" }}
                >
                  Add
                </button>
              </div>
              {selectedPages.filter((p) => p.isCustom).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPages.filter((p) => p.isCustom).map((page) => (
                    <span
                      key={page.id}
                      className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      {page.name}
                      <button
                        type="button"
                        onClick={() => setSelectedPages((prev) => prev.filter((p) => p.id !== page.id))}
                        className="text-purple-400 hover:text-purple-700 transition-colors"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">
              {selectedPages.length} page{selectedPages.length !== 1 ? "s" : ""} selected — your designer will use this to build your sitemap
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {step.fields.map((field) => (
              <div key={field.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-800 mb-1">{field.label}</label>
                {field.hint && <p className="text-xs text-gray-400 mb-3">{field.hint}</p>}

                {field.type === "text" && (
                  <input type="text" value={textValues[field.key] ?? ""} onChange={(e) => handleText(field.key, e.target.value)} placeholder={field.placeholder}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all" />
                )}

                {field.type === "longtext" && (
                  <textarea value={textValues[field.key] ?? ""} onChange={(e) => handleText(field.key, e.target.value)} placeholder={field.placeholder} rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all resize-none" />
                )}

                {field.type === "color" && (
                  <div className="flex items-center gap-3">
                    <input type="color" value={colorValues[field.key] ?? "#ffffff"} onChange={(e) => handleColor(field.key, e.target.value)} className="h-12 w-12 rounded-lg border border-gray-200 cursor-pointer p-1" />
                    <input type="text" value={colorValues[field.key] ?? ""} onChange={(e) => handleColor(field.key, e.target.value)} placeholder="#000000"
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all" />
                  </div>
                )}

                {field.type === "file" && !field.multiple && (
                  <div>
                    {fileValues[field.key] ? (
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{fileValues[field.key]!.name}</p>
                          <p className="text-xs text-gray-400">{(fileValues[field.key]!.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                        <button onClick={() => handleFile(field.key, null)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => fileInputRefs.current[field.key]?.click()}
                        className="w-full rounded-xl border-2 border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 hover:border-[#4E4499] hover:bg-purple-50/30 transition-colors">
                        <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <span className="text-sm text-gray-400">Click to select file</span>
                      </button>
                    )}
                    <input ref={(el) => { fileInputRefs.current[field.key] = el }} type="file" accept={field.accept} className="hidden"
                      onChange={(e) => handleFile(field.key, e.target.files?.[0] ?? null)} />
                  </div>
                )}

                {field.type === "file" && field.multiple && (
                  <div>
                    <button onClick={() => fileInputRefs.current[field.key]?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 hover:border-[#4E4499] hover:bg-purple-50/30 transition-colors mb-3">
                      <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <span className="text-sm text-gray-400">Click to select files</span>
                      <span className="text-xs text-gray-300">PNG, JPG, SVG, GIF, WebP</span>
                    </button>
                    {(multiFiles[field.key] ?? []).map((file, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 mb-2">
                        <p className="flex-1 text-sm text-gray-700 truncate">{file.name}</p>
                        <button onClick={() => removeMultiFile(field.key, i)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <input ref={(el) => { fileInputRefs.current[field.key] = el }} type="file" accept={field.accept} multiple className="hidden"
                      onChange={(e) => handleMultiFiles(field.key, e.target.files)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep((s) => s - 1)} className="flex-1 py-3 rounded-xl font-semibold border-2 text-gray-700 bg-white hover:bg-gray-50 transition-colors" style={{ borderColor: "#4E4499" }}>Back</button>
          )}
          <button onClick={() => { if (isLastStep) { setIsReview(true) } else { setCurrentStep((s) => s + 1) } }}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-colors" style={{ backgroundColor: "#4E4499" }}>
            {isLastStep ? "Review Submission" : "Next"}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">All fields are optional — skip anything you don't have ready yet.</p>
      </div>
    </div>
  )
}
