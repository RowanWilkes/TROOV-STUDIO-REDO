"use client"

import { useState, useRef } from "react"

type SitemapPage = {
  id: string
  name: string
  path?: string
}

type FormStep = {
  title: string
  pageName: string | null
  fields: FormField[]
}

type FormField = {
  key: string
  label: string
  type: "text" | "longtext" | "file"
  multiple?: boolean
  accept?: string
  hint?: string
}

type FieldValue = string | File | null
type MultiFileValue = File[]

type Props = {
  token: string
  projectId: string
  projectName: string
  pages: SitemapPage[]
  alreadySubmitted: boolean
}

function buildSteps(pages: SitemapPage[]): FormStep[] {
  const steps: FormStep[] = []

  // Step 0 — General brand assets
  steps.push({
    title: "Brand Assets",
    pageName: null,
    fields: [
      {
        key: "brand_assets",
        label: "Brand Assets",
        type: "file",
        multiple: true,
        accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml",
        hint: "Upload logos, icons, photos, or any brand files. You can select multiple.",
      },
    ],
  })

  // One step per sitemap page
  pages.forEach((page, index) => {
    const fields: FormField[] = [
      {
        key: `${page.id}_hero_headline`,
        label: "Hero Headline",
        type: "text",
        hint: "The main headline for this page.",
      },
      {
        key: `${page.id}_hero_subheadline`,
        label: "Hero Subheadline",
        type: "text",
        hint: "A short supporting headline beneath the main one.",
      },
      {
        key: `${page.id}_hero_description`,
        label: "Hero Description",
        type: "longtext",
        hint: "A paragraph of introductory copy.",
      },
      {
        key: `${page.id}_body_copy`,
        label: "Body Copy",
        type: "longtext",
        hint: "The main body content for this page.",
      },
      {
        key: `${page.id}_cta_label`,
        label: "Call to Action Label",
        type: "text",
        hint: 'e.g. "Get Started", "Learn More", "Book a Call"',
      },
      {
        key: `${page.id}_image`,
        label: "Image Upload",
        type: "file",
        accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp",
        hint: "PNG, JPG, GIF, or WebP — max 10MB.",
      },
    ]

    // Logo on first sitemap page only
    if (index === 0) {
      fields.push({
        key: `${page.id}_logo`,
        label: "Logo Upload",
        type: "file",
        accept: "image/png,image/svg+xml",
        hint: "PNG or SVG — max 5MB.",
      })
    }

    steps.push({
      title: page.name,
      pageName: page.name,
      fields,
    })
  })

  return steps
}

export function ClientForm({ token, projectName, pages, alreadySubmitted }: Props) {
  const steps = buildSteps(pages)
  const totalContentSteps = steps.length // not counting review
  const [currentStep, setCurrentStep] = useState(0)
  const [isReview, setIsReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(alreadySubmitted)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Text values
  const [textValues, setTextValues] = useState<Record<string, string>>({})
  // Single-file values (field.key → File)
  const [fileValues, setFileValues] = useState<Record<string, File | null>>({})
  // Multiple brand asset files
  const [brandAssets, setBrandAssets] = useState<File[]>([])

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const brandAssetsRef = useRef<HTMLInputElement | null>(null)

  const step = steps[currentStep]

  function handleText(key: string, value: string) {
    setTextValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleFile(key: string, file: File | null) {
    setFileValues((prev) => ({ ...prev, [key]: file }))
  }

  function handleBrandAssets(files: FileList | null) {
    if (!files) return
    setBrandAssets((prev) => [...prev, ...Array.from(files)])
  }

  function removeBrandAsset(index: number) {
    setBrandAssets((prev) => prev.filter((_, i) => i !== index))
  }

  function removeFile(key: string) {
    setFileValues((prev) => ({ ...prev, [key]: null }))
    const input = fileInputRefs.current[key]
    if (input) input.value = ""
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch(`/api/client/${token}/upload`, {
      method: "POST",
      body: fd,
    })
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
        fieldType: "text" | "longtext" | "file"
        pageName: string | null
        textValue: string | null
        fileUrl: string | null
        isBlank: boolean
      }
      const fields: FieldPayload[] = []

      // Brand assets (multiple)
      if (brandAssets.length > 0) {
        for (let i = 0; i < brandAssets.length; i++) {
          const url = await uploadFile(brandAssets[i])
          fields.push({
            fieldKey: `brand_asset_${i}`,
            fieldLabel: "Brand Asset",
            fieldType: "file",
            pageName: null,
            textValue: null,
            fileUrl: url,
            isBlank: url === null,
          })
        }
      } else {
        fields.push({
          fieldKey: "brand_assets",
          fieldLabel: "Brand Assets",
          fieldType: "file",
          pageName: null,
          textValue: null,
          fileUrl: null,
          isBlank: true,
        })
      }

      // Page fields
      for (const step of steps.slice(1)) {
        for (const field of step.fields) {
          if (field.type === "file") {
            const file = fileValues[field.key] ?? null
            const url = file ? await uploadFile(file) : null
            fields.push({
              fieldKey: field.key,
              fieldLabel: field.label,
              fieldType: "file",
              pageName: step.pageName,
              textValue: null,
              fileUrl: url,
              isBlank: url === null,
            })
          } else {
            const val = textValues[field.key] ?? ""
            fields.push({
              fieldKey: field.key,
              fieldLabel: field.label,
              fieldType: field.type,
              pageName: step.pageName,
              textValue: val || null,
              fileUrl: null,
              isBlank: !val.trim(),
            })
          }
        }
      }

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

  // Count filled fields for the review summary
  function getFilledFields() {
    const result: {
      label: string
      pageName: string | null
      value: string | null
      fileUrl: string | null
      fileName: string | null
    }[] = []

    if (brandAssets.length > 0) {
      result.push({
        label: "Brand Assets",
        pageName: null,
        value: `${brandAssets.length} file(s)`,
        fileUrl: null,
        fileName: brandAssets.map((f) => f.name).join(", "),
      })
    }

    for (const s of steps.slice(1)) {
      for (const f of s.fields) {
        if (f.type === "file") {
          const file = fileValues[f.key]
          if (file) {
            result.push({
              label: f.label,
              pageName: s.pageName,
              value: null,
              fileUrl: URL.createObjectURL(file),
              fileName: file.name,
            })
          }
        } else {
          const val = textValues[f.key]
          if (val?.trim()) {
            result.push({ label: f.label, pageName: s.pageName, value: val, fileUrl: null, fileName: null })
          }
        }
      }
    }
    return result
  }

  const totalFilledCount = getFilledFields().length
  const totalFieldCount = steps.reduce((acc, s) => acc + s.fields.length, 0)

  // ─── Thank you screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#F7F5FF" }}>
        <div className="max-w-md text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#1BAE80" }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}>
            Thanks!
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Your content has been submitted. Your designer will be in touch.
          </p>
        </div>
      </div>
    )
  }

  // ─── Review screen ──────────────────────────────────────────────────────────
  if (isReview) {
    const filled = getFilledFields()
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F7F5FF", fontFamily: "var(--font-body)" }}>
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-sm font-medium mb-2" style={{ color: "#4E4499" }}>
              {projectName}
            </p>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}>
              Review Your Submission
            </h1>
            <p className="text-gray-600">
              {filled.length} of {totalFieldCount} fields filled in.
            </p>
          </div>

          {filled.length === 0 && (
            <div className="rounded-2xl p-8 text-center mb-6" style={{ backgroundColor: "rgba(78,68,153,0.07)" }}>
              <p className="text-gray-500">No fields filled in. You can go back and add content.</p>
            </div>
          )}

          {filled.length > 0 && (
            <div className="space-y-3 mb-8">
              {filled.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#4E4499" }}>
                        {item.pageName ? `${item.pageName} — ` : ""}{item.label}
                      </p>
                      {item.fileUrl ? (
                        <div>
                          <img
                            src={item.fileUrl}
                            alt={item.label}
                            className="h-20 w-auto rounded-lg object-cover mt-1"
                          />
                          <p className="text-xs text-gray-400 mt-1">{item.fileName}</p>
                        </div>
                      ) : item.fileName ? (
                        <p className="text-sm text-gray-700">{item.fileName}</p>
                      ) : (
                        <p className="text-sm text-gray-700 line-clamp-3">{item.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {submitError && (
            <div className="rounded-xl p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200">
              {submitError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setIsReview(false)}
              className="flex-1 py-3 rounded-xl font-semibold border-2 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#4E4499" }}
            >
              Back to Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: isSubmitting ? "#9ca3af" : "#1BAE80" }}
            >
              {isSubmitting ? "Submitting…" : "Submit Content"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Multi-step form ────────────────────────────────────────────────────────
  const isLastStep = currentStep === totalContentSteps - 1

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5FF", fontFamily: "var(--font-body)" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            {projectName}
          </p>
          <p className="text-sm font-semibold" style={{ color: "#4E4499" }}>
            Page {currentStep + 1} of {totalContentSteps}
          </p>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 transition-all duration-300"
            style={{
              backgroundColor: "#1BAE80",
              width: `${((currentStep + 1) / totalContentSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Step header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide mb-1" style={{ color: "#4E4499" }}>
            {currentStep === 0 ? "General" : `Page ${currentStep}`}
          </p>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}>
            {step.title}
          </h2>
          {currentStep === 0 && (
            <p className="text-gray-500 mt-2 text-sm">
              Upload any brand files (logos, photos, icons). Skip this step if you don&apos;t have anything yet.
            </p>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-6">
          {step.fields.map((field) => (
            <div key={field.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-800 mb-1">{field.label}</label>
              {field.hint && <p className="text-xs text-gray-400 mb-3">{field.hint}</p>}

              {field.type === "text" && (
                <input
                  type="text"
                  value={textValues[field.key] ?? ""}
                  onChange={(e) => handleText(field.key, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all"
                />
              )}

              {field.type === "longtext" && (
                <textarea
                  value={textValues[field.key] ?? ""}
                  onChange={(e) => handleText(field.key, e.target.value)}
                  rows={4}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all resize-none"
                />
              )}

              {field.type === "file" && field.multiple && (
                <div>
                  <div
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-[#4E4499] transition-colors"
                    style={{ borderColor: "#d1d5db" }}
                    onClick={() => brandAssetsRef.current?.click()}
                  >
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to select files</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, GIF, WebP</p>
                  </div>
                  <input
                    ref={brandAssetsRef}
                    type="file"
                    multiple
                    accept={field.accept}
                    className="hidden"
                    onChange={(e) => handleBrandAssets(e.target.files)}
                  />
                  {brandAssets.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {brandAssets.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-2">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-700 flex-1 truncate">{f.name}</span>
                          <button
                            onClick={() => removeBrandAsset(i)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {field.type === "file" && !field.multiple && (
                <div>
                  {fileValues[field.key] ? (
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                      <img
                        src={URL.createObjectURL(fileValues[field.key]!)}
                        alt="preview"
                        className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700 flex-1 truncate">{fileValues[field.key]!.name}</span>
                      <button
                        onClick={() => removeFile(field.key)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:border-[#4E4499] transition-colors"
                      style={{ borderColor: "#d1d5db" }}
                      onClick={() => fileInputRefs.current[field.key]?.click()}
                    >
                      <svg className="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">Click to upload</p>
                      <p className="text-xs text-gray-400 mt-0.5">{field.hint}</p>
                    </div>
                  )}
                  <input
                    ref={(el) => { fileInputRefs.current[field.key] = el }}
                    type="file"
                    accept={field.accept}
                    className="hidden"
                    onChange={(e) => handleFile(field.key, e.target.files?.[0] ?? null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex-1 py-3 rounded-xl font-semibold border-2 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#4E4499" }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (isLastStep) {
                setIsReview(true)
              } else {
                setCurrentStep((s) => s + 1)
              }
            }}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: "#4E4499" }}
          >
            {isLastStep ? "Review Submission" : "Next"}
          </button>
        </div>

        {/* Skip hint */}
        <p className="text-center text-xs text-gray-400 mt-4">
          All fields are optional — skip anything you don&apos;t have ready yet.
        </p>
      </div>
    </div>
  )
}
