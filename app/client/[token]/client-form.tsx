"use client"

import { useEffect, useMemo, useRef, useState } from "react"

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
type InspirationImage = { file: File; note: string }
type WebsiteReference = { url: string; note: string }
type PageContentFieldType = "heading" | "paragraph" | "cta" | "custom" | "image"
type PageContentField = {
  id: string
  label: string
  type: PageContentFieldType
  hint?: string
  value?: string
}
type PageContentEntry = {
  pageName: string
  fields: PageContentField[]
}
type PageContentMap = Record<string, PageContentEntry>

type ReviewItem =
  | { kind: "text"; key: string; stepTitle: string; label: string; value: string }
  | { kind: "color"; key: string; stepTitle: string; label: string; colorValue: string }
  | { kind: "file"; key: string; stepTitle: string; label: string; objectUrl: string; note?: string }
type BrandAsset = { file: File; label: string }
type LogoFile = { file: File; label: string }
type Props = {
  token: string
  projectId: string
  projectName: string
  pageContent: PageContentMap
  alreadySubmitted: boolean
  resubmitFields?: string[]
}

function buildSteps(): FormStep[] {
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
      { key: "launch_date", label: "When do you need the website live?", type: "text", placeholder: "e.g. End of May, 1 July 2026, ASAP", hint: "A rough date is fine — helps your designer plan the project." },
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
      {
        key: "brand_feeling",
        label: "How do you want people to feel when they visit your website?",
        type: "longtext",
        placeholder: 'e.g. Confident and reassured, Excited and inspired, Professional and trustworthy, Warm and welcoming',
        hint: "This helps your designer set the right tone for colours, fonts, imagery, and copy.",
      },
      { key: "font_preference", label: "Brand Voice & Font Preference", type: "text", placeholder: "e.g. Clean and modern, Bold and strong, Elegant and minimal", hint: "e.g. Clean and modern, Bold and strong — describe the feel and tone of your brand." },
      { key: "tagline", label: "Do you have a tagline or slogan?", type: "text", placeholder: 'e.g. "Powering homes across Melbourne"', hint: "A short memorable phrase for your brand — leave blank if you don't have one." },
      { key: "mission_statement", label: "What does your business stand for?", type: "longtext", placeholder: "e.g. We believe every homeowner deserves safe, reliable electrical work at a fair price.", hint: "1–2 sentences about your values or purpose." },
      { key: "style_notes", label: "Any other style notes for your designer?", type: "longtext", placeholder: "e.g. Avoid dark backgrounds. Keep it professional but friendly.", hint: "Anything else that helps set the visual direction." },
    ],
  })

  steps.push({
    id: "inspiration",
    title: "Websites & Inspiration",
    subtitle: "",
    fields: [],
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

function wantsAssetsResubmit(set: Set<string>) {
  if (set.has("logo") || set.has("brand_assets") || set.has("logo_0") || set.has("brand_asset_0")) return true
  for (const k of set) {
    if (k.startsWith("logo_") || k.startsWith("brand_asset_")) return true
  }
  return false
}

function wantsLogoField(set: Set<string>) {
  if (set.has("logo")) return true
  for (const k of set) {
    if (k.startsWith("logo_")) return true
  }
  return false
}

function wantsBrandAssetsField(set: Set<string>) {
  if (set.has("brand_assets")) return true
  for (const k of set) {
    if (k.startsWith("brand_asset_")) return true
  }
  return false
}

function wantsInspirationStepResubmit(set: Set<string>) {
  if (set.has("brands_admired") || set.has("inspiration_images")) return true
  for (const k of set) {
    if (k.startsWith("brands_admired_") || k.startsWith("inspiration_image_")) return true
  }
  return false
}

function wantsWebsitesInspirationSection(set: Set<string>) {
  if (set.has("brands_admired")) return true
  for (const k of set) {
    if (k.startsWith("brands_admired_")) return true
  }
  return false
}

function wantsScreenshotsInspirationSection(set: Set<string>) {
  if (set.has("inspiration_images")) return true
  for (const k of set) {
    if (k.startsWith("inspiration_image_")) return true
  }
  return false
}

/** Whether a submitted payload fieldKey is in scope for resubmit mode */
function resubmitAllowsFieldKey(fieldKey: string, resubmitSet: Set<string>): boolean {
  if (resubmitSet.has(fieldKey)) return true
  if (fieldKey.startsWith("logo_")) {
    return resubmitSet.has("logo") || Array.from(resubmitSet).some((k) => k.startsWith("logo_"))
  }
  if (fieldKey.startsWith("brand_asset_")) {
    return resubmitSet.has("brand_assets") || Array.from(resubmitSet).some((k) => k.startsWith("brand_asset_"))
  }
  if (fieldKey.startsWith("inspiration_image_")) {
    return resubmitSet.has("inspiration_images") || Array.from(resubmitSet).some((k) => k.startsWith("inspiration_image_"))
  }
  if (fieldKey.startsWith("inspiration_note_")) {
    const idx = fieldKey.slice("inspiration_note_".length)
    return (
      resubmitSet.has(`inspiration_image_${idx}`) ||
      resubmitSet.has("inspiration_images") ||
      Array.from(resubmitSet).some((k) => k.startsWith("inspiration_image_"))
    )
  }
  return false
}

function fieldMatchesResubmitFormField(fieldKey: string, resubmitSet: Set<string>): boolean {
  if (resubmitSet.has(fieldKey)) return true
  if (fieldKey === "logo") return wantsLogoField(resubmitSet)
  if (fieldKey === "brand_assets") return wantsBrandAssetsField(resubmitSet)
  return false
}

function fieldCardHighlightClass(isResubmit: boolean, field: FormField, resubmitSet: Set<string>) {
  if (!isResubmit) return ""
  const match =
    resubmitSet.has(field.key) ||
    (field.key === "logo" && wantsLogoField(resubmitSet)) ||
    (field.key === "brand_assets" && wantsBrandAssetsField(resubmitSet))
  return match ? "ring-2 ring-amber-300 border-amber-200" : ""
}

export function ClientForm({ token, projectId, projectName, pageContent, alreadySubmitted, resubmitFields }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isReview, setIsReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(alreadySubmitted)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [textValues, setTextValues] = useState<Record<string, string>>({})
  const [colorValues, setColorValues] = useState<Record<string, string>>({})
  const [fileValues, setFileValues] = useState<Record<string, File | null>>({})
  const [multiFiles, setMultiFiles] = useState<Record<string, File[]>>({})
  const [websiteRefs, setWebsiteRefs] = useState<WebsiteReference[]>([])
  const [newWebsiteUrl, setNewWebsiteUrl] = useState<string>("")
  const [newWebsiteNote, setNewWebsiteNote] = useState<string>("")
  const [inspirationImages, setInspirationImages] = useState<InspirationImage[]>([])
  const inspirationImagesRef = useRef<HTMLInputElement | null>(null)
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])
  const brandAssetsRef = useRef<HTMLInputElement | null>(null)
  const [logoFiles, setLogoFiles] = useState<LogoFile[]>([])
  const logoFilesRef = useRef<HTMLInputElement | null>(null)
  const [brandColourRef, setBrandColourRef] = useState<File | null>(null)
  const brandColourRefRef = useRef<HTMLInputElement | null>(null)
  const [pageContentValues, setPageContentValues] = useState<Record<string, string>>({})
  const [pageContentImageFiles, setPageContentImageFiles] = useState<Record<string, File | null>>({})
  const pageContentImageRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const resubmitSet = useMemo(() => new Set(resubmitFields ?? []), [resubmitFields])
  const isResubmit = (resubmitFields?.length ?? 0) > 0

  const pageContentSections = useMemo(() => {
    const rows = Object.values(pageContent ?? {})
    return rows
      .map((entry) => {
        const pageName = typeof entry?.pageName === "string" ? entry.pageName : "Page"
        const rawFields = Array.isArray(entry?.fields) ? entry.fields : []
        const fields = rawFields.filter((f) => {
          if (!f || typeof f.id !== "string" || typeof f.label !== "string" || typeof f.type !== "string") return false
          if (!isResubmit) return true
          return resubmitSet.has(f.id)
        })
        return { pageName, fields }
      })
      .filter((entry) => entry.fields.length > 0)
  }, [pageContent, isResubmit, resubmitSet])

  const hasPageContentStep = pageContentSections.length > 0

  const allSteps = buildSteps()
  const steps = useMemo(() => {
    const base = (() => {
      if (!isResubmit) return allSteps

      const filtered: FormStep[] = []
      for (const s of allSteps) {
        if (s.id === "inspiration") {
          if (wantsInspirationStepResubmit(resubmitSet)) filtered.push(s)
          continue
        }
        if (s.id === "assets") {
          if (!wantsAssetsResubmit(resubmitSet)) continue
          const fields = s.fields.filter((f) => fieldMatchesResubmitFormField(f.key, resubmitSet))
          if (fields.length > 0) filtered.push({ ...s, fields })
          continue
        }
        const fields = s.fields.filter((f) => resubmitSet.has(f.key))
        if (fields.length > 0) filtered.push({ ...s, fields })
      }
      return filtered
    })()
    if (!hasPageContentStep) return base
    return [
      ...base,
      {
        id: "page_content",
        title: "Page Content",
        subtitle:
          "Your designer has set up your site pages and needs specific content and images for each one. Fill in as much as you can — you can always leave fields blank.",
        fields: [],
      },
    ]
  }, [allSteps, isResubmit, resubmitSet, hasPageContentStep])

  useEffect(() => {
    if (pageContentSections.length === 0) return
    setPageContentValues((prev) => {
      const next = { ...prev }
      for (const section of pageContentSections) {
        for (const field of section.fields) {
          if (field.type === "image") continue
          if (next[field.id] == null) next[field.id] = field.value ?? ""
        }
      }
      return next
    })
  }, [pageContentSections])

  useEffect(() => {
    if (steps.length === 0) return
    setCurrentStep((s) => (s >= steps.length ? Math.max(0, steps.length - 1) : s))
  }, [steps.length])

  const reviewItems = useMemo((): ReviewItem[] => {
    if (!isReview) return []
    const out: ReviewItem[] = []
    let n = 0
    const nextKey = () => `rv-${n++}`

    for (const s of steps) {
      for (const f of s.fields) {
        if (f.type === "file" && f.key === "logo") {
          if (logoFiles.length > 0) {
            for (const lf of logoFiles) {
              out.push({
                kind: "file",
                key: nextKey(),
                stepTitle: s.title,
                label: lf.label.trim() || "Logo",
                objectUrl: URL.createObjectURL(lf.file),
              })
            }
          } else if (fileValues["logo"]) {
            out.push({
              kind: "file",
              key: nextKey(),
              stepTitle: s.title,
              label: "Logo",
              objectUrl: URL.createObjectURL(fileValues["logo"]!),
            })
          }
          continue
        }
        if (f.type === "file" && f.multiple && f.key === "brand_assets") {
          for (const a of brandAssets) {
            out.push({
              kind: "file",
              key: nextKey(),
              stepTitle: s.title,
              label: a.label.trim() || "Brand Asset",
              objectUrl: URL.createObjectURL(a.file),
            })
          }
          continue
        }
        if (f.type === "file" && f.multiple) {
          for (const file of multiFiles[f.key] ?? []) {
            out.push({
              kind: "file",
              key: nextKey(),
              stepTitle: s.title,
              label: f.label,
              objectUrl: URL.createObjectURL(file),
            })
          }
          continue
        }
        if (f.type === "file") {
          const file = fileValues[f.key]
          if (file) {
            out.push({
              kind: "file",
              key: nextKey(),
              stepTitle: s.title,
              label: f.label,
              objectUrl: URL.createObjectURL(file),
            })
          }
          continue
        }
        if (f.type === "color") {
          const val = colorValues[f.key] ?? ""
          if (val) {
            out.push({ kind: "color", key: nextKey(), stepTitle: s.title, label: f.label, colorValue: val })
          }
          continue
        }
        const val = textValues[f.key] ?? ""
        if (val.trim()) {
          out.push({ kind: "text", key: nextKey(), stepTitle: s.title, label: f.label, value: val })
        }
      }
    }

    const inspStep = steps.find((ss) => ss.id === "inspiration")
    const inspTitle = inspStep?.title ?? "Websites & Inspiration"
    if (!isResubmit || wantsScreenshotsInspirationSection(resubmitSet)) {
      for (const item of inspirationImages) {
        const noteTrim = item.note.trim()
        out.push({
          kind: "file",
          key: nextKey(),
          stepTitle: inspTitle,
          label: "Inspiration Screenshot",
          objectUrl: URL.createObjectURL(item.file),
          ...(noteTrim ? { note: item.note } : {}),
        })
      }
    }

    if (brandColourRef && (!isResubmit || resubmitSet.has("inspiration_image_colour_ref"))) {
      const styleStep = steps.find((ss) => ss.id === "style")
      out.push({
        kind: "file",
        key: nextKey(),
        stepTitle: styleStep?.title ?? "Brand & Style",
        label: "Brand Colour Reference",
        objectUrl: URL.createObjectURL(brandColourRef),
      })
    }

    for (const section of pageContentSections) {
      for (const field of section.fields) {
        if (field.type === "image") {
          const file = pageContentImageFiles[field.id]
          if (!file) continue
          out.push({
            kind: "file",
            key: nextKey(),
            stepTitle: "Page Content",
            label: `${section.pageName} — ${field.label}`,
            objectUrl: URL.createObjectURL(file),
          })
          continue
        }
        const val = pageContentValues[field.id] ?? ""
        if (!val.trim()) continue
        out.push({
          kind: "text",
          key: nextKey(),
          stepTitle: "Page Content",
          label: `${section.pageName} — ${field.label}`,
          value: val,
        })
      }
    }

    return out
  }, [
    isReview,
    isResubmit,
    resubmitSet,
    steps,
    textValues,
    colorValues,
    fileValues,
    multiFiles,
    logoFiles,
    brandAssets,
    inspirationImages,
    brandColourRef,
    pageContentSections,
    pageContentImageFiles,
    pageContentValues,
  ])

  useEffect(() => {
    const urls = reviewItems.filter((i): i is Extract<ReviewItem, { kind: "file" }> => i.kind === "file").map((i) => i.objectUrl)
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [reviewItems])

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
  function handleBrandAssets(files: FileList | null) {
    if (!files) return
    setBrandAssets((prev) => [...prev, ...Array.from(files).map((file) => ({ file, label: "" }))])
  }
  function removeBrandAsset(index: number) {
    setBrandAssets((prev) => prev.filter((_, i) => i !== index))
  }

  async function uploadFile(
    file: File,
    options?: { pageName?: string; fieldLabel?: string },
  ): Promise<string | null> {
    const fd = new FormData()
    fd.append("file", file)
    if (options?.pageName) fd.append("pageName", options.pageName)
    if (options?.fieldLabel) fd.append("fieldLabel", options.fieldLabel)
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
        fieldType: string
        pageName: string | null
        stepId: string
        textValue: string | null
        colorValue: string | null
        fileUrl: string | null
        isBlank: boolean
      }
      const fields: FieldPayload[] = []

      const wantsInspirationImages = !isResubmit || wantsScreenshotsInspirationSection(resubmitSet)
      const shouldUploadColourRef =
        (!isResubmit || resubmitSet.has("inspiration_image_colour_ref")) && Boolean(brandColourRef)
      const wantsLogoUpload = !isResubmit || wantsLogoField(resubmitSet)
      const wantsBrandAssetsUpload = !isResubmit || wantsBrandAssetsField(resubmitSet)

      const [logoUrls, brandAssetUrls, inspirationUrls, colourRefUrl] = await Promise.all([
        wantsLogoUpload && logoFiles.length > 0
          ? Promise.all(logoFiles.map((f) => uploadFile(f.file)))
          : Promise.resolve([] as (string | null)[]),
        wantsBrandAssetsUpload && brandAssets.length > 0
          ? Promise.all(brandAssets.map((a) => uploadFile(a.file)))
          : Promise.resolve([] as (string | null)[]),
        wantsInspirationImages && inspirationImages.length > 0
          ? Promise.all(inspirationImages.map((img) => uploadFile(img.file)))
          : Promise.resolve([] as (string | null)[]),
        shouldUploadColourRef && brandColourRef ? uploadFile(brandColourRef) : Promise.resolve(null as string | null),
      ])

      const otherFiles: File[] = []
      for (const s of steps) {
        for (const field of s.fields) {
          if (isResubmit) {
            if (field.type === "file" && field.multiple && field.key === "brand_assets") {
              if (!wantsBrandAssetsField(resubmitSet)) continue
            } else if (field.type === "file" && field.key === "logo") {
              if (!wantsLogoField(resubmitSet)) continue
            } else if (!resubmitSet.has(field.key)) {
              continue
            }
          }
          if (field.type === "file" && field.multiple) {
            if (field.key === "brand_assets") continue
            for (const file of multiFiles[field.key] ?? []) otherFiles.push(file)
          } else if (field.type === "file" && field.key !== "logo") {
            const file = fileValues[field.key] ?? null
            if (file) otherFiles.push(file)
          }
        }
      }
      const otherUrls =
        otherFiles.length > 0 ? await Promise.all(otherFiles.map((f) => uploadFile(f))) : []
      let otherIx = 0
      const nextOtherUrl = () => otherUrls[otherIx++]

      for (const s of steps) {
        const isPageStep = s.id.startsWith("page_")
        const pageName = isPageStep ? s.title.replace(" Page", "") : null

        for (const field of s.fields) {
          if (isResubmit) {
            if (field.type === "file" && field.multiple && field.key === "brand_assets") {
              if (!wantsBrandAssetsField(resubmitSet)) continue
            } else if (field.type === "file" && field.key === "logo") {
              if (!wantsLogoField(resubmitSet)) continue
            } else if (!resubmitSet.has(field.key)) {
              continue
            }
          }
          if (field.type === "file" && field.multiple) {
            if (field.key === "brand_assets") {
              if (brandAssets.length > 0) {
                for (let i = 0; i < brandAssets.length; i++) {
                  const asset = brandAssets[i]
                  const url = brandAssetUrls[i] ?? null
                  const fk = `brand_asset_${i}`
                  if (isResubmit && !resubmitAllowsFieldKey(fk, resubmitSet)) continue
                  fields.push({
                    fieldKey: fk,
                    fieldLabel: asset.label.trim() ? asset.label.trim() : "Brand Asset",
                    fieldType: "file",
                    pageName,
                    stepId: s.id,
                    textValue: null,
                    colorValue: null,
                    fileUrl: url,
                    isBlank: url === null,
                  })
                }
              } else if (!isResubmit || resubmitAllowsFieldKey(field.key, resubmitSet)) {
                fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: "file", pageName, stepId: s.id, textValue: null, colorValue: null, fileUrl: null, isBlank: true })
              }
            } else {
              const files = multiFiles[field.key] ?? []
              if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                  const url = nextOtherUrl()
                  const fk = `${field.key}_${i}`
                  if (isResubmit && !resubmitAllowsFieldKey(fk, resubmitSet)) continue
                  fields.push({ fieldKey: fk, fieldLabel: field.label, fieldType: "file", pageName, stepId: s.id, textValue: null, colorValue: null, fileUrl: url, isBlank: url === null })
                }
              } else if (!isResubmit || resubmitAllowsFieldKey(field.key, resubmitSet)) {
                fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: "file", pageName, stepId: s.id, textValue: null, colorValue: null, fileUrl: null, isBlank: true })
              }
            }
          } else if (field.type === "file") {
            if (field.key === "logo") {
              if (logoFiles.length > 0) {
                for (let i = 0; i < logoFiles.length; i++) {
                  const url = logoUrls[i] ?? null
                  const fk = `logo_${i}`
                  if (isResubmit && !resubmitAllowsFieldKey(fk, resubmitSet)) continue
                  fields.push({
                    fieldKey: fk,
                    fieldLabel: logoFiles[i].label.trim() ? logoFiles[i].label.trim() : "Logo",
                    fieldType: "file",
                    pageName: null,
                    textValue: null,
                    fileUrl: url,
                    isBlank: url === null,
                    stepId: "assets",
                    colorValue: null,
                  })
                }
              } else if (!isResubmit || resubmitAllowsFieldKey("logo", resubmitSet)) {
                fields.push({
                  fieldKey: "logo",
                  fieldLabel: "Logo",
                  fieldType: "file",
                  pageName: null,
                  textValue: null,
                  fileUrl: null,
                  isBlank: true,
                  stepId: "assets",
                  colorValue: null,
                })
              }
            } else {
              const file = fileValues[field.key] ?? null
              const url = file ? nextOtherUrl() : null
              fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: "file", pageName, stepId: s.id, textValue: null, colorValue: null, fileUrl: url, isBlank: url === null })
            }
          } else if (field.type === "color") {
            const val = colorValues[field.key] ?? ""
            fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: "color", pageName, stepId: s.id, textValue: null, colorValue: val || null, fileUrl: null, isBlank: !val })
          } else {
            const val = textValues[field.key] ?? ""
            fields.push({ fieldKey: field.key, fieldLabel: field.label, fieldType: field.type, pageName, stepId: s.id, textValue: val || null, colorValue: null, fileUrl: null, isBlank: !val.trim() })
          }
        }
      }

      if (shouldUploadColourRef && brandColourRef) {
        const url = colourRefUrl
        if (!isResubmit || resubmitAllowsFieldKey("inspiration_image_colour_ref", resubmitSet)) {
          fields.push({
            fieldKey: "inspiration_image_colour_ref",
            fieldLabel: "Brand Colour Reference",
            fieldType: "file",
            pageName: null,
            textValue: null,
            fileUrl: url,
            isBlank: url === null,
            stepId: "inspiration",
            colorValue: null,
          })
        }
      }

      const wantsBrandsAdmired = !isResubmit || wantsWebsitesInspirationSection(resubmitSet)
      if (wantsBrandsAdmired) {
        if (websiteRefs.length > 0) {
          for (let i = 0; i < websiteRefs.length; i++) {
            const fk = `brands_admired_${i}`
            if (isResubmit && !resubmitAllowsFieldKey(fk, resubmitSet)) continue
            const entry = websiteRefs[i]
            const hasNote = Boolean(entry.note.trim())
            fields.push({
              fieldKey: fk,
              fieldLabel: hasNote ? `${entry.url} — ${entry.note}` : entry.url,
              fieldType: "longtext",
              pageName: null,
              textValue: hasNote ? `${entry.url}\n\nDesigner notes: ${entry.note}` : entry.url,
              fileUrl: null,
              isBlank: false,
              stepId: "inspiration",
              colorValue: null,
            })
          }
        } else if (!isResubmit || resubmitAllowsFieldKey("brands_admired", resubmitSet)) {
          fields.push({
            fieldKey: "brands_admired",
            fieldLabel: "Websites or brands you admire",
            fieldType: "longtext",
            pageName: null,
            textValue: null,
            fileUrl: null,
            isBlank: true,
            stepId: "inspiration",
            colorValue: null,
          })
        }
      }

      if (wantsInspirationImages && inspirationImages.length > 0) {
        for (let i = 0; i < inspirationImages.length; i++) {
          const item = inspirationImages[i]
          const url = inspirationUrls[i] ?? null
          const fk = `inspiration_image_${i}`
          if (isResubmit && !resubmitAllowsFieldKey(fk, resubmitSet)) continue
          fields.push({
            fieldKey: fk,
            fieldLabel: "Inspiration Screenshot",
            fieldType: "file",
            pageName: null,
            textValue: null,
            fileUrl: url,
            isBlank: url === null,
            stepId: "inspiration",
            colorValue: null,
          })
          if (item.note.trim()) {
            const nk = `inspiration_note_${i}`
            if (!isResubmit || resubmitAllowsFieldKey(nk, resubmitSet)) {
              fields.push({
                fieldKey: nk,
                fieldLabel: "Inspiration Note",
                fieldType: "longtext",
                pageName: null,
                textValue: item.note,
                fileUrl: null,
                isBlank: false,
                stepId: "inspiration",
                colorValue: null,
              })
            }
          }
        }
      } else if (wantsInspirationImages && (!isResubmit || resubmitAllowsFieldKey("inspiration_images", resubmitSet))) {
        fields.push({
          fieldKey: "inspiration_images",
          fieldLabel: "Inspiration Screenshots",
          fieldType: "file",
          pageName: null,
          textValue: null,
          fileUrl: null,
          isBlank: true,
          stepId: "inspiration",
          colorValue: null,
        })
      }

      if (hasPageContentStep) {
        for (const section of pageContentSections) {
          for (const field of section.fields) {
            if (field.type === "image") {
              const file = pageContentImageFiles[field.id]
              const url = file
                ? await uploadFile(file, { pageName: section.pageName, fieldLabel: field.label })
                : null
              fields.push({
                fieldKey: field.id,
                fieldLabel: field.label,
                fieldType: "image",
                pageName: section.pageName,
                stepId: "page_content",
                textValue: null,
                colorValue: null,
                fileUrl: url,
                isBlank: url === null,
              })
            } else {
              const val = pageContentValues[field.id] ?? ""
              fields.push({
                fieldKey: field.id,
                fieldLabel: field.label,
                fieldType: field.type,
                pageName: section.pageName,
                stepId: "page_content",
                textValue: val || null,
                colorValue: null,
                fileUrl: null,
                isBlank: !val.trim(),
              })
            }
          }
        }
      }

      const res = await fetch(`/api/client/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          resubmit: resubmitFields && resubmitFields.length > 0 ? true : false,
        }),
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

  const totalFields =
    steps.reduce((acc, s) => acc + s.fields.length, 0) +
    pageContentSections.reduce((acc, section) => acc + section.fields.length, 0)

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
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F7F5FF", fontFamily: "var(--font-body)" }}>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <p className="text-sm font-medium mb-2" style={{ color: "#4E4499" }}>{projectName}</p>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}>Review Your Submission</h1>
            <p className="text-gray-600">{reviewItems.length} of {totalFields} fields filled in.</p>
          </div>
          <div className="space-y-2 mb-8">
            {reviewItems.map((item) => (
              <div key={item.key} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  {item.stepTitle} — {item.label}
                </p>
                {item.kind === "file" ? (
                  <div>
                    <img
                      src={item.objectUrl}
                      alt={item.label}
                      className="max-h-[80px] w-auto rounded-lg object-contain"
                    />
                    {item.note ? (
                      <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{item.note}</p>
                    ) : null}
                  </div>
                ) : item.kind === "color" ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: item.colorValue }} />
                    <span className="text-sm font-mono text-gray-600">{item.colorValue}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.value}</p>
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

  if (isResubmit && steps.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: "#F7F5FF", fontFamily: "var(--font-body)" }}
      >
        <p className="text-gray-600 text-center max-w-md text-sm leading-relaxed">
          No form fields match this resubmit link. Please use the link from your designer&apos;s email or ask them to send an updated one.
        </p>
      </div>
    )
  }

  const step = steps[currentStep]!
  const isLastStep = currentStep === steps.length - 1
  const showWebsitesInspiration = !isResubmit || wantsWebsitesInspirationSection(resubmitSet)
  const showScreenshotsInspiration = !isResubmit || wantsScreenshotsInspirationSection(resubmitSet)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5FF", fontFamily: "var(--font-body)" }}>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {isResubmit && resubmitFields && resubmitFields.length > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm text-amber-800">
            <strong>Your designer needs a few updates.</strong> Only the highlighted fields below need to be filled in — you can skip the rest.
          </div>
        ) : null}
      </div>
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

        {step.id === "page_content" ? (
          <div className="space-y-5">
            {pageContentSections.map((section) => (
              <div key={section.pageName} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{section.pageName}</h3>
                <div className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">{field.label}</label>
                      {field.hint ? <p className="text-xs text-gray-400">{field.hint}</p> : null}

                      {(field.type === "heading" || field.type === "cta") && (
                        <input
                          type="text"
                          value={pageContentValues[field.id] ?? ""}
                          onChange={(e) => setPageContentValues((p) => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={field.value ?? ""}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all"
                        />
                      )}

                      {field.type === "paragraph" && (
                        <textarea
                          rows={4}
                          value={pageContentValues[field.id] ?? ""}
                          onChange={(e) => setPageContentValues((p) => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={field.value ?? ""}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all resize-none"
                        />
                      )}

                      {field.type === "custom" && (
                        <textarea
                          rows={3}
                          value={pageContentValues[field.id] ?? ""}
                          onChange={(e) => setPageContentValues((p) => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={field.value ?? ""}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all resize-none"
                        />
                      )}

                      {field.type === "image" && (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => pageContentImageRefs.current[field.id]?.click()}
                            className="w-full rounded-xl border-2 border-dashed border-gray-200 py-6 flex flex-col items-center gap-2 hover:border-[#4E4499] hover:bg-purple-50/30 transition-colors"
                          >
                            <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="text-sm text-gray-500">Upload image</span>
                            <span className="text-xs text-gray-300">PNG, JPG, WebP</span>
                          </button>
                          {pageContentImageFiles[field.id] ? (
                            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5">
                              <p className="flex-1 text-sm text-gray-700 truncate">{pageContentImageFiles[field.id]!.name}</p>
                              <button
                                type="button"
                                onClick={() => setPageContentImageFiles((p) => ({ ...p, [field.id]: null }))}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : null}
                          <input
                            ref={(el) => {
                              pageContentImageRefs.current[field.id] = el
                            }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null
                              setPageContentImageFiles((p) => ({ ...p, [field.id]: file }))
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : step.id === "inspiration" ? (
          <div className="space-y-5">
            {showWebsitesInspiration ? (
              <div
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
                  isResubmit && wantsWebsitesInspirationSection(resubmitSet) ? "ring-2 ring-amber-300 border-amber-200" : ""
                }`}
              >
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Websites or brands you admire</h3>

                <div className="space-y-2 mb-5">
                  {websiteRefs.map((entry, idx) => (
                    <div
                      key={`${entry.url}-${idx}`}
                      className="relative rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 pr-10"
                    >
                      <button
                        type="button"
                        onClick={() => setWebsiteRefs((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg leading-none w-8 h-8 flex items-center justify-center"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                      <p className="text-sm font-semibold text-gray-900 break-all pr-2">{entry.url}</p>
                      {entry.note.trim() ? (
                        <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{entry.note}</p>
                      ) : null}
                    </div>
                  ))}
                </div>

                <p className="text-xs font-medium text-gray-700 mb-2">Add a website</p>
                <input
                  type="text"
                  placeholder="e.g. apple.com"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all mb-2"
                />
                <input
                  type="text"
                  placeholder="What do you like about it? (optional)"
                  value={newWebsiteNote}
                  onChange={(e) => setNewWebsiteNote(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all mb-3"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = newWebsiteUrl.trim()
                    if (!url) return
                    setWebsiteRefs((prev) => [...prev, { url, note: newWebsiteNote.trim() }])
                    setNewWebsiteUrl("")
                    setNewWebsiteNote("")
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
                  style={{ backgroundColor: "#4E4499" }}
                >
                  + Add Website
                </button>
              </div>
            ) : null}

            {showScreenshotsInspiration ? (
              <div
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
                  isResubmit && wantsScreenshotsInspirationSection(resubmitSet) ? "ring-2 ring-amber-300 border-amber-200" : ""
                }`}
              >
                <label className="block text-sm font-semibold text-gray-800 mb-1">Design inspiration screenshots</label>
                <p className="text-xs text-gray-400 mb-3">Upload screenshots of websites or designs you love. PNG, JPG — max 10MB each.</p>

                <button
                  type="button"
                  onClick={() => inspirationImagesRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 hover:border-[#4E4499] hover:bg-purple-50/30 transition-colors mb-3"
                >
                  <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className="text-sm text-gray-400">Upload screenshots</span>
                  <span className="text-xs text-gray-300">PNG, JPG, WebP</span>
                </button>

                {inspirationImages.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 mb-2">
                    <div className="flex items-center gap-3">
                      <p className="flex-1 text-sm text-gray-700 truncate">{item.file.name}</p>
                      <button
                        type="button"
                        onClick={() => setInspirationImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Notes for your designer about this image (optional)"
                      value={item.note}
                      onChange={(e) => {
                        setInspirationImages((prev) =>
                          prev.map((img, i) => (i === idx ? { ...img, note: e.target.value } : img)),
                        )
                      }}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all mt-2 bg-white"
                    />
                  </div>
                ))}

                <input
                  ref={inspirationImagesRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files
                    if (!files) return
                    setInspirationImages((prev) => [...prev, ...Array.from(files).map((file) => ({ file, note: "" }))])
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-5">
            {step.fields.map((field) => (
              <div key={field.key}>
                <div
                  className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${fieldCardHighlightClass(isResubmit, field, resubmitSet)}`}
                >
                  <label className="block text-sm font-semibold text-gray-800 mb-1">{field.label}</label>
                  {field.hint && <p className="text-xs text-gray-400 mb-3">{field.hint}</p>}

                  {field.type === "text" && (
                    field.key === "launch_date" ? (
                      <input
                        type="date"
                        value={textValues["launch_date"] ?? ""}
                        onChange={(e) => handleText("launch_date", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all"
                      />
                    ) : (
                      <input type="text" value={textValues[field.key] ?? ""} onChange={(e) => handleText(field.key, e.target.value)} placeholder={field.placeholder}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all" />
                    )
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
                      {field.key === "logo" ? (
                        <>
                        <button
                          onClick={() => logoFilesRef.current?.click()}
                          className="w-full rounded-xl border-2 border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 hover:border-[#4E4499] hover:bg-purple-50/30 transition-colors mb-3"
                        >
                          <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          <span className="text-sm text-gray-400">Click to select files</span>
                          <span className="text-xs text-gray-300">PNG, JPG, SVG</span>
                        </button>

                        {logoFiles.map((logoFile, idx) => (
                          <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 mb-2">
                            <div className="flex items-center gap-3">
                              <p className="flex-1 text-sm text-gray-700 truncate">{logoFile.file.name}</p>
                              <button
                                type="button"
                                onClick={() => setLogoFiles((prev) => prev.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder='Label this logo (e.g. "Dark background", "Light background", "Favicon")'
                              value={logoFile.label}
                              onChange={(e) => {
                                setLogoFiles((prev) => prev.map((l, i) => (i === idx ? { ...l, label: e.target.value } : l)))
                              }}
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all mt-2 bg-white"
                            />
                          </div>
                        ))}

                        <input
                          ref={logoFilesRef}
                          type="file"
                          accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files
                            if (!files) return
                            setLogoFiles((prev) => [...prev, ...Array.from(files).map((file) => ({ file, label: "" }))])
                          }}
                        />
                      </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  )}

                  {field.type === "file" && field.multiple && (
                    <div>
                      {field.key === "brand_assets" ? (
                        <>
                        <button
                          onClick={() => brandAssetsRef.current?.click()}
                          className="w-full rounded-xl border-2 border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 hover:border-[#4E4499] hover:bg-purple-50/30 transition-colors mb-3"
                        >
                          <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          <span className="text-sm text-gray-400">Click to select files</span>
                          <span className="text-xs text-gray-300">PNG, JPG, SVG, GIF, WebP</span>
                        </button>

                        {brandAssets.map((asset, idx) => (
                          <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 mb-2">
                            <div className="flex items-center gap-3">
                              <p className="flex-1 text-sm text-gray-700 truncate">{asset.file.name}</p>
                              <button type="button" onClick={() => removeBrandAsset(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder='Label this file (e.g. "Contact page photo", "Team headshot", "Product image")'
                              value={asset.label}
                              onChange={(e) => {
                                setBrandAssets((prev) => prev.map((a, i) => (i === idx ? { ...a, label: e.target.value } : a)))
                              }}
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#4E4499] focus:ring-2 focus:ring-[#4E4499]/20 transition-all mt-2 bg-white"
                            />
                          </div>
                        ))}

                        <input
                          ref={brandAssetsRef}
                          type="file"
                          accept={field.accept}
                          multiple
                          className="hidden"
                          onChange={(e) => handleBrandAssets(e.target.files)}
                        />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  )}
                </div>

                {step.id === "style" &&
                  field.key === "brand_accent_color" &&
                  (!isResubmit || resubmitSet.has("inspiration_image_colour_ref")) && (
                  <div className="mt-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100/70">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Not sure of your hex codes?</p>
                    <p className="text-xs text-gray-400 mb-3">
                      Upload your logo, business card, or any existing brand material — your designer will pull the exact colours from it.
                    </p>

                    {brandColourRef ? (
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="flex-1 text-sm text-gray-700 truncate">{brandColourRef.name}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setBrandColourRef(null)
                            if (brandColourRefRef.current) brandColourRefRef.current.value = ""
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => brandColourRefRef.current?.click()}
                        className="w-full rounded-xl border border-dashed border-gray-200 bg-white py-6 flex flex-col items-center gap-2 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <span className="text-xs text-gray-400">Upload brand material (optional)</span>
                      </button>
                    )}

                    <input
                      ref={brandColourRefRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                      multiple={false}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        setBrandColourRef(file)
                        e.target.value = ""
                      }}
                    />
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
